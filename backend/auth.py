from error import InputError, AccessError
import psycopg2
import random
import re
import string
import hashlib
import jwt
import json

regex = r'^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'


# encode the password by sha256
def encrypt_password(password):
    result = hashlib.sha256(password.encode()).hexdigest()
    return result


# get the code by email, password, first_name, last_name
def get_token(email, password, first_name, last_name):
    """
    use hashlib.sha256 to get the corresponding token of the password
    """ 
    data = {
        'email': email,
        'password': password,
        'first_name': first_name,
        'last_name': last_name
    }
    result = jwt.encode(data, 'secret', algorithm='HS256')
    return str(result)


def check_name_len(name):
    """
    Function to check last name and first name length
    """

    if len(name) >= 1 and len(name) <= 50:
        return 1
    else:
        return 0


def check_password(password_in, password_c):
    password = encrypt_password(password_in)
    if password == password_c:
        return True
    else:
        return False


def check_pass_len(password):
    """
    Function to check pass length
    """

    if len(password) > 6:
        return 0
    else:
        return 1


def check_valid_email(email):
    """
    Function to check format of email
    """
    if (re.search(regex,email)):
        return 0
    else:
        return 1


# login via email and password
# parameter: email, password
# return: {'u_id','token', 'is_host', 'first_name', 'last_name'}
def auth_login(email, password, db):

    # Check if valid email
    if check_valid_email(email) != 0:
        raise InputError('Invalid email')

    cur = db.cursor()
    cur.execute("select * from users where email = %s",[email])
    info = cur.fetchone()
    cur.close()

    # Find user from data, if email doesn't exist, raise InputError
    if not info:
        raise InputError('User does not exist')
    else:
        u_id = info[0]

    # Check the password
    if not check_password(password, info[1]):
        raise InputError('Invalid password')

    if info[18] != None:
        raise AccessError('already logged in')

    is_host = info[19]
    first_name = info[3]
    last_name = info[4]
    token = get_token(email, password, info[3], info[4])

    cur = db.cursor()
    cur.execute('''UPDATE users
        SET token=%s
        WHERE users.email=%s AND users.token IS NULL;''',[token, email])
    cur.close()
    db.commit()

    return {
        'u_id': u_id,
        'token': token,
        'is_host': is_host,
        'first_name': first_name,
        'last_name': last_name 
    }



# logout via token
# parameter: token
# return: {'is_success': True}
def auth_logout(token, db):

    cur = db.cursor()
    cur.execute("select * from users where token = %s",[token])
    info = cur.fetchone()
    cur.close()
    
    if not info:
        raise AccessError('"Token is invalid"')
    else:
        cur = db.cursor()
        cur.execute('''UPDATE users
            SET token = NULL
            WHERE users.token=%s;''',[token])
        cur.close()
        db.commit()
    
    return {'is_success': True}



# register via the input information
# parameter: input{'email','password','birthday','first_name','last_name','card_num','expiry_date','CVV','address','city','country'
#       'postcode','organization_name','is_host'}
# return: {'u_id','token','is_host','first_name','last_name'}
def auth_register(input, db):
    # ensure the email is valid
    if check_valid_email(input['email']) == 1:
        raise InputError('invalid email')
    # ensure the email has not been used
    cur = db.cursor()
    cur.execute("select * from users where email = %s",[input['email']])
    info = cur.fetchone()
    cur.close()
    if info != None:
        raise InputError('user already exists')
    
    if check_pass_len(input['password']) == 1:
        raise InputError('password short')
    
    if check_name_len(input['first_name']) == 0:
        raise InputError('first name too short or long')
    
    if check_name_len(input['last_name']) == 0:
        raise InputError('last name too short or long')
    
    password_in = encrypt_password(input['password'])
    token = get_token(input['email'], input['password'], input['first_name'], input['last_name'])

    # insert this new users into the database
    try:
        cur = db.cursor()
        data = {'tags': [], 'hosts': []}
        tag_json = json.dumps(data)
        if input['is_host']:
            cur.execute('''INSERT INTO users(email, password, birthday, first_name,
                last_name, phone_num, card_num, expiry_date, cvv, address, city, country,
                postcode, reward_points, organization_name, money, tags, image, token, is_host, abn, tfn)
                VALUES (%s, %s, %s, %s, %s, NULL, %s, %s, %s, %s, %s, %s, %s, 0, %s, 0, %s, NULL, %s, %s, NULL, NULL);''',
                [input['email'], password_in, input['birthday'], input['first_name'], input['last_name'],
                input['card_num'], input['expiry_date'], input['CVV'], input['address'], input['city'],
                input['country'], input['postcode'],input['organization_name'], tag_json, token, input['is_host']])
        else:
            cur.execute('''INSERT INTO users(email, password, birthday, first_name,
                last_name, phone_num, card_num, expiry_date, cvv, address, city, country,
                postcode, reward_points, organization_name, money, tags, image, token, is_host, abn, tfn)
                VALUES (%s, %s, %s, %s, %s, NULL, %s, %s, %s, %s, %s, %s, %s, 0, NULL, 1000, %s, NULL, %s, %s, NULL, NULL);''',
                [input['email'], password_in, input['birthday'], input['first_name'], input['last_name'],
                input['card_num'], input['expiry_date'], input['CVV'], input['address'], input['city'],
                input['country'], input['postcode'], tag_json, token, input['is_host']])
        cur.close()
        db.commit()
    except Exception as error:
        print ("Oops! An exception has occured on database:", error)
        print ("Exception TYPE:", type(error))
        raise InputError("invalid account details input:", type(error))

    return {
        'u_id': input['email'],
        'token': token,
        'is_host': input['is_host'],
        'first_name': input['first_name'],
        'last_name': input['last_name']
    }