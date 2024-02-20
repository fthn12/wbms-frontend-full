import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Box, Button, MenuItem, CircularProgress, Grid, Paper } from "@mui/material";

import { Formik, Form, Field } from "formik";
import { TextField, Select } from "formik-mui";
import * as yup from "yup";

import Header from "../../../../components/layout/signed/Header";

import { UserAPI } from "../../../../apis";
import { useConfig, useUser } from "../../../../hooks";

const initialValues = {
  username: "",
  password: "",
  passwordConfirm: "",
  email: "",
  npk: "",
  nik: "",
  name: "",
  division: "",
  position: "",
  phone: "",
  role: 0,

  isLDAPUser: false,
};
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

  const { ROLES } = useConfig();

  const userAPI = UserAPI();

  const [dtRoles] = useState(ROLES);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormikSubmit = async (values) => {
    setIsLoading(true);

    try {
      const response = await userAPI.Create(values);

      setIsLoading(false);

      if (response?.status === false) return toast.error(`${response.message}..!!`);

      navigate("/wb/administration/users");
    } catch (error) {
      setIsLoading(false);
      toast.error(`${error.message}..!!`);
    }
  };

  return (
    <Box mt={1}>
      <Header title="CREATE USER" subtitle="Tambah User" />

      <Formik onSubmit={handleFormikSubmit} initialValues={initialValues} validationSchema={validationSchema}>
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
                <Button variant="contained" sx={{ ml: 0.5 }} onClick={() => navigate("/wb/administration/users")}>
                  BATAL
                </Button>
              </Box>

              <Paper sx={{ mt: 1, p: 2, minHeight: "71.5vh" }}>
                <Grid container justifyContent="center" spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Grid container justifyContent="center" spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name="username"
                          label="Username"
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
                          name="email"
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
                          name="npk"
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
                          name="nik"
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
                          name="name"
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
                          name="phone"
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
                          name="position"
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
                          name="division"
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
                          name="password"
                          label="Password"
                          type="password"
                          component={TextField}
                          variant="outlined"
                          size="small"
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Field
                          name="passwordConfirm"
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
                          id="role"
                          labelId="roleLbl"
                          name="role"
                          label="Role"
                          component={Select}
                          // disabled
                          formControl={{
                            fullWidth: true,
                            required: true,
                            size: "small",
                          }}
                        >
                          {dtRoles &&
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
