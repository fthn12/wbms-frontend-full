import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  MenuItem,
  Button,
  CircularProgress,
  Grid,
  Divider,
  Paper,
  TextField as TextFieldMUI,
  InputAdornment,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import {
  DriverACP,
  TransportVehicleACP,
  CompanyACP,
  ProductACP,
} from "components/FormManualEntry";
import { TextField, Autocomplete, Select } from "formik-mui";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { StorageTankSelect } from "../../../../../components/FormikMUI";
import ManualEntryConfirmation from "components/ManualEntryConfirmation";
import Header from "../../../../../components/layout/signed/HeaderTransaction";
import moment from "moment";
import { TransactionAPI } from "../../../../../apis";
import * as eDispatchApi from "../../../../../apis/eDispatchApi";
import {
  useAuth,
  useConfig,
  useTransaction,
  useCompany,
  useWeighbridge,
  useProduct,
  useSite,
  useTransportVehicle,
  useStorageTank,
} from "../../../../../hooks";
import { ValueService } from "ag-grid-community";

const BulkingManualEntryWBIn = () => {
  const navigate = useNavigate();

  const transactionAPI = TransactionAPI();
  const { wb } = useWeighbridge();
  const { user } = useAuth();
  const { WBMS, PRODUCT_TYPES } = useConfig();
  const { setWbTransaction, wbTransaction, clearOpenedTransaction } =
    useTransaction();
  const { useGetCompaniesQuery } = useCompany();
  const { useFindManyProductQuery } = useProduct();
  const { useGetSitesQuery } = useSite();
  const { useGetTransportVehiclesQuery } = useTransportVehicle();
  const [originWeightNetto, setOriginWeightNetto] = useState(0);
  const [selectedOption, setSelectedOption] = useState(0);
  const [destinationWeightNetto, setDestinationWeightNetto] = useState(0);

  const { data: dtSite } = useGetSitesQuery();
  const { data: dtCompany } = useGetCompaniesQuery();
  const { data: dtTransport, error } = useGetTransportVehiclesQuery();
  const productFilter = {
    where: {
      productGroupId: 1,
    },
  };
  const { data: dtProduct } = useFindManyProductQuery(productFilter);

  const [dtTypeProduct] = useState(PRODUCT_TYPES);

  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    transportVehiclePlateNo: Yup.string().required("Wajib diisi"),
    transporterCompanyName: Yup.string().required("Wajib diisi"),
    productName: Yup.string().required("Wajib diisi"),
    driverName: Yup.string().required("Wajib diisi"),
  });

  const { useFindManyStorageTanksQuery } = useStorageTank();
  const [dtTrx, setDtTrx] = useState(null);
  const T30Site = eDispatchApi.getT30Site();

  const storageTankFilter = {
    where: {
      OR: [{ siteId: WBMS.SITE.refId }, { siteRefId: WBMS.SITE.refId }],
      refType: 1,
    },
    orderBy: [{ name: "asc" }],
  };

  const { data: dtStorageTank } =
    useFindManyStorageTanksQuery(storageTankFilter);

  const handleClose = () => {
    clearOpenedTransaction();

    navigate("/wb/transactions");
  };

  const handleDispatchSubmit = async (values) => {
    let tempTrans = { ...values };

    setIsLoading(true);
    try {
      const selectedStorageTank = dtStorageTank.records.find(
        (item) => item.id === values.destinationSinkStorageTankId
      );

      if (selectedStorageTank) {
        tempTrans.destinationSinkStorageTankCode =
          selectedStorageTank.code || "";
        tempTrans.destinationSinkStorageTankName =
          selectedStorageTank.name || "";
      }

      const selectedDestinationSite = dtSite.records.find(
        (item) => item.id === WBMS.SITE.id
      );

      if (selectedDestinationSite) {
        tempTrans.destinationSiteId = selectedDestinationSite.id || "";
        tempTrans.destinationSiteCode = selectedDestinationSite.code || "";
        tempTrans.destinationSiteName = selectedDestinationSite.name || "";
      }

      if (WBMS.WB_STATUS === true) {
        tempTrans.destinationWeighInKg = wb.weight;
      }

      tempTrans.progressStatus = 2;
      tempTrans.destinationWeighInTimestamp = moment().toDate();
      tempTrans.destinationWeighInOperatorName = user.name.toUpperCase();
      tempTrans.dtTransaction = moment()
        .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
        .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
        .format();

      const response = await transactionAPI.ManualEntryInDispatch(tempTrans);

      if (!response.status) throw new Error(response?.message);

      clearOpenedTransaction();
      handleClose();
      setWbTransaction({ ...response.data.transaction });

      setIsLoading(false);

      toast.success(`Transaksi WB-IN telah tersimpan.`);
    } catch (error) {
      return toast.error(`${error.message}.`);
    }
  };

  useEffect(() => {
    setDtTrx(moment().format(`DD/MM/YYYY - HH:mm:ss`));
    return () => {};
  }, []);

  useEffect(() => {
    setWbTransaction({
      bonTripNo: `${WBMS.BT_SITE_CODE}${WBMS.BT_SUFFIX_TRX}${moment().format(
        "YYMMDDHHmmss"
      )}`,
    });
  }, []);

  return (
    <Box>
      <Header
        title="Transaksi Bulking"
        subtitle="Transaksi Manual Entry Timbang Masuk"
      />
      {wbTransaction && (
        <Formik
          enableReinitialize
          onSubmit={handleDispatchSubmit}
          initialValues={wbTransaction}
          // isInitialValid={false}
          validationSchema={validationSchema}
        >
          {(props) => {
            const {
              values,
              isValid,
              dirty,
              submitForm,
              setFieldValue,
              handleChange,
            } = props;
            // console.log("Formik props:", props);

            const handleDspSubmit = (normalReason) => {
              if (normalReason.trim().length <= 10)
                return toast.error(
                  "Alasan (MANUAL ENTRY) harus melebihi 10 karakter."
                );

              setFieldValue("destinationWeighInRemark", normalReason);
              setFieldValue("destinationWeighOutRemark", normalReason);

              submitForm();
            };

            return (
              <Form>
                <Box sx={{ display: "flex", mt: 3, justifyContent: "end" }}>
                  {WBMS.WB_STATUS === true && (
                    <ManualEntryConfirmation
                      title="Alasan (MANUAL ENTRY)"
                      caption="SIMPAN"
                      content="Anda yakin melakukan (MANUAL ENTRY) transaksi WB ini? Berikan keterangan yang cukup."
                      onClose={handleDspSubmit}
                      disabled={
                        !(
                          isValid &&
                          wb?.isStable &&
                          wb?.weight > WBMS.WB_MIN_WEIGHT
                        )
                      }
                      sx={{ mr: 1 }}
                      variant="contained"
                    />
                  )}
                  {WBMS.WB_STATUS === false && (
                    <ManualEntryConfirmation
                      title="Alasan (MANUAL ENTRY)"
                      caption="SIMPAN"
                      content="Anda yakin melakukan (MANUAL ENTRY) transaksi WB ini? Berikan keterangan yang cukup."
                      onClose={handleDspSubmit}
                      isDisabled={
                        !(
                          isValid &&
                          values.destinationWeighInKg > WBMS.WB_MIN_WEIGHT
                        )
                      }
                      sx={{ mr: 1 }}
                      variant="contained"
                    />
                  )}

                  {/* <BonTripPrint dtTrans={{ ...values }} isDisable={!isSubmitted} sx={{ mx: 1 }} /> */}
                  <Button variant="contained" onClick={handleClose}>
                    TUTUP
                  </Button>
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
                      />{" "}
                      <Field
                        name="bonTripRef"
                        label="NO BONTRIP ASAL"
                        type="text"
                        component={TextField}
                        variant="outlined"
                        required
                        size="small"
                        fullWidth
                        // inputProps={{ readOnly: true }}
                        sx={{ mb: 2, backgroundColor: "lightyellow" }}
                      />
                      <Field
                        name="productType"
                        label="Tipe Transaksi"
                        component={Select}
                        size="small"
                        inputProps={{ readOnly: true }}
                        formControl={{
                          fullWidth: true,
                          required: true,
                          size: "small",
                        }}
                        sx={{ mb: 2, backgroundColor: "whitesmoke" }}
                        onChange={(event, newValue) => {
                          handleChange(event);
                          const selectedProductType = dtTypeProduct.find(
                            (item) => item.id === event.target.value
                          );
                          setSelectedOption(selectedProductType.id);
                        }}
                      >
                        {dtTypeProduct &&
                          dtTypeProduct.map((data, index) => (
                            <MenuItem key={index} value={data.id}>
                              {data.value}
                            </MenuItem>
                          ))}
                      </Field>
                      <TransportVehicleACP
                        name="transportVehicleId"
                        label="Nomor Plat"
                        isReadOnly={false}
                        sx={{ mb: 2 }}
                      />
                      <DriverACP
                        name="driverName"
                        label="Nama Supir"
                        isReadOnly={false}
                        sx={{ mb: 2 }}
                      />
                      <CompanyACP
                        name="transporterCompanyName"
                        label="Nama Vendor"
                        isReadOnly={false}
                        sx={{ mb: 2 }}
                      />
                      <ProductACP
                        data={dtProduct}
                        name="productId"
                        label="Nama Product"
                        isReadOnly={false}
                        sx={{ mb: 2 }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} lg={3}>
                      <Grid container columnSpacing={1}>
                        <Grid item xs={12}>
                          <Divider>Segel Saat ini</Divider>
                        </Grid>
                        <Grid item xs={6}>
                          <Field
                            name="currentSeal1"
                            label="Segel Mainhole 1 Saat Ini"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                            value={
                              values?.currentSeal1 ? values.currentSeal1 : "-"
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Field
                            name="currentSeal2"
                            label="Segel Valve 1 Saat Ini"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                            value={
                              values?.currentSeal2 ? values.currentSeal2 : "-"
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Field
                            name="currentSeal3"
                            label="Segel Mainhole 2 Saat Ini"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                            value={
                              values?.currentSeal3 ? values.currentSeal3 : "-"
                            }
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Field
                            name="currentSeal4"
                            label="Segel Valve 2 Saat Ini"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            size="small"
                            fullWidth
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            inputProps={{ readOnly: true }}
                            value={
                              values?.currentSeal4 ? values.currentSeal4 : "-"
                            }
                          />
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 2 }}>
                          <Divider>Segel Tangki Isi</Divider>
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
                            sx={{ mt: 2, backgroundColor: "lightyellow" }}
                            // inputProps={{ readOnly: true }}
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
                            sx={{ mt: 2, backgroundColor: "lightyellow" }}
                            // inputProps={{ readOnly: true }}
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
                            sx={{ mt: 2, backgroundColor: "lightyellow" }}
                            // inputProps={{ readOnly: true }}
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
                            sx={{ mt: 2, backgroundColor: "lightyellow" }}
                            // inputProps={{ readOnly: true }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Divider sx={{ mt: 2 }}>Tangki</Divider>
                        </Grid>

                        <Grid item xs={12}>
                          <StorageTankSelect
                            name="destinationSinkStorageTankId"
                            label="Tangki Tujuan"
                            isRequired={true}
                            isReadOnly={false}
                            sx={{ mt: 2 }}
                            backgroundColor="lightyellow"
                            siteId={WBMS.SITE.refId}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12} sm={6} lg={3}>
                      <Grid container columnSpacing={1}>
                        <Grid item xs={12}>
                          <Divider>DATA TIMBANG ASAL</Divider>
                        </Grid>
                        <Grid item xs={6}>
                          <Field
                            type="text"
                            variant="outlined"
                            component={TextField}
                            size="small"
                            fullWidth
                            sx={{ mt: 2, backgroundColor: "whitesmoke" }}
                            label="Operator Asal WB-IN"
                            name="originWeighInOperatorName"
                            value={values?.originWeighInOperatorName || "-"}
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
                            label="Operator Asal WB-OUT"
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
                            label="Waktu Asal WB-IN"
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
                            label="Waktu Asal WB-Out"
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
                            label="BERAT ASAL MASUK - IN"
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
                              mb: 2,
                              backgroundColor: "whitesmoke",
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  kg
                                </InputAdornment>
                              ),
                            }}
                            value={
                              values?.originWeighOutKg > 0
                                ? values.originWeighOutKg.toFixed(2)
                                : "0.00"
                            }
                            label="BERAT ASAL KELUAR - OUT"
                            name="originWeighOutKg"
                            inputProps={{ readOnly: true }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Divider>TOTAL ASAL</Divider>
                        </Grid>
                        <Grid item xs={12}>
                          <Field
                            type="number"
                            variant="outlined"
                            component={TextField}
                            size="small"
                            fullWidth
                            sx={{
                              mt: 2,
                              mb: 2,
                              backgroundColor: "whitesmoke",
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  kg
                                </InputAdornment>
                              ),
                            }}
                            label="TOTAL ASAL"
                            name="originweightNetto"
                            value={
                              originWeightNetto > 0
                                ? originWeightNetto.toFixed(2)
                                : "0.00"
                            }
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
                            name="destinationWeighInOperatorName"
                            value={user.name}
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
                            value={
                              values?.destinationWeighOutOperatorName || "-"
                            }
                            name="destinationWeighOutOperatorName"
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
                            name="destinationWeighInTimestamp"
                            inputProps={{ readOnly: true }}
                            value={dtTrx || "-"}
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
                            name="destinationWeighOutTimestamp"
                            inputProps={{ readOnly: true }}
                            value={
                              values?.destinationWeighOutTimestamp
                                ? moment(values.destinationWeighOutTimestamp)
                                    .local()
                                    .format(`DD/MM/YYYY - HH:mm:ss`)
                                : "-"
                            }
                          />
                        </Grid>
                        {WBMS.WB_STATUS === true && (
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
                              name="destinationWeighInKg"
                              value={
                                wb?.weight > 0 ? wb.weight.toFixed(2) : "0.00"
                              }
                              inputProps={{ readOnly: true }}
                            />
                          </Grid>
                        )}
                        {WBMS.WB_STATUS === false && (
                          <Grid item xs={6}>
                            <Field
                              type="number"
                              variant="outlined"
                              component={TextField}
                              size="small"
                              fullWidth
                              required={true}
                              sx={{ mt: 2, backgroundColor: "lightyellow" }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    kg
                                  </InputAdornment>
                                ),
                              }}
                              label="BERAT MASUK - IN"
                              name="destinationWeighInKg"
                              value={
                                values?.destinationWeighInKg > 0
                                  ? values.destinationWeighInKg
                                  : "0"
                              }
                            />
                          </Grid>
                        )}
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
                                <InputAdornment position="end">
                                  kg
                                </InputAdornment>
                              ),
                            }}
                            value={
                              values?.destinationWeighOutKg > 0
                                ? values.destinationWeighOutKg.toFixed(2)
                                : "0.00"
                            }
                            label="BERAT KELUAR - OUT"
                            name="destinationWeighOutKg"
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
                                <InputAdornment position="end">
                                  kg
                                </InputAdornment>
                              ),
                            }}
                            label="TOTAL"
                            name="weightNetto"
                            value={
                              destinationWeightNetto > 0
                                ? destinationWeightNetto.toFixed(2)
                                : "0.00"
                            }
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

export default BulkingManualEntryWBIn;
