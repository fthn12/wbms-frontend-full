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
import { TextField, Select } from "formik-mui";
import * as yup from "yup";

import moment from "moment";
import numeral from "numeral";

import Header from "../../../../../../components/layout/signed/HeaderTransaction";
import ProgressStatus from "../../../../../../components/ProgressStatus";
import QRCodeViewer from "../../../../../../components/QRCodeViewer";

import {
  TransportVehicleAC,
  DriverAC,
  CompanyAC,
  SiteSelect,
  CertificateSelect,
  StorageTankSelect,
} from "../../../../../../components/FormikMUI";

import { TransactionAPI } from "../../../../../../apis";

import {
  useAuth,
  useConfig,
  useTransaction,
  useApp,
  useProduct,
} from "../../../../../../hooks";
import { MenuItem } from "react-pro-sidebar";
import {
  CompanyACP,
  DriverACP,
  ProductACP,
  TransportVehicleACP,
} from "components/FormManualEntry";

const TransactionPksRejectBulkingInView = (props) => {
  const navigate = useNavigate();

  const { id } = useParams();

  const transactionAPI = TransactionAPI();

  const { user } = useAuth();
  const { WBMS, PRODUCT_TYPES } = useConfig();
  const { urlPrev, setUrlPrev } = useApp();
  const { openedTransaction, setOpenedTransaction, clearOpenedTransaction } =
    useTransaction();
  const [dtTypeProduct] = useState(PRODUCT_TYPES);
  const [selectedOption, setSelectedOption] = useState(0);
  const [originWeighNetto, setOriginWeighNetto] = useState(0);
  const [returnWeighNetto, setReturnWeighNetto] = useState(0);

  const [isReadOnly, setIsReadOnly] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = yup.object().shape({
    // originWeighInKg: yup.number().required("Wajib diisi.").min(WBMS.WB_MIN_WEIGHT),
    // originSourceStorageTankId: yup.string().required("Wajib diisi."),
    // loadedSeal1: yup.string().required("Wajib diisi."),
    // loadedSeal2: yup.string().required("Wajib diisi."),
    returnWeighInRemark: yup
      .string()
      .required("Wajib diisi.")
      .min(11, "Alasan REJECT (PENGEMBALIAN) harus melebihi 10 karakter.")
      .max(
        500,
        "Alasan REJECT (PENGEMBALIAN) tidak boleh melebihi 500 karakter."
      ),
  });

  const { useFindManyProductQuery } = useProduct();
  const productFilter = {
    where: {
      productGroupId: selectedOption,
    },
  };

  const { data: dtProduct } = useFindManyProductQuery(productFilter);

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
      const response = await transactionAPI.updateById(tempTrans.id, {
        ...tempTrans,
      });

      if (!response.status) throw new Error(response?.message);

      clearOpenedTransaction();
      setIsLoading(false);

      toast.success(`Update Transaksi REJECT WB-IN telah tersimpan.`);

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
    if (
      openedTransaction?.returnWeighInKg < WBMS.WB_MIN_WEIGHT ||
      openedTransaction?.returnWeighOutKg < WBMS.WB_MIN_WEIGHT
    ) {
      setReturnWeighNetto(0);
    } else {
      let total = Math.abs(
        openedTransaction?.returnWeighInKg - openedTransaction?.returnWeighOutKg
      );
      setReturnWeighNetto(total);
    }
  }, [openedTransaction]);

  return (
    <Box>
      <Header title="TRANSAKSI PKS" subtitle="TIMBANG REJECT WB-IN" />
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
              submitForm,
              resetForm,
              isValid,
              dirty,
              handleChange,
            } = props;
            // console.log("Formik props:", props)

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
                  <Button
                    variant="contained"
                    disabled={isReadOnly ? false : !(isValid && dirty)}
                    onClick={handleSubmit}
                  >
                    {isReadOnly ? "EDIT" : "SIMPAN"}
                  </Button>
                  {/* <QRCodeViewer
                    progressStatus={values.progressStatus}
                    deliveryOrderId={values.deliveryOrderId}
                    type="form"
                    disabled={!isReadOnly}
                  >
                    TAMPILKAN QR
                  </QRCodeViewer> */}
                  <Button
                    variant="contained"
                    sx={{ ml: 1 }}
                    onClick={handleReset}
                  >
                    {isReadOnly ? "TUTUP" : "BATAL PERUBAHAN"}
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
                        fullWidth
                        sx={{ backgroundColor: "whitesmoke", mb: 2 }}
                        size="small"
                        label="NO BONTRIP"
                        name="bonTripNo"
                        component={TextField}
                        inputProps={{ readOnly: true }}
                      />
                      {/* <Field
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
                      </Field> */}
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
                        type="date"
                        variant="outlined"
                        component={TextField}
                        size="small"
                        fullWidth
                        required={true}
                        sx={{ mb: 2, backgroundColor: "whitesmoke" }}
                        label="TANGGAL Delivery"
                        name="deliveryDate"
                        inputProps={{ readOnly: true }}
                        value={moment(values?.deliveryDate).format(
                          "YYYY-MM-DD"
                        )}
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
                          <Divider>Segel Tangki Bongkar</Divider>
                        </Grid>
                        <Grid item xs={6}>
                          <Field
                            name="returnUnloadedSeal1"
                            label="Segel BONGKAR Mainhole 1"
                            type="text"
                            // required={true}
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
                            name="returnUnloadedSeal2"
                            label="Segel BONGKAR Valve 1"
                            type="text"
                            // required={true}
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
                            name="returnUnloadedSeal3"
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
                            name="returnUnloadedSeal4"
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
                      </Grid>
                    </Grid>

                    <Grid item xs={12} sm={6} lg={3}>
                      <Grid container columnSpacing={1}>
                        <Grid item xs={12}>
                          <Divider>DATA TIMBANG ASAL</Divider>
                        </Grid>
                        <Grid item xs={6}>
                          <Field
                            name="originWeighInOperatorName"
                            label="Operator WB-IN"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            required
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                            value={values.originWeighInOperatorName || "-"}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Field
                            name="originWeighOutOperatorName"
                            label="Operator WB-OUT"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            required
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                            value={values.originWeighOutOperatorName || "-"}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Field
                            name="originWeighInTimestamp"
                            label="Waktu WB-IN"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            required
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
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
                            name="originWeighOutTimestamp"
                            label="Waktu WB-OUT"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            required
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
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
                            name="originWeighInKg"
                            label="Berat WB-IN"
                            type="number"
                            component={TextField}
                            variant="outlined"
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
                              values?.originWeighInKg > 0
                                ? values.originWeighInKg.toFixed(2)
                                : "0.00"
                            }
                            inputProps={{ readOnly: true }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Field
                            name="originWeighOutKg"
                            label="Berat WB-OUT"
                            type="number"
                            component={TextField}
                            variant="outlined"
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
                              values?.originWeighOutKg > 0
                                ? values.originWeighOutKg.toFixed(2)
                                : "0.00"
                            }
                            inputProps={{ readOnly: true }}
                          />
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 2 }}>
                          <Divider>TOTAL</Divider>
                        </Grid>

                        <Grid item xs={12}>
                          <Field
                            name="originWeighNetto"
                            label="TOTAL"
                            type="number"
                            component={TextField}
                            variant="outlined"
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
                              originWeighNetto > 0
                                ? originWeighNetto.toFixed(2)
                                : "0.00"
                            }
                            inputProps={{ readOnly: true }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} sm={6} lg={3}>
                      <Grid container columnSpacing={1}>
                        <Grid item xs={12}>
                          <Divider>DATA TIMBANG REJECT</Divider>
                        </Grid>
                        <Grid item xs={6}>
                          <Field
                            name="returnWeighInOperatorName"
                            label="Operator WB-IN"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            required
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                            value={values.returnWeighInOperatorName || "-"}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Field
                            name="returnWeighOutOperatorName"
                            label="Operator WB-OUT"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            required
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                            value={values.returnWeighOutOperatorName || "-"}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Field
                            name="returnWeighInTimestamp"
                            label="Waktu WB-IN"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            required
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                            value={
                              values?.returnWeighInTimestamp
                                ? moment(values.returnWeighInTimestamp)
                                    .local()
                                    .format(`DD/MM/YYYY - HH:mm:ss`)
                                : "-"
                            }
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <Field
                            name="returnWeighOutTimestamp"
                            label="Waktu WB-OUT"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            required
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                            value={
                              values?.returnWeighOutTimestamp
                                ? moment(values.returnWeighOutTimestamp)
                                    .local()
                                    .format(`DD/MM/YYYY - HH:mm:ss`)
                                : "-"
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Field
                            name="returnWeighInKg"
                            label="Berat WB-IN"
                            type="number"
                            component={TextField}
                            variant="outlined"
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
                            inputProps={{ readOnly: true }}
                            value={
                              values?.returnWeighInKg > 0
                                ? values.returnWeighInKg.toFixed(2)
                                : "0.00"
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Field
                            name="returnWeighOutKg"
                            label="Berat WB-OUT"
                            type="number"
                            component={TextField}
                            variant="outlined"
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
                            inputProps={{ readOnly: true }}
                            value={
                              values?.returnWeighOutKg > 0
                                ? values.returnWeighOutKg.toFixed(2)
                                : "0.00"
                            }
                          />
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 2 }}>
                          <Divider>TOTAL REJECT</Divider>
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            name="returnWeighNetto"
                            label="NETTO"
                            type="number"
                            component={TextField}
                            variant="outlined"
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
                            inputProps={{ readOnly: true }}
                            value={
                              returnWeighNetto > 0
                                ? returnWeighNetto.toFixed(2)
                                : "0.00"
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 2 }}>
                          <Divider>Catatan</Divider>
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            name="returnWeighInRemark"
                            label="Alasan REJECT (PENGEMBALIAN)"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            required
                            multiline
                            rows={5.4}
                            sx={{
                              mt: 2,
                              backgroundColor: isReadOnly
                                ? "whitesmoke"
                                : "lightyellow",
                            }}
                            inputProps={{ readOnly: isReadOnly }}
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

export default TransactionPksRejectBulkingInView;
