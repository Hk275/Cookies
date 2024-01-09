from error import InputError, AccessError
import psycopg2
import json
import smtplib
import ssl
import datetime
import group_booking

conn = psycopg2.connect(
        host="localhost",
        database="cookies",
        user="postgres")

input = {
    'u_id': 'hmm@qq.com',
    'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhtbUBxcS5jb20iLCJwYXNzd29yZCI6IjEyMzQ1Nnh5eiEhISIsImZpcnN0X25hbWUiOiJzdGUiLCJsYXN0X25hbWUiOiJ6aCJ9.s0UqZNKMqTNYoXJELJiG_VLXkKRJu-Gc_lrDWs0bS84',
    'event_id': 1,
    'seats': ['a1','a2', 'a3', 'a5'],
    'reward_points_spent': '15',
    'friends': ['999@qq.com', 'he@qq.com', 'hehe@qq.com']
}

group_booking.group_book(input,conn)

# input = {
#     'u_id': '999@qq.com',
#     'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Ijk5OUBxcS5jb20iLCJwYXNzd29yZCI6IjEyMzQ1Nnh5eiEhISIsImZpcnN0X25hbWUiOiJzdGUiLCJsYXN0X25hbWUiOiJ6aCJ9.RrcKnKlP1ErilGcdn4GP9fHGoXz1zrZAGR2O76cp718',
#     'group_id': 1
# }

# input = {
#     'u_id': 'he@qq.com',
#     'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhlQHFxLmNvbSIsInBhc3N3b3JkIjoiMTIzNDU2eHl6ISEhIiwiZmlyc3RfbmFtZSI6InN0ZSIsImxhc3RfbmFtZSI6InpoIn0.dDjhgcheMsAfCKdpUIVWFerm7-mZTeTVkbShJU1PTas',
#     'group_id': 1
# }

# input = {
#     'u_id': 'hehe@qq.com',
#     'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhlaGVAcXEuY29tIiwicGFzc3dvcmQiOiIxMjM0NTZ4eXohISEiLCJmaXJzdF9uYW1lIjoic3RlIiwibGFzdF9uYW1lIjoiemgifQ.MqGxh-jX1fMv-OoIk6UdY1dy9GF3stsBhdw9mwZceA0',
#     'group_id': 1
# }

# group_booking.book_request_accepted(input,conn)

