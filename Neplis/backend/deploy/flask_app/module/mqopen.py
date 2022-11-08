import pika
import asyncio


max_priority = 10


def get_channel(queue_name):
    # connect and get channel
    parameters = pika.ConnectionParameters(host='172.17.0.1')
    connection = pika.BlockingConnection(parameters)
    channel = connection.channel()
    # declare queue with max priority
    channel.queue_declare(
        queue=queue_name, arguments={"x-max-priority": max_priority}
    )
    return connection, channel

async def asTest(task_id):
    print('비동기 함수 라이브러리 확인')
    for i in range(10):
        print(f'task {task_id}번 작업중. time:{i*2}')
        await asyncio.sleep(2)
    return 'finished'