import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Grid,
  InputAdornment,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Paper,
} from "@mui/material";
import { toast } from "react-toastify";
import moment from "moment";

import Header from "../../../../components/layout/signed/HeaderTransaction";
import QRCodeViewer from "../../../../components/QRCodeViewer";

import { useForm } from "../../../../utils/useForm";
import { TransactionAPI } from "../../../../apis";
import * as eDispatchApi from "../../../../apis/eDispatchApi";

import {
  useAuth,
  useConfig,
  useTransaction,
  useWeighbridge,
  useApp,
} from "../../../../hooks";
import { useStorageTank } from "../../../../hooks";

const TransactionT30WbOutCancel = (props) => {
  const navigate = useNavigate();

  const transactionAPI = TransactionAPI();

  const { user } = useAuth();
  const { setSidebar } = useApp();
  const { WBMS, SCC_MODEL, RSPO_SCC_MODEL, ISCC_SCC_MODEL } = useConfig();
  const { wbTransaction, clearWbTransaction } = useTransaction();
  const { wb } = useWeighbridge();

  const { useFindManyStorageTanksQuery } = useStorageTank();

  const T30Site = eDispatchApi.getT30Site();

  const storageTankFilter = {
    where: {
      OR: [{ siteId: WBMS.SITE.refId }, { siteRefId: WBMS.SITE.refId }],
      refType: 1,
    },
  };

  const { data: dtStorageTanks } =
    useFindManyStorageTanksQuery(storageTankFilter);

  const { values, setValues, handleInputChange } = useForm({
    ...transactionAPI.InitialData,
  });

  const [originWeighNetto, setOriginWeighNetto] = useState(0);
  const [returnWeighNetto, setReturnWeighNetto] = useState(0);

  const [canSubmit, setCanSubmit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [dtRspoScc, setDtRspoScc] = useState(RSPO_SCC_MODEL);
  const [dtIsccScc, setDtIsccScc] = useState(ISCC_SCC_MODEL);

  const handleClose = () => {
    clearWbTransaction();

    navigate("/wb/transactions");
  };

  const handleSubmit = async () => {
    let tempTrans = { ...values };

    try {
      tempTrans.returnWeighOutTimestamp = moment().toDate();
      tempTrans.returnWeighOutOperatorName = user.name;
      tempTrans.dtTransaction = moment()
        .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
        .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
        .format();

      const data = { wbTransaction: { ...tempTrans } };

      const response = await transactionAPI.eDispatchT30CancelOutAfter(data);

      if (!response.status) {
        throw new Error(response?.message);
      }

      // setWbTransaction(response.data.transaction);
      clearWbTransaction();
      setValues({ ...response.data.transaction });
      setIsSubmitted(true);

      toast.success(`Transaksi WB-OUT Cancel telah tersimpan.`);
    } catch (error) {
      toast.error(`${error.message}.`);
      return;
    }
  };

  useEffect(() => {
    if (!wbTransaction) {
      handleClose();
      return;
    }

    setSidebar({ selected: "Transaksi WB T30" });
    setValues(wbTransaction);

    return () => {
      // console.clear();
    };
  }, []);

  useEffect(() => {
    if (!isSubmitted) {
      setValues((prev) => ({
        ...prev,
        returnWeighOutKg: wb.weight,
      }));
    }
  }, [wb.weight]);

  useEffect(() => {
    if (
      values.originWeighInKg < WBMS.WB_MIN_WEIGHT ||
      values.originWeighOutKg < WBMS.WB_MIN_WEIGHT
    ) {
      setOriginWeighNetto(0);
    } else {
      let total = Math.abs(values.originWeighInKg - values.originWeighOutKg);

      setOriginWeighNetto(total);
    }

    if (
      values.returnWeighInKg < WBMS.WB_MIN_WEIGHT ||
      values.returnWeighOutKg < WBMS.WB_MIN_WEIGHT
    ) {
      setReturnWeighNetto(0);
    } else {
      let total = Math.abs(values.returnWeighInKg - values.returnWeighOutKg);

      setReturnWeighNetto(total);
    }
  }, [values]);

  // Untuk validasi field
  useEffect(() => {
    let cSubmit = false;

    if (values.returnWeighOutKg >= WBMS.WB_MIN_WEIGHT) {
      cSubmit = true;
    }

    setCanSubmit(cSubmit);
  }, [WBMS.WB_MIN_WEIGHT, values]);

  let cbRspoScc;
  cbRspoScc = (
    <FormControl
      fullWidth
      size="small"
      sx={{ mt: 2, backgroundColor: "whitesmoke" }}
      required
    >
      <InputLabel id="rspoScc">Sertifikasi RSPO</InputLabel>
      <Select
        labelId="rspoScc"
        label="Sertifikasi RSPO"
        name="rspoSccModel"
        disabled
        value={values?.rspoSccModel || 0}
      >
        {dtRspoScc &&
          dtRspoScc.length > 0 &&
          dtRspoScc?.map((data, index) => {
            return (
              <MenuItem key={index} value={data.id}>
                {data.value}
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>
  );

  let cbIsccScc;
  cbIsccScc = (
    <FormControl
      fullWidth
      size="small"
      sx={{ mt: 2, backgroundColor: "whitesmoke" }}
      required
    >
      <InputLabel id="isccScc">Sertifikasi ISCC</InputLabel>
      <Select
        labelId="isccScc"
        label="Sertifikasi ISCC"
        name="isccSccModel"
        disabled
        value={values?.isccSccModel || 0}
      >
        {dtIsccScc &&
          dtIsccScc.length > 0 &&
          dtIsccScc?.map((data, index) => {
            return (
              <MenuItem key={index} value={data.id}>
                {data.value}
              </MenuItem>
            );
          })}
      </Select>
    </FormControl>
  );

  let cbStorageTanks;
  cbStorageTanks = (
    <FormControl fullWidth size="small" sx={{ mt: 2 }} required>
      <InputLabel id="originSourceStorageTankId">Tangki Asal</InputLabel>
      <Select
        labelId="originSourceStorageTankId"
        label="Tangki Asal"
        name="originSourceStorageTankId"
        disabled
        value={values?.originSourceStorageTankId || ""}
      >
        {dtStorageTanks?.records &&
          dtStorageTanks.records?.map((data, index) => (
            <MenuItem key={index} value={data.id}>
              {`[${data.siteName}] ${data.name} ${data.productName}`}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );

  return (
    <Box>
      <Header title="TRANSAKSI T30" subtitle="WB-OUT" />

      <Box display="flex" sx={{ mt: 3 }}>
        <Box flex={1}></Box>
        <Button
          variant="contained"
          disabled={!isSubmitted}
          onClick={handleClose}
        >
          TUTUP
        </Button>
      </Box>

      <Paper sx={{ mt: 1, p: 2, minHeight: "72vh" }}>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              sx={{ backgroundColor: "whitesmoke" }}
              label="Nomor BON Trip"
              name="bonTripNo"
              value={values?.bonTripNo || ""}
            />

            <Grid container columnSpacing={1}>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                  label="Nama Supir"
                  name="driverFullName"
                  value={values?.driverName || ""}
                />
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                  label="NIK"
                  name="driverNik"
                  value={values?.driverNik || ""}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                  label="Nomor Polisi"
                  name="transportVehiclePlateNo"
                  value={values?.transportVehiclePlateNo || ""}
                />
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                  label="SIM"
                  name="driverFullName"
                  value={values?.driverLicenseNo || ""}
                />
              </Grid>
            </Grid>

            <TextField
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              label="Nama Vendor"
              name="transporterCompanyName"
              value={
                `${values?.transporterCompanyName} - ${values?.transporterCompanyCode}` ||
                ""
              }
            />

            <Grid container columnSpacing={1}>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                  label="Kode Produk Kendaraan"
                  name="transportVehicleProductCode"
                  value={values?.transportVehicleProductCode || ""}
                />
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                  label="Kode Produk"
                  name="productCode"
                  value={values?.productCode || ""}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                  label="Nama Produk Kendaraan"
                  name="transportVehicleProductName"
                  value={values?.transportVehicleProductName || ""}
                />
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                  label="Nama Produk"
                  name="productName"
                  value={values?.productName || ""}
                />
              </Grid>
            </Grid>

            <TextField
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              label="Vehicle Allowable Scc Model"
              name="transportVehicleSccModel"
              value={SCC_MODEL[values?.transportVehicleSccModel || 0]}
            />

            {cbRspoScc}

            {cbIsccScc}
          </Grid>
          <Grid item xs={3}>
            <Grid container columnSpacing={1}>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ backgroundColor: "whitesmoke" }}
                  label="Segel 1 Saat Ini"
                  name="currentSeal1"
                  value={values?.currentSeal1 || ""}
                />
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{
                    mt: 2,
                    backgroundColor: "whitesmoke",
                  }}
                  required
                  label="Segel Mainhole 1"
                  name="loadedSeal1"
                  value={values?.loadedSeal1 || ""}
                />
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{
                    mt: 2,
                    backgroundColor: "whitesmoke",
                  }}
                  required
                  label="Segel Valve 1"
                  name="loadedSeal2"
                  value={values?.loadedSeal2 || ""}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ backgroundColor: "whitesmoke" }}
                  label="Segel 2 Saat Ini"
                  name="currentSeal2"
                  value={values?.currentSeal2 || ""}
                />
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{
                    mt: 2,
                    backgroundColor: "whitesmoke",
                  }}
                  label="Segel Mainhole 2"
                  name="loadedSeal3"
                  value={values?.loadedSeal3 || ""}
                />
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{
                    mt: 2,
                    backgroundColor: "whitesmoke",
                  }}
                  label="Segel Valve 2"
                  name="loadedSeal4"
                  value={values?.loadedSeal4 || ""}
                />
              </Grid>
            </Grid>
            {cbStorageTanks}
          </Grid>
          <Grid item xs={3}>
            <Grid container columnSpacing={1}>
              <Grid item xs={5}>
                <TextField
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ backgroundColor: "whitesmoke" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">kg</InputAdornment>
                    ),
                  }}
                  label="Berat WB-IN"
                  name="originWeighInKg"
                  value={values?.originWeighInKg || 0}
                />
                <TextField
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">kg</InputAdornment>
                    ),
                  }}
                  label="Berat WB-OUT"
                  name="originWeighOutKg"
                  value={values?.originWeighOutKg || 0}
                />
              </Grid>
              <Grid item xs={7}>
                <TextField
                  type="datetime-local"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ backgroundColor: "whitesmoke" }}
                  label="Waktu WB-IN"
                  name="originWeighInTimestamp"
                  disabled
                  value={
                    moment(values?.originWeighInTimestamp)
                      .local()
                      .format(`yyyy-MM-DD[T]HH:mm:ss`) || "-"
                  }
                />
                <TextField
                  type="datetime-local"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                  label="Waktu WB-OUT"
                  name="originWeighOutTimestamp"
                  disabled
                  value={
                    moment(values?.originWeighOutTimestamp)
                      .local()
                      .format(`yyyy-MM-DD[T]HH:mm:ss`) || "-"
                  }
                />
              </Grid>
            </Grid>
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">kg</InputAdornment>
                ),
              }}
              label="TOTAL"
              name="weightNetto"
              value={originWeighNetto || 0}
            />

            <Grid container columnSpacing={1}>
              <Grid item xs={5}>
                <TextField
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">kg</InputAdornment>
                    ),
                  }}
                  label="Cancel WB-IN"
                  name="returnWeighInKg"
                  value={values?.returnWeighInKg || 0}
                />
                <TextField
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">kg</InputAdornment>
                    ),
                  }}
                  label="Cancel WB-OUT"
                  name="returnWeighOutKg"
                  value={values?.returnWeighOutKg || 0}
                />
              </Grid>
              <Grid item xs={7}>
                <TextField
                  type="datetime-local"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                  label="Waktu Cancel WB-IN"
                  name="returnWeighInTimestamp"
                  disabled
                  value={
                    moment(values?.returnWeighInTimestamp)
                      .local()
                      .format(`yyyy-MM-DD[T]HH:mm:ss`) || "-"
                  }
                />
                <TextField
                  type="datetime-local"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                  label="Waktu Cancel WB-OUT"
                  name="returnWeighOutTimestamp"
                  disabled
                  value={
                    moment(values?.returnWeighOutTimestamp)
                      .local()
                      .format(`yyyy-MM-DD[T]HH:mm:ss`) || "-"
                  }
                />
              </Grid>
            </Grid>
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">kg</InputAdornment>
                ),
              }}
              label="TOTAL CANCEL"
              name="weightNetto"
              value={returnWeighNetto || 0}
            />

            <TextField
              variant="outlined"
              size="small"
              fullWidth
              sx={{
                mt: 2,
                backgroundColor: isSubmitted ? "whitesmoke" : "white",
              }}
              multiline
              rows={3}
              label="Catatan Cancel"
              name="returnWeighInRemark"
              disabled={isSubmitted}
              value={values?.returnWeighInRemark || ""}
              onChange={(e) => {
                handleInputChange(e);
              }}
            />

            {/* <TextField
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 2, backgroundColor: isSubmitted ? "whitesmoke" : "white", }}
              multiline
              rows={3}
              label="CATATAN CANCEL"
              name="returnWeighOutRemark"
              disabled={isSubmitted}
              value={values?.returnWeighOutRemark || ""}
              onChange={(e) => {
                handleInputChange(e);
              }}
            /> */}

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2, mb: 1, height: 50 }}
              onClick={handleSubmit}
              disabled={!(canSubmit && !isSubmitted && wb?.isStable)}
            >
              Simpan
            </Button>

            <QRCodeViewer
              progressStatus={values.progressStatus}
              deliveryOrderId={values.deliveryOrderId}
              type="form"
              fullWidth
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default TransactionT30WbOutCancel;
