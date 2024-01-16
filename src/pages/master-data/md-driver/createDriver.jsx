import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  FormLabel,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as yup from "yup";
import { grey } from "@mui/material/colors";
import moment from "moment";
import { useDriver } from "../../../hooks";

const CreateDriver = ({ isOpen, onClose, dtCompany }) => {
  const { useCreateDriverMutation } = useDriver();
  const [createDriver] = useCreateDriverMutation();
  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    values.licenseED = moment(values.licenseED).toDate();
    try {
      createDriver(values).then((results) => {
        toast.success("Data Berhasil Disimpan");
        setSubmitting(false);
        resetForm();
        onClose("", false);
      });
    } catch (error) {
      toast.error(`${error.message}.`); // Tampilkan notifikasi error
      return;
    }
  };

  const checkoutSchema = yup.object().shape({
    companyId: yup.string().required("required"),
    companyName: yup.string().required("required"),
    nik: yup.string().required("required"),
    name: yup.string().required("required"),
    address: yup.string().required("required"),
    email: yup.string().email("Enter a valid email").required("Email is required"),
    phone: yup.string().required("required"),
    code: yup.string().required("required"),
    licenseNo: yup.string().required("required"),
    licenseED: yup.date().required("required"),
  });
  const initialValues = {
    companyId: "",
    companyName: "",
    code: "",
    nik: "",
    name: "",
    address: "",
    email: "",
    phone: "",
    licenseNo: "",
    licenseED: "",
  };

  return (
    <Dialog open={isOpen} fullWidth maxWidth="md">
      <DialogTitle sx={{ color: "white", backgroundColor: "black", fontSize: "27px" }}>
        Tambah Data Driver
        <IconButton
          sx={{
            color: "white",
            position: "absolute",
            right: "10px",
            top: "15px",
          }}
          onClick={() => {
            onClose("", false);
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Formik onSubmit={handleSubmit} initialValues={initialValues} validationSchema={checkoutSchema}>
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <DialogContent dividers>
              <Box
                display="grid"
                padding={2}
                paddingBottom={2}
                paddingLeft={3}
                paddingRight={3}
                gap="20px"
                gridTemplateColumns="repeat(8, minmax(0, 1fr))"
              >
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      color: "black",
                      marginBottom: "8px",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    NPK
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan NPK...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.nik}
                    name="nik"
                    error={!!touched.nik && !!errors.nik}
                    helperText={touched.nik && errors.nik}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      color: "black",
                      marginBottom: "8px",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Code
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Code...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.code}
                    name="code"
                    error={!!touched.code && !!errors.code}
                    helperText={touched.code && errors.code}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 8" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Name
                  </FormLabel>

                  <TextField
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Name...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.name}
                    name="name"
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    id="name-input"
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    License (SIM)
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan License (SIM)..."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.licenseNo}
                    name="licenseNo"
                    error={!!touched.licenseNo && !!errors.licenseNo}
                    helperText={touched.licenseNo && errors.licenseNo}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    License ED
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="date"
                    placeholder="Masukkan License ED..."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.licenseED}
                    name="licenseED"
                    error={!!touched.licenseED && !!errors.licenseED}
                    helperText={touched.licenseED && errors.licenseED}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      color: "black",
                      marginBottom: "8px",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Company
                  </FormLabel>
                  <Select
                    fullWidth
                    name="companyId"
                    value={values?.companyId}
                    onBlur={handleBlur}
                    onChange={(event) => {
                      handleChange(event);
                      const selectedCompany = dtCompany.find((item) => item.id === event.target.value);
                      setFieldValue("companyName", selectedCompany ? selectedCompany.name : "");
                    }}
                    displayEmpty
                    sx={{
                      color: MenuItem ? "gray" : "black",
                    }}
                  >
                    <MenuItem value="" disabled>
                      -- Pilih Company --
                    </MenuItem>
                    {dtCompany.map((item) => {
                      return (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl sx={{ gridColumn: "span 4", display: "none" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Company Name
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Company Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.companyName}
                    name="companyName"
                    error={!!touched.companyName && !!errors.companyName}
                    helperText={touched.companyName && errors.companyName}
                  />
                </FormControl>

                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Email
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="email"
                    placeholder="Masukkan Email..."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.email}
                    name="email"
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Phone Number
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Phone Number...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.phone}
                    name="phone"
                    error={!!touched.phone && !!errors.phone}
                    helperText={touched.phone && errors.phone}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Address
                  </FormLabel>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Address...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.address}
                    name="address"
                    error={!!touched.address && !!errors.address}
                    helperText={touched.address && errors.address}
                  />
                </FormControl>
              </Box>
            </DialogContent>

            <Box display flex p={1}>
              <DialogActions>
                <Box mr="auto" ml={4}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: grey[700],
                      color: "white",
                    }}
                    onClick={() => {
                      onClose("", false);
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
                <Box mr={4}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      color: "white",
                    }}
                  >
                    Simpan
                  </Button>
                </Box>
              </DialogActions>
            </Box>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default CreateDriver;
