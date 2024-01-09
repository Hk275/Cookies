from error import InputError, AccessError
import psycopg2
import random
import re
import string
import hashlib
import auth
import json

# creates an event as created by host
def event_creation(input,db):
    #check if token is valid
    try:
        cur = db.cursor()
        cur.execute("select * from users where token = %s AND email = %s",[input['token'], input['u_id']])
        info = cur.fetchone()
        cur.close()
    except Exception as error:
        print ("Exception TYPE:", type(error))
        raise InputError("invalid user details input:", type(error))

    if not info:
        raise AccessError('"Token is invalid"')
    else:
        try:
            #insert this new event into the database
            tag_json = json.dumps(input['tags'])
            # generate seats and store
            seatnum_dict = {}
            seat_num = input['seats_num']
            ch = 'a'
            if seat_num == '50':
                for i in range(5):
                    for j in range(1,11):
                        seat = chr(ord(ch) + i) + str(j)
                        seatnum_dict[seat] = 1
            elif seat_num == '150':
                for i in range(10):
                    for j in range(1,16):
                        seat = chr(ord(ch) + i) + str(j)
                        seatnum_dict[seat] = 1
            elif seat_num == '400':
                for i in range(20):
                    for j in range(1,21):
                        seat = chr(ord(ch) + i) + str(j)
                        seatnum_dict[seat] = 1
        except Exception as error:
            print ("Exception TYPE:", type(error))
            raise InputError("invalid event details input:", type(error))
        # inserts the event into the database
        jsonString = json.dumps(seatnum_dict)
        try:
            cur = db.cursor()
            cur.execute('''INSERT INTO event(event_name, discription, holding_time,
                price, location, seats_num, available_seats_num, is_adult_only, tags, image)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING event_id;''',
                [input['event_name'], input['discription'], input['holding_time'],
                input['price'], input['location'], input['seats_num'], jsonString,
                input['is_adult_only'], tag_json, input['image']])
            event_id = cur.fetchone()
            cur = db.cursor()
            for t in input['tags']:
                if t not in info[16]['tags']: 
                    info[16]['tags'].append(t)
            tag_json_user = json.dumps(info[16])
            cur.execute('''UPDATE users set tags = %s where token = %s AND email = %s''',
                [tag_json_user, input['token'], input['u_id']])
            cur.close()
            db.commit()
            cur = db.cursor()
            cur.execute('''INSERT INTO event_owner(email, event_id)
                VALUES (%s, %s);''',
                [input['u_id'], event_id])
            cur.close()
            db.commit()
        except Exception as error:
            print ("Oops! An exception has occured on database:", error)
            print ("Exception TYPE:", type(error))
            raise InputError("invalid event details input:", type(error))

        return {'is_success': True, 'event_id': event_id, 'seat_set': seatnum_dict}
    

# editing event by the host
def event_edit(input,db):
    # check if token is valid
    try:
        cur = db.cursor()
        cur.execute("select * from users where token = %s AND email = %s",[input['token'], input['u_id']])
        info = cur.fetchone()
        cur.close()
    except Exception as error:
        print ("Oops! An exception has occured on database:", error)
        print ("Exception TYPE:", type(error))
        raise InputError("invalid user details input:", type(error))

    if not info:
        raise AccessError('"Token is invalid"')
    else:
    # find the event from the database
        try:
            cur = db.cursor()
            cur.execute("select * from event where event_id = %s",[input['event_id']])
            info = cur.fetchone()
            cur.close()
            if info == None:
                raise AccessError('event does not exist')

            tag_json = json.dumps(input['tags'])
            # update event in the database
            cur = db.cursor()
            cur.execute('''
                UPDATE event 
                SET event_name = %s, discription = %s, holding_time = %s,
                price = %s, location = %s, seats_num = %s, 
                is_adult_only = %s, tags = %s, image = %s where event_id = %s
                ''',[input['event_name'], input['discription'], input['holding_time'],
                input['price'], input['location'], input['seats_num'], 
                input['is_adult_only'], tag_json, input['image'], input['event_id']])
            cur.close()
            db.commit()
        except Exception as error:
            print ("Oops! An exception has occured on database:", error)
            print ("Exception TYPE:", type(error))
            raise InputError("invalid event details input:", type(error))

    return {'is_success': True}