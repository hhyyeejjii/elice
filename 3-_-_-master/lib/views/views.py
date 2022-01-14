from flask import Blueprint, json, render_template, redirect, jsonify, request, session, g, flask, send_from_directory
from dbconnect import db
from models import User
from flask_bcrypt import Bcrypt
from flask_login import login_required, login_user, current_user, logout_user
from sqlalchemy import desc
from . import app, login)manager, db
from .models import User, Book, UserBookRent, BookComment

@login_manager.user_loader
def load_user(email):
    return User.query.filter_by(email=email).first


@app.route("/", methods=['GET', 'POST'])
@login_required
def index():
    books = Book.query.all()
    if request.method == 'POST':
        book_id = request.form.get('book_id')
        if book.stock == 0:
            flash('책이 대출되었습니다')
        else:
            rent = UserBookRent(book_id=book_id, user_id=current_user.id, rent_at=date.today())
            db.session.add(rent)
            book.stock == 0
            db.session.commit()
            flash(f'{book.name}을 대여했습니다.')
        return redirect('/')
    return render_template('index.html', books=books)


@app.route("/sign-up", methods=['GET', 'POST'])
def sign_up():
    if request.method == 'POST':
        email = request.form.get('email')
        name = request.form.get('name')
        password1 = request.form.get('password1')
        password2 = request.form.get('password2')

        if not email:
            flash('Email을 입력해주세요.')
            return render_template('signup.html')
        else:
            try:
                validate_email(email)
            except EmailNotValidError:
                flash('Email 형식이 아닙니다.')
                return render_template('signup.html')

        if not name:
            flash('Name을 입력해주세요.')
            return render_template('signup.html')

        if not password1 or not password2:
            flash('패스워드를 입력해주세요.')
            return render_template('signup.html')

        if password1 != password2:
            flash('password가 일치하지 않습니다.')
            return render_template('signup.html')


        new_user = User(email=email, name=name,
                        password=generate_password_hash(password1))
        db.session.add(new_user)
        db.session.commit()
        return redirect('/sign-in')

    return render_template('signup.html')


@app.route("/sign-in", methods=['GET', 'POST'])
def sign_in():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        if not email:
            flash('Email을 입력해주세요.')
            return render_template('signin.html')
        else:
            try:
                validate_email(email)
            except EmailNotValidError:
                flash('Email 형식이 아닙니다.')
                return render_template('signin.html')

        if not password:
            flash('패스워드를 입력해주세요.')
            return render_template('signin.html')

        user = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password, password):
            flash('패스워드가 틀렸습니다.')
        else:
            login_user(user)
            return redirect('/')

    return render_template('signin.html')


@app.route("/sign-out", methods=['GET'])
@login_required
def sign_out():
    logout_user()
    return redirect('/')


@app.route("/books/<int:book_id>", methods=['GET', 'POST'])
@login_required
def book_detail(book_id):
    book = Book.query.filter_by(id=book_id).first()
    if book is None:
        flash('책을 찾을 수 없습니다.')
        return redirect('/')
    if request.method == 'POST':
        content = request.form.get('content')
        if not content:
            flash('내용을 입력해주세요')
            return redirect(f'/books/{book_id}')
        
        book.rating = book_rating

        db.session.commit()


@app.route("/books-rent")
@login_required
def book_rent():
    rents = UserBookRent.query.filter_by(user_id=current_user.id)
    return render_template('books-rent.html', book_rents=rents)


@app.route("/books-return", methods=['GET', 'POST'])
@login_required
def book_return():
    if request.method == 'POST':
        rent_id = request.form.get('rent_id')
        flash(f'{book.name}을 반납했습니다.')
        return redirect('/books-rent')
    rents = UserBookRent.query.filter_by(user_id=current_user.id, returned_at=None)
    return render_template('books-return.html', book_rents=rents)


@app.route('/static/<path:path>')
def server_static(path):
    return send_from_directory('static', path)


library = Blueprint('library',__name__)
bcrypt = Bcrypt()
