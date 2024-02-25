import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  TextField,
  FormControl,
  DialogActions,
  InputAdornment,
  IconButton,
  FormLabel,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import { Formik, Field } from "formik";
import * as yup from "yup";
import { grey, blue } from "@mui/material/colors";
import { useProduct, useConfig, useKualitasCpo } from "../../../hooks";

const CreateKualitasCpo = (props) => {
  const { isViewOpen, onClose, refetch, data } = props;
  const { useCreateProductMutation } = useProduct();
  const { useCreateKualitasCpoMutation } = useKualitasCpo();
  const [create] = useCreateKualitasCpoMutation();
  const [createProduct] = useCreateProductMutation();
  const { PRODUCT_TYPES } = useConfig();

  const [dtTypeProduct] = useState(PRODUCT_TYPES);

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    try {
      create(values).then((results) => {
        toast.success("Data Berhasil Disimpan");
        setSubmitting(false);
        resetForm();
        refetch();
        onClose("", false);
      });
    } catch (error) {
      toast.error(`${error.message}.`); // Tampilkan notifikasi error
      return;
    }
  };

  return (
    <Dialog open={isViewOpen} fullWidth maxWidth="md">
      <DialogTitle sx={{ color: "white", backgroundColor: blue[900], fontSize: "18px" }}>
        DETAIL KUALITAS CPO
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

      <Formik onSubmit={handleSubmit} initialValues={data}>
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <DialogContent dividers>
              <Box
                display="grid"
                padding={5}
                paddingBottom={3}
                paddingLeft={3}
                paddingRight={3}
                gap="20px"
                gridTemplateColumns="repeat(12, minmax(0, 1fr))"
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
                    Ffa Percentage
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="number"
                    inputMode="decimal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                          %
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    sx={{ backgroundColor: "whitesmoke" }}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.FfaPercentage > 0 ? values.FfaPercentage : "0"}
                    name="FfaPercentage"
                    error={!!touched.FfaPercentage && !!errors.FfaPercentage}
                    helperText={touched.FfaPercentage && errors.FfaPercentage}
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
                    Moist Percentage
                  </FormLabel>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="number"
                    inputMode="decimal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                          %
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    sx={{ backgroundColor: "whitesmoke" }}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.MoistPercentage > 0 ? values.MoistPercentage : "0"}
                    name="MoistPercentage"
                    error={!!touched.MoistPercentage && !!errors.MoistPercentage}
                    helperText={touched.MoistPercentage && errors.MoistPercentage}
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
                    Dirt Percentage
                  </FormLabel>

                  <TextField
                    variant="outlined"
                    type="number"
                    inputMode="decimal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end" sx={{ fontWeight: "bold" }}>
                          %
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    sx={{ backgroundColor: "whitesmoke" }}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.DirtPercentage > 0 ? values.DirtPercentage : "0"}
                    name="DirtPercentage"
                    error={!!touched.DirtPercentage && !!errors.DirtPercentage}
                    helperText={touched.DirtPercentage && errors.DirtPercentage}
                  />
                </FormControl>
              </Box>
            </DialogContent>
            {/* <Box display flex p={1}>
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
                  <Button type="submit" variant="contained">
                    Simpan
                  </Button>
                </Box>
              </DialogActions>
            </Box> */}
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default CreateKualitasCpo;
