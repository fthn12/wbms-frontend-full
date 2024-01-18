import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Grid, InputAdornment, Divider, Paper, TextField } from "@mui/material";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useForm } from "../../../../../utils/useForm";
import moment from "moment";
import Header from "../../../../../components/layout/signed/HeaderTransaction";
import BonTripPrint from "../../../../../components/BonTripPrint";

import { TransactionAPI } from "../../../../../apis";

import { useAuth, useConfig, useTransaction, useTransportVehicle, useWeighbridge, useApp } from "../../../../../hooks";

const initialValues = {
  bonTripNo: "",
  driverName: "",
  transporterId: "",
  transporterCompanyName: "",
  transporterCompanyCode: "",
  transportVehiclePlateNo: "",
  productId: "",
  productName: "",
  originWeighInKg: "",
  deliveryOrderNo: "",
  progressStatus: "",
  originWeighInTimestamp: "",
  transportVehicleSccModel: "",
  afdeling: "",
  blok: "",
  sptbs: "",
  // yearPlan: "",
  // kebun: "",
};

const PksManualEntryOthersIn = (props) => {
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
  const { WBMS, SCC_MODEL } = useConfig();
  const { openedTransaction, wbTransaction, setOpenedTransaction, setWbTransaction, clearOpenedTransaction } =
    useTransaction();
  const { useGetTransportVehiclesQuery } = useTransportVehicle();
  const { setSidebar } = useApp();
  const [originWeighNetto, setOriginWeighNetto] = useState(0);

  const { data: dtTransportVehicles } = useGetTransportVehiclesQuery();

  const [canSubmit, setCanSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [dtTrx, setDtTrx] = useState(null);

  const [values, setValues] = useState(initialValues);

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
    // let tempTrans = { ...values };

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
      values.transportVehiclePlateNo = PlateNo.toUpperCase();
      values.originWeighInTimestamp = moment().toDate();
      values.originWeighInOperatorName = user.name.toUpperCase();
      values.dtTransaction = moment()
        .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
        .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
        .format();

      const data = { values };

      const response = await transactionAPI.ManualEntryPksInOthers(values);

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

  //weight wb
  useEffect(() => {
    setWbTransaction({ originWeighInKg: wb.weight });
  }, [wb.weight]);

  // useEffect(() => {
  //   if (!wbTransaction) return handleClose();

  //   setSidebar({ selected: "Transaksi WB PKS" });
  //   setValues(wbTransaction);

  //   return () => {
  //     // console.clear();
  //   };
  // }, []);

  useEffect(() => {
    setValues({ bonTripNo: `${WBMS.BT_SITE_CODE}${WBMS.BT_SUFFIX_TRX}${moment().format("YYMMDDHHmmss")}` });
  }, []);

  useEffect(() => {
    if (wbTransaction?.originWeighInKg < WBMS.WB_MIN_WEIGHT || wbTransaction?.originWeighOutKg < WBMS.WB_MIN_WEIGHT) {
      setOriginWeighNetto(0);
    } else {
      let total = Math.abs(wbTransaction?.originWeighInKg - wbTransaction?.originWeighOutKg);
      setOriginWeighNetto(total);
    }
  }, [wbTransaction]);

  return (
    <>
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
              value={values?.bonTripNo}
              inputProps={{ readOnly: true }}
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
            />
            <TextField
              name="janjang"
              label="Janjang/Sak"
              type="text"
              variant="outlined"
              size="small"
              fullWidth
              onChange={handleChange}
              value={values?.janjang}
              sx={{ mt: 2 }}
            />
            <TextField
              name="driverName"
              label="Nama Supir"
              type="text"
              variant="outlined"
              size="small"
              fullWidth
              onChange={handleChange}
              value={values?.driverName}
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
            />
            <TextField
              name="tahun"
              label="Tahun"
              type="text"
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
              label="Waktu WB-IN"
              name="originWeighInTimestamp"
              value={dtTrx || "-"}
              inputProps={{ readOnly: true }}
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
              value={values?.originWeighOutKg > 0 ? values.originWeighOutKg.toFixed(2) : "0.00"}
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
              value={
                values?.originWeighOutTimestamp
                  ? moment(values.originWeighOutTimestamp).local().format(`DD/MM/YYYY - HH:mm:ss`)
                  : "-"
              }
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
              value={user.name}
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
              name="originWeighOutOperatorName"
              inputProps={{ readOnly: true }}
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
              sx={{ mt: 3, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              label="TOTAL"
              name="weightNetto"
              value={originWeighNetto > 0 ? originWeighNetto.toFixed(2) : "0.00"}
              inputProps={{ readOnly: true }}
            />
          </Grid>

          <Grid item xs={6}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                display: false ? "none" : "",
              }}
              hide={true}
              onClick={handleSubmit}
              disabled={!(wb?.isStable && wb?.weight > WBMS.WB_MIN_WEIGHT)}
            >
              Simpan
            </Button>
          </Grid>
          <Grid item xs={6}>
            <BonTripPrint dtTrans={{ ...values }} disabled={true} />
          </Grid>
        </Grid>
      </Grid>
      {isLoading && (
        <CircularProgress
          size={50}
          sx={{
            color: "goldenrod",
            position: "absolute",
            top: "50%",
            left: "48.5%",
          }}
        />
      )}
      {/* {!wbTransaction && (
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
      )} */}
    </>
  );
};

export default PksManualEntryOthersIn;
