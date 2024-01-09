from error import InputError, AccessError
import psycopg2
import json
import smtplib
import ssl
import datetime

# Token, u_id, event_id, freindlist, seats, rewards point spent
def group_book(input,db):
    #check if token is valid
    try:
        cur = db.cursor()
        cur.execute("select first_name from users where email = %s and token = %s",[input['u_id'], input['token']])
        info = cur.fetchone()
        name = info[0]
        cur.close()
    except Exception as error:
        print ("Exception TYPE:", type(error))
        raise InputError("invalid user details input:", type(error))

    if not info:
        raise AccessError('"Token is invalid"')
    else:
        friends_bookwith = input['friends'] 
        seats = input['seats']

        # providing new group id to another group request
        cur = db.cursor()
        cur.execute("select max(grp_book_id) from grpbooking_request;")
        info = cur.fetchone()
        grp_book_num = info[0]
        cur.close()

        if None in info:
            grp_book_num = -1

        grp_book_num += 1

        seats_json = json.dumps(seats)
        
        # adding another group booking

        cur = db.cursor()
        cur.execute('''INSERT INTO grpbooking_request(grp_book_id, req_approved, user_id, event_id, seats, is_primary)
                VALUES (%s, %s, %s, %s, %s, %s);''',
                [grp_book_num, 1, input['u_id'], input['event_id'], seats_json, 1])
        cur.close()
        db.commit()

        cur = db.cursor()
        cur.execute("select price from event where event_id = %s",[input['event_id']])
        info = cur.fetchone()
        price_event = info[0]
        cur.close()

        # calculating the total price for the event to be cut from the person who initiated the request

        price_tobecut = (len(seats) * price_event) - int(input['reward_points_spent'])

        cur = db.cursor()
        cur.execute('''UPDATE users set money = money - %s where email = %s''',[price_tobecut, input['u_id']])
        db.commit()
        cur.close()

        cur = db.cursor()
        cur.execute('''UPDATE users set reward_points = reward_points - %s where email = %s''',[input['reward_points_spent'], input['u_id']])
        db.commit()
        cur.close()

        for frnd in friends_bookwith:
            cur = db.cursor()
            cur.execute('''INSERT INTO grpbooking_request(grp_book_id, req_approved, user_id, event_id, seats, is_primary)
                    VALUES (%s, %s, %s, %s, %s, %s);''',
                    [grp_book_num, 0, frnd, input['event_id'], seats_json, 0])
            cur.close()
            db.commit()

        # send email to all friends reminding them to accept the group booking request

            gmail_user = 'cookieseventnoreply@gmail.com'
            gmail_password = 'gtckvxrqkuqftqhc'

            sent_from = gmail_user
            to = input['u_id']
            message_for_host = """\
        Subject: Group Event booking notification

        Your group_book id is: {}. Please accept the group_book request by {} from going in your account.""".format(input['event_id'], name)
            try:
                smtp_server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
                smtp_server.ehlo()
                smtp_server.login(gmail_user, gmail_password)
                smtp_server.sendmail(sent_from, to, message_for_host)
                smtp_server.close()
                print ("Email sent successfully!")
            except Exception as ex:
                print ("Email not valid….",ex)        

    return {'group_id': grp_book_num}

# if a group booking request is accepted
def book_request_accepted(input,db):
        #check if token is valid
    try:
        cur = db.cursor()
        cur.execute("select * from users where email = %s and token = %s",[input['u_id'], input['token']])
        info = cur.fetchone()
        cur.close()
    except Exception as error:
        print ("Exception TYPE:", type(error))
        raise InputError("invalid user details input:", type(error))

    if not info:
        raise AccessError('"Token is invalid"')
    else:
        # set request approved of the particular user
        cur = db.cursor()
        cur.execute('''UPDATE grpbooking_request set req_approved = 1 where user_id = %s and grp_book_id = %s''',[input['u_id'], input['group_id']])
        db.commit()
        cur.close()

        cur = db.cursor()
        cur.execute("select req_approved from grpbooking_request where grp_book_id = %s",[input['group_id']])
        info = cur.fetchall()
        cur.close()

        for i in info:
            if 0 in i:
                return {'status': 'not all requests accepted'}
        # booking will not happen if all users have not accepted the request
        do_final_booking(input['group_id'], db)
    
