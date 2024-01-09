from error import InputError, AccessError
import psycopg2
import json
import smtplib
import ssl
import datetime

# creating an item in the rewards shop by the host
def create_item(input,db):
    #check if token is valid
    try:
        cur = db.cursor()
        cur.execute("select * from users where token = %s AND email = %s",[input['token'], input['u_id']])
        info = cur.fetchone()
        cur.close()
    except Exception as error:
        print ("Oops! An exception has occured on database:", error)
        print ("Exception TYPE:", type(error))
        raise InputError("invalid account details input:", type(error))
    if not info:
        raise AccessError('"Token is invalid"')
    else:
        # inserting the item in the database
        try:
            cur = db.cursor()
            cur.execute('''INSERT INTO reward_shop(item_name, image, price, num_items, item_by)
                VALUES (%s, %s, %s, %s, %s) RETURNING item_id;''',
                [input['item_name'], input['image'], input['price'], input['num_items'], input['u_id']])
            item_id = cur.fetchone()
            db.commit()
        except Exception as error:
            print ("Oops! An exception has occured on database:", error)
            print ("Exception TYPE:", type(error))
            raise InputError("invalid account details input:", type(error))

    return {'is_success': True, 'item_id': item_id}

def purchase_item(input,db):
    #check if token is valid
    try:
        cur = db.cursor()
        cur.execute("select * from users where token = %s AND email = %s",[input['token'], input['u_id']])
        info = cur.fetchone()
        cur.close()
    except Exception as error:
        print ("Oops! An exception has occured on database:", error)
        print ("Exception TYPE:", type(error))
        raise InputError("invalid account details input:", type(error))
    if not info:
        raise AccessError('"Token is invalid"')
    else:
        try:
            # extracting information of the particular item from the database
            cur = db.cursor()
            cur.execute("select price,item_by from reward_shop where item_id = %s",[input['item_id']])
            info = cur.fetchone()
            item_price = info[0]
            host_uid = info[1]
            cur.close()
        except Exception as error:
            print ("Oops! An exception has occured on database:", error)
            print ("Exception TYPE:", type(error))
            raise InputError("invalid account details input:", type(error))
        try:
            # extracting the reward points of the user
            cur = db.cursor()
            cur.execute("select reward_points from users where token = %s AND email = %s",[input['token'], input['u_id']])
            info = cur.fetchone()
            reward_points = info[0]
            cur.close()
        except Exception as error:
            print ("Oops! An exception has occured on database:", error)
            print ("Exception TYPE:", type(error))
            raise InputError("invalid account details input:", type(error))
        # checking if the user has enough reward points
        if reward_points < item_price:
            raise InputError("You don't have enough reward points to purchase this item")
        try:
            # inserting the item purchased in the database
            cur = db.cursor()
            cur.execute('''INSERT INTO purchased_items(item_id, user_id)
                VALUES (%s, %s);''',
                [input['item_id'], input['u_id']])
            # updating the items, money and reward points in database
            cur.close()
            db.commit()
            cur = db.cursor()
            cur.execute('''UPDATE reward_shop set num_items = num_items - 1 where item_id = %s''',[input['item_id']])
            cur.close()
            db.commit()
            cur = db.cursor()
            cur.execute('''UPDATE users set money = money + %s where email = %s''',[item_price,host_uid])
            cur.close()
            db.commit()
            cur = db.cursor()
            cur.execute('''UPDATE users set reward_points = reward_points - %s where email = %s''',[item_price,input['u_id']])
            cur.close()
            db.commit()
        except Exception as error:
            print ("Oops! An exception has occured on database:", error)
            print ("Exception TYPE:", type(error))
            raise InputError("invalid account details input:", type(error))
        return {'is_success': True}

# for fetching of the items bought for the frontend to display
def list_items_bought(input,db):
    #check if token is valid
    try:
        cur = db.cursor()
        cur.execute("select * from users where token = %s AND email = %s",[input['token'], input['u_id']])
        info = cur.fetchone()
        cur.close()
    except Exception as error:
        print ("Oops! An exception has occured on database:", error)
        print ("Exception TYPE:", type(error))
        raise InputError("invalid account details input:", type(error))
    if not info:
        raise AccessError('"Token is invalid"')
    else:
        item_list = []
        try:
            # extracting details from database
            cur = db.cursor()
            cur.execute('''select r.item_id, r.item_name, r.image,
            r.price from purchased_items as p join reward_shop as r on (p.item_id = r.item_id) where p.user_id = %s''',[input['u_id']])
            for item in cur.fetchall():
                e = {
                    'item_id' : item[0],
                    'item_name' : item[1],
                    'image' : item[2],
                    'price' : item[3]
                }
                item_list.append(e)
            cur.close()
        except Exception as error:
            print ("Oops! An exception has occured on database:", error)
            print ("Exception TYPE:", type(error))
            raise InputError("invalid account details input:", type(error))

    return {'is_success': True, 'item_list': item_list}

# for fetching of the items listed by host for the frontend to display
def list_host_items(input,db):
    #check if token is valid
    try:
        cur = db.cursor()
        cur.execute("select * from users where token = %s AND email = %s",[input['token'], input['u_id']])
        info = cur.fetchone()
        cur.close()
    except Exception as error:
        print ("Oops! An exception has occured on database:", error)
        print ("Exception TYPE:", type(error))
        raise InputError("invalid account details input:", type(error))
    if not info:
        raise AccessError('"Token is invalid"')
    else:
        item_list = []
        try:
            # extracting from the database
            cur = db.cursor()
            cur.execute('''select r.item_id, r.item_name, r.image,
            r.price from reward_shop as r where r.item_by = %s''',[input['u_id']])
            for item in cur.fetchall():
                e = {
                    'item_id' : item[0],
                    'item_name' : item[1],
                    'image' : item[2],
                    'price' : item[3]
                }
                item_list.append(e)
            cur.close()
        except Exception as error:
            print ("Oops! An exception has occured on database:", error)
            print ("Exception TYPE:", type(error))
            raise InputError("invalid account details input:", type(error))

    return {'is_success': True, 'item_list': item_list}

# fetching all items for the shop from the database to give to the frontend
def fetch_all_items(input,db):
    try:
        cur = db.cursor()
        cur.execute('''select r.item_id, r.item_name, r.image,
        r.price from reward_shop as r where r.num_items > 0''')
        item_list = []
        for item in cur.fetchall():
            e = {
                'item_id' : item[0],
                'item_name' : item[1],
                'image' : item[2],
                'price' : item[3]
            }
            item_list.append(e)
        cur.close()
    except Exception as error:
        print ("Oops! An exception has occured on database:", error)
        print ("Exception TYPE:", type(error))
        raise InputError("invalid account details input:", type(error))

    return {'is_success': True, 'item_list': item_list}