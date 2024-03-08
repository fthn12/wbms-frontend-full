import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  MenuItem,
  CircularProgress,
  Grid,
  InputAdornment,
  Divider,
  Paper,
  TextField as TextFieldMUI,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import { TextField, Autocomplete, Select } from "formik-mui";
import * as Yup from "yup";
import { toast } from "react-toastify";
import moment from "moment";
import CancelConfirmation from "components/CancelConfirmation";
import ManualEntryConfirmation from "components/ManualEntryConfirmation";
import Header from "../../../../../components/layout/signed/HeaderTransaction";
import {
  CertificateSelect,
  StorageTankSelect,
} from "../../../../../components/FormikMUI";
import {
  DriverACP,
  CompanyACP,
  ProductACP,
  TransportVehicleACP,
} from "../../../../../components/FormManualEntry";

import * as eDispatchApi from "../../../../../apis/eDispatchApi";

import { TransactionAPI } from "../../../../../apis";

import {
  useAuth,
  useSite,
  useConfig,
  useTransaction,
  useProduct,
  useWeighbridge,
  useStorageTank,
  useKualitasCpo,
} from "../../../../../hooks";

const T30ManualEntryDispatchOut = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const transactionAPI = TransactionAPI();
  const { wb } = useWeighbridge();
  const { id } = useParams();
  const { WBMS, PRODUCT_TYPES } = useConfig();
  const { useGetSitesQuery } = useSite();
  const {
    openedTransaction,
    clearWbTransaction,
    setOpenedTransaction,
    setWbTransaction,
    clearOpenedTransaction,
  } = useTransaction();

  const [selectedOption, setSelectedOption] = useState(0);
  const [isCancel, setIsCancel] = useState(false);

  const { useFindFirstKualitasCpoQuery } = useKualitasCpo();
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

  const { useFindManyProductQuery } = useProduct();

  const productFilter = {
    where: {
      productGroupId: selectedOption,
    },
  };

  const { data: dtProduct } = useFindManyProductQuery(productFilter);
  const { data: dtSite } = useGetSitesQuery();
  const { data: dtKualitasCpo } = useFindFirstKualitasCpoQuery();

  const [dtTypeProduct] = useState(PRODUCT_TYPES);

  const [originWeighNetto, setOriginWeighNetto] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dtTrx, setDtTrx] = useState(null);

  const validationSchema = Yup.object().shape({
    transportVehicleId: Yup.string().required("Wajib diisi"),
    transporterCompanyId: Yup.string().required("Wajib diisi"),
    productId: Yup.string().required("Wajib diisi"),
    driverId: Yup.string().required("Wajib diisi"),
    originSourceStorageTankId: Yup.string().required("Wajib diisi"),
    loadedSeal1: Yup.string().required("Wajib diisi"),
    loadedSeal2: Yup.string().required("Wajib diisi"),
    deliveryOrderNo: Yup.string().required("Wajib diisi"),
  });

  const handleClose = () => {
    clearOpenedTransaction();

    navigate("/wb/transactions");
  };

  const handleFormikSubmit = async (values) => {
    let tempTrans = { ...values };

    setIsLoading(true);

    try {
      const selectedStorageTank = dtStorageTank.records.find(
        (item) => item.id === values.originSourceStorageTankId
      );

      if (selectedStorageTank) {
        tempTrans.originSourceStorageTankCode = selectedStorageTank.code || "";
        tempTrans.originSourceStorageTankName = selectedStorageTank.name || "";
        tempTrans.originSiteCode = selectedStorageTank.code || "";
        tempTrans.originSiteName = selectedStorageTank.name || "";
      }
      const selectedSite = dtSite.records.find(
        (item) => item.id === WBMS.SITE.id
      );

      if (selectedSite) {
        tempTrans.originSiteId = selectedSite.id || "";
        tempTrans.originSiteCode = selectedSite.code || "";
        tempTrans.originSiteName = selectedSite.name || "";
      }

      if (WBMS.WB_STATUS === true) {
        tempTrans.returnWeighInKg = wb.weight;
      }

      tempTrans.rspoSccModel = parseInt(tempTrans.rspoSccModel);
      tempTrans.isccSccModel = parseInt(tempTrans.isccSccModel);
      tempTrans.ispoSccModel = parseInt(tempTrans.ispoSccModel);

      if (isCancel) {
        if (WBMS.WB_STATUS === true) {
          tempTrans.returnWeighInKg = wb.weight;
        } else if (WBMS.WB_STATUS === false) {
          tempTrans.returnWeighInKg = tempTrans.originWeighOutKg;
        }

        tempTrans.originWeighOutKg = 0;

        tempTrans.returnWeighInOperatorName = user.name.toUpperCase();
        tempTrans.returnWeighInTimestamp = moment().toDate();
        tempTrans.progressStatus = 6;
        tempTrans.dtTransaction = moment()
          .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
          .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
          .format();

        const data = { tempTrans };

        const response = await transactionAPI.updateById(tempTrans.id, {
          ...tempTrans,
        });

        if (!response.status) throw new Error(response?.message);

        clearWbTransaction();
        setIsLoading(false);

        toast.success(`Transaksi CANCEL WB-IN telah tersimpan.`);

        // redirect ke form view
        const id = response?.data?.transaction?.id;
        navigate(
          `/wb/transactions/t30/manual-entry-dispatch-cancel-in-view/${id}`
        );

        return;
      } else {
        const selectedDestinationSite = dtSite.records.find(
          (item) => item.id === WBMS.DESTINATION_SITE.id
        );

        if (selectedDestinationSite) {
          tempTrans.destinationSiteId = selectedDestinationSite.id || "";
          tempTrans.destinationSiteCode = selectedDestinationSite.code || "";
          tempTrans.destinationSiteName = selectedDestinationSite.name || "";
        }

        if (WBMS.WB_STATUS === true) {
          tempTrans.originWeighOutKg = wb.weight;
        }else if (WBMS.WB_STATUS === false) {
          tempTrans.isManualTonase = 1;
        }

        tempTrans.deliveryStatus = 20;
        tempTrans.isManualEntry = 1;
        tempTrans.typeTransaction = 5;
        tempTrans.deliveryDate = moment().toDate();
        tempTrans.originWeighOutOperatorName = user.name.toUpperCase();
        tempTrans.originWeighOutTimestamp = moment().toDate();
        tempTrans.progressStatus = 21;
        tempTrans.dtTransaction = moment()
          .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
          .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
          .format();

        const data = { tempTrans };

        const response = await transactionAPI.updateById(tempTrans.id, {
          ...tempTrans,
        });

        if (!response.status) throw new Error(response?.message);

        clearWbTransaction();
        setIsLoading(false);

        toast.success(`Transaksi WB-OUT telah tersimpan.`);

        const id = response?.data?.transaction?.id;
        navigate(`/wb/transactions/t30/manual-entry-dispatch-view/${id}`);

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

    return () => {
      // console.clear();
    };
  }, []);

  //validasi form
  // const validateForm = () => {
  //   return values.bonTripNo && values.driverName && ProductName && TransporterCompanyName && PlateNo;
  // };

  //weight wb
  // useEffect(() => {
  //   setWbTransaction({ originWeighOutKg: wb.weight });
  // }, [wb.weight]);

  useEffect(() => {
    if (!id) return handleClose();

    transactionAPI
      .getById(id)
      .then((res) => {
        setOpenedTransaction(res.data.transaction);
        setSelectedOption(res.data.transaction.productType);
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
      let total = Math.abs(
        openedTransaction?.originWeighInKg - openedTransaction?.originWeighOutKg
      );
      setOriginWeighNetto(total);
    }
  }, [openedTransaction]);

  return (
    <Box>
      <Header
        title="Transaksi T30"
        subtitle="Transaksi Manual Entry Timbang WB-OUT"
      />
      {openedTransaction && (
        <Formik
          // enableReinitialize
          onSubmit={handleFormikSubmit}
          initialValues={{
            ...openedTransaction,
            originFfaPercentage: dtKualitasCpo?.FfaPercentage,
            originMoistPercentage: dtKualitasCpo?.MoistPercentage,
            originDirtPercentage: dtKualitasCpo?.DirtPercentage,
          }}
          validationSchema={validationSchema}
          // isInitialValid={false}
        >
          {(props) => {
            const {
              values,
              isValid,
              dirty,
              setFieldValue,
              submitForm,
              handleChange,
            } = props;
            // console.log("Formik props:", props);

            const handleSubmit = () => {
              submitForm();
            };

            const handleCancel = (cancelReason) => {
              if (cancelReason.trim().length <= 10)
                return toast.error(
                  "Alasan CANCEL (PEMBATALAN) harus melebihi 10 karakter."
                );

              setFieldValue("returnWeighInRemark", cancelReason);
              setIsCancel(true);

              submitForm();
            };

            return (
              <Form>
                <Box sx={{ display: "flex", mt: 3, justifyContent: "end" }}>
                {WBMS.WB_STATUS === true && (
                    <CancelConfirmation
                      title="Alasan CANCEL (PEMBATALAN)"
                      caption="SIMPAN CANCEL (IN)"
                      content="Anda yakin melakukan CANCEL (PEMBATALAN) transaksi WB ini? Berikan keterangan yang cukup."
                      onClose={handleCancel}
                      isDisabled={
                        !(
                          isValid &&
                          wb?.isStable &&
                          wb?.weight > WBMS.WB_MIN_WEIGHT
                        )
                      }
                      sx={{ marginRight: "auto", backgroundColor: "darkred" }}
                    />
                  )}
                  {WBMS.WB_STATUS === false && (
                    <CancelConfirmation
                      title="Alasan CANCEL (PEMBATALAN)"
                      caption="SIMPAN CANCEL (IN)"
                      content="Anda yakin melakukan CANCEL (PEMBATALAN) transaksi WB ini? Berikan keterangan yang cukup."
                      onClose={handleCancel}
                      isDisabled={
                        !(
                          isValid &&
                          dirty &&
                          values.originWeighOutKg > WBMS.WB_MIN_WEIGHT
                        )
                      }
                      sx={{ marginRight: "auto", backgroundColor: "darkred" }}
                    />
                  )}
                  {WBMS.WB_STATUS === true && (
                    <ManualEntryConfirmation
                      title="Alasan (MANUAL ENTRY)"
                      caption="SIMPAN (WB-OUT)"
                      content="Anda yakin melakukan (MANUAL ENTRY) transaksi WB ini? Berikan keterangan yang cukup."
                      onClose={handleSubmit}
                      disabled={
                        !(
                          isValid &&
                          wb?.isStable &&
                          wb?.weight > WBMS.WB_MIN_WEIGHT &&
                     
                          values.progressStatus === 1
                        )
                      }
                      sx={{ mr: 1 }}
                      variant="contained"
                    />
                  )}
                  {WBMS.WB_STATUS === false && (
                    <ManualEntryConfirmation
                      title="Alasan (MANUAL ENTRY)"
                      caption="SIMPAN (WB-OUT)"
                      content="Anda yakin melakukan (MANUAL ENTRY) transaksi WB ini? Berikan keterangan yang cukup."
                      onClose={handleSubmit}
                      disabled={
                        !(
                          isValid &&
                          dirty &&
                          values.originWeighOutKg > WBMS.WB_MIN_WEIGHT &&
                          values.progressStatus === 1
                        )
                      }
                      sx={{ mr: 1 }}
                      variant="contained"
                    />
                  )}
                  {/* <BonTripPrint dtTrans={{ ...values }} isDisable={!isSubmitted} sx={{ mx: 1 }} /> */}
                  <Button variant="contained" onClick={handleClose}>
                    TUTUP
                  </Button>
                  {/* <Button
                    variant="contained"
                    sx={{ ml: 1 }}
                    onClick={() => {
                      console.log("Form:", props);
                    }}
                  >
                    DEBUG
                  </Button> */}
                </Box>
                <Paper sx={{ mt: 1, p: 2, minHeight: "71.5vh" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} lg={3}>
                      <Grid item xs={12}>
                        <Divider sx={{ mb: 2 }}>DATA KENDARAAN</Divider>
                      </Grid>
                      <Field
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ backgroundColor: "whitesmoke", mb: 2 }}
                        label="NO BONTRIP"
                        name="bonTripNo"
                        component={TextField}
                        inputProps={{ readOnly: true }}
                      />
                      <Field
                        name="productType"
                        label="Tipe Transaksi"
                        component={Select}
                        size="small"
                        inputProps={{ readOnly: true }}
                        formControl={{
                          fullWidth: true,
                          required: true,
                          size: "small",
                        }}
                        sx={{ mb: 2, backgroundColor: "whitesmoke" }}
                        onChange={(event, newValue) => {
                          handleChange(event);
                          const selectedProductType = dtTypeProduct.find(
                            (item) => item.id === event.target.value
                          );
                          setSelectedOption(selectedProductType.id);
                        }}
                      >
                        {dtTypeProduct &&
                          dtTypeProduct.map((data, index) => (
                            <MenuItem key={index} value={data.id}>
                              {data.value}
                            </MenuItem>
                          ))}
                      </Field>

                      {selectedOption === 1 && (
                        <>
                          <Field
                            name="deliveryOrderNo"
                            label="NO DO"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            required
                            size="small"
                            fullWidth
                            sx={{ mb: 2, backgroundColor: "transparant" }}
                          />
                          <TransportVehicleACP
                            name="transportVehicleId"
                            label="Nomor Plat"
                            isReadOnly={false}
                            sx={{ mb: 2 }}
                          />
                          <DriverACP
                            name="driverName"
                            label="Nama Supir"
                            isReadOnly={false}
                            sx={{ mb: 2 }}
                          />
                          <CompanyACP
                            name="transporterCompanyName"
                            label="Nama Vendor"
                            isReadOnly={false}
                            sx={{ mb: 2 }}
                          />
                          <ProductACP
                            data={dtProduct}
                            name="productId"
                            label="Nama Product"
                            isReadOnly={false}
                            sx={{ mb: 2 }}
                          />
                        </>
                      )}
                    </Grid>
                    {selectedOption === 1 && (
                      <>
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
                                sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                                inputProps={{ readOnly: true }}
                                value={`${values?.productCode} - ${values?.productName}`}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <CertificateSelect
                                name="rspoSccModel"
                                label="Sertifikasi RSPO"
                                isRequired={true}
                                isReadOnly={false}
                                sx={{ mt: 2 }}
                                // backgroundColor="lightyellow"
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
                                value={
                                  values?.rspoCertificateNumber
                                    ? values.rspoCertificateNumber
                                    : "-"
                                }
                              />
                            </Grid>

                            <Grid item xs={6}>
                              <CertificateSelect
                                name="isccSccModel"
                                label="Sertifikasi ISCC"
                                isRequired={true}
                                isReadOnly={false}
                                sx={{ mt: 2 }}
                                // backgroundColor="lightyellow"
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
                                value={
                                  values?.isccCertificateNumber
                                    ? values.isccCertificateNumber
                                    : "-"
                                }
                              />
                            </Grid>

                            <Grid item xs={6}>
                              <CertificateSelect
                                name="ispoSccModel"
                                label="Sertifikasi ISPO"
                                isRequired={true}
                                isReadOnly={false}
                                sx={{ mt: 2 }}
                                // backgroundColor="lightyellow"
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
                                value={
                                  values?.ispoCertificateNumber
                                    ? values.ispoCertificateNumber
                                    : "-"
                                }
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <Divider sx={{ mt: 6.5 }}>Tangki</Divider>
                            </Grid>

                            <Grid item xs={12}>
                              <StorageTankSelect
                                name="originSourceStorageTankId"
                                label="Tangki Asal"
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
                                value={
                                  values?.currentSeal1
                                    ? values.currentSeal1
                                    : "-"
                                }
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
                                value={
                                  values?.currentSeal2
                                    ? values.currentSeal2
                                    : "-"
                                }
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
                                value={
                                  values?.currentSeal3
                                    ? values.currentSeal3
                                    : "-"
                                }
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
                                value={
                                  values?.currentSeal4
                                    ? values.currentSeal4
                                    : "-"
                                }
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

                            <Grid item xs={12}>
                              <Divider sx={{ mt: 2, mb: 1 }}>Kualitas</Divider>
                            </Grid>
                            <Grid item xs={4}>
                              <Field
                                name="originFfaPeCrcentage"
                                label="FFA"
                                type="number"
                                component={TextField}
                                variant="outlined"
                                size="small"
                                fullWidth
                                sx={{ mt: 1 }}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      %
                                    </InputAdornment>
                                  ),
                                }}
                                value={
                                  values?.originFfaPercentage > 0
                                    ? values.originFfaPercentage
                                    : "0"
                                }
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
                                sx={{ mt: 1 }}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      %
                                    </InputAdornment>
                                  ),
                                }}
                                value={
                                  values?.originMoistPercentage > 0
                                    ? values.originMoistPercentage
                                    : "0"
                                }
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
                                sx={{ mt: 1 }}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      %
                                    </InputAdornment>
                                  ),
                                }}
                                value={
                                  values?.originDirtPercentage > 0
                                    ? values.originDirtPercentage
                                    : "0"
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
                                label="Operator WB-OUT"
                                value={user.name}
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
                                label="Waktu WB-IN"
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
                                label="Waktu WB-Out"
                                name="originWeighOutTimestamp"
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
                                sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      kg
                                    </InputAdornment>
                                  ),
                                }}
                                label="BERAT MASUK - IN"
                                name="originWeighInKg"
                                value={
                                  values?.originWeighInKg > 0
                                    ? values.originWeighInKg.toFixed(2)
                                    : "0.00"
                                }
                                inputProps={{ readOnly: true }}
                              />
                            </Grid>
                            {WBMS.WB_STATUS === true && (
                              <Grid item xs={6}>
                                <Field
                                  type="number"
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  component={TextField}
                                  sx={{
                                    mt: 2,
                                    mb: 1.5,
                                    backgroundColor: "whitesmoke",
                                  }}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        kg
                                      </InputAdornment>
                                    ),
                                  }}
                                  label="BERAT KELUAR - OUT"
                                  name="originWeighOutKg"
                                  value={
                                    wb?.weight > 0
                                      ? wb.weight.toFixed(2)
                                      : "0.00"
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
                                  sx={{
                                    mt: 2,
                                    mb: 2,
                                    backgroundColor: "lightyellow",
                                  }}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        kg
                                      </InputAdornment>
                                    ),
                                  }}
                                  label="BERAT KELUAR - OUT"
                                  name="originWeighOutKg"
                                  value={
                                    values?.originWeighOutKg > 0
                                      ? values.originWeighOutKg
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
                                  originWeighNetto > 0
                                    ? originWeighNetto.toFixed(2)
                                    : "0.00"
                                }
                              />
                            </Grid>
                          
                          </Grid>
                        </Grid>
                      </>
                    )}
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

export default T30ManualEntryDispatchOut;
