import React from "react";
import {
  Grid,
  InputAdornment,
  Divider,
  Checkbox,
  Field as FieldMUI,
} from "@mui/material";
import { Field, useFormikContext } from "formik";
import { TextField } from "formik-mui";

export const SortasiKernel = (props) => {
  const { isReadOnly } = props;
  const { values } = useFormikContext();

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
          value={
            values?.moisturePercentage > 0 ? values.moisturePercentage : "0"
          }
        />
      </Grid>
      <Grid item xs={5}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          component={TextField}
          sx={{ backgroundColor: isReadOnly ? "whitesmoke" : "" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            readOnly: isReadOnly,
          }}
          name="moistureKg"
          value={values?.moistureKg > 0 ? values.moistureKg : "0"}
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
          value={values?.dirtPercentage > 0 ? values.dirtPercentage : "0"}
        />
      </Grid>
      <Grid item xs={5}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          component={TextField}
          sx={{ mt: 2, backgroundColor: isReadOnly ? "whitesmoke" : "" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            readOnly: isReadOnly,
          }}
          name="dirtKg"
          value={values?.dirtKg > 0 ? values.dirtKg : "0"}
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
          value={values?.stonePercentage > 0 ? values.stonePercentage : "0"}
        />
      </Grid>
      <Grid item xs={5}>
        <Field
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          component={TextField}
          sx={{
            mt: 2,
            mb: 1.5,
            backgroundColor: isReadOnly ? "whitesmoke" : "",
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            readOnly: isReadOnly,
          }}
          name="stoneKg"
          value={values?.stoneKg > 0 ? values.stoneKg : "0"}
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
