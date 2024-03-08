import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

import Header from "components/layout/signed/HeaderTransaction";
import ProgressStatus from "components/ProgressStatus";
import QRCodeViewer from "components/QRCodeViewer";
import CancelConfirmation from "components/CancelConfirmation";

import {
  TransportVehicleAC,
  DriverAC,
  CompanyAC,
  SiteSelect,
  CertificateSelect,
  StorageTankSelect,
} from "components/FormikMUI";

import { TransactionAPI } from "apis";
import * as eDispatchApi from "apis/eDispatchApi";

import { useAuth, useConfig, useTransaction, useApp } from "hooks";
import { useStorageTank } from "hooks";

const TransactionBulkingNormalViewOut = (props) => {
  const navigate = useNavigate();

  const { id } = useParams();

  const transactionAPI = TransactionAPI();

  const { WBMS } = useConfig();
  const { urlPrev, setUrlPrev } = useApp();
  const { openedTransaction, setOpenedTransaction, clearOpenedTransaction } =
    useTransaction();

  const { useFindManyStorageTanksQuery } = useStorageTank();

  const T30Site = eDispatchApi.getT30Site();
  const storageTankFilter = {
    where: {
      OR: [{ siteId: WBMS.SITE.refId }, { siteRefId: WBMS.SITE.refId }],
      refType: 1,
    },
  };
  const { data: dtStorageTank } =
    useFindManyStorageTanksQuery(storageTankFilter);

  const [isReadOnly, setIsReadOnly] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [originWeighNetto, setOriginWeightNetto] = useState(0);
  const [destinationWeighNetto, setDestinationWeightNetto] = useState(0);

  const [isDelete, setIsDelete] = useState(false);

  const validationSchema = yup.object().shape({
    // originWeighInKg: yup.number().required("Wajib diisi.").min(WBMS.WB_MIN_WEIGHT),
    destinationSinkStorageTankId: yup.string().required("Wajib diisi."),
    loadedSeal1: yup
      .string()
      .required("Wajib diisi.")
      .max(30, "maksimal 30 karakter"),
    loadedSeal2: yup
      .string()
      .required("Wajib diisi.")
      .max(30, "maksimal 30 karakter"),
    loadedSeal3: yup.string().max(30, "maksimal 30 karakter"),
    loadedSeal4: yup.string().max(30, "maksimal 30 karakter"),
  });

  // const handleManualWBOUT = () => {
  //   clearOpenedTransaction();
  //   navigate(`/wb/transactions/bulking/manual-entry-dispatch-out/${id}`);
  // };

  const handleClose = () => {
    clearOpenedTransaction();

    const url = urlPrev;
    setUrlPrev("");

    url ? navigate(url) : navigate("/wb/transactions");
  };

  const handleFormikSubmit = async (values) => {
    let tempTrans = { ...values };

    setIsLoading(true);

    try {
      const selected = dtStorageTank.records.find(
        (item) => item.id === values.destinationSinkStorageTankId
      );

      if (selected) {
        tempTrans.destinationSinkStorageTankCode = selected.code || "";
        tempTrans.destinationSinkStorageTankName = selected.name || "";
      }

      if (isDelete) {
        tempTrans.progressStatus = 100;
        tempTrans.isDeleted = true;
      }

      const response = await transactionAPI.updateById(tempTrans.id, {
        ...tempTrans,
      });

      if (!response.status) throw new Error(response?.message);

      clearOpenedTransaction();
      setIsLoading(false);

      toast.success(`Update Transaksi WB-IN telah tersimpan.`);

      return handleClose();
    } catch (error) {
      setIsLoading(false);
      toast.error(`${error.message}.`);

      return;
    }
  };

  useEffect(() => {
    if (!id) return handleClose();

    transactionAPI
      .getById(id)
      .then((res) => {
        setOpenedTransaction(res.data.transaction);
      })
      .catch((error) => {
        toast.error(`${error.message}.`);

        return handleClose();
      });

    return () => {
      // console.clear();
    };
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
    <Box>
      <Header title="TRANSAKSI BULKING" subtitle="DATA TIMBANG" />
      {openedTransaction && (
        <Formik
          // enableReinitialize
          onSubmit={handleFormikSubmit}
          initialValues={openedTransaction}
          validationSchema={validationSchema}
        >
          {(props) => {
            const {
              values,
              dirty,
              isValid,
              submitForm,
              resetForm,
              setFieldValue,
            } = props;
            // console.log("Formik props:", props)

            const handleSubmit = async () => {
              if (isReadOnly) setIsReadOnly(false);
              else {
                const results = await submitForm();

                console.log("Submit results:", results);
              }
            };

            const handleDelete = (deleteReason) => {
              if (deleteReason.trim().length <= 10)
                return toast.error(
                  "Alasan HAPUS TRANSAKSI harus melebihi 10 karakter"
                );

              setFieldValue("originWeighInRemark", deleteReason);
              setIsDelete(true);

              submitForm();
            };

            const handleReset = async () => {
              if (isReadOnly) handleClose();
              else {
                resetForm();
                setIsReadOnly(true);
              }
            };

            return (
              <Form>
                <Box sx={{ display: "flex", mt: 3, justifyContent: "end" }}>
                  {/* <Button
                    variant="contained"
                    sx={{ backgroundColor: "forestgreen", marginRight: "auto" }}
                    onClick={() => handleManualWBOUT(values)}
                  >
                    Manual (Timbang Keluar)
                  </Button> */}
                  {/* <Button
                    variant="contained"
                    disabled={isReadOnly ? false : !(isValid && dirty)}
                    onClick={handleSubmit}
                    sx={{ mr: 1 }}
                  >
                    {isReadOnly ? "EDIT" : "SIMPAN"}
                  </Button> */}
                  {/* <CancelConfirmation
                    title="Alasan HAPUS TRANSAKSI"
                    caption="HAPUS TRANSAKSI"
                    content="Anda yakin melakukan HAPUS transaksi WB ini? Berikan keterangan yang cukup."
                    onClose={handleDelete}
                    disabled={!isReadOnly}
                    sx={{ ml: 1, mr: 1, backgroundColor: "darkred" }}
                  /> */}
                  <QRCodeViewer
                    progressStatus={values.progressStatus}
                    deliveryOrderId={values.deliveryOrderId}
                    type="form"
                    disabled={!isReadOnly}
                  >
                    TAMPILKAN QR
                  </QRCodeViewer>
                  <Button
                    variant="contained"
                    sx={{ ml: 1 }}
                    onClick={handleReset}
                  >
                    {isReadOnly ? "TUTUP" : "BATAL EDIT"}
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
                            sx={{
                              mt: 2,
                              backgroundColor: isReadOnly
                                ? "whitesmoke"
                                : "lightyellow",
                            }}
                            inputProps={{ readOnly: isReadOnly }}
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
                            sx={{
                              mt: 2,
                              backgroundColor: isReadOnly
                                ? "whitesmoke"
                                : "lightyellow",
                            }}
                            inputProps={{ readOnly: isReadOnly }}
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
                            sx={{
                              mt: 2,
                              backgroundColor: isReadOnly
                                ? "whitesmoke"
                                : "lightyellow",
                            }}
                            inputProps={{ readOnly: isReadOnly }}
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
                            sx={{
                              mt: 2,
                              backgroundColor: isReadOnly
                                ? "whitesmoke"
                                : "lightyellow",
                            }}
                            inputProps={{ readOnly: isReadOnly }}
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
                            isReadOnly={isReadOnly}
                            sx={{ mt: 2 }}
                            backgroundColor={
                              isReadOnly ? "whitesmoke" : "lightyellow"
                            }
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
                            name="originWeighOutKg"
                            label="BERAT ASAL KELUAR - OUT"
                            value={
                              values?.originWeighOutKg > 0
                                ? values.originWeighOutKg.toFixed(2)
                                : "0.00"
                            }
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
                            name="destinationWeighInOperatorName"
                            value={
                              values?.destinationWeighInOperatorName || "-"
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
                            label="Operator WB-OUT"
                            value={
                              values?.destinationWeighOutOperatorName || "-"
                            }
                            name="destinationWeighOutOperatorName"
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
                            inputProps={{ readOnly: true }}
                            value={
                              values?.destinationWeighInTimestamp
                                ? moment(values.destinationWeighInTimestamp)
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
                            label="Waktu WB-Out"
                            name="destinationWeighOutTimestamp"
                            inputProps={{ readOnly: true }}
                            value={
                              values?.destinationWeighOutTimestamp
                                ? moment(values.destinationWeighOutTimestamp)
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
                            label="BERAT MASUK - IN"
                            name="destinationWeighInKg"
                            value={
                              values?.destinationWeighInKg > 0
                                ? values.destinationWeighInKg.toFixed(2)
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
                              values?.destinationWeighOutKg > 0
                                ? values.destinationWeighOutKg.toFixed(2)
                                : "0.00"
                            }
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
      {!openedTransaction && (
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

export default TransactionBulkingNormalViewOut;
