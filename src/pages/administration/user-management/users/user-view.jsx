import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Box, Button, FormControl, InputLabel, Select, TextField, MenuItem, CircularProgress } from "@mui/material";

import { Formik } from "formik";
import * as yup from "yup";

import useMediaQuery from "@mui/material/useMediaQuery";

import Header from "../../../../components/layout/signed/Header";

import { useConfig, useUser } from "../../../../hooks";

const initialValues = {
  username: "",
  email: "",
  nik: "",
  name: "",
  division: "",
  position: "",
  phone: "",
  role: 0,

  isLDAPUser: false,
};
const userSchema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string().email().required(),
  nik: yup.string().required(),
  name: yup.string().required(),
  division: yup.string().required(),
  position: yup.string().required(),
  role: yup.number().required(),
});

const UserCreate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { ROLES } = useConfig();
  const { useFindFirstUserMutation, useCreateUserMutation } = useUser();

  const [findFirstUser] = useFindFirstUserMutation();
  const [createUser, { isLoading }] = useCreateUserMutation();

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const [userValues, setUserValues] = useState({});
  const [dtRoles, setDtRoles] = useState(ROLES);

  const handleFormikSubmit = (values) => {
    try {
      // createUser(values).then((results) => {
      //   navigate("/wb/administration/users");
      // });
      console.log("values", values);
    } catch (error) {
      toast.error(`${error.message}.`);
      return;
    }
  };

  useEffect(() => {
    console.log("Fetch user by id:", id);

    const data = {
      where: {
        id,
      },
    };

    findFirstUser(data).then((results) => {
      console.log("results search user:", results.data.data.user);
      setUserValues({ ...results.data.data.user });
    });
  }, []);

  return (
    <Box mt={4}>
      <Header title="USER DATA" subtitle="Informasi Detail User" />

      <Formik onSubmit={handleFormikSubmit} initialValues={userValues} validationSchema={userSchema}>
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Box display="flex" justifyContent="end">
                {/* <Box flex={1}></Box> */}

                <Button type="submit" variant="contained" sx={{ mb: 1 }}>
                  Simpan
                </Button>
                {isLoading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: "-12px",
                      marginLeft: "-12px",
                    }}
                  />
                )}
                <Button
                  variant="contained"
                  sx={{ mb: 1, ml: 0.5 }}
                  onClick={() => {
                    console.log("values", userValues);
                  }}
                >
                  Di Non-Aktifkan
                </Button>
                <Button variant="contained" sx={{ mb: 1, ml: 0.5 }} onClick={() => {}}>
                  Hapus
                </Button>
                <Button variant="contained" sx={{ mb: 1, ml: 0.5 }} onClick={() => {}}>
                  Batal
                </Button>
              </Box>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{ "& > div": { gridColumn: isNonMobile ? undefined : "span 4" } }}
              >
                <TextField
                  name="name"
                  label="Nama"
                  type="text"
                  required
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={values.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  name="nik"
                  label="NIK"
                  type="text"
                  required
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={values.nik}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.nik && !!errors.nik}
                  helperText={touched.nik && errors.nik}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  name="username"
                  label="Username"
                  type="text"
                  required
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={values.username}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.username && !!errors.username}
                  helperText={touched.username && errors.username}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  name="email"
                  label="Email"
                  type="text"
                  required
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  name="position"
                  label="Posisi"
                  type="text"
                  required
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={values.position}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.position && !!errors.position}
                  helperText={touched.position && errors.position}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  name="division"
                  label="Divisi"
                  type="text"
                  required
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={values.division}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.division && !!errors.division}
                  helperText={touched.division && errors.division}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  name="phone"
                  label="Telephone"
                  type="text"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={values.phone}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={!!touched.phone && !!errors.phone}
                  helperText={touched.phone && errors.phone}
                  sx={{ gridColumn: "span 2" }}
                />

                <FormControl fullWidth size="small" sx={{ gridColumn: "span 2" }} required>
                  <InputLabel id="role">Role</InputLabel>
                  <Select
                    labelId="role"
                    label="Role"
                    name="role"
                    value={values.role}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={!!touched.role && !!errors.role}
                    helperText={touched.role && errors.role}
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
                  </Select>
                </FormControl>

                {/* <div sx={{ gridColumn: "span 2" }}></div> */}
              </Box>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default UserCreate;
