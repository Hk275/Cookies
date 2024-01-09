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
import { useState } from 'react';
import { useHistory } from "react-router-dom";
import Nav from '../../components/Nav/index';

import  MainListItems  from '../../components/Menu/listItem'
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

const drawerWidth = 240;

const pages = ['Home Page'];

const Input = styled('input')({
    display: 'none',
});

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

function DashboardContent() {

    // Fetching Info abt user 
    const jsonstring = JSON.stringify({
        email :  sessionStorage.getItem('u_id'),
        token: sessionStorage.getItem('token')
        
      });
    
      const requestoption = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonstring,
      };
    

    const [email, setEmail] = useState([]);
    const [firstName, setFirstName] = useState([]);
    const [lastName, setlastName] = useState([]);
    const [DOB, setDOB] = useState([]);
    const [address, setAddress] = useState([]);
    const [city, setCity] = useState([]);
    const [country, setCountry] = useState([]);
    const [postcode, setPostcode] = useState([]);
    const [img, setImg] =useState();


    const getFromBackend  =  async ( req) =>{ 
        await fetch('http://127.0.0.1:5000/account/get_myAccount_profile', req)
        .then((r) => {
        if (r.status === 200) {
            r.json().then((data) => {
            console.log(data);
            // Store account details
            setEmail(data.email)
            setFirstName(data.first_name)
            setlastName(data.last_name)
            setDOB(data.birthday)
            setCity(data.city)
            setAddress(data.address)
            setCountry(data.country)
            setPostcode(data.postcode)
            if (data.image == null) {
                // Asign a random image 
                setImg("https://source.unsplash.com/random")
            } else {
                setImg(data.image)

            }
            });
      } else {
        r.json().then((data) => {
          console.log('i fire once');
          console.log(data);
        });
      }
    })
    }
    
    React.useEffect(() => {
        getFromBackend(requestoption);
    }, [])


    

    
    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };


   
    const is_Host =  sessionStorage.getItem('is_host')
    console.log(is_Host)

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                <Nav name = "Account Details" />
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
                        <MainListItems/>
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
                            <form> 
                            <React.Fragment>
                                <Typography variant="h6" gutterBottom>
                                    Account Information
                                </Typography>
                                {/* For submission create Form */}
                                
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            // required
                                            // id="firstName"
                                            // name="firstName"
                                            // label="First name"
                                            // fullWidth
                                            // autoComplete="given-name"
                                            // variant="outlined"
                                            // placeholder = {firstName}
                                            
                                            id="outlined-required"
                                            // defaultValue= {lastName}
                                            value = {firstName}
                                            helperText= "First Name"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            
                                            id="outlined-required"
                                            // defaultValue= 'sd'
                                            value = {lastName}
                                            helperText="Last Name"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="outlined-required"
                                            // defaultValue= 'sd'
                                            value = {email}
                                            helperText="Email"
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            id="outlined-required"
                                            // defaultValue= 'sd'
                                            value = {DOB}
                                            helperText="Enter your DOB"
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar
                                                alt="Remy Sharp"
                                                src={img}
                                                sx={{ width: 120, height: 120 }}
                                            /> 
                                            <label htmlFor="contained-button-file">
                                                
                                                    Profile Picture
                                                
                                            </label>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </React.Fragment>
                           { is_Host == 'true' && <React.Fragment>
                                <Typography variant="h6" gutterBottom>
                                    Office Address
                                </Typography>
                                <Grid item xs={12}>
                                    <TextField
                                        id="outlined-required"
                                        // defaultValue= 'sd'
                                        value = {address}
                                        helperText="Street Address"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="outlined-required"
                                        // defaultValue= 'sd'
                                        value = {city}
                                        helperText="City"
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                         id="outlined-required"
                                         // defaultValue= 'sd'
                                         value = {country}
                                         helperText="Country"
                                         fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                         id="outlined-required"
                                         // defaultValue= 'sd'
                                         value = {postcode}
                                         helperText="Post code"
                                         fullWidth
                                    />
                                </Grid>
                            </React.Fragment> }
                            </form>
                        </Paper>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default function Dashboard() {
    return <DashboardContent />;
}
