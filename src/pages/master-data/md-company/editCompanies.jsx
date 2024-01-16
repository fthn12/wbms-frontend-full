import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  IconButton,
  DialogActions,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as yup from "yup";
import { grey } from "@mui/material/colors";
import { useCompany } from "../../../hooks";

const EditCompanies = ({ isEditOpen, onClose, dtCompanies }) => {
  const { useUpdateCompanyMutation } = useCompany();
  const [updateCompany] = useUpdateCompanyMutation();

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      updateCompany(values).then((results) => {
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

  const userSchema = yup.object().shape({
    name: yup.string().required("required"),
    province: yup.string().required("required"),
    city: yup.string().required("required"),
    code: yup.string().required("required"),
    codeVendor: yup.string().required("required"),
    persenPotngWajib: yup.string().required("required"),
    type: yup.string().required("required"),
    shortName: yup.string().required("required"),
    address: yup.string().required("required"),
    addressExt: yup.string().required("required"),
    postalCode: yup.string().required("required"),
    country: yup.string().required("required"),
    phone: yup.string().required("required"),
    url: yup.string().required("required"),
    contactName: yup.string().required("required"),
    contactEmail: yup.string().required("required"),
    contactPhone: yup.string().required("required"),
    isMillOperator: yup.boolean().required("required"),
    isTransporter: yup.boolean().required("required"),
    isSiteOperator: yup.boolean().required("required"),
    isEstate: yup.boolean().required("required"),
  });

  return (
    <Dialog open={isEditOpen} fullWidth maxWidth="md" onClose={() => onClose("", false)}>
      <DialogTitle sx={{ color: "white", backgroundColor: "black", fontSize: "27px" }}>
        Edit Data Company
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

      <Formik onSubmit={handleFormSubmit} initialValues={dtCompanies} validationSchema={userSchema}>
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
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
                <FormControl sx={{ gridColumn: "span 4" }}>
                  <FormLabel
                    sx={{
                      color: "black",
                      marginBottom: "8px",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Code Vendor
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Code Vendor...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.codeVendor}
                    name="codeVendor"
                    error={!!touched.codeVendor && !!errors.codeVendor}
                    helperText={touched.codeVendor && errors.codeVendor}
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 5" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Full Name
                  </FormLabel>

                  <TextField
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Full Name...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.name}
                    name="name"
                    error={!!touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                    id="name-input"
                  />
                </FormControl>
                <FormControl sx={{ gridColumn: "span 3" }}>
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Short Name
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Masukkan Short Name...."
                    type="text"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.shortName}
                    name="shortName"
                    error={!!touched.shortName && !!errors.shortName}
                    helperText={touched.shortName && errors.shortName}
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
                    Url
                  </FormLabel>
                  <TextField
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Url...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.url}
                    name="url"
                    error={!!touched.url && !!errors.url}
                    helperText={touched.url && errors.url}
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
                    value={values?.contactEmail}
                    name="contactEmail"
                    error={!!touched.contactEmail && !!errors.contactEmail}
                    helperText={touched.contactEmail && errors.contactEmail}
                  />
                </FormControl>{" "}
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
                    Contact Name
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Contact Name..."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.contactName}
                    name="contactName"
                    error={!!touched.contactName && !!errors.contactName}
                    helperText={touched.contactName && errors.contactName}
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
                    Contact Phone
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Contact Phone.."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.contactPhone}
                    name="contactPhone"
                    error={!!touched.contactPhone && !!errors.contactPhone}
                    helperText={touched.contactPhone && errors.contactPhone}
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
                    Country
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Country Name...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.country}
                    name="country"
                    error={!!touched.country && !!errors.country}
                    helperText={touched.country && errors.country}
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
                    Province
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Province ...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.province}
                    name="province"
                    error={!!touched.province && !!errors.province}
                    helperText={touched.province && errors.province}
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
                    City
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan City ...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.city}
                    name="city"
                    error={!!touched.city && !!errors.city}
                    helperText={touched.city && errors.city}
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
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Alamat...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.address}
                    name="address"
                    error={!!touched.address && !!errors.address}
                    helperText={touched.address && errors.address}
                  />
                  <FormLabel
                    sx={{
                      marginBottom: "8px",
                      marginTop: "23px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Postal Code
                  </FormLabel>
                  <TextField
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Kode Pos...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.postalCode}
                    name="postalCode"
                    error={!!touched.postalCode && !!errors.postalCode}
                    helperText={touched.postalCode && errors.postalCode}
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
                    Address Ext
                  </FormLabel>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    variant="outlined"
                    placeholder="Masukkan alamat lengkap..."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.addressExt}
                    name="addressExt"
                    error={!!touched.addressExt && !!errors.addressExt}
                    helperText={touched.addressExt && errors.addressExt}
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
                    Tipe
                  </FormLabel>
                  <Select
                    labelId="label-module"
                    fullWidth
                    value={values?.type}
                    name="type"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      -- Pilih Tipe --
                    </MenuItem>
                    <MenuItem value="Internal">Internal</MenuItem>
                    <MenuItem value="Eksternal">Eksternal</MenuItem>
                  </Select>
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
                    Persen Potong Wajib
                  </FormLabel>
                  <TextField
                    variant="outlined"
                    type="number"
                    inputMode="decimal" // Mengizinkan angka desimal
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                          %
                        </InputAdornment>
                      ),
                    }}
                    placeholder="Masukkan Potongan Wajib...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.persenPotngWajib}
                    name="persenPotngWajib"
                    error={!!touched.persenPotngWajib && !!errors.persenPotngWajib}
                    helperText={touched.persenPotngWajib && errors.persenPotngWajib}
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
                    Mill Operator
                  </FormLabel>
                  <Select
                    labelId="label-module"
                    fullWidth
                    value={values?.isMillOperator}
                    name="isMillOperator"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      -- Pilih Mill Operator --
                    </MenuItem>
                    <MenuItem value={true}>YES</MenuItem>
                    <MenuItem value={false}>NO</MenuItem>
                  </Select>
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
                    Mill Operator Transporter
                  </FormLabel>
                  <Select
                    fullWidth
                    value={values?.isTransporter}
                    name="isTransporter"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      -- Pilih Mill Operator Transporter --
                    </MenuItem>
                    <MenuItem value={true}>YES</MenuItem>
                    <MenuItem value={false}>NO</MenuItem>
                  </Select>
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
                    SiteOperator
                  </FormLabel>
                  <Select
                    labelId="label-module"
                    fullWidth
                    value={values?.isSiteOperator}
                    name="isSiteOperator"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      -- Pilih SiteOperator --
                    </MenuItem>
                    <MenuItem value={true}>YES</MenuItem>
                    <MenuItem value={false}>NO</MenuItem>
                  </Select>
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
                    Estate
                  </FormLabel>
                  <Select
                    labelId="label-module"
                    fullWidth
                    value={values?.isEstate}
                    name="isEstate"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      -- Pilih Estate --
                    </MenuItem>
                    <MenuItem value={true}>YES</MenuItem>
                    <MenuItem value={false}>NO</MenuItem>
                  </Select>
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

export default EditCompanies;
