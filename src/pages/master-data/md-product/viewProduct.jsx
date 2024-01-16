import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  FormControl,
  IconButton,
  FormLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Formik } from "formik";
import * as yup from "yup";

const ViewProduct = ({ isViewOpen, onClose, dtProducts }) => {
  return (
    <Dialog
      open={isViewOpen}
      fullWidth
      inputProps={{ readOnly: true }}
      maxWidth="md"
      onClose={() => onClose("", false)}
    >
      <DialogTitle
        sx={{ color: "white", backgroundColor: "black", fontSize: "27px" }}
      >
        Detail Data Product
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

      <Formik initialValues={dtProducts}>
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
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
                <FormControl sx={{ gridColumn: "span 8" }}>
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
                    inputProps={{ readOnly: true }}
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
                    inputProps={{ readOnly: true }}
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
                <FormControl sx={{ gridColumn: "span 4" }}>
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
                    inputProps={{ readOnly: true }}
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
                    Product Group Name
                  </FormLabel>
                  <TextField
                    fullWidth
                    inputProps={{ readOnly: true }}
                    variant="outlined"
                    type="text"
                    placeholder="Masukkan Product Group Name...."
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.productGroupName}
                    name="productGroupName"
                    error={
                      touched.productGroupName && !!errors.productGroupName
                    }
                    helperText={
                      touched.productGroupName && errors.productGroupName
                    }
                  />

                  <FormLabel
                    sx={{
                      marginBottom: "8px",
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
                    inputProps={{ readOnly: true }}
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
                    inputProps={{ readOnly: true }}
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
                    // Atur ukuran tulisan label di sini
                  />
                </FormControl>
              </Box>
            </DialogContent>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ViewProduct;
