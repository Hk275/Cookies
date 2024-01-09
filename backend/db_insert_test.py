import psycopg2

def connect():
    conn = None
    try:
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(
            host="localhost",
            database="cookies",
            user="postgres",
            password="111")

        cur = conn.cursor()

        cur.execute('''INSERT INTO users(email, password, birthday, first_name,
        last_name, phone_num, card_num, expiry_date, cvv, address, city, country,
        postcode, reward_points, money, tags, image, token, is_host, abn, tfn)
        VALUES (%s, %s, NULL, %s, %s, NULL, %s, NULL, %s, NULL, NULL, NULL, NULL, %s, %s, NULL, NULL, NULL, false, '666', '999');''',
        ['g@mail', 123, 'steven', 'zhou', 123, 321, 0, 0])   
        # close the communication with the PostgreSQL
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.commit()
            print('Database connection closed.')

if __name__ == '__main__':
    connect()