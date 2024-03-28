import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Grid,
  Divider,
  Paper,
  TextField as TextFieldMUI,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import {
  DriverACP,
  CompanyACP,
  ProductACP,
  TransportVehicleACP,
} from "components/FormManualEntry";
import { TextField, Autocomplete, Select } from "formik-mui";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Normal from "./dispatch/normal";
import Cancel from "./dispatch/cancel";
import OTHERS from "./others";
import Header from "components/layout/signed/HeaderTransaction";
import CancelConfirmation from "components/CancelConfirmation";
import ManualEntryConfirmation from "components/ManualEntryConfirmation";
import moment from "moment";
import { TransactionAPI } from "../../../../apis";
import * as eDispatchApi from "../../../../apis/eDispatchApi";
import {
  useAuth,
  useConfig,
  useTransaction,
  useCompany,
  useWeighbridge,
  useProduct,
  useTransportVehicle,
  useStorageTank,
  useSite,
} from "../../../../hooks";

const T30ManualEntryWBIn = () => {
  const navigate = useNavigate();

  const transactionAPI = TransactionAPI();
  const { wb } = useWeighbridge();
  const { user } = useAuth();
  const { WBMS, PRODUCT_TYPES, BACKDATESTATUS } = useConfig();
  const { setWbTransaction, wbTransaction, clearOpenedTransaction } =
    useTransaction();
  const { useGetCompaniesQuery } = useCompany();
  const { useFindManyProductQuery } = useProduct();
  const { useGetSitesQuery } = useSite();
  const { useGetTransportVehiclesQuery } = useTransportVehicle();

  const [selectedOption, setSelectedOption] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");

  const { data: dtCompany } = useGetCompaniesQuery();
  const { data: dtSite } = useGetSitesQuery();
  const { data: dtTransport, error } = useGetTransportVehiclesQuery();

  const productFilter = {
    where: {
      productGroupId: selectedOption,
    },
  };
  const { data: dtProduct } = useFindManyProductQuery(productFilter);

  const [dtTypeProduct] = useState(PRODUCT_TYPES);
  const [dtProgresStatus] = useState(BACKDATESTATUS);

  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    transportVehiclePlateNo: Yup.string().required("Wajib diisi"),
    transporterCompanyName: Yup.string().required("Wajib diisi"),
    productName: Yup.string().required("Wajib diisi"),
    driverName: Yup.string().required("Wajib diisi"),
    // originWeighInTimestamp: Yup.date().required("Wajib diisi"),
    // originWeighOutTimestamp: Yup.date().required("Wajib diisi"),
  });

  const { useFindManyStorageTanksQuery } = useStorageTank();
  const T30Site = eDispatchApi.getT30Site();

  const storageTankFilter = {
    where: {
      OR: [{ siteId: WBMS.SITE.refId }, { siteRefId: WBMS.SITE.refId }],
      refType: 1,
    },
  };

  const { data: dtStorageTank } =
    useFindManyStorageTanksQuery(storageTankFilter);

  const handleClose = () => {
    clearOpenedTransaction();

    navigate("/wb/transactions-backdate-form");
  };

  const handleDispatchNormal = async (values) => {
    let tempTrans = { ...values };

    setIsLoading(true);
    try {
      const selectedStorageTank = dtStorageTank.records.find(
        (item) => item.id === values.originSourceStorageTankId
      );

      if (selectedStorageTank) {
        tempTrans.originSourceStorageTankCode = selectedStorageTank.code || "";
        tempTrans.originSourceStorageTankName = selectedStorageTank.name || "";
      }

      const selectedSite = dtSite.records.find(
        (item) => item.id === WBMS.SITE.id
      );

      if (selectedSite) {
        tempTrans.originSiteId = selectedSite.id || "";
        tempTrans.originSiteCode = selectedSite.code || "";
        tempTrans.originSiteName = selectedSite.name || "";
      }

      const selectedDestinationSite = dtSite.records.find(
        (item) => item.id === WBMS.DESTINATION_SITE.id
      );

      if (selectedDestinationSite) {
        tempTrans.destinationSiteId = selectedDestinationSite.id || "";
        tempTrans.destinationSiteCode = selectedDestinationSite.code || "";
        tempTrans.destinationSiteName = selectedDestinationSite.name || "";
      }
      if (tempTrans.rspoSccModel) {
        tempTrans.rspoSccModel = parseInt(tempTrans.rspoSccModel);
      }
      if (tempTrans.isccSccModel) {
        tempTrans.isccSccModel = parseInt(tempTrans.isccSccModel);
      }
      if (tempTrans.ispoSccModel) {
        tempTrans.ispoSccModel = parseInt(tempTrans.ispoSccModel);
      }

      delete tempTrans.jenisTransaksi;

      tempTrans.productType = parseInt(tempTrans.productType);
      tempTrans.deliveryDate = moment(tempTrans.deliveryDate).toISOString();
      tempTrans.originWeighInTimestamp = moment(
        tempTrans.originWeighInTimestamp
      ).toISOString();
      tempTrans.originWeighOutTimestamp = moment(
        tempTrans.originWeighOutTimestamp
      ).toISOString();
      tempTrans.originWeighInOperatorName = user.name.toUpperCase();
      tempTrans.originWeighOutOperatorName = user.name.toUpperCase();
      tempTrans.dtTransaction = moment(tempTrans.originWeighOutTimestamp)
        .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
        .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
        .format();
      setIsLoading(true);
      const response = await transactionAPI.ManualEntryBackDateNormalDispatch(
        tempTrans
      );

      if (!response.status) throw new Error(response?.message);

      clearOpenedTransaction();
      handleClose();
      setWbTransaction({ ...response.data.transaction });

      setIsLoading(false);

      toast.success(`Transaksi Normal BACKDATE telah tersimpan.`);
    } catch (error) {
      return toast.error(`${error.message}.`);
    }
  };

  const handleDispatchCancel = async (values) => {
    let tempTrans = { ...values };

    setIsLoading(true);
    try {
      const selectedStorageTank = dtStorageTank.records.find(
        (item) => item.id === values.originSourceStorageTankId
      );

      if (selectedStorageTank) {
        tempTrans.originSourceStorageTankCode = selectedStorageTank.code || "";
        tempTrans.originSourceStorageTankName = selectedStorageTank.name || "";
      }

      const selectedSite = dtSite.records.find(
        (item) => item.id === WBMS.SITE.id
      );

      if (selectedSite) {
        tempTrans.originSiteId = selectedSite.id || "";
        tempTrans.originSiteCode = selectedSite.code || "";
        tempTrans.originSiteName = selectedSite.name || "";
      }

      if (tempTrans.rspoSccModel) {
        tempTrans.rspoSccModel = parseInt(tempTrans.rspoSccModel);
      }
      if (tempTrans.isccSccModel) {
        tempTrans.isccSccModel = parseInt(tempTrans.isccSccModel);
      }
      if (tempTrans.ispoSccModel) {
        tempTrans.ispoSccModel = parseInt(tempTrans.ispoSccModel);
      }

      delete tempTrans.jenisTransaksi;

      tempTrans.productType = parseInt(tempTrans.productType);
      tempTrans.deliveryDate = moment(tempTrans.deliveryDate).toISOString();
      tempTrans.originWeighInTimestamp = moment(
        tempTrans.originWeighInTimestamp
      ).toISOString();
      tempTrans.originWeighOutTimestamp = moment(
        tempTrans.originWeighOutTimestamp
      ).toISOString();
      tempTrans.returnWeighInTimestamp = moment(
        tempTrans.returnWeighInTimestamp
      ).toISOString();
      tempTrans.returnWeighOutTimestamp = moment(
        tempTrans.returnWeighOutTimestamp
      ).toISOString();
      tempTrans.originWeighInOperatorName = user.name.toUpperCase();
      tempTrans.originWeighOutOperatorName = user.name.toUpperCase();
      tempTrans.returnWeighInOperatorName = user.name.toUpperCase();
      tempTrans.returnWeighOutOperatorName = user.name.toUpperCase();
      tempTrans.dtTransaction = moment(tempTrans.returnWeighOutTimestamp)
        .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
        .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
        .format();
      setIsLoading(true);
      const response = await transactionAPI.ManualEntryBackDateCancelDispatch(
        tempTrans
      );

      if (!response.status) throw new Error(response?.message);

      clearOpenedTransaction();
      handleClose();
      setWbTransaction({ ...response.data.transaction });

      setIsLoading(false);

      toast.success(`Transaksi Cancel BACKDATE telah tersimpan.`);
    } catch (error) {
      return toast.error(`${error.message}.`);
    }
  };

  const handleOthersSubmit = async (values) => {
    let tempTrans = { ...values };

    setIsLoading(true);
    try {
      delete tempTrans.jenisTransaksi;

      tempTrans.productType = parseInt(tempTrans.productType);
      // tempTrans.typeTransaction = 4;
      tempTrans.originWeighInTimestamp = moment(
        tempTrans.originWeighInTimestamp
      ).toISOString();
      tempTrans.originWeighOutTimestamp = moment(
        tempTrans.originWeighOutTimestamp
      ).toISOString();
      tempTrans.originWeighInOperatorName = user.name.toUpperCase();
      tempTrans.originWeighOutOperatorName = user.name.toUpperCase();
      tempTrans.dtTransaction = moment(tempTrans.originWeighOutTimestamp)
        .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
        .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
        .format();

      const response = await transactionAPI.ManualEntryBackDateOthers(
        tempTrans
      );

      if (!response.status) throw new Error(response?.message);

      clearOpenedTransaction();
      handleClose();
      setWbTransaction({ ...response.data.transaction });

      toast.success(`Transaksi BACKDATE telah tersimpan.`);
    } catch (error) {
      setIsLoading(false);
      toast.error(`${error.message}.`);

      return;
    }
  };

  useEffect(() => {
    const dateSelected = moment(selectedDate).format("YYMMDD");
    const conterNumber = String(WBMS.CONTER_BD_FORM + 1).padStart(6, "0");

    setWbTransaction({
      bonTripNo: `${WBMS.BT_SITE_CODE}${WBMS.BT_SUFFIX_FORM}${dateSelected}${conterNumber}`,
    });
  }, [selectedDate]);

  return (
    <Box>
      <Header title="TRANSAKSI T30" subtitle="Transaksi BackDate Form" />
      {wbTransaction && (
        <Formik
          enableReinitialize
          onSubmit={(values) => {
            if (selectedStatus === 1) {
              handleDispatchNormal(values);
            } else if (selectedStatus === 2) {
              handleDispatchCancel(values);
            } else if (selectedOption === 4) {
              handleOthersSubmit(values);
            }
          }}
          initialValues={wbTransaction}
          // isInitialValid={false}
          validationSchema={validationSchema}
          // isInitialError={true}
        >
          {(props) => {
            const {
              values,
              isValid,
              dirty,
              submitForm,
              setFieldValue,
              handleChange,
              resetForm,
            } = props;
            // console.log("Formik props:", props);

            const handleOtrSubmit = (normalReason) => {
              if (normalReason.trim().length <= 10)
                return toast.error(
                  "Alasan (BACKDATE) harus melebihi 10 karakter."
                );

              setFieldValue("originWeighInRemark", normalReason);
              setFieldValue("originWeighOutRemark", normalReason);

              submitForm();
            };

            const handleDspSubmit = (normalReason) => {
              if (normalReason.trim().length <= 10)
                return toast.error(
                  "Alasan (BACKDATE) harus melebihi 10 karakter."
                );

              setFieldValue("originWeighInRemark", normalReason);
              setFieldValue("originWeighOutRemark", normalReason);

              submitForm();
            };

            const handleDspCancel = (normalReason) => {
              if (normalReason.trim().length <= 10)
                return toast.error(
                  "Alasan CANCEL (PEMBATALAN) harus melebihi 10 karakter."
                );

              setFieldValue("returnWeighInRemark", normalReason);
              setFieldValue("returnWeighOutRemark", normalReason);

              submitForm();
            };

            return (
              <Form>
                <Box sx={{ display: "flex", mt: 3, justifyContent: "end" }}>
                  {selectedStatus === 1 && (
                    <ManualEntryConfirmation
                      title="Alasan (BACKDATE)"
                      caption="SIMPAN"
                      content="Anda yakin melakukan (BACKDATE) transaksi ini? Berikan keterangan yang cukup."
                      onClose={handleDspSubmit}
                      isDisabled={
                        !(
                          isValid &&
                          dirty &&
                          values.originWeighInKg > WBMS.WB_MIN_WEIGHT &&
                          values.originWeighOutKg > WBMS.WB_MIN_WEIGHT
                        )
                      }
                      sx={{ mr: 1 }}
                      variant="contained"
                    />
                  )}

                  {selectedStatus === 2 && (
                    <CancelConfirmation
                      title="Alasan CANCEL (PEMBATALAN)"
                      caption="SIMPAN"
                      content="Anda yakin melakukan CANCEL (PEMBATALAN) transaksi ini? Berikan keterangan yang cukup."
                      onClose={handleDspCancel}
                      isDisabled={
                        !(
                          isValid &&
                          dirty &&
                          values.returnWeighInKg > WBMS.WB_MIN_WEIGHT &&
                          values.returnWeighOutKg > WBMS.WB_MIN_WEIGHT
                        )
                      }
                      sx={{ mr: 1 }}
                      variant="contained"
                    />
                  )}

                  {selectedOption === 4 && (
                    <ManualEntryConfirmation
                      title="Alasan (BACKDATE)"
                      caption="SIMPAN"
                      content="Anda yakin melakukan (BACKDATE) transaksi ini? Berikan keterangan yang cukup."
                      onClose={handleOtrSubmit}
                      isDisabled={
                        !(
                          isValid &&
                          dirty &&
                          values.originWeighInKg > WBMS.WB_MIN_WEIGHT &&
                          values.originWeighOutKg > WBMS.WB_MIN_WEIGHT
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
                      {/* <Field
                        type="date"
                        variant="outlined"
                        component={TextField}
                        size="small"
                        fullWidth
                        sx={{ mb: 2, backgroundColor: "lightyellow" }}
                        label="Tanggal Bontrip"
                        name="bontripDate"
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
                      /> */}

                      <Field
                        name="productType"
                        label="Tipe Transaksi"
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
                          const selectedProductType = dtTypeProduct.find(
                            (item) => item.id === event.target.value
                          );

                          //untuk kosongkan field saat pindah select
                          setSelectedOption(selectedProductType.id);

                          setSelectedStatus(0);

                          resetForm();
                        }}
                      >
                        {dtTypeProduct &&
                          dtTypeProduct
                            .filter((data) => data.id === 1 || data.id === 4)
                            .map((data, index) => (
                              <MenuItem key={index} value={data.id}>
                                {data.value}
                              </MenuItem>
                            ))}
                      </Field>

                      {selectedOption === 1 && (
                        <Field
                          name="jenisTransaksi"
                          label="Jenis Transaksi"
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
                            const selectedProgresStatus = dtProgresStatus.find(
                              (item) => item.id === event.target.value
                            );
                            setSelectedStatus(selectedProgresStatus.id);
                          }}
                        >
                          {dtProgresStatus &&
                            dtProgresStatus
                              .filter((data) => data.id === 1 || data.id === 2)
                              .map((data, index) => (
                                <MenuItem key={index} value={data.id}>
                                  {data.value}
                                </MenuItem>
                              ))}
                        </Field>
                      )}
                      {(selectedStatus === 1 || selectedStatus === 4) && (
                        <>
                          <Field
                            type="date"
                            variant="outlined"
                            component={TextField}
                            size="small"
                            fullWidth
                            required={true}
                            sx={{ mb: 2, backgroundColor: "lightyellow" }}
                            label="TANGGAL Delivery"
                            name="deliveryDate"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          <Field
                            name="deliveryOrderNo"
                            label="NO DO"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            required
                            size="small"
                            fullWidth
                            sx={{ mb: 2, backgroundColor: "lightyellow" }}
                          />
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
                        </>
                      )}

                      {(selectedOption === 2 ||
                        selectedOption === 3 ||
                        selectedOption === 4) && (
                        <>
                          <Field
                            name="transportVehiclePlateNo"
                            component={Autocomplete}
                            variant="outlined"
                            fullWidth
                            freeSolo
                            disableClearable
                            options={dtTransport?.records.map(
                              (record) => record.plateNo
                            )}
                            onInputChange={(event, InputValue, reason) => {
                              if (reason !== "reset") {
                                setFieldValue(
                                  "transportVehiclePlateNo",
                                  InputValue.toUpperCase()
                                );
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
                            getOptionLabel={(option) =>
                              `[${option.code}] - ${option.name}`
                            }
                            value={
                              (values &&
                                dtCompany?.records?.find(
                                  (item) =>
                                    item.id === values.transporterCompanyId
                                )) ||
                              null
                            }
                            onChange={(event, newValue) => {
                              setFieldValue(
                                "transporterCompanyId",
                                newValue ? newValue.id : ""
                              );
                              setFieldValue(
                                "transporterCompanyName",
                                newValue ? newValue.name : ""
                              );
                              setFieldValue(
                                "transporterCompanyCode",
                                newValue ? newValue.code : ""
                              );
                              setFieldValue(
                                "mandatoryDeductionPercentage",
                                newValue ? newValue.potonganWajib : ""
                              );
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
                            getOptionLabel={(option) =>
                              `[${option.code}] - ${option.name}`
                            }
                            value={
                              (values &&
                                dtProduct?.records?.find(
                                  (item) => item.id === values.productId
                                )) ||
                              null
                            }
                            onChange={(event, newValue) => {
                              setFieldValue(
                                "transportVehicleProductName",
                                newValue ? newValue.name : ""
                              );

                              setFieldValue(
                                "transportVehicleProductCode",
                                newValue ? newValue.code : ""
                              );
                              setFieldValue(
                                "productName",
                                newValue ? newValue.name : ""
                              );
                              setFieldValue(
                                "productId",
                                newValue ? newValue.id : ""
                              );
                              setFieldValue(
                                "productCode",
                                newValue ? newValue.code : ""
                              );
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

                    {/*Normal Dispatch*/}

                    {selectedStatus === 1 && (
                      <Normal setFieldValue={setFieldValue} values={values} />
                    )}

                    {/* Cancel Dispatch */}

                    {selectedStatus === 2 && (
                      <Cancel setFieldValue={setFieldValue} values={values} />
                    )}

                    {/* Others*/}

                    {selectedOption === 4 && (
                      <OTHERS setFieldValue={setFieldValue} values={values} />
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

export default T30ManualEntryWBIn;
