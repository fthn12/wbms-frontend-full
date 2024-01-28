import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Grid, Autocomplete, Divider, Paper, TextField } from "@mui/material";
import { useForm } from "../../../utils/useForm";
import * as yup from "yup";
import { toast } from "react-toastify";
import moment from "moment";
import numeral from "numeral";
import TBS from "./tbs/in";
import OTHERS from "./others/in";
import KERNEL from "./kernel/in";
import Header from "../../../components/layout/signed/HeaderTransaction";

import { TransactionAPI } from "../../../apis";

import {
  useAuth,
  useConfig,
  useTransaction,
  useCompany,
  useWeighbridge,
  useProduct,
  useTransportVehicle,
} from "../../../hooks";

const PksManualEntryWBIn = () => {
  const navigate = useNavigate();

  const transactionAPI = TransactionAPI();
  const { wb } = useWeighbridge();
  const { user } = useAuth();
  const { WBMS, SCC_MODEL } = useConfig();
  const { openedTransaction, setOpenedTransaction, clearOpenedTransaction } = useTransaction();
  const { useGetCompaniesQuery } = useCompany();
  const { useGetProductsQuery } = useProduct();
  const { useGetTransportVehiclesQuery } = useTransportVehicle();
  const [originWeighNetto, setOriginWeighNetto] = useState(0);

  const { data: dtCompany } = useGetCompaniesQuery();
  const { data: dtProduct } = useGetProductsQuery();
  const { data: dtTransport, error } = useGetTransportVehiclesQuery();

  const [canSubmit, setCanSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");

  const { values, setValues } = useForm({ ...transactionAPI.InitialData });

  // const handleChange = (event) => {
  //   setValues({
  //     ...values,
  //     [event.target.name]: event.target.value,
  //   });
  // };

  const handleClose = () => {
    clearOpenedTransaction();

    navigate("/wb/transactions");
  };

  const handleSubmit = async () => {
    // let tempTrans = { ...values };

    setIsLoading(true);
    try {
      values.originWeighInKg = wb.weight;
      //   // values.transportVehicleId = ProductId;
      //   // values.transportVehicleProductName = ProductName;
      //   // values.transportVehicleProductCode = ProductCode;
      //   values.transportVehicleId = ProductId;
      //   values.transportVehicleProductName = ProductName;
      //   values.transportVehicleProductCode = ProductCode;
      //   values.productId = ProductId;
      //   values.productName = ProductName;
      //   values.productCode = ProductCode;
      //   values.transporterCompanyId = TransporterId;
      //   values.transporterCompanyName = TransporterCompanyName;
      //   values.transporterCompanyCode = TransporterCompanyCode;
      //   values.transportVehiclePlateNo = PlateNo.toUpperCase();
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
    setValues({ bonTripNo: `${WBMS.BT_SITE_CODE}${WBMS.BT_SUFFIX_TRX}${moment().format("YYMMDDHHmmss")}` });
  }, []);

  // useEffect(() => {
  //   if (!openedTransaction)
  //     // return handleClose();

  //     return () => {
  //       // console.clear();
  //     };
  // }, []);

  // useEffect(() => {
  //   if (dataValues.originWeighInKg < WBMS.WB_MIN_WEIGHT || dataValues.originWeighOutKg < WBMS.WB_MIN_WEIGHT) {
  //     setOriginWeighNetto(0);
  //   } else {
  //     let total =
  //       Math.abs(dataValues.originWeighInKg - dataValues.originWeighOutKg) -
  //       dataValues.potonganWajib -
  //       dataValues.potonganLain;
  //     setOriginWeighNetto(total);
  //   }
  // }, [WBMS.WB_MIN_WEIGHT, dataValues]);

  // // Untuk validasi field
  // useEffect(() => {
  //   let cSubmit = false;

  //   if (dataValues.originWeighInKg >= WBMS.WB_MIN_WEIGHT && dataValues.originWeighOutKg >= WBMS.WB_MIN_WEIGHT)
  //     cSubmit = true;

  //   setCanSubmit(cSubmit);
  // }, [WBMS.WB_MIN_WEIGHT, dataValues]);

  return (
    <Box>
      <Header title="Transaksi PKS" subtitle="Transaksi Manual Entry PKS" />

      <Box sx={{ display: "flex", mt: 3, justifyContent: "end" }}>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ mr: 1 }}
          // disabled={!(isValid && wb?.isStable && wb?.weight > WBMS.WB_MIN_WEIGHT)}
        >
          SIMPAN
        </Button>
        {/* <BonTripPrint dtTrans={{ ...values }} isDisable={!isSubmitted} sx={{ mx: 1 }} /> */}
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
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6} lg={3}>
            <Grid item xs={12}>
              <Divider sx={{ mb: 2 }}>DATA KENDARAAN</Divider>
            </Grid>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              sx={{ backgroundColor: "whitesmoke", mb: 2 }}
              label="NO BONTRIP"
              name="bonTripNo"
              value={values?.bonTripNo}
              inputProps={{ readOnly: true }}
            />

            <Autocomplete
              id="autocomplete"
              freeSolo
              options={dtTransport?.records || []}
              getOptionLabel={(option) => option.plateNo}
              onInputChange={(event, InputValue) => {
                setValues({ ...values, transportVehiclePlateNo: InputValue });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nomor Plat"
                  variant="outlined"
                  size="small"
                  inputProps={{
                    ...params.inputProps,
                    style: { textTransform: "uppercase" },
                  }}
                />
              )}
            />

            <Autocomplete
              id="select-label"
              options={dtCompany?.records || []}
              getOptionLabel={(option) => `[${option.code}] - ${option.name}`}
              value={dtCompany?.records?.find((item) => item.id === values.transporterCompanyId) || null}
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
              id="select-label"
              options={(dtProduct?.records || []).filter(
                (option) => !["cpo", "pko"].includes(option.name.toLowerCase()),
              )}
              getOptionLabel={(option) => `[${option.code}] - ${option.name}`}
              value={dtProduct?.records?.find((item) => item.id === values.productId) || null}
              onChange={(event, newValue) => {
                if (!newValue) {
                  setSelectedOption("");
                } else {
                  setValues((prevValues) => ({
                    ...prevValues,
                    productId: newValue.id,
                    productName: newValue.name,
                    productCode: newValue.code,
                  }));

                  const filterOption = (newValue?.name || "").toLowerCase().includes("kernel")
                    ? "Kernel"
                    : (newValue?.name || "").toLowerCase().includes("tbs")
                    ? "Tbs"
                    : "Others";

                  setSelectedOption(filterOption);
                }
              }}
              renderInput={(params) => (
                <TextField {...params} sx={{ mt: 2 }} label="Product" variant="outlined" size="small" />
              )}
            />
          </Grid>
          {/* TBS */}

          {selectedOption === "Tbs" && (
            <TBS
              ProductId={values?.productId}
              ProductName={values?.productName}
              ProductCode={values?.productCode}
              TransporterId={values?.transporterCompanyId}
              TransporterCompanyName={values?.transporterCompanyName}
              TransporterCompanyCode={values?.transporterCompanyCode}
              PlateNo={values?.transportVehiclePlateNo}
            />
          )}

          {/* Others*/}

          {selectedOption === "Others" && (
            <OTHERS
              ProductId={values?.productId}
              ProductName={values?.productName}
              ProductCode={values?.productCode}
              TransporterId={values?.transporterCompanyId}
              TransporterCompanyName={values?.transporterCompanyName}
              TransporterCompanyCode={values?.transporterCompanyCode}
              PlateNo={values?.transportVehiclePlateNo}
            />
          )}

          {/* KERNEL*/}

          {selectedOption === "Kernel" && (
            <KERNEL
              ProductId={values?.productId}
              ProductName={values?.productName}
              ProductCode={values?.productCode}
              TransporterId={values?.transporterCompanyId}
              TransporterCompanyName={values?.transporterCompanyName}
              TransporterCompanyCode={values?.transporterCompanyCode}
              PlateNo={values?.transportVehiclePlateNo}
            />
          )}
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
          }}
        />
      )}
    </Box>
  );
};

export default PksManualEntryWBIn;
