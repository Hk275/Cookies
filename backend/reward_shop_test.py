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
import reward_shop

# [input['email'], password_in, input['first_name'], input['last_name'],
# input['card_number'], input['expiry_date'], input['CVV'], token, input['is_host'], input['abn'], input['tfn']

# input = {
#     'email': 'he@qq.com',
#     'password': '123456xyz!!!',
#     'first_name': 'ste',
#     'last_name': 'zh',
#     'birthday': '2077-12-10',
#     'card_num': '1234 1234 1234 1234',
#     'expiry_date': '2099-05-16',
#     'CVV': '123',
#     'address': 'ikrdjnmkx',
#     'city': 'beujcni',
#     'country': 'buenjci',
#     'postcode': '2033',
#     'organization_name': 'uncei',
#     'is_host': False,
#     'abn': '1234567890',
#     'tfn': '98765432'
# }

conn = psycopg2.connect(
        host="localhost",
        database="cookies",
        user="postgres")

# token = auth.auth_register(input, conn)

# input = {
#     'u_id': 'he@qq.com',
#     'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhlQHFxLmNvbSIsInBhc3N3b3JkIjoiMTIzNDU2eHl6ISEhIiwiZmlyc3RfbmFtZSI6InN0ZSIsImxhc3RfbmFtZSI6InpoIn0.dDjhgcheMsAfCKdpUIVWFerm7-mZTeTVkbShJU1PTas',
#     'image': 'ste',
#     'price': '50',
#     'num_items': '3',
#     'item_name': 'Cap'
# }

# reward_shop.create_item(input,conn)

input = {
    'u_id': 'hehe@qq.com',
    'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhlaGVAcXEuY29tIiwicGFzc3dvcmQiOiIxMjM0NTZ4eXohISEiLCJmaXJzdF9uYW1lIjoic3RlIiwibGFzdF9uYW1lIjoiemgifQ.MqGxh-jX1fMv-OoIk6UdY1dy9GF3stsBhdw9mwZceA0',
    'item_id': '1'
}

reward_shop.purchase_item(input,conn)


