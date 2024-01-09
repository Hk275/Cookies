from error import InputError, AccessError
import sys
import psycopg2
import random
import re
import string
import hashlib
import jwt
import datetime
from dateutil import relativedelta

from nltk.tokenize import word_tokenize
import math

# get event information via event id
# parameters: input{'event_id'}, db
# return: the information of the event with that event_id
def get_event_information(input, db):
    try:
        cur = db.cursor()
        cur.execute('''select event.event_id, event.event_name,
                event.discription, event.holding_time, event.price, event.location,
                event.seats_num, event.available_seats_num, event.is_adult_only,
                event.tags, event.image, users.organization_name, users.first_name,
                users.last_name
                    from users 
                    join event_owner on (users.email = event_owner.email)
                    join event on (event_owner.event_id = event.event_id)
                    where event.event_id = %s''',
            [input['event_id']])
    except Exception as error:
        print ("Oops! An exception has occured on database:", error)
        print ("Exception TYPE:", type(error))
        raise InputError("error:", type(error))
    
    event = cur.fetchone()

    cur = db.cursor()
    cur.execute("select available_seats_num from event where event_id = %s",[input['event_id']])
    info = cur.fetchone()
    cur.close()

    number_ofavailable_seats = 0
    seats = info[0]
    for key,value in seats.items():
        if value == 1:
            number_ofavailable_seats += 1

    return {
                'event_id' : event[0],
                'event_name' : event[1],
                'discription' : event[2],
                'holding_time' : str(event[3]),
                'price' : event[4],
                'location' : event[5],
                'seats_num' : event[6],
                'available_seats_num' : event[7],
                'is_adult_only' : event[8],
                'tags' : event[9],
                'image' : event[10],
                'organization_name' : event[11],
                'first_name' : event[12],
                'last_name' : event[13],
                'total_available_seats': number_ofavailable_seats
            }


# return: the list of all events in the future
def get_homepage_list(db):
    event_list = []
    cur = db.cursor()
    try:
        cur.execute('''select event.event_id, event.event_name,
            event.discription, event.holding_time, event.price, event.location,
            event.seats_num, event.available_seats_num, event.is_adult_only,
            event.tags, event.image, users.organization_name, users.first_name,
            users.last_name
                from users 
                join event_owner on (users.email = event_owner.email)
                join event on (event_owner.event_id = event.event_id)
                where event.holding_time >= timestamp %s ''',
            [datetime.datetime.now()])
        
        for event in cur.fetchall():
            e = {
                'event_id' : event[0],
                'event_name' : event[1],
                'discription' : event[2],
                'holding_time' : str(event[3]),
                'price' : event[4],
                'location' : event[5],
                'seats_num' : event[6],
                'available_seats_num' : event[7],
                'is_adult_only' : event[8],
                'tags' : event[9],
                'image' : event[10],
                'organization_name' : event[11],
                'first_name' : event[12],
                'last_name' : event[13]
            }
            event_list.append(e)
    except Exception as error:
        print ("Oops! An exception has occured on database:", error)
        print ("Exception TYPE:", type(error))
        raise InputError("error:", type(error))
    cur.close()
    db.commit()

    return event_list


# get the event list which will be held in one month
def get_nextmonth_homepage_list(db):
    event_list = []
    cur = db.cursor()
    try:
        cur.execute('''select event.event_id, event.event_name,
            event.discription, event.holding_time, event.price, event.location,
            event.seats_num, event.available_seats_num, event.is_adult_only,
            event.tags, event.image, users.organization_name, users.first_name,
            users.last_name
                from users 
                join event_owner on (users.email = event_owner.email)
                join event on (event_owner.event_id = event.event_id)
                where event.holding_time >= timestamp %s AND
                event.holding_time <= timestamp %s''',
            [datetime.datetime.now(), datetime.datetime.now() + relativedelta.relativedelta(months=1)])
        
        for event in cur.fetchall():
            e = {
                'event_id' : event[0],
                'event_name' : event[1],
                'discription' : event[2],
                'holding_time' : str(event[3]),
                'price' : event[4],
                'location' : event[5],
                'seats_num' : event[6],
                'available_seats_num' : event[7],
                'is_adult_only' : event[8],
                'tags' : event[9],
                'image' : event[10],
                'organization_name' : event[11],
                'first_name' : event[12],
                'last_name' : event[13]
            }
            event_list.append(e)
    except Exception as error:
        print ("Oops! An exception has occured on database:", error)
        print ("Exception TYPE:", type(error))
        raise InputError("error:", type(error))
    cur.close()
    db.commit()

    return event_list


