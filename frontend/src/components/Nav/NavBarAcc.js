import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import { useHistory } from "react-router-dom";


const drawerWidth = 240;


/**
 * The design of this Appbar using the Material UI's open source code
 * And the URL below is the source of the reference code: 
 * https://github1s.com/mui/material-ui/blob/v5.9.2/docs/data/material/getting-started/templates/dashboard/Dashboard.js
 * This code is used accross multiple files 
 * */ 
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


export  default function NavBarAcc(props) {

    const history = useHistory();

    const [open, setOpen] = React.useState(true);

    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const toggleDrawer = () => {
        setOpen(!open);
    };


    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };


    return (
    <AppBar position="absolute" open={open}>
    <Toolbar
        sx={{
            pr: '24px', // keep right padding when drawer closed
        }}
    >
        <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
            }}
        >
            <MenuIcon />
        </IconButton>
        <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
        >
            {props.name}
        </Typography>
        <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
            </Tooltip>
            <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
            >
            <Button onClick = {() => gotoMyAccount(history)} > My Account</Button>
            <Button onClick = {() => logout()}> Logout</Button>
            </Menu>
        </Box>
    </Toolbar>
</AppBar>)
}


// Additoinal functions which are usefull 

// Go to the account user 
const gotoMyAccount = (history) => {
  history.push('/account')
}


// Helps the user to logout from the system 
const logout = () => {

  const jsonstring = JSON.stringify({
     token: sessionStorage.getItem('token')
    });

  const requestoption = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: jsonstring,
    };

  fetch('http://127.0.0.1:5000/auth/logout', requestoption)
    .then((r) => {
      if (r.status === 200) {
        r.json().then((data) => {
            window.location.href = '/'
        });
        sessionStorage.setItem('token', '');

      } else {
        r.json().then((data) => {
        });
      }
    })
}