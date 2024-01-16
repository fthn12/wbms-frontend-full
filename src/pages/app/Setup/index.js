import { useState, Children } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, MenuItem, Paper, Grid, Stepper, Step, StepLabel, CircularProgress } from "@mui/material";
import { Formik, Form, Field } from "formik";
import { TextField, Select } from "formik-mui";
import * as yup from "yup";
import { toast } from "react-toastify";

import Header from "../../../components/layout/public/Header";

import { useConfig } from "../../../hooks";
import { ConfigAPI } from "../../../apis";

const initialValues = {
  username_1: "",
  password_1: "",
  passwordConfirm_1: "",
  email_1: "",
  npk_1: "",
  nik_1: "",
  name_1: "",
  division_1: "",
  position_1: "",
  phone_1: "",
  role_1: 4,
  isLDAPUser_1: false,

  username_2: "",
  password_2: "",
  passwordConfirm_2: "",
  email_2: "",
  npk_2: "",
  nik_2: "",
  name_2: "",
  division_2: "",
  position_2: "",
  phone_2: "",
  role_2: 5,
  isLDAPUser_2: false,

  username_3: "",
  password_3: "",
  passwordConfirm_3: "",
  email_3: "",
  npk_3: "",
  nik_3: "",
  name_3: "",
  division_3: "",
  position_3: "",
  phone_3: "",
  role_3: 6,
  isLDAPUser_3: false,

  siteType: 1,
  siteCutOffHour: 7,
  siteCutOffMinute: 0,

  btSiteCode: "",
  btSuffixTrx: "1",
  btSuffixForm: "8",
  btSuffixTemplate: "9",
  btApproval1: "",
  btApproval2: "",

  wbIP: "localhost",
  wbPort: 9001,
  wbMinWeight: 1,
  wbStablePeriod: 3000,

  logErrorToFile: false,
  logErrorToDB: true,
  logTrxToFile: false,
  logTrxToDB: true,

  eDispatchApiKey: "",
  eDispatchApiUrl1: "",
  eDispatchApiUrl2: "",
  eDispatchApi: 1,
};

// yup.object().shape({
const validationSchema = [
  {
    username_1: yup.string().required("Wajib diisi."),
    password_1: yup
      .string()
      .min(8, "Panjang password minimal 8 karakter dan maksimal 20 karakter.")
      .max(20, "Panjang password minimal 8 karakter dan maksimal 20 karakter.")
      .required("Wajib diisi."),
    passwordConfirm_1: yup.string().oneOf([yup.ref("password_1"), null], "Password harus sama."),
    email_1: yup.string().email("Email tidak valid.").required("Wajib diisi."),
    npk_1: yup.string().required("Wajib diisi."),
    nik_1: yup.string().required("Wajib diisi."),
    name_1: yup.string().required("Wajib diisi."),
    division_1: yup.string().required("Wajib diisi."),
    position_1: yup.string().required("Wajib diisi."),
    role_1: yup.number().required("Wajib diisi."),
  },
  {
    username_2: yup.string().required("Wajib diisi."),
    password_2: yup
      .string()
      .min(8, "Panjang password minimal 8 karakter dan maksimal 20 karakter.")
      .max(20, "Panjang password minimal 8 karakter dan maksimal 20 karakter.")
      .required("Wajib diisi."),
    passwordConfirm_2: yup.string().oneOf([yup.ref("password_2"), null], "Password harus sama."),
    email_2: yup.string().email("Email tidak valid.").required("Wajib diisi."),
    npk_2: yup.string().required("Wajib diisi."),
    nik_2: yup.string().required("Wajib diisi."),
    name_2: yup.string().required("Wajib diisi."),
    division_2: yup.string().required("Wajib diisi."),
    position_2: yup.string().required("Wajib diisi."),
    role_2: yup.number().required("Wajib diisi."),
  },
  {
    username_3: yup.string().required("Wajib diisi."),
    password_3: yup
      .string()
      .min(8, "Panjang password minimal 8 karakter dan maksimal 20 karakter.")
      .max(20, "Panjang password minimal 8 karakter dan maksimal 20 karakter.")
      .required("Wajib diisi."),
    passwordConfirm_3: yup.string().oneOf([yup.ref("password_3"), null], "Password harus sama."),
    email_3: yup.string().email("Email tidak valid.").required("Wajib diisi."),
    npk_3: yup.string().required("Wajib diisi."),
    nik_3: yup.string().required("Wajib diisi."),
    name_3: yup.string().required("Wajib diisi."),
    division_3: yup.string().required("Wajib diisi."),
    position_3: yup.string().required("Wajib diisi."),
    role_3: yup.number().required("Wajib diisi."),
  },
  {
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

    btSiteCode: yup.string().required("Wajib diisi."),
    btSuffixTrx: yup.string().required("Wajib diisi."),
    btSuffixForm: yup.string().required("Wajib diisi."),
    btSuffixTemplate: yup.string().required("Wajib diisi."),
    btApproval1: yup.string().required("Wajib diisi."),
    btApproval2: yup.string().required("Wajib diisi."),

    wbPort: yup.number().required("Wajib diisi."),
    wbMinWeight: yup.number().required("Wajib diisi."),
    wbStablePeriod: yup.number().min(3000, "Minimal 3.000 ms (3s)").required("Wajib diisi."),

    logErrorToFile: yup.boolean().required("Wajib diisi."),
    logErrorToDB: yup.boolean().required("Wajib diisi."),
    logTrxToFile: yup.boolean().required("Wajib diisi."),
    logTrxToDB: yup.boolean().required("Wajib diisi."),

    eDispatchApiKey: yup.string().required("Wajib diisi."),
    eDispatchApiUrl1: yup.string().url("Diisi dengan alamat URL yang valid.").required("Wajib diisi."),
    eDispatchApiUrl2: yup.string().url("Diisi dengan alamat URL yang valid.").required("Wajib diisi."),
    eDispatchApi: yup.number().required("Wajib diisi."),
  },
];

