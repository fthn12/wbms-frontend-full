import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Paper, Box, Grid, CircularProgress, Divider } from "@mui/material";
import { Button, TextField as TextFieldMUI, InputAdornment } from "@mui/material";

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

const TransactionT30NormalIn = (props) => {
  const navigate = useNavigate();

  const { id } = useParams();

  const transactionAPI = TransactionAPI();

  const { user } = useAuth();
  const { WBMS } = useConfig();
  const { urlPrev, setUrlPrev } = useApp();
  const { openedTransaction, setOpenedTransaction, clearOpenedTransaction } = useTransaction();

  const { useFindManyStorageTanksQuery } = useStorageTank();

  const T30Site = eDispatchApi.getT30Site();
  const storageTankFilter = {
    where: {
      OR: [{ siteId: T30Site.id }, { siteRefId: T30Site.id }],
      refType: 1,
    },
  };
  const { data: dtStorageTank } = useFindManyStorageTanksQuery(storageTankFilter);

  const [originWeighNetto, setOriginWeighNetto] = useState(0);

  const [isReadOnly, setIsReadOnly] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [isDelete, setIsDelete] = useState(false);

  const validationSchema = yup.object().shape({
    // originWeighInKg: yup.number().required("Wajib diisi.").min(WBMS.WB_MIN_WEIGHT),
    originSourceStorageTankId: yup.string().required("Wajib diisi."),
    loadedSeal1: yup.string().required("Wajib diisi.").max(30, "maksimal 30 karakter"),
    loadedSeal2: yup.string().required("Wajib diisi.").max(30, "maksimal 30 karakter"),
    loadedSeal3: yup.string().max(30, "maksimal 30 karakter"),
    loadedSeal4: yup.string().max(30, "maksimal 30 karakter"),
  });

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
      const selected = dtStorageTank.records.find((item) => item.id === values.originSourceStorageTankId);

      if (selected) {
        tempTrans.originSourceStorageTankCode = selected.code || "";
        tempTrans.originSourceStorageTankName = selected.name || "";
      }

      if (isDelete) {
        tempTrans.progressStatus = 100;
        tempTrans.isDeleted = true;
      }

      const response = await transactionAPI.updateById(tempTrans.id, { ...tempTrans });

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
    if (
      openedTransaction?.originWeighInKg < WBMS.WB_MIN_WEIGHT ||
      openedTransaction?.originWeighOutKg < WBMS.WB_MIN_WEIGHT
    ) {
      setOriginWeighNetto(0);
    } else {
      let total = Math.abs(openedTransaction?.originWeighInKg - openedTransaction?.originWeighOutKg);
      setOriginWeighNetto(total);
    }
  }, [openedTransaction]);

  return (
    <Box>
      <Header title="TRANSAKSI T30" subtitle="DATA TIMBANG WB-IN" />
      {openedTransaction && (
        <Formik
          // enableReinitialize
          onSubmit={handleFormikSubmit}
          initialValues={openedTransaction}
          validationSchema={validationSchema}
        >
          {(props) => {
            const { values, dirty, isValid, submitForm, resetForm, setFieldValue } = props;
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
                return toast.error("Alasan HAPUS TRANSAKSI harus melebihi 10 karakter");

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
                  <Button
                    variant="contained"
                    disabled={isReadOnly ? false : !(isValid && dirty)}
                    onClick={handleSubmit}
                    sx={{  mr: 1 }}
                  >
                    {isReadOnly ? "EDIT" : "SIMPAN"}
                  </Button>
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
                  <Button variant="contained" sx={{ ml: 1 }} onClick={handleReset}>
                    {isReadOnly ? "TUTUP" : "BATAL EDIT"}
                  </Button>
                </Box>

                <Paper sx={{ mt: 1, p: 2, minHeight: "71.5vh" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} lg={3}>
                      <Grid container columnSpacing={1}>
                        <Grid item xs={12}>
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

                        <Grid item xs={6}>
                          <TransportVehicleAC
                            name="transportVehiclePlateNo"
                            label="Nomor Plat Kendaraan"
                            isReadOnly={true}
                            sx={{ mt: 2 }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <DriverAC name="driverName" label="Nama Supir" isReadOnly={true} sx={{ mt: 2 }} />
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
                        </Grid>
                        <Grid item xs={6}>
                          <SiteSelect
                            name="destinationSiteId"
                            label="Site Tujuan"
                            isRequired={true}
                            isReadOnly={true}
                            sx={{ mt: 2 }}
                            backgroundColor="whitesmoke"
                          />
                        </Grid> */}

                        <Grid item xs={12} sx={{ mt: 2 }}>
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
                            sx={{ mt: 1, backgroundColor: "whitesmoke" }}
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
                            sx={{ mt: 1, backgroundColor: "whitesmoke" }}
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

                        {/* <Grid item xs={12} sx={{ mt: 2 }}>
                          <Divider>Segel Tangki Kosong</Divider>
                        </Grid>

                        <Grid item xs={6}>
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
                        </Grid>
                        <Grid item xs={6}>
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
                        </Grid>
                        <Grid item xs={6}>
                          <Field
                            name="unloadedSeal3"
                            label="Segel KOSONG Mainhole 2"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Field
                            name="unloadedSeal4"
                            label="Segel KOSONG Valve 2"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                          />
                        </Grid> */}

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
                            sx={{ mt: 1, backgroundColor: isReadOnly ? "whitesmoke" : "lightyellow" }}
                            inputProps={{ readOnly: isReadOnly }}
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
                            sx={{ mt: 1, backgroundColor: isReadOnly ? "whitesmoke" : "lightyellow" }}
                            inputProps={{ readOnly: isReadOnly }}
                          />
                        </Grid>
                        {}
                        <Grid item xs={6}>
                          <Field
                            name="loadedSeal3"
                            label="Segel ISI Mainhole 2"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 2, backgroundColor: isReadOnly ? "whitesmoke" : "lightyellow" }}
                            inputProps={{ readOnly: isReadOnly }}
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
                            sx={{ mt: 2, backgroundColor: isReadOnly ? "whitesmoke" : "lightyellow" }}
                            inputProps={{ readOnly: isReadOnly }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} sm={6} lg={3}>
                      <Grid container columnSpacing={1}>
                        <Grid item xs={12}>
                          <Divider>DATA PRODUK</Divider>
                        </Grid>

                        <Grid item xs={12}>
                          <Field
                            name="product"
                            label="Produk"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 1, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                            value={`${values?.productCode} - ${values?.productName}`}
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <CertificateSelect
                            name="rspoSccModel"
                            label="Sertifikasi RSPO"
                            isRequired={false}
                            isReadOnly={true}
                            sx={{ mt: 2 }}
                            backgroundColor="whitesmoke"
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
                            isReadOnly={true}
                            sx={{ mt: 2 }}
                            backgroundColor="whitesmoke"
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
                            isReadOnly={true}
                            sx={{ mt: 2 }}
                            backgroundColor="whitesmoke"
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
                            isReadOnly={isReadOnly}
                            sx={{ mt: 1 }}
                            backgroundColor={isReadOnly ? "whitesmoke" : "lightyellow"}
                            siteId={T30Site.id}
                          />
                        </Grid>
                        {/* <Grid item xs={12}>
                          <StorageTankSelect
                            name="destinationSinkStorageTankId"
                            label="Tangki Tujuan"
                            isRequired={true}
                            isReadOnly={false}
                            sx={{ mt: 1 }}
                            backgroundColor="white"
                            siteId={T30Site.id}
                          />
                        </Grid> */}
                        <Grid item xs={12}>
                          <TextFieldMUI
                            label=""
                            type="text"
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{
                              mt: 2,
                              backgroundColor: "transparent",
                              input: { cursor: "default", borderColor: "transparent" },
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "transparent",
                                },
                                "&:hover fieldset": {
                                  borderColor: "transparent",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "transparent",
                                },
                              },
                            }}
                            inputProps={{ readOnly: true }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Divider sx={{ mt: 2 }}>Kualitas</Divider>
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
                            sx={{ mt: 1, backgroundColor: "whitesmoke" }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            inputProps={{ readOnly: true }}
                            value={values?.originFfaPercentage > 0 ? values.originFfaPercentage.toFixed(2) : "0.00"}
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
                            sx={{ mt: 1, backgroundColor: "whitesmoke" }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            inputProps={{ readOnly: true }}
                            value={values?.originMoistPercentage > 0 ? values.originMoistPercentage.toFixed(2) : "0.00"}
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
                            sx={{ mt: 1, backgroundColor: "whitesmoke" }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">%</InputAdornment>,
                            }}
                            inputProps={{ readOnly: true }}
                            value={values?.originDirtPercentage > 0 ? values.originDirtPercentage.toFixed(3) : "0.000"}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} sm={6} lg={3}>
                      <Grid container columnSpacing={1}>
                        <Grid item xs={12}>
                          <Divider>DATA TIMBANG KENDARAAN</Divider>
                        </Grid>

                        <Grid item xs={4}>
                          <Field
                            name="originWeighInKg"
                            label="Berat WB-IN"
                            type="number"
                            required={true}
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 1, backgroundColor: "whitesmoke" }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                            }}
                            inputProps={{ readOnly: true }}
                            value={values.originWeighInKg.toFixed(2) || "0.00"}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Field
                            name="originWeighOutKg"
                            label="Berat WB-OUT"
                            type="number"
                            required={false}
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 1, backgroundColor: "whitesmoke" }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                            }}
                            inputProps={{ readOnly: true }}
                            value={values.originWeighOutKg.toFixed(2) || "0.00"}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Field
                            name="originWeighNetto"
                            label="NETTO"
                            type="number"
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 1, backgroundColor: "whitesmoke" }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                            }}
                            value={originWeighNetto.toFixed(2) || "0.00"}
                            inputProps={{ readOnly: true }}
                          />
                        </Grid>

                        <Grid item xs={5}>
                          <Field
                            name="originWeighInOperatorName"
                            label="Operator WB-IN"
                            type="text"
                            required={true}
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                            value={values?.originWeighInOperatorName ? values.originWeighInOperatorName : "-"}
                          />
                        </Grid>
                        <Grid item xs={7}>
                          <Field
                            name="originWeighInTimestamp"
                            label="Waktu WB-IN"
                            type="text"
                            required={true}
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                            value={
                              values?.originWeighInTimestamp
                                ? moment(values.originWeighInTimestamp).local().format(`DD/MM/YYYY - HH:mm:ss`)
                                : "-"
                            }
                          />
                        </Grid>

                        <Grid item xs={5}>
                          <Field
                            name="originWeighOutOperatorName"
                            label="Operator WB-OUT"
                            type="text"
                            required={false}
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                            value={values?.originWeighOutOperatorName ? values.originWeighOutOperatorName : "-"}
                          />
                        </Grid>
                        <Grid item xs={7}>
                          <Field
                            name="originWeighOutTimestamp"
                            label="Waktu WB-OUT"
                            type="text"
                            required={false}
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                            value={
                              values?.originWeighOutTimestamp
                                ? moment(values.originWeighOutTimestamp).local().format(`DD/MM/YYYY - HH:mm:ss`)
                                : "-"
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

export default TransactionT30NormalIn;
