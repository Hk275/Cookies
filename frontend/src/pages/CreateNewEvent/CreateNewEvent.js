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
import MainListItems from '../../components/Menu/listItem'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Stack from '@mui/material/Stack';
import FormGroup from '@mui/material/FormGroup';
import NavPage from "../../components/Nav/NavBarAcc"


const drawerWidth = 240;


const Input = styled('input')({
    display: 'none',
});


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

// This file helps in createing the Create New event 
// page which is only avaibile for the hosts

export default function CreateNewEvent() {
    
    const [Name, setName] = React.useState('');
    const [DATE, setDATE] = React.useState('');
    const [Tag, setCardTag] = React.useState('Concert');
    const [seatnum, setSeatnum] = React.useState('');
    const [Price, setPrice] = React.useState('0');
    const [adultok, setAdult_ok] = React.useState(true);
    const [street, setStreet] = React.useState('');
    const [city, setCity] = React.useState('');
    const [country, setCountry] = React.useState('Austrilia');
    const [Decription, setDecription] = React.useState('');
    const [open, setOpen] = React.useState(true);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const handleAdult = () => {
        setAdult_ok(!adultok);
      };

    const location = `${street},${city},${country}`;

    const [img,setImg] = React.useState('');

    // Function to convert the image so we can store 
    // it in the database and use it again 
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


    const jsonstring = JSON.stringify({
        token:sessionStorage.getItem('token'),
        u_id:sessionStorage.getItem('u_id'),
        event_name:Name,
        discription:Decription,
        holding_time:DATE,
        price:Price,
        seats_num:seatnum,
        is_adult_only:adultok,
        tags:[Tag],
        location:location,
        image:img
      });

      const requestoption = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonstring,
      };

      // Handel the sumbit of the create event button 
      const handleSubmit = () => {
        if(Name === '')alert('Name not been added')
        if(Price === '')alert('Price not been added')
        if(DATE === '')alert('DATE not been added')
        if(seatnum=== '')alert('seatnum not been added')
        if(Decription=== '')alert('Decription not been added')
        if(street=== '')alert('Street adress not been added')
        if(city=== '')alert('State adress not been added')
        if(country=== '')alert('Country not been added')
        if(img=== '')alert('Image not been added')

        fetch('http://127.0.0.1:5000/event/creation', requestoption)
        .then((r) => {
          if (r.status === 200) {
            r.json().then((data) => {
              alert('success');
              window.location.href='/futureevents'
            });
           
          } else {
            r.json().then((data) => {
                alert(data.message);
            });
          }
        })
    };
    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                {/* Made a component for navPage starts from here take a look */}
                <NavPage name = "Create New Event"/>

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
                            <React.Fragment>
                                <Typography variant="h6" gutterBottom>
                                    Create New Event
                                </Typography>
                                <Grid container spacing={3}>
                                <Grid item xs={12}>
                                        <TextField
                                            required
                                            label="Event Name"
                                            fullWidth
                                            autoComplete="Organization Name"
                                            variant="standard"
                                            onChange = {e => setName(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        TAG:
                                        <select name="Account" id="bs" onChange = {e => setCardTag(e.target.value)}>
                                            <option value= 'Concert' >Concert</option>
                                            <option value="Movie">Movie</option>
                                            <option value= 'Sport' >Sport</option>
                                            <option value= 'Theatre' >Theatre</option>
                                        </select>
                                    </Grid> 
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            required
                                            inputProps={{ inputMode: 'numeric'}} 
                                            label="Ticket price"
                                            variant="standard"
                                            onChange = {e => setPrice(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        Date:
                                        <br/>
                                        <TextField
                                            type = "date"
                                            required
                                            variant="standard"
                                            onChange = {e => setDATE(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormGroup>
                                            <FormControlLabel control={<Checkbox defaultChecked />} label="18+" onClick = {handleAdult}/>
                                        </FormGroup>
                                    </Grid>
                                    <Grid item xs={12}>
                                        Seat number:
                                    <select name="Account" id="bs" onChange = {e => setSeatnum(e.target.value)}>
                                            <option value= '50' >Please choose a seat</option>
                                            <option value= '50' >50</option>
                                            <option value= "150">150</option>
                                            <option value= '400' >400</option>
                                        </select>
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
                                                    Upload
                                                </Button>
                                            </label>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </React.Fragment>
                            <React.Fragment>
                                <Typography variant="h6" gutterBottom>
                                    Event Address
                                </Typography>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        label="Street Address"
                                        fullWidth
                                        autoComplete="Organization Name"
                                        variant="standard"
                                        onChange = {e => setStreet(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <br/>Choose City:
                                    <select name="Account" id="bs" onChange = {e => setCity(e.target.value)}>
                                        <option value= 'Sydney' >Sydney</option>
                                        <option value='Melbourne'>Melbourne</option>
                                        <option value= 'Adelaide' >Adelaide</option>
                                        <option value= 'Brisbane' >Brisbane</option>
                                        <option value= 'Brisbane' >Perth</option>
                                    </select>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        id="on"
                                        name="on"
                                        label="Decription"
                                        fullWidth
                                        variant="standard"
                                        onChange = {e => setDecription(e.target.value)}

                                    />
                                </Grid>
                            </React.Fragment>
                            <React.Fragment>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        sx={{ mt: 3, ml: 1 }}
                                        onClick = {handleSubmit}
                                    >
                                        Publish
                                    </Button>
                                </Box>
                            </React.Fragment>
                        </Paper>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}


