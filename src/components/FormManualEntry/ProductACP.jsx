import React from "react";
import { Box, MenuItem, TextField, IconButton, CircularProgress } from "@mui/material";

import { Field, useFormikContext } from "formik";
import { Autocomplete, Select } from "formik-mui";

import SyncIcon from "@mui/icons-material/Sync";

import { useProduct } from "../../hooks";

export const ProductACP = (props) => {
  const { data, name, sx, isReadOnly, ...others } = props;

  const { values, handleChange, setFieldValue } = useFormikContext();
  const { useGetProductsQuery, useEDispatchProductSyncMutation } = useProduct();

  const { refetch } = useGetProductsQuery();
  const [eDispatchSync, { isLoading }] = useEDispatchProductSyncMutation();

  return (
    <Box display="flex" sx={{ ...sx }} alignItems="start">
      {/* justifyContent="center" alignItems="center" */}
      {data && (
        <>
          <Field
            {...others}
            name={name}
            size="small"
            formControl={{
              fullWidth: true,
              required: true,
              size: "small",
            }}
            sx={{ backgroundColor: isReadOnly ? "whitesmoke" : "white" }}
            inputProps={{ readOnly: isReadOnly }}
            component={Select}
            onChange={(event) => {
              handleChange(event);
              const newValue = data?.records?.find((item) => item.id === event.target.value);
              setFieldValue("transportVehicleProductName", newValue ? newValue.name : "");
              setFieldValue("transportVehicleProductCode", newValue ? newValue.code : "");
              setFieldValue("productName", newValue ? newValue.name : "");
              setFieldValue("productId", newValue ? newValue.id : "");
              setFieldValue("productCode", newValue ? newValue.code : "");
            }}
          >
            {data &&
              data?.records?.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {`[${item.code}] - ${item.name}`}
                </MenuItem>
              ))}
          </Field>

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