# parameter: input{'token', 'email'}
# return: list of events created by the host which will hold in the future
def get_host_events(input, db):
    cur = db.cursor()
    cur.execute("select * from users where token = %s AND email = %s",[input['token'], input['email']])
    info = cur.fetchone()
    cur.close()
    event_list = []
    if not info:
        raise AccessError('"Token is invalid"')
    else:
        try:
            cur = db.cursor()
            cur.execute('''select event.event_id, event.event_name,
            event.discription, event.holding_time, event.price, event.location,
            event.seats_num, event.available_seats_num, event.is_adult_only,
            event.tags, event.image, users.organization_name, users.first_name,
            users.last_name
                from users 
                join event_owner on (users.email = event_owner.email)
                join event on (event_owner.event_id = event.event_id)
                where token = %s AND users.email = %s
                and holding_time >= timestamp %s ''',
            [input['token'], input['email'], datetime.datetime.now()])

            for event in cur.fetchall():
                e = {
                    'event_id' : event[0],
                    'event_name' : event[1],
                    'discription' : event[2],
                    'holding_time' : str(event[3]),
                    'price' : event[4],
                    'location' : event[5],
                    'seats_num' : event[6],
                    'available_seats_num' : event[7],
                    'is_adult_only' : event[8],
                    'tags' : event[9],
                    'image' : event[10],
                    'organization_name' : event[11],
                    'first_name' : event[12],
                    'last_name' : event[13]
                }
                event_list.append(e)
        except Exception as error:
            print ("Oops! An exception has occured on database:", error)
            print ("Exception TYPE:", type(error))
            raise InputError("error:", type(error))
    cur.close()
    db.commit()
    return event_list


# parameter: input{'token', 'email'}
# return: list of events created by the host which is held in the past
def get_host_past_events(input, db):
    cur = db.cursor()
    cur.execute("select * from users where token = %s AND email = %s",[input['token'], input['email']])
    info = cur.fetchone()
    cur.close()
    event_list = []
    if not info:
        raise AccessError('"Token is invalid"')
    else:
        try:
            cur = db.cursor()
            cur.execute('''select event.event_id, event.event_name,
            event.discription, event.holding_time, event.price, event.location,
            event.seats_num, event.available_seats_num, event.is_adult_only,
            event.tags, event.image, users.organization_name, users.first_name,
            users.last_name
                from users 
                join event_owner on (users.email = event_owner.email)
                join event on (event_owner.event_id = event.event_id)
                where token = %s AND users.email = %s
                and holding_time <= timestamp %s ''',
            [input['token'], input['email'], datetime.datetime.now()])

            for event in cur.fetchall():
                e = {
                    'event_id' : event[0],
                    'event_name' : event[1],
                    'discription' : event[2],
                    'holding_time' : str(event[3]),
                    'price' : event[4],
                    'location' : event[5],
                    'seats_num' : event[6],
                    'available_seats_num' : event[7],
                    'is_adult_only' : event[8],
                    'tags' : event[9],
                    'image' : event[10],
                    'organization_name' : event[11],
                    'first_name' : event[12],
                    'last_name' : event[13]
                }
                event_list.append(e)
        except Exception as error:
            print ("Oops! An exception has occured on database:", error)
            print ("Exception TYPE:", type(error))
            raise InputError("error:", type(error))
    cur.close()
    db.commit()
    return event_list


