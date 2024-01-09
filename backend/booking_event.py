from error import InputError, AccessError
import psycopg2
import json
import smtplib
import ssl
import datetime

# To book an event
def event_book(input,db):
    #check if token is valid
    cur = db.cursor()
    cur.execute("select * from users where email = %s and token = %s",[input['u_id'], input['token']])
    info = cur.fetchone()
    user_info = info
    cur.close()

    # if no tuple returned then that means there is no token or u_id so raise error and not book
    if not info:
        raise AccessError('"Token or u_id is invalid"')

    # fetching the available seats and price from event with event_id given
    cur = db.cursor()
    cur.execute("select available_seats_num,price from event where event_id = %s",[input['event_id']])
    info = cur.fetchone()
    cur.close()

    # if no tuple returned then that means there is no event so raise error and not book
    if not info:
        raise AccessError('This event does not exist.. it has been removed')

    # accessing available seats and updating them
    seats_chosen = input['seat_num']

    # available seats dictionary
    list_dict = info[0]
    # event price
    event_price = info[1]

    number_of_tix = 0
    # counting the number of tickets and setting the seats to occupied
    for i in seats_chosen:
        number_of_tix += 1
        list_dict[i] = 0
    
    # converting to JSON to store in database as JSONB
    jsonString = json.dumps(list_dict)

    # updating the available seats of the particular event
    cur = db.cursor()
    cur.execute('''UPDATE event set available_seats_num = %s where event_id = %s RETURNING event_name''',[jsonString, input['event_id']])
    info = cur.fetchone()
    cur.close()
    db.commit()

    # calculating the money to be spent by the price and number of seats
    event_name = info
    reward_points_spent = input['reward_points_spent']
    money_to_spend = (number_of_tix*event_price) - int(reward_points_spent)

    # 10 dollars 1 reward point
    reward_point_calc = money_to_spend//10 

    # updating reward points and wallet in the database
    cur = db.cursor()
    cur.execute('''UPDATE users set money = money - %s, reward_points = reward_points + %s where email = %s''',[money_to_spend, reward_point_calc, input['u_id']])
    cur.close()
    db.commit()

    # converting to JSON to store in database as JSONB
    seats_chosen = json.dumps(input['seat_num'])

    # inserting the new booking in the database
    cur = db.cursor()
    cur.execute('''INSERT INTO booking(event_id, user_id, seat, reward_points_used)
            VALUES (%s, %s, %s, %s) RETURNING booking_id;''',
            [input['event_id'], input['u_id'], seats_chosen, reward_points_spent])
    info = cur.fetchone()
    cur.close()
    db.commit()

    booking_id = info

    # extracting the host username from the particular event
    cur = db.cursor()
    cur.execute('''select email from event_owner join event on (event.event_id = event_owner.event_id) where event.event_id = %s;''',
            [input['event_id']])
    info = cur.fetchone()
    cur.close()

    host_email = info

    # updating wallet of the host
    cur = db.cursor()
    cur.execute('''UPDATE users set money = money + %s where email = %s''',[money_to_spend, host_email])
    cur.close()
    db.commit()

    # intializing and sending email to the customer and the host for booking the event
    gmail_user = 'cookieseventnoreply@gmail.com'
    gmail_password = 'gtckvxrqkuqftqhc'

    sent_from = gmail_user
    to = input['u_id']
    message_for_customer = """\
Subject: Booking Confirmation

Your booking id is {} and seats chosen are {} for event {}.""".format(booking_id,seats_chosen,event_name)
    message_for_host = """\
Subject: A Customer has booked a ticket

Your booking id is {} and seats chosen are {} for event {}.""".format(booking_id,seats_chosen,event_name)
    try:
        smtp_server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        smtp_server.ehlo()
        smtp_server.login(gmail_user, gmail_password)
        smtp_server.sendmail(sent_from, to, message_for_customer)
        smtp_server.sendmail(sent_from, host_email, message_for_host)
        smtp_server.close()
        print ("Email sent successfully!")
    except Exception as ex:
        print ("Email not valid….",ex)
    
    # update users tags -- steven
    cur = db.cursor()
    cur.execute('''select event.tags, event_owner.email 
                from event_owner 
                join event on (event.event_id = event_owner.event_id) 
                where event.event_id = %s;''',
            [input['event_id']])
    event_tag_owner = cur.fetchone()
    cur.close()

    cur = db.cursor()
    for t in event_tag_owner[0]:
        if t not in user_info[16]['tags']: 
            user_info[16]['tags'].append(t)
    if event_tag_owner[1] not in user_info[16]['hosts']: 
        user_info[16]['hosts'].append(event_tag_owner[1])
    tag_json_user = json.dumps(user_info[16])
    cur.execute('''UPDATE users set tags = %s where email = %s''',
        [tag_json_user, input['u_id']])
    cur.close()
    db.commit()

    return {'is_success': True, 'booking_id': booking_id, 'seat_set': list_dict}

