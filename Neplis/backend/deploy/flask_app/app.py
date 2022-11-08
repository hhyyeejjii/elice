from random import sample
from flask import Flask, make_response, jsonify, request, redirect, render_template
import requests
import json
import os

from module.mqopen import get_channel
from config import SP_CID, SP_SECRETE, YOUTUBE_KEY1, YOUTUBE_KEY2
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

import sqlite3
dbpath = 'db.db'

# 음악검색api설정
client_credentials_manager = SpotifyClientCredentials(client_id=SP_CID, client_secret=SP_SECRETE)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

server = Flask(__name__)

queue_name = 'mqt01'
connection ,channel = get_channel(queue_name)
connection.close()

def send_to_mq(musicid, title, musician, work_type, queue_name):
    body = {'musicid':musicid,'title':title, 'musician':musician, 'work_type':work_type }
    connection, channel = get_channel(queue_name)
    channel.basic_publish(exchange='',routing_key=queue_name,body=json.dumps(body))
    connection.close()


@server.route('/login-page', methods=['GET', 'POST'])
def logtest():
    return render_template('/index.html')

@server.route('/db', methods=['GET', 'POST'])
def dbtest():
    userid = "23123"
    token = "qweqweqqw"
    with sqlite3.connect(dbpath,check_same_thread=False) as conn:
        c = conn.cursor()
        c.execute(f"insert into users values ('{userid}','{token}');")
        conn.commit()
        c.close()
    return "OK"

@server.route('/hi', methods=['GET', 'POST'])
def hello_world():
    if request.method == 'GET':
        return 'The model is up and running. Send a POST request'


@server.route('/oauth', methods=['GET', 'POST'])
def oauth():
    authinfo = request.form['authinfo']
    userinfo = request.form['userinfo']
    authinfo = json.loads(authinfo)
    userinfo = json.loads(userinfo)
    userid = userinfo['id']
    access_token = authinfo['access_token']
    playlist = []

    # 기존회원인지 확인
    with sqlite3.connect(dbpath,check_same_thread=False) as conn :
        c = conn.cursor()
        c.execute(f"select * from users where userid='{userid}';")
        dbdata = c.fetchall()
        c.close()
    #기존회원이라면
    if len(dbdata) > 0:
        #토큰 업데이트
        with sqlite3.connect(dbpath,check_same_thread=False) as conn :
            c = conn.cursor()
            c.execute(f"update users set token ='{access_token}' where userid='{userid}';")
            conn.commit()
            c.close()
        #기존 플레이리스트 가져오기
        with sqlite3.connect(dbpath,check_same_thread=False) as conn :
            c = conn.cursor()
            c.execute(f"select playlist from users where userid='{userid}';")
            listdata = c.fetchall()
            c.close()
        listdata = listdata[0][0]
        listdata = listdata.split('-')
        for x in listdata:
            with sqlite3.connect(dbpath,check_same_thread=False) as conn :
                c = conn.cursor()
                c.execute(f"select * from music where musicid={x};")
                musicdata = c.fetchall()
                c.close()
            musicdata = musicdata[0]
            lyrics = musicdata[3]
            lyrics = lyrics.split('\n')
            musicInfo = {
                    'musicid':musicdata[0],
                    'state' : musicdata[5],
                    'lyrics' : lyrics,
                    'category' : musicdata[4],
                    'audio': musicdata[6],
                    'albumImage':musicdata[7]
                }
            playlist.append(musicInfo)
    #신규회원이라면
    else:
        with sqlite3.connect(dbpath,check_same_thread=False) as conn :
            c = conn.cursor()
            c.execute(f"insert into users (userid, token) values ('{userid}', '{access_token}');")
            conn.commit()
            c.close()
        
    data = {
        # 'access_token': access_token,
        'access_token': userid,
        'playlist' : playlist
    }
    api_res = jsonify(data)
    api_res.headers['Access-Control-Allow-Origin'] = '*'
    return api_res


@server.route('/find', methods=['POST'])
def find():
    keyword = request.form['keyword']
    result = sp.search(keyword, limit=6)

    slist = []
    try:
        for i in range(6):
            ele = {
                'title' : result['tracks']['items'][i]['name'],
                'albumImage' : result['tracks']['items'][i]['album']['images'][1]['url'],
                'musician' : result['tracks']['items'][i]['artists'][0]['name'],
                'audio' : result['tracks']['items'][i]['preview_url']
            }
            slist.append(ele)
    except:
        pass
    data = { 'searchlist': slist }
    api_res = jsonify(data)
    api_res.headers['Access-Control-Allow-Origin'] = '*'
    return api_res


