from sqlalchemy.orm import relationship

from app import db


class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    username = db.Column(db.String(150),unique=True, nullabble=False)
    password = db.Column(db.String(150),unique=True, nullabble=False)
    email = db.Column(db.String(130), primary_key=True, unique=True, nullable=False)

    is_authenticated = True
    is_active = True

    def get_id(self):
        return self.email


