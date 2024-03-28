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
import CancelConfirmation from "components/CancelConfirmation";
import {
  CompanyACP,
  DriverACP,
  ProductACP,
  TransportVehicleACP,
} from "components/FormManualEntry";
import {
  TransportVehicleAC,
  DriverAC,
  CompanyAC,
  CertificateSelect,
  StorageTankSelect,
} from "components/FormikMUI";

import { TransactionAPI } from "../../../../../../apis";

import {
  useAuth,
  useConfig,
  useTransaction,
  useWeighbridge,
  useApp,
  useProduct,
  useStorageTank,
} from "../../../../../../hooks";

const TransactionPksRejectBulkingIn = (props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const transactionAPI = TransactionAPI();

  const { user } = useAuth();
  const { WBMS } = useConfig();
  const { urlPrev, setUrlPrev, setSidebar } = useApp();
  const { openedTransaction, setOpenedTransaction, clearOpenedTransaction } =
    useTransaction();
  const { wb } = useWeighbridge();

  const [originWeighNetto, setOriginWeighNetto] = useState(0);
  const [returnWeighNetto, setReturnWeighNetto] = useState(0);
  const [dtTrx, setDtTrx] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const { useFindManyStorageTanksQuery } = useStorageTank();
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
      productGroupId: 1,
    },
  };
  const { data: dtProduct } = useFindManyProductQuery(productFilter);

  const validationSchema = yup.object().shape({
    // tidak bisa dari sini, karena ada pengaruh dari external form
    // originWeighOutKg: yup.number().required("Wajib diisi.").min(WBMS.WB_MIN_WEIGHT),
    // originSourceStorageTankId: yup.string().required("Wajib diisi."),
    // loadedSeal1: yup.string().required("Wajib diisi."),
    // loadedSeal2: yup.string().required("Wajib diisi."),
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
      const selected = dtStorageTank.records.find(
        (item) => item.id === values.originSourceStorageTankId
      );

      if (selected) {
        tempTrans.originSourceStorageTankCode = selected.code || "";
        tempTrans.originSourceStorageTankName = selected.name || "";
      }

      if (WBMS.WB_STATUS === true) {
        tempTrans.returnWeighOutKg = wb.weight;
      } else if (WBMS.WB_STATUS === false) {
        tempTrans.isManualTonase = 1;
      }

      tempTrans.rspoSccModel = parseInt(tempTrans.rspoSccModel);
      tempTrans.isccSccModel = parseInt(tempTrans.isccSccModel);
      tempTrans.ispoSccModel = parseInt(tempTrans.ispoSccModel);

      tempTrans.isManualEntry = 1;
      tempTrans.typeTransaction = 5;
      tempTrans.progressStatus = 31;
      tempTrans.deliveryStatus = 36;
      tempTrans.deliveryDate = moment(tempTrans.deliveryDate).toISOString();
      tempTrans.returnWeighOutOperatorName = user.name.toUpperCase();
      tempTrans.returnWeighOutTimestamp = moment().toDate();
      tempTrans.dtTransaction = moment()
        .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
        .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
        .format();

      const data = { tempTrans };

      const response = await transactionAPI.updateById(tempTrans.id, {
        ...tempTrans,
      });

      if (!response.status) throw new Error(response?.message);

      clearOpenedTransaction();
      setIsLoading(false);

      const id = response?.data?.transaction?.id;
      navigate(`/wb/transactions/pks/dispatch-reject-bulking-out-view/${id}`);

      setIsLoading(false);
      toast.success("Transaksi REJECT WB-OUT telah tersimpan.");
    } catch (error) {
      setIsLoading(false);
      toast.error(`${error.message}.`);
    }
  };

  useEffect(() => {
    setDtTrx(moment().format(`DD/MM/YYYY - HH:mm:ss`));
    setSidebar({ selected: "Transaksi WB LBN" });

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
      <Header title="TRANSAKSI BULKING" subtitle="TIMBANG REJECT WB-OUT" />
      {openedTransaction && (
        <Formik
          enableReinitialize
          onSubmit={handleFormikSubmit}
          initialValues={openedTransaction}
          validationSchema={validationSchema}
          // isInitialValid={false}
        >
          {(props) => {
            const { values, isValid, submitForm, dirty, setFieldValue } = props;
            // console.log("Formik props:", props);

            return (
              <Form>
                <Box sx={{ display: "flex", mt: 3, justifyContent: "end" }}>
                  {WBMS.WB_STATUS === true && (
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ backgroundColor: "darkred" }}
                      disabled={
                        !(
                          isValid &&
                          wb?.isStable &&
                          wb?.weight > WBMS.WB_MIN_WEIGHT
                        )
                      }
                    >
                      SIMPAN
                    </Button>
                  )}
                  {WBMS.WB_STATUS === false && (
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ backgroundColor: "darkred" }}
                      disabled={
                        !(
                          isValid &&
                          dirty &&
                          values.returnWeighOutKg > WBMS.WB_MIN_WEIGHT
                        )
                      }
                    >
                      SIMPAN
                    </Button>
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
                            value={user.name.toUpperCase()}
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
                            value={dtTrx || "-"}
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

                        {WBMS.WB_STATUS === true && (
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
                                wb?.weight > 0 ? wb.weight.toFixed(2) : "0.00"
                              }
                            />
                          </Grid>
                        )}
                        {WBMS.WB_STATUS === false && (
                          <Grid item xs={6}>
                            <Field
                              name="returnWeighOutKg"
                              label="Berat WB-OUT"
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
                                values?.returnWeighOutKg > 0
                                  ? values.returnWeighOutKg
                                  : "0"
                              }
                            />
                          </Grid>
                        )}
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

export default TransactionPksRejectBulkingIn;
