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
import Paper from '@mui/material/Paper';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MainListItems from '../../components/Menu/listItem';
import NavPage from "../../components/Nav/NavBarAcc"
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import EventBlock from "../../components/AccountEventList/AccountEventList"
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

// Take the user to edit this paticulur event onto the edit event page 
function Edit(prop) {
  return (
    <Stack direction="row" spacing={2}>
      <Button variant="contained" color="success" onClick={() => {window.location.href = '/editevent/?id=' + prop.id}}>
        EDIT
      </Button>
    </Stack>
  );
}

// Display all upcoming events for the host 
export default function FutureEvents() {

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
  
  // Fetch call to get all events of a paticulr host
  React.useEffect(() => {
  fetch('http://127.0.0.1:5000/view/get_host_events', requestoption)
  .then((r) => {
      if (r.status === 200) {
      r.json().then((data) => {
          setlist(data);
          console.log(data)
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
                <NavPage name = "FutureEvent"/>
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
                                    FutureEvents
                                </Typography>
                                {lists.map((list, idx) => {
                                        {
                                    return (
                                        <>
                                    
                                            <EventBlock list ={list} id = {idx}/>
                                            
                                            <Edit id ={list.event_id}/>
                                            <br/>
                                        </>
                                        
                                    )}})}
                            </React.Fragment>
                        </Paper>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
