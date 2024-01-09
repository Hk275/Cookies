import React, { useEffect } from 'react';
import '../Login/Login.css'
// Taken from my assigmnet For Register 
import { useHistory } from "react-router-dom";
import AlertUser from "../../components/Error/Alert"

// This code is inspired from this website 
// https://freefrontend.com/css-login-forms/

const Login = () => {
  const history = useHistory();

  // For Register 
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordCheck, setPasswordCheck] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setlastName] = React.useState('');
  const [DOB, setDOB] = React.useState('');
  const [cardNumber, setCardNumber] = React.useState('');
  const [expiryDate, setExpiryDate] = React.useState('');
  const [ccv, setccv] = React.useState('');
  const [userType, setUser] = React.useState('host');

  // For Password
  const [displayError, setDisplayError] = React.useState(false)
  // For CardNumber
  const [displayError1, setDisplayError1] = React.useState(false)
  // For CCV
  const [displayError2, setDisplayError2] = React.useState(false)

  // For submit bttn

  const[displaybtn, setDisplaybtn] = React.useState(false)

  // For Login
  const [logEmail, setlogEmail] = React.useState('');
  const [logPass, setlogPass] = React.useState('');

  // For Host
  const [orgnName, setorgnName] = React.useState('');
  const [streeAddress, setstreeAddress] = React.useState('');
  const [stateAdd, setstateAdd] = React.useState('');
  const [country, setcountry] = React.useState('');
  const [pincode, setpincode] = React.useState('');


  useEffect(() => {
    if (password != passwordCheck) {
      setDisplayError(true)
    } if (password == passwordCheck) {
      setDisplayError(false)
    }

    if(cardNumber.toString().length != 16) {
      setDisplayError1(true)
    }
    if(cardNumber.toString().length == 16) {
      setDisplayError1(false)
    }

    if(ccv.toString().length != 3) {
      setDisplayError2(true)
    }
    if(ccv.toString().length == 3) {
      setDisplayError2(false)
    }

  }, [passwordCheck,cardNumber,ccv])

  return ( <>
  <div id="container">
   
    <div id="cover">
      <h1 class="sign-up">New to Cookies ?</h1>
      <p class="sign-up">Enter your personal details and <br/>  make bookings to future events</p>
      <a class="button sign-up" href="#cover">Sign Up</a>
      <h1 class="sign-in">Already a Cookie Member ? </h1>
      <p class="sign-in">Enter your details and <br/> continue your bookings</p>
      <br/>
      <a class="button sub sign-in" href="#">Sign In</a>
    </div>
  <div id="login">
    <h1>Sign In</h1>
    <form onSubmit = {(e) => handleLogin(e,logEmail,logPass,history)}>
      <input type="email" id="bs"placeholder="Email" onChange = {e => setlogEmail(e.target.value)}/> <br/>
      <input type="password" id="bs" placeholder="Password" onChange = {e => setlogPass(e.target.value)}/><br/>
      <input class="submit-btn" id="bs" type="submit" value="Sign In"/>
    </form>
  </div>
  <div id="register">
    <h1>Create Account</h1>
    <p>Please Enter the following details:</p>
    <select name="Account" id="bs" onChange = {e => setUser(e.target.value)}>
        <option value= 'host' >Host</option>
        <option value="Customer">Customer</option>
    </select> 
    <br/>
    <form onSubmit = {(e) => handleSubmitRequest(e, email, password, passwordCheck, firstName, lastName, cardNumber, expiryDate,  ccv, DOB, history, userType, streeAddress,stateAdd,country,pincode,orgnName)}> 
    <input type="text" placeholder="First Name" id="bs" onChange = {e => setFirstName(e.target.value)} required/><br/>
    <input type="text" placeholder="Last Name" id="bs" onChange = {e => setlastName(e.target.value)} required/><br/>
    <input type="email" placeholder="Email" id="bs" onChange = {e => setEmail(e.target.value)} required/><br/>
    <input type="password" placeholder="Password"id="bs"  onChange = {e => setPassword(e.target.value)} required/><br/>
    <input type="password" placeholder="Re-Enter password" id="bs" onChange = {e => setPasswordCheck(e.target.value)} required/>
    {displayError && <> <AlertUser sev = {'error'} mess = {'Both passwords do not match, make sure they are same'} /> </>}

    <input type="date" placeholder="DOB" id="bs" onChange = {e => setDOB(e.target.value)} required/><br/><br/>

    <h3>Payment Details</h3>
    <br/><br/>
    <input type="number" placeholder="Card Number" id="bs" onChange = {e => setCardNumber(e.target.value)} required/><br/>
    {displayError1 &&  <AlertUser sev = {'error'} mess = {'The lenght of card number is invalid, requries 16 numbers'} /> }
    <input type="date" placeholder="Expiry Date"id="bs"  onChange = {e => setExpiryDate(e.target.value)} required/><br/>
    <input type="number" placeholder="CCV"id="bs"  onChange = {e => setccv(e.target.value)} required/><br/>
    {displayError2 &&  <AlertUser sev = {'error'} mess = {'The lenght of CCV is invalid, requries 3 digits'} /> }


    {userType == 'host' && <> 
    <br/>
    
    <h3>Office Address and Details </h3>
    <input type="text" placeholder="Street Address" id="bs" onChange = {e => setstreeAddress(e.target.value)} required/><br/>
    <input type="text" placeholder="City" id="bs" onChange = {e => setstateAdd(e.target.value)} required/><br/>
    <input type="text" placeholder="Country" id="bs" onChange = {e => setcountry(e.target.value)} required/><br/>
    <input type="number" placeholder="PinCode" id="bs" onChange = {e => setpincode(e.target.value)} required/><br/>
    <input type="text" placeholder="Organziation Name" id="bs" onChange = {e => setorgnName(e.target.value)} required/><br/>
    </>}
    <input class="submit-btn" type="submit"/>
    </form>
  </div>
</div>
</>
  )
}

