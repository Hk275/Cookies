import sys
from json import dumps
from flask import Flask, request
from flask_cors import CORS
from error import InputError
import psycopg2
import auth
import account
import host_event
import view
import comment
import booking_event
import friend
import reward_shop
import group_booking

conn = psycopg2.connect(
        host="localhost",
        database="cookies",
        user="postgres",
        password="111")

def defaultHandler(err):
    response = err.get_response()
    print('response', err, err.get_response())
    response.data = dumps({
        "code": err.code,
        "name": "System Error",
        "message": err.get_description(),
    })
    response.content_type = 'application/json'
    return response

APP = Flask(__name__)
CORS(APP)

APP.config['TRAP_HTTP_EXCEPTIONS'] = True
APP.register_error_handler(Exception, defaultHandler)


########## auth routes
@APP.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    return dumps(auth.auth_login(data['email'], data['password'], conn))

@APP.route("/auth/logout", methods=['POST'])
def logout():
    token = request.get_json()['token']
    return dumps(auth.auth_logout(token, conn))

@APP.route("/auth/register", methods=['POST'])
def register():
    user_data = request.get_json()
    return dumps(auth.auth_register(user_data, conn))

########### account routes
@APP.route("/account/get_myAccount_profile", methods=['POST'])
def get_myAccount_profile():
    data = request.get_json()
    return dumps(account.get_myAccount_profile(data['email'], data['token'], conn))

@APP.route("/account/edit_myAccount", methods=['POST'])
def edit_myAccount():
    user_data = request.get_json()
    return dumps(account.edit_myAccount(user_data, conn))

@APP.route("/account/get_wallet_detail", methods=['POST'])
def get_wallet_detail():
    user_data = request.get_json()
    return dumps(account.get_wallet_detail(user_data, conn))

@APP.route("/account/currency_convert", methods=['POST'])
def currency_convert():
    data = request.get_json()
    return dumps(account.currency_convert(data))

@APP.route("/account/current_order/cancel", methods=['POST'])
def event_cancel_customer():
    data = request.get_json()
    return dumps(booking_event.event_cancel_customer(data,conn))

@APP.route("/account/upcoming_events/edit/cancel", methods=['POST'])
def event_cancel_host():
    data = request.get_json()
    return dumps(booking_event.event_cancel_host(data,conn))

######### event routes
@APP.route('/event/creation', methods=['POST'])
def event_creation():
    data = request.get_json()
    return dumps(host_event.event_creation(data,conn))

@APP.route("/event/edit", methods=['POST'])
def event_edit():
    data = request.get_json()
    return dumps(host_event.event_edit(data,conn))

@APP.route("/event/book", methods=['POST'])
def event_book():
    data = request.get_json()
    return dumps(booking_event.event_book(data,conn))

@APP.route("/event/book/seats", methods=['POST'])
def fetch_unavailable_seats():
    data = request.get_json()
    return dumps(booking_event.fetch_unavailable_seats(data,conn))

@APP.route("/event/book/sendmessagetoallcustomers", methods=['POST'])
def send_message_to_customerss():
    data = request.get_json()
    return dumps(booking_event.send_message_to_booked_events(data,conn))

########### view routes
@APP.route("/view/get_home_page_list", methods=['GET'])
def get_home_page_list():
    return dumps(view.get_homepage_list(conn))

@APP.route("/view/get_nextmonth_homepage_list", methods=['GET'])
def get_nextmonth_homepage_list():
    return dumps(view.get_nextmonth_homepage_list(conn))

@APP.route("/view/get_host_events", methods=['POST'])
def get_host_events():
    data = request.get_json()
    return dumps(view.get_host_events(data, conn))

@APP.route("/view/get_host_past_events", methods=['POST'])
def get_host_past_events():
    data = request.get_json()
    return dumps(view.get_host_past_events(data, conn))

@APP.route("/view/get_customer_events", methods=['POST'])
def get_customer_events():
    data = request.get_json()
    return dumps(view.get_customer_events(data,conn))

