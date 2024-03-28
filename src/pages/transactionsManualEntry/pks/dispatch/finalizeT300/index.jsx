import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Divider,
  InputAdornment,
  CircularProgress,
  Grid,
  Paper,
} from "@mui/material";
import moment from "moment";
import { Formik, Form, Field } from "formik";
import { TextField, Select } from "formik-mui";

import * as Yup from "yup";

import { StorageTankSelect } from "../../../../../components/FormikMUI";
import Header from "../../../../../components/layout/signed/Header";

import { TransactionAPI } from "../../../../../apis";
import {
  useAuth,
  useConfig,
  useTransaction,
  useProduct,
  useWeighbridge,
  useStorageTank,
  useSite,
} from "../../../../../hooks";

const validationSchema = Yup.object().shape({
  destinationSinkStorageTankId: Yup.string().required("Wajib diisi"),
  destinationWeighInKg: Yup.number().required("Wajib diisi"),
  destinationWeighOutKg: Yup.number().required("Wajib diisi"),
  destinationWeighInTimestamp: Yup.date().required("Wajib diisi"),
  destinationWeighOutTimestamp: Yup.date().required("Wajib diisi"),
  unloadingTimestamp: Yup.date().required("Wajib diisi"),
  unloadingOperatorName: Yup.string().required("Wajib diisi"),
  unloadedSeal1: Yup.string().required("Wajib diisi"),
  unloadedSeal2: Yup.string().required("Wajib diisi"),
});
const UserCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const transactionAPI = TransactionAPI();
  const { WBMS, ROLES } = useConfig();

  const [dtRoles] = useState(ROLES);
  const [isLoading, setIsLoading] = useState(false);

  const { openedTransaction, clearWbTransaction, clearOpenedTransaction } =
    useTransaction();

  const [originWeighNetto, setOriginWeighNetto] = useState(0);

  const { useFindManyStorageTanksQuery } = useStorageTank();
  const { useGetSitesQuery } = useSite();
  const { data: dtSite } = useGetSitesQuery();

  const storageTankFilter = {
    where: {
      OR: [
        { siteId: WBMS.DESTINATION_SITE.refId },
        { siteRefId: WBMS.DESTINATION_SITE.refId },
      ],
      refType: 1,
    },
  };

  const { data: dtStorageTank } =
    useFindManyStorageTanksQuery(storageTankFilter);

  const handleClose = () => {
    clearOpenedTransaction();

    navigate("/wb/transactions");
  };

  const handleFormikSubmit = async (values) => {
    let tempTrans = { ...values };

    setIsLoading(true);

    try {
      const selected = dtStorageTank.records.find(
        (item) => item.id === values.destinationSinkStorageTankId
      );

      if (selected) {
        tempTrans.destinationSinkStorageTankCode = selected.code || "";
        tempTrans.destinationSinkStorageTankName = selected.name || "";
      }

      const selectedDestinationSite = dtSite.records.find(
        (item) => item.id === WBMS.DESTINATION_SITE.id
      );

      if (selectedDestinationSite) {
        tempTrans.destinationSiteId = selectedDestinationSite.id || "";
        tempTrans.destinationSiteCode = selectedDestinationSite.code || "";
        tempTrans.destinationSiteName = selectedDestinationSite.name || "";
      }

      tempTrans.isManualEntry = 1;
      tempTrans.typeTransaction = 5;
      tempTrans.progressStatus = 21;
      tempTrans.deliveryStatus = 38;
      tempTrans.deliveryDate = moment().toDate();
      tempTrans.unloadingOperatorName =
        tempTrans.unloadingOperatorName.toUpperCase();
      tempTrans.destinationWeighInTimestamp = moment(
        tempTrans.destinationWeighInTimestamp
      ).toISOString();
      tempTrans.destinationWeighOutTimestamp = moment(
        tempTrans.destinationWeighOutTimestamp
      ).toISOString();

      tempTrans.unloadingTimestamp = moment(
        tempTrans.unloadingTimestamp
      ).toISOString();

      const response = await transactionAPI.updateById(tempTrans.id, {
        ...tempTrans,
      });

      if (!response.status) throw new Error(response?.message);

      clearWbTransaction();
      setIsLoading(false);

      toast.success(`Transaksi dari T300 telah tersimpan.`);
      handleClose();
      return;
    } catch (error) {
      setIsLoading(false);
      toast.error(`${error.message}.`);

      return;
    }
  };

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

  return (
    <Box mt={1}>
      <Header
        title="PENYESELAIAN TRANSAKSI T300"
        subtitle="Penyeselaian Transaksi Di T300"
      />

      <Formik
        enableReinitialize
        onSubmit={handleFormikSubmit}
        initialValues={openedTransaction}
        validationSchema={validationSchema}
      >
        {({ errors, values, isValid, dirty }) => {
          return (
            <Form>
              <Box sx={{ display: "flex", mt: 3, justifyContent: "end" }}>
                {/* <Box flex={1}></Box> */}
                <Button
                  type="submit"
                  variant="contained"
                  b
                  disabled={!(isValid && dirty)}
                >
                  SIMPAN
                </Button>

                <Button
                  variant="contained"
                  sx={{ ml: 2 }}
                  onClick={handleClose}
                >
                  BATAL
                </Button>
              </Box>

              <Paper sx={{ mt: 4, minHeight: "71.5vh" }}>
                <Grid container justifyContent="center" spacing={3}>
                  <Grid item xs={12} sm={6} lg={4}>
                    <Grid container columnSpacing={1}>
                      <Grid item xs={12}>
                        <Divider>DATA TIMBANG KENDARAAN PKS</Divider>
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
                          value={values?.originWeighInOperatorName || "-"}
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
                          label="Operator WB-OUT"
                          value={values?.originWeighOutOperatorName || "-"}
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
                              <InputAdornment position="end">kg</InputAdornment>
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
                          sx={{ mt: 2, mb: 2, backgroundColor: "whitesmoke" }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">kg</InputAdornment>
                            ),
                          }}
                          value={
                            values?.originWeighOutKg > 0
                              ? values.originWeighOutKg.toFixed(2)
                              : "0.00"
                          }
                          label="BERAT KELUAR - OUT"
                          name="originWeighOutKg"
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
                          component={TextField}
                          size="small"
                          fullWidth
                          sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">kg</InputAdornment>
                            ),
                          }}
                          label="TOTAL"
                          name="weightNetto"
                          value={
                            originWeighNetto > 0
                              ? originWeighNetto.toFixed(2)
                              : "0.00"
                          }
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Grid container justifyContent="center" spacing={2}>
                      <Grid item xs={12}>
                        <Divider>DATA TIMBANG KENDARAAN T300</Divider>
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          name="unloadingOperatorName"
                          label="OPERATOR UNLOADING"
                          type="text"
                          required={true}
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{
                            backgroundColor: "lightyellow",
                          }}
                          inputProps={{
                            style: { textTransform: "uppercase" },
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          type="datetime-local"
                          variant="outlined"
                          component={TextField}
                          size="small"
                          fullWidth
                          required={true}
                          sx={{
                            backgroundColor: "lightyellow",
                          }}
                          label="WAKTU BONGKAR"
                          name="unloadingTimestamp"
                          value={moment(values?.unloadingTimestamp).format(
                            "YYYY-MM-DDTHH:mm"
                          )}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          type="number"
                          variant="outlined"
                          component={TextField}
                          size="small"
                          fullWidth
                          required={true}
                          sx={{
                            backgroundColor: "lightyellow",
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">kg</InputAdornment>
                            ),
                          }}
                          label="BERAT ASAL MASUK - IN"
                          name="destinationWeighInKg"
                          value={
                            values?.destinationWeighInKg > 0
                              ? values.destinationWeighInKg
                              : "0"
                          }
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          type="datetime-local"
                          variant="outlined"
                          component={TextField}
                          size="small"
                          fullWidth
                          required={true}
                          sx={{
                            backgroundColor: "lightyellow",
                          }}
                          label="WAKTU ASAL MASUK - IN"
                          name="destinationWeighInTimestamp"
                          value={moment(
                            values?.destinationWeighInTimestamp
                          ).format("YYYY-MM-DDTHH:mm")}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          type="number"
                          variant="outlined"
                          component={TextField}
                          size="small"
                          fullWidth
                          required={true}
                          sx={{
                            backgroundColor: "lightyellow",
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">kg</InputAdornment>
                            ),
                          }}
                          label="BERAT ASAL KELUAR - OUT"
                          name="destinationWeighOutKg"
                          value={
                            values?.destinationWeighOutKg > 0
                              ? values.destinationWeighOutKg
                              : "0"
                          }
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          type="datetime-local"
                          variant="outlined"
                          component={TextField}
                          size="small"
                          fullWidth
                          required={true}
                          sx={{
                            backgroundColor: "lightyellow",
                          }}
                          label="WAKTU ASAL KELUAR - OUT"
                          name="destinationWeighOutTimestamp"
                          value={moment(
                            values?.destinationWeighOutTimestamp
                          ).format("YYYY-MM-DDTHH:mm")}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Divider>Segel Tangki Bongkar T300</Divider>
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          name="unloadedSeal1"
                          label="Segel BONGKAR Mainhole 1"
                          type="text"
                          required={true}
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{
                            backgroundColor: "lightyellow",
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          name="unloadedSeal2"
                          label="Segel BONGKAR Valve 1"
                          type="text"
                          required={true}
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{
                            backgroundColor: "lightyellow",
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          name="unloadedSeal3"
                          label="Segel BONGKAR Mainhole 2"
                          type="text"
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{
                            backgroundColor: "lightyellow",
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          name="unloadedSeal4"
                          label="Segel BONGKAR Valve 2"
                          type="text"
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{
                            backgroundColor: "lightyellow",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Divider>Tangki Tujuan</Divider>
                      </Grid>
                      <Grid item xs={12}>
                        <StorageTankSelect
                          name="destinationSinkStorageTankId"
                          label="Tangki Tujuan"
                          isRequired={true}
                          isReadOnly={false}
                          backgroundColor="lightyellow"
                          siteId={WBMS.DESTINATION_SITE.refId}
                        />
                      </Grid>
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

export default UserCreate;