#########################################################################################################  

# To cancel the event for the customer
def event_cancel_customer(input,db):
    #check if token is valid
    cur = db.cursor()
    cur.execute("select * from users where token = %s AND email = %s",[input['token'], input['u_id']])
    info = cur.fetchone()
    cur.close()

    if not info:
        raise AccessError('"Token or u_id is invalid"')

    cur = db.cursor()
    cur.execute("select * from booking where booking_id = %s",[input['booking_id']])
    info = cur.fetchone()
    cur.close()

    # checking whether there exists a booking or not

    if not info:
        raise AccessError('"Booking id invalid"')
    
    event_id = info[1]

    # checking the holding time of the event to compare it with the time currently to implement the 
    # 'non cancellation if within 7 days' feature
    cur = db.cursor()
    cur.execute("select holding_time from event where event_id = %s",[event_id])
    info = cur.fetchone()
    cur.close()

    if not info:
        raise AccessError('This event does not exist.. it has been removed')
    
    holding_time = info[0]

    date_today = datetime.datetime.today()
    if (holding_time - datetime.timedelta(days=7)) < date_today:
        raise AccessError('The 7 day period is expired, so cancellation cant happen')
    else:
        return event_cancel_cust_final(input,db)

###################################################################################

# calcellation of an event for good

def event_cancel_cust_final(input,db):
    #check if token is valid
    cur = db.cursor()
    cur.execute("select * from users where token = %s AND email = %s",[input['token'], input['u_id']])
    info = cur.fetchone()
    cur.close()

    # if no tuple returned then that means there is no token or u_id so raise error and not book
    if not info:
        raise AccessError('"Token or u_id is invalid"')

    cur = db.cursor()
    cur.execute("select * from booking where booking_id = %s",[input['booking_id']])
    info = cur.fetchone()
    cur.close()

    # checking whether there exists a booking or not

    if not info:
        raise AccessError('"Booking id invalid"')
    
    # extracting all the information from the bookings table
    booking_id = info[0]
    event_id = info[1]
    seat = info[3]
    reward_points_used = info[4]
    number_ofseats = len(seat)

    cur = db.cursor()
    cur.execute("select available_seats_num,price from event where event_id = %s",[event_id])
    info = cur.fetchone()
    cur.close()

    # checking whether there exists an event or not

    if not info:
        raise AccessError('This event does not exist.. it has been removed')
    
    available_seats = info[0]
    price_ofseat = info[1]

    # checking the price of the event and setting the seats booked to available
    for s in seat:
        available_seats[s] = 1
    
    jsonString = json.dumps(available_seats)

    cur = db.cursor()
    cur.execute('''UPDATE event set available_seats_num = %s where event_id = %s''',[jsonString, event_id])
    cur.close()
    db.commit()

    price_paid = (price_ofseat * number_ofseats) - reward_points_used
    reward_points = price_paid//10

    # Refunding the money and taking back the reward points given
    cur = db.cursor()
    cur.execute('''UPDATE users set money = money + %s, reward_points = reward_points - %s where token = %s AND email = %s''',[price_paid, reward_points, input['token'], input['u_id']])
    cur.close()
    db.commit()

    # giving back the spent reward points
    cur = db.cursor()
    cur.execute('''UPDATE users set reward_points = reward_points + %s where token = %s AND email = %s''',[reward_points_used, input['token'], input['u_id']])
    cur.close()
    db.commit()

    # deleting the entry from database
    cur = db.cursor()
    cur.execute('''delete from booking where booking_id = %s''',[booking_id])
    cur.close()
    db.commit()

    cur = db.cursor()
    cur.execute('''select email from event_owner join event on (event.event_id = event_owner.event_id) where event.event_id = %s;''',
            [event_id])
    info = cur.fetchone()
    cur.close()

    host_email = info

    # deducting money from host wallet
    cur = db.cursor()
    cur.execute('''UPDATE users set money = money - %s where email = %s''',[price_paid, host_email])
    cur.close()
    db.commit()

    # sending the cancellation email to both host and customer informing them about the changes
    gmail_user = 'cookieseventnoreply@gmail.com'
    gmail_password = 'gtckvxrqkuqftqhc'

    sent_from = gmail_user
    to = input['u_id']
    message_for_customer = """\
Subject: Booking Cancellation Confirmation

Your booking id {} is now cancelled and the money and reward points have been refunded and subtracted respectively.""".format(booking_id)
    message_for_host = """\
Subject: A Customer has cancelled their ticket

Booking id {} has cancelled their tickets.""".format(booking_id)
    try:
        smtp_server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        smtp_server.ehlo()
        smtp_server.login(gmail_user, gmail_password)
        smtp_server.sendmail(sent_from, to, message_for_customer)
        smtp_server.sendmail(sent_from, host_email, message_for_host)
        smtp_server.close()
        print ("Email sent successfully!")
    except Exception as ex:
        print ("Email not valid….",ex)

    return{'is_success': True, 'booking_id': booking_id}

