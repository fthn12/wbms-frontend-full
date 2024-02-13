import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  FormLabel,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { Formik, Field } from "formik";
import * as yup from "yup";
import { grey } from "@mui/material/colors";
import { useProduct, useConfig } from "../../../hooks";

const EditProduct = (props) => {
  const { isEditOpen, onClose, dtProducts, refetch } = props;
  const { useUpdateProductMutation } = useProduct();
  const [updateProduct] = useUpdateProductMutation();
  const { PRODUCT_TYPES } = useConfig();

  const [dtTypeProduct] = useState(PRODUCT_TYPES);

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      updateProduct(values).then((results) => {
        toast.success("Data Berhasil Diedit");
        setSubmitting(false);
        resetForm();
        refetch();
        onClose("", false);
      });
    } catch (error) {
      toast.error(`${error.message}.`);
      return;
    }
  };

  const userSchema = yup.object().shape({
    code: yup.string().required("required"),
    codeSap: yup.string().required("required"),
    name: yup.string().required("required"),
    shortName: yup.string().required("required"),
    description: yup.string().required("required"),
  });

  return (
    <Dialog open={isEditOpen} fullWidth maxWidth="md" onClose={() => onClose("", false)}>
      <DialogTitle sx={{ color: "white", backgroundColor: "black", fontSize: "25px" }}>
        Edit Data Product
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

      <Formik onSubmit={handleFormSubmit} initialValues={dtProducts} validationSchema={userSchema}>
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <DialogContent dividers>
              <Box
                display="grid"
                padding={2}
                paddingBottom={3}
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
                    Kode Sap
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Kode Sap...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.codeSap}
                    name="codeSap"
                    error={!!touched.codeSap && !!errors.codeSap}
                    helperText={touched.codeSap && errors.codeSap}
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
                    Tipe Produk
                  </FormLabel>
                  <Select
                    labelId="productGroupId"
                    name="productGroupId"
                    value={values.productGroupId}
                    onBlur={handleBlur}
                    // onChange={handleChange}
                    onChange={(event) => {
                      handleChange(event);
                      const selectedProductType = dtTypeProduct.find((item) => item.id === event.target.value);
                      setFieldValue("productGroupName", selectedProductType ? selectedProductType.value : "");
                    }}
                    error={!!touched.productGroupId && !!errors.productGroupId}
                    helperText={touched.productGroupId && errors.productGroupId}
                    displayEmpty
                    sx={{
                      color: MenuItem ? "grey" : "black",
                    }}
                  >
                    <MenuItem value="" disabled>
                      -- Pilih Tipe Produk --
                    </MenuItem>
                    {dtTypeProduct &&
                      dtTypeProduct?.map((data, index) => {
                        return (
                          <MenuItem key={index} value={data.id}>
                            {data.value}
                          </MenuItem>
                        );
                      })}
                  </Select>

                  <FormLabel
                    sx={{
                      marginTop: "20px",
                      color: "black",
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    Sertifikasi
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan  Sertifikasi...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.certification}
                    name="certification"
                    error={touched.certification && !!errors.certification}
                    helperText={touched.certification && errors.certification}
                    // Atur ukuran tulisan label di sini
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
                    Deskripsi
                  </FormLabel>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Deskripsi...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.description}
                    name="description"
                    error={touched.description && !!errors.description}
                    helperText={touched.description && errors.description}
                  />
                </FormControl>
              </Box>
            </DialogContent>
            <Box display flex p={1}>
              <DialogActions>
                <Box mr="auto" ml={3}>
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

export default EditProduct;
