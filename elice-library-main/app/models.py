from sqlalchemy.orm import relationship

from app import db


class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    email = db.Column(db.String(128), primary_key=True)
    password = db.Column(db.String(256))
    name = db.Column(db.String(256))

    is_authenticated = True
    is_active = True

    def get_id(self):
        return self.email


class Book(db.Model):
    __tablename__ = "book"
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(256))
    publisher = db.Column(db.String(256))
    author = db.Column(db.String(256))
    published_at = db.Column(db.Date)
    page_count = db.Column(db.Integer)
    isbn = db.Column(db.String(30))
    description = db.Column(db.Text)
    rating = db.Column(db.Integer)
    stock = db.Column(db.Integer)
    image_path = db.Column(db.String(256))


class UserBookRent(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    rent_at = db.Column(db.Date)
    returned_at = db.Column(db.Date, nullable=True, default=None)

    book = relationship('Book')


class BookComment(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    content = db.Column(db.Text)

    rating = db.Column(db.Integer)
    user = relationship('User')