const steps = ["Membuat User Admin HC", "Membuat User Admin System", "Membuat User Admin IT", "Inisialisasi Config"];

const UserCreate = () => {
  const navigate = useNavigate();

  const { ROLES, EDISPATCH_SERVER, SITE_TYPES } = useConfig();

  const configAPI = ConfigAPI();

  const [dtRoles] = useState(ROLES);
  const [dtEDispatchServer] = useState(EDISPATCH_SERVER);
  const [dtSiteTypes] = useState(SITE_TYPES);

  const [isLoading, setIsLoading] = useState(false);

  const handleFormikSubmit = async (values, helpers) => {
    setIsLoading(true);

    try {
      const response = await configAPI.Setup(values);

      setIsLoading(false);

      if (response?.status === false) return toast.error(`${response.message}..!!`);

      navigate("/");
    } catch (error) {
      setIsLoading(false);
      toast.error(`${error.message}..!!`);
    }
  };

  return (
    <Box mt={1}>
      <Header
        title="APPLICATION SETUP"
        subtitle="Membuat User Admin HC, Admin System, Admin IT, dan Inisialisasi Config"
      />

      <FormikStepper
        onSubmit={handleFormikSubmit}
        initialValues={initialValues}
        validationSchema={validationSchema}
        isLoading={isLoading}
      >
        <Grid container justifyContent="center" spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <Grid container justifyContent="center" spacing={2}>
              <Grid item xs={12} sm={6}>
                <Field
                  name="username_1"
                  label="Username"
                  type="text"
                  component={TextField}
                  autoFocus
                  required
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  name="email_1"
                  label="Email"
                  type="text"
                  required
                  component={TextField}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="npk_1"
                  label="NPK"
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
                  name="nik_1"
                  label="NIK"
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
                  name="name_1"
                  label="Nama"
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
                  name="phone_1"
                  label="Telephone"
                  type="text"
                  component={TextField}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="position_1"
                  label="Posisi"
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
                  name="division_1"
                  label="Divisi"
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
                  name="password_1"
                  label="Password"
                  type="password"
                  component={TextField}
                  required
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  name="passwordConfirm_1"
                  label="Konfirmasi Password"
                  type="password"
                  component={TextField}
                  required
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="role_1"
                  label="Role"
                  id="role_1"
                  labelId="role_1_lbl"
                  component={Select}
                  disabled
                  size="small"
                  formControl={{
                    fullWidth: true,
                    required: true,
                  }}
                >
                  {dtRoles &&
                    dtRoles.length > 0 &&
                    dtRoles?.map((data, index) => {
                      return (
                        <MenuItem key={index} value={data.id}>
                          {data.value}
                        </MenuItem>
                      );
                    })}
                </Field>
              </Grid>
              <Grid item xs={12} sm={6}></Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container justifyContent="center" spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <Grid container justifyContent="center" spacing={2}>
              <Grid item xs={12} sm={6}>
                <Field
                  name="username_2"
                  label="Username"
                  type="text"
                  component={TextField}
                  autoFocus
                  required
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  name="email_2"
                  label="Email"
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
                  name="npk_2"
                  label="NPK"
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
                  name="nik_2"
                  label="NIK"
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
                  name="name_2"
                  label="Nama"
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
                  name="phone_2"
                  label="Telephone"
                  type="text"
                  component={TextField}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="position_2"
                  label="Posisi"
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
                  name="division_2"
                  label="Divisi"
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
                  name="password_2"
                  label="Password"
                  type="password"
                  component={TextField}
                  required
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  name="passwordConfirm_2"
                  label="Konfirmasi Password"
                  type="password"
                  component={TextField}
                  required
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="role_2"
                  label="Role"
                  id="role_2"
                  labelId="role_2_lbl"
                  component={Select}
                  disabled
                  size="small"
                  formControl={{
                    fullWidth: true,
                    required: true,
                  }}
                >
                  {dtRoles &&
                    dtRoles.length > 0 &&
                    dtRoles?.map((data, index) => {
                      return (
                        <MenuItem key={index} value={data.id}>
                          {data.value}
                        </MenuItem>
                      );
                    })}
                </Field>
              </Grid>
              <Grid item xs={12} sm={6}></Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container justifyContent="center" spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <Grid container justifyContent="center" spacing={2}>
              <Grid item xs={12} sm={6}>
                <Field
                  name="username_3"
                  label="Username"
                  type="text"
                  component={TextField}
                  autoFocus
                  required
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  name="email_3"
                  label="Email"
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
                  name="npk_3"
                  label="NPK"
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
                  name="nik_3"
                  label="NIK"
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
                  name="name_3"
                  label="Nama"
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
                  name="phone_3"
                  label="Telephone"
                  type="text"
                  component={TextField}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="position_3"
                  label="Posisi"
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
                  name="division_3"
                  label="Divisi"
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
                  name="password_3"
                  label="Password"
                  type="password"
                  component={TextField}
                  required
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field
                  name="passwordConfirm_3"
                  label="Konfirmasi Password"
                  type="password"
                  component={TextField}
                  required
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Field
                  name="role_3"
                  label="Role"
                  id="role_3"
                  labelId="role_3_lbl"
                  component={Select}
                  disabled
                  size="small"
                  formControl={{
                    fullWidth: true,
                    required: true,
                  }}
                >
                  {dtRoles &&
                    dtRoles.length > 0 &&
                    dtRoles?.map((data, index) => {
                      return (
                        <MenuItem key={index} value={data.id}>
                          {data.value}
                        </MenuItem>
                      );
                    })}
                </Field>
              </Grid>
              <Grid item xs={12} sm={6}></Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container justifyContent="center" spacing={3} sx={{ mt: 2 }}>
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
      </FormikStepper>
    </Box>
  );
};

