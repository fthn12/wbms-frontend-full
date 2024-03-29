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
import {
  DriverACP,
  CompanyACP,
  ProductACP,
  TransportVehicleACP,
} from "../../../../../components/FormManualEntry";
import BonTripPrintT30 from "../../../../../components/BontripPrintT30";

import * as eDispatchApi from "../../../../../apis/eDispatchApi";

import { TransactionAPI } from "../../../../../apis";

import {
  useAuth,
  useConfig,
  useTransaction,
  useProduct,
} from "../../../../../hooks";

const T30ManualEntryDispatchView = () => {
  const navigate = useNavigate();
  const transactionAPI = TransactionAPI();
  const { id } = useParams();
  const { WBMS, PRODUCT_TYPES } = useConfig();
  const { openedTransaction, setOpenedTransaction, clearOpenedTransaction } =
    useTransaction();
  const [selectedOption, setSelectedOption] = useState(0);

  const { useFindManyProductQuery } = useProduct();

  const productFilter = {
    where: {
      productGroupId: selectedOption,
    },
  };

  const { data: dtProduct } = useFindManyProductQuery(productFilter);

  const [dtTypeProduct] = useState(PRODUCT_TYPES);

  const [originWeighNetto, setOriginWeighNetto] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dtTrx, setDtTrx] = useState(null);

  const handleClose = () => {
    clearOpenedTransaction();

    navigate("/wb/transactions");
  };

  const handleCancel = () => {
    clearOpenedTransaction();
    navigate(`/wb/transactions/t30/manual-entry-dispatch-cancel-in/${id}`);
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
        <Formik initialValues={openedTransaction}>
          {(props) => {
            const { values, isValid, setFieldValue, handleChange } = props;
            // console.log("Formik props:", props);

            return (
              <Form>
                <Box sx={{ display: "flex", mt: 3, justifyContent: "end" }}>
                  <Button
                    variant="contained"
                    onClick={() => handleCancel(values)}
                    sx={{ backgroundColor: "darkred", mr: "auto" }}
                  >
                    Cancel Transaksi
                  </Button>
                  <BonTripPrintT30 dtTrans={{ ...values }} sx={{ mx: 1 }} />
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
                        formControl={{
                          fullWidth: true,
                          required: true,
                          size: "small",
                        }}
                        inputProps={{ readOnly: true }}
                        sx={{ mb: 2, backgroundColor: "whitesmoke" }}
                        onChange={(event, newValue) => {
                          handleChange(event);
                          const selectedProductType = dtTypeProduct.find(
                            (item) => item.id === event.target.value
                          );
                          setSelectedOption(selectedProductType.id);
                          // setFieldValue("productName", "");
                          // setFieldValue("productId", "");
                          // setFieldValue("productCode", "");
                          // setFieldValue("transportVehicleProductName", "");
                          // setFieldValue("transportVehicleId", "");
                          // setFieldValue("transportVehicleProductCode", "");
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
                            inputProps={{ readOnly: true }}
                            sx={{ mb: 2, backgroundColor: "whitesmoke" }}
                          />
                          <TransportVehicleACP
                            name="transportVehicleId"
                            label="Nomor Plat"
                            isReadOnly={true}
                            sx={{ mb: 2 }}
                          />
                          <DriverACP
                            name="driverName"
                            label="Nama Supir"
                            isReadOnly={true}
                            sx={{ mb: 2 }}
                          />
                          <CompanyACP
                            name="transporterCompanyName"
                            label="Nama Vendor"
                            isReadOnly={true}
                            sx={{ mb: 2 }}
                          />
                          <ProductACP
                            data={dtProduct}
                            name="productId"
                            label="Nama Product"
                            isReadOnly={true}
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
                                isReadOnly={true}
                                sx={{ mt: 2 }}
                                backgroundColor="whitesmoke"
                                siteId={null}
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
                                sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                                inputProps={{ readOnly: true }}
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
                                sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                                inputProps={{ readOnly: true }}
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
                                sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                                inputProps={{ readOnly: true }}
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
                                sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                                inputProps={{ readOnly: true }}
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <Divider sx={{ mt: 2, mb: 1 }}>Kualitas</Divider>
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
                                inputProps={{ readOnly: true }}
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
                                inputProps={{ readOnly: true }}
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
                                inputProps={{ readOnly: true }}
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
                                label="Operator WB-OUT"
                                value={
                                  values?.originWeighOutOperatorName || "-"
                                }
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
                            <Grid item xs={12} sx={{ mt: 2 }}>
                              <Divider>Catatan</Divider>
                            </Grid>

                            <Grid item xs={12}>
                              <Field
                                name="originWeighInRemark"
                                label="Alasan untuk Entri Manual"
                                type="text"
                                multiline
                                rows={5}
                                required={true}
                                component={TextField}
                                onChange={(e) => {
                                  const { value } = e.target;
                                  setFieldValue("originWeighInRemark", value);
                                  setFieldValue("originWeighOutRemark", value);
                                }}
                                variant="outlined"
                                size="small"
                                fullWidth
                                sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                                inputProps={{ readOnly: true }}
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

export default T30ManualEntryDispatchView;
