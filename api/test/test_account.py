import unittest
from unittest.mock import patch
from flask import url_for
from .. import create_app
from ..config.config import config_dict
from ..utils import db
from werkzeug.security import generate_password_hash
from ..models.account import Account
from ..models.user import User
from ..models.loan import Loan
from http import HTTPStatus
from datetime import datetime
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, unset_jwt_cookies
import json

def serialize_user(user):
        return {
            'id': user.id,
            'firstname': user.firstname,
            'lastname': user.lastname,
            'phone_number': user.phone_number,
            'email': user.email
        }

class UserTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(config=config_dict['test'])
        self.appctx = self.app.app_context()
        self.appctx.push()
        self.client = self.app.test_client()
        self.app.config['SERVER_NAME'] = 'localhost:5000'  # Set the SERVER_NAME configuration
        db.create_all()

    def tearDown(self):
        db.drop_all()

        self.appctx.pop()
        self.app = None
        self.client = None

    def test_create_account(self):
        test_user = User(firstname='testuser', lastname='testuser', email='testuser@gmail.com')
        db.session.add(test_user)
        db.session.commit()

        data = {
            "account_type": "savings"
        }

        access_token = create_access_token(identity=test_user.id)

        headers = {
            'Authorization': f'Bearer {access_token}'
        }

        response = self.client.post('/account/create_account', json=data, headers=headers)
        response_data = response.get_json()

        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(response_data)
        self.assertIn("account_number", response_data)
        self.assertEqual(response_data["account_type"], "savings")
        self.assertEqual(response_data["balance"], 0.0)
        self.assertEqual(response_data["user_id"], test_user.id)

    def test_get_accounts(self):
         test_user = User(firstname='testuser', lastname='testuser', email='testuser@gmail.com')
         db.session.add(test_user)
         db.session.commit()

         account1 = Account(account_number='5534567890', account_type='savings', balance=100.0, user_id=test_user.id, is_active=True)
         account2 = Account(account_number='8887654321', account_type='current', balance=200.0, user_id=test_user.id, is_active=True)
         db.session.add(account1)
         db.session.add(account2)
         db.session.commit()

         access_token = create_access_token(identity=test_user.id)

         headers = {
              'Authorization': f'Bearer {access_token}'
         }

         response = self.client.get('/account/get_accounts', headers=headers)
         response_data = response.get_json()

         self.assertEqual(response.status_code, 200)
         self.assertIsInstance(response_data, list)
         self.assertEqual(len(response_data), 2)

         account1 = response_data[0]
         account2 = response_data[1]

         self.assertEqual(account1['account_number'], '5534567890')
         self.assertEqual(account1['account_type'], 'savings')
         self.assertEqual(account1['balance'], 100.0)
         self.assertEqual(account1['user_id'], test_user.id)
         self.assertTrue(account1['is_active'])
         self.assertIn('date_created', account1)

         self.assertEqual(account2['account_number'], '8887654321')
         self.assertEqual(account2['account_type'], 'current')
         self.assertEqual(account2['balance'], 200.0)
         self.assertEqual(account2['user_id'], test_user.id)
         self.assertTrue(account2['is_active'])
         self.assertIn('date_created', account2)


    def test_apply_loan(self):
         test_user = User(firstname='testuser', lastname='testuser', email='testuser@gmail.com')
         db.session.add(test_user)
         db.session.commit()

         account = Account(
              user_id=test_user.id,
              account_type='savings',
              account_number='5534567890',
              balance=0.0,
              is_active=True
         )
         db.session.add(account)
         db.session.commit()

         data = {
              "account_number": account.account_number,
              "amount": 500.0,
              "purpose": "Home renovation"
         }

         access_token = create_access_token(identity=test_user.id)

         headers = {
              'Authorization': f'Bearer {access_token}'
         }

         response = self.client.post('/account/apply_loan', json=data, headers=headers)
         response_data = response.get_json()

         self.assertEqual(response.status_code, 201)
         self.assertIsNotNone(response_data)

    def test_get_all_loans(self):
         test_user = User(firstname='testuser', lastname='testuser', email='testuser@gmail.com')
         db.session.add(test_user)
         db.session.commit()

         account = Account(
              user_id=test_user.id,
              account_type='savings',
              account_number='5534567890',
              balance=0.0,
              is_active=True
         )
         db.session.add(account)
         db.session.commit()

         loan1 = Loan(
              user_id=test_user.id,
              account_id=account.id,
              account_number=account.account_number,
              amount=1000.0,
              purpose='Home renovation',
              is_approved=True,
              is_repaid=False
         )
         loan2 = Loan(
              user_id=test_user.id,
              account_id=account.id,
              account_number=account.account_number,
              amount=2000.0,
              purpose='Education',
              is_approved=True,
              is_repaid=True,
              repayment_amount=2200.0,
              repayment_date=datetime.now()
         )
         db.session.add(loan1)
         db.session.add(loan2)
         db.session.commit()

         access_token = create_access_token(identity=test_user.id)

         headers = {
              'Authorization': f'Bearer {access_token}'
         }

         response = self.client.get('/account/get_all_loans', headers=headers)
         response_data = response.get_json()

         self.assertEqual(response.status_code, 200)
         self.assertIsNotNone(response_data)
         self.assertEqual(len(response_data), 2)

    def test_credit_account(self):
        sender_user = User(firstname='sender', lastname='user', email='sender@example.com')
        receiver_user = User(firstname='receiver', lastname='user', email='receiver@example.com')
        db.session.add_all([sender_user, receiver_user])
        db.session.commit()

        sender_account = Account(user_id=sender_user.id, account_number='1234567890', account_type='savings', balance=1000.0, is_active=True)
        receiver_account = Account(user_id=receiver_user.id, account_number='9876543210', account_type='current', balance=0.0, is_active=True)
        db.session.add_all([sender_account, receiver_account])
        db.session.commit()

        data = {
            'sender_account_number': sender_account.account_number,
            'receiver_account_number': receiver_account.account_number,
            'amount': 500.0
        }

        access_token = create_access_token(identity=sender_user.id)

        headers = {
            'Authorization': f'Bearer {access_token}'
        }

        response = self.client.post('/account/credit_account', json=data, headers=headers)
        response_data = response.get_json()

        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(response_data)
        self.assertEqual(response_data['message'], f'Debit of 500.0 Nigerian Naira successful. Your new balance is 500.0')

        sent_from = response_data['sent_from']
        received_by = response_data['received_by']

        self.assertEqual(sent_from['account_number'], sender_account.account_number)
        self.assertEqual(sent_from['account_type'], sender_account.account_type)
        self.assertEqual(sent_from['first_name'], sender_user.firstname)
        self.assertEqual(sent_from['last_name'], sender_user.lastname)

        self.assertEqual(received_by['account_number'], receiver_account.account_number)
        self.assertEqual(received_by['account_type'], receiver_account.account_type)
        self.assertEqual(received_by['first_name'], receiver_user.firstname)
        self.assertEqual(received_by['last_name'], receiver_user.lastname)

        sender_account = Account.query.get(sender_account.id)
        receiver_account = Account.query.get(receiver_account.id)
        self.assertEqual(sender_account.balance, 500.0)
        self.assertEqual(receiver_account.balance, 500.0)

    def test_repay_loan(self):
        test_user = User(firstname='testuser', lastname='testuser', email='testuser@gmail.com')
        db.session.add(test_user)
        db.session.commit()

        account = Account(user_id=test_user.id, account_number='1234567890', account_type='savings', balance=1000.0, is_active=True)
        db.session.add(account)
        db.session.commit()

        loan = Loan(user_id=test_user.id, account_id=account.id, account_number=account.account_number, amount=500.0, purpose='Home renovation', is_approved=True)
        db.session.add(loan)
        db.session.commit()

        data = {
            'loan_id': loan.id
        }

        access_token = create_access_token(identity=test_user.id)

        headers = {
            'Authorization': f'Bearer {access_token}'
        }

        response = self.client.post('/account/repay_loan', json=data, headers=headers)
        response_data = response.get_json()

        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(response_data)
        
        sender_info = response_data['sender_info']
        self.assertEqual(sender_info['account_number'], account.account_number)
        self.assertEqual(sender_info['account_type'], account.account_type)
        self.assertEqual(sender_info['available_balance'], 450.0)

        loan = Loan.query.get(loan.id)
        account = Account.query.get(account.id)
        self.assertTrue(loan.is_repaid)
        self.assertEqual(loan.repayment_amount, 550.0)
        self.assertIsNotNone(loan.repayment_date)
        self.assertEqual(account.balance, 450.0)

    def test_get_account_balance(self):
        test_user = User(firstname='testuser', lastname='testuser', email='testuser@gmail.com')
        db.session.add(test_user)
        db.session.commit()

        account = Account(
            user_id=test_user.id,
            account_type='savings',
            account_number='5534567890',
            balance=1000.0,
            is_active=True
        )
        db.session.add(account)
        db.session.commit()

        data = {
            "account_number": account.account_number
        }

        access_token = create_access_token(identity=test_user.id)

        headers = {
            'Authorization': f'Bearer {access_token}'
        }

        response = self.client.get('/account/get_account_balance', json=data, headers=headers)
        response_data = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response_data)
        self.assertEqual(response_data['account_number'], account.account_number)
        self.assertEqual(response_data['account_type'], account.account_type)
        self.assertEqual(response_data['balance'], account.balance)

    
    def test_activate_account(self):
        test_user = User(firstname='testuser', lastname='testuser', email='testuser@gmail.com')
        db.session.add(test_user)
        db.session.commit()

        account = Account(user_id=test_user.id, account_number='1234567890', account_type='savings', balance=0.0, is_active=False)
        db.session.add(account)
        db.session.commit()

        data = {
            'account_number': account.account_number
        }

        access_token = create_access_token(identity=test_user.id)

        headers = {
            'Authorization': f'Bearer {access_token}'
        }

        response = self.client.put('/account/activate_account', json=data, headers=headers)
        response_data = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response_data)
        self.assertEqual(response_data['message'], 'Account activated successfully')

        account = Account.query.get(account.id)
        self.assertTrue(account.is_active)


    def test_deactivate_account(self):
        test_user = User(firstname='testuser', lastname='testuser', email='testuser@gmail.com')
        db.session.add(test_user)
        db.session.commit()

        account = Account(user_id=test_user.id, account_number='1234567890', account_type='savings', balance=0.0, is_active=True)
        db.session.add(account)
        db.session.commit()

        data = {
            'account_number': account.account_number
        }

        access_token = create_access_token(identity=test_user.id)

        headers = {
            'Authorization': f'Bearer {access_token}'
        }

        response = self.client.put('/account/deactivate_account', json=data, headers=headers)
        response_data = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response_data)
        self.assertEqual(response_data['message'], 'Account deactivated successfully')

        account = Account.query.get(account.id)
        self.assertFalse(account.is_active)
