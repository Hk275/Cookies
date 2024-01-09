import React from 'react';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

// gets the severity and message,
// displays the message either error or possitve
const AlertUser = ({ sev, mess, id }) => {
  const syle = { width: '80%', marginLeft: '10%'}
  return (
  <Stack sx={syle} spacing={2}>
    <Alert id= {id} severity={sev}>{mess}</Alert>
  </Stack>
  )
}

AlertUser.propTypes = {
  sev: PropTypes.string,
  mess: PropTypes.string,
  id: PropTypes.string,
}

export default AlertUser;
