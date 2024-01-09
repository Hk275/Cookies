import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MainListItems from '../../components/Menu/listItem';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import NavPage from "../../components/Nav/NavBarAcc"

const drawerWidth = 240;


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
        },
    }),
);

const mdTheme = createTheme();

// This code will be used to get the previous bookings 
// for the paticulur custome r

export default function PastBookings() {
    const [open, setOpen] = React.useState(true);
    const [lists, setlist] = React.useState([]);

    const toggleDrawer = () => {
        setOpen(!open);
    };
    const jsonstring = JSON.stringify({
        token:sessionStorage.getItem('token'),
        email:sessionStorage.getItem('u_id'),
    });
  
  
    const requestoption = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonstring,
    };
    

    // Get a list of the customers prevuous bookings in
    // and store them 
    React.useEffect(() => {
    fetch('http://127.0.0.1:5000/view/get_customer_past_events', requestoption)
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
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <NavPage name="Past Bookings" />
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        <MainListItems />
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                            <React.Fragment>
                                <Typography variant="h6" gutterBottom>
                                    Past Bookings
                                </Typography>
                                {lists.map((list, idx) => {
                                        {
                                    return (
                                        <>
                                            <Grid container spacing={2}>
                                            <Grid item xs={12} id= {list.event_id} >
                                                <Card onClick={() => {
                                                    window.location.href = '/eventdetails/?id=' + list.event_id
                                                  
                                                }}>
                                                    <CardContent>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={5}>
                                                                <CardMedia
                                                                    component="img"
                                                                    height="200"
                                                                    image={list.image}
                                                                    alt="green iguana"
                                                                />
                                                            </Grid>
                                                            <Grid item xs={7}>
                                                                <Typography component="h2" variant="h4" style={{ marginBottom: '30px' }}>
                                                                    Event Name: {list.event_name}
                                                                </Typography>
                                                                <Typography component="h2" variant="h4" style={{ marginBottom: '30px' }}>
                                                                    Event Date: {list.holding_time}
                                                                </Typography>
                                                                <Typography component="h2" variant="h4">
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                        <br/>
                                        </>
                                        
                                    )
                                    }
                                }
                                )
                                }
                            </React.Fragment>
                        </Paper>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}