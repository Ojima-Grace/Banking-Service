from flask_restx import Namespace, Resource, fields
from flask import request, jsonify
from ..models.user import User
from ..models.account import Account
from ..models.loan import Loan
from ..models.transaction import CreditTransaction
from ..utils import db
from werkzeug.security import generate_password_hash, check_password_hash
from http import HTTPStatus
from decimal import Decimal
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import json
import random

def generate_unique_account_number(account_type):
    """
    Generate a unique 10-digit account number based on the account type.
    For savings accounts, the number starts with "55", and for current accounts, it starts with "88".
    """
    while True:
        prefix = "55" if account_type == 'savings' else "88"
        account_number = f"{prefix}{random.randint(1000000000, 9999999999)}"
        # Check if the generated account number already exists in the database
        existing_account = Account.query.filter_by(account_number=account_number).first()
        if not existing_account:
            return account_number

account_namespace = Namespace('account', description='name space for banking operations')

account_creation_model = account_namespace.model(
    'AccountCreation', {
        'account_type': fields.String(required=True, description="Account Type (savings or current)"),
    }
)

account_balance_model = account_namespace.model(
    'AccountBalance', {
        'account_number': fields.String(required=True, description="Account Number"),
    }
)

account_model = account_namespace.model(
    'Account', {
        'id': fields.Integer(),
        'user_id': fields.Integer(),
        'account_type': fields.String(required=True, description="Account Type (savings or current)"),
        'account_number': fields.String(required=True, description="Account Number"),
        'balance': fields.Float(required=True, description="Account Balance"),
        'is_active': fields.Boolean(required=True, description="Account Activation Status"),
        'date_created': fields.DateTime(dt_format='iso8601'),
    }
)

loan_application_model = account_namespace.model(
    'LoanApplication', {
        'account_number': fields.String(required=True, description="Account Number where the loan will be credited"),
        'amount': fields.Float(required=True, description="Loan Amount"),
        'purpose': fields.String(required=True, description="Loan Purpose"),
    }
)

credit_transaction_model = account_namespace.model('CreditTransaction', {
    'id': fields.Integer(readonly=True, description='The transaction ID'),
    'sender_account_number': fields.String(required=True, description='The account number of the sender'),
    'receiver_account_number': fields.String(required=True, description='The account number of the receiver'),
    'amount': fields.Float(required=True, description='The amount credited'),
    'date': fields.DateTime(readonly=True, description='The date of the credit transaction'),
})

repay_loan_model = account_namespace.model('RepayLoan', {
    'loan_id': fields.Integer(required=True, description='The ID of the loan to repay'),
})

@account_namespace.route('/create_account')
class CreateAccount(Resource):
    @account_namespace.expect(account_creation_model, validate=True)
    #@account_namespace.marshal_with(account_model)
    @account_namespace.doc(
        description='Create a new account (savings or current) with an initial balance of 0 Nigerian Naira and 0 kobo'
    )
    @jwt_required()
    def post(self):
        """
        Create an Account
        """
        data = request.get_json()
        
        account_type = data['account_type']

        if account_type not in ('savings', 'current'):
            return {'message': 'Account type can only be savings or current'}, 400

        user_id = get_jwt_identity()

        existing_account = Account.query.filter_by(user_id=user_id, account_type=account_type).first()
        if existing_account:
            return {'message': f'You already have a {account_type} account'}, 400

        account_number = generate_unique_account_number(account_type)

        account = Account(
            account_number=account_number,
            account_type=account_type,
            user_id=user_id
        )
        account.save()
        db.session.commit()

        account_data = {
            'id': account.id,
            'account_number': account.account_number,
            'account_type': account.account_type,
            'balance': account.balance,
            'user_id': account.user_id
        }

        return account_data, 201

@account_namespace.route('/get_accounts')
class GetAccounts(Resource):    
    @account_namespace.marshal_list_with(account_model)
    @account_namespace.doc(
        description='Get all accounts belonging to a user'
    )
    @jwt_required()
    def get(self):
        """
        Get all accounts belonging to a user
        """
        user_id = get_jwt_identity()

        accounts = Account.query.filter_by(user_id=user_id).all()

        account_data = [{
            'id': account.id,
            'account_number': account.account_number,
            'account_type': account.account_type,
            'balance': account.balance,
            'user_id': account.user_id,
            'is_active': account.is_active,
            'date_created': account.date_created.isoformat(),
        } for account in accounts]

        return account_data, 200
    

