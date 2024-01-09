import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

import Grid from '@mui/material/Grid';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';




/**
 * This components are use in FutureEvent/PastEvent/CurrentOrders/PastEvents
 * 
 */


export default function AccountFutureEvent(prop) {
    const list = prop.list
  return (
    <>
    <Grid container spacing={2}>
        <Grid item xs={12} id= {list.event_id} >
            <Card onClick={() => {
                window.location.href = '/eventdetails/?id=' + list.event_id
            
            }}>
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
                            <Typography component="h2" variant="h4" style={{ marginBottom: '30px' }}>
                                Event Name: {list.event_name}
                            </Typography>
                            <Typography component="h2" variant="h4" style={{ marginBottom: '30px' }}>
                                Event Date: {list.holding_time}
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
  );
}

