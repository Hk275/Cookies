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
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useState } from 'react';
import { useHistory } from "react-router-dom";
import MainListItems from '../../components/Menu/listItem'
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

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

function AddItemPage() {

    const [name, setName] = React.useState('');
    const [point, setPoint] = React.useState('');
    const [quantity, setQuantity] = React.useState('');

    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };


    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

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

    const history = useHistory();

    const jsonstring = JSON.stringify({
        token:sessionStorage.getItem('token'),
        u_id:sessionStorage.getItem('u_id'),
        item_name:name,
        image:img,
        num_items:quantity,
        price:point

      });
    console.log(jsonstring)
      const requestoption = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonstring,
      };
      const handleSubmit = () => {
        if(name === '')alert('name not been added')
        if(point === '')alert('reward point not been added')
        if(quantity === '')alert('quantity not been added')
        fetch('http://127.0.0.1:5000/account/wallet/create_item', requestoption)
        .then((r) => {
          if (r.status === 200) {
            r.json().then((data) => {
              console.log(data);
              alert('success');

              window.location.href='/wallet'
              
            });
           
          } else {
            r.json().then((data) => {
            });
          }
        })
    };

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
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
                            Add Item
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
                                <Button onClick={() => gotoMyAccount(history)} > My Account</Button>
                                <Button onClick={() => logout(history)}> Logout</Button>
                            </Menu>
                        </Box>
                    </Toolbar>
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
                            <form action="/rewardPointsShop">
                                <React.Fragment>
                                <Typography variant="h6" gutterBottom>
                                        Add Item
                                    </Typography>
                                    <Grid item xs={12}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <img
                                                alt="Remy Sharp"
                                                src={img}
                                                width="360" height="240"
                                                style={{ marginBottom: '20px' }}
                                            />
                                            <label htmlFor="contained-button-file">
                                                <Input id="contained-button-file" multiple type="file" accept=".jpeg, .png, .jpg"
                                                    onChange={(e) => handleFileUpload(e)} />
                                                <Button variant="contained" component="span">
                                                    Upload
                                                </Button>
                                            </label>
                                        </Stack>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="outlined-required"
                                            // defaultValue= 'sd'
                                            placeholder="Item Name"
                                            helperText="Item Name"
                                            fullWidth
                                            onChange={(e)=>setName(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="outlined-required"
                                            // defaultValue= 'sd'
                                            placeholder='Reward Points'
                                            helperText="Reward Points"
                                            fullWidth
                                            onChange={(e)=>setPoint(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            id="outlined-required"
                                            // defaultValue= 'sd'
                                            placeholder="Quantity"
                                            helperText="Quantity"
                                            fullWidth
                                            onChange={(e)=>setQuantity(e.target.value)}
                                        />
                                    </Grid>
                                </React.Fragment>
                                <React.Fragment>
                                <Button variant="contained" component="span" onClick={handleSubmit}>
                                                    Submit
                                                </Button>
                                </React.Fragment>
                            </form>
                        </Paper>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default function AddItem() {
    return <AddItemPage />;
}

const gotoMyAccount = (history) => {
    history.push('/account')
}

const logout = (history) => {
    history.push('/')
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
                    console.log(data);
                    console.log(sessionStorage.getItem('u_id'));
                });
                // Making sure user is logged out no token is stored
                sessionStorage.setItem('token', '');



            } else {
                r.json().then((data) => {
                    console.log('i fire once');
                    console.log(data);
                    console.log(sessionStorage.getItem('u_id'));

                });
            }
        })
}

