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
import CardMedia from '@mui/material/CardMedia';
import WalletImg from '../../assets/wallet.jpg';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import NavPage from "../../components/Nav/index"


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

// This code is used to display the wallet section of 
// account page of a logged in user 

export default function Wallet() {

    const [open, setOpen] = React.useState(true);
    const [Banlance, setbanlance] = React.useState('');
    const [Point, setPoint] = React.useState('');
    
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

    // Get wallet detail of the user and set relevent informaiton 
    React.useEffect(() => {
        fetch('http://127.0.0.1:5000/account/get_wallet_detail', requestoption)
        .then((r) => {
            if (r.status === 200) {
            r.json().then((data) => {
                setbanlance(data.money)
                setPoint(data.reward_points)
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
                <AppBar position="absolute" open={open}>
                <NavPage name="Wallet" />
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
                            <React.Fragment>
                                <Typography variant="h6" gutterBottom>
                                    Wallet
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <CardMedia
                                            component="img"
                                            height="270"
                                            image={WalletImg}
                                            alt="green iguana"
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="h1" color="primary">
                                            ${Banlance}
                                        </Typography>
                                        <Typography component="h2" variant="h5">
                                            Reward Points: {Point}
                                        </Typography>
                                        <Typography variant="subtitle1" color="text.secondary">
                                            10 Points = $1
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </React.Fragment>
                            <React.Fragment>
                            </React.Fragment>
                            <Grid container item xs={12} direction="row-reverse">
                        </Grid>
                            <Stack spacing={2} direction="row" style={{ marginTop: '20px' }}>
                                <Button variant="outlined" onClick={ e => window.location.href='/rewardpointsshop' }>Reward Points Shop</Button>
                                {(sessionStorage.getItem('is_host'))==='true'?<Button variant="outlined" onClick={ e => window.location.href='/hostitem' }>My Item</Button>:<Button variant="outlined" onClick={ e => window.location.href='/myitem' }>MyItem</Button>}
                                {(sessionStorage.getItem('is_host'))==='true'?<Button variant="outlined" onClick={ e => window.location.href='/additem' }>Add Item</Button>:<></>}
                            </Stack>
                        </Paper>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
