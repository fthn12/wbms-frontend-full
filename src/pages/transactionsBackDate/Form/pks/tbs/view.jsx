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
  Checkbox,
  TextField as TextFieldMUI,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import { TextField, Autocomplete } from "formik-mui";
import * as yup from "yup";
import { toast } from "react-toastify";
import moment from "moment";
import Header from "../../../../../components/layout/signed/HeaderTransaction";
import BonTripPrint from "../../../../../components/BontripOthers";
import SortasiTBS from "../../../../../components/SortasiTBS";
import { DriverFreeSolo } from "components/FormOthers";

import { TransactionAPI } from "../../../../../apis";

import {
  useApp,
  useConfig,
  useTransaction,
  useCompany,
  useProduct,
  useDriver,
  useTransportVehicle,
} from "../../../../../hooks";

const PksBackdateTbsView = () => {
  const navigate = useNavigate();
  const transactionAPI = TransactionAPI();
  const { id } = useParams();
  const { urlPrev, setUrlPrev } = useApp();
  const { WBMS, SCC_MODEL } = useConfig();
  const { openedTransaction, setOpenedTransaction, clearOpenedTransaction } =
    useTransaction();
  const { useGetDriversQuery } = useDriver();
  const { useGetCompaniesQuery } = useCompany();
  const { useGetProductsQuery } = useProduct();
  const { useGetTransportVehiclesQuery } = useTransportVehicle();

  const [originWeighNetto, setOriginWeighNetto] = useState(0);
  const [totalPotongan, setTotalPotongan] = useState(0);

  const { data: dtCompany } = useGetCompaniesQuery();
  const { data: dtProduct } = useGetProductsQuery();
  const { data: dtDrivers } = useGetDriversQuery();
  const { data: dtTransport, error } = useGetTransportVehiclesQuery();

  const handleClose = () => {
    clearOpenedTransaction();

    navigate("/wb/transactions-backdate-form");
  };

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
  }, [openedTransaction]);

  useEffect(() => {
    if (!openedTransaction) return; // Exit early if openedTransaction is null

    let total = Math.abs(
      openedTransaction.unripeKg +
        openedTransaction.underRipeKg +
        openedTransaction.longStalkKg +
        openedTransaction.emptyBunchKg +
        openedTransaction.garbageDirtKg +
        openedTransaction.waterKg +
        openedTransaction.parthenocarpyKg +
        openedTransaction.looseFruitKg +
        openedTransaction.mandatoryDeductionKg +
        openedTransaction.othersKg
    );
    setTotalPotongan(total);
  }, [openedTransaction]);

  return (
    <Box>
      <Header title="Transaksi PKS" subtitle="Data Timbangan Backdate" />
      {openedTransaction && (
        <Formik
          // enableReinitialize
          //   onSubmit={handleFormikSubmit}
          initialValues={openedTransaction}
          // isInitialValid={false}
        >
          {(props) => {
            const { values } = props;
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
                  <BonTripPrint
                    dtTrans={{ ...openedTransaction }}
                    sx={{ mx: 1 }}
                  />
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
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ backgroundColor: "whitesmoke", mb: 2 }}
                        label="NO BONTRIP"
                        name="bonTripNo"
                        component={TextField}
                        value={values?.bonTripNo || ""}
                        inputProps={{ readOnly: true }}
                      />
                      <Field
                        name="transportVehiclePlateNo"
                        component={Autocomplete}
                        variant="outlined"
                        fullWidth
                        freeSolo
                        readOnly={true}
                        disableClearable
                        options={dtTransport?.records.map(
                          (record) => record.plateNo
                        )}
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
                        getOptionLabel={(option) =>
                          `[${option.code}] - ${option.name}`
                        }
                        value={
                          dtCompany?.records?.find(
                            (item) => item.id === values.transporterCompanyId
                          ) || null
                        }
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
                          (option) =>
                            !["cpo", "pko"].includes(option.name.toLowerCase())
                        )}
                        getOptionLabel={(option) =>
                          `[${option.code}] - ${option.name}`
                        }
                        value={
                          dtProduct?.records?.find(
                            (item) => item.id === values.productId
                          ) || null
                        }
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
                          <DriverFreeSolo
                            name="driverName"
                            label="Nama Supir"
                            isReadOnly={true}
                            sx={{ mt: 2 }}
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
                            sx={{
                              mt: 2,
                              mb: 2.5,
                              backgroundColor: "whitesmoke",
                            }}
                            inputProps={{ readOnly: true }}
                          />
                          <Grid item xs={12}>
                            <Divider>SPTBS</Divider>
                          </Grid>
                          <Field
                            name="sptbs"
                            label="SPTBS"
                            type="text"
                            variant="outlined"
                            size="small"
                            component={TextField}
                            fullWidth
                            value={values?.sptbs}
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                      <Grid container columnSpacing={1}>
                        <Grid item xs={12}>
                          <Divider sx={{ mb: 2 }}>KUALITAS TBS</Divider>
                        </Grid>
                        <Grid item xs={1.1}>
                          <Checkbox
                            name="unRipeChecked"
                            size="medium"
                            checked={values?.unRipeChecked}
                            disabled={true}
                          />
                        </Grid>
                        <Grid item xs={6.9}>
                          <Field
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  % / Jjg
                                </InputAdornment>
                              ),
                              style: {
                                backgroundColor: true ? "whitesmoke" : "",
                              },
                            }}
                            component={TextField}
                            disabled={true}
                            label="Buah Mentah"
                            name="unRipePercentage"
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Field
                            type="number"
                            name="unripeKg"
                            variant="outlined"
                            size="small"
                            fullWidth
                            component={TextField}
                            sx={{
                              backgroundColor: true ? "whitesmoke" : "",
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  kg
                                </InputAdornment>
                              ),
                            }}
                            disabled={true}
                          />
                        </Grid>
                        <Grid item xs={1.1}>
                          <Checkbox
                            name="underRipeChecked"
                            size="medium"
                            checked={values?.underRipeChecked}
                            sx={{
                              mt: 1,
                            }}
                            disabled={true}
                          />
                        </Grid>
                        <Grid item xs={6.9}>
                          <Field
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 1 }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  % / Jjg
                                </InputAdornment>
                              ),
                              style: {
                                backgroundColor: true ? "whitesmoke" : "",
                              },
                              // readOnly: true,
                            }}
                            disabled={true}
                            component={TextField}
                            label="Buah Lewat Matang"
                            name="underRipePercentage"
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Field
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            component={TextField}
                            sx={{
                              mt: 1,
                              backgroundColor: true ? "whitesmoke" : "",
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  kg
                                </InputAdornment>
                              ),
                            }}
                            disabled={true}
                            name="underRipeKg"
                          />
                        </Grid>
                        <Grid item xs={1.1}>
                          <Checkbox
                            name="longStalkChecked"
                            checked={values?.longStalkChecked}
                            size="medium"
                            sx={{
                              mt: 1,
                            }}
                            disabled={true}
                          />
                        </Grid>
                        <Grid item xs={6.9}>
                          <Field
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 1 }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  % / Jjg
                                </InputAdornment>
                              ),
                              style: {
                                backgroundColor: true ? "whitesmoke" : "",
                              },
                              // readOnly: true,
                            }}
                            disabled={true}
                            component={TextField}
                            label="Tangkai Panjang"
                            name="longStalkPercentage"
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Field
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            component={TextField}
                            sx={{
                              mt: 1,
                              backgroundColor: true ? "whitesmoke" : "",
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  kg
                                </InputAdornment>
                              ),
                            }}
                            disabled={true}
                            name="longStalkKg"
                          />
                        </Grid>
                        <Grid item xs={1.1}>
                          <Checkbox
                            name="emptyBunchChecked"
                            checked={values?.emptyBunchChecked}
                            size="medium"
                            sx={{
                              mt: 1,
                            }}
                            disabled={true}
                          />
                        </Grid>
                        <Grid item xs={6.9}>
                          <Field
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 1 }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  % / Jjg
                                </InputAdornment>
                              ),
                              style: {
                                backgroundColor: true ? "whitesmoke" : "",
                              },
                              // readOnly: true,
                            }}
                            disabled={true}
                            component={TextField}
                            label="Tandan Kosong"
                            name="emptyBunchPercentage"
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Field
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            component={TextField}
                            sx={{
                              mt: 1,
                              backgroundColor: true ? "whitesmoke" : "",
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  kg
                                </InputAdornment>
                              ),
                            }}
                            disabled={true}
                            name="emptyBunchKg"
                          />
                        </Grid>
                        <Grid item xs={1.1}>
                          <Checkbox
                            name="garbageDirtChecked"
                            checked={values?.garbageDirtChecked}
                            size="medium"
                            sx={{
                              mt: 1,
                            }}
                            disabled={true}
                          />
                        </Grid>
                        <Grid item xs={6.9}>
                          <Field
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 1 }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  % / Jjg
                                </InputAdornment>
                              ),
                              style: {
                                backgroundColor: true ? "whitesmoke" : "",
                              },
                              // readOnly: true,
                            }}
                            disabled={true}
                            component={TextField}
                            label="Sampah"
                            name="garbageDirtPercentage"
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Field
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            component={TextField}
                            sx={{
                              mt: 1,
                              backgroundColor: true ? "whitesmoke" : "",
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  kg
                                </InputAdornment>
                              ),
                            }}
                            disabled={true}
                            name="garbageDirtKg"
                          />
                        </Grid>
                        <Grid item xs={1.1}>
                          <Checkbox
                            name="waterChecked"
                            checked={values?.waterChecked}
                            size="medium"
                            sx={{
                              mt: 1,
                            }}
                            disabled={true}
                          />
                        </Grid>
                        <Grid item xs={6.9}>
                          <Field
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 1 }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  % / Jjg
                                </InputAdornment>
                              ),
                              style: {
                                backgroundColor: true ? "whitesmoke" : "",
                              },
                              // readOnly: true,
                            }}
                            disabled={true}
                            component={TextField}
                            label="Air"
                            name="waterPercentage"
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Field
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            component={TextField}
                            sx={{
                              mt: 1,
                              backgroundColor: true ? "whitesmoke" : "",
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  kg
                                </InputAdornment>
                              ),
                            }}
                            disabled={true}
                            name="waterKg"
                          />
                        </Grid>
                        <Grid item xs={1.1}>
                          <Checkbox
                            name="parthenocarpyChecked"
                            checked={values?.parthenocarpyChecked}
                            size="medium"
                            sx={{
                              mt: 1,
                            }}
                            disabled={true}
                          />
                        </Grid>
                        <Grid item xs={6.9}>
                          <Field
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 1 }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  % / Jjg
                                </InputAdornment>
                              ),
                              style: {
                                backgroundColor: true ? "whitesmoke" : "",
                              },
                              // readOnly: true,
                            }}
                            disabled={true}
                            component={TextField}
                            label="Parteno"
                            name="parthenocarpyPercentage"
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Field
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            component={TextField}
                            sx={{
                              mt: 1,
                              backgroundColor: true ? "whitesmoke" : "",
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  kg
                                </InputAdornment>
                              ),
                            }}
                            disabled={true}
                            name="parthenocarpyKg"
                          />
                        </Grid>
                        <Grid item xs={1.1}>
                          <Checkbox
                            name="looseFruitChecked"
                            checked={values?.looseFruitChecked}
                            size="medium"
                            sx={{
                              mt: 1,
                            }}
                            disabled={true}
                          />
                        </Grid>
                        <Grid item xs={6.9}>
                          <Field
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 1 }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  % / Jjg
                                </InputAdornment>
                              ),
                              style: {
                                backgroundColor: true ? "whitesmoke" : "",
                              },
                              // readOnly: true,
                            }}
                            disabled={true}
                            component={TextField}
                            label="Brondolan"
                            name="looseFruitPercentage"
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Field
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            component={TextField}
                            sx={{
                              mt: 1,
                              backgroundColor: true ? "whitesmoke" : "",
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  kg
                                </InputAdornment>
                              ),
                            }}
                            disabled={true}
                            name="looseFruitKg"
                          />
                        </Grid>
                        <Grid item xs={1.1}>
                          <Checkbox
                            name="mandatoryDeductionChecked"
                            checked={values?.mandatoryDeductionChecked}
                            size="medium"
                            sx={{
                              mt: 1,
                            }}
                            disabled={true}
                          />
                        </Grid>
                        <Grid item xs={6.9}>
                          <Field
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 1 }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  % / Jjg
                                </InputAdornment>
                              ),
                              style: {
                                backgroundColor: true ? "whitesmoke" : "",
                              },
                            }}
                            disa
                            disabled={true}
                            bled={true}
                            component={TextField}
                            label="Pot. Wajib Vendor"
                            name="mandatoryDeductionPercentage"
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Field
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            component={TextField}
                            sx={{
                              mt: 1,
                              backgroundColor: true ? "whitesmoke" : "",
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  kg
                                </InputAdornment>
                              ),
                            }}
                            disabled={true}
                            name="mandatoryDeductionKg"
                            value={values?.mandatoryDeductionKg}
                          />
                        </Grid>

                        <Grid item xs={1.1}>
                          <Checkbox
                            name="othersChecked"
                            checked={values?.othersChecked}
                            size="medium"
                            sx={{
                              mt: 1,
                            }}
                            disabled={true}
                          />
                        </Grid>
                        <Grid item xs={6.9}>
                          <Field
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 1 }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  % / Jjg
                                </InputAdornment>
                              ),
                              style: {
                                backgroundColor: true ? "whitesmoke" : "",
                              },
                              // readOnly: true,
                            }}
                            disabled={true}
                            component={TextField}
                            label="Pot. Lainnya"
                            name="othersPercentage"
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Field
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            component={TextField}
                            sx={{
                              mt: 1,
                              backgroundColor: true ? "whitesmoke" : "",
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  kg
                                </InputAdornment>
                              ),
                            }}
                            disabled={true}
                            name="othersKg"
                          />
                        </Grid>
                        <Grid item xs={1.1}></Grid>
                        <Grid item xs={10.9}>
                          <Field
                            type="number"
                            variant="outlined"
                            size="small"
                            name="Total Potongan"
                            fullWidth
                            sx={{ mt: 1 }}
                            inputProps={{
                              style: {
                                backgroundColor: true ? "whitesmoke" : "",
                              },
                            }}
                            disabled={true}
                            component={TextField}
                            value={totalPotongan}
                            label="Total Potongan [KG]"
                          />
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
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            label="Operator WB-OUT"
                            value={values?.originWeighOutOperatorName}
                            name="originWeighOutOperatorName"
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
                            label="Waktu WB-IN"
                            name="originWeighInTimestamp"
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
                              mb: 1.5,
                              backgroundColor: "whitesmoke",
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  kg
                                </InputAdornment>
                              ),
                            }}
                            label="BERAT KELUAR - OUT"
                            name="originWeighOutKg"
                            value={
                              values?.originWeighOutKg > 0
                                ? values.originWeighOutKg.toFixed(2)
                                : "0.00"
                            }
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
                            size="small"
                            fullWidth
                            component={TextField}
                            sx={{ mt: 1.5, backgroundColor: "whitesmoke" }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  kg
                                </InputAdornment>
                              ),
                            }}
                            label="TOTAL SEBELUM"
                            name="weightNetto"
                            value={
                              originWeighNetto > 0
                                ? originWeighNetto.toFixed(2)
                                : "0.00"
                            }
                            inputProps={{ readOnly: true }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            component={TextField}
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            label={
                              <span style={{ color: "red" }}>POTONGAN</span>
                            }
                            name="weightNetto"
                            value={totalPotongan}
                            inputProps={{ readOnly: true }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            component={TextField}
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  kg
                                </InputAdornment>
                              ),
                            }}
                            label="TOTAL SESUDAH"
                            name="weightNetto"
                            value={
                              (originWeighNetto - totalPotongan).toFixed(2) ||
                              "0.00"
                            }
                            inputProps={{ readOnly: true }}
                          />
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 2 }}>
                          <Divider>ALASAN</Divider>
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            name="originWeighInRemark"
                            label="Alasan Transaksi Backdate"
                            type="text"
                            multiline
                            rows={5.2}
                            required={true}
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
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

export default PksBackdateTbsView;
