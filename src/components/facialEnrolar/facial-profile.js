import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';

const user = {
  avatar: '/static/images/avatars/avatar_6.png',
  city: 'Los Angeles',
  country: 'USA',
  jobTitle: 'Senior Developer',
  name: 'Over Smith',
  cc: '111'
};
import { useContext } from 'react';
import { useState,useRef } from 'react';
import Webcam from "react-webcam";
import { AuthContext } from '../../contexts/auth-context';


export const FacialProfile = (props) => {
  const webcamRef = useRef(null);
  const [imgTake, setimgTake] = useState(null);
  const [cc,setCc]=useState('');
  const authContext = useContext(AuthContext);

  const validar = (event) => {
    console.log('AccountPopover---authContext :>> ', authContext.user.idToken);
    event.preventDefault();
    const imageSrc = webcamRef.current.getScreenshot();
    setimgTake(imageSrc);
    var requestOptions = {
      method: "POST",
      headers: {
        "Authorization":  authContext.user.idToken.jwtToken,
      },
      body: JSON.stringify({
        imgdata: imageSrc.replace(/^data:image\/[a-z]+;base64,/, ""),
      }),
    };
    console.log("cap2");
    fetch(
      "https://v9vo4svefd.execute-api.us-east-1.amazonaws.com/prod/",
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        if(data.respuesta!=null){
          console.log(data);
          console.log(data.respuesta);
          setCc(data.respuesta);
      }else{
        console.log(data);
         setCc(data.respuesta);
      }
      })
      .catch((error) => console.log("error> al consultar ws de facial", error));

  };


  return (
  <Card {...props}>
    <CardContent>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
     
         <Webcam className="cam"
          audio={false}
          height={300}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={480}
        />
        <CardActions>
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
            onClick={validar}
          >
               Validar foto
          </Button>
        </Box>

    </CardActions>
        
   
        <Avatar
          src={imgTake}
          sx={{
            height: 64,
            mb: 2,
            width: 64
          }}
        />
        <Typography
          color="textPrimary"
          gutterBottom
          variant="h5"
        >
          {user.name}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          {`${user.city} ${user.country}`}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          {`${cc}`}
        </Typography>
      </Box>
    </CardContent>

  </Card>
   ); 
  };
