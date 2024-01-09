import * as React from 'react';
import Typography from '@mui/material/Typography';
import Event from '../Event/Event';


// This code is used to display the appropiate reccomendation for the user 
// based on the event id which is passed in as a booking

export default function ReccomendEventPage(props) {

    const [lists, setlist] = React.useState([]);

    const jsonstring = JSON.stringify({
        event_id: props.id
      });

    const requestoption = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonstring,
      };
      
      // Get event reccomendation based on our algorithim which we have implemented 
      // in the backend 

      React.useEffect(() => {
        fetch('http://127.0.0.1:5000/view/event_based_recommedation', requestoption)
        .then((r) => {
            if (r.status === 200) {
            r.json().then((data) => {
                setlist(data);
            });
            } else {
            r.json().then((data) => {
            });
            }
        })
        }, [])
    
    return (

        <>
        <Typography component="h2" variant="h3" align="center">Recommandation for you</Typography>
                {lists.map((list, idx) => {
                                {
                            return (
                                <>
                                <Event lists = {list}/>
                                </> 
                            )}})}
    </>
    );
  }

