import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  Divider,
  Paper,
  TextField as TextFieldMUI,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import { TextField, Autocomplete } from "formik-mui";
import * as yup from "yup";
import { toast } from "react-toastify";
import moment from "moment";
import Header from "../../../../components/layout/signed/HeaderTransaction";
import BonTripPrint from "../../../../components/BontripManualEntry";

import { TransactionAPI } from "../../../../apis";

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
} from "../../../../hooks";

const PksManualEntryOthersView = (props) => {
  // const {
  //   ProductId,
  //   ProductName,
  //   ProductCode,
  //   TransporterId,
  //   TransporterCompanyName,
  //   TransporterCompanyCode,
  //   PlateNo,
  // } = props;
  const navigate = useNavigate();
  const { user } = useAuth();
  const transactionAPI = TransactionAPI();
  const { wb } = useWeighbridge();
  const { id } = useParams();
  const { WBMS, SCC_MODEL } = useConfig();
  const {
    openedTransaction,
    wbTransaction,
    setOpenedTransaction,
    clearWbTransaction,
    setWbTransaction,
    clearOpenedTransaction,
  } = useTransaction();
  const { useGetDriversQuery } = useDriver();
  const { useGetCompaniesQuery } = useCompany();
  const { useGetProductsQuery } = useProduct();
  const { useGetTransportVehiclesQuery } = useTransportVehicle();
  const { setSidebar } = useApp();

  const [originWeighNetto, setOriginWeighNetto] = useState(0);

  const { data: dtCompany } = useGetCompaniesQuery();
  const { data: dtProduct } = useGetProductsQuery();
  const { data: dtDrivers } = useGetDriversQuery();
  const { data: dtTransport, error } = useGetTransportVehiclesQuery();

  const [canSubmit, setCanSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [dtTrx, setDtTrx] = useState(null);

  // const { values, setValues } = useForm({
  //   ...TransactionAPI.InitialData,
  // });

  const validationSchema = yup.object().shape({
    // tidak bisa dari sini, karena ada pengaruh dari external form
    // originWeighOutKg: yup.number().required("Wajib diisi.").min(WBMS.WB_MIN_WEIGHT),
    // originSourceStorageTankId: yup.string().required("Wajib diisi."),
    // loadedSeal1: yup.string().required("Wajib diisi."),
    // loadedSeal2: yup.string().required("Wajib diisi."),
  });

  // const handleChange = (event) => {
  //   const { name, value } = event.target;
  //   setValues((preValues) => ({
  //     ...preValues,
  //     [name]: value,
  //   }));
  // };

  const handleClose = () => {
    clearOpenedTransaction();

    navigate("/wb/transactions");
  };

  //   const handleFormikSubmit = async (values) => {
  //     let tempTrans = { ...values };

  //     setIsLoading(true);

  //     try {
  //       tempTrans.progressStatus = 40;
  //       tempTrans.originWeighOutKg = wb.weight;
  //       tempTrans.originWeighOutTimestamp = moment().toDate();
  //       tempTrans.originWeighOutOperatorName = user.name.toUpperCase();
  //       tempTrans.dtTransaction = moment()
  //         .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
  //         .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
  //         .format();

  //       const response = await transactionAPI.updateById(tempTrans.id, { ...tempTrans });

  //       if (!response.status) throw new Error(response?.message);

  //       clearWbTransaction();
  //       setIsLoading(false);

  //       toast.success(`Transaksi WB-OUT telah tersimpan.`);
  //     } catch (error) {
  //       return toast.error(`${error.message}.`);
  //     }
  //   };

  //   useEffect(() => {
  //     setDtTrx(moment().format(`DD/MM/YYYY - HH:mm:ss`));
  //     setSidebar({ selected: "Transaksi WB PKS" });

  //     return () => {
  //       // console.clear();
  //     };
  //   }, []);

  //   //validasi form
  //   // const validateForm = () => {
  //   //   return values.bonTripNo && values.driverName && ProductName && TransporterCompanyName && PlateNo;
  //   // };

  //weight wb
  //   useEffect(() => {
  //     setWbTransaction({ originWeighOutKg: wb.weight });
  //   }, [wb.weight]);

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
      <Header title="TANSAKSI PKS" subtitle="DATA TIMBANGAN MANUAL ENTRY" />
      {openedTransaction && (
        <Formik
          // enableReinitialize
          //   onSubmit={handleFormikSubmit}
          initialValues={openedTransaction}
          validationSchema={validationSchema}
          // isInitialValid={false}
        >
          {(props) => {
            const { values, isValid, handleChange, setFieldValue } = props;
            // console.log("Formik props:", props);

            return (
              <Form>
                <Box sx={{ display: "flex", mt: 3, justifyContent: "end" }}>
                  {/* <Button
                    type="submit"
                    variant="contained"
                    sx={{mr:1}}
                    disabled={!(isValid && wb?.isStable && wb?.weight > WBMS.WB_MIN_WEIGHT)}
                  >
                    SIMPAN
                  </Button> */}
                  <BonTripPrint dtTrans={{ ...values }} sx={{ mx: 1 }} />
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
                        name="transportVehiclePlateNo"
                        component={Autocomplete}
                        variant="outlined"
                        fullWidth
                        freeSolo
                        readOnly={true}
                        disableClearable
                        options={dtTransport?.records || []}
                        value={
                          dtTransport?.records?.find((item) => item.plateNo === values?.transportVehiclePlateNo) || {
                            plateNo: values?.transportVehiclePlateNo,
                          }
                        }
                        getOptionLabel={(option) => (option ? option.plateNo : "")}
                        // onInputChange={(event, InputValue, reason) => {
                        //   if (reason !== "reset") {
                        //     setFieldValue("transportVehiclePlateNo", InputValue);
                        //   }
                        // }}
                        renderInput={(params) => (
                          <TextFieldMUI
                            {...params}
                            label="Nomor Plat"
                            name="transportVehiclePlateNo"
                            sx={{ backgroundColor: "whitesmoke" }}
                            size="small"
                          />
                        )}
                      />

                      <Field
                        name="transporterCompanyName"
                        component={Autocomplete}
                        variant="outlined"
                        fullWidth
                        options={dtCompany?.records || []}
                        getOptionLabel={(option) => `[${option.code}] - ${option.name}`}
                        value={dtCompany?.records?.find((item) => item.id === values.transporterCompanyId) || null}
                        // onChange={(event, newValue) => {
                        //   setFieldValue("transporterCompanyName", newValue ? newValue.name : "");
                        //   setFieldValue("transporterCompanyId", newValue ? newValue.id : "");
                        //   setFieldValue("transporterCompanyCode", newValue ? newValue.code : "");
                        // }}
                        readOnly={true}
                        renderInput={(params) => (
                          <TextFieldMUI
                            {...params}
                            name="transporterCompanyName"
                            label="Cust/Vendor transport"
                            size="small"
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                          />
                        )}
                      />

                      <Field
                        name="productName"
                        component={Autocomplete}
                        variant="outlined"
                        fullWidth
                        // freeSolo
                        // disableClearable
                        options={(dtProduct?.records || []).filter(
                          (option) => !["cpo", "pko"].includes(option.name.toLowerCase()),
                        )}
                        getOptionLabel={(option) => `[${option.code}] - ${option.name}`}
                        value={dtProduct?.records?.find((item) => item.id === values.productId) || null}
                        // onChange={(event, newValue) => {
                        //   setFieldValue("transportVehicleProductName", newValue ? newValue.name : "");
                        //   setFieldValue("transportVehicleId", newValue ? newValue.id : "");
                        //   setFieldValue("transportVehicleProductCode", newValue ? newValue.code : "");
                        //   setFieldValue("productName", newValue ? newValue.name : "");
                        //   setFieldValue("productId", newValue ? newValue.id : "");
                        //   setFieldValue("productCode", newValue ? newValue.code : "");
                        // }}
                        readOnly={true}
                        renderInput={(params) => (
                          <TextFieldMUI
                            {...params}
                            name="productName"
                            label="Nama Produk"
                            size="small"
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                      <Grid container columnSpacing={1}>
                        <Grid item xs={12}>
                          <Divider>DATA SUPIR & MUATAN</Divider>
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ backgroundColor: "whitesmoke", mt: 2 }}
                            label="NO BONTRIP"
                            name="bonTripNo"
                            component={TextField}
                            value={values?.bonTripNo || ""}
                            inputProps={{ readOnly: true }}
                          />

                          <Field
                            name="driverName"
                            component={Autocomplete}
                            variant="outlined"
                            fullWidth
                            freeSolo
                            disableClearable
                            options={dtDrivers?.records || []}
                            value={
                              dtDrivers?.records?.find((item) => item.name === values?.driverName) || {
                                name: values?.driverName,
                              }
                            }
                            getOptionLabel={(option) => option.name}
                            // onInputChange={(event, InputValue, reason) => {
                            //   if (reason !== "reset") {
                            //     setFieldValue("driverName", InputValue);
                            //   }
                            // }}

                            readOnly={true}
                            renderInput={(params) => (
                              <TextFieldMUI
                                {...params}
                                name="driverName"
                                size="small"
                                label="Nama Supir"
                                sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                              />
                            )}
                          />

                          <Field
                            name="afdeling"
                            label="Afdeling"
                            type="text"
                            variant="outlined"
                            size="small"
                            component={TextField}
                            fullWidth
                            value={values?.afdeling}
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                          />
                          <Field
                            name="kebun"
                            label="Kebun"
                            type="text"
                            variant="outlined"
                            size="small"
                            fullWidth
                            component={TextField}
                            value={values?.kebun}
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                          />
                          <Field
                            name="blok"
                            label="Blok"
                            type="text"
                            variant="outlined"
                            size="small"
                            component={TextField}
                            fullWidth
                            value={values?.blok}
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                          />
                          <Field
                            name="janjang"
                            label="Janjang/Sak"
                            type="number"
                            variant="outlined"
                            size="small"
                            component={TextField}
                            fullWidth
                            value={values?.janjang}
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                          />
                          <Field
                            name="npb"
                            label="NPB/BE"
                            type="text"
                            variant="outlined"
                            size="small"
                            component={TextField}
                            fullWidth
                            value={values?.npb}
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                          />
                          <Field
                            name="tahun"
                            label="Tahun"
                            type="number"
                            variant="outlined"
                            size="small"
                            component={TextField}
                            fullWidth
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                          />
                          {/* 
            <Field
              name="sptbs"
              label="SPTBS"
              type="text"
              variant="outlined"
              size="small"
              component={TextField}
              fullWidth
              
              value={values?.sptbs}
              sx={{ mt: 2 }}
               inputProps={{
                style: { textTransform: "uppercase" },
              }}
            /> */}
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
                            type="number"
                            variant="outlined"
                            component={TextField}
                            size="small"
                            fullWidth
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                            }}
                            label="BERAT MASUK - IN"
                            name="originWeighInKg"
                            value={values?.originWeighInKg > 0 ? values.originWeighInKg.toFixed(2) : "0.00"}
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
                            label="Waktu WB-IN"
                            name="originWeighInTimestamp"
                            inputProps={{ readOnly: true }}
                            value={
                              values?.originWeighInTimestamp
                                ? moment(values.originWeighInTimestamp).local().format(`DD/MM/YYYY - HH:mm:ss`)
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
                              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                            }}
                            label="BERAT KELUAR - OUT"
                            name="originWeighOutKg"
                            value={values?.originWeighOutKg > 0 ? values.originWeighOutKg.toFixed(2) : "0.00"}
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
                            name="originWeighOutTimestamp"
                            inputProps={{ readOnly: true }}
                            value={
                              values?.originWeighOutTimestamp
                                ? moment(values.originWeighOutTimestamp).local().format(`DD/MM/YYYY - HH:mm:ss`)
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
                            label="Operator WB-IN"
                            name="originWeighInOperatorName"
                            value={values?.originWeighInOperatorName}
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
                            sx={{ mt: 2, mb: 3, backgroundColor: "whitesmoke" }}
                            label="Operator WB-OUT"
                            value={values?.originWeighOutOperatorName}
                            name="originWeighOutOperatorName"
                            inputProps={{ readOnly: true, style: { textTransform: "uppercase" } }}
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
                            sx={{ mt: 3, backgroundColor: "whitesmoke" }}
                            InputProps={{
                              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                            }}
                            label="TOTAL"
                            name="weightNetto"
                            value={originWeighNetto > 0 ? originWeighNetto.toFixed(2) : "0.00"}
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

export default PksManualEntryOthersView;