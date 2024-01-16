import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Grid, InputAdornment, Divider, Checkbox, TextField } from "@mui/material";

import { useForm } from "../utils/useForm";

import { TransactionAPI } from "../apis";

export const SortasiTBS = (props) => {
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
      <Grid item xs={1.1}>
        <Checkbox size="medium" disabled={isReadOnly} />
      </Grid>
      <Grid item xs={6.9}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
            style: {
              backgroundColor: isBgcolor ? "whitesmoke" : "",
            },
            readOnly: isReadOnly,
          }}
          onChange={handleChange}
          label="Buah Mentah"
          name="Buah Mentah"

          // value={values.BuahMentah}
        />
      </Grid>
      <Grid item xs={4}>
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
      <Grid item xs={1.1}>
        <Checkbox
          size="medium"
          sx={{
            mt: 1,
          }}
          disabled={isReadOnly}
        />
      </Grid>
      <Grid item xs={6.9}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
            style: {
              backgroundColor: isBgcolor ? "whitesmoke" : "",
            },
            readOnly: isReadOnly,
          }}
          onChange={handleChange}
          label="Buah Lewat Matang"
          name="BuahLewatMatang"
          // value={values.BuahLewatMatang}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1, backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
          // name="originWeighInKg"
          // value={values?.originWeighInKg > 0 ? values.originWeighInKg.toFixed(2) : "0.00"}
          inputProps={{ readOnly: true }}
        />
      </Grid>
      <Grid item xs={1.1}>
        <Checkbox
          size="medium"
          sx={{
            mt: 1,
          }}
          disabled={isReadOnly}
        />
      </Grid>
      <Grid item xs={6.9}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
            style: {
              backgroundColor: isBgcolor ? "whitesmoke" : "",
            },
            readOnly: isReadOnly,
          }}
          onChange={handleChange}
          label="Tangkai Panjang"
          name="TangkaiPanjang"
          value={values?.TangkaiPanjang}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1, backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
          // name="weightNetto"
          // value={originWeighNetto > 0 ? originWeighNetto.toFixed(2) : "0.00"}
          inputProps={{ readOnly: true }}
        />
      </Grid>
      <Grid item xs={1.1}>
        <Checkbox
          size="medium"
          sx={{
            mt: 1,
          }}
          disabled={isReadOnly}
        />
      </Grid>
      <Grid item xs={6.9}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
            style: {
              backgroundColor: isBgcolor ? "whitesmoke" : "",
            },
            readOnly: isReadOnly,
          }}
          onChange={handleChange}
          label="Tandan Kosong"
          name="tandankosong"
          value={values?.tandankosong}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1, backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
          // name="weightNetto"
          // value={originWeighNetto > 0 ? originWeighNetto.toFixed(2) : "0.00"}
          inputProps={{ readOnly: true }}
        />
      </Grid>
      <Grid item xs={1.1}>
        <Checkbox
          size="medium"
          sx={{
            mt: 1,
          }}
          disabled={isReadOnly}
        />
      </Grid>
      <Grid item xs={6.9}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
            style: {
              backgroundColor: isBgcolor ? "whitesmoke" : "",
            },
            readOnly: isReadOnly,
          }}
          onChange={handleChange}
          label="Sampah"
          name="sampah"
          value={values?.sampah}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1, backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
          // name="weightNetto"
          // value={originWeighNetto > 0 ? originWeighNetto.toFixed(2) : "0.00"}
          inputProps={{ readOnly: true }}
        />
      </Grid>
      <Grid item xs={1.1}>
        <Checkbox
          size="medium"
          sx={{
            mt: 1,
          }}
          disabled={isReadOnly}
        />
      </Grid>
      <Grid item xs={6.9}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
            style: {
              backgroundColor: isBgcolor ? "whitesmoke" : "",
            },
            readOnly: isReadOnly,
          }}
          onChange={handleChange}
          label="Air"
          name="air"
          value={values?.air}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1, backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
          // name="weightNetto"
          // value={originWeighNetto > 0 ? originWeighNetto.toFixed(2) : "0.00"}
          inputProps={{ readOnly: true }}
        />
      </Grid>
      <Grid item xs={1.1}>
        <Checkbox
          size="medium"
          sx={{
            mt: 1,
          }}
          disabled={isReadOnly}
        />
      </Grid>
      <Grid item xs={6.9}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
            style: {
              backgroundColor: isBgcolor ? "whitesmoke" : "",
            },
            readOnly: isReadOnly,
          }}
          onChange={handleChange}
          label="Parteno"
          name="parteno"
          value={values?.parteno}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1, backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
          // name="weightNetto"
          // value={originWeighNetto > 0 ? originWeighNetto.toFixed(2) : "0.00"}
          inputProps={{ readOnly: true }}
        />
      </Grid>
      <Grid item xs={1.1}>
        <Checkbox
          size="medium"
          sx={{
            mt: 1,
          }}
          disabled={isReadOnly}
        />
      </Grid>
      <Grid item xs={6.9}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
            style: {
              backgroundColor: isBgcolor ? "whitesmoke" : "",
            },
            readOnly: isReadOnly,
          }}
          onChange={handleChange}
          label="Brondolan"
          name="brondolan"
          value={values?.brondolan}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1, backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
          // name="weightNetto"
          // value={originWeighNetto > 0 ? originWeighNetto.toFixed(2) : "0.00"}
          inputProps={{ readOnly: true }}
        />
      </Grid>
      <Grid item xs={1.1}>
        <Checkbox
          size="medium"
          sx={{
            mt: 1,
          }}
          disabled={isReadOnly}
        />
      </Grid>
      <Grid item xs={6.9}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
            style: {
              backgroundColor: isBgcolor ? "whitesmoke" : "",
            },
            readOnly: isReadOnly,
          }}
          onChange={handleChange}
          label="Pot. Wajib Vendor"
          name="potonganwajib"
          value={values?.potonganwajib}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1, backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
          // name="weightNetto"
          // value={originWeighNetto > 0 ? originWeighNetto.toFixed(2) : "0.00"}
          inputProps={{ readOnly: true }}
        />
      </Grid>
      <Grid item xs={1.1}>
        <Checkbox
          size="medium"
          sx={{
            mt: 1,
          }}
          disabled={isReadOnly}
        />
      </Grid>
      <Grid item xs={6.9}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
            style: {
              backgroundColor: isBgcolor ? "whitesmoke" : "",
            },
            readOnly: isReadOnly,
          }}
          onChange={handleChange}
          label="Pot. Lainnya"
          name="potonganlainnya"
          value={values?.potonganlainnya}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1, backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
          // name="weightNetto"
          // value={originWeighNetto > 0 ? originWeighNetto.toFixed(2) : "0.00"}
          inputProps={{ readOnly: true }}
        />
      </Grid>
      <Grid item xs={1.1}></Grid>
      <Grid item xs={10.9}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1 }}
          inputProps={{
            style: {
              backgroundColor: isBgcolor ? "whitesmoke" : "",
            },
            readOnly: isReadOnly,
          }}
          onChange={handleChange}
          label="Total Potongan"
          name="TangkaiPanjang"
          value={values?.TangkaiPanjang}
        />
      </Grid>

      <Grid item xs={1.1}>
        <Checkbox
          size="medium"
          sx={{
            mt: 1,
          }}
          disabled={isReadOnly}
        />
      </Grid>
      <Grid item xs={10.9} sx={{ mt: 2 }}>
        <span style={{ color: "red", fontSize: "15px", fontWeight: "bold" }}>
          Pilih Semua Sebagai Potongan/Pengurangan Tonase ?
        </span>
      </Grid>
    </>
  );
};

export default SortasiTBS;
