import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Nav from '../../components/Nav/index';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Event from '../../components/Event/Event';
import Search from '../../components/Event/Search';
import Upcoming from '../../components/Event/Upcomming';
import RecommandHomePgae from '../../components/RecommandationHome/RecommandHomePgae';

const theme = createTheme();


export default function Home() {

    const [location, setlocation] = React.useState('');
    const [lists, setlist] = React.useState([]);

    const regex1 = new RegExp(location, "g");
  
    const requestoption = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    };

    // Fetch the relevent details to be displayed on the home page 
    React.useEffect(() => {

    fetch('http://127.0.0.1:5000/view/get_home_page_list', requestoption)
    .then((r) => {

        if (r.status === 200) {
        r.json().then((data) => {
            setlist(data);
        });

        } else {
        r.json().then((data) => {
            console.log(data)
        });
        }
    })
    }, [])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Nav />
            <main>
            
                <Container sx={{ py: 8 }} maxWidth="xl">
                    <Grid container spacing={2}>
                        <Search/>
                    </Grid>
                    <span style={{ fontSize: '32px', marginRight: '15px', marginTop:"15px"}}>Upcoming event</span>
                    <br/>
                    <Grid container spacing={2}>
                        
                        <br/>
                        <Upcoming/>
                    </Grid>
                    <br/>
                        <Grid container spacing={2}>
                            
                            <Grid item xs={12}>
                                <span style={{ fontSize: '32px', marginRight: '15px'}}>Search by locations</span>
                                <FormControl>
                                    <InputLabel id="demo-simple-select-label">Location</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        defaultValue={10}
                                        label="Location"
                                        onChange={(e)=> setlocation(e.target.value)}
                                        >
                                        <MenuItem value={10}>Choose a place</MenuItem>
                                        <MenuItem value='Melbourne'>Melbourne</MenuItem>
                                        <MenuItem value='Sydney'>Sydney</MenuItem> 
                                        <MenuItem value='Brisbane'>Brisbane</MenuItem>
                                        <MenuItem value='Adelaide'>Adelaide</MenuItem>
                                        <MenuItem value='Perth'>Perth</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {lists.map((list, idx) => {
                                if(list.location.match(regex1)!== null){   
                                return (
                                    <>
                                        <Event lists = {list}/>
                                    </>
                                )}})}
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        
                        <Grid container spacing={2}>
                        <span style={{ fontSize: '32px', marginRight: '15px',marginTop: '20px', marginLeft: '30px'}}>Recommandation for you</span>
                        </Grid>

                        <RecommandHomePgae/>
                        <Grid item xs={12}>
                            </Grid>
                            <Grid container item xs={6} direction="row-reverse">

                            </Grid>
                        </Grid>

                    
                </Container>
            </main>
        </ThemeProvider>
    );
}