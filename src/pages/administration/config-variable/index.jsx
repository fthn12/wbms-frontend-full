import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Button, MenuItem, CircularProgress, Grid, Paper } from "@mui/material";

import { Formik, Form, Field } from "formik";
import { TextField, Select } from "formik-mui";
import * as yup from "yup";
import { SiteSelect } from "../../../components/FormikMUI";
import { SiteSelected } from "../../../components/FormManualEntry";

import Header from "../../../components/layout/signed/Header";

import { ConfigAPI } from "../../../apis";
import { useConfig, useSite } from "../../../hooks";

const validationSchema = yup.object().shape({
  siteType: yup.number().required("Wajib diisi."),
  siteCutOffHour: yup
    .number("Harus numeric.")
    .max(23, "Maksimal jam 23 (11 Malam)")
    .min(0, "Minimal jam 0 (12 Malam)")
    .required("Wajib diisi."),
  siteCutOffMinute: yup
    .number("Harus numeric.")
    .max(59, "Maksimal menit 59")
    .min(0, "Minimal menit 0 ")
    .required("Wajib diisi."),

  siteId: yup.string().required("Wajib diisi."),
  siteRefId: yup.string().required("Wajib diisi."),

  btSiteCode: yup.string().required("Wajib diisi."),
  btSuffixTrx: yup.string().required("Wajib diisi."),
  btSuffixForm: yup.string().required("Wajib diisi."),
  btSuffixTemplate: yup.string().required("Wajib diisi."),
  btApproval1: yup.string().required("Wajib diisi."),
  btApproval2: yup.string().required("Wajib diisi."),

  wbPort: yup.number().required("Wajib diisi."),
  wbMinWeight: yup.number().required("Wajib diisi."),
  wbStablePeriod: yup.number().min(3000, "Minimal 3.000 ms (3s)").required("Wajib diisi."),
  useWb: yup.boolean().required("Wajib diisi."),

  logErrorToFile: yup.boolean().required("Wajib diisi."),
  logErrorToDB: yup.boolean().required("Wajib diisi."),
  logTrxToFile: yup.boolean().required("Wajib diisi."),
  logTrxToDB: yup.boolean().required("Wajib diisi."),

  eDispatchApiKey: yup.string().required("Wajib diisi."),
  eDispatchApiUrl1: yup.string().url("Diisi dengan alamat URL yang valid.").required("Wajib diisi."),
  eDispatchApiUrl2: yup.string().url("Diisi dengan alamat URL yang valid.").required("Wajib diisi."),
  eDispatchApi: yup.number().required("Wajib diisi."),
});

