import csv
from datetime import date, datetime

from app import db
from app.models import Book

session = db.session

with open('library.csv', 'r') as f:
    reader = csv.DictReader(f)

    for row in reader:
        published_at = row['publication_date']
        image_path = f"/static/image/{row['id']}"
        try:
            open(f'app/{image_path}.png')
            image_path += '.png'
        except:
            image_path += '.jpg'

        published_at = datetime.strptime(published_at, '%Y-%m-%d').date()
        book = Book(
            id=int(row['id']), name=row['book_name'], publisher=row['publisher'],
            author=row['author'], published_at=published_at, page_count=int(row['pages']),
            isbn=row['isbn'], description=row['description'], image_path=image_path,
            stock=5, rating=0,
        )
        db.session.add(book)
    db.session.commit()
