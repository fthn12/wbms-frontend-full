import React from "react";
import { Box, MenuItem, IconButton, CircularProgress } from "@mui/material";

import { Field } from "formik";
import { Select } from "formik-mui";

import { useConfig } from "../../hooks";

export const CertificateSelect = (props) => {
  const { isRequired, isReadOnly, backgroundColor, sx, ...others } = props;

  const { SCC_MODEL } = useConfig();

  return (
    <Box display="flex" sx={{ ...sx }} alignItems="start">
      {/* justifyContent="center" alignItems="center" */}
      {SCC_MODEL && (
        <Field
          {...others}
          id="certificateId"
          labelId="certificateLbl"
          size="small"
          formControl={{
            fullWidth: true,
            required: isRequired,
            size: "small",
            sx: { backgroundColor },
          }}
          inputProps={{ readOnly: isReadOnly }}
          component={Select}
        >
          {SCC_MODEL &&
            SCC_MODEL.map((item, index) => (
              <MenuItem key={index} value={item.id}>
                {`${item.value}`}
              </MenuItem>
            ))}
        </Field>
      )}
    </Box>
  );
};
