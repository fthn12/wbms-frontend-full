import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Grid, Divider, Paper, TextField as TextFieldMUI } from "@mui/material";
import { Formik, Form, Field } from "formik";
import { TextField, Autocomplete } from "formik-mui";
import { toast } from "react-toastify";
import * as Yup from "yup";
import TBS from "./tbs";
import OTHERS from "./others";
import KERNEL from "./kernel";
import Header from "../../../components/layout/signed/HeaderTransaction";
import moment from "moment";
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

const PksManualEntryBackDate = () => {
  const navigate = useNavigate();

  const transactionAPI = TransactionAPI();
  const { wb } = useWeighbridge();
  const { user } = useAuth();
  const { WBMS, SCC_MODEL } = useConfig();

  const { setWbTransaction, wbTransaction, clearOpenedTransaction, useFindManyTransactionQuery } = useTransaction();
  const { useGetCompaniesQuery } = useCompany();
  const { useGetProductsQuery } = useProduct();
  const { useGetTransportVehiclesQuery } = useTransportVehicle();
  const [originWeighNetto, setOriginWeighNetto] = useState(0);

  const { data: dtCompany } = useGetCompaniesQuery();
  const { data: dtProduct } = useGetProductsQuery();
  const { data: dtTransport, error } = useGetTransportVehiclesQuery();

  const data = {
    where: {
      typeSite: +WBMS.SITE_TYPE,
      // bonTripNo:
    },
  };
  const { data: results } = useFindManyTransactionQuery(data);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const validationSchema = Yup.object().shape({
    // transportVehiclePlateNo: Yup.string().required("Wajib diisi"),
    // transporterCompanyName: Yup.string().required("Wajib diisi"),
    // productName: Yup.string().required("Wajib diisi"),
    // driverName: Yup.string().required("Wajib diisi"),
    // originWeighInTimestamp: Yup.string().required("Wajib diisi"),
    // originWeighOutTimestamp: Yup.string().required("Wajib diisi"),
    // originWeighInKg: Yup.string().required("Wajib diisi"),
    // originWeighOutKg: Yup.string().required("Wajib diisi"),
  });

  const handleClose = () => {
    clearOpenedTransaction();

    navigate("/wb/transactions");
  };

  const handleOthersSubmit = async (values) => {
    let tempTrans = { ...values };

    setIsLoading(true);
    try {
      if (tempTrans.afdeling) {
        tempTrans.afdeling = tempTrans.afdeling.toUpperCase();
      } else if (tempTrans.kebun) {
        tempTrans.kebun = tempTrans.kebun.toUpperCase();
      } else if (tempTrans.blok) {
        tempTrans.blok = tempTrans.blok.toUpperCase();
      } else if (tempTrans.npb) {
        tempTrans.npb = tempTrans.npb.toUpperCase();
      }

      // tempTrans.typeSite = +WBMS.SITE_TYPE;
      tempTrans.progressStatus = 40;
      // tempTrans.typeTransaction = 5;
      tempTrans.originWeighInOperatorName = user.name.toUpperCase();
      tempTrans.originWeighOutOperatorName = user.name.toUpperCase();
      tempTrans.dtTransaction = moment()
        .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
        .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
        .format();

      const response = await transactionAPI.ManualEntryBackDate(tempTrans);

      if (!response.status) throw new Error(response?.message);

      clearOpenedTransaction();
      handleClose();
      setWbTransaction({ ...response.data.transaction });
      setIsLoading(false);

      toast.success(`Data Transaksi Lampau telah tersimpan.`);
      // redirect ke form view
      const id = response?.data?.transaction?.id;
      navigate(`/wb/transactions/pks/manual-entry-other-view/${id}`);
    } catch (error) {
      return toast.error(`${error.message}.`);
    }
  };

  const handleKernelSubmit = async (values) => {
    let tempTrans = { ...values };

    setIsLoading(true);
    try {
      if (tempTrans.afdeling) {
        tempTrans.afdeling = tempTrans.afdeling.toUpperCase();
      } else if (tempTrans.kebun) {
        tempTrans.kebun = tempTrans.kebun.toUpperCase();
      } else if (tempTrans.blok) {
        tempTrans.blok = tempTrans.blok.toUpperCase();
      } else if (tempTrans.npb) {
        tempTrans.npb = tempTrans.npb.toUpperCase();
      }

      // tempTrans.originWeighInKg = wb.weight;
      // tempTrans.originWeighInTimestamp = moment().toDate();
      tempTrans.originWeighInOperatorName = user.name.toUpperCase();
      tempTrans.dtTransaction = moment()
        .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
        .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
        .format();

      const response = await transactionAPI.ManualEntryPksInKernel(tempTrans);

      if (!response.status) throw new Error(response?.message);

      clearOpenedTransaction();
      handleClose();
      setWbTransaction({ ...response.data.transaction });

      setIsLoading(false);

      toast.success(`Data Transaksi Lampau telah tersimpan.`);
      // redirect ke form view
      const id = response?.data?.transaction?.id;
      navigate(`/wb/transactions/pks/manual-entry-kernel-view/${id}`);
    } catch (error) {
      return toast.error(`${error.message}.`);
    }
  };

  const handleTbsSubmit = async (values) => {
    let tempTrans = { ...values };

    setIsLoading(true);
    try {
      if (tempTrans.afdeling) {
        tempTrans.afdeling = tempTrans.afdeling.toUpperCase();
      } else if (tempTrans.kebun) {
        tempTrans.kebun = tempTrans.kebun.toUpperCase();
      } else if (tempTrans.blok) {
        tempTrans.blok = tempTrans.blok.toUpperCase();
      } else if (tempTrans.npb) {
        tempTrans.npb = tempTrans.npb.toUpperCase();
      }

      // tempTrans.originWeighInKg = wb.weight;
      // tempTrans.originWeighInTimestamp = moment().toDate();
      tempTrans.originWeighInOperatorName = user.name.toUpperCase();
      tempTrans.dtTransaction = moment()
        .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
        .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
        .format();

      const response = await transactionAPI.ManualEntryPksInTbs(tempTrans);

      if (!response.status) throw new Error(response?.message);

      clearOpenedTransaction();
      handleClose();
      setWbTransaction({ ...response.data.transaction });

      setIsLoading(false);

      toast.success(`Data Transaksi Lampau telah tersimpan.`);
      // redirect ke form view
      const id = response?.data?.transaction?.id;
      navigate(`/wb/transactions/pks/manual-entry-tbs-view/${id}`);
    } catch (error) {
      return toast.error(`${error.message}.`);
    }
  };

  let count = 1;

  useEffect(() => {
    count = 1;
    const sixDigits = String(count).padStart(6, "0");
    setWbTransaction({
      bonTripNo: `${WBMS.BT_SITE_CODE}${WBMS.BT_SUFFIX_FORM}${moment(selectedDate).format("YYMMDD")}${sixDigits}`,
    });
    count += 1;
  }, [selectedDate]);

  return (
    <Box>
      <Header title="Transaksi PKS" subtitle="Transaksi Manual Entry WB-IN" />
      {wbTransaction && (
        <Formik
          enableReinitialize
          onSubmit={(values) => {
            if (selectedOption === "Others") {
              handleOthersSubmit(values);
            } else if (selectedOption === "Kernel") {
              handleKernelSubmit(values);
            } else if (selectedOption === "Tbs") {
              handleTbsSubmit(values);
            }
          }}
          initialValues={wbTransaction}
          isInitialValid={false}
          validationSchema={validationSchema}
        >
          {(props) => {
            const { values, isValid, submitForm, setFieldValue, handleChange } = props;
            // console.log("Formik props:", props);

            const handleOtrSubmit = () => {
              submitForm();
            };

            const handleKrlSubmit = () => {
              submitForm();
            };
            const handleTbsSubmit = () => {
              submitForm();
            };

            return (
              <Form>
                <Box sx={{ display: "flex", mt: 3, justifyContent: "end" }}>
                  {selectedOption === "Others" && (
                    <Button
                      variant="contained"
                      sx={{ mr: 1 }}
                      disabled={!(isValid && wb?.isStable && wb?.weight > WBMS.WB_MIN_WEIGHT)}
                      onClick={() => handleOtrSubmit()}
                    >
                      SIMPAN
                    </Button>
                  )}
                  {selectedOption === "Kernel" && (
                    <Button
                      variant="contained"
                      sx={{ mr: 1 }}
                      disabled={!(isValid && wb?.isStable && wb?.weight > WBMS.WB_MIN_WEIGHT)}
                      onClick={() => handleKrlSubmit()}
                    >
                      SIMPAN
                    </Button>
                  )}

                  {selectedOption === "Tbs" && (
                    <Button
                      variant="contained"
                      sx={{ mr: 1 }}
                      disabled={!(isValid && wb?.isStable && wb?.weight > WBMS.WB_MIN_WEIGHT)}
                      onClick={() => handleTbsSubmit()}
                    >
                      SIMPAN
                    </Button>
                  )}
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
                        type="date"
                        variant="outlined"
                        component={TextField}
                        size="small"
                        fullWidth
                        name
                        sx={{ mb: 2 }}
                        label="Tanggal Bontrip"
                        value={moment(selectedDate).format("YYYY-MM-DD")}
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />

                      <Field
                        name="bonTripNo"
                        label="NO BONTRIP"
                        type="text"
                        component={TextField}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ mb: 2, backgroundColor: "whitesmoke" }}
                        inputProps={{ readOnly: true }}
                      />
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
                        value={
                          (values && dtCompany?.records?.find((item) => item.id === values.transporterCompanyId)) ||
                          null
                        }
                        onChange={(event, newValue) => {
                          setFieldValue("transporterCompanyId", newValue ? newValue.id : "");
                          setFieldValue("transporterCompanyName", newValue ? newValue.name : "");
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
                        // freeSolo
                        // disableClearable
                        options={(dtProduct?.records || []).filter(
                          (option) => !["cpo", "pko"].includes(option.name.toLowerCase()),
                        )}
                        getOptionLabel={(option) => `[${option.code}] - ${option.name}`}
                        value={(values && dtProduct?.records?.find((item) => item.id === values.productId)) || null}
                        onChange={(event, newValue) => {
                          setFieldValue("transportVehicleProductName", newValue ? newValue.name : "");
                          setFieldValue("transportVehicleId", newValue ? newValue.id : "");
                          setFieldValue("transportVehicleProductCode", newValue ? newValue.code : "");
                          setFieldValue("productName", newValue ? newValue.name : "");
                          setFieldValue("productId", newValue ? newValue.id : "");
                          setFieldValue("productCode", newValue ? newValue.code : "");
                          if (!newValue) {
                            setSelectedOption("");
                          } else {
                            const filterOption = (newValue?.name || "").toLowerCase().includes("kernel")
                              ? "Kernel"
                              : (newValue?.name || "").toLowerCase().includes("tbs")
                              ? "Tbs"
                              : "Others";

                            setSelectedOption(filterOption);
                          }
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
                    </Grid>
                    {/* TBS */}

                    {selectedOption === "Tbs" && <TBS setFieldValue={setFieldValue} values={values} />}

                    {/* Others*/}

                    {selectedOption === "Others" && (
                      <OTHERS setFieldValue={setFieldValue} values={values} handleChange={handleChange} />
                    )}

                    {/* KERNEL*/}

                    {selectedOption === "Kernel" && <KERNEL setFieldValue={setFieldValue} values={values} />}
                  </Grid>
                </Paper>
                {/* {isLoading && (
                  <CircularProgress
                    size={50}
                    sx={{
                      color: "goldenrod",
                      position: "absolute",
                      top: "50%",
                      left: "48.5%",
                    }}
                  />
                )} */}
              </Form>
            );
          }}
        </Formik>
      )}
      {!wbTransaction && (
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

export default PksManualEntryBackDate;
