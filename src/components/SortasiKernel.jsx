import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Grid, InputAdornment, Divider, Checkbox, TextField } from "@mui/material";

import { useForm } from "../utils/useForm";

import { TransactionAPI } from "../apis";

export const SortasiKernel = (props) => {
  const { isReadOnly, isBgcolor } = props;
  const transactionAPI = TransactionAPI();

  const { values, setValues } = useForm({
    ...transactionAPI.InitialData,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((preValues) => ({
      ...preValues,
      [name]: value,
    }));
  };

  return (
    <>
      <Grid item xs={7}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
            style: {
              backgroundColor: isBgcolor ? "whitesmoke" : "",
            },
            readOnly: isReadOnly,
          }}
          onChange={handleChange}
          label="Moisture"
          name="Moisture"

          // value={values.BuahMentah}
        />
      </Grid>
      <Grid item xs={5}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
          // value={potBMKG}
          inputProps={{ readOnly: true }}
        />
      </Grid>
      <Grid item xs={7}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 2 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
            style: {
              backgroundColor: isBgcolor ? "whitesmoke" : "",
            },
            readOnly: isReadOnly,
          }}
          onChange={handleChange}
          label="Dirt"
          name="BuahLewatMatang"
          // value={values.BuahLewatMatang}
        />
      </Grid>
      <Grid item xs={5}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 2, backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
          // name="originWeighInKg"
          // value={values?.originWeighInKg > 0 ? values.originWeighInKg.toFixed(2) : "0.00"}
          inputProps={{ readOnly: true }}
        />
      </Grid>
      <Grid item xs={7}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 2 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
            style: {
              backgroundColor: isBgcolor ? "whitesmoke" : "",
            },
            readOnly: isReadOnly,
          }}
          onChange={handleChange}
          label="Stone"
          name="TangkaiPanjang"
          value={values?.TangkaiPanjang}
        />
      </Grid>
      <Grid item xs={5}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 2,mb:1.5, backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
          // name="weightNetto"
          // value={originWeighNetto > 0 ? originWeighNetto.toFixed(2) : "0.00"}
          inputProps={{ readOnly: true }}
        />
      </Grid>
    
      <Grid item xs={12}>
        <Divider>TOTAL POTONGAN</Divider>
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1.5 }}
          inputProps={{
            style: {
              backgroundColor: isBgcolor ? "whitesmoke" : "",
            },
            readOnly: isReadOnly,
          }}
        
          onChange={handleChange}
          label="Total Potongan [KG]"
          name="TangkaiPanjang"
          value={values?.TangkaiPanjang}
        />
      </Grid>
    </>
  );
};

export default SortasiKernel;
