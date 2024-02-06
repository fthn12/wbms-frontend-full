import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Grid, InputAdornment, Checkbox, Paper, TextField } from "@mui/material";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useForm } from "../../../../../utils/useForm";
import moment from "moment";
import Header from "../../../../../components/layout/signed/HeaderTransaction";
import BonTripPrint from "../../../../../components/BonTripPrint";

import { TransactionAPI } from "../../../../../apis";

import { useAuth, useConfig, useTransaction, useTransportVehicle, useWeighbridge, useApp } from "../../../../../hooks";

const validationSchema = yup.object().shape({
  // username: yup.string().required("Wajib diisi."),
  // password: yup
  //   .string()
  //   .min(8, "Panjang password minimal 8 karakter dan maksimal 20 karakter.")
  //   .max(20, "Panjang password minimal 8 karakter dan maksimal 20 karakter.")
  //   .required("Wajib diisi."),
  // passwordConfirm: yup.string().oneOf([yup.ref("password"), null], "Password harus sama."),
  // email: yup.string().email("Email tidak valid.").required("Wajib diisi."),
  // npk: yup.string().required("Wajib diisi."),
  // nik: yup.string().required("Wajib diisi."),
  // name: yup.string().required("Wajib diisi."),
  // division: yup.string().required("Wajib diisi."),
  // position: yup.string().required("Wajib diisi."),
  // role: yup.number().required("Wajib diisi."),
});

