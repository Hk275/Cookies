import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {  Comment, Form, Header } from 'semantic-ui-react'
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

// style used in the code 
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// This code has been inspired from the following link
// https://wesbos.com/react-jsx-comments 
// This code returns the comments which are used to display 
// on the event details page 
const Comments = (props) => {

  const [comment,setComment] = React.useState('')
  const styleLink = document.createElement("link");
  const [comments, setComments] = React.useState([])
  const [reply, setReply] = React.useState(false);
  const [replycommnet, setReplyComment] = React.useState("")

  styleLink.rel = "stylesheet";
  styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";

  document.head.appendChild(styleLink);

  const jsonstring = JSON.stringify({
    token: sessionStorage.getItem('token'),
    email: sessionStorage.getItem('u_id'),
    event_id: props.id,
    contents: comment,
  });
  const requestoption = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: jsonstring,
  };
  
  // Post the comment by the user 
  const postComment = (requestoption) => {
    fetch('http://127.0.0.1:5000/comment/customer_post_comment', requestoption)
            .then((r) => {
            if (r.status === 200) {
                r.json().then((data) => {
               window.location.href = '/eventdetails/?id=' + props.id
                // Store account details
                });
          } else {
            r.json().then((data) => {
              alert("You have not booked this event please book")
            });
          }
        })
  }

// Fetch all the comments
React.useEffect(() => {

  const jsonstring2 = JSON.stringify({
    event_id: props.id,
  });
  const requestoption2 = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: jsonstring2,
  };

  
  fetch('http://127.0.0.1:5000/comment/get_comments', requestoption2)
  .then((r) => {
  if (r.status === 200) {
      r.json().then((data) => {
     setComments(data)
      // Store account details
      });
  } else {
    r.json().then((data) => {
      console.log(data);
    });
  }
  })

}, [])


// Reply to a paticulr functon 
const makeReply = (c_id,e_id) => {
  // Post Reply Box, or cancel reply 
  const jsonstring2 = JSON.stringify({
    token: sessionStorage.getItem("token"),
    email: sessionStorage.getItem("u_id"),
    event_id: e_id,
    contents: replycommnet,
    reply_to: c_id,
  });
  const requestoption2 = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: jsonstring2,
  };


  fetch('http://127.0.0.1:5000/comment/reply_comment', requestoption2)
  .then((r) => {
  if (r.status === 200) {
      r.json().then((data) => {
     window.location.href = '/eventdetails/?id=' + props.id
      // Store account details
      });
  } else {
    r.json().then((data) => {
      console.log(data);
    });
  }
  })
}

const replysetting = (comment_id) => {
  setReply(true)
  setCsid(comment_id)
}
const [csid, setCsid] = React.useState("")


const [open, setOpen] = React.useState(false);


var styles ={flex:1,
  flexDirection:'row',
  alignItems:'center',
  justifyContent:'center'}
      
  
const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);

// Send the freind request to the user 
// and close the popup
const sendFreindReq = (request_person) => {

  // Post Reply Box, or cancel reply 
  const jsonstring2 = JSON.stringify({
    u_id: sessionStorage.getItem("u_id"),
    token: sessionStorage.getItem("token"),
    f_id: request_person,
    message :" Hi"
  });
  const requestoption2 = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: jsonstring2,
  };
  fetch('http://127.0.0.1:5000/friend/send_friend_request', requestoption2)
  .then((r) => {
  if (r.status === 200) {
      r.json().then((data) => {
     setOpen(false)
      // Store account details
      });
  } else {
    r.json().then((data) => {
      console.log('i fire once');
    });
  }
  })
}
  return (
    <>
   <Comment.Group>
      <Header as='h3' dividing>
            Comments
            </Header>
    {comments.map((c) => {
      // style = {{marginLeft: 10}}
      return (
        <>
        {c.reply_to == "NULL" && <div > <Comment id = {c.comment_id} style = {{marginBottom: 30}}>
        <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg'  onMouseOver = {handleOpen}/>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
           {c.user_name}
          </Typography>
          {/* Right code for image  */}
          <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg'/> 
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Email id: {c.user_id} 
          </Typography>
          <div style={styles}> <Button variant="contained" color="success" onClick = {() => sendFreindReq(c.user_id)}> Send Freind Request </Button>  </div>
          
        </Box>
      </Modal>
        <Comment.Content  >
            <Comment.Author as='a'>{c.user_name}</Comment.Author>
            <Comment.Metadata>
            <div>{c.user_id} || Comment id:{c.comment_id}</div>
            </Comment.Metadata>
            <Comment.Text>{c.contents}</Comment.Text>
            <Comment.Actions>
            <Comment.Action onClick = {() => {replysetting(c.comment_id)}}>Reply </Comment.Action>
            </Comment.Actions>
            <Comment.Metadata>
            
            </Comment.Metadata>
        </Comment.Content>
        </Comment>
        </div> }

        { 
        c.reply_to != "NULL" && <div style = {{marginLeft: 100}}> <Comment id = {c.comment_id}>
        <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
        <Comment.Content  >
            <Comment.Author as='a'>{c.user_name}</Comment.Author>
            <Comment.Metadata>
            <div> Reply to comment : {c.reply_to}</div>
            </Comment.Metadata>
            <Comment.Text>{c.contents}</Comment.Text>
            <Comment.Actions>
            </Comment.Actions>
        </Comment.Content>
        </Comment>
        </div> 
        }
        
        {/* Check reply if reply in meta data display replay to user_id name and tab */}
        {reply == true && c.comment_id == csid  && <Form reply>
        <Box sx={{ width: 500,maxWidth: '100%', }}>
        <TextField fullWidth id="fullWidth" onChange = { (e) => setReplyComment(e.target.value)} />
        </Box>
        <Button variant="contained" color="success" onClick={() => {makeReply(c.comment_id,props.id)}}>
        Reply
        </Button>
        <Button variant="contained" color="error" onClick={() => {  setReply(false)}}>
        Cancel
        </Button>
        </Form>}
        </>
      )
      })}
   
          

        <Form reply>
        <Box sx={{ width: 500,maxWidth: '100%', }}>
        <TextField fullWidth id="fullWidth" onChange = { (e) => setComment(e.target.value)} />
        </Box>
        <Button variant="contained" color="success" onClick={() => { postComment(requestoption)}}>
        Post Comment
        </Button>
        </Form>
      </Comment.Group>               
    </>
  )
}

export default Comments;