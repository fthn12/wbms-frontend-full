import { Button, InputAdornment, TextField } from "@mui/material";

import { useConfig, useWeighbridge } from "../hooks";

const GetWeightWB = (props) => {
  const { isDisabled, handleSubmit } = props;

  const { ENV } = useConfig();
  const { wb } = useWeighbridge();

  let ton = 10000;

  return (
    <TextField
      label="WEIGHBRIDGE"
      type="text"
      variant="outlined"
      size="medium"
      fullWidth
      // disabled
      // multiline
      value={wb?.weight >= 0 ? wb.weight.toFixed(2) : "-"}
      sx={{
        backgroundColor: "whitesmoke",
        maxWidth: 200,
      }}
      InputProps={{
        endAdornment: <InputAdornment position="end">kg</InputAdornment>,
      }}
      inputProps={{
        readOnly: true,
        style: {
          textAlign: "center",
          fontWeight: "900",
          fontSize: "x-large",
        },
      }}
    />
  );
};

export default GetWeightWB;