const PksManualEntryTbsOut = (props) => {
  const { ProductId, ProductName, TransporterId, TransporterCompanyName, TransporterCompanyCode, PlateNo } = props;
  const navigate = useNavigate();
  const { user } = useAuth();
  const transactionAPI = TransactionAPI();
  const { wb } = useWeighbridge();
  const { WBMS, SCC_MODEL } = useConfig();
  const { openedTransaction, wbTransaction, clearOpenedTransaction } = useTransaction();
  const { useGetTransportVehiclesQuery } = useTransportVehicle();
  const { setSidebar } = useApp();
  const [originWeighNetto, setOriginWeighNetto] = useState(0);

  const { data: dtTransportVehicles } = useGetTransportVehiclesQuery();

  const [canSubmit, setCanSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSubmit = async () => {
    let tempTrans = { ...values };

    try {
      // tempTrans.originWeighInTimestamp = SemaiUtils.GetDateStr();
      tempTrans.productId = ProductId;
      tempTrans.productName = ProductName;
      tempTrans.transporterCompanyId = TransporterId;
      tempTrans.transporterCompanyName = TransporterCompanyName;
      tempTrans.transporterCompanyCode = TransporterCompanyCode;
      tempTrans.transportVehiclePlateNo = PlateNo;
      tempTrans.originWeighInTimestamp = moment().toDate();
      tempTrans.originWeighInOperatorName = user.name;
      tempTrans.dtTransaction = moment()
        .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
        .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
        .format();

      const data = { wbTransaction: { ...tempTrans } };

      const response = await transactionAPI.updateById(data);

      if (!response.status) throw new Error(response?.message);

      // setWbTransaction(response.data.transaction);
      clearOpenedTransaction();
      setValues({ ...response.data.transaction });
      setIsSubmitted(true);

      toast.success(`Transaksi WB-OUT telah tersimpan.`);
    } catch (error) {
      return toast.error(`${error.message}.`);
    }
  };

  //weight wb
  useEffect(() => {
    if (!isSubmitted) {
      setValues((prev) => ({
        ...prev,
        originWeighOutKg: wb.weight,
      }));
    }
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
    setValues(openedTransaction);

    return () => {
      // console.clear();
    };
  }, []);

  useEffect(() => {
    if (values.originWeighInKg < WBMS.WB_MIN_WEIGHT || values.originWeighOutKg < WBMS.WB_MIN_WEIGHT) {
      setOriginWeighNetto(0);
    } else {
      let total =
        Math.abs(values.originWeighInKg - values.originWeighOutKg);
      setOriginWeighNetto(total);
    }
  }, [WBMS.WB_MIN_WEIGHT, values]);

  // // Untuk validasi field
  useEffect(() => {
    let cSubmit = false;

    if (values.originWeighInKg >= WBMS.WB_MIN_WEIGHT) {
      cSubmit = true;
    }

    setCanSubmit(cSubmit);
  }, [values]);

  return (
    <>
      <Grid item xs={6} sm={3}>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          sx={{ backgroundColor: "whitesmoke" }}
          label="NO BONTRIP"
          name="bonTripNo"
          value={values?.bonTripNo || ""}
          inputProps={{ readOnly: true }}
        />
        <TextField
          name="deliveryOrderNo"
          label="No. DO/NPB"
          type="text"
          variant="outlined"
          size="small"
          fullWidth
          onChange={handleChange}
          value={values?.deliveryOrderNo}
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
          name="kebun"
          label="Kebun"
          type="text"
          variant="outlined"
          size="small"
          fullWidth
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
          sx={{ mt: 2 }}
        />
        <TextField
          name="qtyTbs"
          label="Janjang/Sak"
          type="text"
          variant="outlined"
          size="small"
          fullWidth
          onChange={handleChange}
          value={values?.qtyTbs}
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
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={1}>
          <Box gridColumn="span 7">
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              InputProps={{
                endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
              }}
              onChange={handleChange}
              label="Buah Mentah"
              name="Buah Mentah"
              value={values.BuahMentah}
            />
          </Box>
          <Box gridColumn="span 5">
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              // value={potBMKG}
              inputProps={{ readOnly: true }}
            />
          </Box>
          <Box gridColumn="span 7">
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 1 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
              }}
              onChange={handleChange}
              label="Buah Lewat Matang"
              name="BuahLewatMatang"
              value={values.BuahLewatMatang}
            />
          </Box>
          <Box gridColumn="span 5">
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 1, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              // name="originWeighInKg"
              // value={values?.originWeighInKg > 0 ? values.originWeighInKg.toFixed(2) : "0.00"}
              inputProps={{ readOnly: true }}
            />
          </Box>
          <Box gridColumn="span 7">
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 1 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
              }}
              onChange={handleChange}
              label="Tangkai Panjang"
              name="TangkaiPanjang"
              value={values?.TangkaiPanjang}
            />
          </Box>
          <Box gridColumn="span 5">
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 1, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              // name="weightNetto"
              // value={originWeighNetto > 0 ? originWeighNetto.toFixed(2) : "0.00"}
              inputProps={{ readOnly: true }}
            />
          </Box>

          <Box gridColumn="span 7">
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 1, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
              }}
              onChange={handleChange}
              label="Tandan Kosong"
              name="tandanKosong"
              value={values?.tandanKosong}
              inputProps={{ readOnly: true }}
            />
          </Box>
          <Box gridColumn="span 5">
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 1, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              // name="originWeighOutKg"
              // value={values?.originWeighOutKg > 0 ? values.originWeighOutKg.toFixed(2) : "0.00"}
              inputProps={{ readOnly: true }}
            />
          </Box>
          <Box gridColumn="span 7">
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 1 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
              }}
              onChange={handleChange}
              label="Sampah"
              name="Sampah"
              value={values?.Sampah}
            />
          </Box>

          <Box gridColumn="span 5">
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 1, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              // name="originWeighInKg"
              // value={values?.originWeighInKg > 0 ? values.originWeighInKg.toFixed(2) : "0.00"}
              inputProps={{ readOnly: true }}
            />
          </Box>
          <Box gridColumn="span 7">
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 1 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
              }}
              onChange={handleChange}
              label="Air"
              name="air"
              value={values?.air}
            />
          </Box>
          <Box gridColumn="span 5">
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 1, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              // name="originWeighOutKg"
              // value={values?.originWeighOutKg > 0 ? values.originWeighOutKg.toFixed(2) : "0.00"}
              inputProps={{ readOnly: true }}
            />
          </Box>
          <Box gridColumn="span 7">
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 1 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
              }}
              onChange={handleChange}
              label="Parteno"
              name="Parteno"
              value={values?.Parteno}
            />
          </Box>
          <Box gridColumn="span 5">
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 1, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              // name="weightNetto"
              // value={originWeighNetto > 0 ? originWeighNetto.toFixed(2) : "0.00"}
              inputProps={{ readOnly: true }}
            />
          </Box>
          <Box gridColumn="span 7">
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 1 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
              }}
              onChange={handleChange}
              label="Brondolan"
              name="Brondolan"
              value={values?.Brondolan}
            />
          </Box>
          <Box gridColumn="span 5">
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 1, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              // name="originWeighOutKg"
              // value={values?.originWeighOutKg > 0 ? values.originWeighOutKg.toFixed(2) : "0.00"}
              inputProps={{ readOnly: true }}
            />
          </Box>
          <Box gridColumn="span 7">
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 1 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
              }}
              onChange={handleChange}
              label="Pot. Wajib Vendor"
              name="potonganWajib"
              value={values?.potonganWajib}
            />
          </Box>
          <Box gridColumn="span 5">
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 1, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              // name="originWeighOutKg"
              // value={values?.originWeighOutKg > 0 ? values.originWeighOutKg.toFixed(2) : "0.00"}
              inputProps={{ readOnly: true }}
            />
          </Box>
          <Box gridColumn="span 7">
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 1 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">% / Jjg</InputAdornment>,
              }}
              onChange={handleChange}
              label="Pot. Lainnya"
              name="potonganLain"
              value={values?.potonganLain}
            />
          </Box>
          <Box gridColumn="span 5">
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 1, backgroundColor: "whitesmoke" }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
              // name="originWeighOutKg"
              // value={values?.originWeighOutKg > 0 ? values.originWeighOutKg.toFixed(2) : "0.00"}
              inputProps={{ readOnly: true }}
            />
          </Box>
          <Box gridColumn="span 12">
            <TextField
              type="number"
              variant="outlined"
              size="small"
              fullWidth
              sx={{ mt: 1 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }}
          
              label="TOTAL Potongan"
              inputProps={{ readOnly: true }}
              // value={values?.potonganWajib}
            />
          </Box>
          <Box gridColumn="span 12" fontSize="16px" fontWeight="bold" color="red">
            Sebagai Potongan/Pengurangan Tonase ?
            <Checkbox
              size="medium"
              sx={{
                alignItems: "center",
                ml: 1,
              }}
            />
            <hr style={{ marginTop: 0, borderColor: "whitesmoke" }} />
          </Box>
        </Box>
      </Grid>
      <Grid item xs={6} sm={3}>
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
          onChange={handleChange}
          label="BERAT MASUK -IN"
          name="originWeighInKg"
          value={values?.originWeighInKg > 0 ? values.originWeighInKg.toFixed(2) : "0.00"}
          inputProps={{ readOnly: true }}
        />
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
        <TextField
          type="number"
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 2, backgroundColor: "whitesmoke" }}
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
          label="TOTAL"
          name="weightNetto"
          value={originWeighNetto > 0 ? originWeighNetto.toFixed(2) : "0.00"}
          inputProps={{ readOnly: true }}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, mb: 1 }}
          onClick={handleSubmit}
          disabled={
            !(
              (canSubmit && !isSubmitted)
              //  && wb?.isStable
            )
          }
        >
          Simpan
        </Button>

        <BonTripPrint dtTrans={{ ...values }} isDisable={!isSubmitted} />
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
    </>
  );
};

export default PksManualEntryTbsOut;