@account_namespace.route('/apply_loan')
class ApplyLoan(Resource):
    @account_namespace.expect(loan_application_model, validate=True)
    @account_namespace.doc(
        description='Apply for a loan'
    )
    @jwt_required()
    def post(self):
        """
        Apply for a Loan
        """
        data = request.get_json()
        user_id = get_jwt_identity()

        account_number = data.get('account_number')
        amount = data.get('amount')
        purpose = data.get('purpose')

        if not account_number or not purpose:
            return {'message': 'Account number and purpose are required fields'}, 400

        if not amount or amount <= 0:
            return {'message': 'Amount must be more than 0 Naira'}, 400

        # Perform additional validation if needed for future loan applications

        account = Account.query.filter_by(user_id=user_id, account_number=account_number).first()
        if not account:
            return {'message': 'Provided account does not belong to the user'}, 400
        
        if not account.is_active:
            return {'message': 'Account is deactivated. Cannot perform transaction'}, 400

        loan = Loan(user_id=user_id, account_id=account.id, account_number=account_number, amount=amount, purpose=purpose, is_approved=True)

        loan.save()
        db.session.commit()

        account.balance += amount
        db.session.commit()

        message = f'Loan application successful. Loan amount of {amount} Naira credited to your {account.account_type} account, with account number: {account_number}. Your new balance is {account.balance} Naira'

        return {'message': message}, 201
    
@account_namespace.route('/get_all_loans')
class GetLoans(Resource):
    # @account_namespace.marshal_list_with(loan_application_model)
    @account_namespace.doc(
        description='Get all loans belonging to a user'
    )
    @jwt_required()
    def get(self):
        """
        Get all loans belonging to a user
        """
        user_id = get_jwt_identity()

        loans = Loan.query.filter_by(user_id=user_id).all()
        
        loan_data = [{
            'id': loan.id,
            'account_number': loan.account.account_number,
            'amount': loan.amount,
            'purpose': loan.purpose,
            'is_approved': loan.is_approved,
            'date_created': loan.date_created.isoformat(),
            'is_repaid': loan.is_repaid,
            'repayment_amount': loan.repayment_amount,
            'repayment_date': loan.repayment_date.isoformat() if loan.repayment_date else None
        } for loan in loans]

        return loan_data, 200

    
@account_namespace.route('/get_account_balance')
class GetAccountBalance(Resource):
    @account_namespace.expect(account_balance_model, validate=True)
    @account_namespace.doc(
        description='Get the balance of an account'
    )
    @jwt_required()
    def get(self):
        """
        Get the balance of an account
        """
        data = request.get_json()
        user_id = get_jwt_identity()

        account_number = data.get('account_number')

        if not account_number:
            return {'message': 'Account number is a required field'}, 400

        account = Account.query.filter_by(user_id=user_id, account_number=account_number).first()
        if not account:
            return {'message': 'Provided account does not belong to the user'}, 400
        
        if not account.is_active:
            return {'message': 'Account is deactivated. Cannot perform transaction'}, 400

        account_info = {
            'account_number': account.account_number,
            'account_type': account.account_type,
            'balance': account.balance
        }

        return account_info, 200

@account_namespace.route('/credit_account')
class CreditAccount(Resource):
    @account_namespace.expect(credit_transaction_model, validate=True)
    @account_namespace.doc(description='Credit another user\'s account')
    @jwt_required()
    def post(self):
        """
        Credit Account
        """
        data = request.get_json()
        user_id = get_jwt_identity()

        sender_account_number = data.get('sender_account_number')
        receiver_account_number = data.get('receiver_account_number')
        amount = data.get('amount')

        if not sender_account_number or not receiver_account_number:
            return {'message': 'Fields cannot be empty'}, 400

        amount = float(amount)  # Convert the amount to a float

        if not amount or amount <= 0:
            return {'message': 'Amount must be more than 0 Naira'}, 400

        user_account = Account.query.filter_by(user_id=user_id, account_number=sender_account_number).first()
        if not user_account:
            return {'message': 'Sender account not found'}, 404

        if not user_account.is_active:
            return {'message': 'Account is deactivated. Cannot perform credit transaction'}, 400

        receiver_account = Account.query.filter_by(account_number=receiver_account_number).first()
        if not receiver_account:
            return {'message': 'Provided receiver account number does not exist'}, 400

        if not receiver_account.is_active:
            return {'message': 'Receiver account is deactivated. Cannot perform credit transaction'}, 400

        if user_account.balance < amount:
            return {'message': 'Insufficient balance'}, 400

        receiver_account.balance += amount
        user_account.balance -= amount

        db.session.add(CreditTransaction(sender_account_number=sender_account_number, receiver_account_number=receiver_account_number, amount=amount))
        db.session.commit()

        
        sender_info = {
            'account_number': user_account.account_number,
            'account_type': user_account.account_type
        }

        receiver_info = {
            'account_number': receiver_account.account_number,
            'account_type': receiver_account.account_type
        }

        sender_user = User.query.get(user_id)
        sender_info['first_name'] = sender_user.firstname
        sender_info['last_name'] = sender_user.lastname

        receiver_user = User.query.filter_by(id=receiver_account.user_id).first()
        receiver_info['first_name'] = receiver_user.firstname
        receiver_info['last_name'] = receiver_user.lastname

        return {
            'message': f'Debit of {amount} Nigerian Naira successful. Your new balance is {user_account.balance}',
            'sent_from': sender_info,
            'received_by': receiver_info
        }, 201
    

