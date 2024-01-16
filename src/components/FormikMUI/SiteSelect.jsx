import React from "react";
import { Box, MenuItem, IconButton, CircularProgress } from "@mui/material";

import { Field } from "formik";
import { Select } from "formik-mui";

import SyncIcon from "@mui/icons-material/Sync";

import { useSite } from "../../hooks";

export const SiteSelect = (props) => {
  const { isRequired, isReadOnly, backgroundColor, sx, ...others } = props;

  const { useGetSitesQuery, useEDispatchSiteSyncMutation } = useSite();

  const { data, refetch } = useGetSitesQuery();
  const [eDispatchSync, { isLoading }] = useEDispatchSiteSyncMutation();

  return (
    <Box display="flex" sx={{ ...sx }} alignItems="start">
      {/* justifyContent="center" alignItems="center" */}
      {data && (
        <>
          <Field
            {...others}
            id="storageTankId"
            labelId="storageTankLbl"
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
            {data &&
              data?.records?.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {`[${item.code}] ${item.name}`}
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