@server.route('/add-music', methods=['POST'])
def add_music():
    userid = request.form['Authorization']
    # access_token = request.form['Authorization']
    # with sqlite3.connect(dbpath,check_same_thread=False) as conn:
    #     c = conn.cursor()
    #     c.execute(f"select userid from users where token='{access_token}';")
    #     dbdata = c.fetchall()
    #     userid = dbdata[0][0]
    #     c.close()
    title = request.form['title']
    dbtitle = title.replace("'","''")
    musician = request.form['musician']
    dbmusician = musician.replace("'","''")
    albumImage = request.form['albumImage']

    
    # 제목과 가수로 db조회
    conn = sqlite3.connect("db.db")
    c = conn.cursor()
    c.execute(f"select * from music where title='{dbtitle}' and musician='{dbmusician}'")
    dbdata = c.fetchall()
    # 있는 음악일 경우
    if len(dbdata) > 0:
        musicid = dbdata[0][0]
        state = dbdata[0][5]
        lyrics = dbdata[0][3]
        category = dbdata[0][4]
        vedio = dbdata[0][6]
        c.close()
        lyriclist = lyrics.split('\n')
        musicInfo = {
            'musicid':musicid,
            'state' : state,
            'lyrics' : lyriclist,
            'category' : category,
            'audio' : vedio
        }
        #이전 분석때 에러났을경우 재분석
        if state != 2:
            send_to_mq(musicid, title, musician, 'analysis',  'mqt01')
    # 신규음악의 경우
    else:
        #audio youtube 링크 가져오기
        url = f'https://www.googleapis.com/youtube/v3/search?part=snippet&q={title}+{musician}5&key={YOUTUBE_KEY2}'
        res = requests.get(url).json()
        vid = res['items'][0]['id']['videoId']
        vedio = "https://youtu.be/"+vid

        # 가사 가져오기
        url = 'http://3.36.251.36:5000/api/lyric'
        datas = {
            'title':title,
            'musician':musician
        }
        res = requests.post(url, data=datas)
        lyrics = res.text.split('\n')
        lyriclist = []
        for x in lyrics:
            if '[' in x or ']' in x or x=='':
                continue
            else:
                x=x.replace("'","''")
                x=x.replace('"','')
                lyriclist.append(x)
        lyricStr = '\n'.join(lyriclist)
        
        #음악db 추가
        c = conn.cursor()
        c.execute(f"insert into music (title, musician, lyrics, state, albumImage, audio ) values ('{dbtitle}', '{dbmusician}', '{lyricStr}', 1, '{albumImage}', '{vedio}');")
        conn.commit()
        c.close()

        #추가한 musicid 가져오기
        c = conn.cursor()
        c.execute(f"select musicid from music where title='{dbtitle}' and musician='{dbmusician}'")
        musicdata = c.fetchall()
        musicid = musicdata[0][0]
        c.close()

        # 분석위해 mq전송
        send_to_mq(musicid, title, musician, 'analysis',  'mqt01')
        musicInfo = {
            'musicid':musicid,
            'state' : 1,
            'lyrics' : lyriclist,
            'category' : '',
            'audio' : vedio
        }
    #playlist에 추가
    c = conn.cursor()
    c.execute(f"select playlist from users where userid='{userid}'; ")
    oldlist = c.fetchall()
    if len(oldlist) > 0:
        oldlist = oldlist[0][0]
    else:
        oldlist = ""
    oldlist+="-"+str(musicid)
    c.close()
    
    c = conn.cursor()
    c.execute(f"update users set playlist='{oldlist}' where userid='{userid}';")
    conn.commit()
    conn.close()

    data = { 'musicInfo' : musicInfo }
    api_res = jsonify(data)
    api_res.headers['Access-Control-Allow-Origin'] = '*'
    return api_res


@server.route('/analysis/<idx>', methods=['GET', 'POST'])
def analysis(idx):
    conn = sqlite3.connect("db.db")	
    c = conn.cursor()
    c.execute(f"select state, category from music where musicid='{idx}'")
    dbdata = c.fetchall()
    data = {'state' : dbdata[0][0] }
    if dbdata[0][0] == 2:
        data['category'] = dbdata[0][1]
    api_res = jsonify(data)
    api_res.headers['Access-Control-Allow-Origin'] = '*'
    return api_res


@server.route('/save-room', methods=['POST'])
def save_room():
    usreid = request.form['Authorization']
    elements = request.form.getlist('elements')
    eleStr = '-'.join(elements)
    with sqlite3.connect(dbpath,check_same_thread=False) as conn :
        c = conn.cursor()
        c.execute(f"insert into room (userid, position) values ('{usreid}','{eleStr}');")
        conn.commit()
        c.close()
    data = {'saved' : "yes" }
    api_res = jsonify(data)
    api_res.headers['Access-Control-Allow-Origin'] = '*'
    return api_res
