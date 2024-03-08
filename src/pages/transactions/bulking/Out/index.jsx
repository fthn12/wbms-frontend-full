import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Paper, Box, Grid, CircularProgress, Divider } from "@mui/material";
import {
  Button,
  TextField as TextFieldMUI,
  InputAdornment,
} from "@mui/material";

import { Formik, Form, Field } from "formik";
import { TextField } from "formik-mui";
import * as yup from "yup";

import moment from "moment";
import numeral from "numeral";

import Header from "../../../../components/layout/signed/HeaderTransaction";
import ProgressStatus from "../../../../components/ProgressStatus";

import {
  TransportVehicleAC,
  DriverAC,
  CompanyAC,
  SiteSelect,
  CertificateSelect,
  StorageTankSelect,
} from "../../../../components/FormikMUI";
import CancelConfirmation from "components/CancelConfirmation";
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

const TransactionBulkingNormalRejectOut = (props) => {
  const navigate = useNavigate();

  const transactionAPI = TransactionAPI();

  const { user } = useAuth();
  const { WBMS } = useConfig();
  const { urlPrev, setUrlPrev, setSidebar } = useApp();
  const { wbTransaction, setWbTransaction, clearWbTransaction } =
    useTransaction();
  const { wb } = useWeighbridge();

  const { useFindManyStorageTanksQuery } = useStorageTank();

  const storageTankFilter = {
    where: {
      OR: [{ siteId: WBMS.SITE.refId }, { siteRefId: WBMS.SITE.refId }],
      refType: 1,
    },
  };
  const { data: dtStorageTank } =
    useFindManyStorageTanksQuery(storageTankFilter);

  const [originWeighNetto, setOriginWeightNetto] = useState(0);
  const [destinationWeighNetto, setDestinationWeightNetto] = useState(0);
  const [dtTrx, setDtTrx] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isReject, setIsReject] = useState(false);

  const validationSchema = yup.object().shape({
    // tidak bisa dari sini, karena ada pengaruh dari external form
    // originWeighInKg: yup.number().required("Wajib diisi.").min(WBMS.WB_MIN_WEIGHT),

    destinationSinkStorageTankId: yup.string().required("Wajib diisi."),
    unloadedSeal1: yup
      .string()
      .required("Wajib diisi.")
      .max(30, "maksimal 30 karakter"),
    unloadedSeal2: yup
      .string()
      .required("Wajib diisi.")
      .max(30, "maksimal 30 karakter"),
  });

  const handleClose = () => {
    clearWbTransaction();

    const url = urlPrev;
    setUrlPrev("");

    url ? navigate(url) : navigate("/wb/transactions");
  };

  const handleFormikSubmit = async (values) => {
    let wbTransaction = { ...values };

    setIsLoading(true);

    try {
      const selected = dtStorageTank.records.find(
        (item) => item.id === values.destinationSinkStorageTankId
      );

      if (selected) {
        wbTransaction.destinationSinkStorageTankCode = selected.code || "";
        wbTransaction.destinationSinkStorageTankName = selected.name || "";
      }

      if (isReject) {
        wbTransaction.destinationWeighOutKg = wb.weight;
        wbTransaction.destinationWeighOutOperatorName = user.name.toUpperCase();
        wbTransaction.destinationWeighOutTimestamp = moment().toDate();
        wbTransaction.dtTransaction = moment()
          .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
          .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
          .format();

        const data = { wbTransaction };

        const response = await transactionAPI.eDispatchBulkingRejectOutAfter(
          data
        );

        if (!response.status) throw new Error(response?.message);

        clearWbTransaction();
        setIsLoading(false);

        toast.success(`Transaksi WB-OUT Reject telah tersimpan.`);

        // redirect ke form view
        const id = response?.data?.transaction?.id;
        navigate(`/wb/transactions/bulking-edispatch-out/${id}`);
      } else {
        
        wbTransaction.destinationWeighOutKg = wb.weight;
        wbTransaction.destinationWeighOutOperatorName = user.name.toUpperCase();
        wbTransaction.destinationWeighOutTimestamp = moment().toDate();
        wbTransaction.dtTransaction = moment()
          .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
          .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
          .format();

        const data = { wbTransaction };

        const response = await transactionAPI.eDispatchBulkingNormalOutAfter(
          data
        );

        if (!response.status) throw new Error(response?.message);

        clearWbTransaction();
        setIsLoading(false);

        toast.success(`Transaksi WB-OUT telah tersimpan.`);

        // redirect ke form view
        const id = response?.data?.transaction?.id;
        navigate(`/wb/transactions/bulking-edispatch-out/${id}`);
        return;
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(`${error.message}.`);

      return;
    }
  };

  useEffect(() => {
    setDtTrx(moment().format(`DD/MM/YYYY - HH:mm:ss`));
    setSidebar({ selected: "Transaksi WB Bulking" });

    return () => {
      // console.clear();
    };
  }, []);

  useEffect(() => {
    setWbTransaction({ destinationWeighOutKg: wb.weight });
  }, [wb.weight]);

  useEffect(() => {
    if (!wbTransaction) {
      return;
    }

    if (
      wbTransaction.originWeighInKg < WBMS.WB_MIN_WEIGHT ||
      wbTransaction.originWeighOutKg < WBMS.WB_MIN_WEIGHT
    ) {
      setOriginWeightNetto(0);
    } else {
      let total = Math.abs(
        wbTransaction.originWeighInKg - wbTransaction.originWeighOutKg
      );
      setOriginWeightNetto(total);
    }

    if (
      wbTransaction.destinationWeighInKg < WBMS.WB_MIN_WEIGHT ||
      wbTransaction.destinationWeighOutKg < WBMS.WB_MIN_WEIGHT
    ) {
      setDestinationWeightNetto(0);
    } else {
      let total = Math.abs(
        wbTransaction.destinationWeighInKg - wbTransaction.destinationWeighOutKg
      );
      setDestinationWeightNetto(total);
    }
  }, [wbTransaction]);

  return (
    <Box>
      <Header title="TRANSAKSI BULKING" subtitle="TIMBANG WB-OUT" />
      {wbTransaction && (
        <Formik
          // enableReinitialize
          onSubmit={handleFormikSubmit}
          initialValues={wbTransaction}
          validationSchema={validationSchema}
          isInitialError={true}
        >
          {(props) => {
            const { values, isValid, submitForm, setFieldValue } = props;
            // console.log("Formik props:", props);
            const handleSubmit = () => {
              submitForm();
            };

            const handleReject = (rejectReason) => {
              if (rejectReason.trim().length <= 10)
                return toast.error(
                  "Alasan REJECT (PENGEMBALIAN) harus melebihi 10 karakter."
                );

              setFieldValue("destinationWeighOutRemark", rejectReason);
              setIsReject(true);

              submitForm();
            };

            return (
              <Form>
                <Box sx={{ display: "flex", mt: 3, justifyContent: "end" }}>
                  <Button
                    variant="contained"
                    onClick={() => handleSubmit()}
                    disabled={
                      !(
                        isValid &&
                        wb?.isStable &&
                        wb?.weight > WBMS.WB_MIN_WEIGHT
                      )
                    }
                  >
                    SIMPAN (WB-OUT)
                  </Button>
                  <CancelConfirmation
                    title="Alasan REJECT (PENGEMBALIAN)"
                    caption="SIMPAN REJECT (PENGEMBALIAN)"
                    content="Anda yakin melakukan REJECT (PENGEMBALIAN) transaksi WB ini? Berikan keterangan yang cukup."
                    onClose={handleReject}
                    isDisabled={
                      !(
                        isValid &&
                        wb?.isStable &&
                        wb?.weight > WBMS.WB_MIN_WEIGHT
                      )
                    }
                    sx={{ ml: 1, backgroundColor: "darkred" }}
                  />
                  <Button
                    variant="contained"
                    sx={{ ml: 1 }}
                    onClick={handleClose}
                  >
                    TUTUP
                  </Button>
                </Box>

                <Paper sx={{ mt: 1, p: 2, minHeight: "71.5vh" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} lg={3}>
                      <Grid container columnSpacing={1}>
                        <Grid item xs={12} sx={{ mb: 1 }}>
                          <Divider>DATA KENDARAAN</Divider>
                        </Grid>

                        <Grid item xs={6}>
                          <Field
                            name="bonTripNo"
                            label="NO BONTRIP"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 1, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <ProgressStatus
                            progressStatus={values?.progressStatus}
                            sx={{ mt: 1, backgroundColor: "whitesmoke" }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <TransportVehicleAC
                            name="transportVehiclePlateNo"
                            label="Nomor Plat Kendaraan"
                            isReadOnly={true}
                            sx={{ mt: 2 }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <DriverAC
                            name="driverName"
                            label="Nama Supir"
                            isReadOnly={true}
                            sx={{ mt: 2 }}
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <Field
                            name="transportVehicleProduct"
                            label="Produk Kendaraan"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                            value={`${values?.transportVehicleProductCode} - ${values?.transportVehicleProductName}`}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <CertificateSelect
                            name="transportVehicleSccModel"
                            label="Sertifikasi Kendaraan"
                            isRequired={false}
                            isReadOnly={true}
                            sx={{ mt: 2 }}
                            backgroundColor="whitesmoke"
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <CompanyAC
                            name="transporterCompanyName"
                            label="Nama Vendor"
                            isReadOnly={true}
                            sx={{ mt: 2 }}
                          />
                        </Grid>

                        {/* <Grid item xs={6}>
                          <SiteSelect
                            name="originSiteId"
                            label="Site Asal"
                            isRequired={true}
                            isReadOnly={true}
                            sx={{ mt: 2 }}
                            backgroundColor="whitesmoke"
                          />
                        </Grid> */}
                        {/* <Grid item xs={6}>
                          <SiteSelect
                            name="destinationSiteId"
                            label="Site Tujuan"
                            isRequired={true}
                            isReadOnly={true}
                            sx={{ mt: 2 }}
                            backgroundColor="whitesmoke"
                          />
                        </Grid> */}
                      </Grid>
                    </Grid>

                    <Grid item xs={12} sm={6} lg={3}>
                      <Grid container columnSpacing={1}>
                        <Grid item xs={12} sx={{ mb: 1 }}>
                          <Divider>Segel Tangki Asal</Divider>
                        </Grid>

                        <Grid item xs={6}>
                          <Field
                            name="loadedSeal1"
                            label="Segel Mainhole 1 Asal"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 1, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                            value={
                              values?.loadedSeal1 ? values.loadedSeal1 : "-"
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Field
                            name="loadedSeal2"
                            label="Segel Valve 1 Asal"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 1, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                            value={
                              values?.loadedSeal2 ? values.loadedSeal2 : "-"
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Field
                            name="loadedSeal3"
                            label="Segel Mainhole 2 Asal"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                            value={
                              values?.loadedSeal3 ? values.loadedSeal3 : "-"
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Field
                            name="loadedSeal4"
                            label="Segel Valve 2 Asal"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                            value={
                              values?.loadedSeal4 ? values.loadedSeal4 : "-"
                            }
                          />
                        </Grid>

                        {/* <Grid item xs={12} sx={{ mt: 2 }}>
                          <Divider>Segel Tangki Kosong</Divider>
                        </Grid> */}

                        {/* <Grid item xs={6}>
                          <Field
                            name="unloadedSeal1"
                            label="Segel KOSONG Mainhole 1"
                            type="text"
                            required={true}
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 1, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                          />
                        </Grid> */}
                        {/* <Grid item xs={6}>
                          <Field
                            name="unloadedSeal2"
                            label="Segel KOSONG Valve 1"
                            type="text"
                            required={true}
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 1, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                          />
                        </Grid> */}
                        {/* <Grid item xs={6}>
                          <Field
                            name="unloadedSeal3"
                            label="Segel KOSONG Mainhole 2"
                            type="text"
                            required={false}
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                          />
                        </Grid> */}
                        {/* <Grid item xs={6}>
                          <Field
                            name="unloadedSeal4"
                            label="Segel KOSONG Valve 2"
                            type="text"
                            required={false}
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                          />
                        </Grid> */}

                        <Grid item xs={12} sx={{ mt: 2 }}>
                          <Divider>Segel Tangki Bongkar</Divider>
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
                        {/* <Grid item xs={12}>
                          <StorageTankSelect
                            name="destinationSinkStorageTankId"
                            label="Tangki Asal"
                            isRequired={true}
                            isReadOnly={isReadOnly}
                            sx={{ mt: 1 }}
                            backgroundColor={
                              isReadOnly ? "whitesmoke" : "lightyellow"
                            }
                            siteId={WBMS.SITE.refId}
                          />
                        </Grid> */}
                        {/* <Grid item xs={12}>
                          <StorageTankSelect
                            name="destinationSinkStorageTankId"
                            label="Tangki Tujuan"
                            isRequired={true}
                            isReadOnly={false}
                            sx={{ mt: 1 }}
                            backgroundColor="white"
                            siteId={WBMS.SITE.refId}
                          />
                        </Grid> */}
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
                                <InputAdornment position="end">
                                  kg
                                </InputAdornment>
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
                            sx={{ mt: 2, mb: 2, backgroundColor: "whitesmoke" }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  kg
                                </InputAdornment>
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
                            sx={{ mt: 2, mb: 2, backgroundColor: "whitesmoke" }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  kg
                                </InputAdornment>
                              ),
                            }}
                            label="TOTAL ASAL"
                            name="weightNetto"
                            value={
                              originWeighNetto > 0
                                ? originWeighNetto.toFixed(2)
                                : "0.00"
                            }
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
                            value={
                              values?.destinationWeighInOperatorName || "-"
                            }
                            name="destinationWeighInOperatorName"
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
                            name="destinationWeighOutOperatorName"
                            value={user.name}
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
                            label="Waktu WB-IN"
                            name="destinationWeighInTimestamp"
                            value={
                              values?.destinationWeighInTimestamp
                                ? moment(values.destinationWeighInTimestamp)
                                    .local()
                                    .format(`DD/MM/YYYY - HH:mm:ss`)
                                : "-"
                            }
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
                            label="Waktu WB-Out"
                            name="destinationWeighOutTimestamp"
                            inputProps={{ readOnly: true }}
                            value={dtTrx || "-"}
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
                              endAdornment: (
                                <InputAdornment position="end">
                                  kg
                                </InputAdornment>
                              ),
                            }}
                            value={
                              values?.destinationWeighInKg > 0
                                ? values.destinationWeighInKg.toFixed(2)
                                : "0.00"
                            }
                            label="BERAT MASUK - IN"
                            name="destinationWeighInKg"
                            inputProps={{ readOnly: true }}
                          />
                        </Grid>
                        {WBMS.WB_STATUS === true && (
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
                                  <InputAdornment position="end">
                                    kg
                                  </InputAdornment>
                                ),
                              }}
                              label="BERAT MASUK - OUT"
                              name="destinationWeighOutKg"
                              value={
                                wb?.weight > 0 ? wb.weight.toFixed(2) : "0.00"
                              }
                              inputProps={{ readOnly: true }}
                            />
                          </Grid>
                        )}
                        {WBMS.WB_STATUS === false && (
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
                                endAdornment: (
                                  <InputAdornment position="end">
                                    kg
                                  </InputAdornment>
                                ),
                              }}
                              label="BERAT MASUK - OUT"
                              name="destinationWeighOutKg"
                              value={
                                values?.destinationWeighOutKg > 0
                                  ? values.destinationWeighOutKg
                                  : "0"
                              }
                            />
                          </Grid>
                        )}
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
                              endAdornment: (
                                <InputAdornment position="end">
                                  kg
                                </InputAdornment>
                              ),
                            }}
                            label="TOTAL"
                            name="weightNetto"
                            value={
                              destinationWeighNetto > 0
                                ? destinationWeighNetto.toFixed(2)
                                : "0.00"
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>

                {isLoading && (
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
              </Form>
            );
          }}
        </Formik>
      )}
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
    </Box>
  );
};

export default TransactionBulkingNormalRejectOut;
