from error import InputError, AccessError

# parameter: input{'u_id'}
# return: profile dict{'email','first_name','last_name','city','country','postcode','image'}
def get_others_public_profile(input, db):
    # check u_id is valid
    cur = db.cursor()
    cur.execute("select * from users where email = %s",[input['u_id']])
    info = cur.fetchone()
    cur.close()

    if not info:
        raise InputError('"u_id is invalid"')
    else:
        email = info[0]
        first_name = info[3]
        last_name = info[4]
        city = info[10]
        country = info[11]
        postcode = info[12]
        image = info[17]
    
    return {
        'email' : email,
        'first_name' : first_name,
        'last_name' : last_name,
        'city' : city,
        'country' : country,
        'postcode' : postcode,
        'image' : image
    }


# parameter: input{'u_id', 'token'}
# return: friend_list[{'email', 'first_name', 'last_name', 'city', 'country', 'postcode', 'image'}]
def get_friends(input, db):
    # check input attributes are there
    try:
        u_id = input['u_id']
        token = input['token']
    except Exception as error:
        raise InputError("invalid input:", type(error))
    # check u_id token is valid
    cur = db.cursor()
    cur.execute("select * from users where token = %s AND email = %s",[token, u_id])
    info = cur.fetchone()
    cur.close()

    if not info:
        raise AccessError('"Token is invalid"')
    else:
        cur = db.cursor()
        cur.execute('''select * from Friendship where u_id = %s;''',[u_id])
        friend_list = []
        for friend in cur.fetchall():
            inputf = {'u_id': friend[1]}
            f_info = get_others_public_profile(inputf, db)
            f = {
                'email' : f_info['email'],
                'first_name' : f_info['first_name'],
                'last_name' : f_info['last_name'],
                'city' : f_info['city'],
                'country' : f_info['country'],
                'postcode' : f_info['postcode'],
                'image' : f_info['image']
            }
            friend_list.append(f)
        cur.close()

    return friend_list


# parameter: input{'u_id', 'token', 'f_id'(u_id from comment), message}
# return {'is_success': True}
def send_friend_request(input, db):
    # check input attributes are there
    try:
        u_id = input['u_id']
        token = input['token']
        f_id = input['f_id']
        message = input['message']
    except Exception as error:
        raise InputError("invalid input:", type(error))
    # check u_id token f_id is valid
    cur = db.cursor()
    cur.execute("select * from users where token = %s AND email = %s",[token, u_id])
    info1 = cur.fetchone()
    cur.close()

    cur = db.cursor()
    cur.execute("select * from users where email = %s",[f_id])
    info2 = cur.fetchone()
    cur.close()

    if not info1 or not info2:
        raise AccessError('"Token or id is invalid"')
    else:
        # check whether the request exist or not
        cur = db.cursor()
        cur.execute('''select * from friend_requests where u_id = %s AND f_id = %s;''',[u_id, f_id])
        info = cur.fetchone()
        cur.close()
        if info:
            raise InputError('"You have already sent the request"')
        # check they are already friends or not
        cur = db.cursor()
        cur.execute('''select * from Friendship where u_id = %s AND f_id = %s;''',[u_id, f_id])
        info = cur.fetchone()
        cur.close()
        if info:
            raise InputError('You two are already friends')
        # add request
        try:
            cur = db.cursor()
            cur.execute('''INSERT INTO friend_requests(u_id, f_id, message)
                VALUES (%s, %s, %s);''', [u_id, f_id, message])
            cur.close()
            db.commit()
        except Exception as error:
            print ("Oops! An exception has occured on database:", error)
            print ("Exception TYPE:", type(error))
            raise InputError("friend request failed:", type(error))
    return {'is_success': True}



