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
} from "../../../components/FormManualEntry";
import { TextField, Autocomplete, Select } from "formik-mui";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Dispatch from "./dispatch/normalin";
import TBS from "./tbs/in";
import OTHERS from "./others/in";
import KERNEL from "./kernel/in";
import Header from "../../../components/layout/signed/HeaderTransaction";
import ManualEntryConfirmation from "components/ManualEntryConfirmation";
import moment from "moment";
import { TransactionAPI } from "../../../apis";
import * as eDispatchApi from "../../../apis/eDispatchApi";
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
} from "../../../hooks";

const PksManualEntryWBIn = () => {
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

  const [selectedOption, setSelectedOption] = useState(0);

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

  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    transportVehiclePlateNo: Yup.string().required("Wajib diisi"),
    transporterCompanyName: Yup.string().required("Wajib diisi"),
    productName: Yup.string().required("Wajib diisi"),
    driverName: Yup.string().required("Wajib diisi"),
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

    navigate("/wb/transactions");
  };

  const handleReject = () => {
    clearOpenedTransaction();
    navigate(`/wb/transactions/pks/dispatch-reject-bulking-in`);
  };

  const handleDispatchSubmit = async (values) => {
    let tempTrans = { ...values };

    setIsLoading(true);
    try {
      const selectedStorageTank = dtStorageTank.records.find(
        (item) => item.id === values.originSourceStorageTankId
      );

      if (selectedStorageTank) {
        tempTrans.originSourceStorageTankCode = selectedStorageTank.code || "";
        tempTrans.originSourceStorageTankName = selectedStorageTank.name || "";
        tempTrans.originSiteCode = selectedStorageTank.code || "";
        tempTrans.originSiteName = selectedStorageTank.name || "";
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

      if (WBMS.WB_STATUS === true) {
        tempTrans.originWeighInKg = wb.weight;
      }

      tempTrans.productType = parseInt(tempTrans.productType);
      tempTrans.progressStatus = 1;
      tempTrans.deliveryDate = moment().toDate();
      tempTrans.originWeighInTimestamp = moment().toDate();
      tempTrans.originWeighInOperatorName = user.name.toUpperCase();
      tempTrans.dtTransaction = moment()
        .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
        .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
        .format();
      setIsLoading(true);
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

      if (WBMS.WB_STATUS === true) {
        tempTrans.originWeighInKg = wb.weight;
      }

      tempTrans.productType = parseInt(tempTrans.productType);
      tempTrans.typeTransaction = 2;
      tempTrans.originWeighInTimestamp = moment().toDate();
      tempTrans.originWeighInOperatorName = user.name.toUpperCase();
      tempTrans.dtTransaction = moment()
        .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
        .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
        .format();

      const response = await transactionAPI.ManualEntryInTbs(tempTrans);

      if (!response.status) throw new Error(response?.message);

      clearOpenedTransaction();
      handleClose();
      setWbTransaction({ ...response.data.transaction });

      toast.success(`Transaksi WB-IN telah tersimpan.`);
    } catch (error) {
      setIsLoading(false);
      toast.error(`${error.message}.`);

      return;
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

      if (WBMS.WB_STATUS === true) {
        tempTrans.originWeighInKg = wb.weight;
      }

      tempTrans.productType = parseInt(tempTrans.productType);
      tempTrans.typeTransaction = 3;
      tempTrans.originWeighInTimestamp = moment().toDate();
      tempTrans.originWeighInOperatorName = user.name.toUpperCase();
      tempTrans.dtTransaction = moment()
        .subtract(WBMS.SITE_CUT_OFF_HOU, "hours")
        .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
        .format();

      const response = await transactionAPI.ManualEntryInKernel(tempTrans);

      if (!response.status) throw new Error(response?.message);

      clearOpenedTransaction();
      handleClose();
      setWbTransaction({ ...response.data.transaction });

      toast.success(`Transaksi WB-IN telah tersimpan.`);
    } catch (error) {
      setIsLoading(false);
      toast.error(`${error.message}.`);

      return;
    }
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

      if (WBMS.WB_STATUS === true) {
        tempTrans.originWeighInKg = wb.weight;
      } else if (WBMS.WB_STATUS === false) {
        tempTrans.isManualTonase = 1;
      }

      tempTrans.productType = parseInt(tempTrans.productType);
      tempTrans.typeTransaction = 4;
      tempTrans.originWeighInTimestamp = moment().toDate();
      tempTrans.originWeighInOperatorName = user.name.toUpperCase();
      tempTrans.dtTransaction = moment()
        .subtract(WBMS.SITE_CUT_OFF_HOUR, "hours")
        .subtract(WBMS.SITE_CUT_OFF_MINUTE, "minutes")
        .format();

      const response = await transactionAPI.ManualEntryInOthers(tempTrans);

      if (!response.status) throw new Error(response?.message);

      clearOpenedTransaction();
      handleClose();
      setWbTransaction({ ...response.data.transaction });

      toast.success(`Transaksi WB-IN telah tersimpan.`);
    } catch (error) {
      setIsLoading(false);
      toast.error(`${error.message}.`);

      return;
    }
  };

  // useEffect(() => {
  //   setWbTransaction({ originWeighInKg: wb.weight });
  // }, [wb.weight]);

  useEffect(() => {
    setWbTransaction({
      bonTripNo: `${WBMS.BT_SITE_CODE}${WBMS.BT_SUFFIX_TRX}${moment().format(
        "YYMMDDHHmmss"
      )}`,
    });
  }, []);

  return (
    <Box>
      <Header title="Transaksi PKS" subtitle="Transaksi Manual Entry WB-IN" />
      {wbTransaction && (
        <Formik
          enableReinitialize
          onSubmit={(values) => {
            if (selectedOption === 1) {
              handleDispatchSubmit(values);
            } else if (selectedOption === 2) {
              handleTbsSubmit(values);
            } else if (selectedOption === 3) {
              handleKernelSubmit(values);
            } else if (selectedOption === 4) {
              handleOthersSubmit(values);
            }
          }}
          initialValues={wbTransaction}
          isInitialValid={false}
          validationSchema={validationSchema}
          isInitialError={true}
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

            const handleOtrSubmit = () => {
              submitForm();
            };

            const handleKrlSubmit = () => {
              submitForm();
            };
            const handleTbsSubmit = () => {
              submitForm();
            };

            const handleDspSubmit = (normalReason) => {
              if (normalReason.trim().length <= 10)
                return toast.error(
                  "Alasan (MANUAL ENTRY) harus melebihi 10 karakter."
                );

              setFieldValue("originWeighInRemark", normalReason);
              setFieldValue("originWeighOutRemark", normalReason);

              submitForm();
            };

            return (
              <Form>
                <Box sx={{ display: "flex", mt: 3, justifyContent: "end" }}>
                  {selectedOption === 1 && WBMS.WB_STATUS === true && (
                    <ManualEntryConfirmation
                      title="Alasan (MANUAL ENTRY)"
                      caption="SIMPAN"
                      content="Anda yakin melakukan (MANUAL ENTRY) transaksi WB ini? Berikan keterangan yang cukup."
                      onClose={handleDspSubmit}
                      disabled={
                        !(
                          isValid &&
                          wb?.isStable &&
                          wb?.weight > WBMS.WB_MIN_WEIGHT &&
                          dirty
                        )
                      }
                      sx={{ mr: 1 }}
                      variant="contained"
                    />
                  )}
                  {selectedOption === 1 && WBMS.WB_STATUS === false && (
                    <ManualEntryConfirmation
                      title="Alasan (MANUAL ENTRY)"
                      caption="SIMPAN"
                      content="Anda yakin melakukan (MANUAL ENTRY) transaksi WB ini? Berikan keterangan yang cukup."
                      onClose={handleDspSubmit}
                      isDisabled={
                        !(
                          isValid &&
                          dirty &&
                          values.originWeighInKg > WBMS.WB_MIN_WEIGHT
                        )
                      }
                      sx={{ mr: 1 }}
                      variant="contained"
                    />
                  )}

                  {selectedOption === 2 && WBMS.WB_STATUS === true && (
                    <Button
                      variant="contained"
                      sx={{ mr: 1 }}
                      disabled={
                        !(
                          isValid &&
                          wb?.isStable &&
                          wb?.weight > WBMS.WB_MIN_WEIGHT &&
                          dirty
                        )
                      }
                      onClick={() => handleTbsSubmit()}
                    >
                      SIMPAN
                    </Button>
                  )}
                  {selectedOption === 2 && WBMS.WB_STATUS === false && (
                    <Button
                      variant="contained"
                      sx={{ mr: 1 }}
                      disabled={
                        !(
                          isValid &&
                          dirty &&
                          values.originWeighInKg > WBMS.WB_MIN_WEIGHT
                        )
                      }
                      onClick={() => handleTbsSubmit()}
                    >
                      SIMPAN
                    </Button>
                  )}

                  {selectedOption === 3 && WBMS.WB_STATUS === true && (
                    <Button
                      variant="contained"
                      sx={{ mr: 1 }}
                      disabled={
                        !(
                          isValid &&
                          wb?.isStable &&
                          wb?.weight > WBMS.WB_MIN_WEIGHT &&
                          dirty
                        )
                      }
                      onClick={() => handleKrlSubmit()}
                    >
                      SIMPAN
                    </Button>
                  )}
                  {selectedOption === 3 && WBMS.WB_STATUS === false && (
                    <Button
                      variant="contained"
                      sx={{ mr: 1 }}
                      disabled={
                        !(
                          isValid &&
                          dirty &&
                          values.originWeighInKg > WBMS.WB_MIN_WEIGHT
                        )
                      }
                      onClick={() => handleKrlSubmit()}
                    >
                      SIMPAN
                    </Button>
                  )}

                  {selectedOption === 4 && WBMS.WB_STATUS === true && (
                    <Button
                      variant="contained"
                      sx={{ mr: 1 }}
                      disabled={
                        !(
                          isValid &&
                          wb?.isStable &&
                          wb?.weight > WBMS.WB_MIN_WEIGHT &&
                          dirty
                        )
                      }
                      onClick={() => handleOtrSubmit()}
                    >
                      SIMPAN
                    </Button>
                  )}
                  {selectedOption === 4 && WBMS.WB_STATUS === false && (
                    <Button
                      variant="contained"
                      sx={{ mr: 1 }}
                      disabled={
                        !(
                          isValid &&
                          dirty &&
                          values.originWeighInKg > WBMS.WB_MIN_WEIGHT
                        )
                      }
                      onClick={() => handleOtrSubmit()}
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

                      {selectedOption === 1 && (
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{ mb: 2, backgroundColor: "goldenrod" }}
                          onClick={handleReject}
                        >
                          Reject Transaksi Bulking
                        </Button>
                      )}

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
                          setSelectedOption(selectedProductType.id);
                          setFieldValue("mandatoryDeductionPercentage", 0);
                          setFieldValue("mandatoryDeductionKg", 0);
                          setFieldValue("othersKg", 0);
                        }}
                      >
                        {dtTypeProduct &&
                          dtTypeProduct.map((data, index) => (
                            <MenuItem key={index} value={data.id}>
                              {data.value}
                            </MenuItem>
                          ))}
                      </Field>

                      {selectedOption === 1 && (
                        <>
                          <Field
                            name="deliveryOrderNo"
                            label="NO DO"
                            type="text"
                            component={TextField}
                            variant="outlined"
                            required
                            size="small"
                            fullWidth
                            inputProps={{ readOnly: true }}
                            sx={{ mb: 2, backgroundColor: "whitesmoke" }}
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
                    {/*Dispatch*/}

                    {selectedOption === 1 && (
                      <Dispatch setFieldValue={setFieldValue} values={values} />
                    )}

                    {/* TBS */}

                    {selectedOption === 2 && (
                      <TBS setFieldValue={setFieldValue} values={values} />
                    )}

                    {/* KERNEL*/}

                    {selectedOption === 3 && (
                      <KERNEL setFieldValue={setFieldValue} values={values} />
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

export default PksManualEntryWBIn;
