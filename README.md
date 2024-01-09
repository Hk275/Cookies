# Task Mangement System

### Things to remind
1. remember to keep weekly working diary
2. Do not directly add things to master branch
3. implementing the jira board once finish a task
4. write comment for all the things you write



# Sprint 1
| HTTP Method      |  function            | Parameters       | Return Type         |
|------------------|----------------------|------------------|---------------------|
| **Regeister/Login/out**||||
| POST        | `/auth/login`     |(email, password)|{ u_id, token, role}|
| POST        | `/auth/register`  | dict (email, password,</br>first_name,last_name,<br>username, card number,<br>expiry date, CVV) |{ u_id, token, role}||
| POST         | `/auth/logout`   | (u_id, token)| { is_success }||
| **HOME page**||||
|GET|`/view/get_home_page_list`||{event_list}|
|GET|`/view/get_nextmonth_homepage_list`||list(event)|
|POST|`/view/search_event`|(dict(tag),keyword|list(event)|
|POST|`/view/history_based_recommedation`|(u_id, token)|list(event)}|
| **My account**||||
|POST|`/account/get_myAccount_profile`|(u_id, token)|{profile_self_dict}||
|PUT|`/account/edit_myAccount`|"dict (u_id, </br>token,</br> password,name_first,</br>street address,</br>state,</br>country,</br>name_last,</br>card number,</br>expiry date,</br>CVV)"|{ is_success }|same as register|
|POST|`/view/get_host_events`|(u_id, token)|list(event)|
|POST|`/view/get_host_past_events`|(u_id, token)|list(event)|
|POST|`/view/get_customer_events`|(u_id, token)|list(event)|
|POST|`/view/get_customer_past_events`|(u_id, token)|list(event)|
|POST|`/account/get_wallet_detail`|(u_id, token)||
|DELETE|`/account/current_order/cancel`|(u_id, token)|{is_success}|
|DELETE|`/account/upcoming_events/edit/cancel`|(u_id, token)|{is_success}|
| **Event creation and edit**||||
|GET|`/event/create_new_event`|dict (u_id, token,</br>eventName,</br>ticketPrice,</br>Date of Event,</br>email,</br>num of seats,</br>is_18+ event,</br>event Image,</br>Description,</br>street address,</br>country,</br>tag_list)|{is_success, event_id}|
|PUT|`/event/edit_event`|dict (u_id, token,</br>eventName,</br>ticketPrice,</br>Date of Event,</br>email,</br>num of seats,</br>is_18+ event,</br>event Image,</br>Description,</br>street address,</br>state,</br>country,</br>tag_list)|{is_success}|
| **Booking**||||
|POST|`/view/get_event_information`|eventID|list(event_info)|
|POST|`/account/currency_convert`|(u_id, token)|********|
|POST|`/event/book/seats`|(u_id, token,list(seats),event_id,points)|{is_success}|
|POST|`/event/book/sendmessagetoallcustomers`|(u_id, token)|{is_success}|
|POST|`/view/event_based_recommedation`|(event_id,u_id, token)|list(event)|
|POST|``|(u_id, token)||
|POST|``|(u_id, token)||
| **Friends request**||||
| **Comment**||||
|POST|``|(u_id, token)||
|POST|``|(u_id, token)||
|POST|``|(u_id, token)||
|POST|``|(u_id, token)||
|POST|``|(u_id, token)||
|POST|``|(u_id, token)||
| **Reward system**||||
|POST|`/account/wallet/bought_items`|(u_id, token</br>item_id)||
|POST|`/account/wallet/create_item`|(u_id, token, item_img</br>item_name, item_price</br>item_num)|{is_success}|
|POST|`/account/wallet/my_listed_items`|(u_id, token)|list(item)|
|POST|`/reward_shop/buy_item`|(u_id, token)|{is_success}|
|POST|``|(u_id, token)||
|POST|``|(u_id, token)||
|POST|``|(u_id, token)||
|POST|``|(u_id, token)||
|POST|``|(u_id, token)||
|POST|``|(u_id, token)||


