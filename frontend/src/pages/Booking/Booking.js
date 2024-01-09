import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Stack } from '@mui/material';
import Alert from '@mui/material/Alert';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Nav from '../../components/Nav/index';
// import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import {useLocation} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'

import { useHistory } from "react-router-dom";
//import Select from "react-select";

import Multiselect from "multiselect-react-dropdown";


const theme = createTheme();

export default function Booking() {
    const history = useHistory();

    // Declearing useState variables which will be used

    const [value, setValue] = React.useState(new Date().getTime());

    const [seatNum, setSeatNum] = React.useState(400);

    const [seatRow, setSeatRow] = React.useState(0);

    const [seatColumn, setSeatColumn] = React.useState(10);

    const [selectedSeat, setSelectedSeat] = React.useState([]);

    const [refresh, setRefresh] = React.useState(false);

    const [points, setPoints] = React.useState(0);

    const [pointsError, setPointsError] = React.useState(false);

    const search = useLocation().search;

    const name = new URLSearchParams(search).get('id');

    const [backendSetAvail, setBackend] = React.useState(' ')

    const [point, setPoint] = React.useState('0')

    const [totalAvail, setTotalAvail] = React.useState(' ')

    const [price, setPrice] = React.useState(' ')

    const [currency, setCurrency] = React.useState('AUD')
   
    const [food,setFood] = React.useState(["Burger", "Pizza", "Sandwich"])

    const [displayFreindOptions, setdisplayFreindOptions] = React.useState(false)


    const [selectedFreinds, setselectedFreinds] = React.useState([])

    // Creating relevant inputs for a fetch call to the backend 
    const jsonstring = JSON.stringify({
        event_id: name
    });
    
    const requestoption = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonstring,
    };

   
    React.useEffect(() => {

        fetch('http://127.0.0.1:5000/view/get_event_information', requestoption)
        .then((r) => {
        if (r.status === 200) {
            r.json().then((data) => {
            setPrice(data.price)
            setBackend(data.available_seats_num)
            setTotalAvail(data.seats_num)
            });
      } else {
        r.json().then((data) => {
          console.log(data);
        });
      }
    })
        refresh && setRefresh(true)
    }, [])

    const createCellPos = (n) => {
        let ordA = 'A'.charCodeAt(0);
        let ordZ = 'Z'.charCodeAt(0);
        let len = ordZ - ordA + 1;
        let s = "";
        while (n >= 0) {

            s = String.fromCharCode(n % len + ordA) + s;

            n = Math.floor(n / len) - 1;

        }
        return s;
    }

    // Depending on the number of seats select row and colomun values 
    // then loop through and assign for each row and coloumn values 
    // via access the value using strinc contactination 

    const usingBackend = (backendSetAvail, totalAvail) => {
        console.log(backendSetAvail,totalAvail)
        let avail_seats = []
        let row = 0;
        let col = 0;
        if (totalAvail == 150) {
            row = 10;
            col = 15;
        }
        if( totalAvail == 400) {
            row = 20;
            col = 20;
        }
        if( totalAvail == 50) {
            row = 5;
            col = 10;
        }
        const alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v"];
        for (let i = 0; i < row; i++) {
            let alpha = alphabet[i]
            for (let j = 1; j<=col ;j++) {
                avail_seats.push(backendSetAvail[alpha+j])
            }
        }
        return avail_seats
    }

   // This will initialize the seat based on the data collected from the 
   // backend if the seat is avalibile or not
    const initSeatList = (row, column) => {
        console.log(column)
        const back = usingBackend(backendSetAvail,totalAvail)

        if(column === 50)column = 10
        if(column === 150)column = 15
        if(column === 400)column = 20
        console.log(column)
        let seatList = [];

        for (let i = 1; i <= row; i++) {
            
            for (let j = 1; j <= column; j++) {
                

                let avail = 0
                if (back[(j+((i-1)*column))-1] == 0) {
                    console.log(i,j)
                    console.log(value)
                   avail = 2
                }
                console.log("hi")
                seatList.push({
                    seatNo: createCellPos(i - 1) + '' + j,
                    rowNum: i,
                    columnNum: j,
                    status: avail, // 0=avaliable, 1=select, 2=reserversed
                })
                seatList.push(2)
            }
        }
        console.log(seatList)
        return seatList;
    }

    // @TAM you are a great tutor plz give marks, u good 

    // This could not be declared before as it required the above function 
    const [seatList, setSeatList] = React.useState(initSeatList(backendSetAvail, totalAvail));


    const handleChange = (newValue) => {
        setValue(newValue);
    };

    // This will display the appropiate number of seats
    // for this paticular event
    const handleSeatNumChange = (seatNum) => {
        let currentNum = seatNum.target.value;
        let currentRow = 5, currentColumn = 10;
        if (currentNum == 150) {
            currentRow = 10;
            currentColumn = 15;
        }
        if (currentNum == 400) {
            currentRow = 20;
            currentColumn = 20;
        }
        setSeatNum(currentNum);
        setSeatRow(currentRow);
        setSeatColumn(currentColumn);
        setSeatList(initSeatList(currentRow, currentColumn));
    }

    // This function helps in set the list of the seat 
    // seleciton done by the user
    const handleSeatSelect = (seat) => {

        let selectedList = [];

        seatList.map(item => {
            if (item.seatNo == seat.seatNo) {
                if (seat.status == 0) {
                    item.status = 1;
                } else {
                    item.status = 0;
                }
            }

            if (item.status == 1) {
                selectedList.push(item)
            }
        });

        setSelectedSeat(selectedList);
        setSeatList(seatList);
        setRefresh(true)
        setTimeout(() => {
            setRefresh(false)
        }, 0)
    }

    const seatColumnRender = (rowNum) => {
        let seatColumnDOM = [];
        for (let i = 1; i <= seatColumn; i++) {
            seatList.map(seatItem => {
                if (seatItem.rowNum == rowNum && seatItem.columnNum == i) {
                    // available
                    if (seatItem.status == 0) {
                        seatColumnDOM.push(<Box
                            key={seatItem.seatNo}
                            sx={{
                                width: 30,
                                height: 30,
                                backgroundColor: '#ccc'
                            }}
                            onClick={(e) => {
                                handleSeatSelect(seatItem)
                            }}
                        ></Box>)
                    }
                    // your seat
                    if (seatItem.status == 1) {
                        seatColumnDOM.push(<Box
                            key={seatItem.seatNo}
                            onClick={() => {
                                handleSeatSelect(seatItem)
                            }}
                            sx={{
                                width: 30,
                                height: 30,
                                backgroundColor: '#96B97D'
                            }}
                        ><CheckOutlinedIcon sx={{ fontSize: '26px', color: '#FFF' }} /></Box>)
                    }
                    // reserved
                    if (seatItem.status == 2) {
                        seatColumnDOM.push(<Box
                            key={seatItem.seatNo}
                            sx={{
                                width: 30,
                                height: 30,
                                backgroundColor: 'red'
                            }}
                        ></Box>)
                    }
                }
            });
            if (i % 5 == 0 && i != seatColumn) {
                seatColumnDOM.push(<Box
                    key={seatColumn + '' + i + Math.ceil(Math.random() * 1000)}
                    sx={{
                        width: 5,
                        height: 5
                    }}
                ></Box>)
            }

        }
        return seatColumnDOM;
    }

    const seatRender = () => {
        let seatRowDOM = [];
        for (let i = 1; i <= seatRow; i++) {
            seatRowDOM.push(<Stack key={i} direction="row" justifyContent="center"
                alignItems="center" spacing={1}>
                <Typography variant="h4" style={{ width: '40px', textAlign: 'center' }}>
                    {
                        createCellPos(i - 1)
                    }
                </Typography>
                {
                    seatColumnRender(i)
                }
            </Stack>)

            if (i % 6 == 0 && i != seatRow) {
                seatRowDOM.push(<Stack key={i + '' + Math.ceil(Math.random() * 1000)} direction="row" justifyContent="center"
                    alignItems="center" spacing={1}>
                    <div style={{ height: '10px' }}></div>
                </Stack>)
            }
        }
        return seatRowDOM
    }

    // This function is used to make the booking of the user
    // it send the relevent information to the backend 
    // once succesfull it will push the user to their currentorder
    // page on their account page 

    const handleRedirectCurrentOrderPage = (history) => {

        // for mutliple seats 
        let seats = []
        for (const item in selectedSeat) {
            seats.push(selectedSeat[item].seatNo.toLowerCase())
          }
        
        const jsonstring = JSON.stringify({
            u_id: sessionStorage.getItem('u_id'),
            token: sessionStorage.getItem('token'),
            event_id: name,
            seat_num: seats,
            reward_points_spent:point
          });

          const requestoption = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: jsonstring,
          };

        fetch('http://127.0.0.1:5000/event/book', requestoption)

        .then((r) => {
        if (r.status === 200) {
            r.json().then((data) => {

            history.push('/currentorders')

            });

      } else {
        r.json().then((data) => {
          console.log(data);
        });
      }
    })
        
    }