# final booking after all confirmation and check (this function is called)
def do_final_booking(group_id, db):
    # checking the primary person (person who initiated the group booking) 
    friends_bookwith = []
    cur = db.cursor()
    cur.execute("select user_id from grpbooking_request where is_primary = 0 and grp_book_id = %s", [group_id])
    info = cur.fetchall()
    cur.close()

    for i in info:
        friends_bookwith.append(i)
    
    cur = db.cursor()
    cur.execute("select user_id from grpbooking_request where is_primary = 1 and grp_book_id = %s", [group_id])
    info = cur.fetchone()
    main_guy = info[0]
    cur.close()

    cur = db.cursor()
    cur.execute("select event_id, seats from grpbooking_request where user_id = %s and grp_book_id = %s", [main_guy, group_id])
    info = cur.fetchone()
    event_id = info[0]
    seats = info[1]
    cur.close()

    cur = db.cursor()
    cur.execute("select price from event where event_id = %s",[event_id])
    info = cur.fetchone()
    price_event = info[0]
    cur.close()

    num_frnds = len(friends_bookwith)
    remainder = len(seats) - num_frnds
    my_seats = []

    # distributing seats according to the friends and the primary person

    for i in range(0,num_frnds):
        frnd_seat = []
        seat = seats[i]
        frnd_seat.append(seat)
        cur = db.cursor()
        friend_rn = friends_bookwith[i]

        print('friend seats', frnd_seat)

        inp = {
            'u_id': friend_rn,
            'event_id': event_id,
            'seat_num': frnd_seat,
            'reward_points_spent': '0'
        }
        event_book(inp,db)
        cur = db.cursor()
        cur.execute('''UPDATE users set money = money + %s where email = %s''',[price_event, main_guy])
        db.commit()
        cur.close()

    for i in range(num_frnds,num_frnds+remainder):
        my_seats.append(seats[i])
        cur = db.cursor()
        cur.execute('''UPDATE users set money = money + %s where email = %s''',[price_event, main_guy])
        db.commit()
        cur.close()

    print('my seats', my_seats)

    inp = {
        'u_id': main_guy,
        'event_id': event_id,
        'seat_num': my_seats,
        'reward_points_spent': '0'
    }
    event_book(inp,db)
    # deleting the group booking request after all boking has been done after accepting all requests
    cur = db.cursor()
    cur.execute('''delete from grpbooking_request where grp_book_id = %s''',[group_id])
    db.commit()
    cur.close()


def event_book(input,db):
    #check if token is valid
    cur = db.cursor()
    cur.execute("select * from users where email = %s",[input['u_id']])
    info = cur.fetchone()
    user_info = info
    cur.close()

    if not info:
        raise AccessError('"Token or u_id is invalid"')

    cur = db.cursor()
    cur.execute("select available_seats_num,price from event where event_id = %s",[input['event_id']])
    info = cur.fetchone()
    cur.close()

    if not info:
        raise AccessError('This event does not exist.. it has been removed')

    # accessing available seats and updating them
    seats_chosen = input['seat_num']

    list_dict = info[0]
    event_price = info[1]

    number_of_tix = 0

    for i in seats_chosen:
        number_of_tix += 1
        list_dict[i] = 0
    
    jsonString = json.dumps(list_dict)

    cur = db.cursor()
    cur.execute('''UPDATE event set available_seats_num = %s where event_id = %s RETURNING event_name''',[jsonString, input['event_id']])
    info = cur.fetchone()
    cur.close()
    db.commit()

    event_name = info
    reward_points_spent = input['reward_points_spent']
    money_to_spend = (number_of_tix*event_price) - int(reward_points_spent)

    # 10 dollars 1 reward point
    reward_point_calc = money_to_spend//10 

    # updating reward points and money
    cur = db.cursor()
    cur.execute('''select money,reward_points from users where email = %s''',[input['u_id']])
    info = cur.fetchone()
    cur.close()

    cur = db.cursor()
    cur.execute('''UPDATE users set money = money - %s, reward_points = reward_points + %s where email = %s''',[money_to_spend, reward_point_calc, input['u_id']])
    cur.close()
    db.commit()

    seats_chosen = json.dumps(input['seat_num'])

    # adding booking
    cur = db.cursor()
    cur.execute('''INSERT INTO booking(event_id, user_id, seat, reward_points_used)
            VALUES (%s, %s, %s, %s) RETURNING booking_id;''',
            [input['event_id'], input['u_id'], seats_chosen, reward_points_spent])
    info = cur.fetchone()
    cur.close()
    db.commit()

    booking_id = info

    # extracting email of host
    cur = db.cursor()
    cur.execute('''select email from event_owner join event on (event.event_id = event_owner.event_id) where event.event_id = %s;''',
            [input['event_id']])
    info = cur.fetchone()
    cur.close()

    host_email = info

    cur = db.cursor()
    cur.execute('''UPDATE users set money = money + %s where email = %s''',[money_to_spend, host_email])
    cur.close()
    db.commit()

    # sending email to customer and host imforming them of the booking
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
            
# fetches the booking request and information to send to frontend
def fetch_booking_requests(input, db):
    booking_req_return = []
    cur = db.cursor()
    cur.execute('''select * from grpbooking_request where user_id = %s;''',
            [input['u_id']])
    info = cur.fetchall()
    cur.close()
    for request in info:
        cur = db.cursor()
        cur.execute('''select event_name, holding_time, image from event where event_id = %s;''',
                [request[4]])
        info = cur.fetchone()
        cur.close()
        cur = db.cursor()
        cur.execute('''select user_id from grpbooking_request where grp_book_id = %s and is_primary = 1;''',
                [request[1]])
        usersom = cur.fetchone()
        cur.close()
        if request[6] == 1:
            return booking_req_return
        e = {
            'prim_id': request[0],
            'grp_book_id': request[1],
            'req_approved': request[2],
            'user_id': request[3],
            'event_id': request[4],
            'seats': request[5],
            'is_primary': request[6],
            'event_name': info[0],
            'event_time': str(info[1]),
            'event_image': info[2],
            'who_sent_req': usersom[0]
        }
        booking_req_return.append(e)

    return booking_req_return

    # event_name, event_date, event_picture and who sent request