const UserCreate = () => {
  const { useGetSitesQuery } = useSite();
  const { data, refetch } = useGetSitesQuery();
  const navigate = useNavigate();
  const { id } = useParams();

  const { EDISPATCH_SERVER, SITE_TYPES } = useConfig();

  const configApi = ConfigAPI();
  const [dtEDispatchServer] = useState(EDISPATCH_SERVER);
  const [dtSiteTypes] = useState(SITE_TYPES);
  const [isLoading, setIsLoading] = useState(false);

  const [openedConfig, setOpenedConfig] = useState("");

  const handleFormikSubmit = async (values) => {
    let editConfig = { ...values };

    setIsLoading(true);

    try {
      const selected = data.records.find((item) => item.id === values.siteId);

      if (selected) {
        editConfig.siteId = selected.id || "";
        editConfig.siteRefId = selected.refId || "";
      }

      editConfig.useWb = editConfig.useWb === "true" ? true : false;

      const response = await configApi.updateById(editConfig.id, { ...editConfig });
      localStorage.setItem("res", "success");
      localStorage.setItem("message", "Config Berhasil di Edit.");
    } catch (error) {
      setIsLoading(false);
      localStorage.setItem("res", "error");
      localStorage.setItem("message", error.message);
    }
    window.location.reload();
  };

  useEffect(() => {
    const status = localStorage.getItem("res");
    const message = localStorage.getItem("message");

    if (status && message) {
      if (status === "success") {
        toast.success(message);
      } else if (status === "error") {
        toast.error(message);
      }

      localStorage.removeItem("res");
      localStorage.removeItem("message");
    }
  }, [toast]);

  useEffect(() => {
    if (!id);

    configApi
      .getById(id)
      .then((res) => {
        setOpenedConfig(res.data.config);
      })
      .catch((error) => {
        toast.error(`${error.message}.`);

        return;
      });

    return () => {
      // console.clear();
    };
  }, []);
  return (
    <Box mt={1}>
      <Header title="EDIT CONFIG" subtitle="Edit Config" />
      {openedConfig && (
        <Formik onSubmit={handleFormikSubmit} initialValues={openedConfig} validationSchema={validationSchema}>
          {({ errors }) => {
            return (
              <Form>
                <Box sx={{ display: "flex", mt: 3, justifyContent: "end" }}>
                  {/* <Box flex={1}></Box> */}
                  <Button type="submit" variant="contained">
                    SIMPAN
                  </Button>
                  {/* <Button variant="contained" disabled sx={{ ml: 0.5 }} onClick={() => {}}>
                  NON-AKTIFKAN
                </Button>
                <Button variant="contained" disabled sx={{ ml: 0.5 }} onClick={() => {}}>
                  HAPUS
                </Button> */}
                  <Button variant="contained" sx={{ ml: 0.5 }} onClick={() => navigate("/wb/administration/configs")}>
                    BATAL
                  </Button>
                </Box>

                <Paper sx={{ mt: 1, p: 2, minHeight: "71.5vh" }}>
                  <Grid container justifyContent="center" spacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <Grid container justifyContent="center" spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="siteType"
                            label="Tipe Site"
                            id="siteType"
                            labelId="siteTypeLbl"
                            component={Select}
                            autoFocus
                            size="small"
                            formControl={{
                              fullWidth: true,
                              required: true,
                            }}
                          >
                            {dtSiteTypes &&
                              dtSiteTypes.length > 0 &&
                              dtSiteTypes?.map((data, index) => {
                                return (
                                  <MenuItem key={index} value={data.id}>
                                    {data.value}
                                  </MenuItem>
                                );
                              })}
                          </Field>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Field
                            name="siteCutOffHour"
                            label="Jam Cut Off"
                            type="number"
                            component={TextField}
                            InputProps={{
                              inputProps: {
                                max: 23,
                                min: 0,
                              },
                            }}
                            required
                            variant="outlined"
                            size="small"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Field
                            name="siteCutOffMinute"
                            label="Menit Cut Off"
                            type="number"
                            component={TextField}
                            InputProps={{
                              inputProps: {
                                max: 60,
                                min: 0,
                              },
                            }}
                            required
                            variant="outlined"
                            size="small"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="btSiteCode"
                            label="Kode BONTRIP"
                            type="text"
                            component={TextField}
                            required
                            variant="outlined"
                            size="small"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="btSuffixTrx"
                            label="Suffix BONTRIP Transaksi WB"
                            type="text"
                            component={TextField}
                            required
                            variant="outlined"
                            size="small"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="btSuffixForm"
                            label="Suffix BONTRIP Transaksi Backdated Form"
                            type="text"
                            component={TextField}
                            required
                            variant="outlined"
                            size="small"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="btSuffixTemplate"
                            label="Suffix BONTRIP Transaksi Backdated Template"
                            type="text"
                            component={TextField}
                            required
                            variant="outlined"
                            size="small"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="btApproval1"
                            label="BONTRIP Approval 1"
                            type="text"
                            component={TextField}
                            required
                            variant="outlined"
                            size="small"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="btApproval2"
                            label="BONTRIP Approval 2"
                            type="text"
                            component={TextField}
                            required
                            variant="outlined"
                            size="small"
                            fullWidth
                          />
                        </Grid>{" "}
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="wbMinWeight"
                            label="Berat Minimal WB"
                            type="number"
                            component={TextField}
                            required
                            variant="outlined"
                            size="small"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="wbStablePeriod"
                            label="Lama Waktu Stabil WB"
                            type="number"
                            component={TextField}
                            required
                            variant="outlined"
                            size="small"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <SiteSelect name="siteId" label="Site StorageTank" isReadOnly={false} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <SiteSelected name="destinationSiteId" label="Site Tujuan" isReadOnly={false} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="wbPort"
                            label="PORT WB"
                            type="number"
                            component={TextField}
                            required
                            variant="outlined"
                            size="small"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            id="useWbId"
                            labelId="useWbLbl"
                            name="useWb"
                            label="TONASE :"
                            component={Select}
                            size="small"
                            formControl={{
                              fullWidth: true,
                              required: true,
                            }}
                          >
                            <MenuItem key={true} value={true}>
                              Menggunakan Timbangan
                            </MenuItem>
                            <MenuItem key={false} value={false}>
                              Manual Berat Timbangan
                            </MenuItem>
                          </Field>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Field
                            name="logErrorToFile"
                            label="Log Error ke File"
                            id="logErrorToFile"
                            labelId="logErrorToFileLbl"
                            component={Select}
                            size="small"
                            disabled
                            formControl={{
                              fullWidth: true,
                              required: true,
                            }}
                          >
                            <MenuItem key={0} value={false}>
                              NO
                            </MenuItem>
                            <MenuItem key={1} value={true}>
                              YES
                            </MenuItem>
                          </Field>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Field
                            name="logErrorToDB"
                            label="Log Error ke DB"
                            id="logErrorToDB"
                            labelId="logErrorToDBLbl"
                            component={Select}
                            size="small"
                            formControl={{
                              fullWidth: true,
                              required: true,
                            }}
                          >
                            <MenuItem key={0} value={false}>
                              NO
                            </MenuItem>
                            <MenuItem key={1} value={true}>
                              YES
                            </MenuItem>
                          </Field>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Field
                            name="logTrxToFile"
                            label="Log Transaksi ke File"
                            id="logTrxToFile"
                            labelId="logTrxToFileLbl"
                            component={Select}
                            size="small"
                            disabled
                            formControl={{
                              fullWidth: true,
                              required: true,
                            }}
                          >
                            <MenuItem key={0} value={false}>
                              NO
                            </MenuItem>
                            <MenuItem key={1} value={true}>
                              YES
                            </MenuItem>
                          </Field>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Field
                            name="logTrxToDB"
                            label="Log Transaksi ke DB"
                            id="logTrxToDB"
                            labelId="logTrxToDBLbl"
                            component={Select}
                            size="small"
                            formControl={{
                              fullWidth: true,
                              required: true,
                            }}
                          >
                            <MenuItem key={0} value={false}>
                              NO
                            </MenuItem>
                            <MenuItem key={1} value={true}>
                              YES
                            </MenuItem>
                          </Field>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="eDispatchApiUrl1"
                            label="eDispatch API SERVER 1"
                            type="text"
                            component={TextField}
                            required
                            variant="outlined"
                            size="small"
                            fullWidth
                            // value={values.eDispatchApiUrl1}
                            // onBlur={handleBlur}
                            // onChange={handleChange}
                            // error={!!touched.eDispatchApiUrl1 && !!errors.eDispatchApiUrl1}
                            // helperText={touched.eDispatchApiUrl1 && errors.eDispatchApiUrl1}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="eDispatchApiUrl2"
                            label="eDispatch API SERVER 2"
                            type="text"
                            component={TextField}
                            required
                            variant="outlined"
                            size="small"
                            fullWidth
                            // value={values.eDispatchApiUrl2}
                            // onBlur={handleBlur}
                            // onChange={handleChange}
                            // error={!!touched.eDispatchApiUrl2 && !!errors.eDispatchApiUrl2}
                            // helperText={touched.eDispatchApiUrl2 && errors.eDispatchApiUrl2}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="eDispatchApi"
                            label="eDispatch API SERVER"
                            id="eDispatchApi"
                            labelId="eDispatchApiLbl"
                            component={Select}
                            size="small"
                            formControl={{
                              fullWidth: true,
                              required: true,
                            }}
                          >
                            {dtEDispatchServer &&
                              dtEDispatchServer.length > 0 &&
                              dtEDispatchServer?.map((data, index) => {
                                return (
                                  <MenuItem key={index} value={data.id}>
                                    {data.value}
                                  </MenuItem>
                                );
                              })}
                          </Field>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Field
                            name="eDispatchApiKey"
                            label="eDispatch API KEY"
                            type="text"
                            component={TextField}
                            required
                            variant="outlined"
                            size="small"
                            fullWidth
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
    </Box>
  );
};

export default UserCreate;
