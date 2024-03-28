import { useState, useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";
import moment from "moment";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import QRCode from "react-qr-code";
import { useAuth, useConfig } from "../hooks";

const BonTripBulkingPrint = (props) => {
  const { dtTrans, isDisable, ...others } = props;
  const { user } = useAuth();
  const { WBMS } = useConfig();

  const [isOpen, setIsOpen] = useState(false);

  const formRef = useRef();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const jamMasuk = moment(dtTrans.destinationWeighInTimestamp).format(
    "HH:mm:ss"
  );
  const jamKeluar = moment(dtTrans.destinationWeighOutTimestamp).format(
    "HH:mm:ss"
  );
  const tanggal = moment(dtTrans.destinationWeighOutTimestamp).format(
    "DD- MM-YYYY"
  );

  const qrData = {
    typeSite: 3,
    productType: dtTrans.productType,
    bonTripRef: dtTrans.bonTripNo,
    deliveryOrderNo: dtTrans.deliveryOrderNo,
    deliveryDate: dtTrans.deliveryDate,
    transporterCompanyId: dtTrans.transporterCompanyId,
    transporterCompanyName: dtTrans.transporterCompanyName,
    transporterCompanyCode: dtTrans.transporterCompanyCode,
    driverId: dtTrans.driverId,
    driverName: dtTrans.driverName,
    driverNik: dtTrans.driverNik,
    transportVehicleId: dtTrans.transportVehicleId,
    transportVehiclePlateNo: dtTrans.transportVehiclePlateNo,
    transportVehicleProductName: dtTrans.transportVehicleProductName,
    transportVehicleProductCode: dtTrans.transportVehicleProductCode,
    productId: dtTrans.productId,
    productName: dtTrans.productName,
    productCode: dtTrans.productCode,
    currentSeal1: dtTrans.loadedSeal1,
    currentSeal2: dtTrans.loadedSeal2,
    currentSeal3: dtTrans.loadedSeal3,
    currentSeal4: dtTrans.loadedSeal4,
    originWeighInOperatorName: dtTrans.originWeighInOperatorName,
    originWeighOutOperatorName: dtTrans.originWeighOutOperatorName,
    originWeighInTimestamp: dtTrans.originWeighInTimestamp,
    originWeighOutTimestamp: dtTrans.originWeighOutTimestamp,
    originWeighInKg: dtTrans.originWeighInKg,
    originWeighOutKg: dtTrans.originWeighOutKg,
  };

  const qrContent = "ARMIN" + JSON.stringify(qrData);

  return (
    <>
      <Button
        variant="contained"
        sx={{ mt: 1 }}
        {...others}
        disabled={isDisable}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Print Bontrip
      </Button>
      <Dialog open={isOpen} fullWidth maxWidth={"md"}>
        <DialogTitle>Print Bontrip</DialogTitle>
        <DialogContent dividers>
          <form ref={formRef}>
            <Box display="flex">
              <img
                alt="LOGO"
                width="50px"
                height="85px"
                src={require("../assets/images/1.jpg")}
              />
              <Box ml={2} mt={2}>
                <Typography fontSize="19px" fontWeight="bold">
                  PT. DHARMA SATYA NUSANTARA
                </Typography>

                <Typography fontSize="19px">DESPATCH MIAU</Typography>
              </Box>
              <Box ml="auto" mt={2}>
                <QRCode
                  size={100}
                  style={{ height: "100%", maxWidth: "100%", width: "100%" }}
                  value={qrContent}
                  viewBox={`0 0 256 256`}
                />
              </Box>
            </Box>

            <Box
              mt="30px"
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span " },
              }}
            >
              <Table striped sx={{ gridColumn: "span 2 " }}>
                <tbody>
                  <Typography fontSize="15px">
                    <tr>
                      <td height="30" width="100">
                        Tanggal
                      </td>
                      <td width="10">:</td>
                      <td className="nota-text">{tanggal}</td>
                    </tr>
                    <tr>
                      <td height="30" width="100">
                        No. Slip
                      </td>
                      <td width="10">:</td>
                      <td className="nota-text">{dtTrans.bonTripNo}</td>
                    </tr>
                    <tr>
                      <td height="30" width="100">
                        Suplier
                      </td>
                      <td width="10">:</td>
                      <td className="nota-text">
                        {dtTrans.transporterCompanyName}
                      </td>
                    </tr>
                    <tr>
                      <td height="30" width="100">
                        Dikirim ke
                      </td>
                      <td width="10">:</td>
                      <td className="nota-text">
                        {dtTrans.destinationSiteName}
                      </td>
                    </tr>
                    <tr>
                      <td height="30" width="100">
                        No. Do
                      </td>
                      <td width="10">:</td>
                      <td className="nota-text">{dtTrans.deliveryOrderNo}</td>
                    </tr>
                    <tr>
                      <td height="30" width="100">
                        No. Kend
                      </td>
                      <td width="10">:</td>
                      <td className="nota-text">
                        {dtTrans.transportVehiclePlateNo}
                      </td>
                    </tr>
                    <tr>
                      <td height="30" width="100">
                        Sopir
                      </td>
                      <td Wwidth="10">:</td>
                      <td className="nota-text">{dtTrans.driverName}</td>
                    </tr>
                  </Typography>
                </tbody>
              </Table>

              <Table striped sx={{ gridColumn: "span 2 " }}>
                <tbody>
                  <Typography fontSize="15px">
                    <tr>
                      <td height="30" width="100">
                        Jenis Barang
                      </td>
                      <td width="10">:</td>
                      <td className="nota-text">
                        {dtTrans.transportVehicleProductName}
                      </td>
                    </tr>
                    <tr>
                      <td height="30" width="100">
                        Jam Masuk
                      </td>
                      <td width="10">:</td>
                      <td className="nota-text">{jamMasuk}</td>
                    </tr>
                    <tr>
                      <td height="30" width="100">
                        1st Weight
                      </td>
                      <td width="10">:</td>
                      <td className="nota-text">
                        {dtTrans.destinationWeighInKg.toLocaleString()} KG
                      </td>
                    </tr>
                    <tr>
                      <td height="30" width="100">
                        Jam Keluar
                      </td>
                      <td width="10">:</td>
                      <td className="nota-text">{jamKeluar}</td>
                    </tr>
                    <tr>
                      <td height="30" width="100">
                        2st Weight
                      </td>
                      <td width="10">:</td>
                      <td className="nota-text">
                        {dtTrans.destinationWeighOutKg.toLocaleString()} KG
                      </td>
                    </tr>
                    <tr>
                      <td height="30" width="100">
                        Net Weight
                      </td>
                      <td width="10">:</td>
                      <td className="nota-text">
                        {Math.abs(
                          dtTrans.destinationWeighOutKg -
                            dtTrans.destinationWeighInKg
                        ).toLocaleString()}
                        KG
                      </td>
                    </tr>
                    <tr>
                      <td height="30" width="100">
                        Potongan
                      </td>
                      <td width="10">:</td>
                      <td className="nota-text">
                        {Math.abs(
                          dtTrans.mandatoryDeductionKg + dtTrans.othersKg
                        ).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td height="30" width="100">
                        Netto A G
                      </td>
                      <td width="10">:</td>
                      <td className="nota-text">
                        {Math.abs(
                          dtTrans.destinationWeighOutKg -
                            dtTrans.destinationWeighInKg -
                            dtTrans.mandatoryDeductionKg -
                            dtTrans.othersKg
                        ).toLocaleString()}
                        KG
                      </td>
                    </tr>
                  </Typography>
                </tbody>
              </Table>

              <table>
                <tbody>
                  <Typography fontSize="13px">
                    <tr>
                      <td height="20" width="100">
                        Distribusi :
                      </td>
                      <td width="10"> </td>
                    </tr>

                    <tr>
                      <td height="20" width="100">
                        Putih Asli
                      </td>
                      <td width="10">:</td>
                      <td> PKS</td>
                    </tr>
                    <tr>
                      <td height="20" width="100">
                        Merah
                      </td>
                      <td width="10">:</td>
                      <td>Kebun</td>
                    </tr>
                    <tr>
                      <td height="20" width="100">
                        Hijau
                      </td>
                      <td width="10">: </td>
                      <td> Accounting</td>
                    </tr>
                    <tr>
                      <td height="20" width="100">
                        Kuning
                      </td>
                      <td width="10">:</td>
                      <td>Transportir</td>
                    </tr>
                  </Typography>
                </tbody>
              </table>
              <Box ml={8}>
                <Typography fontSize="13px">
                  <table
                    style={{
                      borderCollapse: "collapse",
                      border: "1px solid black",
                      textAlign: "center",
                    }}
                  >
                    <tr>
                      <td
                        style={{
                          borderCollapse: "collapse",
                          border: "1px solid black",
                          paddingLeft: "45px",
                          paddingRight: "45px",
                          fontWeight: 550,
                        }}
                      >
                        Dibuat,
                      </td>
                      <td
                        style={{
                          borderCollapse: "collapse",
                          border: "1px solid black",
                          paddingLeft: "45px",
                          paddingRight: "45px",
                          fontWeight: 550,
                        }}
                      >
                        Diketahui,
                      </td>
                      <td
                        style={{
                          borderCollapse: "collapse",
                          border: "1px solid black",
                          paddingLeft: "45px",
                          paddingRight: "45px",
                          fontWeight: 550,
                        }}
                      >
                        Disetujui,
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          borderCollapse: "collapse",
                          border: "1px solid black",
                          color: "grey",
                          padding: "35px",
                        }}
                      >
                        {user.name}
                      </td>
                      <td
                        style={{
                          borderCollapse: "collapse",
                          border: "1px solid black",
                          color: "grey",
                        }}
                      >
                        {WBMS.BT_APPROVAL_1}
                      </td>
                      <td
                        style={{
                          borderCollapse: "collapse",
                          border: "1px solid black",
                          color: "grey",
                        }}
                      >
                        {WBMS.BT_APPROVAL_2}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          borderCollapse: "collapse",
                          border: "1px solid black",
                          fontWeight: 550,
                        }}
                      >
                        Operator Timbang
                      </td>
                      <td
                        style={{
                          borderCollapse: "collapse",
                          border: "1px solid black",
                          fontWeight: 550,
                        }}
                      >
                        KTU
                      </td>
                      <td
                        style={{
                          borderCollapse: "collapse",
                          border: "1px solid black",
                          fontWeight: 550,
                        }}
                      >
                        Despatch Head
                      </td>
                    </tr>
                  </table>
                </Typography>
              </Box>
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Box>
            <ReactToPrint
              trigger={() => (
                <Button variant="contained">Print Transaction</Button>
              )}
              content={() => formRef.current}
              documentTitle="Print"
              pageStyle="print"
            />
          </Box>
          <Button
            variant="contained"
            sx={{ ml: 1 }}
            onClick={() => {
              setIsOpen(false);
              // onClose("", false);
            }}
          >
            TUTUP
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BonTripBulkingPrint;
