import React from "react";
import { Grid, InputAdornment, Divider, Checkbox, Field as FieldMUI } from "@mui/material";
import { Field } from "formik";
import { TextField } from "formik-mui";

export const SortasiKernel = (props) => {
  const { isReadOnly } = props;

  return (
    <>
      <Grid item xs={7}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
            style: {
              backgroundColor: isReadOnly ? "whitesmoke" : "",
            },
            readOnly: isReadOnly,
          }}
          component={TextField}
          label="Moisture"
          name="moisturePercentage"
        />
      </Grid>
      <Grid item xs={5}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          component={TextField}
          sx={{ backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            readOnly: true,
          }}
          name="moistureKg"
        />
      </Grid>
      <Grid item xs={7}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 2 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
            style: {
              backgroundColor: isReadOnly ? "whitesmoke" : "",
            },
            readOnly: isReadOnly,
          }}
          component={TextField}
          label="Dirt"
          name="dirtPercentage"
        />
      </Grid>
      <Grid item xs={5}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          component={TextField}
          sx={{ mt: 2, backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            readOnly: true,
          }}
          name="dirtKg"
        />
      </Grid>
      <Grid item xs={7}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 2 }}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
            style: {
              backgroundColor: isReadOnly ? "whitesmoke" : "",
            },
            readOnly: isReadOnly,
          }}
          component={TextField}
          label="Stone"
          name="stonePercentage"
        />
      </Grid>
      <Grid item xs={5}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          component={TextField}
          sx={{ mt: 2, mb: 1.5, backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            readOnly: true,
          }}
          name="stoneKg"
        />
      </Grid>

      <Grid item xs={12}>
        <Divider>TOTAL POTONGAN</Divider>
      </Grid>
      <Grid item xs={12}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1.5 }}
          inputProps={{
            style: {
              backgroundColor: isReadOnly ? "whitesmoke" : "",
            },
            readOnly: isReadOnly,
          }}
          component={TextField}
          label="Total Potongan [KG]"
          name="TangkaiPanjang"
        />
      </Grid>
    </>
  );
};

export default SortasiKernel;
