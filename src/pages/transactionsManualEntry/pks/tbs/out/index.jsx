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
  MenuItem,
  TextField as TextFieldMUI,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import { TextField, Autocomplete, Select } from "formik-mui";
import * as Yup from "yup";
import { toast } from "react-toastify";
import moment from "moment";
import Header from "../../../../../components/layout/signed/HeaderTransaction";
import SortasiTBS from "../../../../../components/SortasiTBS";
import SortasiKernel from "../../../../../components/SortasiKernel";

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

const PksManualEntryTbsOut = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const transactionAPI = TransactionAPI();
  const { wb } = useWeighbridge();
  const { id } = useParams();
  const { WBMS, PRODUCT_TYPES } = useConfig();
  const { openedTransaction, clearWbTransaction, setOpenedTransaction, setWbTransaction, clearOpenedTransaction } =
    useTransaction();
  const { useGetDriversQuery } = useDriver();
  const { useGetCompaniesQuery } = useCompany();
  const { useFindManyProductQuery } = useProduct();
  const { useGetTransportVehiclesQuery } = useTransportVehicle();
  const { setSidebar } = useApp();
  const [selectedOption, setSelectedOption] = useState("");

  const { data: dtCompany } = useGetCompaniesQuery();
  const { data: dtDrivers } = useGetDriversQuery();
  const { data: dtTransport, error } = useGetTransportVehiclesQuery();

  const productFilter = {
    where: {
      productGroupId: selectedOption,
    },
  };
  const { data: dtProduct, refetch: refetchProducts } = useFindManyProductQuery(productFilter);

  const [dtTypeProduct] = useState(PRODUCT_TYPES);

  const [originWeighNetto, setOriginWeighNetto] = useState(0);
  const [totalPotongan, setTotalPotongan] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [dtTrx, setDtTrx] = useState(null);

  const validationSchema = Yup.object().shape({
    transportVehiclePlateNo: Yup.string().required("Wajib diisi"),
    transporterCompanyName: Yup.string().required("Wajib diisi"),
    productName: Yup.string().required("Wajib diisi"),
    driverName: Yup.string().required("Wajib diisi"),
  });

  const handleClose = () => {
    clearOpenedTransaction();

    navigate("/wb/transactions");
  };

  const handleFormikSubmit = async (values) => {
    let tempTrans = { ...values };

    setIsLoading(true);

    try {
      if (tempTrans.sptbs) {
        tempTrans.sptbs = parseInt(tempTrans.sptbs);
      }

      if (!tempTrans.mandatoryDeductionChecked) {
        delete tempTrans.mandatoryDeductionKg;
      }

      if (!tempTrans.othersChecked) {
        delete tempTrans.othersKg;
      }

      if (tempTrans.afdeling) {
        tempTrans.afdeling = tempTrans.afdeling.toUpperCase();
      } else if (tempTrans.kebun) {
        tempTrans.kebun = tempTrans.kebun.toUpperCase();
      } else if (tempTrans.blok) {
        tempTrans.blok = tempTrans.blok.toUpperCase();
      } else if (tempTrans.npb) {
        tempTrans.npb = tempTrans.npb.toUpperCase();
      }

      if (selectedOption === 2) {
        tempTrans.progressStatus = 40;
      } else if (selectedOption === 3) {
        tempTrans.progressStatus = 41;
      } else if (selectedOption === 4) {
        tempTrans.progressStatus = 42;
      }

      tempTrans.productType = parseInt(tempTrans.productType);
      tempTrans.originWeighOutKg = wb.weight;
      tempTrans.originWeighOutTimestamp = moment().toDate();
      tempTrans.originWeighOutOperatorName = user.name.toUpperCase();
      tempTrans.dtTransaction = moment()
        .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
        .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
        .format();

      const response = await transactionAPI.updateById(tempTrans.id, { ...tempTrans });

      if (!response.status) throw new Error(response?.message);

      clearWbTransaction();
      setIsLoading(false);

      toast.success(`Transaksi WB-OUT telah tersimpan.`);
      // redirect ke form view
      const id = response?.data?.transaction?.id;
      if (selectedOption === 2) {
        navigate(`/wb/transactions/pks/manual-entry-tbs-view/${id}`);
      } else if (selectedOption === 3) {
        navigate(`/wb/transactions/pks/manual-entry-kernel-view/${id}`);
      } else if (selectedOption === 4) {
        navigate(`/wb/transactions/pks/manual-entry-other-view/${id}`);
      }

      return;
    } catch (error) {
      setIsLoading(false);
      toast.error(`${error.message}.`);

      return;
    }
  };

  useEffect(() => {
    setDtTrx(moment().format(`DD/MM/YYYY - HH:mm:ss`));
    setSidebar({ selected: "Transaksi WB PKS" });

    return () => {
      // console.clear();
    };
  }, []);

  useEffect(() => {
    if (selectedOption) {
      refetchProducts({ force: true });
    }
  }, [selectedOption, refetchProducts]);

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
        setSelectedOption(res.data.transaction.productType);
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
        openedTransaction.othersKg,
    );
    setTotalPotongan(total);
  }, [openedTransaction]);

  return (
    <Box>
      <Header title="Transaksi PKS" subtitle="Transaksi Manual Entry WB-OUT" />
      {openedTransaction && (
        <Formik
          // enableReinitialize
          onSubmit={handleFormikSubmit}
          initialValues={openedTransaction}
          validationSchema={validationSchema}
          // isInitialValid={false}
        >
          {(props) => {
            const { values, isValid, setFieldValue, handleChange } = props;
            // console.log("Formik props:", props);

            return (
              <Form>
                <Box sx={{ display: "flex", mt: 3, justifyContent: "end" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mr: 1 }}
                    disabled={
                      !(isValid && wb?.isStable && wb?.weight > WBMS.WB_MIN_WEIGHT && values.progressStatus === 35)
                    }
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
                        inputProps={{ readOnly: true }}
                      />
                      <Field
                        name="productType"
                        label="Tipe Produk"
                        component={Select}
                        size="small"
                        formControl={{
                          fullWidth: true,
                          required: true,
                          size: "small",
                        }}
                        sx={{ mb: 2 }}
                        onChange={(event, newValue) => {
                          handleChange(event);
                          const selectedProductType = dtTypeProduct.find((item) => item.id === event.target.value);
                          setSelectedOption(selectedProductType.id);
                          setFieldValue("productName", "");
                          setFieldValue("productId", "");
                          setFieldValue("productCode", "");
                          setFieldValue("transportVehicleProductName", "");
                          setFieldValue("transportVehicleId", "");
                          setFieldValue("transportVehicleProductCode", "");
                        }}
                      >
                        {dtTypeProduct &&
                          dtTypeProduct.map((data, index) => (
                            <MenuItem key={index} value={data.id}>
                              {data.value}
                            </MenuItem>
                          ))}
                      </Field>

                      {(selectedOption === 2 || selectedOption === 3 || selectedOption === 4) && (
                        <>
                          <Field
                            name="transportVehiclePlateNo"
                            component={Autocomplete}
                            variant="outlined"
                            fullWidth
                            freeSolo
                            disableClearable
                            options={dtTransport?.records.map((record) => record.plateNo)}
                            onInputChange={(event, InputValue, reason) => {
                              if (reason !== "reset") {
                                setFieldValue("transportVehiclePlateNo", InputValue.toUpperCase());
                              }
                            }}
                            renderInput={(params) => (
                              <TextFieldMUI
                                {...params}
                                label="Nomor Plat"
                                name="transportVehiclePlateNo"
                                size="small"
                                inputProps={{
                                  ...params.inputProps,
                                  style: { textTransform: "uppercase" },
                                }}
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
                            onChange={(event, newValue) => {
                              setFieldValue("transporterCompanyName", newValue ? newValue.name : "");
                              setFieldValue("transporterCompanyId", newValue ? newValue.id : "");
                              setFieldValue("transporterCompanyCode", newValue ? newValue.code : "");
                              setFieldValue("mandatoryDeductionPercentage", newValue ? newValue.potonganWajib : "");
                            }}
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
                            options={dtProduct?.records || []}
                            getOptionLabel={(option) => `[${option.code}] - ${option.name}`}
                            value={dtProduct?.records?.find((item) => item.id === values.productId) || null}
                            onChange={(event, newValue) => {
                              setFieldValue("transportVehicleProductName", newValue ? newValue.name : "");
                          
                              setFieldValue("transportVehicleProductCode", newValue ? newValue.code : "");
                              setFieldValue("productName", newValue ? newValue.name : "");
                              setFieldValue("productId", newValue ? newValue.id : "");
                              setFieldValue("productCode", newValue ? newValue.code : "");
                            }}
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
                        </>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                      <Grid container columnSpacing={1}>
                        {(selectedOption === 2 || selectedOption === 3 || selectedOption === 4) && (
                          <Grid item xs={12}>
                            <Divider>DATA SUPIR & MUATAN</Divider>
                          </Grid>
                        )}
                        <Grid item xs={12}>
                          {(selectedOption === 2 || selectedOption === 3 || selectedOption === 4) && (
                            <>
                              <Field
                                name="driverName"
                                component={Autocomplete}
                                variant="outlined"
                                fullWidth
                                freeSolo
                                disableClearable
                                options={dtDrivers?.records.map((record) => record.name)}
                                onInputChange={(event, InputValue, reason) => {
                                  if (reason !== "reset") {
                                    setFieldValue("driverName", InputValue.toUpperCase());
                                  }
                                }}
                                renderInput={(params) => (
                                  <TextFieldMUI
                                    {...params}
                                    name="driverName"
                                    size="small"
                                    label="Nama Supir"
                                    sx={{ mt: 2 }}
                                    inputProps={{
                                      ...params.inputProps,
                                      style: { textTransform: "uppercase" },
                                    }}
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
                                value={values?.tahun}
                                sx={{ mt: 2, mb: 2.5 }}
                              />{" "}
                            </>
                          )}
                          {selectedOption === 2 && (
                            <>
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
                                sx={{ mt: 2.5 }}
                              />
                            </>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                    {selectedOption === 2 && (
                      <Grid item xs={12} sm={6} lg={3}>
                        <Grid container columnSpacing={1}>
                          <Grid item xs={12}>
                            <Divider sx={{ mb: 2 }}>KUALITAS TBS</Divider>
                          </Grid>
                          <SortasiTBS isReadOnly={false} />
                        </Grid>
                      </Grid>
                    )}
                    {selectedOption === 3 && (
                      <Grid item xs={12} sm={6} lg={3}>
                        <Grid container columnSpacing={1}>
                          <Grid item xs={12}>
                            <Divider sx={{ mb: 2 }}>KUALITAS KERNEL</Divider>
                          </Grid>
                          <SortasiKernel isReadOnly={false} />
                        </Grid>
                      </Grid>
                    )}
                    <Grid item xs={12} sm={6} lg={3}>
                      <Grid container columnSpacing={1}>
                        {(selectedOption === 2 || selectedOption === 3 || selectedOption === 4) && (
                          <>
                            <Grid item xs={12}>
                              <Divider>DATA TIMBANG KENDARAAN</Divider>
                            </Grid>

                            <Grid item xs={6}>
                              <Field
                                type="text"
                                variant="outlined"
                                size="small"
                                fullWidth
                                component={TextField}
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
                                size="small"
                                fullWidth
                                component={TextField}
                                sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                                label="Operator WB-OUT"
                                value={user.name}
                                name="originWeighOutOperatorName"
                                inputProps={{ readOnly: true, style: { textTransform: "uppercase" } }}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <Field
                                type="text"
                                variant="outlined"
                                size="small"
                                fullWidth
                                component={TextField}
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
                                type="text"
                                variant="outlined"
                                size="small"
                                fullWidth
                                component={TextField}
                                sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                                label="Waktu WB-Out"
                                name="originWeighOutTimestamp"
                                inputProps={{ readOnly: true }}
                                value={dtTrx || "-"}
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <Field
                                type="number"
                                variant="outlined"
                                size="small"
                                fullWidth
                                component={TextField}
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
                                type="number"
                                variant="outlined"
                                size="small"
                                fullWidth
                                component={TextField}
                                sx={{ mt: 2, mb: 1.5, backgroundColor: "whitesmoke" }}
                                InputProps={{
                                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                                }}
                                label="BERAT KELUAR - OUT"
                                name="originWeighOutKg"
                                value={wb?.weight > 0 ? wb.weight.toFixed(2) : "0.00"}
                                inputProps={{ readOnly: true }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Divider>TOTAL</Divider>
                            </Grid>
                          </>
                        )}
                        {selectedOption === 4 && (
                          <Grid item xs={12}>
                            <Field
                              type="number"
                              variant="outlined"
                              component={TextField}
                              size="small"
                              fullWidth
                              sx={{ mt: 1.5, backgroundColor: "whitesmoke" }}
                              InputProps={{
                                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                              }}
                              label="TOTAL"
                              name="weightNetto"
                              value={originWeighNetto > 0 ? originWeighNetto.toFixed(2) : "0.00"}
                            />
                          </Grid>
                        )}
                        {selectedOption === 3 && (
                          <>
                            <Grid item xs={12}>
                              <Field
                                type="number"
                                variant="outlined"
                                size="small"
                                fullWidth
                                component={TextField}
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
                              <Field
                                type="number"
                                variant="outlined"
                                size="small"
                                fullWidth
                                component={TextField}
                                sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                                label="POTONGAN"
                                name="weightNetto"
                                value={0}
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
                                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                                }}
                                label="TOTAL SESUDAH"
                                name="weightNetto"
                                value="0.00"
                                inputProps={{ readOnly: true }}
                              />
                            </Grid>
                          </>
                        )}
                        {selectedOption === 2 && (
                          <>
                            <Grid item xs={12}>
                              <Field
                                type="number"
                                variant="outlined"
                                size="small"
                                fullWidth
                                component={TextField}
                                sx={{ mt: 1.5, backgroundColor: "whitesmoke" }}
                                InputProps={{
                                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                                }}
                                label="TOTAL SEBELUM"
                                name="weightNetto"
                                // value={originWeighNetto > 0 ? originWeighNetto.toFixed(2) : "0.00"}
                                value={originWeighNetto > 0 ? originWeighNetto.toFixed(2) : "0.00"}
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
                                label={<span style={{ color: "red" }}>POTONGAN</span>}
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
                                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                                }}
                                label="TOTAL SESUDAH"
                                name="weightNetto"
                                value={Math.abs(originWeighNetto - totalPotongan).toFixed(2) || "0.00"}
                                inputProps={{ readOnly: true }}
                              />
                            </Grid>
                          </>
                        )}
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

export default PksManualEntryTbsOut;