@account_namespace.route('/repay_loan')
class RepayLoan(Resource):
    @account_namespace.expect(repay_loan_model, validate=True)
    @account_namespace.doc(description='Repay loan')
    @jwt_required()
    def post(self):
        """
        Repay Loan
        """
        data = request.get_json()
        user_id = get_jwt_identity()

        loan_id = data['loan_id']

        user_account = Account.query.filter_by(user_id=user_id).first()
        if not user_account:
            return {'message': 'User account not found'}, 404

        if not user_account.is_active:
            return {'message': 'Account is deactivated. Cannot perform loan repayment'}, 400

        loan = Loan.query.filter_by(id=loan_id, user_id=user_id, is_approved=True, is_repaid=False).first()
        if not loan:
            return {'message': 'Invalid loan ID or loan not approved for repayment'}, 400

        total_repayment_amount = loan.amount + (loan.amount * 0.10)

        if user_account.balance < total_repayment_amount:
            return {
                'message': 'Insufficient balance to repay the loan',
                'loan_id': loan_id,
                'loan_amount': loan.amount,
                'account_number': user_account.account_number,
                'account_type': user_account.account_type,
                'available_balance': user_account.balance
            }, 400

        user_account.balance -= total_repayment_amount

        loan.is_repaid = True
        loan.repayment_amount = total_repayment_amount
        loan.repayment_date = datetime.now()

        db.session.commit()

        sender_info = {
            'account_number': user_account.account_number,
            'account_type': user_account.account_type,
            'available_balance': user_account.balance
        }

        return {
            'message': f'Loan repayment of {total_repayment_amount:.2f} Nigerian Naira successful. The interest amount of {loan.amount * 0.10:.2f} Nigerian Naira has been added to the loan amount of {loan.amount:.2f} Nigerian Naira. Your new balance is {user_account.balance:.2f} Nigerian Naira ',
            'sender_info': sender_info
        }, 201


@account_namespace.route('/activate_account')
class ActivateAccount(Resource):
    @account_namespace.expect(account_balance_model, validate=True)
    @account_namespace.doc(description='Activate user\'s account')
    @jwt_required()
    def put(self):
        """
        Activate Account
        """
        user_id = get_jwt_identity()
        data = request.get_json()

        account_number = data['account_number']

        account = Account.query.filter_by(user_id=user_id, account_number=account_number).first()
        if not account:
            return{
                'message': 'Provided account does not belong to the user'
            }, 400

        # Activate the account
        account.is_active = True
        db.session.commit()

        return {'message': 'Account activated successfully'}, 200
    
@account_namespace.route('/deactivate_account')
class DeactivateAccount(Resource):
    @account_namespace.expect(account_balance_model, validate=True)
    @account_namespace.doc(description='Deactivate user\'s account')
    @jwt_required()
    def put(self):
        """
        Deactivate Account
        """
        user_id = get_jwt_identity()
        data = request.get_json()

        account_number = data['account_number']

        account = Account.query.filter_by(user_id=user_id, account_number=account_number).first()
        if not account:
            return {
                'message': 'Provided account does not belong to the user'
            }, 400

        # Deactivate the account
        account.is_active = False
        db.session.commit()

        return {'message': 'Account deactivated successfully'}, 200