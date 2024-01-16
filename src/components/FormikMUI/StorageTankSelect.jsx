import React from "react";
import { Box, MenuItem, IconButton, CircularProgress } from "@mui/material";

import { Field } from "formik";
import { Select } from "formik-mui";

import SyncIcon from "@mui/icons-material/Sync";

import { useStorageTank } from "../../hooks";

export const StorageTankSelect = (props) => {
  const { siteId, isRequired, isReadOnly, backgroundColor, sx, ...others } = props;

  const { useFindManyStorageTanksQuery, useEDispatchStorageTankSyncMutation } = useStorageTank();
  let where = "";

  if (siteId) {
    where = {
      OR: [{ siteId }, { siteRefId: siteId }],
      refType: 1,
    };
  } else {
    where = {
      refType: 1,
    };
  }

  const storageTankFilter = {
    where,
    orderBy: [{ name: "asc" }, { siteName: "asc" }],
  };

  const { data, refetch } = useFindManyStorageTanksQuery(storageTankFilter);
  const [eDispatchSync, { isLoading }] = useEDispatchStorageTankSyncMutation();

  return (
    <Box display="flex" sx={{ ...sx }} alignItems="start">
      {/* justifyContent="center" alignItems="center" */}
      {data && (
        <>
          <Field
            {...others}
            id="siteId"
            labelId="siteLbl"
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
                  {`${item.name} - ${item.siteName} (${item.productName})`}
                </MenuItem>
              ))}
          </Field>
          <IconButton
            size="small"
            disabled={isReadOnly}
            sx={{
              ml: 0.2,
              // width: 30,
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
