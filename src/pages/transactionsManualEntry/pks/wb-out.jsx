import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Grid, Autocomplete, MenuItem, Paper, TextField } from "@mui/material";
import { useForm } from "../../../utils/useForm";
import * as yup from "yup";
import { toast } from "react-toastify";
import moment from "moment";
import numeral from "numeral";
import TBS from "./tbs/out";
import Kernel from "./kernel/out";
import OTHERS from "./others/out";
import Header from "../../../components/layout/signed/HeaderTransaction";
import BonTripPrint from "../../../components/BonTripPrint";

import { TransactionAPI } from "../../../apis";

import { useConfig, useTransaction, useCompany, useWeighbridge, useProduct } from "../../../hooks";

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

const PksManualEntryWBOut = () => {
  const navigate = useNavigate();

  const transactionAPI = TransactionAPI();
  const { wb } = useWeighbridge();
  const { WBMS, SCC_MODEL } = useConfig();
  const { openedTransaction, setOpenedTransaction, clearOpenedTransaction } = useTransaction();
  const { useGetCompaniesQuery } = useCompany();
  const { useGetProductQuery } = useProduct();

  const [originWeighNetto, setOriginWeighNetto] = useState(0);

  const { data: dtCompany } = useGetCompaniesQuery();

  const { data: dtProduct } = useGetProductQuery();

  const [canSubmit, setCanSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");

  const { values, setValues } = useForm({ ...transactionAPI.InitialData });

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
    try {
      setValues(openedTransaction);
      const productName = openedTransaction.productName?.toLowerCase();

      if (productName && productName.includes("tbs")) {
        setSelectedOption("Tbs");
      } else if (productName && productName.includes("kernel")) {
        setSelectedOption("Kernel");
      } else {
        setSelectedOption("Others");
      }

      const product = dtProduct?.data?.product?.records?.find((item) => item.id === openedTransaction.productId);
      setSelectedProduct(product);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    return () => {
      // console.clear();
    };
  }, [openedTransaction, dtProduct]);

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
      <Header title="Transaksi PKS Manual Entry" subtitle="Transaksi Dibuat Secara Manual" />

      <Box display="flex" sx={{ mt: 3 }}>
        <Box flex={1}></Box>
        <Button variant="contained" onClick={handleClose}>
          TUTUP
        </Button>
      </Box>
      <Paper sx={{ mt: 1, p: 2, minHeight: "71.5vh" }}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              label="Nomor Plat"
              name="transportVehiclePlateNo"
              value={values?.transportVehiclePlateNo}
              onChange={handleChange}
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
              id="select-label-product"
              options={
                dtProduct?.data?.product?.records?.filter(
                  (option) => !["cpo", "pko"].includes(option.name.toLowerCase()),
                ) || []
              }
              getOptionLabel={(option) => option.name}
              value={selectedProduct}
              onChange={(event, newValue) => {
                const { id, name } = newValue || { id: "", name: "" };
                setValues((prevValues) => ({ ...prevValues, productId: id, productName: name }));
                setSelectedProduct({ id, name });
                setSelectedOption(
                  newValue?.name.toLowerCase().includes("tbs")
                    ? "Tbs"
                    : newValue?.name.toLowerCase().includes("kernel")
                    ? "Kernel"
                    : "Others",
                );
              }}
              renderInput={(params) => (
                <TextField {...params} sx={{ mt: 2 }} label="Product" variant="outlined" size="small" />
              )}
            />

            {/* <TextField
              variant="outlined"
              size="small"
              fullWidth
              label="Nomor Plat"
              name="transportVehiclePlateNo"
              value={values?.productName}
              onChange={handleChange}
            /> */}
          </Grid>
          {/* TBS */}

          {selectedOption === "Tbs" && (
            <TBS
              ProductId={values?.productId}
              ProductName={values?.productName}
              TransporterId={values?.transporterCompanyId}
              TransporterCompanyName={values?.transporterCompanyName}
              TransporterCompanyCode={values?.transporterCompanyCode}
              PlateNo={values?.transportVehiclePlateNo}
            />
          )}

          {selectedOption === "Kernel" && (
            <Kernel
              ProductId={values?.productId}
              ProductName={values?.productName}
              TransporterId={values?.transporterCompanyId}
              TransporterCompanyName={values?.transporterCompanyName}
              TransporterCompanyCode={values?.transporterCompanyCode}
              PlateNo={values?.transportVehiclePlateNo}
            />
          )}

          {selectedOption === "Others" && (
            <OTHERS
              ProductId={values?.productId}
              ProductName={values?.productName}
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

export default PksManualEntryWBOut;
