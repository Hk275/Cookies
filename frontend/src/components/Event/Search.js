import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Event from './Event';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

/**
 * This components will be use in Home page
 * 
 */

export default function Search() {
    const [lists, setlist] = React.useState([]);
    const [type, setType] = React.useState('null');
    const [keyword, setKeyword] = React.useState('');
   
    const jsonstring = JSON.stringify({
        token:sessionStorage.getItem('token'),
        u_id:sessionStorage.getItem('u_id'),
        keyword:(keyword === '')?'null':keyword,
        tag:type,
      });

    const requestoption = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonstring,
      };

    // Function used to help fetch the relevent details 
    // from the search bar input by the user 
    const handleSubmit = () => {
        fetch('http://127.0.0.1:5000/view/search_event', requestoption)
        .then((r) => {
          if (r.status === 200) {
            r.json().then((data) => {
              console.log(data);
             setlist(data)
            });
           
          } else {
            r.json().then((data) => {
            });
          }
        })
    };
    
    return (

        <>
        <FormControl style={{marginTop:"15px"}}>
            <InputLabel id="demo-simple-select-label">Event Type</InputLabel>
            <Select
                id="demo-simple-select"
                defaultValue="null"
                label="Event Type"
                onChange={(e)=> setType(e.target.value)}
                >
                <MenuItem value="null">All Event Type</MenuItem>
                <MenuItem value='Sport'>Sport</MenuItem>
                <MenuItem value='Concert'>Concert</MenuItem>
                <MenuItem value='Movie'>Movie</MenuItem>
                <MenuItem value='Theatre'>Theatre</MenuItem> 
            </Select>
            </FormControl>
            <Box
                sx={{
                width: 1080,
                maxWidth: '100%',
                margin: '0 auto',
                }}
            >
            <TextField style={{marginTop:"15px"}} fullWidth id="fullWidth" label="Search by Name/Description" variant="outlined" onChange={(e)=> setKeyword(e.target.value)}/>
            
        </Box>
        <Button style={{marginTop:"15px"}} variant="outlined" onClick={handleSubmit}>S E A R C H</Button>
        <Grid container spacing={2}>
                
                <br/>
                {lists.map((list, idx) => {
                                {
                            return (
                                <>
                                <Event lists = {list}/>
                                </>
                                
                            )
                            }
                        }
                        )
                        }
                </Grid>
    </>
    );
  }


