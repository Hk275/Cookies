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
import AddIcon from '@mui/icons-material/Add';

const theme = createTheme();

/**
 * using this component to press buy button and buy things
 */

function Buy(prpos){
    console.log(prpos)

    const handleSubmit = () => {

        const jsonstring = JSON.stringify({
            token:sessionStorage.getItem('token'),
            u_id:sessionStorage.getItem('u_id'),
            item_id:prpos.id
        });
      
      
        const requestoption = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: jsonstring,
        };

        // Make fetch call to purchase 
        fetch('http://127.0.0.1:5000/reward_shop/buy_item', requestoption)
        .then((r) => {
        if (r.status === 200) {
            r.json().then((data) => {
            alert('success');
            window.location.href = '/wallet'
            });
        
        } else {
            r.json().then((data) => {
                alert('You don\'t have enough reward points to purchase this item')
            });
        }
        })

    };
    return (
        <>
        <Button size="large" variant="contained" endIcon={<AddIcon />} onClick={handleSubmit}>
            BUY
        </Button>
        </>
    )
}


// This code is used to display the reward points shop 
// as our novel funciton 
export default function RewardPointsShop() {

  const [lists, setlist] = React.useState([]);

  const jsonstring = JSON.stringify({
      token:sessionStorage.getItem('token'),
      email:sessionStorage.getItem('u_id'),
  });


  const requestoption = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: jsonstring,
  };

  // Get all items 
  React.useEffect(() => {
  fetch('http://127.0.0.1:5000/reward_shop/fetch_items', requestoption)
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
                        <Button variant="outlined" onClick={e => window.location.href = '/wallet'}>Back</Button>

                            <Typography variant="h3" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                                All Items
                            </Typography>

                            <Grid container spacing={2}>
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
                                                                {list.price}
                                                            </Typography>
                                                            <Stack direction="row" spacing={2} alignItems="center">
                                                                <Buy id={list.item_id}/>
                                                            </Stack>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>                                        
                                        </>
                                        )}})}
                            </Grid>
                        </React.Fragment>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    );
}