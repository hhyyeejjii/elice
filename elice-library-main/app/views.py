from datetime import date

from email_validator import validate_email, EmailNotValidError
from flask import render_template, send_from_directory, request, redirect, flash
from flask_login import login_required, login_user, current_user, logout_user
from sqlalchemy import desc
from werkzeug.security import generate_password_hash, check_password_hash

from . import app, login_manager, db
from .models import User, Book, UserBookRent, BookComment


@login_manager.user_loader
def load_user(email):
    """
    유저 로딩 함수를 등록합니다. email을 구분자로 사용합니다.
    :param email:
    :return:
    """
    return User.query.filter_by(email=email).first()


@app.route("/", methods=['GET', 'POST'])
@login_required
def index():
    """
    책 리스트 및 대여 기능을 구현합니다.
    :return:
    """
    books = Book.query.all()
    if request.method == 'POST':
        book_id = request.form.get('book_id')
        if not book_id:
            flash('book_id는 필수 파라미터 입니다.')
            return render_template('index.html', books=books)
        try:
            book_id = int(book_id)
        except ValueError:
            flash('book_id는 정수여야 합니다.')
            return render_template('index.html', books=books)

        book = Book.query.filter_by(id=book_id).first()
        if book is None:
            flash('대출하려는 책을 찾을 수 없습니다.')
            return render_template('index.html', books=books)

        if book.stock == 0:
            flash('모든 책이 대출중입니다')
        else:
            rent = UserBookRent(book_id=book_id, user_id=current_user.id, rent_at=date.today())
            db.session.add(rent)
            book.stock -= 1
            db.session.commit()
            flash(f'{book.name}을 대여했습니다.')
        return redirect('/')
    return render_template('index.html', books=books)


@app.route("/sign-up", methods=['GET', 'POST'])
def sign_up():
    """
    회원가입 기능을 구현합니다.
    :return:
    """
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

        if len(password1) < 8:
            flash('password는 8자 이상이여야합니다.')
            return render_template('signup.html')

        if not any(char.isdigit() for char in password1):
            flash('숫자가 포함되어야합니다.')
            return render_template('signup.html')
        special_char = '`~!@#$%^&*()_+|\\}{[]":;\'?><,./'
        if not any(char in special_char for char in password1):
            flash('특수문자가 포함되어야합니다.')
            return render_template('signup.html')

        user = User.query.filter_by(email=email).first()
        if user:
            flash('이미 존재하는 유저입니다.')
            return render_template('signup.html')

        new_user = User(email=email, name=name,
                        password=generate_password_hash(password1, method='sha256'))
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
        rating = request.form.get('rating')
        if not rating:
            flash('평가를 입력해주세요')
            return redirect(f'/books/{book_id}')
        try:
            rating = int(rating)
        except ValueError:
            flash('평가 점수를 올바르게 입력해주세요.')
            return redirect(f'/books/{book_id}')
        book_comment = BookComment(book_id=book_id, user_id=current_user.id, content=content,
                                   rating=rating + 1)
        db.session.add(book_comment)
        comments = BookComment.query.filter_by(book_id=book.id)
        rating_sum = 0
        for comment in comments:
            rating_sum += comment.rating
        book_rating = int(rating_sum / len(comments.all()))
        book.rating = book_rating

        db.session.commit()
    comments = BookComment.query.filter_by(book_id=book.id).order_by(desc(BookComment.id))

    return render_template('book-detail.html', book=book, comments=comments)


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
        if not rent_id:
            flash('존재하지 않는 대여입니다.')
            return redirect('/books-rent')
        try:
            rent_id = int(rent_id)
        except ValueError:
            flash('올바르지 않은 대여번호입니다.')
            return redirect('/books-rent')
        user_book_rent = UserBookRent.query.filter_by(id=rent_id, user_id=current_user.id).first()
        user_book_rent.returned_at = date.today()
        book = user_book_rent.book
        book.stock += 1
        db.session.commit()
        flash(f'{book.name}을 반납했습니다.')
        return redirect('/books-rent')
    rents = UserBookRent.query.filter_by(user_id=current_user.id, returned_at=None)
    return render_template('books-return.html', book_rents=rents)


@app.route('/static/<path:path>')
def server_static(path):
    """
    static 파일들(image, css, javascript등)을 제공하는 경로입니다.
    :param path:
    :return:
    """
    return send_from_directory('static', path)
