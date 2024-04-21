import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Paper,
  Slide,
  Typography,
  MenuItem,
  Select,
  Snackbar,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import axios from 'axios';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function SegmentComponent() {
  const [open, setOpen] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchema, setSelectedSchema] = useState('');
  const [schemas, setSchemas] = useState([]);
  const [availableOptions, setAvailableOptions] = useState([
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Account Name', value: 'account_name' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' },
  ]);
  const [alertMsg, setAlertMsg] = useState({
    openAlert: false,
    vertical: "top",
    horizontal: "left",
    message: "",
    severity: "",
  });
  const { vertical, horizontal, openAlert, message, severity } = alertMsg;

  const handleCloseAlert = () => {
    setAlertMsg({ ...alertMsg, openAlert: false });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetState();
  };

  const handleInputChange = (e) => {
    setSegmentName(e.target.value);
  };

  //webhook response after save
  // const handleSaveButtonClick = async () => {
  //   try {
  //     const requestData = {
  //       segment_name: segmentName,
  //       schema: schemas.map((schema) => {
  //         const responseSchemaValue = schema.options.length === 0 ? schema.name : schema.options[schema.options.length - 1];
  //         const responseSchemaKey = availableOptions.find((option) => option.label === responseSchemaValue);
  //         return {
  //           [responseSchemaKey ? responseSchemaKey.value : schema.name.toLowerCase().replace(' ', '_')]: responseSchemaValue,
  //         };
  //       }),
  //     };
  //     //Send JSON Data to server(webhook.site unique url)
  //     const response = await axios.post('https://webhook.site/17c16dc1-7b80-4fd0-8bd4-90e639dff20b', requestData);
  //     console.log('Server response:', response.data);
  //     setAlertMsg({
  //       ...alertMsg,
  //       openAlert: true, message: "Segement Saved Successfully! Kindly Check the response in the webhook site URL.", severity: "success"
  //     })

  //     setOpen(false);
  //     resetState();
  //   } catch (error) {
  //     console.error('Error sending data to server:', error);
  //     catchError(error);
  //   }
  // };

  const handleSaveButtonClick = () => {
    try {
      const requestData = {
        segment_name: segmentName,
        schema: schemas.map((schema) => {
          const responseSchemaValue = schema.options.length === 0 ? schema.name : schema.options[schema.options.length - 1];
          const responseSchemaKey = availableOptions.find((option) => option.label === responseSchemaValue);
          return {
            [responseSchemaKey ? responseSchemaKey.value : schema.name.toLowerCase().replace(' ', '_')]: responseSchemaValue,
          };
        }),
      };
      // Convert requestData to a string for display in the alert
      const requestDataString = JSON.stringify(requestData, null, 2);
      alert(requestDataString); // Show the requestData in an alert dialog
  
      setAlertMsg({
        ...alertMsg,
        openAlert: true,
        message: "Segment data displayed in alert!",
        severity: "success",
      });
  
      setOpen(false);
      resetState();
    } catch (error) {
      console.error('Error processing data:', error);
      catchError(error);
    }
  };

  function catchError(error) {
    setAlertMsg({
      ...alertMsg,
      openAlert: true,
      message: "Failed to Save Segement details",
      severity: "error",
    });
  }

  const handleSchemaChange = (e) => {
    setSelectedSchema(e.target.value);
  };

  const handleAddSchema = () => {
    if (selectedSchema) {
      const newSchema = {
        name: selectedSchema,
        options: [],
      };
      setSchemas([...schemas, newSchema]);
      setSelectedSchema('');
      setAvailableOptions((prevOptions) =>
        prevOptions.filter((option) => option.label !== selectedSchema)
      );
    }
  };

  const handleAddOption = (index) => (e) => {
    const { value } = e.target;
    console.log(value, "new dropdown onchange");
    const updatedSchemas = [...schemas];
    updatedSchemas[index].options.push(value);
    setSchemas(updatedSchemas);
    console.log(schemas, "shshfh");
  };

  const handleRemoveSchema = (index) => () => {
    const updatedSchemas = schemas.filter((schema, i) => i !== index);
    setSchemas(updatedSchemas);

    // Create an object for the removed schema name
    const removedSchema = {
      label: schemas[index].name,
      value: schemas[index].name.toLowerCase().replace(' ', '_'),
    };

    setAvailableOptions((prevOptions) => [
      ...prevOptions,
      removedSchema,
    ]);
  };

  const resetState = () => {
    setSegmentName('');
    setSelectedSchema('');
    setSchemas([]);
    setAvailableOptions([
      { label: 'First Name', value: 'first_name' },
      { label: 'Last Name', value: 'last_name' },
      { label: 'Gender', value: 'gender' },
      { label: 'Age', value: 'age' },
      { label: 'Account Name', value: 'account_name' },
      { label: 'City', value: 'city' },
      { label: 'State', value: 'state' },
    ]);
  };

  return (

    <div className="segment-container">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={openAlert}
        onClose={handleCloseAlert}
        key={vertical + horizontal}
        autoHideDuration={6000}
      >
        <Alert onClose={handleCloseAlert} severity={severity == "error" ? "error" : "success"}>
          {message}
        </Alert>
      </Snackbar>
      <button className="save-segment-btn" onClick={handleOpen}>
        Save Segment
      </button>

      {open && <div className="blur-background"></div>}

      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        PaperProps={{
          // component: Paper,
          style: {
            position: 'fixed',
            top: 0,
            right: 0,
            height: '100%',
            width: '500px'
          },
        }}
      >
        <DialogTitle style={{ background: '#34ebb7', color: 'black' }}>
          Saving Segment
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" style={{ margin: '20px 0 10px 0' }}>
            Enter the Name of the segment
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Name of the Segment"
            type="text"
            value={segmentName}
            onChange={handleInputChange}
            fullWidth
            size="small"
          />
          <Typography variant="body1" style={{ margin: '20px 0 50px 0' }}>
            To save your segment, you need to add the schemas to build the query
          </Typography>
          {/* New Dropdown */}
          {schemas.map((schema, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '15px',
              }}
            >
              <Select
                value={selectedSchema}
                onChange={handleAddOption(index)}
                fullWidth
                displayEmpty
                size="small"
                renderValue={() => {
                  const selectedSchema = schemas.find((s) => s.name === schema.name);
                  console.log(selectedSchema, "bbvsf");
                  if (selectedSchema && selectedSchema.options.length > 0) {
                    return selectedSchema.options[selectedSchema.options.length - 1];
                  }
                  return selectedSchema.name;
                }}
              >
                {availableOptions.map((option, optionIndex) => (
                  <MenuItem key={optionIndex} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              <Button
                onClick={handleRemoveSchema(index)}
                variant="outlined"
                style={{ marginLeft: '10px', color: '#48c7a3' }}
              >
                <DeleteIcon />
              </Button>
            </div>
          ))}
          {/* Add Schema Dropdown */}
          {availableOptions.length > 0 ? (
            <Select
              value={selectedSchema}
              onChange={handleSchemaChange}
              fullWidth
              displayEmpty
              size="small"
              renderValue={(value) =>
                value ? value : 'Add schema to segment'
              }
              style={{ marginBottom: '15px' }}
            >
              {availableOptions.map((option) => (
                <MenuItem key={option.label} value={option.label}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <Typography variant="body1" style={{ marginBottom: '15px', marginLeft: '2px' }}>
              No option available. All the Schemas have been added.
            </Typography>
          )}
          <a
            href="#"
            onClick={handleAddSchema}
            style={{ textDecoration: 'underline', color: '#48c7a3' }}
          >
            <AddIcon
              style={{
                verticalAlign: 'text-bottom',
                marginRight: '3px',
                fontSize: 'large',
              }}
            />
            Add New Schema
          </a>
        </DialogContent>
        <DialogActions
          style={{
            background: '#34ebb7',
            color: 'black',
            justifyContent: 'flex-start',
            height: '40px'
          }}
        >
          <Button
            onClick={handleSaveButtonClick}
            style={{ color: 'black', borderColor: '#48c7a3', background: '#dff7f0', borderRadius: '4px' }}
            variant="contained"
            size="small"
          >
            <SaveIcon fontSize='small' />
            Save the Segment
          </Button>
          <Button
            onClick={handleClose}
            style={{ color: 'black', borderColor: '#48c7a3', background: '#dff7f0', borderRadius: '4px' }}
            variant="contained"
            size="small"
          >
            <CloseIcon fontSize='small' />
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
