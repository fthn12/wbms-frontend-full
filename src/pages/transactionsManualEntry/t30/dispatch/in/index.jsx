import React, { useEffect, useState } from "react";
import { Divider, Grid } from "@mui/material";
import { TextField as TextFieldMUI, InputAdornment, CircularProgress } from "@mui/material";
import { Field } from "formik";
import { TextField, Autocomplete } from "formik-mui";
import SyncIcon from "@mui/icons-material/Sync";

import ProgressStatus from "components/ProgressStatus";
import {
  TransportVehicleAC,
  CertificateSelect,
  CompanyAC,
  StorageTankSelect,
  ProduckSelect,
} from "../../../../../components/FormikMUI";
// import { DriverAC } from "../../../../../components/FormManual";
import * as eDispatchApi from "../../../../../apis/eDispatchApi";
import { TransactionAPI } from "apis";
import { useAuth, useConfig, useTransaction, useWeighbridge, useApp, useDriver } from "hooks";
import { useStorageTank } from "hooks";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const T30ManualEntryCPOIn = (props) => {
  const { setFieldValue, values } = props;
  const navigate = useNavigate();
  const transactionAPI = TransactionAPI();
  const { user } = useAuth();
  const { WBMS } = useConfig();
  const { urlPrev, setUrlPrev } = useApp();
  const { wbTransaction } = useTransaction();
  const { useGetDriversQuery } = useDriver();
  const { wb } = useWeighbridge();

  const { useFindManyStorageTanksQuery } = useStorageTank();
  const T30Site = eDispatchApi.getT30Site();
  const storageTankFilter = {
    where: {
      OR: [{ siteId: T30Site.id }, { siteRefId: T30Site.id }],
      refType: 1,
    },
  };
  const { data: dtStorageTank } = useFindManyStorageTanksQuery(storageTankFilter);

  const [dtTrx, setDtTrx] = useState(null);

  const [originWeighNetto, setOriginWeighNetto] = useState(0);

  useEffect(() => {
    setDtTrx(moment().format(`DD/MM/YYYY - HH:mm:ss`));
    return () => {};
  }, []);

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
            <Divider>DATA SUPIR & PRODUK</Divider>
          </Grid>

          <Grid item xs={6}>
            <CertificateSelect
              name="rspoSccModel"
              label="Sertifikasi RSPO"
              isRequired={false}
              // isReadOnly={true}
              sx={{ mt: 2 }}
              backgroundColor="transparant"
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              name="rspoCertificateNumber"
              label="Nomor Sertifikasi RSPO"
              type="text"
              component={TextField}
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              inputProps={{ readOnly: true }}
              value={values?.rspoCertificateNumber ? values.rspoCertificateNumber : "-"}
            />
          </Grid>

          <Grid item xs={6}>
            <CertificateSelect
              name="isccSccModel"
              label="Sertifikasi ISCC"
              isRequired={false}
              // isReadOnly={true}
              sx={{ mt: 2 }}
              backgroundColor="transparant"
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              name="isccCertificateNumber"
              label="Nomor Sertifikasi ISCC"
              type="text"
              component={TextField}
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              inputProps={{ readOnly: true }}
              value={values?.isccCertificateNumber ? values.isccCertificateNumber : "-"}
            />
          </Grid>

          <Grid item xs={6}>
            <CertificateSelect
              name="ispoSccModel"
              label="Sertifikasi ISPO"
              isRequired={false}
              // isReadOnly={true}
              sx={{ mt: 2 }}
              backgroundColor="transparant"
            />
          </Grid>
          <Grid item xs={6}>
            <Field
              name="ispoCertificateNumber"
              label="Nomor Sertifikasi ISPO"
              type="text"
              component={TextField}
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              inputProps={{ readOnly: true }}
              value={values?.ispoCertificateNumber ? values.ispoCertificateNumber : "-"}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ mt: 2 }}>Tangki</Divider>
          </Grid>

          <Grid item xs={12}>
            <StorageTankSelect
              name="originSourceStorageTankId"
              label="Tangki Asal"
              isRequired={true}
              // isReadOnly={false}
              sx={{ mt: 2 }}
              backgroundColor="transparant"
              siteId={T30Site.id}
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ mt: 3 }}>Kualitas</Divider>
          </Grid>

          <Grid item xs={4}>
            <Field
              name="originFfaPercentage"
              label="FFA"
              type="number"
              component={TextField}
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "transparant" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              // inputProps={{ readOnly: true }}
              // value={values?.originFfaPercentage > 0 ? values.originFfaPercentage.toFixed(2) : "0.00"}
            />
          </Grid>
          <Grid item xs={4}>
            <Field
              name="originMoistPercentage"
              label="Moist"
              type="number"
              component={TextField}
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "transparant" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              // inputProps={{ readOnly: true }}
              // value={values?.originMoistPercentage > 0 ? values.originMoistPercentage.toFixed(2) : "0.00"}
            />
          </Grid>
          <Grid item xs={4}>
            <Field
              name="originDirtPercentage"
              label="Dirt"
              type="number"
              component={TextField}
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "transparant" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              // inputProps={{ readOnly: true }}
              // value={values?.originDirtPercentage > 0 ? values.originDirtPercentage.toFixed(3) : "0.000"}
            />
          </Grid>
        </Grid>
      </Grid>

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
              name="loadedSeal1"
              label="Segel ISI Mainhole 1"
              type="text"
              required={true}
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
              name="loadedSeal2"
              label="Segel ISI Valve 1"
              type="text"
              required={true}
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
              name="loadedSeal3"
              label="Segel ISI Mainhole 2"
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
              name="loadedSeal4"
              label="Segel ISI Valve 2"
              type="text"
              component={TextField}
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "tranparant" }}
              // inputProps={{ readOnly: true }}
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
              label="Waktu WB-IN"
              name="originWeighInTimestamp"
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
              component={TextField}
              size="small"
              fullWidth
              sx={{ mt: 2, mb: 2, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              value={values?.originWeighOutKg > 0 ? values.originWeighOutKg.toFixed(2) : "0.00"}
              label="BERAT KELUAR - OUT"
              name="originWeighOutKg"
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
              value={originWeighNetto > 0 ? originWeighNetto.toFixed(2) : "0.00"}
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 3 }}>
            <Divider>Catatan</Divider>
          </Grid>

          <Grid item xs={12}>
            <Field
              name="loadedSeal1"
              label="Catatan alasan untuk Entri Manual"
              type="text"
              multiline
              rows={6}
              required={true}
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

      {!wbTransaction && <CircularProgress />}
    </>
  );
};

export default T30ManualEntryCPOIn;
