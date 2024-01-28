import { useState } from "react";
import { Grid, InputAdornment, Checkbox, TextField as TextFieldMUI } from "@mui/material";
import { Field } from "formik";
import { TextField } from "formik-mui";

export const SortasiTBS = (props) => {
  const { isReadOnly } = props;
  const [checked, setChecked] = useState([true, false]);

  const handleChange1 = (event) => {
    setChecked([event.target.checked, event.target.checked]);
  };

  const handleChange2 = (event) => {
    setChecked([event.target.checked, checked[1]]);
  };

  const handleChange3 = (event) => {
    setChecked([checked[0], event.target.checked]);
  };

  return (
    <>
      <Grid item xs={1.1}>
        <Checkbox size="medium" disabled={isReadOnly} name="unRipeChecked " />
      </Grid>
      <Grid item xs={6.9}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
            style: {
              backgroundColor: isReadOnly ? "whitesmoke" : "",
            },
            // readOnly: isReadOnly,
            readOnly: true,
          }}
          component={TextField}
          label="Buah Mentah"
          name="unRipePercentage"
        />
      </Grid>
      <Grid item xs={4}>
        <Field
          type="number"
          name="unripeKg"
          variant="outlined"
          size="small"
          fullWidth
          component={TextField}
          sx={{ backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            readOnly: true,
          }}
        />
      </Grid>
      <Grid item xs={1.1}>
        <Checkbox
          name="underRipeChecked"
          size="medium"
          sx={{
            mt: 1,
          }}
          disabled={isReadOnly}
        />
      </Grid>
      <Grid item xs={6.9}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
            style: {
              backgroundColor: isReadOnly ? "whitesmoke" : "",
            },
            // readOnly: isReadOnly,
            readOnly: true,
          }}
          component={TextField}
          label="Buah Lewat Matang"
          name="underRipePercentage"
        />
      </Grid>
      <Grid item xs={4}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          component={TextField}
          sx={{ mt: 1, backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
          name="underRipeKg"
        />
      </Grid>
      <Grid item xs={1.1}>
        <Checkbox
          name="longStalkChecked"
          size="medium"
          sx={{
            mt: 1,
          }}
          disabled={isReadOnly}
        />
      </Grid>
      <Grid item xs={6.9}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
            style: {
              backgroundColor: isReadOnly ? "whitesmoke" : "",
            },
            // readOnly: isReadOnly,
            readOnly: true,
          }}
          component={TextField}
          label="Tangkai Panjang"
          name="longStalkPercentage"
        />
      </Grid>
      <Grid item xs={4}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          component={TextField}
          sx={{ mt: 1, backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            readOnly: true,
          }}
          name="longStalkKg"
        />
      </Grid>
      <Grid item xs={1.1}>
        <Checkbox
          name="emptyBunchChecked"
          size="medium"
          sx={{
            mt: 1,
          }}
          disabled={isReadOnly}
        />
      </Grid>
      <Grid item xs={6.9}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
            style: {
              backgroundColor: isReadOnly ? "whitesmoke" : "",
            },
            // readOnly: isReadOnly,
            readOnly: true,
          }}
          component={TextField}
          label="Tandan Kosong"
          name="emptyBunchPercentage"
        />
      </Grid>
      <Grid item xs={4}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          component={TextField}
          sx={{ mt: 1, backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            readOnly: true,
          }}
          name="emptyBunchKg"
        />
      </Grid>
      <Grid item xs={1.1}>
        <Checkbox
          name="garbageDirtChecked"
          size="medium"
          sx={{
            mt: 1,
          }}
          disabled={isReadOnly}
        />
      </Grid>
      <Grid item xs={6.9}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
            style: {
              backgroundColor: isReadOnly ? "whitesmoke" : "",
            },
            // readOnly: isReadOnly,
            readOnly: true,
          }}
          component={TextField}
          label="Sampah"
          name="garbageDirtPercentage"
        />
      </Grid>
      <Grid item xs={4}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          component={TextField}
          sx={{ mt: 1, backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            readOnly: true,
          }}
          name="garbageDirtKg"
        />
      </Grid>
      <Grid item xs={1.1}>
        <Checkbox
          name="waterChecked"
          size="medium"
          sx={{
            mt: 1,
          }}
          disabled={isReadOnly}
        />
      </Grid>
      <Grid item xs={6.9}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
            style: {
              backgroundColor: isReadOnly ? "whitesmoke" : "",
            },
            // readOnly: isReadOnly,
            readOnly: true,
          }}
          component={TextField}
          label="Air"
          name="waterPercentage"
        />
      </Grid>
      <Grid item xs={4}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          component={TextField}
          sx={{ mt: 1, backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            readOnly: true,
          }}
          name="waterKg"
        />
      </Grid>
      <Grid item xs={1.1}>
        <Checkbox
          name="parthenocarpyChecked"
          size="medium"
          sx={{
            mt: 1,
          }}
          disabled={isReadOnly}
        />
      </Grid>
      <Grid item xs={6.9}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
            style: {
              backgroundColor: isReadOnly ? "whitesmoke" : "",
            },
            // readOnly: isReadOnly,
            readOnly: true,
          }}
          component={TextField}
          label="Parteno"
          name="parthenocarpyPercentage"
        />
      </Grid>
      <Grid item xs={4}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          component={TextField}
          sx={{ mt: 1, backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            readOnly: true,
          }}
          name="parthenocarpyKg"
        />
      </Grid>
      <Grid item xs={1.1}>
        <Checkbox
          name="looseFruitChecked"
          size="medium"
          sx={{
            mt: 1,
          }}
          disabled={isReadOnly}
        />
      </Grid>
      <Grid item xs={6.9}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
            style: {
              backgroundColor: isReadOnly ? "whitesmoke" : "",
            },
            // readOnly: isReadOnly,
            readOnly: true,
          }}
          component={TextField}
          label="Brondolan"
          name="looseFruitPercentage"
        />
      </Grid>
      <Grid item xs={4}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          component={TextField}
          sx={{ mt: 1, backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            readOnly: true,
          }}
          name="looseFruitKg"
        />
      </Grid>
      <Grid item xs={1.1}>
        <Checkbox
          name="mandatoryDeductionChecked"
          size="medium"
          sx={{
            mt: 1,
          }}
          disabled={isReadOnly}
        />
      </Grid>
      <Grid item xs={6.9}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
            style: {
              backgroundColor: isReadOnly ? "whitesmoke" : "",
              color: isReadOnly ? "transparent" : "",
            },
            // readOnly: isReadOnly,
            readOnly: true,
          }}
          component={TextField}
          label="Pot. Wajib Vendor"
          name="mandatoryDeductionPercentage"
        />
      </Grid>
      <Grid item xs={4}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          component={TextField}
          sx={{ mt: 1, backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            readOnly: true,
          }}
          name="mandatoryDeductionKg"
        />
      </Grid>
      <Grid item xs={1.1}>
        <Checkbox
          name=""
          size="medium"
          sx={{
            mt: 1,
          }}
          disabled={isReadOnly}
        />
      </Grid>
      <Grid item xs={6.9}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
            style: {
              backgroundColor: isReadOnly ? "whitesmoke" : "",
            },
            // readOnly: isReadOnly,
            readOnly: true,
          }}
          component={TextField}
          label="Pot. Lainnya"
          name="othersPercentage"
        />
      </Grid>
      <Grid item xs={4}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          component={TextField}
          sx={{ mt: 1, backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            readOnly: true,
          }}
          name="othersKg"
        />
      </Grid>
      <Grid item xs={1.1}></Grid>
      <Grid item xs={10.9}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1 }}
          inputProps={{
            style: {
              backgroundColor: isReadOnly ? "whitesmoke" : "",
            },
            // readOnly: isReadOnly,
            readOnly: true,
          }}
          component={TextField}
          label="Total Potongan"
          name="TangkaiPanjang"
        />
      </Grid>

      <Grid item xs={1.1}>
        <Checkbox
          name=""
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
      {/* <FormControlLabel
        label="Parent"
        control={
          <Checkbox
            checked={checked[0] && checked[1]}
            indeterminate={checked[0] !== checked[1]}
            onChange={handleChange1}
          />
        }
      /> */}

      {/* <FormControlLabel label="Child 1" control={<Checkbox checked={checked[0]} onChange={handleChange2} />} />
      <FormControlLabel label="Child 2" control={<Checkbox checked={checked[1]} onChange={handleChange3} />} /> */}
    </>
  );
};

export default SortasiTBS;
