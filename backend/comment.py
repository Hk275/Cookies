from error import InputError, AccessError
import sys
import psycopg2
import random
import re
import string
import hashlib
import jwt
import datetime

# directly post the comment
# parameters: input{'token', 'email', 'event_id', 'contents'}
# return: {'comment_id' : comment_id}
def post_comment(input, db, reply_to = 'NULL'):
    # check user exists
    cur = db.cursor()
    cur.execute("select * from users where token = %s AND email = %s",[input['token'], input['email']])
    info = cur.fetchone()
    cur.close()
    if not info:
        raise AccessError('Token is invalid')
    
    # check user booked the event
    cur = db.cursor()
    cur.execute("select * from booking where event_id = %s AND user_id = %s",[input['event_id'], input['email']])
    info2 = cur.fetchone()
    cur.close()
    if not info2:
        raise AccessError('You can not post comments since you have not book the event')

    return post_comment_backend(input, db, info, reply_to)


# helper function, put the comment without backend check
def post_comment_backend(input, db, info, reply_to = 'NULL'):
    try:
        cur = db.cursor()
        cur.execute('''INSERT INTO comments(reply_to, user_id, user_name, event_id, contents)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING comment_id;''',
        [reply_to, input['email'], info[3] + " " + info[4], input['event_id'], input['contents']])
        comment_id = cur.fetchone()
    except Exception as error:
        print ("Oops! An exception has occured on database:", error)
        print ("Exception TYPE:", type(error))
        raise InputError("invalid account details input:", type(error))

    return {'comment_id' : comment_id}


# get the comments under that specific event
# parameters: input{'event_id'}
# return: comments_list{'comment_id','reply_to','user_id','user_name','event_id','contents','user_image'}
def get_comments(input, db):
    # check the event exists
    cur = db.cursor()
    cur.execute("select * from event where event_id = %s",[input['event_id']])
    info = cur.fetchone()
    cur.close()
    if not info:
        raise AccessError('The event does not exist')

    # get comments
    try:
        cur = db.cursor()
        cur.execute('''select comment_id, reply_to, user_id, user_name,
        event_id, contents, users.image
        from comments
        join users on (comments.user_id = users.email)
        where event_id = %s
        order by comment_id;''', 
        [input['event_id']])
        comments_list = []
        for comment in cur.fetchall():
                c = {
                    'comment_id' : comment[0],
                    'reply_to' : comment[1],
                    'user_id' : comment[2],
                    'user_name' : comment[3],
                    'event_id' : comment[4],
                    'contents' : comment[5],
                    'user_image' : comment[6]
                }
                comments_list.append(c)
    except Exception as error:
        print ("Oops! An exception has occured on database:", error)
        print ("Exception TYPE:", type(error))
        raise InputError("error:", type(error))

    return comments_list


# reply to specific comment, the function can only be used by host
# parameters: input{'token', 'email', 'event_id', 'contents', 'reply_to'}
# return: {'comment_id' : comment_id}
def reply_comment(input, db):
    # check user exists
    cur = db.cursor()
    cur.execute("select * from users where token = %s AND email = %s",[input['token'], input['email']])
    info = cur.fetchone()
    cur.close()
    if not info:
        raise AccessError('Token is invalid')

    return post_comment_backend(input, db, info, reply_to=input['reply_to'])


# post comment but contains "every customer can only post one comment" limitation, generally customer use this function to post comment
# parameters: input{'token', 'email', 'event_id', 'contents' (comeent)}
# return: {'comment_id' : comment_id}
def customer_post_comment(input, db):
    cur = db.cursor()
    cur.execute("select * from comments where event_id = %s AND user_id = %s",[input['event_id'], input['email']])
    info = cur.fetchone()
    cur.close()
    if info:
        raise AccessError('You can only post one comment to the event')

    return post_comment(input, db, reply_to = 'NULL')