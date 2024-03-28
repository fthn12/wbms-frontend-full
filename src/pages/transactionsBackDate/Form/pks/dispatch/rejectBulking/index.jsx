import React, { useEffect, useState } from "react";
import { Divider, Grid } from "@mui/material";
import {
  TextField as TextFieldMUI,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Field } from "formik";
import { TextField, Autocomplete } from "formik-mui";
import {
  CertificateSelect,
  StorageTankSelect,
} from "../../../../../../components/FormikMUI";

import * as eDispatchApi from "../../../../../../apis/eDispatchApi";
import {
  useAuth,
  useConfig,
  useTransaction,
  useWeighbridge,
  useApp,
  useDriver,
} from "hooks";

import moment from "moment";

const PKSBackdateDispatchRejectBulking = (props) => {
  const { setFieldValue, values } = props;
  const { user } = useAuth();
  const { WBMS } = useConfig();
  const { wbTransaction, openedTransaction } = useTransaction();
  const { wb } = useWeighbridge();
  const [returnWeighNetto, setReturnWeighNetto] = useState(0);
  const T30Site = eDispatchApi.getT30Site();

  const [dtTrx, setDtTrx] = useState(null);

  const [originWeighNetto, setOriginWeighNetto] = useState(0);

  useEffect(() => {
    setDtTrx(moment().format(`DD/MM/YYYY - HH:mm:ss`));
    return () => {};
  }, []);

  useEffect(() => {
    if (
      openedTransaction?.originWeighInKg < WBMS.WB_MIN_WEIGHT ||
      openedTransaction?.originWeighOutKg < WBMS.WB_MIN_WEIGHT
    ) {
      setOriginWeighNetto(0);
    } else {
      let total = Math.abs(
        openedTransaction?.originWeighInKg - openedTransaction?.originWeighOutKg
      );
      setOriginWeighNetto(total);
    }
    if (
      openedTransaction?.returnWeighInKg < WBMS.WB_MIN_WEIGHT ||
      openedTransaction?.returnWeighOutKg < WBMS.WB_MIN_WEIGHT
    ) {
      setReturnWeighNetto(0);
    } else {
      let total = Math.abs(
        openedTransaction?.returnWeighInKg - openedTransaction?.returnWeighOutKg
      );
      setReturnWeighNetto(total);
    }
  }, [openedTransaction]);

  return (
    <>
      <Grid item xs={12} sm={6} lg={3}>
        <Grid container columnSpacing={1}>
          <Grid item xs={12}>
            <Divider>Segel Saat ini</Divider>
          </Grid>
          <Grid item xs={6}>
            <Field
              name="currentSeal1"
              label="Segel Mainhole 1 Saat Ini"
              type="text"
              component={TextField}
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              inputProps={{ readOnly: true }}
              value={values?.currentSeal1 ? values.currentSeal1 : "-"}
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              name="currentSeal2"
              label="Segel Valve 1 Saat Ini"
              type="text"
              component={TextField}
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              inputProps={{ readOnly: true }}
              value={values?.currentSeal2 ? values.currentSeal2 : "-"}
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              name="currentSeal3"
              label="Segel Mainhole 2 Saat Ini"
              type="text"
              component={TextField}
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              inputProps={{ readOnly: true }}
              value={values?.currentSeal3 ? values.currentSeal3 : "-"}
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              name="currentSeal4"
              label="Segel Valve 2 Saat Ini"
              type="text"
              component={TextField}
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              inputProps={{ readOnly: true }}
              value={values?.currentSeal4 ? values.currentSeal4 : "-"}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Divider>Segel Tangki Bongkar</Divider>
          </Grid>
          <Grid item xs={6}>
            <Field
              name="returnUnloadedSeal1"
              label="Segel BONGKAR Mainhole 1"
              type="text"
              // required={true}
              component={TextField}
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "lightyellow" }}
              // inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              name="returnUnloadedSeal2"
              label="Segel BONGKAR Valve 1"
              type="text"
              // required={true}
              component={TextField}
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "lightyellow" }}
              // inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              name="returnUnloadedSeal3"
              label="Segel BONGKAR Mainhole 2"
              type="text"
              component={TextField}
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "lightyellow" }}
              // inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              name="returnUnloadedSeal4"
              label="Segel BONGKAR Valve 2"
              type="text"
              component={TextField}
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "lightyellow" }}
              // inputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>
      </Grid>
      {/* 
      <Grid item xs={12} sm={6} lg={3}>
        <Grid container columnSpacing={1}>
          <Grid item xs={12}>
            <Divider>DATA TIMBANG ASAL</Divider>
          </Grid>
          <Grid item xs={6}>
            <Field
              type="text"
              variant="outlined"
              component={TextField}
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "lightyellow" }}
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
              component={TextField}
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "lightyellow" }}
              label="Operator WB-OUT"
              name="originWeighOutOperatorName"
              value={user.name}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              type="datetime-local"
              variant="outlined"
              component={TextField}
              size="small"
              fullWidth
              required={true}
              sx={{
                mt: 2,
                backgroundColor: "lightyellow",
              }}
              label="WAKTU WB-IN"
              name="originWeighInTimestamp"
              value={moment(values?.originWeighInTimestamp).format(
                "YYYY-MM-DDTHH:mm"
              )}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              type="datetime-local"
              variant="outlined"
              component={TextField}
              size="small"
              fullWidth
              required={true}
              sx={{
                mt: 2,
                backgroundColor: "lightyellow",
              }}
              label="WAKTU WB-OUT"
              name="originWeighOutTimestamp"
              value={moment(values?.originWeighOutTimestamp).format(
                "YYYY-MM-DDTHH:mm"
              )}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              type="number"
              variant="outlined"
              component={TextField}
              size="small"
              fullWidth
              required={true}
              sx={{ mt: 2, backgroundColor: "lightyellow" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">kg</InputAdornment>
                ),
              }}
              label="BERAT WB-IN"
              name="originWeighInKg"
              value={values?.originWeighInKg > 0 ? values.originWeighInKg : "0"}
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              type="number"
              variant="outlined"
              component={TextField}
              size="small"
              fullWidth
              required={true}
              sx={{ mt: 2, backgroundColor: "lightyellow" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">kg</InputAdornment>
                ),
              }}
              label="BERAT WB-OUT"
              name="originWeighOutKg"
              value={
                values?.originWeighOutKg > 0 ? values.originWeighOutKg : "0"
              }
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Divider>TOTAL</Divider>
          </Grid>
          <Grid item xs={12}>
            <Field
              type="number"
              variant="outlined"
              component={TextField}
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "lightyellow" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">kg</InputAdornment>
                ),
              }}
              label="TOTAL"
              name="weightNetto"
              value={
                originWeighNetto > 0 ? originWeighNetto.toFixed(2) : "0.00"
              }
            />
          </Grid>
        </Grid>
      </Grid> */}

      <Grid item xs={12} sm={6} lg={3}>
        <Grid container columnSpacing={1}>
          <Grid item xs={12}>
            <Divider>DATA TIMBANG REJECT</Divider>
          </Grid>
          <Grid item xs={6}>
            <Field
              type="text"
              variant="outlined"
              component={TextField}
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              label="Operator WB-IN"
              name="returnWeighInOperatorName"
              value={user.name.toUpperCase()}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              type="text"
              variant="outlined"
              component={TextField}
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              label="Operator WB-OUT"
              name="returnWeighOutOperatorName"
              value={user.name.toUpperCase()}
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              type="datetime-local"
              variant="outlined"
              component={TextField}
              size="small"
              fullWidth
              required={true}
              sx={{
                mt: 2,
                backgroundColor: "lightyellow",
              }}
              label="WAKTU WB-IN"
              name="returnWeighInTimestamp"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              type="datetime-local"
              variant="outlined"
              component={TextField}
              size="small"
              fullWidth
              required={true}
              sx={{
                mt: 2,
                backgroundColor: "lightyellow",
              }}
              label="WAKTU WB-OUT"
              name="returnWeighOutTimestamp"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              type="number"
              variant="outlined"
              component={TextField}
              size="small"
              fullWidth
              required={true}
              sx={{ mt: 2, backgroundColor: "lightyellow" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">kg</InputAdornment>
                ),
              }}
              label="BERAT WB-IN"
              name="returnWeighInKg"
              value={values?.returnWeighInKg > 0 ? values.returnWeighInKg : "0"}
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              type="number"
              variant="outlined"
              component={TextField}
              size="small"
              fullWidth
              required={true}
              sx={{ mt: 2, backgroundColor: "lightyellow" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">kg</InputAdornment>
                ),
              }}
              label="BERAT WB-OUT"
              name="returnWeighOutKg"
              value={
                values?.returnWeighOutKg > 0 ? values.returnWeighOutKg : "0"
              }
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Divider>TOTAL TIMBANG REJECT</Divider>
          </Grid>
          <Grid item xs={12}>
            <Field
              type="number"
              variant="outlined"
              component={TextField}
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "lightyellow" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">kg</InputAdornment>
                ),
              }}
              label="TOTAL"
              name="returnWeighNetto"
              // value={
              //   returnWeighNetto > 0 ? returnWeighNetto.toFixed(2) : "0.00"
              // }
            />
          </Grid>
        </Grid>
      </Grid>

      {!wbTransaction && <CircularProgress />}
    </>
  );
};

export default PKSBackdateDispatchRejectBulking;
