from ..utils import db
from datetime import datetime


class User(db.Model):
    __tablename__='users'
    id = db.Column(db.Integer(), primary_key=True)
    firstname = db.Column(db.String(30), nullable=False)
    lastname = db.Column(db.String(30), nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    phone_number = db.Column(db.Integer(), nullable=True)
    password_hash = db.Column(db.Text(), nullable=True)
    date_created = db.Column(db.DateTime(), default=datetime.utcnow, nullable=False)

    # Relationship with Account model
    accounts = db.relationship('Account', backref='user', lazy=True, cascade='all, delete-orphan')
    loans = db.relationship('Loan', backref='userss', lazy=True, cascade='all, delete-orphan')

    
    def __repr__(self):
        return f"<User {self.id}>"
    
    def save(self):
        db.session.add(self)
        db.session.commit()