import { useState,useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Modal,
  CardMedia,
  CardContent,
  CardActions
} from '@mui/material';
import { getInitials } from '../../utils/get-initials';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';  

export const CustomerListResults = ({  ...rest }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [dense, setDense] = useState(false);
  const [merchants, setMerchants] = useState(false);
  const [open, setOpen] = useState(false);
  const [customerSelec,setCustomerSelec]=useState([]);
 
  const handleClose = () => setOpen(false);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  

  useEffect(() => {
    console.log('rest :>> ', rest);
    console.log('customers :>> ', customers);
    console.time("t1i");
    const getAsistentes = async () => {
      const response = await fetch(
        "http://localhost:3001/users"
      );
      const data = await response.json();
      console.log('data :>> ', data);
      setCustomers(data);
      customers.map(obj => console.log("docum: "+obj.documento));
      merchants=  customers.slice(0, limit).map((customer) => (
        console.log("docum:2 "+customer.documento)
       
        ));
    };
    getAsistentes();
   
    console.timeEnd("t1i");
  }, []);


  const handleOpen = (event,customer) =>{
      console.log('event open :>> ', customer);
      setCustomerSelec(customer);
      console.log('event open :>> ', customer.documento);
      setOpen(true);
  };

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = customers.map((customer) => customer.documento);
    } else {
      newSelectedCustomerIds = [];
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleSelectOne = (event, documento) => {
    console.log('documento :>> ', documento);
    const selectedIndex = selectedCustomerIds.indexOf(documento);
    let newSelectedCustomerIds = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, documento);
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  return (
    <Card >

    <PerfectScrollbar>
      <Box sx={{ minWidth: 1050 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedCustomerIds.length === customers.length}
                  color="primary"
                  indeterminate={
                    selectedCustomerIds.length > 0
                    && selectedCustomerIds.length < customers.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>
               Nombre
              </TableCell>
              <TableCell>
                Documento
              </TableCell>
              <TableCell>
                Email
              </TableCell>
              <TableCell>
                Celular
              </TableCell>
              <TableCell>
                Registration date
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.slice(page * limit, page * limit + limit).map((customer) => (
              <TableRow
                hover
                key={customer.documento}
                selected={selectedCustomerIds.indexOf(customer.documento) !== -1}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomerIds.indexOf(customer.documento) !== -1}
                    onChange={(event) => handleSelectOne(event, customer.documento)}
                    value="true"
                  />
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      alignItems: 'center',
                      display: 'flex'
                    }}
                  >
                    <Avatar
                    src={`data:image/jpeg;base64,${customer.foto}`}
                      sx={{ mr: 2 }}
                    >
                      {customer.nombre1}
                    </Avatar>
                    <Typography
                      color="textPrimary"
                      variant="body1"
                    >
                         {customer.nombre1} {customer.nombre2} {customer.apellido1} {customer.apellido2}  
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {customer.documento}
                </TableCell>
                <TableCell>
                  {customer.correoelectronico}
                </TableCell>
                <TableCell>
                  {customer.celular}
                </TableCell>
                <TableCell>
                  {customer.fecha_registro}
                </TableCell>
                <TableCell>
                <Button onClick={(event) => handleOpen(event, customer)} >Ver...</Button>
                
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </PerfectScrollbar>
    <TablePagination
      component="div"
      count={customers.length}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleLimitChange}
      page={page}
      rowsPerPage={limit}
      rowsPerPageOptions={[5, 10, 25]}
    />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
          >
          <Card sx={style}>
          <CardMedia
            component="img"
            height="140"
            width= "200"
            image={`data:image/jpeg;base64,${customerSelec.foto}`}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Lizard
            </Typography>
            <Typography variant="body2" color="text.secondary">
            Nombre:   {customerSelec.nombre1} {customerSelec.nombre2} {customerSelec.apellido1} {customerSelec.apellido2}  <br/>
            Documento: {customerSelec.nombre1}<br/>
            Fecha registro: {customerSelec.fecha_registro}<br/>
            </Typography>
          </CardContent>
         
            <Button size="small">Share</Button>

        </Card>



      </Modal>

  </Card>
    
  );
};

CustomerListResults.propTypes = {
  customers: PropTypes.array.isRequired
};