import { useEffect, useState } from "react";
import { Grid, InputAdornment, Checkbox, TextField as TextFieldMUI } from "@mui/material";
import { Field, useFormikContext } from "formik";
import { TextField } from "formik-mui";
// import { useTransaction } from "../../../../../hooks";

export const SortasiTBS = (props) => {
  const { isReadOnly } = props;
  const { values, setFieldValue} = useFormikContext();

  const [totalPotongan, setTotalPotongan] = useState(0);


  const handleSelectAll = (event) => {
    const isChecked = event.target.checked;

    setFieldValue("unRipeChecked", isChecked);
    setFieldValue("underRipeChecked", isChecked);
    setFieldValue("longStalkChecked", isChecked);
    setFieldValue("emptyBunchChecked", isChecked);
    setFieldValue("garbageDirtChecked", isChecked);
    setFieldValue("waterChecked", isChecked);
    setFieldValue("parthenocarpyChecked", isChecked);
    setFieldValue("looseFruitChecked", isChecked);
    setFieldValue("mandatoryDeductionChecked", isChecked);
    setFieldValue("othersChecked", isChecked);
  };

  useEffect(() => {
    let total = Math.abs(
      values.unripeKg +
        values.underRipeKg +
        values.longStalkKg +
        values.emptyBunchKg +
        values.garbageDirtKg +
        values.waterKg +
        values.parthenocarpyKg +
        values.looseFruitKg +
        values.mandatoryDeductionKg +
        values.othersKg,
    );
    setTotalPotongan(total);
  }, [values]);

  //grading potongan wajib
  useEffect(() => {
    const mandatoryDeductionKg = Math.trunc(Math.abs(values.mandatoryDeductionPercentage / 100) * values.janjang);
    setFieldValue("mandatoryDeductionKg", mandatoryDeductionKg);
  }, [values.mandatoryDeductionPercentage, values.janjang, setFieldValue]);

   //grading potongan lainnya
   useEffect(() => {
    const othersKg = Math.trunc(Math.abs(values.othersPercentage / 100) * values.janjang);
    setFieldValue("othersKg", othersKg);
  }, [values.othersPercentage, values.janjang, setFieldValue]);

  

  return (
    <>
      <Grid item xs={1.1}>
        <Checkbox
          name="unRipeChecked"
          size="medium"
          checked={values?.unRipeChecked}
          onChange={(e) => setFieldValue("unRipeChecked", e.target.checked)}
          disabled={isReadOnly}
        />
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
          checked={values?.underRipeChecked}
          onChange={(e) => setFieldValue("underRipeChecked", e.target.checked)}
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
            readOnly: true,
          }}
          name="underRipeKg"
        />
      </Grid>
      <Grid item xs={1.1}>
        <Checkbox
          name="longStalkChecked"
          checked={values?.longStalkChecked}
          onChange={(e) => setFieldValue("longStalkChecked", e.target.checked)}
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
          checked={values?.emptyBunchChecked}
          onChange={(e) => setFieldValue("emptyBunchChecked", e.target.checked)}
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
          checked={values?.garbageDirtChecked}
          onChange={(e) => setFieldValue("garbageDirtChecked", e.target.checked)}
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
          checked={values?.waterChecked}
          onChange={(e) => setFieldValue("waterChecked", e.target.checked)}
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
          checked={values?.parthenocarpyChecked}
          onChange={(e) => setFieldValue("parthenocarpyChecked", e.target.checked)}
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
          checked={values?.looseFruitChecked}
          onChange={(e) => setFieldValue("looseFruitChecked", e.target.checked)}
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
          onChange={(e) => setFieldValue("mandatoryDeductionChecked", e.target.checked)}
          checked={values?.mandatoryDeductionChecked}
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
          value={values?.mandatoryDeductionKg}
        />
      </Grid>

      <Grid item xs={1.1}>
        <Checkbox
          name="othersChecked"
          checked={values?.othersChecked}
          onChange={(e) => setFieldValue("othersChecked", e.target.checked)}
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
          name="Total Potongan"
          fullWidth
          sx={{ mt: 1 }}
          inputProps={{
            style: {
              backgroundColor: isReadOnly ? "whitesmoke" : "",
            },
            readOnly: true,
          }}
          component={TextField}
          value={totalPotongan}
          label="Total Potongan [KG]"
        />
      </Grid>

      <Grid item xs={1.1}>
        <Checkbox
          // name="selectAll"
          checked={
            values?.unRipeChecked &&
            values?.underRipeChecked &&
            values?.longStalkChecked &&
            values?.emptyBunchChecked &&
            values?.garbageDirtChecked &&
            values?.waterChecked &&
            values?.parthenocarpyChecked &&
            values?.looseFruitChecked &&
            values?.mandatoryDeductionChecked &&
            values?.othersChecked
          }
          onChange={handleSelectAll}
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
