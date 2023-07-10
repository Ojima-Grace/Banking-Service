from ..utils import db
from datetime import datetime

class Loan(db.Model):
    __tablename__ = 'loans'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    account_id = db.Column(db.Integer(), db.ForeignKey('accounts.id', ondelete='CASCADE'), nullable=False)
    account_number = db.Column(db.String(10), nullable=False)
    amount = db.Column(db.Float(), nullable=False)
    purpose = db.Column(db.String(255), nullable=False)
    is_approved = db.Column(db.Boolean(), default=False)  # New field to indicate loan approval status
    date_created = db.Column(db.DateTime(), default=datetime.utcnow, nullable=False)
    is_repaid = db.Column(db.Boolean, default=False)
    repayment_amount = db.Column(db.Float, default=0.0)
    repayment_date = db.Column(db.DateTime)

    def __repr__(self):
        return f"<Loan {self.id}>"
    
    def save(self):
        db.session.add(self)
        db.session.commit()