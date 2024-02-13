import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  Divider,
  Checkbox,
  TextField as TextFieldMUI,
} from "@mui/material";
import { TextField, Autocomplete } from "formik-mui";
import { Formik, Form, Field, useFormikContext } from "formik";
import moment from "moment";
import SortasiTBS from "../../../../../components/SortasiTBS";

import { useAuth, useConfig, useTransaction, useDriver, useWeighbridge, useApp } from "../../../../../hooks";

const PksManualEntryTbsIn = (props) => {
  // const { setFieldValue, values } = props;
  const { values, setFieldValue } = useFormikContext();

  const { user } = useAuth();
  const { wb } = useWeighbridge();
  const { WBMS, SCC_MODEL } = useConfig();
  const { useGetDriversQuery } = useDriver();

  const { wbTransaction } = useTransaction();
  const { data: dtDrivers } = useGetDriversQuery();
  const { setSidebar } = useApp();
  const [originWeighNetto, setOriginWeighNetto] = useState(0);

  const [dtTrx, setDtTrx] = useState(null);

  useEffect(() => {
    setDtTrx(moment().format(`DD/MM/YYYY - HH:mm:ss`));
    setSidebar({ selected: "Transaksi WB PKS" });

    return () => {
      // console.clear();
    };
  }, []);

  // useEffect(() => {
  //   if (!wbTransaction) return handleClose();

  //   setSidebar({ selected: "Transaksi WB PKS" });
  //   setValues(wbTransaction);

  //   return () => {
  //     // console.clear();
  //   };
  // }, []);

  useEffect(() => {
    if (wbTransaction?.originWeighInKg < WBMS.WB_MIN_WEIGHT || wbTransaction?.originWeighOutKg < WBMS.WB_MIN_WEIGHT) {
      setOriginWeighNetto(0);
    } else {
      let total = Math.abs(wbTransaction?.originWeighInKg - wbTransaction?.originWeighOutKg);
      setOriginWeighNetto(total);
    }
  }, [wbTransaction]);

  return (
    <>
      <Grid item xs={12} sm={6} lg={3}>
        <Grid container columnSpacing={1}>
          <Grid item xs={12}>
            <Divider>DATA SUPIR & MUATAN</Divider>
          </Grid>
          <Grid item xs={12}>
            <Field
              name="driverName"
              component={Autocomplete}
              variant="outlined"
              fullWidth
              freeSolo
              disableClearable
              options={dtDrivers?.records.map((record) => record.name)}
              onInputChange={(event, InputValue, reason) => {
                if (reason !== "reset") {
                  setFieldValue("driverName", InputValue.toUpperCase());
                }
              }}
              renderInput={(params) => (
                <TextFieldMUI
                  {...params}
                  name="driverName"
                  size="small"
                  label="Nama Supir"
                  sx={{ mt: 2 }}
                  inputProps={{
                    ...params.inputProps,
                    style: { textTransform: "uppercase" },
                  }}
                />
              )}
            />

            <Field
              name="afdeling"
              label="Afdeling"
              type="text"
              variant="outlined"
              size="small"
              component={TextField}
              fullWidth
              value={values?.afdeling}
              sx={{ mt: 2 }}
              inputProps={{
                style: { textTransform: "uppercase" },
              }}
            />
            <Field
              name="kebun"
              label="Kebun"
              type="text"
              variant="outlined"
              size="small"
              fullWidth
              component={TextField}
              value={values?.kebun}
              sx={{ mt: 2 }}
              inputProps={{
                style: { textTransform: "uppercase" },
              }}
            />
            <Field
              name="blok"
              label="Blok"
              type="text"
              variant="outlined"
              size="small"
              component={TextField}
              fullWidth
              value={values?.blok}
              sx={{ mt: 2 }}
              inputProps={{
                style: { textTransform: "uppercase" },
              }}
            />
            <Field
              name="janjang"
              label="Janjang/Sak"
              type="number"
              variant="outlined"
              size="small"
              component={TextField}
              fullWidth
              value={values?.janjang}
              sx={{ mt: 2 }}
            />
            <Field
              name="npb"
              label="NPB/BE"
              type="text"
              variant="outlined"
              size="small"
              component={TextField}
              fullWidth
              value={values?.npb}
              sx={{ mt: 2 }}
              inputProps={{
                style: { textTransform: "uppercase" },
              }}
            />
            <Field
              name="tahun"
              label="Tahun"
              type="number"
              variant="outlined"
              size="small"
              component={TextField}
              fullWidth
              value={values?.tahun}
              sx={{ mt: 2, mb: 2.5 }}
            />
            <Grid item xs={12}>
              <Divider>SPTBS</Divider>
            </Grid>

            <Field
              name="sptbs"
              label="SPTBS"
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              component={TextField}
              value={values?.sptbs}
              sx={{ mt: 2.5 }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <Grid container columnSpacing={1}>
          <Grid item xs={12}>
            <Divider sx={{ mb: 2 }}>KUALITAS TBS</Divider>
          </Grid>
          <SortasiTBS isReadOnly={true} />
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <Grid container columnSpacing={1}>
          <Grid item xs={12}>
            <Divider>DATA TIMBANG KENDARAAN</Divider>
          </Grid>
          <Grid item xs={6}>
            <Field
              type="text"
              variant="outlined"
              size="small"
              fullWidth
              component={TextField}
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              label="Operator WB-IN"
              name="originWeighInOperatorName"
              value={user.name}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              type="text"
              variant="outlined"
              size="small"
              fullWidth
              component={TextField}
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              label="Operator WB-OUT"
              value="-"
              name="originWeighOutOperatorName"
              inputProps={{ readOnly: true, style: { textTransform: "uppercase" } }}
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              type="text"
              variant="outlined"
              size="small"
              fullWidth
              component={TextField}
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              label="Waktu WB-IN"
              name="originWeighInTimestamp"
              value={dtTrx || "-"}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              type="text"
              variant="outlined"
              size="small"
              fullWidth
              component={TextField}
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              label="Waktu WB-Out"
              name="originWeighOutTimestamp"
              inputProps={{ readOnly: true }}
              value={
                values?.originWeighOutTimestamp
                  ? moment(values.originWeighOutTimestamp).local().format(`DD/MM/YYYY - HH:mm:ss`)
                  : "-"
              }
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              component={TextField}
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              label="BERAT MASUK - IN"
              name="originWeighInKg"
              value={wb?.weight > 0 ? wb.weight.toFixed(2) : "0.00"}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              component={TextField}
              sx={{ mt: 2, mb: 1.5, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              label="BERAT KELUAR - OUT"
              name="originWeighOutKg"
              value={values?.originWeighOutKg > 0 ? values.originWeighOutKg.toFixed(2) : "0.00"}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider>TOTAL</Divider>
          </Grid>
          <Grid item xs={12}>
            <Field
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              component={TextField}
              sx={{ mt: 1.5, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              label="TOTAL SEBELUM"
              name="weightNetto"
              value={originWeighNetto > 0 ? originWeighNetto.toFixed(2) : "0.00"}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              component={TextField}
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              label={<span style={{ color: "red" }}>POTONGAN</span>}
              name="weightNetto"
              value={0}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              component={TextField}
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              label="TOTAL SESUDAH"
              name="weightNetto"
              value="0.00"
              inputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>
      </Grid>

      {!wbTransaction && (
        <CircularProgress
          size={50}
          sx={{
            color: "goldenrod",
            position: "absolute",
            top: "50%",
            left: "48.5%",
            zIndex: 999,
          }}
        />
      )}
    </>
  );
};

export default PksManualEntryTbsIn;
