from flask_restx import Resource, Namespace, fields
from models import *
from flask_login import current_user, login_required
from flask import request
import json
import random

MbtiCharacter = Namespace(
    name='MbtiCharacter',
    description="mbti에 맞는 캐릭터 API"
)

matching_fields = MbtiCharacter.model('Mbti Character', {
    'characters_info': fields.List(fields.List(fields.String, example=[18,
      "Luna Lovegood",
      "https://www.personality-database.com/profile_images/717.png?=undefined"]))
})

total_character_N_movies_fields = MbtiCharacter.model('Characters and Movies List', {
    'total_character_N_movies': fields.List(fields.List(fields.List(fields.String), example=
        {
            "character_name": "Dobby",
            "movies": [
                {
                    "id": "7",
                    "kor_title": "해리 포터와 죽음의 성물 - 1부",
                    "eng_title": "Harry Potter And The Deathly Hallows: Part 1",
                    "image_link": "https://ssl.pstatic.net/imgmovie/mdi/mit110/0679/67901_P52_160214.jpg",
                    "pub_year": "2010",
                    "director": "데이빗 예이츠",
                    "rating": "8.21",
                    "story": "덤블도어 교장의 죽음 이후, 마법부는 죽음을 먹는 자들에게 점령당하고 호그와트는 위기에 빠진다. 이에 해리와 론, 헤르미온느는 볼드모트를 물리칠 수 있는 유일한 단서이자 그의 영혼이 담긴 ‘성물’ 호크룩스를 찾기 위한 위험한 여정에 나선다. 그러나 영혼이 연결되어 있는 볼드모트와 해리. 볼드모트를 파괴하면 해리의 목숨 또한 위태로워질지 모른다! 죽느냐 죽이느냐, 이제 그 마지막 대결은 극한을 향해 치닫는데…",
                    "run_time": "146",
                    "genres": [
                        "판타지"
                    ]
                }
            ]
        }))
})

satisfaction_fields = MbtiCharacter.model('User Satisfaction for movies', {
    'satisfaction_list': fields.List(fields.List(fields.Float
    ), example = [[1, 9.8], [2, 8.5]])
})


def row2dict(row):
    dictionary = {}
    for column in row.__table__.columns:
        dictionary[column.name] = str(getattr(row, column.name))

    return dictionary


# 공통 코드를 함수화 시켜 따로 보관, mbti에 맞는 캐릭터를 출력
def ShowCharacter(mbti):
    character_list = Character.query.filter(Character.mbti == mbti).all()
    characters_info = [[ch.id, ch.name, ch.image_link] for ch in character_list]

    random_characters_info = random.sample(characters_info, 8)

    return {
        'characters_mbti': mbti,
        'character_info': random_characters_info
    }, 200


# 기본 형태 유저의 mbti가 같은 캐릭터(compatible=0), mbti궁합이 잘맞는 캐릭터(compatible=1) 출력
@MbtiCharacter.route('/<int:compatible>')
@MbtiCharacter.doc(params={'compatible': '궁합여부'})
class UserCharacter(Resource):
    @login_required
    @MbtiCharacter.response(200, 'Success', matching_fields)
    def get(self, compatible):
        global characters
        """compatible=0 일때 mbti가 같은 character 출력/compatible!=0 일때 mbti궁합이 맞는 chracter 출력"""
        user = User.query.filter(User.id == current_user.id).first()
        if compatible == 0:
            characters = ShowCharacter(user.mbti)
            return characters
        else:
            compatible_mbti = Compatibility.query.filter(Compatibility.user_mbti == user.mbti).first()
            characters = ShowCharacter(compatible_mbti.compatible_mbti)
            return characters


@MbtiCharacter.route('/movie_list')
class MovieSatisfactionList(Resource):
    @login_required
    @MbtiCharacter.expect(satisfaction_fields)
    @MbtiCharacter.response(200, 'success')
    @MbtiCharacter.response(500, 'fail')
    def post(self):
        """어떤 영화에 대해 만족도가 얼마인지 저장하기 위한 api
        예시처럼 [사용자가 평가한 영화의 id, 사용자 평점]의 리스트를 satisfaction_list의 value값으로 딕셔너리 형태로 데이터를 보내면 됩니다."""
        satisfaction_list = request.json.get('satisfaction_list')
        for satisfaction in satisfaction_list:
            isExistSatisfaction = db.session.query(Satisfaction).filter(Satisfaction.user_id == current_user.id, Satisfaction.movie_id == satisfaction[0]).first()
            if isExistSatisfaction:
                isExistSatisfaction.user_rating = satisfaction[1]
            else:
                db.session.add(Satisfaction(current_user.id, satisfaction[0], satisfaction[1]))
        db.session.commit()

        return {
            "post": "success"
        }


@MbtiCharacter.route('/movie_list/<string:mbti>')
@MbtiCharacter.doc(params={'mbti': '등장한 영화 리스트를 볼 캐릭터의 mbti'})
class MovieListWithCharacters(Resource):
    @login_required
    @MbtiCharacter.response(200, 'Success', total_character_N_movies_fields)
    @MbtiCharacter.response(500, 'fail')
    def get(self, mbti):
        global characters
        """mbti 에 해당하는 캐릭터가 등장한 영화 리스트"""
        # (캐릭터, 캐릭터의 등장 영화 리스트)의 리스트
        character_N_movie_list = []
        characters = characters[0]['character_info']
        # print(characters)
        for c in characters:
            # 영화 리스트 검색
            character = {}
            character['character_name'] = c[1] # c[1] : 캐릭터 이름
            movie_list = db.session.query(CharacterInMovie.movie_id).filter(CharacterInMovie.character_id == c[0]) # c[0] : 캐릭터 id

            movie_infos = []
            for row in movie_list:
                movie_info = db.session.query(Movie).filter(Movie.id == row.movie_id).first()
                temp_dict = {}
                temp_dict.update(row2dict(movie_info))
                genres = db.session.query(MovieGenre.genre).filter(MovieGenre.movie_id == row.movie_id).all()
                genres = [str(getattr(g, MovieGenre.genre.name)) for g in genres]
                temp_dict['genres'] = genres
                movie_infos.append(temp_dict)

            character['movies'] = movie_infos
            # print(character)
            character_N_movie_list.append(character)
            
        return {
            'total_character_N_movies': character_N_movie_list
        }