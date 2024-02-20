import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Button, MenuItem, CircularProgress, Grid, Paper } from "@mui/material";

import { Formik, Form, Field } from "formik";
import { TextField, Select } from "formik-mui";
import * as yup from "yup";

import Header from "../../../components/layout/signed/Header";

import { ConfigAPI } from "../../../apis";
import { useConfig, useUser } from "../../../hooks";

const validationSchema = yup.object().shape({
  username: yup.string().required("Wajib diisi."),
  password: yup
    .string()
    .min(8, "Panjang password minimal 8 karakter dan maksimal 20 karakter.")
    .max(20, "Panjang password minimal 8 karakter dan maksimal 20 karakter.")
    .required("Wajib diisi."),
  passwordConfirm: yup.string().oneOf([yup.ref("password"), null], "Password harus sama."),
  email: yup.string().email("Email tidak valid.").required("Wajib diisi."),
  npk: yup.string().required("Wajib diisi."),
  nik: yup.string().required("Wajib diisi."),
  name: yup.string().required("Wajib diisi."),
  division: yup.string().required("Wajib diisi."),
  position: yup.string().required("Wajib diisi."),
  role: yup.number().required("Wajib diisi."),
});

const UserCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { ROLES, EDISPATCH_SERVER, SITE_TYPES, openedFormConfig, setOpenedFormConfig } = useConfig();

  const configApi = ConfigAPI();
  const [dtEDispatchServer] = useState(EDISPATCH_SERVER);
  const [dtSiteTypes] = useState(SITE_TYPES);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormikSubmit = async (values) => {
    setIsLoading(true);

    try {
      //   const response = await configApi.Create(values);

      setIsLoading(false);

      //   if (response?.status === false) return toast.error(`${response.message}..!!`);

      navigate("/wb/administration/users");
    } catch (error) {
      setIsLoading(false);
      toast.error(`${error.message}..!!`);
    }
  };

  useEffect(() => {
    if (!id) return navigate("/wb/administration/configs");

    configApi
      .getById(id)
      .then((res) => {
        setOpenedFormConfig(res.data.transaction);
      })
      .catch((error) => {
        toast.error(`${error.message}.`);

        return navigate("/wb/administration/configs");
      });

    return () => {
      // console.clear();
    };
  }, []);

  return (
    <Box mt={1}>
      <Header title="CREATE USER" subtitle="Tambah User" />

      <Formik onSubmit={handleFormikSubmit} initialValues={openedFormConfig} validationSchema={validationSchema}>
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

                      <Grid item xs={6} sm={3}>
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
                      <Grid item xs={6} sm={3}>
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
    </Box>
  );
};

export default UserCreate;