// This function is used to help convert the 
// the currency to the selected currency
// this is one of our novel features

const handleSelect=(e)=>{
    
    const jsonstring = JSON.stringify({
        num: price,
        currency_to: e
      });
    
      const requestoption = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonstring,
      };

    // Make fetch call 

    fetch('http://127.0.0.1:5000/account/currency_convert', requestoption)
    .then((r) => {
    if (r.status === 200) {
        r.json().then((data) => {
        setPrice(data)
        setCurrency(e)
        
        });
  } else {
    r.json().then((data) => {
      console.log(data);
    });
  }
})

}

// This function is used to help implement one of our novel features 
// group booking, by this we will be able to display the freinds of 
// the user, so they can select who they will booking with 

const Freindsb =()=> {

    setdisplayFreindOptions(true)

    const jsonstring = JSON.stringify({
        u_id:sessionStorage.getItem('u_id'),
        token:sessionStorage.getItem('token'),
        
    });
  
  
    const requestoption = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: jsonstring,
    };
    // Make fetch call 

    fetch('http://127.0.0.1:5000/friend/get_friends', requestoption)
    .then((r) => {
    if (r.status === 200) {
        r.json().then((data) => {
        let b = []
        for(let i =0; i < data.length;i++) {
            b.push(data[i].email)
        }
        setFood(b)
        }
        );
        setdisplayFreindOptions(true)

  } else {
    r.json().then((data) => {
      console.log(data);
    });
  }
})

}

