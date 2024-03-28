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

const LBNBackdateDispatchNormal = (props) => {
  const { setFieldValue, values } = props;
  const { user } = useAuth();
  const { WBMS } = useConfig();
  const { wbTransaction, openedTransaction } = useTransaction();
  const { wb } = useWeighbridge();

  const T30Site = eDispatchApi.getT30Site();

  const [dtTrx, setDtTrx] = useState(null);
  const [originWeightNetto, setOriginWeightNetto] = useState(0);
  const [destinationWeightNetto, setDestinationWeightNetto] = useState(0);
  const [originWeighNetto, setOriginWeighNetto] = useState(0);

  useEffect(() => {
    setDtTrx(moment().format(`DD/MM/YYYY - HH:mm:ss`));
    return () => {};
  }, []);

  useEffect(() => {
    if (!openedTransaction) {
      return;
    }

    if (
      openedTransaction.originWeighInKg < WBMS.WB_MIN_WEIGHT ||
      openedTransaction.originWeighOutKg < WBMS.WB_MIN_WEIGHT
    ) {
      setOriginWeightNetto(0);
    } else {
      let total = Math.abs(
        openedTransaction.originWeighInKg - openedTransaction.originWeighOutKg
      );
      setOriginWeightNetto(total);
    }

    if (
      openedTransaction.destinationWeighInKg < WBMS.WB_MIN_WEIGHT ||
      openedTransaction.destinationWeighOutKg < WBMS.WB_MIN_WEIGHT
    ) {
      setDestinationWeightNetto(0);
    } else {
      let total = Math.abs(
        openedTransaction.destinationWeighInKg -
          openedTransaction.destinationWeighOutKg
      );
      setDestinationWeightNetto(total);
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
            <Divider>Segel Tangki Isi</Divider>
          </Grid>

          <Grid item xs={6}>
            <Field
              name="unloadedSeal1"
              label="Segel BONGKAR Mainhole 1"
              type="text"
              required={true}
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
              name="unloadedSeal2"
              label="Segel BONGKAR Valve 1"
              type="text"
              required={true}
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
              name="unloadedSeal3"
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
              name="unloadedSeal4"
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
              backgroundColor="lightyellow"
              siteId={WBMS.SITE.refId}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* <Grid item xs={12} sm={6} lg={3}>
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
              inputProps={{
                readOnly: true,
                style: { textTransform: "uppercase" },
              }}
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
                  ? moment(values.originWeighInTimestamp)
                      .local()
                      .format(`DD/MM/YYYY - HH:mm:ss`)
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
                  ? moment(values.originWeighOutTimestamp)
                      .local()
                      .format(`DD/MM/YYYY - HH:mm:ss`)
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
                endAdornment: (
                  <InputAdornment position="end">kg</InputAdornment>
                ),
              }}
              label="BERAT ASAL MASUK - IN"
              name="originWeighInKg"
              value={
                values?.originWeighInKg > 0
                  ? values.originWeighInKg.toFixed(2)
                  : "0.00"
              }
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
              sx={{
                mt: 2,
                mb: 2,
                backgroundColor: "whitesmoke",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">kg</InputAdornment>
                ),
              }}
              value={
                values?.originWeighOutKg > 0
                  ? values.originWeighOutKg.toFixed(2)
                  : "0.00"
              }
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
              sx={{
                mt: 2,
                mb: 2,
                backgroundColor: "whitesmoke",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">kg</InputAdornment>
                ),
              }}
              label="TOTAL ASAL"
              name="originweightNetto"
              value={
                originWeightNetto > 0 ? originWeightNetto.toFixed(2) : "0.00"
              }
            />
          </Grid>
        </Grid>
      </Grid> */}

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
              value={user.name.toUpperCase()}
              name="destinationWeighOutOperatorName"
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
              sx={{ mt: 2, backgroundColor: "lightyellow" }}
              label="Waktu WB-IN"
              name="destinationWeighInTimestamp"
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
              sx={{ mt: 2, backgroundColor: "lightyellow" }}
              label="Waktu WB-Out"
              name="destinationWeighOutTimestamp"
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
              name="destinationWeighInKg"
              value={
                values?.destinationWeighInKg > 0
                  ? values.destinationWeighInKg
                  : "0"
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
                required={true}
                sx={{ mt: 2, backgroundColor: "lightyellow" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">kg</InputAdornment>
                  ),
                }}
                label="BERAT WB-OUT"
                name="destinationWeighOutKg"
                value={
                  values?.destinationWeighOutKg > 0 ? values.destinationWeighOutKg : "0"
                }
              />
            </Grid>
  

          <Grid item xs={12} mt={2}>
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
              name="destinationweightNetto"
              value={
                destinationWeightNetto > 0
                  ? destinationWeightNetto.toFixed(2)
                  : "0.00"
              }
            />
          </Grid>
     
        </Grid>
      </Grid>

      {!wbTransaction && <CircularProgress />}
    </>
  );
};

export default LBNBackdateDispatchNormal;