#########################################################################################################    
def event_cancel_host(input,db):
    #check if token is valid
    cur = db.cursor()
    cur.execute("select * from users where token = %s AND email = %s",[input['token'], input['u_id']])
    info = cur.fetchone()
    cur.close()

    if not info:
        raise AccessError('"Token or u_id is invalid"')
    
    cur = db.cursor()
    cur.execute("select booking_id from booking where event_id = %s",[input['event_id']])
    info = cur.fetchall()
    cur.close()

    # cancelling booking for all customers first
    for i in info:
        input = {
            'token': input['token'],
            'u_id': input['u_id'],
            'booking_id': i
        }
        event_cancel_cust_final(input,db)

    cur = db.cursor()
    cur.execute('''delete from event_owner where event_id = %s''',[input['event_id']])
    cur.close()
    db.commit()

    cur = db.cursor()
    cur.execute('''delete from event where event_id = %s''',[input['event_id']])
    cur.close()
    db.commit()

    # sending email  to host to confirm cancellation
    gmail_user = 'cookieseventnoreply@gmail.com'
    gmail_password = 'gtckvxrqkuqftqhc'

    sent_from = gmail_user
    to = input['u_id']
    message_for_host = """\
Subject: Event cancelled successfully

The event id {} has been removed and the amount is adjusted for the customers.""".format(input['event_id'])
    try:
        smtp_server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        smtp_server.ehlo()
        smtp_server.login(gmail_user, gmail_password)
        smtp_server.sendmail(sent_from, to, message_for_host)
        smtp_server.close()
        print ("Email sent successfully!")
    except Exception as ex:
        print ("Email not valid….",ex)

    return {'is_success': True, 'event_id': input['event_id']}

#########################################################################################################  

# fetching the unavailable seats so that the seat map can be updated
def fetch_unavailable_seats(input,db):
    cur = db.cursor()
    cur.execute("select available_seats_num from event where event_id = %s",[input['event_id']])
    info = cur.fetchone()
    cur.close()

    unavailable_seats = []
    seats = info[0]
    for key,value in seats.items():
        if value == 0:
            unavailable_seats.append(key)
    
    return {'event_id': input['event_id'], 'unavailable_seats': unavailable_seats}

#########################################################################################################

# if a host wants to send a message informing them about anything he/she wants for the event, they can send to all 
# customers who have booked that event

def send_message_to_booked_events(input,db):
    cur = db.cursor()
    cur.execute("select user_id from booking where event_id = %s",[input['event_id']])
    info = cur.fetchall()
    cur.close()

    gmail_user = 'cookieseventnoreply@gmail.com'
    gmail_password = 'gtckvxrqkuqftqhc'

    sent_from = gmail_user
    message_for_host = """\
Subject: Message from event_owner for event id {}

{}.""".format(input['event_id'], input['message'])
    for i in info:
        try:
            smtp_server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
            smtp_server.ehlo()
            smtp_server.login(gmail_user, gmail_password)
            smtp_server.sendmail(sent_from, i, message_for_host)
            smtp_server.close()
            print ("Email sent successfully!")
        except Exception as ex:
            print ("Email not valid….",ex)

    return {'is_success': True} 

    



