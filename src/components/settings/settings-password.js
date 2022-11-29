import { useState } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Divider, TextField } from '@mui/material';
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import UserPool from "../../utils/UserPool";


export const SettingsPassword = (props) => {
  const [values, setValues] = useState({
    email:'',
    password: '',
    confirm: ''
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });

  }
  
    
  const capture = (event) => {
    event.preventDefault();

  const user = new CognitoUser({
    Username: values.email,
    Pool: UserPool,
  });

  const authDetails = new AuthenticationDetails({
    Username: values.email,
    Password: values.password,
  });

  //validar autenticar
  user.authenticateUser(authDetails, {


    onSuccess: (data) => {
    console.log("login  user>> ",  data);

    Router
    .push('/')
    .catch(console.error);

    },
    onFailure: (data) => {

      console.log("onFailure :>> ", data);

     
    },
    newPasswordRequired: (data) => {
      console.log("newPasswordRequired :>> ", data);

    },
  });



  user.changePassword(values.password,values.confirm,(err,result)=>{
    if (err) {
      console.log('err :>> ', err);
    } else {
      console.log('res :>> ', result);
    }
  })

}

  return (
    <form {...props}>
      <Card>
        <CardHeader
          subheader="Update password"
          title="Password"
        />
        <Divider />
        <CardContent>
        <TextField
            fullWidth
            label="Email"
            margin="normal"
            name="email"
            onChange={handleChange}
            type="email"
            value={values.email}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Password"
            margin="normal"
            name="password"
            onChange={handleChange}
            type="password"
            value={values.password}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Confirm password"
            margin="normal"
            name="confirm"
            onChange={handleChange}
            type="password"
            value={values.confirm}
            variant="outlined"
          />
        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >
          <Button
            color="primary"
            variant="contained"
            type="submit"
            onClick={capture}
          >
            Update
          </Button>
        </Box>
      </Card>
    </form>
  );
};
