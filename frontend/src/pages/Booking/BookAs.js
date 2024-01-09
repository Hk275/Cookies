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
import Icon from '@mui/material/Icon';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Nav from '../../components/Nav/index';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import CurrencyConverter from 'react-currency-conv';

const theme = createTheme();

export default function Booking() {
    const [value, setValue] = React.useState(new Date('2022-08-18T21:11:54'));

    const [seatNum, setSeatNum] = React.useState(400);

    const [seatRow, setSeatRow] = React.useState(20);

    const [seatColumn, setSeatColumn] = React.useState(10);

    const [selectedSeat, setSelectedSeat] = React.useState([]);

    const [refresh, setRefresh] = React.useState(false);
    const jsonstring = JSON.stringify({
        event_id: 5
      });
    
      const requestoption = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonstring,
      };

    const [backendSetAvail, setBackend] = React.useState(' ')
    const [totalAvail, setTotalAvail] = React.useState(' ')
    React.useEffect(() => {
        fetch('http://127.0.0.1:5000/view/get_event_information', requestoption)
        .then((r) => {
        if (r.status === 200) {
            r.json().then((data) => {
            console.log(data)
            const az = "a"+1
            setBackend(data.available_seats_num)
            setTotalAvail(data.seats_num)
            });
      } else {
        r.json().then((data) => {
          console.log('i fire once');
          console.log(data);
        });
      }
    })
        refresh && setRefresh(true)
    }, [refresh])

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
        console.log(avail_seats)
        // console.log(alphabet[9])
        return avail_seats
    }

   

    const initSeatList = (row, column) => {
        const back = usingBackend(backendSetAvail,totalAvail)
        let seatList = [];

        for (let i = 1; i <= row; i++) {
            
            for (let j = 1; j <= column; j++) {
                

                let avail = 0
                if (back[(i*j)-1] == 0) {
                    console.log(i,j)
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

    const [seatList, setSeatList] = React.useState(initSeatList(backendSetAvail, totalAvail));

    const handleChange = (newValue) => {
        setValue(newValue);
    };

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

    const handleRedirectCurrentOrderPage = () => {

        const jsonstring = JSON.stringify({
            u_id: sessionStorage.getItem('u_id'),
            token: sessionStorage.getItem('token'),
            event_id: 5,
            seat_num: [selectedSeat[0].seatNo.toLowerCase()],
          });
          const requestoption = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: jsonstring,
          };
        console.log(selectedSeat[0].seatNo.toLowerCase())
        fetch('http://127.0.0.1:5000/event/book', requestoption)
        .then((r) => {
        if (r.status === 200) {
            r.json().then((data) => {
            console.log(data)
            
            });
      } else {
        r.json().then((data) => {
          console.log('i fire once');
          console.log(data);
        });
      }
    })
        
    }

    const options = [
        'AUD', 'USD', 'CAD', 
      ];
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Nav name = "Booking Detail " />
            {/* <Box
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
            > */}
            
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
                                            $99
                                           

                                        </Typography>
                                        <CurrencyConverter from={'USD'} to={'CAD'} value={2119}/>
                                        <Dropdown options={options}  placeholder="Select an option" />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <FormControl style={{ marginTop: '14px' }}>
                                        <FormLabel>Seat Selection</FormLabel>
                                        <RadioGroup
                                            row
                                            aria-labelledby="seatNum"
                                            name="seatNum"
                                            value={seatNum}
                                            onChange={handleSeatNumChange}
                                        >
                                            <FormControlLabel value="50" control={<Radio />} label="50" />
                                            <FormControlLabel value="150" control={<Radio />} label="150" />
                                            <FormControlLabel value="400" control={<Radio />} label="400" />
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
                            <Stack direction="row" justifyContent="center"
                                alignItems="center" spacing={3}>
                                <Typography variant="h5">
                                    Total Price
                                </Typography>
                                <Typography variant="h5" color="primary">
                                    ${99 * selectedSeat.length}
                                </Typography>
                                <Button variant="outlined">Book With Friends</Button>
                                <Button onClick={ handleRedirectCurrentOrderPage } variant="outlined">Confirm Booking and purchase</Button>
                            </Stack>
                        </React.Fragment>
                    </Paper>
                </Container>
            {/* </Box> */}
        </ThemeProvider>
    );
}