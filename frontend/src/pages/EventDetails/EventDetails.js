import * as React from 'react';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Nav from '../../components/Nav/index';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import {useLocation} from "react-router-dom";
import Comments from '../../components/Comments/Comments'
import { useHistory } from "react-router-dom";
import Reccomendation from "../../components/ReccomendationEvent/ReccomendEventPage"

const theme = createTheme();

// This code is used to display the event details of a given event
// The id of the event is extraxted from the url, using the parameters
// a fetch call is done and the user is displayed the relevant details 
// about an event 

export default function Home() {
    const history = useHistory();

    const [eventName, setEventName] = React.useState('');
    const [eventDescription, setEventDescription] = React.useState('');
    const [eventDate, setEventDate] = React.useState('');
    const [eventPrice, setEventPrice] = React.useState('');
    const [eventimg, setEventimg] = React.useState('');
    const [eventSeats, setEventSeatAvail] = React.useState('')
    const search = useLocation().search;
    // getting event_id
    const name = new URLSearchParams(search).get('id');

    const jsonstring = JSON.stringify({
        event_id: name
      });
    
      const requestoption = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonstring,
      };

    
    // getting the relevent information to display for the event 
    React.useEffect(() => {
        
         fetch('http://127.0.0.1:5000/view/get_event_information', requestoption)
            .then((r) => {
            if (r.status === 200) {
                r.json().then((data) => {
                // Store the relevent details
                setEventName(data.event_name)
                setEventDescription(data.discription)
                setEventDate(data.holding_time)
                setEventPrice(data.price)
                setEventimg(data.image)
                setEventSeatAvail(data.total_available_seats)
                });
          } else {
            r.json().then((data) => {
              console.log(data);
            });
          }
        })
        
    },[])

    
    
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {/* Using the event id, get event name and replace */}
            <Nav name = "Event Details" />
            <main>
                <Container sx={{ py: 8 }} maxWidth="md">
                    <Paper
                        sx={{
                            position: 'relative',
                            backgroundColor: 'white',
                            color: '#fff',
                            mb: 4,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            backgroundImage: `url(${eventimg})`,
                        }}
                    >
                        
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                right: 0,
                                left: 0,
                                backgroundColor: 'rgba(0,0,0,.3)',
                            }}
                        />
                        
                        <Grid container>
                            
                            <Grid item md={6}>
                                
                                <Box
                                    sx={{
                                        position: 'relative',
                                        p: { xs: 3, md: 6 },
                                        pr: { md: 0 },
                                    }}
                                    height={350}
                                    
                                >
                                    
                                </Box>
                                
                            </Grid>
                        </Grid>
                    </Paper>
                    <Grid container spacing={2}>
                        
                        <Grid item xs={6}>
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    Event Name:
                                </Grid>
                                <Grid item xs={9}>
                                    {eventName}
                                </Grid>
                                <Grid item xs={3}>
                                    Event Date:
                                </Grid>
                                <Grid item xs={9}>
                                    {eventDate}
                                </Grid>
                                <Grid item xs={3}>
                                    18+:
                                </Grid>
                                <Grid item xs={9}>
                                    Yes
                                </Grid>
                                <Grid item xs={4}>
                                    Seats Left:
                                </Grid>
                                <Grid item xs={8}>
                                    {eventSeats}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={5}>
                            <Grid container spacing={2}>
                                <Grid item xs={5}>
                                    Event Description:
                                </Grid>
                                <Grid item xs={7}>
                                    {eventDescription}
                                </Grid>
                                <Grid item xs={5}>
                                    Ticket Price:
                                </Grid>
                                <Grid item xs={7}>
                                    {eventPrice}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} direction="row-reverse" spacing={2}>
                                <Typography component="h2" variant="h5" >
                                    <Stack spacing={2} direction="row">
                                    {((sessionStorage.getItem('token')=== '')||(sessionStorage.getItem('token')=== null))?<Button onClick={handleLogin} variant="outlined">Login</Button>:<Button onClick={() => { handleRedirectBookingPage(name) }} variant="outlined">Book</Button>}
                                    </Stack>
                                </Typography>
                        </Grid>
                    </Grid>
                    <Comments id= {name}/>
                </Container>
            </main>
            { <Reccomendation id = {name} /> }
        </ThemeProvider>
    );

   
}

// This will take it to event booking page 

const handleRedirectBookingPage = (name) => {
    const url1 = "/booking/?id=" + name
    const url2 = "/login"
    if(sessionStorage.getItem('is_host')==='true')window.location.href = url2
    window.location.href = url1
}

// If user is not logged in 
const handleLogin= () => {
    const url2 = "/login"
    window.location.href = url2
   }