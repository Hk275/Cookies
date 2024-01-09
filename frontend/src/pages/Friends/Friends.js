import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MainListItems from '../../components/Menu/listItem'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import NavPage from "../../components/Nav/index"
import FreindImage from "../../assets/FB.jpg"

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

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


function Cancel(prpos){

    const handleSubmit = () => {

        const jsonstring = JSON.stringify({
            token:sessionStorage.getItem('token'),
            u_id:sessionStorage.getItem('u_id'),
            booking_id: prpos.id
        });
      
      
        const requestoption = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonstring,
        };
      
        fetch('http://127.0.0.1:5000/account/current_order/cancel', requestoption)
        .then((r) => {
          if (r.status === 200) {
            r.json().then((data) => {
              console.log(data);
              alert('success');
              window.location.href = '/currentorders'
            });
           
          } else {
            r.json().then((data) => {
            });
          }
        })
    };
    return (
        <>
        <Button
            variant="contained"
            sx={{ mt: 3, ml: 1 }}
            color="error"
            onClick = {handleSubmit}
        >
            Cancel
        </Button>
        </>
    )
}

// Using the token and the  u_id of the user 
// display their friends, and any accept/decline any freind requests they 
// may have 
export default function Freinds() {

    const [open, setOpen] = React.useState(true);
    const [freindReqList, setfreindReqList] = React.useState([])
    const [noRequest, setnoRequests] = React.useState(false)
    const [lists, setlist] = React.useState([]);


    const toggleDrawer = () => {
        setOpen(!open);
    };
    const jsonstring = JSON.stringify({
        u_id:sessionStorage.getItem('u_id'),
        token:sessionStorage.getItem('token'),
        
    });
  
  
    const requestoption = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonstring,
    };
    

    // Get current Freinds 
    React.useEffect(() => {
    fetch('http://127.0.0.1:5000/friend/get_friends', requestoption)
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

    // Get freind requests and display if any 
    const fetchFreindReq = (requestoption ) => {
      fetch('http://127.0.0.1:5000/friend/get_friend_requests', requestoption)
            .then((r) => {
            if (r.status === 200) {
                r.json().then((data) => {
                setfreindReqList(data)
                if(freindReqList.length == 0) {
                    setnoRequests(true)
                }
                
                });
          } else {
            r.json().then((data) => {
              console.log(data);
            });
          }
        })
    }

    // Accept freind requests 
const acceptRequest = (f_ids) => {
      const jsonstring = JSON.stringify({
        u_id:sessionStorage.getItem('u_id'),
        token:sessionStorage.getItem('token'),
        f_id:f_ids
      });
  
  
    const requestoption = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: jsonstring,
    };
      fetch('http://127.0.0.1:5000/friend/accept_friend_request', requestoption)
            .then((r) => {
            if (r.status === 200) {
                r.json().then((data) => {
                });
          } else {
            r.json().then((data) => {
              console.log(data);
            });
          }
        })
    }

// Decline the friend request
    const decline = (f_ids) => {

        const jsonstring = JSON.stringify({
            u_id:sessionStorage.getItem('u_id'),
            token:sessionStorage.getItem('token'),
            f_id:f_ids
          });
      
      
        const requestoption = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: jsonstring,
        };

          fetch('http://127.0.0.1:5000/friend/refuse_friend_request', requestoption)
                .then((r) => {
                if (r.status === 200) {
                    r.json().then((data) => {
                    });
              } else {
                r.json().then((data) => {
                  console.log(data);
                });
              }
            })
    }

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                <NavPage name="Freinds" />
                </AppBar>
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
                                   Current Freinds
                                </Typography>
                                <Grid container spacing={2}>
                                <Grid item xs={12} id= "1" >
                                    <Card>
                                      {lists.map((list, idx) => {
                                        {
                                    return (
                                        <>
                                            <Grid container spacing={2}>
                                            <Grid item xs={12} id= {list.event_id} >
                                                <Card>
                                                    <CardContent>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={5}>
                                                                <CardMedia
                                                                    component="img"
                                                                    height="200"
                                                                    image = {list.image}
                                                                    alt="user profile image"
                                                                />
                                                            </Grid>
                                                            <Grid item xs={7}>
                                                                <Typography component="h2" variant="h4" style={{ marginBottom: '30px' }}>
                                                                  Name : {list.first_name} {list.last_name}
                                                                </Typography>
                                                                <Typography component="h2" variant="h4" style={{ marginBottom: '30px' }}>
                                                                  Email : {list.email}
                                                                </Typography>
                                                                <Typography component="h2" variant="h4">
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                        </>
                                        
                                    )
                                    }
                                }
                                )
                                } 
                                    </Card>
                                </Grid>
                                </Grid>
                                <br/>

                                
                                
                                 <Button onClick = {() => {fetchFreindReq(requestoption)}}> View Freind Requests </Button>  
                                {freindReqList.map((list, idx) => {
                                        {
                                    return (
                                        <>
                                            <Grid container spacing={2}>
                                            <Grid item xs={12} id= {list.event_id} >
                                                <Card>
                                                    <CardContent>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={5}>
                                                                <CardMedia
                                                                    component="img"
                                                                    height="200"
                                                                    image = {FreindImage}
                                                                    alt="green iguana"
                                                                />
                                                            </Grid>
                                                            <Grid item xs={7}>
                                                                <Typography component="h2" variant="h4" style={{ marginBottom: '30px' }}>
                                                                  Freind Request from : {list.f_id}
                                                                </Typography>
                                                                <Button variant="contained" color="success" onClick = {()=> {acceptRequest(list.f_id)}}> Accepet</Button>  <Button variant="contained" color="error" onClick = {() => {decline(list.f_id)}}> Decline</Button>
                                                                <Typography component="h2" variant="h4">
                                                                </Typography>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                        </>
                                        
                                    )
                                    }
                                }
                                )
                                } 
                                {noRequest &&  <Typography component="h2" variant="h4" style={{ marginBottom: '30px' }}>
                                                                  No New Requests
                                                                </Typography>}
                            </React.Fragment>
                        </Paper>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
