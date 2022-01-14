from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_restx import Api
from flask_cors import CORS

import config

db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()

# 애플리케이션 팩토리
# flask run으로 실행해야 함.
def create_app():
    app = Flask(__name__)
    cors = CORS(app, resources={r"*": {"origins": ["http://elice-kdt-3rd-team-12.koreacentral.cloudapp.azure.com"]}},
        supports_credentials=True,)
    app.config.from_object(config)
    login_manager.init_app(app)

    authorizations = {
        "basicAuth" : {
            "type" : "basic"
        }
    }

    api = Api(
        app,
        version='0.1',
        title="일리스 API Server",
        description="일리스 API Server",
        terms_url="/",
        authorizations=authorizations,
    )

    # ORM
    db.init_app(app)
    migrate.init_app(app, db)

    # api add
    from views.user import UserManagement
    api.add_namespace(UserManagement, '/user')
    from views.test import Test
    api.add_namespace(Test, '/test')
    from views.result import Result
    api.add_namespace(Result, '/result')
    from views.character import MbtiCharacter
    api.add_namespace(MbtiCharacter, '/character')


    # 초기 데이터 저장. 현재는 한 번 실행하여 데이터 적재되어 있음. 필요한 경우 실행.
    # from data.store_data import store_init_data
    # with app.app_context(): 
    #     db.create_all()
    #     store_init_data()

    # from data.store_movie_data import store_movie_json, store_chracter_image, set_to_default_char_image
    # with app.app_context(): 
    #     store_movie_json()
    #     store_chracter_image()
    #     set_to_default_char_image()

    return app
