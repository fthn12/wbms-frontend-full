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
import Header from "../../../../../../components/layout/signed/HeaderTransaction";
import QRCodeViewer from "components/QRCodeViewer";
import {
  CertificateSelect,
  StorageTankSelect,
} from "../../../../../../components/FormikMUI";
import {
  DriverACP,
  CompanyACP,
  ProductACP,
  TransportVehicleACP,
} from "../../../../../../components/FormManualEntry";
import BonTripPrint from "../../../../../../components/BontripPrintT30";

import * as eDispatchApi from "../../../../../../apis/eDispatchApi";
import ProgressStatus from "components/ProgressStatus";
import { TransactionAPI } from "../../../../../../apis";

import {
  useAuth,
  useConfig,
  useTransaction,
  useProduct,
  useWeighbridge,
  useStorageTank,
  useSite,
} from "../../../../../../hooks";

const T30BackDateDispatchNormalView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const transactionAPI = TransactionAPI();
  const { wb } = useWeighbridge();
  const { id } = useParams();
  const { WBMS, PRODUCT_TYPES, PROGRESS_STATUS } = useConfig();
  const { useGetSitesQuery } = useSite();
  const { data: dtSite } = useGetSitesQuery();
  const {
    openedTransaction,
    clearWbTransaction,
    setOpenedTransaction,
    setWbTransaction,
    clearOpenedTransaction,
  } = useTransaction();

  const [isCancel, setIsCancel] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);
  const [isReadOnly, setIsReadOnly] = useState(true);

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

  const [dtTypeProduct] = useState(PRODUCT_TYPES);

  const [originWeighNetto, setOriginWeighNetto] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [dtTrx, setDtTrx] = useState(null);

  const handleClose = () => {
    clearOpenedTransaction();

    navigate("/wb/transactions-backdate-form");
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
      <Header title="TRANSAKSI T30" subtitle="DATA TIMBANG BACKDATE" />
      {openedTransaction && (
        <Formik
          // enableReinitialize
          // onSubmit={handleFormikSubmit}
          initialValues={openedTransaction}
          // isInitialValid={false}
        >
          {(props) => {
            const {
              values,
              isValid,
              dirty,
              setFieldValue,
              submitForm,
              resetForm,
              handleChange,
            } = props;
            // console.log("Formik props:", props);

            // const handleCancel = (cancelReason) => {
            //   if (cancelReason.trim().length <= 10)
            //     return toast.error("Alasan CANCEL (PEMBATALAN) harus melebihi 10 karakter.");

            //   setFieldValue("returnWeighInRemark", cancelReason);
            //   setIsCancel(true);

            //   submitForm();
            // };

            const handleSubmit = async () => {
              if (isReadOnly) setIsReadOnly(false);
              else submitForm();
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
                  <BonTripPrint dtTrans={{ ...values }} sx={{ mx: 1 }} />
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "dimgrey " }}
                    onClick={handleReset}
                  >
                    {/* {isReadOnly ? "TUTUP" : "BATAL"} */}
                    TUTUP
                  </Button>
                  {/* <Button variant="contained" onClick={handleClose}>
                      TUTUP
                    </Button> */}
                </Box>

                <Paper sx={{ mt: 1, p: 2, minHeight: "71.5vh" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} lg={3}>
                      <Grid item xs={12}>
                        <Divider sx={{ mb: 2 }}>DATA KENDARAAN</Divider>
                      </Grid>

                      <ProgressStatus
                        progressStatus={values?.progressStatus}
                        sx={{ mb: 2, backgroundColor: "whitesmoke" }}
                      />
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
                        }}
                      >
                        {dtTypeProduct &&
                          dtTypeProduct.map((data, index) => (
                            <MenuItem key={index} value={data.id}>
                              {data.value}
                            </MenuItem>
                          ))}
                      </Field>
                      <Field
                        type="text"
                        variant="outlined"
                        component={TextField}
                        size="small"
                        fullWidth
                        required={true}
                        sx={{ mb: 2, backgroundColor: "whitesmoke" }}
                        label="TANGGAL Delivery"
                        name="deliveryDate"
                        value={
                          values?.deliveryDate
                            ? moment(values.deliveryDate)
                                .local()
                                .format(`DD/MM/YYYY`)
                            : "-"
                        }
                        inputProps={{ readOnly: true }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
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
                            rows={5.4}
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

export default T30BackDateDispatchNormalView;
