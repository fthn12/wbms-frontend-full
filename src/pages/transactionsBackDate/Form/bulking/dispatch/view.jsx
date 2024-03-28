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
import ProgressStatus from "components/ProgressStatus";
import { toast } from "react-toastify";
import moment from "moment";
import Header from "../../../../../components/layout/signed/HeaderTransaction";
import {
  CertificateSelect,
  StorageTankSelect,
} from "../../../../../components/FormikMUI";
import BonTripPrint from "../../../../../components/BontripPrintBulking";
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
  useCompany,
  useProduct,
  useDriver,
  useWeighbridge,
  useTransportVehicle,
  useApp,
  useStorageTank,
} from "../../../../../hooks";

const LBNBackdateDispatchView = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const transactionAPI = TransactionAPI();
  const { wb } = useWeighbridge();
  const { id } = useParams();
  const { WBMS, PRODUCT_TYPES } = useConfig();
  const {
    openedTransaction,
    clearWbTransaction,
    setOpenedTransaction,
    setWbTransaction,
    clearOpenedTransaction,
  } = useTransaction();
  const { useGetDriversQuery } = useDriver();
  const { useGetCompaniesQuery } = useCompany();
  const { useGetTransportVehiclesQuery } = useTransportVehicle();
  const { setSidebar } = useApp();
  const [selectedOption, setSelectedOption] = useState(0);

  const { data: dtCompany } = useGetCompaniesQuery();
  const { data: dtDrivers } = useGetDriversQuery();
  const { data: dtTransport, error } = useGetTransportVehiclesQuery();

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

  const [originWeightNetto, setOriginWeightNetto] = useState(0);
  const [destinationWeightNetto, setDestinationWeightNetto] = useState(0);

  const [openedView, setOpenedView] = useState(false);
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
        setOpenedView(res.data.transaction);
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
      openedView.originWeighInKg < WBMS.WB_MIN_WEIGHT ||
      openedView.originWeighOutKg < WBMS.WB_MIN_WEIGHT
    ) {
      setOriginWeightNetto(0);
    } else {
      let total = Math.abs(
        openedView.originWeighInKg - openedView.originWeighOutKg
      );
      setOriginWeightNetto(total);
    }

    if (
      openedView.destinationWeighInKg < WBMS.WB_MIN_WEIGHT ||
      openedView.destinationWeighOutKg < WBMS.WB_MIN_WEIGHT
    ) {
      setDestinationWeightNetto(0);
    } else {
      let total = Math.abs(
        openedView.destinationWeighInKg - openedView.destinationWeighOutKg
      );
      setDestinationWeightNetto(total);
    }
  }, [openedView]);

  return (
    <Box>
      <Header
        title="Transaksi BULKING"
        subtitle="Data Timbangan BackDate"
      />
      {openedView && (
        <Formik
          // enableReinitialize

          initialValues={openedView}
          // isInitialValid={false}
        >
          {(props) => {
            const { values, isValid, setFieldValue, handleChange } = props;
            // console.log("Formik props:", props);

            return (
              <Form>
                <Box sx={{ display: "flex", mt: 3, justifyContent: "end" }}>
                  {values.progressStatus === 31 && (
                    <BonTripPrint dtTrans={{ ...values }} sx={{ mx: 1 }} />
                  )}
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
                      </Grid>{" "}
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
                        name="bonTripRef"
                        label="NO BONTRIP ASAL"
                        type="text"
                        component={TextField}
                        variant="outlined"
                        required
                        size="small"
                        fullWidth
                        inputProps={{ readOnly: true }}
                        sx={{ mb: 2, backgroundColor: "whitesmoke" }}
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
                        sx={{ backgroundColor: "whitesmoke", mb: 2 }}
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
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
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
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
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
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
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
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
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
                            isReadOnly={true}
                            sx={{ mt: 2 }}
                            backgroundColor="whitesmoke"
                            siteId={WBMS.SITE.refId}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* <Grid item xs={12} sm={6} lg={3}>
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
                        </Grid> */}

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
                            inputProps={{ readOnly: true }}
                            value={
                              values?.destinationWeighOutKg > 0
                                ? values.destinationWeighOutKg.toFixed(2)
                                : "0.00"
                            }
                          />
                        </Grid>

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
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Form>
            );
          }}
        </Formik>
      )}
    </Box>
  );
};

export default LBNBackdateDispatchView;
