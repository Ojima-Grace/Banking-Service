from ..utils import db
from datetime import datetime


class Account(db.Model):
    __tablename__ = 'accounts'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    account_type = db.Column(db.String(20), nullable=False)
    account_number = db.Column(db.String(10), nullable=False, unique=True)
    balance = db.Column(db.Float(), default=0.00)
    is_active = db.Column(db.Boolean(), default=True)
    date_created = db.Column(db.DateTime(), default=datetime.utcnow, nullable=False)

    loans = db.relationship('Loan', backref='account', lazy=True, cascade='all, delete-orphan')


    def __repr__(self):
        return f"<Account {self.id}>"
    
    def save(self):
        db.session.add(self)
        db.session.commit()
