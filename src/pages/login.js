import Head from 'next/head';
import NextLink from 'next/link';
import Router from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Container, Grid, Link, TextField, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import UserPool from "../utils/UserPool";
import React, { useState } from "react";

import { auth, ENABLE_AUTH } from '../lib/auth';
import { useAuthContext } from '../contexts/auth-context';


const Login = () => {
  const [mensajeLogin,setMensajeLoguin]=useState();
  const [emailSent, setEmailSent] = useState(false);
  const authContext = useAuthContext();
 // const {nomb,setNomb}= useAuthContext();

  
  
  const formik = useFormik({
    initialValues: {
      email: 'jaramil161@gmail.com',
      password: 'A1a2a3a4a5a6'
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Debe ser un correo electrónico válido')
        .max(255)
        .required('Email es requerido'),
      password: Yup
        .string()
        .max(255)
        .required('Password es requerido')
    }),


    onSubmit: (usuario) => {

      if (!ENABLE_AUTH) {
        helpers.setFieldError('submit', 'Zalter authentication not enabled');
        helpers.setSubmitting(false);
        return;
      }


      const user = new CognitoUser({
        Username: usuario.email,
        Pool: UserPool,
      });
  
      const authDetails = new AuthenticationDetails({
        Username: usuario.email,
        Password: usuario.password,
      });
  
      //validar autenticar
      user.authenticateUser(authDetails, {


        onSuccess: (data) => {

        localStorage.setItem("tk", data.idToken.jwtToken);
        const user =  data;
        console.log("login  data>> ",  data);
        authContext.signIn(data);
        //authContext.estadoOk(user);
        authContext.authSkipped;
        authContext.setNomb(data.idToken.jwtToken),
        console.log("login  74>> ",   authContext);
     
        console.log("login  77>> ",   authContext.emailx);
       // authContext.setEmailx(data.idToken.payload.email);
        globalThis.sessionStorage.setItem('skip-auth', 'true');  



        Router
        .push('/')
        .catch(console.error);

        },
        onFailure: (data) => {
         setMensajeLoguin(" Incorrecto usuario o contraseña.");
          console.log("onFailure :>> ", data);

         
        },
        newPasswordRequired: (data) => {
          console.log("newPasswordRequired :>> ", data);
       //   setRespuestaLogin(" Incorrect username or password...");
        },
      });
    
    }
  });

  return (
    <>
      <Head>
        <title>Login FaceApp</title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%'
        }}
      >
        <Container maxWidth="sm">
          <NextLink
            href="/"
            passHref
          >
            <Button
              component="a"
              startIcon={<ArrowBackIcon fontSize="small" />}
            >
              Dashboard
            </Button>
          </NextLink>
          <form onSubmit={formik.handleSubmit}>
          <label><h1>{mensajeLogin}</h1></label>
            <Box sx={{ my: 3 }}>
              <Typography
                color="textPrimary"
                variant="h4"
              >
                Acceder
              </Typography>
              
            </Box>
            <Grid
              container
              spacing={3}
            >
        
            </Grid>
      
            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email Address"
              margin="normal"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
              variant="outlined"
            />
            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
               // disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Iniciar sesión
              </Button>
            </Box>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              No tienes una cuenta?
              {' '}
              <NextLink
                href="/register"
              >
                <Link
                  to="/register"
                  variant="subtitle2"
                  underline="hover"
                  sx={{
                    cursor: 'pointer'
                  }}
                >
                  Sign Up
                </Link>
              </NextLink>
            </Typography>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Login;
