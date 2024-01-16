import { useState } from "react";
import { TextField } from "@mui/material";

import { useConfig } from "../../hooks";
import { useEffect } from "react";

const ProgressStatus = (props) => {
  const { progressStatus, ...others } = props;

  const { PROGRESS_STATUS } = useConfig();

  const [progressStatusLabel, setProgressStatusLabel] = useState("-");

  useEffect(() => {
    try {
      setProgressStatusLabel(PROGRESS_STATUS[progressStatus]);
    } catch (error) {
      setProgressStatusLabel("-");
    }
  }, [PROGRESS_STATUS, progressStatus]);

  return (
    <TextField
      name="progressStatus"
      label="STATUS PROSES"
      type="text"
      variant="outlined"
      size="small"
      fullWidth
      // disabled
      // multiline
      value={progressStatusLabel}
      sx={{
        backgroundColor: progressStatus === 5 || progressStatus === 25 ? "gold" : "whitesmoke",
        // minWidth: 500,
      }}
      inputProps={{
        readOnly: true,
        style: {
          textAlign: "center",
          fontWeight: "900",
          // fontSize: "x-large",
        },
      }}
      {...others}
    />
  );
};

export default ProgressStatus;
