import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  TextField as TextFiledMUI,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import { TextField, Select } from "formik-mui";
import * as yup from "yup";
import { toast } from "react-toastify";
import moment from "moment";
import numeral from "numeral";

import Header from "../../../components/layout/signed/HeaderTransaction";
import BonTripPrint from "../../../components/BonTripPrint";

import { TransactionAPI } from "../../../apis";

import { useConfig, useTransaction, useTransportVehicle } from "../../../hooks";

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

const PksEDispatchNew = () => {
  const navigate = useNavigate();

  const transactionAPI = TransactionAPI();

  const { WBMS, SCC_MODEL } = useConfig();
  const { openedTransaction, setOpenedTransaction, clearOpenedTransaction } = useTransaction();
  const { useGetTransportVehiclesQuery } = useTransportVehicle();

  const [originWeighNetto, setOriginWeighNetto] = useState(0);

  const { data: dtTransportVehicles } = useGetTransportVehiclesQuery();

  const [canSubmit, setCanSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleClose = () => {
    clearOpenedTransaction();

    navigate("/wb/transactions");
  };

  const handleSubmit = async (values) => {
    let tempTrans = { ...values };

    try {
      const data = { openedTransaction: { ...tempTrans } };

      // const response = await transactionAPI.eDispatchPksWbOutNormalAfter(data);
      // Hanya save ke DB, tidak ke eDispatch

      // if (!response.status) {
      //   throw new Error(response?.message);
      // }

      // setValues({ ...response.data.transaction });
      setIsSubmitted(true);

      toast.success(`Transaksi WB-OUT telah tersimpan.`);
    } catch (error) {
      return toast.error(`${error.message}..!!`);
    }
  };

  useEffect(() => {
    if (!openedTransaction) return handleClose();

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
      <Header title="TRANSAKSI PKS" subtitle="MEMBUAT BARU TRANSAKSI WB SECARA MANUAL" />

      <Formik
        enableReinitialize
        onSubmit={handleSubmit}
        initialValues={openedTransaction}
        validationSchema={validationSchema}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => {
          return (
            <Form>
              <Box display="flex" sx={{ mt: 3 }}>
                <Box flex={1}></Box>
                <Button variant="contained" onClick={handleClose}>
                  TUTUP
                </Button>
              </Box>

              <Paper sx={{ mt: 1, p: 2, minHeight: "71.5vh" }}>
                <Grid container spacing={1}>
                  <Grid item xs={6} sm={3}>
                    <Grid container columnSpacing={1}>
                      <Grid item xs={12}>
                        <Field
                          name="bonTripNo"
                          label="Nomor BONTrip"
                          type="text"
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ backgroundColor: "whitesmoke" }}
                          inputProps={{ readOnly: true }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          id="transportVehicleId"
                          labelId="transportVehicleIdLbl"
                          name="transportVehicleId"
                          label="NOPOL"
                          component={Select}
                          // disabled
                          size="small"
                          formControl={{
                            fullWidth: true,
                            required: true,
                            sx: {
                              mt: 2,
                            },
                          }}
                        >
                          {dtTransportVehicles?.records &&
                            dtTransportVehicles.records?.map((data, index) => (
                              <MenuItem key={index} value={data.id}>
                                {`[${data.plateNo}] ${data.companyName} ${data.sccModel}`}
                              </MenuItem>
                            ))}
                        </Field>
                      </Grid>
                    </Grid>
                    <Field
                      name="transportVehiclePlateNo"
                      label="NOMOR POLISI"
                      type="text"
                      component={TextField}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                      inputProps={{ readOnly: true }}
                    />
                    <Field
                      name="driverName"
                      label="NAMA SUPIR"
                      type="text"
                      component={TextField}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                      inputProps={{ readOnly: true }}
                    />
                    <Field
                      name="transporterCompanyName"
                      label="NAMA VENDOR/TRANSPORTER"
                      type="text"
                      component={TextField}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                      inputProps={{ readOnly: true }}
                    />
                    <Field
                      name="transportVehicleSccModel"
                      label="SERTIFIKASI TRUK"
                      type="text"
                      component={TextField}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                      inputProps={{ readOnly: true }}
                    />
                  </Grid>

                  <Grid item xs={3} sm={6}>
                    <Field
                      name="originWeighInKg"
                      label="Berat MASUK -IN"
                      type="number"
                      component={TextField}
                      variant="outlined"
                      size="small"
                      fullWidth
                      InputProps={{
                        endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                      }}
                    />
                    <Field
                      name="originWeighOutKg"
                      label="Berat KELUAR - OUT"
                      type="number"
                      component={TextField}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ mt: 2 }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                      }}
                    />
                    <Field
                      name="weightNetto"
                      label="TOTAL"
                      type="number"
                      component={TextField}
                      variant="outlined"
                      size="small"
                      fullWidth
                      sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                      }}
                      value={Math.abs(values.originWeighOutKg - values.originWeighInKg)}
                      inputProps={{ readOnly: true }}
                    />

                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2, mb: 1 }}
                      onClick={handleSubmit}
                      disabled={!(canSubmit && !isSubmitted)}
                    >
                      Simpan
                    </Button>

                    <BonTripPrint dtTrans={{ ...values }} isDisable={!isSubmitted} />
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
                  }}
                />
              )}
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default PksEDispatchNew;
