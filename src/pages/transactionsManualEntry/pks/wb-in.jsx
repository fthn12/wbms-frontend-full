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
import BonTripPrint from "../../../components/BonTripPrint";

import { TransactionAPI } from "../../../apis";

import { useConfig, useTransaction, useCompany, useWeighbridge, useProduct, useTransportVehicle } from "../../../hooks";

const PksManualEntryWBIn = () => {
  const navigate = useNavigate();

  const transactionAPI = TransactionAPI();
  const { wb } = useWeighbridge();
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

  const { values, setValues } = useForm({ ...TransactionAPI.InitialData });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleClose = () => {
    clearOpenedTransaction();

    navigate("/wb/transactions");
  };

  useEffect(() => {
    if (!openedTransaction)
      // return handleClose();

      return () => {
        // console.clear();
      };
  }, []);

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

      <Box display="flex" sx={{ mt: 3 }}>
        <Box flex={1}></Box>
        <Button variant="contained" onClick={handleClose}>
          TUTUP
        </Button>
      </Box>
      <Paper sx={{ mt: 1, p: 2, minHeight: "71.5vh" }}>
        <Grid container spacing={1}>
          <Grid item xs={6} sm={3}>
            <Grid item xs={12}>
              <Divider sx={{ mb: 2 }}>DATA KENDARAAN</Divider>
            </Grid>
            {/* <TextField
              variant="outlined"
              size="small"
              fullWidth
              label="Nomor Plat"
              name="transportVehiclePlateNo"
              value={values?.transportVehiclePlateNo}
              onChange={handleChange}
            /> */}
            <Autocomplete
              id="autocomplete"
              freeSolo
              options={dtTransport?.records || []}
              getOptionLabel={(option) => option.plateNo}
              onInputChange={(event, newInputValue) => {
                setValues({ ...values, transportVehiclePlateNo: newInputValue });
              }}
              renderInput={(params) => <TextField {...params} label="Nomor Plat" variant="outlined" size="small" />}
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
              value={dtProduct?.records?.find((item) => item.id === values.transportVehicleId) || null}
              onChange={(event, newValue) => {
                setValues((prevValues) => ({
                  ...prevValues,
                  transportVehicleId: newValue ? newValue.id : "",
                  transportVehicleProductName: newValue ? newValue.name : "",
                  transportVehicleProductCode: newValue ? newValue.code : "",
                }));

                const filterOption = (newValue?.name || "").toLowerCase().includes("kernel")
                  ? "Kernel"
                  : (newValue?.name || "").toLowerCase().includes("tbs")
                  ? "Tbs"
                  : "Others";

                setSelectedOption(filterOption);
              }}
              renderInput={(params) => (
                <TextField {...params} sx={{ mt: 2 }} label="Product" variant="outlined" size="small" />
              )}
            />
          </Grid>
          {/* TBS */}

          {selectedOption === "Tbs" && (
            <TBS
              ProductId={values?.transportVehicleId}
              ProductName={values?.transportVehicleProductName}
              ProductCode={values?.transportVehicleProductCode}
              TransporterId={values?.transporterCompanyId}
              TransporterCompanyName={values?.transporterCompanyName}
              TransporterCompanyCode={values?.transporterCompanyCode}
              PlateNo={values?.transportVehiclePlateNo}
            />
          )}

          {/* Others*/}

          {selectedOption === "Others" && (
            <OTHERS
              ProductId={values?.transportVehicleId}
              ProductName={values?.transportVehicleProductName}
              ProductCode={values?.transportVehicleProductCode}
              TransporterId={values?.transporterCompanyId}
              TransporterCompanyName={values?.transporterCompanyName}
              TransporterCompanyCode={values?.transporterCompanyCode}
              PlateNo={values?.transportVehiclePlateNo}
            />
          )}

          {/* KERNEL*/}

          {selectedOption === "Kernel" && (
            <KERNEL
              ProductId={values?.transportVehicleId}
              ProductName={values?.transportVehicleProductName}
              ProductCode={values?.transportVehicleProductCode}
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
