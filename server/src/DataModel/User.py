"""User.py - Module containing the user classes for the data model"""
from sqlalchemy import Column, String, Integer, JSON
from passlib.apps import custom_app_context as pwd_context
from itsdangerous import (TimedJSONWebSignatureSerializer as Serializer)
from .base import Base

class User(Base):
    """Data model object representing application user"""
    __tablename__ = 'User'
    __table_args__ = {'mysql_charset':'utf8'}
    user_id = Column(Integer, primary_key=True)
    username = Column(String(32), index=True, unique=True)
    password_hash = Column(String(128))
    preferences = Column(JSON)

    def hash_password(self, password):
        """Create password hash from password string"""
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        """Verify password from password string"""
        return pwd_context.verify(password, self.password_hash)

    def generate_auth_token(self, secret_key, expiration=600):
        """Generate authorization token with an expieration period"""
        ser = Serializer(secret_key, expires_in=expiration)
        return ser.dumps({'user_id': self.user_id})
