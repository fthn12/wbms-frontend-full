import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  Divider,
  Paper,
  TextField as TextFieldMUI,
} from "@mui/material";
import { DriverFreeSolo } from "components/FormOthers";
import { TextField, Autocomplete } from "formik-mui";
import { Formik, Form, Field } from "formik";
import moment from "moment";

import {
  useAuth,
  useDriver,
  useConfig,
  useTransaction,
  useWeighbridge,
  useApp,
} from "../../../../../hooks";

const PksBackdateOthers = (props) => {
  const { setFieldValue, values } = props;
  console.clear();
  const { user } = useAuth();
  const { wb } = useWeighbridge();
  const { WBMS, SCC_MODEL } = useConfig();
  const { wbTransaction } = useTransaction();
  const { useGetDriversQuery } = useDriver();
  const { setSidebar } = useApp();
  const [originWeighNetto, setOriginWeighNetto] = useState(0);

  const { data: dtDrivers } = useGetDriversQuery();

  // const [dtTrx, setDtTrx] = useState(null);

  // useEffect(() => {
  //   setDtTrx(moment().format(`DD/MM/YYYY - HH:mm:ss`));
  //   setSidebar({ selected: "Transaksi WB PKS" });

  //   return () => {
  //     // console.clear();
  //   };
  // }, []);

  useEffect(() => {
    if (
      wbTransaction?.originWeighInKg < WBMS.WB_MIN_WEIGHT ||
      wbTransaction?.originWeighOutKg < WBMS.WB_MIN_WEIGHT
    ) {
      setOriginWeighNetto(0);
    } else {
      let total = Math.abs(
        wbTransaction?.originWeighInKg - wbTransaction?.originWeighOutKg
      );
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
            <DriverFreeSolo
              name="driverName"
              label="Nama Supir"
              isReadOnly={false}
              sx={{ mt: 2 }}
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
              sx={{ mt: 2 }}
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
              name="originWeighInOperatorName"
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
              name="originWeighOutOperatorName"
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
              sx={{ mt: 2, backgroundColor: "transparant" }}
              label="Waktu WB-IN"
              name="originWeighInTimestamp"
              InputLabelProps={{
                shrink: true,
              }}
              // value={moment(values?.originWeighInTimestamp).format(
              //   "YYYY-MM-DDTHH:mm"
              // )}
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              type="datetime-local"
              variant="outlined"
              component={TextField}
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "transparant" }}
              label="Waktu WB-Out"
              name="originWeighOutTimestamp"
              InputLabelProps={{
                shrink: true,
              }}
              // value={moment(values?.originWeighOutTimestamp).format(
              //   "YYYY-MM-DDTHH:mm"
              // )}
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
              sx={{ mt: 2, backgroundColor: "transparant" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">kg</InputAdornment>
                ),
              }}
              label="BERAT MASUK - IN"
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
              sx={{ mt: 2, mb: 3, backgroundColor: "transparant" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">kg</InputAdornment>
                ),
              }}
              label="BERAT KELUAR - OUT"
              name="originWeighOutKg"
              value={
                values?.originWeighOutKg > 0 ? values.originWeighOutKg : "0"
              }
              // inputProps={{ readOnly: true }}
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
              sx={{ mt: 3, backgroundColor: "whitesmoke" }}
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

export default PksBackdateOthers;
