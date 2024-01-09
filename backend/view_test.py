from error import InputError, AccessError
import sys
import psycopg2
import random
import re
import string
import hashlib
import jwt
import datetime
import auth
import view
import account
import host_event
import json

#h
token555 = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6IjU1NUBxcS5jb20iLCJwYXNzd29yZCI6IjEyMzQ1Nnh5eiEhISIsImZpcnN0X25hbWUiOiJzdGUiLCJsYXN0X25hbWUiOiJ6aCJ9.M-jxXvyjS8KBwJHt01dfBm8uricM_AdWq9B2U_r2_BU'
#h
token666 = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6IjY2NkBxcS5jb20iLCJwYXNzd29yZCI6IjEyMzQ1Nnh5eiEhISIsImZpcnN0X25hbWUiOiJzdGUiLCJsYXN0X25hbWUiOiJ6aCJ9.E0JSF8oAxB9j2O68ZUkk6EAAKhnzZFpQ4QytH4U2qwM'
#h
token777 = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Ijc3N0BxcS5jb20iLCJwYXNzd29yZCI6IjEyMzQ1Nnh5eiEhISIsImZpcnN0X25hbWUiOiJzdGUiLCJsYXN0X25hbWUiOiJ6aCJ9.iq4LmYtiPUZiBN240XEye8I9VRHwxwu86cHdowOKaD4'
#c
token888 = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Ijg4OEBxcS5jb20iLCJwYXNzd29yZCI6IjEyMzQ1Nnh5eiEhISIsImZpcnN0X25hbWUiOiJzdGUiLCJsYXN0X25hbWUiOiJ6aCJ9.u14PyWEuUaspOJRY5_6fISHUsWlSKsNl_jI-sQmMKMQ'
#c
token999 = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Ijk5OUBxcS5jb20iLCJwYXNzd29yZCI6IjEyMzQ1Nnh5eiEhISIsImZpcnN0X25hbWUiOiJzdGUiLCJsYXN0X25hbWUiOiJ6aCJ9.RrcKnKlP1ErilGcdn4GP9fHGoXz1zrZAGR2O76cp718'

conn = psycopg2.connect(
        host="localhost",
        database="cookies",
        user="postgres",
        password="111")

"""
input6_1 = {
    'u_id': '666@qq.com',
    'token': token666,
    'event_name': 'event6-1',
    'discription': 'the discription of event 6-1, wakabaka',
    'holding_time': '2016-06-22 19:10:25',
    'price': '90',
    'location': 'sydney',
    'seats_num': '400',
    'is_adult_only': 'True',
    'tags': json.dumps(['sport','music']),
    'image': 'xdcfhgvjbhkjnl',
}

input6_2 = {
    'u_id': '666@qq.com',
    'token': token666,
    'event_name': 'event6-2',
    'discription': 'the discription of event 6-2, bakawaka',
    'holding_time': '2023-06-22 19:10:25',
    'price': '90',
    'location': 'sydney',
    'seats_num': '400',
    'is_adult_only': 'True',
    'tags': json.dumps(['sport']),
    'image': 'xdcfhgvjbhkjnl',
}

input6_3 = {
    'u_id': '666@qq.com',
    'token': token666,
    'event_name': 'event6-3',
    'discription': 'the discription of event 6-3, wakabaka',
    'holding_time': '2023-06-22 19:10:25',
    'price': '90',
    'location': 'sydney',
    'seats_num': '400',
    'is_adult_only': 'True',
    'tags': json.dumps(['music']),
    'image': 'xdcfhgvjbhkjnl',
}

input7_1 = {
    'u_id': '777@qq.com',
    'token': token777,
    'event_name': 'event7-1',
    'discription': 'sdyg sudyfg dsuyfg sudg yfg ivsfdo hc',
    'holding_time': '2023-06-22 19:10:25',
    'price': '90',
    'location': 'sydney',
    'seats_num': '400',
    'is_adult_only': 'True',
    'tags': json.dumps(['music']),
    'image': 'xdcfhgvjbhkjnl',
}

input7_2 = {
    'u_id': '777@qq.com',
    'token': token777,
    'event_name': 'event7-2',
    'discription': 'another discription belongs to event7-2',
    'holding_time': '2023-06-23 19:10:25',
    'price': '90',
    'location': 'sydney',
    'seats_num': '400',
    'is_adult_only': 'True',
    'tags': json.dumps(['sport']),
    'image': 'xdcfhgvjbhkjnl',
}

host_event.event_creation(input6_1, conn)
host_event.event_creation(input6_2, conn)
host_event.event_creation(input6_3, conn)
host_event.event_creation(input7_1, conn)

host_event.event_creation(input7_2, conn)

input6_9 = {
    'u_id': '666@qq.com',
    'token': token666,
    'event_name': 'event6-9',
    'discription': 'hello world',
    'holding_time': '2023-06-22 19:10:25',
    'price': '90',
    'location': 'sydney',
    'seats_num': '400',
    'is_adult_only': 'True',
    'tags': json.dumps(['ART']),
    'image': 'xdcfhgvjbhkjnl',
}
host_event.event_creation(input6_9, conn)
"""
#input = {'email' :"666@qq.com", 'token' : token666}
#input = {'tag': 'sport', 'keyword': 'NULL'}
#print(view.search_event(input, conn))
#print(view.get_homepage_list(conn))
#print(view.get_host_events(input, conn))
#print(view.get_host_events(input, conn))
#input = {'event_id': 49}
#print(view.event_based_recommedation(input, conn), sep = "\n")

