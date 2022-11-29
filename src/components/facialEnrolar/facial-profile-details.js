import {
  Avatar,
  CardActions,
  Alert,
  Item,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
} from "@mui/material";


import { useState, useRef } from "react";
import { AuthContext } from "../../contexts/auth-context";
import { useContext } from "react";
import Webcam from "react-webcam";
import Boundingbox from "react-bounding-box";



export const FacialProfileDetails = (props) => {
  const [imgTake, setimgTake] = useState(null);
  const webcamRef = useRef(null);
  const authContext = useContext(AuthContext);
  const [responseWs, setResponseWS]=useState();
  const [data, setData]=useState();
  
  const imageSrc ="";
  const [mostrar, setMostrar]=useState(false);
  const aarr={
    boxes:
     [   
 
    ]
  };
  const states = [
    {
      value: "manizales",
      label: "Manizales",
    },
    {
      value: "dorada",
      label: "Dorada",
    },
    {
      value: "villamaria",
      label: "Villamaria",
    },
  ];
  const [values, setValues] = useState({
    firstName: "Over",
    lastName: "Jaramillo",
    email: "demo@devias.io",
    cc: String(Math.floor(Math.random() * 10000)),
    state: "Alabama",
    country: "USA",
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  //-----------------------------------------------------------------------------------



  async function guardar() {
    imageSrc = webcamRef.current.getScreenshot();
    var strImage = imageSrc.replace(/^data:image\/[a-z]+;base64,/, "");
    var tk = authContext.user.idToken.jwtToken; //data.idToken.jwtToken
    var requestOptions = {
      method: "POST",
      headers: {
        Authorization: tk, //authContext.nomb,
      },
      body: JSON.stringify({
        imgdata: strImage,
        externalId: values.cc,
        nombre: values.firstName,
        apellido: values.lastName,
        email:values.email,
        municipio:values.state
      }),
    };
    setimgTake(imageSrc);

    const response = await fetch("https://v9vo4svefd.execute-api.us-east-1.amazonaws.com/prod/", requestOptions );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('data :>> ', data);
    if(data.message=="" && data.error==null){
      data.respuestadetectFaces.FaceDetails.forEach((e,i) => {
       setData(data);
       setMostrar(true);
       setResponseWS(<Alert severity="info">{data.respuesta}</Alert>);
    
    });
  }else{
      setMostrar(false);
      setResponseWS(<Alert severity="error">{data.respuesta}</Alert>);
  }
  }

 if(mostrar){
 data.respuestadetectFaces.FaceDetails.forEach((e,i) => {
      var label="Foto:"+i
      var top=e.BoundingBox.Top;;
      var left=e.BoundingBox.Left;
      var width=e.BoundingBox.Width;
      var height=e.BoundingBox.Height;
       aarr.boxes.push({ coord: [left*480,top*2*250, width*480, height*250],label: label});
 });
}


  const params = {
    image:
    imgTake,
    boxes: [],    
    options: {
      colors: {
        normal: "rgba(0,225,0)",
        selected: "rgba(0,225,204,1)",
        unselected: "rgba(100,100,100,1)"
      },
      style: {
        maxWidth: "480px",
        maxHeight: "250px"
      }
       
    }
  };
     
  return (
    <form autoComplete="off" noValidate {...props}>
      <Card>
     
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Webcam
                className="cam"
                audio={false}
                height={250}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={480}
                screenshotQuality={1}
              />
            </Grid>
            <Grid item xs={6} >
              { mostrar ?  <Boundingbox image={imgTake} boxes={aarr.boxes}   options={params.options}  />: (
                            <div></div>

                            )}

            </Grid>
       
          </Grid>
                 </CardContent>

        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                helperText="Please specify the first name"
                label="Nombres"
                name="firstName"
                onChange={handleChange}
                required
                value={values.firstName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Apellidos"
                name="lastName"
                onChange={handleChange}
                required
                value={values.lastName}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                onChange={handleChange}
                required
                value={values.email}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Documento identificación"
                name="cc"
                onChange={handleChange}
                type="number"
                value={values.cc}
                variant="outlined"
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Seleccione municipio"
                name="state"
                onChange={handleChange}
                required
                select
                SelectProps={{ native: true }}
                value={values.state}
                variant="outlined"
              >
                {states.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  p: 2,
                }}
              >
                <Button color="primary" variant="contained" onClick={guardar}>
                  Guardar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
       {responseWs}
     
      </Card>
    </form>
  );
};
