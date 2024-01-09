import * as React from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Nav from '../../components/Nav/index';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

/**
 * This page are used for customers to view the item they purchase in reward system
 */
const theme = createTheme();

export default function CusItem() {

    const [lists, setlist] = React.useState([]);

    const jsonstring = JSON.stringify({
        token:sessionStorage.getItem('token'),
        u_id:sessionStorage.getItem('u_id'),
    });
  
    const requestoption = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonstring,
    };

    // Get list of bought_items for the customer 

    React.useEffect(() => {
    fetch('http://127.0.0.1:5000/account/wallet/bought_items', requestoption)
    .then((r) => {
        if (r.status === 200) {
        r.json().then((data) => {
            setlist(data.item_list);
        });
        } else {
        r.json().then((data) => {
        });
        }
    })
    }, [])
    
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Nav />
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
                <Container sx={{ py: 8 }} maxWidth="lg">
                    <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                        <React.Fragment>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                                    My Items
                                </Typography>
                                <Button variant="outlined" onClick={e => window.location.href = '/wallet'}>Back</Button>
                            </Stack>
                            {lists.map((list, idx) => {
                                        {
                                    return (
                                        <>
                                <Grid item xs={12}>
                                    <Card>
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
                                                    <Typography component="h2" variant="div" style={{ marginBottom: '10px' }} sx={{ fontWeight: 'bold' }}>
                                                        {list.item_name}
                                                    </Typography>
                                                    <Typography component="h5" variant="h5" style={{ marginBottom: '20px' }}>
                                                        {list.price} points
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>                                      
                                        </>
                                        
                                    )}})}
                            <Grid container spacing={2}>
                            </Grid>
                        </React.Fragment>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    );
}