"""
tags = {'tags': [], 'hosts': ['666@qq.com']}
cur = conn.cursor()
cur.execute('''UPDATE users SET tags = %s WHERE email = %s''',
    [json.dumps(tags), '555@qq.com'])
cur.close()
conn.commit()
input = {'email': '555@qq.com', 'token': token555}
print(view.history_based_recommedation(input, conn), sep = "\n")
"""

#print(view.get_event_information({'event_id': 36}, conn))
#input = {'num': 100, 'currency_to': 'CNY'}
#print(account.currency_convert(input))

input7_3 = {
    'u_id': '777@qq.com',
    'token': token777,
    'event_name': 'event7-3',
    'discription': 'another discription belongs to event7-2',
    'holding_time': '2022-08-05 19:10:25',
    'price': '90',
    'location': 'sydney',
    'seats_num': '400',
    'is_adult_only': 'True',
    'tags': json.dumps(['sport']),
    'image': 'xdcfhgvjbhkjnl',
}

input7_4 = {
    'u_id': '777@qq.com',
    'token': token777,
    'event_name': 'event7-4',
    'discription': 'another discription belongs to event7-2',
    'holding_time': '2022-09-01 00:00:00',
    'price': '90',
    'location': 'sydney',
    'seats_num': '400',
    'is_adult_only': 'True',
    'tags': json.dumps(['sport']),
    'image': 'xdcfhgvjbhkjnl',
}

input7_5 = {
    'u_id': '777@qq.com',
    'token': token777,
    'event_name': 'event7-5',
    'discription': 'another discription belongs to event7-2',
    'holding_time': '2022-09-03 00:00:00',
    'price': '90',
    'location': 'sydney',
    'seats_num': '400',
    'is_adult_only': 'True',
    'tags': json.dumps(['sport']),
    'image': 'xdcfhgvjbhkjnl',
}

tags = {'tags': [], 'hosts': []}
cur = conn.cursor()
cur.execute('''UPDATE users SET tags = %s WHERE email = %s''',
    [json.dumps(tags), '777@qq.com'])
cur.close()
conn.commit()

#host_event.event_creation(input7_3, conn)
#host_event.event_creation(input7_4, conn)
#host_event.event_creation(input7_5, conn)
print("homepage:")
print(view.get_homepage_list(conn))
print("next month:")
print(view.get_nextmonth_homepage_list(conn))