# parameter: input{'token', 'email'}
# return: list of events the customer have booked and will attend in the future
def get_customer_events(input, db):
    cur = db.cursor()
    cur.execute("select * from users where token = %s AND email = %s",[input['token'], input['email']])
    info = cur.fetchone()
    cur.close()
    event_list = []
    if not info:
        raise AccessError('"Token is invalid"')
    else:
        try:
            cur = db.cursor()
            cur.execute('''select event.event_id, event.event_name,
            event.discription, event.holding_time, event.price, event.location,
            event.seats_num, event.available_seats_num, event.is_adult_only,
            event.tags, event.image, booking.seat, booking.booking_id
                from users 
                join booking on (users.email = booking.user_id)
                join event on (booking.event_id = event.event_id)
                where token = %s AND users.email = %s
                and holding_time >= timestamp %s ''',
            [input['token'], input['email'], datetime.datetime.now()])

            for event in cur.fetchall():
                e = {
                    'event_id' : event[0],
                    'event_name' : event[1],
                    'discription' : event[2],
                    'holding_time' : str(event[3]),
                    'price' : event[4],
                    'location' : event[5],
                    'seats_num' : event[6],
                    'available_seats_num' : event[7],
                    'is_adult_only' : event[8],
                    'tags' : event[9],
                    'image' : event[10],
                    'booking_seat' : event[11],
                    'booking_id' : event[12]
                }
                event_list.append(e)
        except Exception as error:
            print ("Oops! An exception has occured on database:", error)
            print ("Exception TYPE:", type(error))
            raise InputError("error:", type(error))
    cur.close()
    db.commit()
    return event_list


# parameter: input{'token', 'email'}
# return: list of events the customer have attend in the past
def get_customer_past_events(input, db):
    cur = db.cursor()
    cur.execute("select * from users where token = %s AND email = %s",[input['token'], input['email']])
    info = cur.fetchone()
    cur.close()
    event_list = []
    if not info:
        raise AccessError('"Token is invalid"')
    else:
        try:
            cur = db.cursor()
            cur.execute('''select event.event_id, event.event_name,
            event.discription, event.holding_time, event.price, event.location,
            event.seats_num, event.available_seats_num, event.is_adult_only,
            event.tags, event.image, booking.seat, booking.booking_id
                from users
                join booking on (users.email = booking.user_id)
                join event on (booking.event_id = event.event_id)
                where token = %s AND users.email = %s
                and holding_time <= timestamp %s ''',
            [input['token'], input['email'], datetime.datetime.now()])

            for event in cur.fetchall():
                e = {
                    'event_id' : event[0],
                    'event_name' : event[1],
                    'discription' : event[2],
                    'holding_time' : str(event[3]),
                    'price' : event[4],
                    'location' : event[5],
                    'seats_num' : event[6],
                    'available_seats_num' : event[7],
                    'is_adult_only' : event[8],
                    'tags' : event[9],
                    'image' : event[10],
                    'booking_seat' : event[11],
                    'booking_id' : event[12]
                }
                event_list.append(e)
        except Exception as error:
            print ("Oops! An exception has occured on database:", error)
            print ("Exception TYPE:", type(error))
            raise InputError("error:", type(error))
    cur.close()
    db.commit()
    return event_list