# parameter: input{'u_id', 'token'}
# return: request_list[{'f_id', 'message'}]
def get_friend_requests(input, db):
    # check input attributes are there
    try:
        u_id = input['u_id']
        token = input['token']
    except Exception as error:
        raise InputError("invalid input:", type(error))
    # check u_id token is valid
    cur = db.cursor()
    cur.execute("select * from users where token = %s AND email = %s",[token, u_id])
    info = cur.fetchone()
    cur.close()

    if not info:
        raise AccessError('"Token is invalid"')
    else:
        try:
            cur = db.cursor()
            cur.execute('''select * from friend_requests where f_id = %s;''', [u_id])
            request_list = []
            for request in cur.fetchall():
                r = {
                    'f_id' : request[0],
                    'message' : request[2]
                }
                request_list.append(r)
            cur.close()
        except Exception as error:
            print ("Oops! An exception has occured on database:", error)
            print ("Exception TYPE:", type(error))
            raise InputError("get friend request failed:", type(error))
    return request_list



# parameter: input{'u_id', 'token', 'f_id'}
# return {'is_success': True}
def accept_friend_request(input, db):
     # check input attributes are there
    try:
        u_id = input['u_id']
        token = input['token']
        f_id = input['f_id']
    except Exception as error:
        raise InputError("invalid input:", type(error))
    # check u_id token f_id is valid
    cur = db.cursor()
    cur.execute("select * from users where token = %s AND email = %s",[token, u_id])
    info1 = cur.fetchone()
    cur.close()

    cur = db.cursor()
    cur.execute("select * from users where email = %s",[f_id])
    info2 = cur.fetchone()
    cur.close()

    cur = db.cursor()
    cur.execute("select * from Friend_requests WHERE u_id = %s AND f_id = %s;", [f_id, u_id])
    info3 = cur.fetchone()
    cur.close()

    if not info1 or not info2:
        raise AccessError('"Token or id is invalid"')
    elif not info3:
        raise InputError('"no such request"')
    else:
        try:
            cur = db.cursor()
            cur.execute('''DELETE FROM Friend_requests WHERE u_id = %s AND f_id = %s;''', [f_id, u_id])
            db.commit()
            cur = db.cursor()
            cur.execute('''DELETE FROM Friend_requests WHERE u_id = %s AND f_id = %s;''', [u_id, f_id])
            db.commit()
            cur.execute('''INSERT INTO Friendship(u_id, f_id)
                VALUES (%s, %s);''', [u_id, f_id])
            db.commit()
            cur.execute('''INSERT INTO Friendship(u_id, f_id)
                VALUES (%s, %s);''', [f_id, u_id])
            cur.close()
            db.commit()
        except Exception as error:
            print ("Oops! An exception has occured on database:", error)
            print ("Exception TYPE:", type(error))
            raise InputError("get friend request failed:", type(error))

    return {'is_success': True}


# parameter: input{'u_id', 'token', 'f_id'}
# return {'is_success': True}
def refuse_friend_request(input, db):
     # check input attributes are there
    try:
        u_id = input['u_id']
        token = input['token']
        f_id = input['f_id']
    except Exception as error:
        raise InputError("invalid input:", type(error))
    # check u_id token f_id is valid
    cur = db.cursor()
    cur.execute("select * from users where token = %s AND email = %s",[token, u_id])
    info1 = cur.fetchone()
    cur.close()

    cur = db.cursor()
    cur.execute("select * from users where email = %s",[f_id])
    info2 = cur.fetchone()
    cur.close()

    cur = db.cursor()
    cur.execute("select * from Friend_requests WHERE u_id = %s AND f_id = %s;", [f_id, u_id])
    info3 = cur.fetchone()
    cur.close()

    if not info1 or not info2:
        raise AccessError('"Token or id is invalid"')
    elif not info3:
        raise InputError('"no such request"')
    else:
        try:
            cur = db.cursor()
            cur.execute('''DELETE FROM Friend_requests WHERE u_id = %s AND f_id = %s;''', [f_id, u_id])
            db.commit()
            cur.close()
        except Exception as error:
            print ("Oops! An exception has occured on database:", error)
            print ("Exception TYPE:", type(error))
            raise InputError("get friend request failed:", type(error))

    return {'is_success': True}