const handleLogin = (event, email,password, history) => {
  event.preventDefault();

  const makeServerRequest = true;

  const jsonstring = JSON.stringify({
    email: email,
    password: password,
  });

  const requestoption = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: jsonstring,
  };

  if (makeServerRequest) {
    fetch('http://127.0.0.1:5000/auth/login', requestoption)
  .then((r) => {
    if (r.status === 200) {
      r.json().then((data) => {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('u_id', data.u_id)
        sessionStorage.setItem('is_host', data.is_host)
        sessionStorage.setItem('first_name', data.first_name)
        sessionStorage.setItem('last_name', data.last_name)
        console.log(sessionStorage.getItem('token'))
        console.log(sessionStorage.getItem('u_id'))
        console.log(sessionStorage.getItem('first_name'))

        history.push("/");
      });
     
    } else {
      r.json().then((data) => {
        alert(data.message)
      });
      
    }
  })
}
}




const handleSubmitRequest =  (event, email, password, passwordCheck, firstName, lastName, cardNumber, expiryDate,  ccv, DOB,history, userType, address, city, country, postcode,orgnName) => {
  event.preventDefault();
  console.log(userType)
  const makeServerRequest = true;
  if (password != passwordCheck) {
    alert("Passwords do not match")
    makeServerRequest = false;
  }

  if (cardNumber.toString().length != 16) {
    alert("Invalid Card number")
    makeServerRequest = false;
  }

  if (ccv.toString().length != 3) {
    alert("Invalid Card number")
    makeServerRequest = false;
  }
  console.log(DOB);

  var ishost = false

  if(userType == 'host') {
    ishost = true
  }
  console.log(ishost)

  const jsonstring = JSON.stringify({
    last_name: lastName,
    first_name: firstName,
    email: email,
    password: password,
    card_num: cardNumber,
    expiry_date: expiryDate,
    CVV: ccv,
    is_host: ishost,
    birthday: DOB,
    address: address,
    city: city,
    country: country,
    postcode: postcode, 
    organization_name: orgnName,
  });

  const requestoption = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: jsonstring,
  };

  if (makeServerRequest) {
    fetch('http://127.0.0.1:5000/auth/register', requestoption)
    .then((r) => {
      if (r.status === 200) {
        r.json().then((data) => {
          console.log(data);
          // Store Token and Store u_Id
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('u_id', data.u_id)
          sessionStorage.setItem('is_host', data.is_host)
          sessionStorage.setItem('first_name', data.first_name)
          sessionStorage.setItem('last_name', data.last_name)
          history.push("/");
        });
        
      } else {
        r.json().then((data) => {
          alert(data.message)
        });
      }
    })
  }
}


export default Login;