# parameter: input{'tag', 'keyword'}
# return: list of events with given tag or contain the keyword in discription and title
def search_event(input, db):
    event_list = []
    cur = db.cursor()
    try:
        if input['tag'] != 'null' and input['keyword'] != 'null':
            cur.execute('''select event.event_id, event.event_name,
                    event.discription, event.holding_time, event.price, event.location,
                    event.seats_num, event.available_seats_num, event.is_adult_only,
                    event.tags, event.image, users.organization_name, users.first_name,
                    users.last_name
                        from users 
                        join event_owner on (users.email = event_owner.email)
                        join event on (event_owner.event_id = event.event_id)
                        where event.holding_time >= timestamp %s AND
                        (event.tags)::jsonb ? %s AND
                        (LOWER(event.event_name) ~ LOWER(%s) OR
                        LOWER(event.discription) ~ LOWER(%s))''',
                [datetime.datetime.now(), input['tag'], input['keyword'], input['keyword']])
        elif input['tag'] == 'null' and input['keyword'] != 'null':
            cur.execute('''select event.event_id, event.event_name,
                    event.discription, event.holding_time, event.price, event.location,
                    event.seats_num, event.available_seats_num, event.is_adult_only,
                    event.tags, event.image, users.organization_name, users.first_name,
                    users.last_name
                        from users 
                        join event_owner on (users.email = event_owner.email)
                        join event on (event_owner.event_id = event.event_id)
                        where event.holding_time >= timestamp %s AND
                        (LOWER(event.event_name) ~ LOWER(%s) OR
                        LOWER(event.discription) ~ LOWER(%s))''',
                [datetime.datetime.now(), input['keyword'], input['keyword']])
        elif input['tag'] != 'null' and input['keyword'] == 'null':
            cur.execute('''select event.event_id, event.event_name,
                    event.discription, event.holding_time, event.price, event.location,
                    event.seats_num, event.available_seats_num, event.is_adult_only,
                    event.tags, event.image, users.organization_name, users.first_name,
                    users.last_name
                        from users 
                        join event_owner on (users.email = event_owner.email)
                        join event on (event_owner.event_id = event.event_id)
                        where event.holding_time >= timestamp %s AND
                        (event.tags)::jsonb ? %s''',
                [datetime.datetime.now(), input['tag']])
        
        for event in cur.fetchall():
            e = {
                'event_id' : event[0],
                'event_name' : event[1],
                'discription' : event[2],
                'holding_time' : str(event[3]),
                'price' : event[4],
                'location' : event[5],
                'seats_num' : event[6],
                'available_seats_num' : event[7],
                'is_adult_only' : event[8],
                'tags' : event[9],
                'image' : event[10],
                'organization_name' : event[11],
                'first_name' : event[12],
                'last_name' : event[13]
            }
            event_list.append(e)
    except Exception as error:
        print ("Oops! An exception has occured on database:", error)
        print ("Exception TYPE:", type(error))
        raise InputError("error:", type(error))

    cur.close()
    db.commit()

    return event_list


# help functions for comparing similarity between two discription
######################################
def count_frequency(word_list):
    D = {}
    for new_word in word_list:
        if new_word in D:
            D[new_word] = D[new_word] + 1
        else:
            D[new_word] = 1
    return D

def dot_product(D1, D2):
    dot_sum = 0.0
    for key in D1:
        if key in D2:
            dot_sum += (D1[key] * D2[key])
    return dot_sum

def get_similarity(doc1, doc2):
    D1 = count_frequency(word_tokenize(doc1))
    D2 = count_frequency(word_tokenize(doc2))
    numerator = dot_product(D1, D2)
    denominator = math.sqrt(dot_product(D1, D1) * dot_product(D2, D2))
    return math.acos(numerator / denominator)
###############################   


# parameter: input{'event_id'}
# return: list of events with similar tags and discription
def event_based_recommedation(input, db):
    # input have event_id
    cur = db.cursor()
    cur.execute("select * from event where event_id = %s",[input['event_id']])
    event_curr = cur.fetchone()
    cur.close()

    event_list = []
    cur = db.cursor()
    for tag in event_curr[9]:
        cur.execute('''select event.event_id, event.event_name,
                event.discription, event.holding_time, event.price, event.location,
                event.seats_num, event.available_seats_num, event.is_adult_only,
                event.tags, event.image, users.organization_name, users.first_name,
                users.last_name
                    from users 
                    join event_owner on (users.email = event_owner.email)
                    join event on (event_owner.event_id = event.event_id)
                    where event.holding_time >= timestamp %s AND
                    (event.tags)::jsonb ? %s AND
                    event.event_id <> %s''',
            [datetime.datetime.now(), tag, event_curr[0]])
        
        for event in cur.fetchall():
            exist = False
            for es in event_list:
                if es['event_id'] == event[0]:
                    es['similarity'] = es['similarity'] - es['similarity']/10
                    exist = True
                    break
            if not exist :
                similarity = get_similarity(event_curr[2], event[2])
                e = {
                    'event_id' : event[0],
                    'event_name' : event[1],
                    'discription' : event[2],
                    'holding_time' : str(event[3]),
                    'price' : event[4],
                    'location' : event[5],
                    'seats_num' : event[6],
                    'available_seats_num' : event[7],
                    'is_adult_only' : event[8],
                    'tags' : event[9],
                    'image' : event[10],
                    'organization_name' : event[11],
                    'similarity' : similarity,
                    'first_name' : event[12],
                    'last_name' : event[13]
                }
                event_list.append(e)
    cur.close()
    result = sorted(event_list, key=lambda x: x['similarity'])

    return result[0:3]


