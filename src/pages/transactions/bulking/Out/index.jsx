import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Grid, InputAdornment, TextField, Select } from "@mui/material";
import { MenuItem, InputLabel, FormControl, Paper, Box } from "@mui/material";
import { toast } from "react-toastify";
import moment from "moment";

import Header from "../../../../components/layout/signed/HeaderTransaction";
import QRCodeViewer from "../../../../components/QRCodeViewer";
import CancelConfirmation from "components/CancelConfirmation";

import { useForm } from "../../../../utils/useForm";
import { TransactionAPI } from "../../../../apis";
import * as eDispatchApi from "../../../../apis/eDispatchApi";

import { useAuth, useConfig, useTransaction, useWeighbridge, useApp } from "../../../../hooks";
import { useStorageTank } from "../../../../hooks";

const TransactionBulkingNormalRejectOut = (props) => {
  const navigate = useNavigate();

  const transactionAPI = TransactionAPI();

  const { user } = useAuth();
  const { setSidebar } = useApp();
  const { WBMS, SCC_MODEL, RSPO_SCC_MODEL, ISCC_SCC_MODEL } = useConfig();
  const { wbTransaction, clearWbTransaction } = useTransaction();
  const { wb } = useWeighbridge();

  const { useFindManyStorageTanksQuery } = useStorageTank();

  const BulkingSite = eDispatchApi.getBulkingSite();

  const storageTankFilter = {
    where: {
      OR: [{ siteId: BulkingSite.id }, { siteRefId: BulkingSite.id }],
      refType: 1,
    },
    orderBy: [{ name: "asc" }],
  };

  const { data: dtStorageTanks } = useFindManyStorageTanksQuery(storageTankFilter);

  const { values, setValues, handleInputChange } = useForm({
    ...transactionAPI.InitialData,
  });

  const [originWeightNetto, setOriginWeightNetto] = useState(0);
  const [destinationWeightNetto, setDestinationWeightNetto] = useState(0);

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
      tempTrans.destinationWeighOutTimestamp = moment().toDate();
      tempTrans.destinationWeighOutOperatorName = user.name;
      tempTrans.dtTransaction = moment()
        .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
        .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
        .format();

      const data = { wbTransaction: { ...tempTrans } };

      const response = await transactionAPI.eDispatchBulkingNormalOutAfter(data);

      if (!response.status) throw new Error(response?.message);

      // setWbTransaction(response.data.transaction);
      clearWbTransaction();
      setValues({ ...response.data.transaction });
      setIsSubmitted(true);

      toast.success(`Transaksi WB-OUT telah tersimpan.`);
    } catch (error) {
      return toast.error(`${error.message}.`);
    }
  };

  const handleReject = async (rejectReason) => {
    let tempTrans = { ...values };

    try {
      // let rejectReason = prompt("Alasan Reject", "");

      if (rejectReason.trim().length <= 10)
        return toast.warning("Alasan REJECT (PENGEMBALIAN) harus melebihi 10 karakter.");

      tempTrans.destinationWeighOutTimestamp = moment().toDate();
      tempTrans.destinationWeighOutOperatorName = user.name;
      tempTrans.destinationWeighOutRemark = rejectReason;
      tempTrans.dtTransaction = moment()
        .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
        .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
        .format();

      const data = { wbTransaction: { ...tempTrans } };

      const response = await transactionAPI.eDispatchBulkingRejectOutAfter(data);

      if (!response.status) throw new Error(response?.message);

      // setWbTransaction(response.data.transaction);
      clearWbTransaction();
      setValues({ ...response.data.transaction });
      setIsSubmitted(true);

      toast.success(`Transaksi WB-OUT Reject telah tersimpan.`);
    } catch (error) {
      return toast.error(`${error.message}.`);
    }
  };

  useEffect(() => {
    if (!wbTransaction) return handleClose();

    setSidebar({ selected: "Transaksi WB Bulking" });
    setValues(wbTransaction);

    return () => {
      // console.clear();
    };
  }, []);

  useEffect(() => {
    if (!isSubmitted) {
      setValues((prev) => ({
        ...prev,
        destinationWeighOutKg: wb.weight,
      }));
    }
  }, [wb.weight]);

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

  // Untuk validasi field
  useEffect(() => {
    let cSubmit = false;

    if (
      values.destinationWeighOutKg >= WBMS.WB_MIN_WEIGHT &&
      values?.destinationSinkStorageTankId?.trim().length > 0 &&
      values?.unloadedSeal1?.trim().length > 0 &&
      values?.unloadedSeal2?.trim().length > 0
    ) {
      cSubmit = true;
    }

    setCanSubmit(cSubmit);
  }, [WBMS.WB_MIN_WEIGHT, values]);

  let cbRspoScc;
  cbRspoScc = (
    <FormControl fullWidth size="small" sx={{ mt: 2 }} required>
      <InputLabel id="rspoScc">RSPO SCC Model</InputLabel>
      <Select labelId="rspoScc" label="RSPO SCC Model" name="rspoSccModel" disabled value={values?.rspoSccModel || 0}>
        {dtRspoScc &&
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
    <FormControl fullWidth size="small" sx={{ mt: 2 }} required>
      <InputLabel id="isccScc">ISCC SCC Model</InputLabel>
      <Select labelId="isccScc" label="ISCC SCC Model" name="isccSccModel" disabled value={values?.isccSccModel || 0}>
        {dtIsccScc &&
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
      <InputLabel id="originSourceStorageTankId">Tangki Tujuan</InputLabel>
      <Select
        labelId="destinationSinkStorageTankId"
        label="Tangki Tujuan"
        name="destinationSinkStorageTankId"
        disabled={isSubmitted}
        value={values?.destinationSinkStorageTankId || ""}
        onChange={(e) => {
          handleInputChange(e);

          let selected = dtStorageTanks?.records?.find((item) => item.id === e.target.value);

          if (selected) {
            setValues((prev) => {
              prev.destinationSinkStorageTankCode = selected.code;
              prev.destinationSinkStorageTankName = selected.name;
              return { ...prev };
            });
          }
        }}
      >
        {dtStorageTanks?.records &&
          dtStorageTanks?.records.map((item, index) => (
            <MenuItem key={index} value={item.id}>
              {`${item.name} - ${item.productName} (${item.siteName})`}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );

  return (
    <Box>
      <Header title="TRANSAKSI BULKING" subtitle="WB-OUT" />

      <Box sx={{ display: "flex", mt: 3, justifyContent: "end" }}>
        {/* <Box flex={1}></Box> */}
        <Button variant="contained" onClick={handleSubmit} disabled={!(canSubmit && !isSubmitted && wb?.isStable)}>
          Simpan
        </Button>

        {/* <QRCodeViewer
          progressStatus={values.progressStatus}
          deliveryOrderId={values.deliveryOrderId}
          type="form"
          fullWidth
        /> */}
        <CancelConfirmation
          title="Alasan REJECT (PENGEMBALIAN)"
          caption="SIMPAN REJECT (PENGEMBALIAN)"
          content="Anda yakin melakukan REJECT (PENGEMBALIAN) transaksi WB ini? Berikan keterangan yang cukup."
          onClose={handleReject}
          isDisabled={!(canSubmit && !isSubmitted && wb?.isStable)}
          sx={{ ml: 1, mr: 1, backgroundColor: "darkred" }}
        />
        <QRCodeViewer progressStatus={values.progressStatus} deliveryOrderId={values.deliveryOrderId} type="form">
          TAMPILKAN QR
        </QRCodeViewer>
        <Button variant="contained" sx={{ ml: 1 }} disabled={!isSubmitted} onClick={handleClose}>
          TUTUP
        </Button>
      </Box>

      <Paper sx={{ mt: 1, p: 2, minHeight: "71.5vh" }}>
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
              value={`${values?.transporterCompanyName} - ${values?.transporterCompanyCode}` || ""}
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
              value={SCC_MODEL[values?.transportVehicleSccModel || 0].value}
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
                    backgroundColor: isSubmitted ? "whitesmoke" : "white",
                  }}
                  required
                  label="Segel Mainhole 1"
                  name="unloadedSeal1"
                  disabled={isSubmitted}
                  value={values?.unloadedSeal1 || ""}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                />
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{
                    mt: 2,
                    backgroundColor: isSubmitted ? "whitesmoke" : "white",
                  }}
                  required
                  label="Segel Valve 1"
                  name="unloadedSeal2"
                  disabled={isSubmitted}
                  value={values?.unloadedSeal2 || ""}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
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
                    backgroundColor: isSubmitted ? "whitesmoke" : "white",
                  }}
                  label="Segel Mainhole 2"
                  name="unloadedSeal3"
                  disabled={isSubmitted}
                  value={values?.unloadedSeal3 || ""}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                />
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{
                    mt: 2,
                    backgroundColor: isSubmitted ? "whitesmoke" : "white",
                  }}
                  label="Segel Valve 2"
                  name="unloadedSeal4"
                  disabled={isSubmitted}
                  value={values?.unloadedSeal4 || ""}
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
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
                    endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                  }}
                  label="Berat Asal WB-IN"
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
                    endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                  }}
                  label="Berat Asal WB-OUT"
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
                  label="Waktu Asal WB-IN"
                  name="originWeighInTimestamp"
                  disabled
                  value={moment(values?.originWeighInTimestamp).local().format(`yyyy-MM-DD[T]HH:mm:ss`) || "-"}
                />
                <TextField
                  type="datetime-local"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                  label="Waktu Asal WB-OUT"
                  name="originWeighOutTimestamp"
                  disabled
                  value={moment(values?.originWeighOutTimestamp).local().format(`yyyy-MM-DD[T]HH:mm:ss`) || "-"}
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
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              label="TOTAL Berat Asal"
              name="weightNetto"
              value={originWeightNetto.toFixed(2) || 0}
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
                    endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                  }}
                  label="Berat Timbang Masuk"
                  name="destinationWeighInKg"
                  value={values?.destinationWeighInKg || 0}
                />
                <TextField
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                  }}
                  label="Berat Timbang Keluar"
                  name="destinationWeighOutKg"
                  value={values?.destinationWeighOutKg || 0}
                />
              </Grid>
              <Grid item xs={7}>
                <TextField
                  type="datetime-local"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                  label="Waktu Timbang Masuk"
                  name="destinationWeighInTimestamp"
                  disabled
                  value={moment(values?.destinationWeighInTimestamp).local().format(`yyyy-MM-DD[T]HH:mm:ss`) || "-"}
                />
                <TextField
                  type="datetime-local"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                  label="Waktu Timbang Keluar"
                  name="destinationWeighOutTimestamp"
                  disabled
                  value={values?.destinationWeighOutTimestamp || "-"}
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
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              label="TOTAL"
              name="destinationWeightNetto"
              value={destinationWeightNetto.toFixed(2) || 0}
            />

            {/* <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3, backgroundColor: "goldenrod" }}
              onClick={handleReject}
              disabled={!(canSubmit && !isSubmitted && wb?.isStable)}
            >
              Reject (Ditolak)
            </Button> */}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default TransactionBulkingNormalRejectOut;
