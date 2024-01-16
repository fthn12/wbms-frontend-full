import { useState } from "react";
import { TextField } from "@mui/material";

import { useTransaction, useConfig } from "../../hooks";
import { useEffect } from "react";

const ProgressStatusHeader = () => {
  const { wbTransaction } = useTransaction();
  const { WBMS, PROGRESS_STATUS } = useConfig();

  const [progressStatusLabel, setProgressStatusLabel] = useState("-");

  useEffect(() => {
    if (!wbTransaction) {
      setProgressStatusLabel("-");
    } else {
      setProgressStatusLabel(PROGRESS_STATUS[wbTransaction?.progressStatus]);
    }
  }, [wbTransaction]);

  return (
    <TextField
      label="STATUS PROSES"
      type="text"
      variant="outlined"
      size="medium"
      fullWidth
      // disabled
      // multiline
      value={progressStatusLabel}
      sx={{
        backgroundColor:
          wbTransaction?.progressStatus === 5 || wbTransaction?.progressStatus === 10 ? "yellow" : "whitesmoke",

        root: {
          color: "yellow",
        },
        minWidth: 500,
      }}
      inputProps={{
        readOnly: true,
        style: {
          textAlign: "center",
          fontWeight: "900",
          fontSize: "x-large",
          color: wbTransaction?.progressStatus === 5 || wbTransaction?.progressStatus === 10 ? "darkred" : "inherit",
        },
      }}
    />
  );
};

export default ProgressStatusHeader;
