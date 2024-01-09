import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';



export default function Event(props){
    const list = props.lists
    const handleEventDetail = (id) => {
        window.location.href = '/eventdetails/?id=' + id
    }
    return(
        <>
        <Grid item xs={4}>
            <Card sx={{ maxWidth: 500 }} onClick={()=> handleEventDetail(list.event_id)}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {list.event_name}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={5}>
                            <CardMedia
                                component="img"
                                height="230"
                                image={list.image}
                                alt="green iguana"
                            />
                        </Grid>
                        <Grid item xs={7}>
                            <Typography component="h2" variant="h5">
                                {list.holding_time}
                            </Typography>
                                <br/>
                            <Typography variant="subtitle1" color="text.secondary">
                                {list.location}
                            </Typography>
                            <br/>
                            <Typography variant="h4" color="primary">
                                ${list.price}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>

                </>
                
            )
        }
