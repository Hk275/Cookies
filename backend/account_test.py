from error import InputError, AccessError
import psycopg2
import random
import re
import string
import hashlib
import jwt
import account

conn = psycopg2.connect(
        host="localhost",
        database="cookies",
        user="postgres",
        password="111")

token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6IjQ0NDQ0NDQ0NEBxcS5jb20iLCJwYXNzd29yZCI6IjEyMzQ1Nnh5eiEhISIsImZpcnN0X25hbWUiOiJzdGUiLCJsYXN0X25hbWUiOiJ6aCJ9.fKpG8MWpYv7sZZOOBujl8C2ymqElnjddEm2BON1Y2tA'
print(account.get_myAccount_profile('444444444@qq.com', token, conn))
#input = account.get_myAccount_profile('448267862@qq.com', token, conn)
#input['expiry_date'] = '3333-03-03'
#input['token'] = token

#account.edit_myAccount(input, conn)
#print(account.get_myAccount_profile('448267862@qq.com', token, conn))