import Head from 'next/head';
import { Box, Container, Grid, Typography,CardHeader } from '@mui/material';
import { AccountProfile } from '../components/account/account-profile';
import { AccountProfileDetails } from '../components/account/account-profile-details';
import { DashboardLayout } from '../components/dashboard-layout';
import { FacialProfile } from '../components/facialEnrolar/facial-profile';
import { FacialProfileDetails } from '../components/facialEnrolar/facial-profile-details';


const Page = () => (
  <>
    <Head>
      <title>
        Facial | Enrolar
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 2
      }}
    >
      <Container maxWidth="lg">
        <Typography
          sx={{ mb: 2 }}
          variant="h4"
        >
       
        </Typography>
        <Grid
          container
          spacing={1}
        >
      
            <FacialProfileDetails />
        
        </Grid>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
