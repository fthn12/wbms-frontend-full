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
import Header from "../../../../../components/layout/signed/HeaderTransaction";
import {
  CertificateSelect,
  StorageTankSelect,
} from "../../../../../components/FormikMUI";
import CancelConfirmation from "components/CancelConfirmation";
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
  useConfig,
  useTransaction,
  useProduct,
  useWeighbridge,
  useSite,
  useStorageTank,
} from "../../../../../hooks";

const LBNManualEntryDispatchOut = () => {
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

  const { useFindManyStorageTanksQuery } = useStorageTank();
  const LBNSite = eDispatchApi.getBulkingSite();

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

  const [dtTypeProduct] = useState(PRODUCT_TYPES);

  const [originWeightNetto, setOriginWeightNetto] = useState(0);
  const [destinationWeightNetto, setDestinationWeightNetto] = useState(0);

  const [isReject, setIsReject] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [dtTrx, setDtTrx] = useState(null);

  const validationSchema = Yup.object().shape({
    transportVehicleId: Yup.string().required("Wajib diisi"),
    transporterCompanyId: Yup.string().required("Wajib diisi"),
    productId: Yup.string().required("Wajib diisi"),
    driverId: Yup.string().required("Wajib diisi"),
    destinationSinkStorageTankId: Yup.string().required("Wajib diisi"),
    unloadedSeal1: Yup.string().required("Wajib diisi"),
    unloadedSeal2: Yup.string().required("Wajib diisi"),
    destinationWeighOutRemark: Yup.string().required("Wajib diisi"),
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
        (item) => item.id === values.destinationSinkStorageTankId
      );

      if (selectedStorageTank) {
        tempTrans.destinationSinkStorageTankCode =
          selectedStorageTank.code || "";
        tempTrans.destinationSinkStorageTankName =
          selectedStorageTank.name || "";
      }

      const selectedDestinationSite = dtSite.records.find(
        (item) => item.id === WBMS.SITE.id
      );

      if (selectedDestinationSite) {
        tempTrans.destinationSiteId = selectedDestinationSite.id || "";
        tempTrans.destinationSiteCode = selectedDestinationSite.code || "";
        tempTrans.destinationSiteName = selectedDestinationSite.name || "";
      }

      if (WBMS.WB_STATUS === true) {
        tempTrans.destinationWeighOutKg = wb.weight;
      } else if (WBMS.WB_STATUS === false) {
        tempTrans.isManualTonase = 1;
      }
      tempTrans.isManualEntry = 1;

      if (isReject) {
        tempTrans.productType = parseInt(tempTrans.productType);
        tempTrans.progressStatus = 31;
        tempTrans.deliveryStatus = 26;
        tempTrans.deliveryDate = moment().toDate();
        tempTrans.destinationWeighOutTimestamp = moment().toDate();
        tempTrans.destinationWeighOutOperatorName = user.name.toUpperCase();
        tempTrans.dtTransaction = moment()
          .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
          .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
          .format();

        const response = await transactionAPI.updateById(tempTrans.id, {
          ...tempTrans,
        });

        if (!response.status) throw new Error(response?.message);

        clearWbTransaction();
        setIsLoading(false);

        toast.success(`Transaksi WB-OUT Reject telah tersimpan.`);
        // redirect ke form view
        const id = response?.data?.transaction?.id;
        navigate(`/wb/transactions/bulking/manual-entry-dispatch-view/${id}`);
      } else {
        tempTrans.productType = parseInt(tempTrans.productType);
        tempTrans.progressStatus = 21;
        tempTrans.deliveryStatus = 38;
        tempTrans.deliveryDate = moment().toDate();
        tempTrans.destinationWeighOutTimestamp = moment().toDate();
        tempTrans.destinationWeighOutOperatorName = user.name.toUpperCase();
        tempTrans.dtTransaction = moment()
          .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
          .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
          .format();

        const response = await transactionAPI.updateById(tempTrans.id, {
          ...tempTrans,
        });

        if (!response.status) throw new Error(response?.message);

        clearWbTransaction();
        setIsLoading(false);

        toast.success(`Transaksi WB-OUT telah tersimpan.`);
        // redirect ke form view
        const id = response?.data?.transaction?.id;
        navigate(`/wb/transactions/bulking/manual-entry-dispatch-view/${id}`);
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
      <Header
        title="TRANSAKSI BULKING"
        subtitle="Transaksi Manual Entry Timbang WB-OUT"
      />
      {openedTransaction && (
        <Formik
          // enableReinitialize
          onSubmit={handleFormikSubmit}
          initialValues={openedTransaction}
          validationSchema={validationSchema}
          isInitialValid={false}
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
                  {WBMS.WB_STATUS === true && (
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
                      sx={{ marginRight: "auto", backgroundColor: "darkred" }}
                    />
                  )}
                  {WBMS.WB_STATUS === false && (
                    <CancelConfirmation
                      title="Alasan REJECT (PENGEMBALIAN)"
                      caption="SIMPAN REJECT (PENGEMBALIAN)"
                      content="Anda yakin melakukan REJECT (PENGEMBALIAN) transaksi WB ini? Berikan keterangan yang cukup."
                      onClose={handleReject}
                      disabled={
                        !(
                          isValid &&
                          dirty &&
                          values.destinationWeighOutKg > WBMS.WB_MIN_WEIGHT
                        )
                      }
                      sx={{ marginRight: "auto", backgroundColor: "darkred" }}
                    />
                  )}

                  {WBMS.WB_STATUS === true && (
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ mr: 1 }}
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
                  )}
                  {WBMS.WB_STATUS === false && (
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ mr: 1 }}
                      disabled={
                        !(
                          isValid &&
                          dirty &&
                          values.destinationWeighOutKg > WBMS.WB_MIN_WEIGHT
                        )
                      }
                    >
                      SIMPAN (WB-OUT)
                    </Button>
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
                              values?.currentSeal1 ? values.currentSeal1 : "-"
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
                              values?.currentSeal2 ? values.currentSeal2 : "-"
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
                              values?.currentSeal3 ? values.currentSeal3 : "-"
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
                              values?.currentSeal4 ? values.currentSeal4 : "-"
                            }
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
                            sx={{
                              mt: 2,
                              mb: 2,
                              backgroundColor: "whitesmoke",
                            }}
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
                            sx={{
                              mt: 2,
                              mb: 2,
                              backgroundColor: "whitesmoke",
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  kg
                                </InputAdornment>
                              ),
                            }}
                            label="TOTAL ASAL"
                            name="originweightNetto"
                            value={
                              originWeightNetto > 0
                                ? originWeightNetto.toFixed(2)
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
                            value={user.name}
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
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
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
                              label="BERAT KELUAR - OUT"
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
                              sx={{ mt: 2, backgroundColor: "lightyellow" }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    kg
                                  </InputAdornment>
                                ),
                              }}
                              label="BERAT KELUAR - OUT"
                              name="destinationWeighOutKg"
                              value={
                                values?.destinationWeighOutKg > 0
                                  ? values.destinationWeighOutKg
                                  : "0"
                              }
                            />
                          </Grid>
                        )}

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
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  kg
                                </InputAdornment>
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
                        <Grid item xs={12} sx={{ mt: 2 }}>
                          <Divider>Catatan</Divider>
                        </Grid>

                        <Grid item xs={12}>
                          <Field
                            name="destinationWeighInRemark"
                            label="Alasan untuk Entri Manual"
                            type="text"
                            multiline
                            rows={5}
                            required={true}
                            component={TextField}
                            onChange={(e) => {
                              const { value } = e.target;
                              setFieldValue("destinationWeighInRemark", value);
                              setFieldValue("destinationWeighOutRemark", value);
                            }}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 2, backgroundColor: "lightyellow" }}
                            // inputProps={{ readOnly: true }}
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

export default LBNManualEntryDispatchOut;