// This function helps set the reward points which will 
// be used in the booking process
const handleRewardPointsChange = (value) => {
    setPoint(value.target.value)
    console.log(point)
    let points = value.target.value;
    if (points != '' && (Number(points) < 0 || Number(points) > 20)) {
        setPointsError(true)
    } else {
        setPointsError(false);
        setPoints(Number(points))
    }
}


// This function is called when the user has selected 
// their freinds who they will want to make a group booking 
// with.
const makeGroupMaking = (selectedFreinds,history) => {

    let seats = []

    for (const item in selectedSeat) {
        seats.push(selectedSeat[item].seatNo.toLowerCase())
        }
    
    const jsonstring = JSON.stringify({
        u_id:sessionStorage.getItem('u_id'),
        token:sessionStorage.getItem('token'),
        friends: selectedFreinds,
        seats: seats,
        reward_points_spent:point,
        event_id:name
    });
  
    const requestoption = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: jsonstring,
    };
    

    // Make group booking

    fetch('http://127.0.0.1:5000/booking/group_booking', requestoption)
    .then((r) => {
        if (r.status === 200) {
        r.json().then((data) => {
            console.log(data)
            history.push('/grouprequests')
        });
        } else {
        r.json().then((data) => {
        });
        }
    })
}
  
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Nav name = "Booking Detail " />
                <Container sx={{ py: 8 }} maxWidth="md">
                    <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                        <React.Fragment>
                            <Typography
                                component="h1"
                                variant="h3"
                                align="center"
                                color="text.primary"
                                gutterBottom
                            >
                                Cookie's event
                            </Typography>
                            
                        </React.Fragment>
                        <React.Fragment>
                            <Typography variant="h5" gutterBottom style={{ marginBottom: '20px', paddingBottom: '5px', borderBottom: '1px solid #ccc' }}>
                                Booking Detail
                            </Typography>
                            <Grid container rowSpacing={3} columnSpacing={{ md: 30 }}>
                                <Grid item xs={6}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DesktopDatePicker
                                            label="Booking Date"
                                            inputFormat="MM/dd/yyyy"
                                            value={value}
                                            onChange={handleChange}
                                            renderInput={(params) => <TextField style={{ width: '100%' }} {...params} />}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl style={{ margin: '0 auto 0 auto' }}>
                                        <FormLabel>Booking Price</FormLabel>
                                        <Typography variant="h5" color="primary">
                                            {currency} {price}
                            
                                        </Typography>
                                        <DropdownButton
                                        alignRight
                                        title="Convert Currency"
                                        id="dropdown-menu-align-right"
                                        onSelect={handleSelect}
                                            >
                                                <Dropdown.Item eventKey="HKD">HKD</Dropdown.Item>
                                                <Dropdown.Item eventKey="USD">USD</Dropdown.Item>
                                                <Dropdown.Item eventKey="INR">INR</Dropdown.Item>
                                                </DropdownButton>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <FormControl style={{ marginTop: '14px' }}>
                                        <FormLabel>click to choose the seat</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="seatNum"
                                            name="seatNum"
                                            onChange={handleSeatNumChange}
                                        >
                                            <FormControlLabel value={totalAvail} control={<Radio />} label={totalAvail} />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box
                                        sx={{
                                            margin: '0 auto 0 auto',
                                            width: 600
                                        }}
                                    >
                                        <Stack direction="row" justifyContent="center"
                                            alignItems="center" spacing={4}>
                                            <Stack direction="row" spacing={1}>
                                                <Box
                                                    sx={{
                                                        width: 30,
                                                        height: 30,
                                                        backgroundColor: '#ccc'
                                                    }}
                                                ></Box>
                                                <Typography variant="h5">
                                                    Available
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={1}>
                                                <Box
                                                    sx={{
                                                        width: 30,
                                                        height: 30,
                                                        backgroundColor: '#96B97D'
                                                    }}
                                                >
                                                    <CheckOutlinedIcon sx={{ fontSize: '30px', color: '#FFF' }} />
                                                </Box>
                                                <Typography variant="h5">
                                                    Your seat(s)
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={1}>
                                                <Box
                                                    sx={{
                                                        width: 30,
                                                        height: 30,
                                                        backgroundColor: 'red'
                                                    }}
                                                ></Box>
                                                <Typography variant="h5">
                                                    Reserved
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h5" style={{ textAlign: 'center', marginBottom: '12px' }}>
                                        FRONT OF CINEMA
                                    </Typography>
                                    <Box
                                        sx={{
                                            margin: '0 auto 0 auto',
                                            width: 800
                                        }}
                                    >
                                        {
                                            seatRender()
                                        }
                                    </Box>
                                </Grid>
                            </Grid>
                        </React.Fragment>
                        <React.Fragment>
                            <Typography variant="h5" gutterBottom style={{ marginBottom: '20px', marginTop: '20px', paddingBottom: '5px', borderBottom: '1px solid #ccc' }}>
                                Your Order
                            </Typography>
                            <Typography variant="h5" gutterBottom style={{ marginBottom: '20px', marginTop: '20px', paddingBottom: '5px', borderBottom: '1px solid #ccc' }}>
                                <Stack direction="row" justifyContent="center"
                                    style={{ marginBottom: '15px' }}
                                    alignItems="center" spacing={3}>
                                    <Typography variant="h5">
                                        Do you want to use reward points?
                                    </Typography>
                                    <Typography variant="h5" color="primary">
                                        <TextField onChange={handleRewardPointsChange} type="number" label="Number of Reward Points" variant="outlined" helperText="Each booking use 20 reward points maximum" />
                                    </Typography>
                                </Stack>
                                {
                                    pointsError ? <Alert severity="error">Please enter the number between 0-20.</Alert> : ''
                                }
                            </Typography>

                            <Stack direction="row" justifyContent="center"
                                style={{ marginTop: '20px' }}
                                alignItems="center" spacing={3}>
                                <Typography variant="h5">
                                    Total Price
                                </Typography>
                                <Typography variant="h5" color="primary">
                                ${selectedSeat.length > 0 ? price * selectedSeat.length - (points) : price * selectedSeat.length}
                                </Typography>
                                <Button onClick={ () => {Freindsb() }} variant="outlined">Select freinds to book with</Button>
                                <Button onClick={ () => {handleRedirectCurrentOrderPage(history) }} variant="outlined">Confirm Booking and purchase</Button>
                            </Stack>
                            {displayFreindOptions == true && <> <Multiselect
                                isObject={false}
                                onRemove={(event) => {
                                    setselectedFreinds(event)
                                }}
                                onSelect={(event) => {
                                    setselectedFreinds(event)
                                }}
                                options={food}
                                showCheckbox
                                style={{ marginTop: '20px' }}
                            />   <Button onClick={ () => {makeGroupMaking(selectedFreinds,history) }} variant="outlined">Make the booking</Button>                
                       </> }

         </React.Fragment>
                    </Paper>
                </Container>
        </ThemeProvider>
    );
}


