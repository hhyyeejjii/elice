import pymysql
from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    app.config.from_object(config) 

    db.init_app(app)
    Migrate().init_app(app, db)

    from views import main_view
    from models import models
    app.register_blueprint(main_view.bp) 

    app.secret_key = "WcGQw7yIYhBzr1OGaVo6iHDFCXQGH3va"
    app.config['SESSION_TYPE'] = 'filesystem'
    return app

if __name__ == "__main__":
    create_app().run(debug=True)

app = Flask(__name__)
app.register_blueprint(library)

    

if __name__ == '__main__':
     app.run('0.0.0.0', port = '30000', debug=True )