export const FormikStepper = ({ children, ...props }) => {
  const navigate = useNavigate();

  const { isLoading } = props;

  const childrenArray = Children.toArray(children);

  const [step, setStep] = useState(0);

  const currentChild = childrenArray[step];

  return (
    <Formik
      {...props}
      validationSchema={yup.object().shape(props.validationSchema[step])}
      onSubmit={(values, helpers) => {
        if (step >= childrenArray.length - 1) {
          props.onSubmit(values);
        } else {
          helpers.setSubmitting(false);
          setStep((s) => s + 1);
        }
      }}
    >
      {({ values, errors }) => (
        <Form>
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
          <Box sx={{ display: "flex", mt: 3, justifyContent: "end" }}>
            {/* <Box flex={1}></Box> */}

            <Button type="submit" variant="contained" disabled={step < childrenArray.length - 1}>
              Simpan
            </Button>
            <Button variant="contained" sx={{ ml: 0.5 }} onClick={() => navigate("/")}>
              Batal
            </Button>
          </Box>
          <Paper sx={{ mt: 1, p: 2, minHeight: "72vh" }}>
            <Grid container justifyContent="center" spacing={3}>
              <Grid item xs={12} sm={6}>
                <Stepper activeStep={step}>
                  {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                      <Step key={index} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
              </Grid>
            </Grid>
            {currentChild}
            <Grid container justifyContent="center" spacing={3} sx={{ mt: 3 }}>
              <Grid item xs={12} sm={6}>
                <Box display="flex">
                  <Button variant="contained" disabled={step <= 0} onClick={() => setStep((s) => s - 1)}>
                    Back
                  </Button>
                  <Box flex={1}></Box>
                  <Button type="submit" variant="contained" disabled={step >= childrenArray.length - 1}>
                    Next
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Form>
      )}
    </Formik>
  );
};

export default UserCreate;
