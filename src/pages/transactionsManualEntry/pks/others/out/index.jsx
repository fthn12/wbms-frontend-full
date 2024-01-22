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
import { useForm } from "../../../../../utils/useForm";
import moment from "moment";
import Header from "../../../../../components/layout/signed/HeaderTransaction";
import BonTripPrint from "../../../../../components/BonTripPrint";
import {
  TransportVehicleAC,
  DriverAC,
  CompanyAC,
  SiteSelect,
  CertificateSelect,
  StorageTankSelect,
} from "../../../../../components/FormikMUI";
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
} from "../../../../../hooks";

const PksManualEntryOthersOut = (props) => {
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

  const handleFormikSubmit = async (values) => {
    let tempTrans = { ...values };

    // setIsLoading(true);

    try {
      const selectedProduct = dtProduct?.records.find(
        (item) => item.id === values.productId && values.transportVehicleId,
      );

      const selectedCompany = dtCompany?.records.find((item) => item.id === values.transporterCompanyId);

      if (selectedProduct) {
        values.transportVehicleProductCode = selectedProduct.code || "";
        values.transportVehicleProductName = selectedProduct.name || "";
        values.productCode = selectedProduct.code || "";
        values.productName = selectedProduct.name || "";
      } else if (selectedCompany) {
        values.transporterCompanyCode = selectedProduct.code || "";
        values.transporterCompanyName = selectedProduct.name || "";
      }

      tempTrans.progressStatus = 40;
      tempTrans.originWeighOutKg = wb.weight;
      tempTrans.originWeighOutTimestamp = moment().toDate();
      tempTrans.originWeighOutOperatorName = user.name.toUpperCase();
      tempTrans.dtTransaction = moment()
        .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
        .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
        .format();

      // const data = { ...tempTrans };

      const response = await transactionAPI.updateById(tempTrans.id, { ...tempTrans });

      if (!response.status) throw new Error(response?.message);

      clearWbTransaction();
      // setIsLoading(false);

      toast.success(`Transaksi WB-OUT telah tersimpan.`);
    } catch (error) {
      return toast.error(`${error.message}.`);
    }
  };

  useEffect(() => {
    setDtTrx(moment().format(`DD/MM/YYYY - HH:mm:ss`));
    setSidebar({ selected: "Transaksi WB PKS" });

    return () => {
      // console.clear();
    };
  }, []);

  //validasi form
  // const validateForm = () => {
  //   return values.bonTripNo && values.driverName && ProductName && TransporterCompanyName && PlateNo;
  // };

  //weight wb
  useEffect(() => {
    setWbTransaction({ originWeighOutKg: wb.weight });
  }, [wb.weight]);

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
      <Header title="Transaksi PKS Manual Entry" subtitle="TIMBANG WB-OUT" />
      {openedTransaction && (
        <Formik
          // enableReinitialize
          onSubmit={handleFormikSubmit}
          initialValues={openedTransaction}
          validationSchema={validationSchema}
          // isInitialValid={false}
        >
          {(props, handleChange) => {
            const { values, isValid } = props;
            // console.log("Formik props:", props);

            return (
              <Form>
                <Box sx={{ display: "flex", mt: 3, justifyContent: "end" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!(isValid && wb?.isStable && wb?.weight > WBMS.WB_MIN_WEIGHT)}
                  >
                    SIMPAN
                  </Button>
                  <BonTripPrint dtTrans={{ ...values }} isDisable={!isSubmitted} sx={{ mx: 1 }} />
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
                <Button
                  variant="contained"
                  sx={{ ml: 1 }}
                  onClick={() => {
                    console.log("Form:", props);
                  }}
                >
                  DEBUG
                </Button>

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
                        disableClearable
                        // getOptionLabel={(option) => option.plateNo}
                        options={dtTransport?.records.map((record) => record.name)}
                        renderInput={(params) => (
                          <TextFieldMUI {...params} label="Nomor Plat" name="transportVehiclePlateNo" size="small" />
                        )}
                      />

                      <Field
                        name="transporterCompanyName"
                        component={Autocomplete}
                        variant="outlined"
                        fullWidth
                        // freeSolo
                        // disableClearable
                        // getOption={(option) => option.name}
                        options={dtCompany?.records.map((record) => record.name)}
                        renderInput={(params) => (
                          <TextFieldMUI
                            {...params}
                            name="transporterCompanyName"
                            label="Cust/Vendor transport"
                            size="small"
                            sx={{ mt: 2 }}
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
                        // getOption={(option) => option.name}
                        options={dtProduct?.records.map((record) => record.name)}
                        renderInput={(params) => (
                          <TextFieldMUI
                            {...params}
                            name="productName"
                            label="Nama Produk"
                            size="small"
                            sx={{ mt: 2 }}
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
                            // getOptionLabel={(option) => option.plateNo}
                            options={dtDrivers?.records.map((record) => record.name)}
                            renderInput={(params) => (
                              <TextFieldMUI
                                {...params}
                                name="driverName"
                                size="small"
                                label="Nama Supir"
                                sx={{ mt: 2 }}
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
                            // onChange={handleChange}
                            value={values?.afdeling}
                            sx={{ mt: 2 }}
                            inputProps={{
                              style: { textTransform: "uppercase" },
                            }}
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
                            // onChange={handleChange}
                            sx={{ mt: 2 }}
                            inputProps={{
                              style: { textTransform: "uppercase" },
                            }}
                          />
                          <Field
                            name="blok"
                            label="Blok"
                            type="text"
                            variant="outlined"
                            size="small"
                            component={TextField}
                            fullWidth
                            // onChange={handleChange}
                            value={values?.blok}
                            sx={{ mt: 2 }}
                            inputProps={{
                              style: { textTransform: "uppercase" },
                            }}
                          />
                          <Field
                            name="janjang"
                            label="Janjang/Sak"
                            type="number"
                            variant="outlined"
                            size="small"
                            component={TextField}
                            fullWidth
                            // onChange={handleChange}
                            value={values?.janjang}
                            sx={{ mt: 2 }}
                          />
                          <Field
                            name="npb"
                            label="NPB/BE"
                            type="text"
                            variant="outlined"
                            size="small"
                            component={TextField}
                            fullWidth
                            // onChange={handleChange}
                            value={values?.npb}
                            sx={{ mt: 2 }}
                            inputProps={{
                              style: { textTransform: "uppercase" },
                            }}
                          />
                          <Field
                            name="tahun"
                            label="Tahun"
                            type="number"
                            variant="outlined"
                            size="small"
                            component={TextField}
                            fullWidth
                            // onChange={handleChange}
                            value={values?.tahun}
                            sx={{ mt: 2 }}
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
              // onChange={handleChange}
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
                            value={wb?.weight > 0 ? wb.weight.toFixed(2) : "0.00"}
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
                            value={dtTrx || "-"}
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
                            value={user.name}
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

export default PksManualEntryOthersOut;
