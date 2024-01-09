from error import InputError, AccessError
import psycopg2
import random
import re
import string
import hashlib
import jwt
import auth

#[input['email'], password_in, input['first_name'], input['last_name'],
#input['card_number'], input['expiry_date'], input['CVV'], token, input['is_host'], input['abn'], input['tfn']
input = {
    'email': '444@qq.com',
    'password': '123456xyz!!!',
    'first_name': 'rgg',
    'last_name': 'sss',
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
        user="postgres",
        password='111')

auth.auth_register(input, conn)

#print(auth.auth_login('448267862@qq.com', '123456xyz!!!', conn))
#token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6IjQ0ODI2Nzg2MkBxcS5jb20iLCJwYXNzd29yZCI6IjEyMzQ1Nnh5eiEhISIsImZpcnN0X25hbWUiOiJzdGV2ZW4iLCJsYXN0X25hbWUiOiJ6aG91In0.MSo5DSnyBQWTnq6vGKW0qToao9kRC3qwFreILjhZxRo'
#print(auth.auth_logout(token, conn))