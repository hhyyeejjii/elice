# 도서관 대출 서비스
Flask와 JQuery, tailwind CSS, MySQL을 이용하여 만든 도서관 샘플 프로젝트입니다.  


## 설치 방법

.env.example을 복사해서 .env 파일을 만듭니다.

### pip를 사용하는 방법
```shell
pip install -r requirements.txt
```

### Poetry를 사용하는 방법
파이썬 패키지 관리 도구 [Poetry](https://python-poetry.org/) 를 사용하는 방법입니다.
```shell
poetry install
```

### 데이터베이스 설정

MySQL을 사용합니다. 아래 설정대로 설정합니다.

user: kdt  
password: kdt_password  
database: library  
#### Docker를 사용해서 데이터베이스를 설정하는 방법
리눅스 컨테이너 관리 도구 [Docker](https://www.docker.com/products/docker-desktop) 를 사용하여 설치하는 방법입니다.

```shell
docker-compose up
```

## 실행 방법

### 데이터베이스 스키마 설정
빈 데이터 베이스에 테이블을 생성합니다.
```shell
python migration.py
```

### 초기 데이터 로딩
사전에 준비해둔 데이터를 채웁니다
```shell
python load_data.py
```

### 서버 실행
서버를 실행시킵니다.
```shell
python main.py
```

### 같이 보면 좋은 라이브러리
- [marshmallow](https://marshmallow.readthedocs.io/en/stable/quickstart.html) 사용자 입력 검증
- [PyMySQL](https://pypi.org/project/PyMySQL/) 순수 파이썬으로 구현된 MySQL connector
- [Alembic](https://alembic.sqlalchemy.org/en/latest/) SQLAlchemy 스키마 관리
- [Django](https://docs.djangoproject.com/ko/3.1/intro/) Python Full Stack Web Framework

---
본 프로젝트에서 제공하는 모든 코드 등의는 저작권법에 의해 보호받는 ㈜엘리스의 자산이며, 무단 사용 및 도용, 복제 및 배포를 금합니다.
Copyright 2021 엘리스 Inc. All rights reserved.
