import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  Divider,
  Paper,
  TextField,
} from "@mui/material";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useForm } from "../../../../../utils/useForm";
import moment from "moment";
import Header from "../../../../../components/layout/signed/HeaderTransaction";
import BonTripPrint from "../../../../../components/BonTripPrint";
import { SortasiKernel } from "../../../../../components/SortasiKernel";

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
  const {
    ProductId,
    ProductName,
    ProductCode,
    TransporterId,
    TransporterCompanyName,
    TransporterCompanyCode,
    PlateNo,
  } = props;
  const navigate = useNavigate();
  const { user } = useAuth();
  const transactionAPI = TransactionAPI();
  const { wb } = useWeighbridge();
  const { id } = useParams();
  const { WBMS, SCC_MODEL } = useConfig();
  const { openedTransaction, wbTransaction, setOpenedTransaction, setWbTransaction, clearOpenedTransaction } =
    useTransaction();
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

  const { values, setValues } = useForm({
    ...TransactionAPI.InitialData,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((preValues) => ({
      ...preValues,
      [name]: value,
    }));
  };

  const handleClose = () => {
    clearOpenedTransaction();

    navigate("/wb/transactions");
  };

  const handleSubmit = async () => {
    try {
      values.originWeighInKg = wb.weight;
      // values.transportVehicleId = ProductId;
      // values.transportVehicleProductName = ProductName;
      // values.transportVehicleProductCode = ProductCode;
      values.productId = ProductId;
      values.productName = ProductName;
      values.productCode = ProductCode;
      values.transporterCompanyId = TransporterId;
      values.transporterCompanyName = TransporterCompanyName;
      values.transporterCompanyCode = TransporterCompanyCode;
      values.transportVehiclePlateNo = PlateNo;
      values.originWeighInTimestamp = moment().toDate();
      values.originWeighInOperatorName = user.name.toUpperCase();
      values.dtTransaction = moment()
        .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
        .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
        .format();

      const data = { ...values };

      const response = await transactionAPI.ManualEntryPksInOthers(data);

      if (!response.status) throw new Error(response?.message);

      // setWbTransaction(response.data.transaction);
      clearOpenedTransaction();
      handleClose();
      setValues({ ...response.data.transaction });
      setIsSubmitted(true);

      toast.success(`Transaksi WB-IN telah tersimpan.`);
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
  const validateForm = () => {
    return values.bonTripNo && values.driverName && ProductName && TransporterCompanyName && PlateNo;
  };

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
        setValues(res.data.transaction); // Move this line here
      })
      .catch((error) => {
        toast.error(`${error.message}.`);
        return handleClose();
      });

    return () => {
      // console.clear();
    };
  }, []);
  // useEffect(() => {
  //   if (!wbTransaction) return handleClose();

  //   setSidebar({ selected: "Transaksi WB PKS" });
  //   setValues(wbTransaction);

  //   return () => {
  //     // console.clear();
  //   };
  // }, []);

  //   useEffect(() => {
  //     setValues(openedTransaction);
  //   }, []);

  useEffect(() => {
    if (wbTransaction?.originWeighInKg < WBMS.WB_MIN_WEIGHT || wbTransaction?.originWeighOutKg < WBMS.WB_MIN_WEIGHT) {
      setOriginWeighNetto(0);
    } else {
      let total = Math.abs(wbTransaction?.originWeighInKg - wbTransaction?.originWeighOutKg);
      setOriginWeighNetto(total);
    }
  }, [wbTransaction]);

  return (
    <Box>
      <Header title="Transaksi PKS Manual Entry" subtitle="Transaksi Dibuat Secara Manual" />
      <Box sx={{ display: "flex", mt: 3, justifyContent: "end" }}>
        <Button
          variant="contained"
          //   hide={true}
          onClick={handleSubmit}
          disabled={!(validateForm() && wb?.isStable && wb?.weight > WBMS.WB_MIN_WEIGHT)}
        >
          Simpan
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

      {openedTransaction && (
        <Paper sx={{ mt: 1, p: 2, minHeight: "71.5vh" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={3}>
              <Grid item xs={12}>
                <Divider sx={{ mb: 2 }}>DATA KENDARAAN</Divider>
              </Grid>
              <Autocomplete
                id="autocomplete"
                freeSolo
                name="transportVehiclePlateNo"
                options={dtTransport?.records || []}
                value={
                  dtTransport?.records?.find((item) => item.plateNo === values?.transportVehiclePlateNo) || {
                    plateNo: values?.transportVehiclePlateNo,
                  }
                }
                getOptionLabel={(option) => option.plateNo}
                onInputChange={(event, InputValue, reason) => {
                  if (reason !== "reset") {
                    setValues({ ...values, transportVehiclePlateNo: InputValue });
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Nomor Plat"
                    variant="outlined"
                    size="small"
                    name="transportVehiclePlateNo"
                    inputProps={{
                      ...params.inputProps,
                      style: { textTransform: "uppercase" },
                    }}
                  />
                )}
              />
              <Autocomplete
                id="select-label-company"
                options={dtCompany?.records || []}
                getOptionLabel={(option) => `[${option.code}] ${option.name}`}
                value={dtCompany?.records?.find((item) => item.id === values?.transporterCompanyId) || null}
                onChange={(event, newValue) => {
                  setValues((prevValues) => ({
                    ...prevValues,
                    transporterCompanyId: newValue ? newValue.id : "",
                    transporterCompanyName: newValue ? newValue.name : "",
                    transporterCompanyCode: newValue ? newValue.code : "",
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{
                      mt: 2,
                    }}
                    label="Cust/Vendor transport"
                    variant="outlined"
                    size="small"
                  />
                )}
              />
              <Autocomplete
                id="select-label-company"
                options={dtProduct?.records || []}
                getOptionLabel={(option) => `[${option.code}] ${option.name}`}
                value={dtProduct?.records?.find((item) => item.id === values?.productId) || null}
                onChange={(event, newValue) => {
                  setValues((prevValues) => ({
                    ...prevValues,
                    productId: newValue ? newValue.id : "",
                    productName: newValue ? newValue.name : "",
                    productCode: newValue ? newValue.code : "",
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{
                      mt: 2,
                    }}
                    label="Cust/Vendor transport"
                    variant="outlined"
                    size="small"
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
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ backgroundColor: "whitesmoke", mt: 2 }}
                    label="NO BONTRIP"
                    name="bonTripNo"
                    value={values?.bonTripNo || ""}
                    inputProps={{ readOnly: true }}
                  />
                  {/* <TextField
              name="driverName"
              label="Nama Supir"
              type="text"
              variant="outlined"
              size="small"
              fullWidth
              onChange={handleChange}
              value={values?.driverName}
              sx={{ mt: 2 }}
            /> */}
                  <Autocomplete
                    id="autocomplete"
                    freeSolo
                    disableClearable
                    options={dtDrivers?.records || []}
                    value={
                      dtDrivers?.records?.find((item) => item.name === values?.driverName) || {
                        name: values?.driverName,
                      }
                    }
                    getOptionLabel={(option) => option.name}
                    onInputChange={(event, InputValue, reason) => {
                      if (reason !== "reset") {
                        setValues({ ...values, driverName: InputValue });
                      }
                    }}
                    sx={{ mt: 2 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Nama Supir"
                        variant="outlined"
                        size="small"
                        inputProps={{
                          ...params.inputProps,
                          style: { textTransform: "uppercase" },
                        }}
                      />
                    )}
                  />
                  <TextField
                    name="afdeling"
                    label="Afdeling"
                    type="text"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={handleChange}
                    value={values?.afdeling}
                    sx={{ mt: 2 }}
                    inputProps={{
                      style: { textTransform: "uppercase" },
                    }}
                  />
                  <TextField
                    name="kebun"
                    label="Kebun"
                    type="text"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={values?.kebun}
                    onChange={handleChange}
                    sx={{ mt: 2 }}
                    inputProps={{
                      style: { textTransform: "uppercase" },
                    }}
                  />
                  <TextField
                    name="blok"
                    label="Blok"
                    type="text"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={handleChange}
                    value={values?.blok}
                    sx={{ mt: 2 }}
                    inputProps={{
                      style: { textTransform: "uppercase" },
                    }}
                  />
                  <TextField
                    name="janjang"
                    label="Janjang/Sak"
                    type="number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={handleChange}
                    value={values?.janjang}
                    sx={{ mt: 2 }}
                  />
                  <TextField
                    name="npb"
                    label="NPB/BE"
                    type="text"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={handleChange}
                    value={values?.npb}
                    sx={{ mt: 2 }}
                    inputProps={{
                      style: { textTransform: "uppercase" },
                    }}
                  />
                  <TextField
                    name="tahun"
                    label="Tahun"
                    type="number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={handleChange}
                    value={values?.tahun}
                    sx={{ mt: 2 }}
                  />
                  {/* 
            <TextField
              name="sptbs"
              label="SPTBS"
              type="text"
              variant="outlined"
              size="small"
              fullWidth
              onChange={handleChange}
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
                  <Divider sx={{ mb: 2 }}>KUALITAS KERNEL</Divider>
                </Grid>
                <SortasiKernel isReadOnly={false} isBgcolor={false} />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Grid container columnSpacing={1}>
                <Grid item xs={12}>
                  <Divider>DATA TIMBANG KENDARAAN</Divider>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="number"
                    variant="outlined"
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
                  <TextField
                    type="text"
                    variant="outlined"
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
                  <TextField
                    type="number"
                    variant="outlined"
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
                  <TextField
                    type="text"
                    variant="outlined"
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
                  <TextField
                    type="text"
                    variant="outlined"
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
                  <TextField
                    type="text"
                    variant="outlined"
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
                  <TextField
                    type="number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ mt: 1.5, backgroundColor: "whitesmoke" }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                    }}
                    label="TOTAL SEBELUM"
                    name="weightNetto"
                    value={originWeighNetto > 0 ? originWeighNetto.toFixed(2) : "0.00"}
                    inputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    type="number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                    label="POTONGAN"
                    name="weightNetto"
                    value={0}
                    inputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    type="number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                    }}
                    label="TOTAL SESUDAH"
                    name="weightNetto"
                    value={0}
                    inputProps={{ readOnly: true }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
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
