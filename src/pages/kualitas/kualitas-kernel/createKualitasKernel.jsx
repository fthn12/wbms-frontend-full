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
import { useProduct, useConfig, useKualitasKernel } from "../../../hooks";

const CreateKualitasKernel = (props) => {
  const { isOpen, onClose, refetch } = props;
  const { useCreateKualitasKernelMutation } = useKualitasKernel();
  const [create] = useCreateKualitasKernelMutation();
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

  const checkoutSchema = yup.object().shape({
    MoisturePercentage: yup.number().required("required"),
    DirtPercentage: yup.number().required("required"),
    StonePercentage: yup.number().required("required"),
  });

  const initialValues = {
    MoisturePercentage: 0,
    DirtPercentage: 0,
    StonePercentage: 0,
  };

  return (
    <Dialog open={isOpen} fullWidth maxWidth="md">
      <DialogTitle sx={{ color: "white", backgroundColor: blue[900], fontSize: "18px" }}>
        UPDATE KUALITAS KERNEL
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
                    Moisture Percentage
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
                    }}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.MoisturePercentage > 0 ? values.MoisturePercentage : "0"}
                    name="MoisturePercentage"
                    error={!!touched.MoisturePercentage && !!errors.MoisturePercentage}
                    helperText={touched.MoisturePercentage && errors.MoisturePercentage}
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
                   Dirt Percentage
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
                    }}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.DirtPercentage > 0 ? values.DirtPercentage : "0"}
                    name="DirtPercentage"
                    error={!!touched.DirtPercentage && !!errors.DirtPercentage}
                    helperText={touched.DirtPercentage && errors.DirtPercentage}
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
                    Stone Percentage
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
                    }}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values?.StonePercentage > 0 ? values.StonePercentage : "0"}
                    name="StonePercentage"
                    error={!!touched.StonePercentage && !!errors.StonePercentage}
                    helperText={touched.StonePercentage && errors.StonePercentage}
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
                  <Button type="submit" variant="contained">
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

export default CreateKualitasKernel;
