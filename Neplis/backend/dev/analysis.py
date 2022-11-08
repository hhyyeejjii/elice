import asyncio
import json
import sqlite3
import time

from module.mqopen import get_channel
from collections import deque

from pororo import Pororo
import pandas as pd

queue_name = 'mqt01'
connetion, channel = get_channel(queue_name)
acceptable_count = 1

import lyricsgenius
genius = lyricsgenius.Genius('kyRAMuvMjj_YFz4u_XFhy8SIQEJ9IYUm0anFfZNFRMKi6XE3C-i-pyM7vBKdml4y')

emolist = ["Joy", "trust" ,"fear", "surprise", "sadness", "disgust", "anger", "anticipation"]
zsl = Pororo(task="zero-topic")

#set queue reset
def mqReset():
    while True:
        method_frame, header_frame, body = channel.basic_get(queue_name)
        if method_frame:
            print('버리는중...  delivery_tag:',method_frame.delivery_tag)
            channel.basic_ack(method_frame.delivery_tag)
        else:
            print('초기화완료')
            break
mqReset()
working_tasks = dict()  # id: task고유코드
waiting_tasks = deque()

def trans(data):
    start_t = time.time()
    task_id = data['musicid']
    title = data['title']
    musician = data['musician']
    print(title, musician)
    print(f'## 작업시작 id:{task_id} ')
    
    try:
        song = genius.search_song(title, musician)
        tmp = song.lyrics.split('\n')
        lyriclist = []
        for x in tmp:
            if '[' in x or ']' in x or x=='':
                continue
            else:
                lyriclist.append(x)
        lyricStr = '\n'.join(lyriclist)
        conn = sqlite3.connect("db.db")
        c=conn.cursor()
        c.execute(f"UPDATE music SET lyrics='{lyricStr}',status={1} WHERE id ='{task_id}'")
        conn.commit()
        c.close()
        conn.close()
        print('get lyrics and update db')
        #가사분석
        print('start analysis')
        memo = []
        for i in lyriclist:
            for j in range(0, len(lyriclist)):
                memo.append(zsl(lyriclist[i][j],emolist))
        memo = pd.DataFrame(memo)
        b = pd.concat([lyriclist, memo],axis= 1)
        bb = b.mean()
        bmood = bb.idxmax()

        conn = sqlite3.connect("db.db")
        c=conn.cursor()
        c.execute(f"UPDATE music SET category='{bmood}',status={2} WHERE id ='{task_id}'")
        conn.commit()
        c.close()
        conn.close()
        print('finish analysis db update')
    except Exception as e:
        print('error',e)
        #Task.objects.filter(id=id).update(status=ERROR)
    end = time.time() - start_t
    print(f'{end:.2f} sec')


async def doWork(data):
    task_id = data['musicid']
    print('working task count :',len(working_tasks))
    try:
        await loop.run_in_executor(None, trans, data) 
        del working_tasks[task_id]
    except asyncio.CancelledError:
        print(f'##### id:{task_id} canceled ######')
        conn = sqlite3.connect("db.db")
        c=conn.cursor()
        c.execute("UPDATE music SET status={} WHERE id ='{}'".format(3,task_id))
        conn.commit()
        c.close()
        conn.close()
    finally:
        print(f'id:{task_id} finished')
        print('working task count',len(working_tasks))


async def check():
    idx = 0
    while True:
        idx += 1
        method_frame, header_frame, body = channel.basic_get(queue_name)
        if method_frame:
            print('##delivery_tag:',method_frame.delivery_tag)
            data = json.loads(body)
            print('data:',data)
            task_id = data['musicid']
            work_type = data['work_type']
            del data['work_type']

            if work_type == 'cancel':
                try:
                    if data in waiting_tasks:
                        waiting_tasks.remove(data)
                        print(f'대기열에 있는 {task_id}를 삭제하였습니다.')
                    else:
                        working_tasks[task_id].cancel()
                        del working_tasks[task_id]
                except Exception as e:
                    print('error', e, 'is already canceled')
            elif work_type == 'analysis':
                waiting_tasks.append(data)                
            else:
                print('work_type error')
                pass
            channel.basic_ack(method_frame.delivery_tag)
        if idx > 60:
            print('분석작업 대기중',waiting_tasks)
            idx = 0
        len_working = len(working_tasks)
        len_wating = len(waiting_tasks)
        if len_working >= acceptable_count:
            print(f'이전 작업 진행중... 현재 대기열:{len_wating}')
            pass
        else:
            if waiting_tasks:
                next_data = waiting_tasks.popleft()
                working_tasks[task_id] = loop.create_task(doWork(next_data))
        await asyncio.sleep(3)

loop = asyncio.get_event_loop()
print('analysis setting end')
loop.run_until_complete(check())
channel.close()


if __name__ == "__main__":
    print('app_trans_mq_finished')
    #app.run(debug=False, host='0.0.0.0',port=5001)