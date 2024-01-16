import { useState } from "react";
import QRCode from "react-qr-code";
import { Box, Button, CircularProgress, IconButton, Typography } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import QrCode2OutlinedIcon from "@mui/icons-material/QrCode2Outlined";

import { EDispatchAPI } from "../apis";
import { useConfig } from "../hooks";

const QRCodeViewer = (props) => {
  const { progressStatus, deliveryOrderId, type, ...others } = props;

  const eDispatchAPI = EDispatchAPI();

  const { WBMS } = useConfig();

  const [qrContent, setQrContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleShowQrcode = () => {
    setIsOpen(true);
    setIsLoading(true);

    const data = {
      orderId: deliveryOrderId,
      functionCode: 0,
    };

    if (WBMS.SITE_TYPE === 1) {
      if (progressStatus === 1) {
        // Function Code 2 = Initiate Delivery
        data.functionCode = 2;
      } else if (progressStatus === 21) {
        // Function Code 6 = Dispatch Delivery
        data.functionCode = 6;
      } else if (progressStatus === 26) {
        // Function Code 15 = Closed Delivery as Canceled
        data.functionCode = 15;
      } else if (progressStatus === 31) {
        // Function Code 17 = Closed Delivery as Rejected
        data.functionCode = 17;
      }
    } else if (WBMS.SITE_TYPE === 2) {
      if (progressStatus === 1) {
        // Function Code 2 = Initiate Delivery
        data.functionCode = 2;
      } else if (progressStatus === 21) {
        // Function Code 6 = Dispatch Delivery
        data.functionCode = 6;
      } else if (progressStatus === 26) {
        // Function Code 15 = Closed Delivery as Canceled
        data.functionCode = 15;
      }
    } else if (WBMS.SITE_TYPE === 3) {
      if (progressStatus === 2) {
        // Function Code 10 = Initiate Unloading
        data.functionCode = 10;
      } else if (progressStatus === 21) {
        // Function Code 18 = Close Delivery As Accepted
        data.functionCode = 18;
      } else if (progressStatus === 31) {
        // Function Code 11 = Reject Delivery
        data.functionCode = 11;
      }
    }

    eDispatchAPI
      .EncodeQrcode(data)
      .then((response) => {
        setIsLoading(false);
        setQrContent(response?.data?.qrcode);
      })
      .catch((error) => {
        toast.error(`${error.message}..!!`);
        setIsLoading(false);
        setIsOpen(false);

        return;
      });
  };

  return (
    <>
      {type === "form" && (
        <Button
          variant="contained"
          // fullWidth
          // size="small"
          onClick={() => handleShowQrcode()}
          disabled={
            !(
              progressStatus === 1 ||
              progressStatus === 2 ||
              progressStatus === 21 ||
              progressStatus === 26 ||
              progressStatus === 31
            )
          }
          {...others}
        >
          Tampilkan QR
        </Button>
      )}

      {type === "grid" && (
        <IconButton
          size="small"
          onClick={() => handleShowQrcode()}
          disabled={
            !(
              progressStatus === 1 ||
              progressStatus === 2 ||
              progressStatus === 21 ||
              progressStatus === 26 ||
              progressStatus === 31
            )
          }
        >
          <QrCode2OutlinedIcon sx={{ fontSize: 18 }} />
        </IconButton>
      )}

      <Dialog open={isOpen} fullWidth>
        <DialogTitle>
          <Typography variant="h3" fontWeight="900">
            Rekam Kode ini dari HP
          </Typography>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setIsOpen(false)}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <div
            style={{
              height: "auto",
              margin: "0 auto",
              maxWidth: 381,
              maxHeight: 381,
              width: "100%",
            }}
          >
            {!isLoading && (
              <QRCode
                size={512}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={qrContent}
                viewBox={`0 0 256 256`}
              />
            )}
            {isLoading && (
              <Box sx={{ minHeight: 385, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <CircularProgress />
              </Box>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          {/* <Typography variant="h5" color={"goldenrod"} fontWeight="bold" sx={{ ml: 2 }}>
            Rekam Kode ini dari HP
          </Typography> */}
          <Box flex={1} />
          <Button variant="contained" onClick={() => handleShowQrcode()} sx={{ mr: 1 }}>
            Refresh
          </Button>
          <Button variant="contained" onClick={() => setIsOpen(false)}>
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default QRCodeViewer;
