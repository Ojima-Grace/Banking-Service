from ..utils import db
from datetime import datetime

class CreditTransaction(db.Model):
    __tablename__ = 'credit_transactions'
    id = db.Column(db.Integer(), primary_key=True)
    sender_account_number = db.Column(db.String(12), nullable=False)
    receiver_account_number = db.Column(db.String(12), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<CreditTransaction {self.id}>"