# parameter: input{'token', 'email'}
# return: list of events matches the cunstomer's booking history
def history_based_recommedation(input, db):
    cur = db.cursor()
    cur.execute("select * from users where token = %s AND email = %s",[input['token'], input['email']])
    info = cur.fetchone()
    cur.close()

    event_list = []
    if not info:
        raise AccessError('"Token is invalid"')
    else:
        try:
            cur = db.cursor()
            # recommedation based on tags recording
            for tag in info[16]['tags']:
                cur.execute('''select event.event_id, event.event_name,
                        event.discription, event.holding_time, event.price, event.location,
                        event.seats_num, event.available_seats_num, event.is_adult_only,
                        event.tags, event.image, users.organization_name, users.first_name,
                        users.last_name
                            from users 
                            join event_owner on (users.email = event_owner.email)
                            join event on (event_owner.event_id = event.event_id)
                            where event.holding_time >= timestamp %s AND
                            (event.tags)::jsonb ? %s''',
                    [datetime.datetime.now(), tag])
            
                for event in cur.fetchall():
                    exist = False
                    for es in event_list:
                        if es['event_id'] == event[0]:
                            es['similarity'] -= 1
                            exist = True
                            break
                    if not exist :
                        e = {
                            'event_id' : event[0],
                            'event_name' : event[1],
                            'discription' : event[2],
                            'holding_time' : str(event[3]),
                            'price' : event[4],
                            'location' : event[5],
                            'seats_num' : event[6],
                            'available_seats_num' : event[7],
                            'is_adult_only' : event[8],
                            'tags' : event[9],
                            'image' : event[10],
                            'organization_name' : event[11],
                            'similarity' : 20,
                            'first_name' : event[12],
                            'last_name' : event[13]
                        }
                        event_list.append(e)

            # recommedation based on hosts recording
            for host in info[16]['hosts']:
                cur.execute('''select event.event_id, event.event_name,
                        event.discription, event.holding_time, event.price, event.location,
                        event.seats_num, event.available_seats_num, event.is_adult_only,
                        event.tags, event.image, users.organization_name, users.first_name,
                        users.last_name
                            from users 
                            join event_owner on (users.email = event_owner.email)
                            join event on (event_owner.event_id = event.event_id)
                            where event.holding_time >= timestamp %s AND
                            users.email = %s''',
                    [datetime.datetime.now(), host])
            
                for event in cur.fetchall():
                    exist = False
                    for es in event_list:
                        if es['event_id'] == event[0]:
                            es['similarity'] -= 1
                            exist = True
                            break
                    if not exist :
                        e = {
                            'event_id' : event[0],
                            'event_name' : event[1],
                            'discription' : event[2],
                            'holding_time' : str(event[3]),
                            'price' : event[4],
                            'location' : event[5],
                            'seats_num' : event[6],
                            'available_seats_num' : event[7],
                            'is_adult_only' : event[8],
                            'tags' : event[9],
                            'image' : event[10],
                            'organization_name' : event[11],
                            'similarity' : 20,
                            'first_name' : event[12],
                            'last_name' : event[13]
                        }
                        event_list.append(e)
                
        except Exception as error:
            print ("Oops! An exception has occured on database:", error)
            print ("Exception TYPE:", type(error))
            raise InputError("error:", type(error))

    result = sorted(event_list, key=lambda x: x['similarity'])
    return result[0:6]