@APP.route("/view/get_customer_past_events", methods=['POST'])
def get_customer_past_events():
    data = request.get_json()
    return dumps(view.get_customer_past_events(data,conn))

@APP.route("/view/search_event", methods=['POST'])
def search_event():
    data = request.get_json()
    return dumps(view.search_event(data,conn))

@APP.route("/view/get_event_information", methods=['POST'])
def get_event_information():
    data = request.get_json()
    return dumps(view.get_event_information(data,conn))

@APP.route("/view/event_based_recommedation", methods=['POST'])
def event_based_recommedation():
    data = request.get_json()
    return dumps(view.event_based_recommedation(data,conn))

@APP.route("/view/history_based_recommedation", methods=['POST'])
def history_based_recommedation():
    data = request.get_json()
    return dumps(view.history_based_recommedation(data,conn))

############## comment routes
@APP.route("/comment/post_comment", methods=['POST'])
def post_comment():
    data = request.get_json()
    return dumps(comment.post_comment(data, conn))

@APP.route("/comment/customer_post_comment", methods=['POST'])
def customer_post_comment():
    data = request.get_json()
    return dumps(comment.customer_post_comment(data, conn))

@APP.route("/comment/get_comments", methods=['POST'])
def get_comments():
    data = request.get_json()
    return dumps(comment.get_comments(data, conn))

@APP.route("/comment/reply_comment", methods=['POST'])
def reply_comment():
    data = request.get_json()
    return dumps(comment.reply_comment(data, conn))


################## friend routes

@APP.route("/friend/get_others_public_profile", methods=['POST'])
def get_others_public_profile():
    data = request.get_json()
    return dumps(friend.get_others_public_profile(data, conn))

@APP.route("/friend/get_friends", methods=['POST'])
def get_friends():
    data = request.get_json()
    return dumps(friend.get_friends(data, conn))

@APP.route("/friend/send_friend_request", methods=['POST'])
def send_friend_request():
    data = request.get_json()
    return dumps(friend.send_friend_request(data, conn))

@APP.route("/friend/get_friend_requests", methods=['POST'])
def get_friend_requests():
    data = request.get_json()
    return dumps(friend.get_friend_requests(data, conn))

@APP.route("/friend/accept_friend_request", methods=['POST'])
def accept_friend_request():
    data = request.get_json()
    return dumps(friend.accept_friend_request(data, conn))

@APP.route("/friend/refuse_friend_request", methods=['POST'])
def refuse_friend_request():
    data = request.get_json()
    return dumps(friend.refuse_friend_request(data, conn))

##################### reward shop routes

@APP.route("/account/wallet/create_item", methods=['POST'])
def create_item():
    data = request.get_json()
    return dumps(reward_shop.create_item(data,conn))

@APP.route("/account/wallet/bought_items", methods=['POST'])
def bought_items():
    data = request.get_json()
    return dumps(reward_shop.list_items_bought(data,conn))

@APP.route("/account/wallet/my_listed_items", methods=['POST'])
def my_listed_items():
    data = request.get_json()
    return dumps(reward_shop.list_host_items(data,conn))

@APP.route("/reward_shop/buy_item", methods=['POST'])
def buy_items():
    data = request.get_json()
    return dumps(reward_shop.purchase_item(data,conn))

@APP.route("/reward_shop/fetch_items", methods=['POST'])
def fetch_all_items():
    data = request.get_json()
    return dumps(reward_shop.fetch_all_items(data,conn))

####### group booking routes

@APP.route("/booking/group_booking", methods=['POST'])
def do_group_booking():
    data = request.get_json()
    return dumps(group_booking.group_book(data,conn))

@APP.route("/booking/accept_request", methods=['POST'])
def accept_group_booking():
    data = request.get_json()
    return dumps(group_booking.book_request_accepted(data,conn))

@APP.route("/booking/fetch_requests", methods=['POST'])
def fetch_booking_req():
    data = request.get_json()
    return dumps(group_booking.fetch_booking_requests(data,conn))

### Flask server
if __name__ == "__main__":
    APP.run(port=5000) # Do not edit this portexport FLASK_APP=myapp