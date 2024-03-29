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
import * as Yup from "yup";

import moment from "moment";
import numeral from "numeral";

import Header from "../../../../../../components/layout/signed/HeaderTransaction";
import ProgressStatus from "../../../../../../components/ProgressStatus";
import CancelConfirmation from "components/CancelConfirmation";

import {
  TransportVehicleAC,
  DriverAC,
  CompanyAC,
  CertificateSelect,
  StorageTankSelect,
} from "../../../../../../components/FormikMUI";

import { TransactionAPI } from "../../../../../../apis";

import {
  useAuth,
  useConfig,
  useTransaction,
  useWeighbridge,
  useApp,
  useProduct,
} from "../../../../../../hooks";
import {
  CompanyACP,
  DriverACP,
  ProductACP,
  TransportVehicleACP,
} from "components/FormManualEntry";

const TransactionPksRejectBulkingIn = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const transactionAPI = TransactionAPI();
  const { wb } = useWeighbridge();
  const { user } = useAuth();
  const { WBMS, PRODUCT_TYPES } = useConfig();
  const { urlPrev, setUrlPrev, setSidebar } = useApp();
  const { wbTransaction, setWbTransaction, clearWbTransaction } =
    useTransaction();
  const [dtTypeProduct] = useState(PRODUCT_TYPES);
  const [selectedOption, setSelectedOption] = useState(0);
  const [originWeighNetto, setOriginWeighNetto] = useState(0);
  const [returnWeighNetto, setReturnWeighNetto] = useState(0);
  const [dtTrx, setDtTrx] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    transportVehicleId: Yup.string().required("Wajib diisi"),
    transporterCompanyId: Yup.string().required("Wajib diisi"),
    productId: Yup.string().required("Wajib diisi"),
    driverId: Yup.string().required("Wajib diisi"),
    bonTripRef: Yup.string().required("Wajib diisi"),
    deliveryOrderNo: Yup.string().required("Wajib diisi"),
    deliveryDate: Yup.string().required("Wajib diisi"),
  });

  const { useFindManyProductQuery } = useProduct();

  const productFilter = {
    where: {
      productGroupId: 1,
    },
  };
  const { data: dtProduct } = useFindManyProductQuery(productFilter);

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
      if (WBMS.WB_STATUS === true) {
        wbTransaction.returnWeighInKg = wb.weight;
      } else if (WBMS.WB_STATUS === false) {
        wbTransaction.isManualTonase = 1;
      }

      wbTransaction.typeSite = 1;
      wbTransaction.isManualEntry = 1;
      wbTransaction.typeTransaction = 5;
      wbTransaction.deliveryStatus = 26;
      wbTransaction.deliveryDate = moment(
        wbTransaction.deliveryDate
      ).toISOString();
      wbTransaction.returnWeighInTimestamp = moment().toDate();
      wbTransaction.returnWeighInOperatorName = user.name.toUpperCase();
      wbTransaction.dtTransaction = moment()
        .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
        .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
        .format();

      const data = { wbTransaction: { ...wbTransaction } };

      const response = await transactionAPI.eDispatchPksRejectBulkingInAfter(
        data
      );

      if (!response.status) throw new Error(response?.message);

      clearWbTransaction();
      setIsLoading(false);

      const id = response?.data?.transaction?.id;
      navigate(`/wb/transactions/pks/dispatch-reject-bulking-in-view/${id}`);

      setIsLoading(false);
      toast.success("Transaksi REJECT WB-IN telah tersimpan.");
    } catch (error) {
      setIsLoading(false);
      toast.error(`${error.message}.`);
    }
  };

  useEffect(() => {
    setWbTransaction({
      bonTripNo: `${WBMS.BT_SITE_CODE}${WBMS.BT_SUFFIX_TRX}${moment().format(
        "YYMMDDHHmmss"
      )}`,
    });
  }, []);

  useEffect(() => {
    setDtTrx(moment().format(`DD/MM/YYYY - HH:mm:ss`));
    setSidebar({ selected: "Transaksi WB LBN" });

    return () => {
      // console.clear();
    };
  }, []);

  useEffect(() => {
    if (
      wbTransaction?.originWeighInKg < WBMS.WB_MIN_WEIGHT ||
      wbTransaction?.originWeighOutKg < WBMS.WB_MIN_WEIGHT
    ) {
      setOriginWeighNetto(0);
    } else {
      let total = Math.abs(
        wbTransaction?.originWeighInKg - wbTransaction?.originWeighOutKg
      );
      setOriginWeighNetto(total);
    }
    if (
      wbTransaction?.returnWeighInKg < WBMS.WB_MIN_WEIGHT ||
      wbTransaction?.returnWeighOutKg < WBMS.WB_MIN_WEIGHT
    ) {
      setReturnWeighNetto(0);
    } else {
      let total = Math.abs(
        wbTransaction?.returnWeighInKg - wbTransaction?.returnWeighOutKg
      );
      setReturnWeighNetto(total);
    }
  }, [wbTransaction]);

  return (
    <Box>
      <Header title="TRANSAKSI PKS" subtitle="TIMBANG REJECT WB-IN" />
      {wbTransaction && (
        <Formik
          enableReinitialize
          onSubmit={handleFormikSubmit}
          initialValues={wbTransaction}
          validationSchema={validationSchema}
          // isInitialValid={false}
        >
          {(props) => {
            const { values, isValid, submitForm, setFieldValue, dirty } = props;
            // console.log("Formik props:", props);

            const handleReject = (rejectReason) => {
              if (
                rejectReason.trim().length <= 10 ||
                rejectReason.trim().length > 500
              )
                return toast.error(
                  "Alasan REJECT (PENGEMBALIAN) harus melebihi 10 karakter, dan maksimal 500 karakter."
                );

              setFieldValue("returnWeighInRemark", rejectReason);

              submitForm();
            };

            return (
              <Form>
                <Box sx={{ display: "flex", mt: 3, justifyContent: "end" }}>
                  {WBMS.WB_STATUS === true && (
                    <CancelConfirmation
                      title="Alasan REJECT (PENGEMBALIAN)"
                      caption="SIMPAN"
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
                  )}
                  {WBMS.WB_STATUS === false && (
                    <CancelConfirmation
                      title="Alasan REJECT (PENGEMBALIAN)"
                      caption="SIMPAN"
                      content="Anda yakin melakukan REJECT (PENGEMBALIAN) transaksi WB ini? Berikan keterangan yang cukup."
                      onClose={handleReject}
                      isDisabled={
                        !(
                          isValid &&
                          dirty &&
                          values.returnWeighInKg > WBMS.WB_MIN_WEIGHT
                        )
                      }
                      sx={{ ml: 1, backgroundColor: "darkred" }}
                    />
                  )}
                  <Button
                    variant="contained"
                    sx={{ ml: 1 }}
                    onClick={handleClose}
                  >
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
                        // inputProps={{ readOnly: true }}
                        sx={{ mb: 2, backgroundColor: "lightyellow" }}
                      />

                      <Field
                        type="date"
                        variant="outlined"
                        component={TextField}
                        size="small"
                        fullWidth
                        required={true}
                        sx={{ mb: 2, backgroundColor: "lightyellow" }}
                        label="TANGGAL Delivery"
                        name="deliveryDate"
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
                        // inputProps={{ readOnly: true }}
                        sx={{ mb: 2, backgroundColor: "lightyellow" }}
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
                            sx={{ mt: 2, backgroundColor: "lightyellow" }}
                            // inputProps={{ readOnly: true }}
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
                            sx={{ mt: 2, backgroundColor: "lightyellow" }}
                            // inputProps={{ readOnly: true }}
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
                            sx={{ mt: 2, backgroundColor: "lightyellow" }}
                            // inputProps={{ readOnly: true }}
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
                            sx={{ mt: 2, backgroundColor: "lightyellow" }}
                            // inputProps={{ readOnly: true }}
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
                            value={user.name.toUpperCase()}
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
                            // value={
                            //   values?.returnWeighInTimestamp
                            //     ? moment(values.returnWeighInTimestamp).local().format(`DD/MM/YYYY - HH:mm:ss`)
                            //     : "-"
                            // }
                            value={dtTrx || "-"}
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
                            // value={moment().format(`DD/MM/YYYY - HH:mm:ss`)}
                          />
                        </Grid>{" "}
                        {WBMS.WB_STATUS === true && (
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
                              // value={values?.returnWeighInKg > 0 ? values.returnWeighInKg.toFixed(2) : "0.00"}
                              value={
                                wb?.weight > 0 ? wb.weight.toFixed(2) : "0.00"
                              }
                            />
                          </Grid>
                        )}
                        {WBMS.WB_STATUS === false && (
                          <Grid item xs={6}>
                            <Field
                              name="returnWeighInKg"
                              label="Berat WB-IN"
                              type="number"
                              component={TextField}
                              variant="outlined"
                              size="small"
                              fullWidth
                              sx={{ mt: 2, backgroundColor: "lightyellow" }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    kg
                                  </InputAdornment>
                                ),
                              }}
                              value={
                                values?.returnWeighInKg > 0
                                  ? values.returnWeighInKg
                                  : "0"
                              }
                            />
                          </Grid>
                        )}
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
                            // value={wb?.weight > 0 ? wb.weight.toFixed(2) : "0.00"}
                          />
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 2 }}>
                          <Divider>TOTAL</Divider>
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            name="returnWeighNetto"
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
                            inputProps={{ readOnly: true }}
                            value={
                              returnWeighNetto > 0
                                ? returnWeighNetto.toFixed(2)
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

export default TransactionPksRejectBulkingIn;
