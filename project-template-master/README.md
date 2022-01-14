# 이런게 나의 **영**화 인생캐 **일리**가
- 이런게 나의 **영**화 인생캐 **일리**가(부제 : 프로젝트 012)는  코로나 상황에 따른 간단한 심리 테스트를 통해 사용자의 성격을(MBTI를) 특정짓고, 나와 주인공의 MBTI에 따라 영화를 추천해주는 서비스입니다. 


## 프로젝트 구성 안내

* [프로젝트 기획서](https://liberating-result-6b0.notion.site/dc0dad0ff7a548539bba17ec1ae6e21a)


## 1. 프로젝트 소개

**이런게 나의 영화 인생캐 일리가(부제 : 프로젝트 012)**는  코로나 상황에 따른 간단한 심리 테스트를 통해 사용자의 성격을(MBTI를) 특정짓고, 나와 주인공의 MBTI에 따라 영화를 추천해주는 서비스입니다. 

  - 기술 스택 : python, pandas, javascript, SQLite
  - 사용된 라이브러리 : numpy, matplotlib, wordcloud, flask_login, flask_restx, react, axios, sqlalchemy, konlpy

## 2. 프로젝트 목표

 심리 테스트를 통해 나와 주인공의 MBTI에 따라 영화를 추천하는 것과 더불어, 사용자가 이미 추천 영화를 보았다면 만족도를 평가하여 사용자의 MBTI와 영화 주인공의 MBTI에 따른 작품 만족도의 상관 관계에 대해 비교 분석합니다. 사용자별 더 정확한 작품 추천 서비스를 제공하는 데에 목표를 두고 있습니다.

  - 프로젝트 아이디어 동기: 코로나 19로 인해 ott 사용자 증가(영화 콘텐츠에 대한 관심 증가), 비슷한 시기에 국내에서 mbti에 대한 관심 증폭 => 둘 사이의 상관관계를 분석하여 더 좋은 영화 추천 서비스를 만들고자 하였습니다.


## 3. 프로젝트 기능 설명

  - 코로나 19 관련 심리 테스트를 통한 유형 분석
  - 사용자와 같은 유형의 캐릭터 리스트 보여주기
  - 사용자와 같은 유형의 캐릭터가 등장한 영화 리스트 보여주기
  - 사용자와 궁합이 좋은 유형의 캐릭터 리스트 보여주기
  - 사용자와 궁합이 좋은 유형의 캐릭터가 등장한 영화 리스트 보여주기

  - 이미 본 영화에 대한 만족도 평가 기능
  - 나와 같은 유형의 다른 사용자들에게 인기있는 TOP 10 영화 확인하기
  - 나와 같은 유형의 캐릭터가 등장한 영화 중, 네이버 평점 기준 TOP 10 영화 확인하기
  - 나와 같은 유형의 캐릭터가 등장한 영화 중, 네이버 평점 기준 TOP 10 영화의 줄거리 분석하여 워드 클라우드 보여주기

## 4. 프로젝트 구성도
  - [와이어프레임/스토리보드](https://www.figma.com/file/CLv2TAimj8dCt2TMv0V7cX/Untitled?node-id=0%3A1)

## 5. 프로젝트 팀원 역할 분담
| 이름 | 담당 업무 |
| ------ | ------ |
| 김혜민 | 팀장/백엔드 개발 |
| 김승수 | 백엔드 개발 |
| 김우성 | 프론트엔드 개발 |
| 백승수 | 데이터 분석 |
| 조혜지 | 데이터 분석 |


1. 팀장

- 기획 단계: 구체적인 설계와 지표에 따른 프로젝트 제안서 작성
- 개발 단계: 팀원간의 일정 조율, 백엔드 개발
- 수정 단계: 기획, 스크럼 진행 및 기록, 코치님 피드백 반영해서 수정

2. 프론트엔드

- 기획 단계: 큰 주제에서 문제 해결 아이디어 도출, 와이어프레임 작성
- 개발 단계: 와이어프레임을 기반으로 구현, UI 디자인 완성
- 수정 단계: 코치님 피드백 반영해서 프론트 디자인 수정

3. 백엔드

- 기획 단계: 데이터셋을 확보하기 위한 데이터베이스 구축, 데이터셋 수집
- 개발 단계: 데이터 베이스 구축 및 API 활용, 웹서비스 사용자의 정보 수집 기능 구현, 데이터 분석 결과를 활용한 기능 구현
- 수정 단계: 코치님 피드백 반영해서 백엔드 설계/기능 수정

4. 데이터 분석

- 기획 단계: 데이터셋을 확보하기 위한 데이터베이스 구축, 데이터셋 수집
- 개발 단계: 데이터 전처리, 모델 구현, 데이터 가공 및 모델 정밀도 향상
- 수정 단계: 코치님 피드백 반영해서 데이터 분석 방식 수정


## 6. 버전
  - 1.0