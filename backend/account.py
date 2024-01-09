from error import InputError, AccessError
import psycopg2
import random
import re
import string
import hashlib
import jwt
import datetime
from currency_converter import CurrencyConverter

# get the account profile of the user self via users' email and token
# parameter: token, u_id
# return: account_detail_dict{'email', 'birthday', 'first_name', 'last_name', 'phone_num', 'card_num', 'expiry_date', 'CVV', 'address',
#       'city', 'country', 'postcode', 'reward_points', 'money', 'image'}
def get_myAccount_profile(u_id, token, db):
    cur = db.cursor()
    cur.execute("select * from users where token = %s AND email = %s",[token, u_id])
    info = cur.fetchone()
    cur.close()

    if not info:
        # check user is exist and already loged in
        raise AccessError('"Token is invalid"')
    else:
        email = info[0]
        birthday = info[2]
        first_name = info[3]
        last_name = info[4]
        phone_num = info[5]
        card_num = info[6]
        expiry_date = info[7]
        cvv = info[8]
        address = info[9]
        city = info[10]
        country = info[11]
        postcode = info[12]
        reward_points = info[13]
        money = info[15]
        image = info[17]


        return {
            'email' : email,
            'birthday' : str(birthday),
            'first_name' : first_name,
            'last_name' : last_name,
            'phone_num' : phone_num,
            'card_num' : card_num,
            'expiry_date' : str(expiry_date),
            'CVV' : cvv,
            'address' : address,
            'city' : city,
            'country' : country,
            'postcode' : postcode,
            'reward_points' : reward_points,
            'money' : money,
            'image' : image
        }


# edit user's account detail according the input
# parameter: account_detail_dict{'email', 'birthday', 'first_name', 'last_name', 'phone_num', 'card_num', 'expiry_date', 'CVV', 'address',
#       'city', 'country', 'postcode', 'reward_points', 'money', 'image', 'token', 'email'}
# return: {'is_success': True}
def edit_myAccount(input, db):
    cur = db.cursor()
    cur.execute("select * from users where token = %s AND email = %s",[input['token'], input['email']])
    info = cur.fetchone()
    cur.close()

    if not info:
        # check user is exist and already loged in
        raise AccessError('"Token is invalid"')
    else:
        try:
            cur = db.cursor()
            # change the values of account to input value
            if info[19]:
                cur.execute('''
                    UPDATE users 
                    SET first_name=%s, last_name=%s, card_num=%s, expiry_date=%s,
                    cvv=%s, birthday=%s, phone_num=%s, address=%s, city=%s, country=%s,
                    postcode=%s, image=%s, organization_name=%s
                    WHERE token = %s AND email = %s
                    ''',[input['first_name'], input['last_name'], input['card_num'],
                    input['expiry_date'], input['CVV'], input['birthday'], input['phone_num'],
                    input['address'], input['city'], input['country'], input['postcode'],
                    input['image'], input['organization_name'], input['token'], input['email']])
            else:
                cur.execute('''
                    UPDATE users 
                    SET first_name=%s, last_name=%s, card_num=%s, expiry_date=%s,
                    cvv=%s, birthday=%s, phone_num=%s, address=%s, city=%s, country=%s,
                    postcode=%s, image=%s
                    WHERE token = %s AND email = %s
                    ''',[input['first_name'], input['last_name'], input['card_num'],
                    input['expiry_date'], input['CVV'], input['birthday'], input['phone_num'],
                    input['address'], input['city'], input['country'], input['postcode'],
                    input['image'], input['token'], input['email']])
        except Exception as error:
            print ("Oops! An exception has occured on database:", error)
            print ("Exception TYPE:", type(error))
            raise InputError("invalid account details input:", type(error))    

    cur.close()
    db.commit()
    return {'is_success': True}


# get the wallet details
# parameter: input{'token', 'email'}
# return: {'reward_points', 'money'}
def get_wallet_detail(input, db):      
    cur = db.cursor()
    cur.execute("select * from users where token = %s AND email = %s",[input['token'], input['email']])
    info = cur.fetchone()
    cur.close()
    if not info:
        raise AccessError('"Token is invalid"')

    return {
        'reward_points' : info[13],
        'money' : info[15]
        }


# use currency converter to conert AU to other currency
# paremeter: input{'num', 'currency_to'}
# return: num of money after converted
def currency_convert(input):
    currency_from = 'AUD'
    currency_to = input['currency_to']
    c = CurrencyConverter()
    return c.convert(input['num'], currency_from, currency_to)
        
