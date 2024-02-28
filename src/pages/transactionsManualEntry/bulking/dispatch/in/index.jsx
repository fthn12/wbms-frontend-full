import React, { useEffect, useState } from "react";
import { Divider, Grid } from "@mui/material";
import { TextField as TextFieldMUI, InputAdornment, CircularProgress } from "@mui/material";
import { Field } from "formik";
import { TextField, Autocomplete } from "formik-mui";
import { CertificateSelect, StorageTankSelect } from "../../../../../components/FormikMUI";

import * as eDispatchApi from "../../../../../apis/eDispatchApi";
import { useAuth, useConfig, useTransaction, useWeighbridge, useApp, useDriver } from "hooks";

import moment from "moment";

const LBNManualEntryDispatchIn = (props) => {
  const { setFieldValue, values } = props;
  const { user } = useAuth();
  const { WBMS } = useConfig();
  const { wbTransaction } = useTransaction();
  const { wb } = useWeighbridge();

  const LBNSite = eDispatchApi.getBulkingSite();

  const [dtTrx, setDtTrx] = useState(null);

  const [originWeightNetto, setOriginWeightNetto] = useState(0);
  const [destinationWeightNetto, setDestinationWeightNetto] = useState(0);

  useEffect(() => {
    setDtTrx(moment().format(`DD/MM/YYYY - HH:mm:ss`));
    return () => {};
  }, []);

  useEffect(() => {
    if (values.originWeighInKg < WBMS.WB_MIN_WEIGHT || values.originWeighOutKg < WBMS.WB_MIN_WEIGHT) {
      setOriginWeightNetto(0);
    } else {
      let total = Math.abs(values.originWeighInKg - values.originWeighOutKg);
      setOriginWeightNetto(total);
    }

    if (values.destinationWeighInKg < WBMS.WB_MIN_WEIGHT || values.destinationWeighOutKg < WBMS.WB_MIN_WEIGHT) {
      setDestinationWeightNetto(0);
    } else {
      let total = Math.abs(values.destinationWeighInKg - values.destinationWeighOutKg);
      setDestinationWeightNetto(total);
    }
  }, [values]);

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
            <Divider>Segel Tangki Isi</Divider>
          </Grid>

          <Grid item xs={6}>
            <Field
              name="unloadedSeal1"
              label="Segel BONGKAR Mainhole 1"
              type="text"
              // required={true}
              component={TextField}
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "transparant" }}
              // inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              name="unloadedSeal2"
              label="Segel BONGKAR Valve 1"
              type="text"
              // required={true}
              component={TextField}
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "transparant" }}
              // inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              name="unloadedSeal3"
              label="Segel BONGKAR Mainhole 2"
              type="text"
              component={TextField}
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "transparant" }}
              // inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              name="unloadedSeal4"
              label="Segel BONGKAR Valve 2"
              type="text"
              component={TextField}
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "tranparant" }}
              // inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ mt: 2 }}>Tangki</Divider>
          </Grid>

          <Grid item xs={12}>
            <StorageTankSelect
              name="destinationSinkStorageTankId"
              label="Tangki Tujuan"
              isRequired={true}
              isReadOnly={false}
              sx={{ mt: 2 }}
              backgroundColor="transparant"
              siteId={WBMS.SITE.refId}
            />
          </Grid>
        </Grid>
      </Grid>

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
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              label="Operator Asal WB-IN"
              name="originWeighInOperatorName"
              value={values?.originWeighInOperatorName || "-"}
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
              label="Operator Asal WB-OUT"
              value={values?.originWeighOutOperatorName || "-"}
              name="originWeighOutOperatorName"
              inputProps={{ readOnly: true, style: { textTransform: "uppercase" } }}
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
              label="Waktu Asal WB-IN"
              name="originWeighInTimestamp"
              inputProps={{ readOnly: true }}
              value={
                values?.originWeighInTimestamp
                  ? moment(values.originWeighInTimestamp).local().format(`DD/MM/YYYY - HH:mm:ss`)
                  : "-"
              }
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
              label="Waktu Asal WB-Out"
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
              component={TextField}
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              label="BERAT ASAL MASUK - IN"
              name="originWeighInKg"
              value={values?.originWeighInKg > 0 ? values.originWeighInKg.toFixed(2) : "0.00"}
              inputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={6}>
            <Field
              type="number"
              variant="outlined"
              component={TextField}
              size="small"
              fullWidth
              sx={{ mt: 2, mb: 2, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              value={values?.originWeighOutKg > 0 ? values.originWeighOutKg.toFixed(2) : "0.00"}
              label="BERAT ASAL KELUAR - OUT"
              name="originWeighOutKg"
              inputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider>TOTAL ASAL</Divider>
          </Grid>
          <Grid item xs={12}>
            <Field
              type="number"
              variant="outlined"
              component={TextField}
              size="small"
              fullWidth
              sx={{ mt: 2, mb: 2, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              label="TOTAL ASAL"
              name="weightNetto"
              value={originWeightNetto > 0 ? originWeightNetto.toFixed(2) : "0.00"}
            />
          </Grid>
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
              component={TextField}
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              label="Operator WB-IN"
              name="destinationWeighInOperatorName"
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
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              label="Operator WB-OUT"
              value={values?.destinationWeighOutOperatorName || "-"}
              name="destinationWeighOutOperatorName"
              inputProps={{ readOnly: true, style: { textTransform: "uppercase" } }}
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
              label="Waktu WB-IN"
              name="destinationWeighInTimestamp"
              inputProps={{ readOnly: true }}
              value={dtTrx || "-"}
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
              label="Waktu WB-Out"
              name="destinationWeighOutTimestamp"
              inputProps={{ readOnly: true }}
              value={
                values?.destinationWeighOutTimestamp
                  ? moment(values.destinationWeighOutTimestamp).local().format(`DD/MM/YYYY - HH:mm:ss`)
                  : "-"
              }
            />
          </Grid>
          {WBMS.USE_WB === true && (
            <Grid item xs={6}>
              <Field
                type="number"
                variant="outlined"
                component={TextField}
                size="small"
                fullWidth
                sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                }}
                label="BERAT MASUK - IN"
                name="destinationWeighInKg"
                value={wb?.weight > 0 ? wb.weight.toFixed(2) : "0.00"}
                inputProps={{ readOnly: true }}
              />
            </Grid>
          )}
          {WBMS.USE_WB === false && (
            <Grid item xs={6}>
              <Field
                type="number"
                variant="outlined"
                component={TextField}
                size="small"
                fullWidth
                required={true}
                sx={{ mt: 2 }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                }}
                label="BERAT MASUK - IN"
                name="destinationWeighInKg"
                value={values?.destinationWeighInKg > 0 ? values.destinationWeighInKg : "0"}
              />
            </Grid>
          )}
          <Grid item xs={6}>
            <Field
              type="number"
              variant="outlined"
              component={TextField}
              size="small"
              fullWidth
              sx={{ mt: 2, mb: 2, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              value={values?.destinationWeighOutKg > 0 ? values.destinationWeighOutKg.toFixed(2) : "0.00"}
              label="BERAT KELUAR - OUT"
              name="destinationWeighOutKg"
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
              component={TextField}
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              label="TOTAL"
              name="weightNetto"
              value={destinationWeightNetto > 0 ? destinationWeightNetto.toFixed(2) : "0.00"}
            />
          </Grid>
        </Grid>
      </Grid>

      {!wbTransaction && <CircularProgress />}
    </>
  );
};

export default LBNManualEntryDispatchIn;
