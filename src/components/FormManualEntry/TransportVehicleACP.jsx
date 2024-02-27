import React from "react";
import { Box, TextField, IconButton, CircularProgress } from "@mui/material";

import { Field, useFormikContext } from "formik";
import { Autocomplete } from "formik-mui";

import SyncIcon from "@mui/icons-material/Sync";

import { useTransportVehicle } from "../../hooks";

export const TransportVehicleACP = (props) => {
  const { name, sx, isReadOnly, ...others } = props;
  const { values, handleChange, setFieldValue } = useFormikContext();

  const { useGetEdispatchTransportVehiclesQuery, useEDispatchTransportVehicleSyncMutation } = useTransportVehicle();

  const { data, refetch } = useGetEdispatchTransportVehiclesQuery();
  const [eDispatchSync, { isLoading }] = useEDispatchTransportVehicleSyncMutation();

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
            readOnly={isReadOnly}
            value={(values && data?.records?.find((item) => item.id === values.transportVehicleId)) || null}
            options={data?.records || []}
            getOptionLabel={(option) => option.plateNo}
            onChange={(event, newValue) => {
              setFieldValue("transportVehicleId", newValue ? newValue.id : "");
              setFieldValue("transportVehiclePlateNo", newValue ? newValue.plateNo : "");
              
            }}
            renderInput={(params) => (
              <TextField
                {...others}
                {...params}
                name={name}
                required={true}
                size="small"
                sx={{ backgroundColor: isReadOnly ? "whitesmoke" : "white" }}
              />
            )}
          />

          <IconButton
            size="small"
            disabled={isReadOnly}
            sx={{
              ml: 0.2,
              // width: 40,
              height: 36,
              borderRadius: 1,
              // border: 0.1,
              backgroundColor: "primary.main",
              color: "white",
              ":hover": {
                backgroundColor: "primary.main",
                color: "yellow",
              },
              ":disabled": {
                backgroundColor: "lightgrey",
                color: "white",
              },
              ".MuiTouchRipple-ripple .MuiTouchRipple-child": {
                borderRadius: 0,
                backgroundColor: "goldenrod",
              },
            }}
            style={{}}
            onClick={() => {
              eDispatchSync().then(() => refetch());
            }}
          >
            <SyncIcon sx={{ fontSize: 18 }} />
          </IconButton>
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
