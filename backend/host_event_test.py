from error import InputError, AccessError
import psycopg2
import random
import re
import string
import hashlib
import jwt
import host_event
import auth
import json

# [input['email'], password_in, input['first_name'], input['last_name'],
# input['card_number'], input['expiry_date'], input['CVV'], token, input['is_host'], input['abn'], input['tfn']

input = {
    'email': '999@qq.com',
    'password': '123456xyz!!!',
    'first_name': 'ste',
    'last_name': 'zh',
    'birthday': '2077-12-10',
    'card_num': '1234 1234 1234 1234',
    'expiry_date': '2099-05-16',
    'CVV': '123',
    'address': 'ikrdjnmkx',
    'city': 'beujcni',
    'country': 'buenjci',
    'postcode': '2033',
    'organization_name': 'uncei',
    'is_host': False,
    'abn': '1234567890',
    'tfn': '98765432'
}

conn = psycopg2.connect(
        host="localhost",
        database="cookies",
        user="postgres")

token = auth.auth_register(input, conn)
# token_str = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Ijk5OUBxcS5jb20iLCJwYXNzd29yZCI6IjEyMzQ1Nnh5eiEhISIsImZpcnN0X25hbWUiOiJzdGUiLCJsYXN0X25hbWUiOiJ6aCJ9.RrcKnKlP1ErilGcdn4GP9fHGoXz1zrZAGR2O76cp718'
# u_id_str = '999@qq.com'

input = {
    'u_id': '999@qq.com',
    'token': token['token'],
    'event_name': 'ha',
    'discription': 'ikr what the hell',
    'holding_time': '2016-06-22 19:10:25',
    'price': '90',
    'location': 'sydney',
    'seats_num': 400,
    'is_adult_only': 'True',
    'tags': json.dumps({'a': [4,5]}),
    'image': 'xdcfhgvjbhkjnl',
}

host_event.event_creation(input, conn)