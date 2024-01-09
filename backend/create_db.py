import psycopg2

# database schema for the project

def connect():
    print('Connecting to the PostgreSQL database...')
    conn = psycopg2.connect(
        host="localhost",
        database="cookies",
        user="postgres",
        password= "111")

# Users table to store information about the user 
    cur = conn.cursor()
    cur.execute('''CREATE TABLE Users (
        email text PRIMARY KEY,
        password text,
        birthday date,
        first_name text,
        last_name text,
        phone_num text,
        card_num text,
        expiry_date date,
        cvv text,
        address text,
        city text,
        country text,
        postcode text,
        reward_points integer,
        organization_name text,
        money integer,
        tags JSONB,
        image text,
        token text,
        is_host boolean,
        abn text,
        tfn text,
        CHECK (is_host = true OR abn IS NULL AND tfn IS NULL)
        );''')

# stores info about the event
    cur.execute('''CREATE TABLE Event (
        event_id serial PRIMARY KEY,
        event_name text,
        discription text,
        holding_time timestamp,
        price integer,
        location text,
        seats_num integer,
        available_seats_num JSONB,
        is_adult_only boolean,
        tags JSONB,
        image text);''')
# stores info about the event_owner
    cur.execute('''CREATE TABLE Event_Owner (
        email text,
        event_id integer,
        PRIMARY KEY (email, event_id),
        FOREIGN KEY (email)
            REFERENCES Users (email),
        FOREIGN KEY (event_id)
            REFERENCES Event (event_id));''')

# storws info about a particular booking
    cur.execute('''CREATE TABLE Booking (
        booking_id serial PRIMARY KEY,
        event_id integer,
        user_id text,
        seat JSONB,
        reward_points_used integer,
        FOREIGN KEY (event_id)
            REFERENCES Event (event_id),
        FOREIGN KEY (user_id)
            REFERENCES Users (email));''')
# stores info about comments
    cur.execute('''CREATE TABLE Comments (
        comment_id serial PRIMARY KEY,
        reply_to text,
        user_id text,
        user_name text,
        event_id integer,
        contents text,
        FOREIGN KEY (event_id)
            REFERENCES Event (event_id),
        FOREIGN KEY (user_id)
            REFERENCES Users (email));''')
# stores friendhsip details
    cur.execute('''CREATE TABLE Friendship (
        u_id text,
        f_id text,
        PRIMARY KEY (u_id, f_id),
        FOREIGN KEY (u_id)
            REFERENCES Users (email),
        FOREIGN KEY (f_id)
            REFERENCES Users (email));''')
# stores friend requests
    cur.execute('''CREATE TABLE Friend_requests (
        u_id text,
        f_id text,
        message text,
        PRIMARY KEY (u_id, f_id),
        FOREIGN KEY (u_id)
            REFERENCES Users (email),
        FOREIGN KEY (f_id)
            REFERENCES Users (email));''')
# stores info about reward shop
    cur.execute('''CREATE TABLE reward_shop (
        item_id serial PRIMARY KEY,
        item_name text,
        image text,
        price integer,
        num_items integer,
        item_by text);''')
# stores info about the purchased items
    cur.execute('''CREATE TABLE purchased_items (
        purchase_id serial PRIMARY KEY,
        item_id integer,
        user_id text,
        FOREIGN KEY (item_id)
            REFERENCES reward_shop (item_id),
        FOREIGN KEY (user_id)
            REFERENCES Users (email));''')
# stores info about the groupbooking requests
    cur.execute('''CREATE TABLE grpbooking_request (
        prim_id serial PRIMARY KEY,
        grp_book_id integer,
        req_approved integer,
        user_id text,
        event_id integer,
        seats JSONB,
        is_primary integer,
        FOREIGN KEY (user_id)
            REFERENCES Users (email),
        FOREIGN KEY (event_id)
            REFERENCES Event (event_id));''')
    
    # close the communication with the PostgreSQL
    cur.close()
    conn.commit()
    conn.close()
    print("tables created")
    print('Database connection closed.')


if __name__ == '__main__':
    connect()