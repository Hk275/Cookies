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
import booking_event

# [input['email'], password_in, input['first_name'], input['last_name'],
# input['card_number'], input['expiry_date'], input['CVV'], token, input['is_host'], input['abn'], input['tfn']

# input = {
#     'email': 'vidhiah21@gmail.com',
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
# # # token_str = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Ijk5OUBxcS5jb20iLCJwYXNzd29yZCI6IjEyMzQ1Nnh5eiEhISIsImZpcnN0X25hbWUiOiJzdGUiLCJsYXN0X25hbWUiOiJ6aCJ9.RrcKnKlP1ErilGcdn4GP9fHGoXz1zrZAGR2O76cp718'
# # # u_id_str = '999@qq.com'

input = {
    'u_id': '999@qq.com',
    'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Ijk5OUBxcS5jb20iLCJwYXNzd29yZCI6IjEyMzQ1Nnh5eiEhISIsImZpcnN0X25hbWUiOiJzdGUiLCJsYXN0X25hbWUiOiJ6aCJ9.RrcKnKlP1ErilGcdn4GP9fHGoXz1zrZAGR2O76cp718',
    'event_name': 'ha',
    'discription': 'ikr what the hell',
    'holding_time': '2016-06-22 19:10:25',
    'price': '90',
    'location': 'sydney',
    'seats_num': '150',
    'is_adult_only': 'True',
    'tags': json.dumps({'a': [4,5]}),
    'image': 'xdcfhgvjbhkjnl',
}

host_event.event_creation(input, conn)

input = {
    'u_id': 'hmm@qq.com',
    'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhtbUBxcS5jb20iLCJwYXNzd29yZCI6IjEyMzQ1Nnh5eiEhISIsImZpcnN0X25hbWUiOiJzdGUiLCJsYXN0X25hbWUiOiJ6aCJ9.s0UqZNKMqTNYoXJELJiG_VLXkKRJu-Gc_lrDWs0bS84',
    'event_id': 1,
    'seats': ['c1','c2', 'c3', 'c4'],
    'reward_points_spent': '15'
}

booking_event.event_book(input,conn)

# input = {
#     'u_id': 'mihirahuja828@gmail.com',
#     'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im1paGlyYWh1amE4MjhAZ21haWwuY29tIiwicGFzc3dvcmQiOiIxMjM0NTZ4eXohISEiLCJmaXJzdF9uYW1lIjoic3RlIiwibGFzdF9uYW1lIjoiemgifQ.uloramKsvRsGW7rFqeKQ0EGf2SjKiMRKKQz36MxjzmE',
#     'booking_id': 11
# }
# input = {
#         'u_id': 'mihirahuja24@gmail.com',
#         'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Im1paGlyYWh1amEyNEBnbWFpbC5jb20iLCJwYXNzd29yZCI6IjEyMzQ1Nnh5eiEhISIsImZpcnN0X25hbWUiOiJzdGUiLCJsYXN0X25hbWUiOiJ6aCJ9.VRHraanW7aTD9ZB-a8pc8vAPMC1xySVtvCI2etDrYIk',
#         'event_id': 2
# }
# booking_event.event_cancel(input,conn)
# booking_event.event_cancel_host(input,conn)

# input = {
#         'event_id': 7
# }
# booking_event.fetch_unavailable_seats(input,conn)