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
import NavPage from "../../components/Nav/index"
import  MainListItems  from '../../components/Menu/listItem'
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';


const drawerWidth = 240;


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



    const history = useHistory();

    const [img,setImg] = React.useState('');
    const convertToBase64 = (file) => {
        
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
            resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
            reject(error);
            };
        });
        };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertToBase64(file);
        setImg(base64)
        };

    const is_Host =  sessionStorage.getItem('is_host')

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                <NavPage name="Edit Account" />
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
                            <form onSubmit = {(e) => handleSubmitRequest(e, email, firstName, lastName, DOB, history, address, city, country, postcode,img)}> 
                            <React.Fragment>
                                <Typography variant="h6" gutterBottom>
                                    Account Information
                                </Typography>
                                {/* For submission create Form */}
                                User Account: {email}
                                <br/>
                                
                                <Grid container spacing={3}>
                                    
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            id="outlined-required"
                                            placeholder = {firstName}
                                            helperText= "First Name"
                                            fullWidth
                                            onChange = {e => setFirstName(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            
                                            id="outlined-required"
                                            placeholder = {lastName}
                                            helperText="Last Name"
                                            fullWidth
                                            onChange = {e => setlastName(e.target.value)}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            id="outlined-required"
                                            type="date"
                                            placeholder = {DOB}
                                            helperText="Enter your DOB"
                                            fullWidth
                                            onChange = {e => setDOB(e.target.value)}

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
                                            <Input id="contained-button-file" multiple type="file" accept=".jpeg, .png, .jpg"
                                                onChange={(e) => handleFileUpload(e)}/>
                                                <Button variant="contained" component="span">
                                                    Upload New Profile Pic
                                                </Button>
                                            </label>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </React.Fragment>

                           {is_Host == 'true' && <React.Fragment>
                                <Typography variant="h6" gutterBottom>
                                    Office Address
                                </Typography>
                                <Grid item xs={12}>
                                    <TextField
                                        id="outlined-required"
                                        placeholder = {address}
                                        helperText="Street Address"
                                        fullWidth
                                        onChange = {e => setsetAddress(e.target.value)}

                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="outlined-required"
                                        placeholder = {city}
                                        helperText="City"
                                        fullWidth
                                        onChange = {e => setsetAddress(e.target.value)}

                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                         id="outlined-required"
                                         placeholder = {country}
                                         helperText="Country"
                                         fullWidth
                                         onChange = {e => setCountry(e.target.value)}

                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                         id="outlined-required"
                                         placeholder = {postcode}
                                         helperText="Post code"
                                         fullWidth
                                         onChange = {e => setPostcode(e.target.value)}

                                    />
                                </Grid>
                            </React.Fragment>}
                            <React.Fragment>
                                <input class="submit-btn" type="submit"/>
                            </React.Fragment>
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

const handleSubmitRequest = (event, email, firstName, lastName, DOB, history, address, city, country, postcode,img) => {
    event.preventDefault();
    
    // Some of the values have been set to pre-defined values 
    // as we do not require the actual details from the user as
    // our system is not required to actually store certain information
    // such as the payment 

    const jsonstring = JSON.stringify({
        token: sessionStorage.getItem('token'),
        last_name: lastName,
        first_name: firstName,
        email: email,
        card_num: "1234123412341234",
        expiry_date: "2000-12-23",
        CVV: '123',
        is_host: sessionStorage.getItem("is_host"),
        birthday: DOB,
        address: address,
        city: city,
        country: country,
        postcode: postcode, 
        organization_name: ' 12',
        phone_num: "asdsa",
        image: img
      });

      const requestoption = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonstring,
      };

  
        fetch('http://127.0.0.1:5000/account/edit_myAccount', requestoption)
        .then((r) => {
          if (r.status === 200) {
            r.json().then((data) => {
              console.log(data);
              // Store Token and Store u_Id
              history.push('/account')
            });
            
          } else {
            r.json().then((data) => {
            });
          }
        })
      
}