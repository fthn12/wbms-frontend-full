import { useState, useEffect } from "react";
import { Button, Typography, Input } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CancelConfirmation = (props) => {
  const { onClose, isDisabled, title, caption, content, ...others } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    setReason("");
  }, [isOpen]);

  return (
    <>
      <Button
        variant="contained"
        sx={{ backgroundColor: "goldenrod" }}
        disabled={isDisabled}
        {...others}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {caption}
      </Button>
      <Dialog open={isOpen} fullWidth maxWidth="md">
        <DialogTitle component="div">
          <Typography variant="h4" component="h4" fontWeight="800">
            {title}{" "}
          </Typography>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setIsOpen(false)}
          sx={{
            position: "absolute",
            right: 12,
            top: 10,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <DialogContentText sx={{ mb: 2 }}>{content}</DialogContentText>
          <Input
            type="text"
            autoFocus
            size="small"
            fullWidth
            // sx={{ mb: 2, backgroundColor: "whitesmoke" }}
            label={`Alasan ${title}`}
            name="reason"
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            sx={{ backgroundColor: "darkred" }}
            onClick={() => {
              onClose(reason);
              setIsOpen(false);
            }}
          >
            {`Yakin ${caption}`}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setIsOpen(false);
              // onClose("");
            }}
          >
            Kembali
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CancelConfirmation;
