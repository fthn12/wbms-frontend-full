import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

import { TransactionAPI } from "../apis";

import { useConfig, useTransaction, useWeighbridge } from "../hooks";

const QRCodeScanner = (props) => {
  const navigate = useNavigate();

  const transactionAPI = TransactionAPI();

  const inputElement = useRef(null);

  const { WBMS } = useConfig();
  const { wb } = useWeighbridge();
  const { wbTransaction, setWbTransaction, clearOpenedTransaction } =
    useTransaction();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [codeContent, setCodeContent] = useState("");

  const qrcodeAutoFocus = () => {
    document.getElementById("qrcode")?.focus();
  };

  const onChangeQrcode = (event) => {
    setCodeContent(event.target.value);
  };

  const onKeyDown = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();

      if (codeContent?.trim().length > 10) {
        const data = { content: codeContent.trim() };

        console.log("qrContent:", codeContent.trim());

        setIsLoading(true);

        if (data.content.substring(0, 5) === "ARMIN") {
          // console.log("ARMIN QR Code");
          // console.log(JSON.parse(data.content.substring(5)));
          const qrData = JSON.parse(data.content.substring(5));

          if (qrData?.typeSite && qrData.typeSite === 3) {
            setWbTransaction(qrData);

            setIsLoading(false);

            return navigate("/wb/transactions/bulking/manual-entry-in-qr");
          } else if (qrData?.typeSite && qrData.typeSite === 1) {
            console.log("Ini data dari Labanan");
          }
          
        } else {
          transactionAPI
            .eDispatchFindOrCreateByQrcode(data)
            .then((response) => {
              console.log("Decode QR response:", response);

              if (!response?.status) {
                throw new Error(response?.message);
              }

              console.log(
                "vStatus:",
                response.data.draftTransaction.vehicleStatus
              );
              console.log(
                "dStatus:",
                response.data.draftTransaction.deliveryStatus
              );

              setWbTransaction(response.data.draftTransaction);
              setIsLoading(false);

              return navigate(response.data.urlPath);
            })
            .catch((error) => {
              setIsLoading(false);
              toast.error(`${error?.message}..!!`);
            });
        }
      } else {
        toast.error("Tidak dapat membaca QR Code atau QR Code tidak valid..!!");
      }

      setCodeContent("");
    }
  };

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
    }

    qrcodeAutoFocus();
  }, [isLoading]);

  useEffect(() => {
    setCodeContent("");
  }, [isOpen]);

  useEffect(() => {
    // clearWbTransaction();
    clearOpenedTransaction();

    return () => {};
  }, []);

  return (
    <Box>
      <Button
        variant="contained"
        sx={{ height: "67.5px", width: "100px" }}
        fullWidth
        disabled={
          WBMS.NODE_ENV === "production"
            ? !wb?.canStartScalling || !!wbTransaction
            : false
        }
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Scan QR
      </Button>
      <Dialog
        open={isOpen}
        fullWidth
        maxWidth="md"
        // fullScreen
        // keepMounted
        // onClose={() => {
        //   setIsOpen(false);
        //   onCloseHandler("", false);
        // }}
      >
        <DialogTitle component="div">
          <Typography variant="h3" component="h3" fontWeight="900">
            Arahkan Kode Identitas ke Scanner
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
          {isLoading && (
            <CircularProgress
              size={50}
              sx={{
                color: "goldenrod",
                position: "absolute",
                top: "40%",
                left: "47%",
                zIndex: 999,
              }}
            />
          )}
          <input
            type="text"
            autoFocus
            variant="outlined"
            // rows={6}
            id="qrcode"
            name="qrcode"
            disabled={isLoading}
            ref={inputElement}
            label="Arahkan Kode Identitas ke Scanner"
            value={codeContent}
            onChange={onChangeQrcode}
            onKeyDown={onKeyDown}
            onBlur={qrcodeAutoFocus}
            onFocus={(e) => e.currentTarget.select()}
            style={{
              display: "flex",
              flexDirection: "column",
              margin: "auto",
              textAlign: "center",
              justifyContent: "center",
              fontSize: "2vw",
              fontWeight: "750",
              height: "5vh",
              width: "100%",
              // fontVariantCaps: "small-caps",
              border: "none",
              background: "whitesmoke",
              outline: 0,
            }}
            // inputProps={{
            //   style: {
            //     display: "flex",
            //     flexDirection: "column",
            //     m: "auto",
            //     textAlign: "center",
            //     fontSize: "large",
            //     height: "50vh",
            //     justifyContent: "center",
            //   },
            // }}
          />
        </DialogContent>
        <DialogActions>
          {/* <Box flex={1} /> */}
          <Button
            fullWidth
            variant="contained"
            onClick={() => setIsOpen(false)}
          >
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QRCodeScanner;
