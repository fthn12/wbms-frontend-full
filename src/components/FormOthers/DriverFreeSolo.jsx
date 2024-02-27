import React from "react";
import { Box, TextField, IconButton, CircularProgress } from "@mui/material";

import { Field, useFormikContext } from "formik";
import { Autocomplete } from "formik-mui";

import SyncIcon from "@mui/icons-material/Sync";

import { useDriver } from "../../hooks";

export const DriverFreeSolo = (props) => {
  const { name, sx, isReadOnly, ...others } = props;
  const { values, handleChange, setFieldValue } = useFormikContext();

  const { useGetEdispatchDriversQuery, useEDispatchDriverSyncMutation } = useDriver();

  const { data, refetch } = useGetEdispatchDriversQuery();
  const [eDispatchSync, { isLoading }] = useEDispatchDriverSyncMutation();

  return (
    <Box display="flex" sx={{ ...sx }} alignItems="start">
      {/* justifyContent="center" alignItems="center" */}
      {data && (
        <>
          <Field
            name={name}
            component={Autocomplete}
            variant="outlined"
            fullWidth
            freeSolo
            disableClearable
            readOnly={isReadOnly}
            options={data?.records.map((record) => record.name)}
            onInputChange={(event, InputValue, reason) => {
              if (reason !== "reset") {
                setFieldValue("driverName", InputValue.toUpperCase());
              }
            }}
            renderInput={(params) => (
              <TextField
                {...others}
                {...params}
                name={name}
                required={true}
                size="small"
                sx={{ backgroundColor: isReadOnly ? "whitesmoke" : "white" }}
                inputProps={{
                  ...params.inputProps,
                  style: { textTransform: "uppercase" },
                }}
              />
            )}
          />

        
        </>
      )}
      {isLoading && (
        <CircularProgress
          size={50}
          sx={{
            color: "goldenrod",
            position: "absolute",
            top: "50%",
            left: "48.5%",
            zIndex: 999,
          }}
        />
      )}
    </Box>
  );
};
