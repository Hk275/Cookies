from error import InputError, AccessError
import friend
import psycopg2

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

input = {'u_id': '555@qq.com'}
print("1")
print(friend.get_others_public_profile(input, conn))

input = {'u_id': '555@qq.com', 'token': token555, 'f_id': '777@qq.com', 'message': 'bgfcvnh'}
print("2")
print(friend.send_friend_request(input, conn))

input = {'u_id': '777@qq.com', 'token': token777, 'f_id': '555@qq.com', 'message': 'bgfcvnh'}
print("3")
print(friend.send_friend_request(input, conn))

input = {'u_id': '777@qq.com', 'token': token777}
print("4")
print(friend.get_friend_requests(input, conn))

input = {'u_id': '666@qq.com', 'token': token666}
print("5")
print(friend.get_friend_requests(input, conn))

input = {'u_id': '777@qq.com', 'token': token777, 'f_id': '555@qq.com'}
print("6")
print(friend.accept_friend_request(input, conn))

#input = {'u_id': '666@qq.com', 'token': token666, 'f_id': '555@qq.com'}
#print("7")
#print(friend.accept_friend_request(input, conn))

#input = {'u_id': '666@qq.com', 'token': token666, 'f_id': '777@qq.com'}
#print("8")
#print(friend.accept_friend_request(input, conn))

input = {'u_id': '666@qq.com', 'token': token666}
print("9")
print(friend.get_friends(input, conn))

input = {'u_id': '777@qq.com', 'token': token777}
print("10")
print(friend.get_friends(input, conn))

input = {'u_id': '555@qq.com', 'token': token555}
print("11")
print(friend.get_friends(input, conn))

input = {'u_id': '777@qq.com', 'token': token777}
print("12")
print(friend.get_friend_requests(input, conn))

input = {'u_id': '666@qq.com', 'token': token666}
print("13")
print(friend.get_friend_requests(input, conn))

input = {'u_id': '555@qq.com', 'token': token555}
print("13")
print(friend.get_friend_requests(input, conn))