import { useState, useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import moment from "moment";

import { useAuth, useConfig } from "../hooks";

const BonTripPrintManualEntry = (props) => {
  const { dtTrans, isDisable, ...others } = props;
  const { user } = useAuth();
  const { WBMS } = useConfig();

  const [isOpen, setIsOpen] = useState(false);

  const formRef = useRef();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const jamMasuk = moment(dtTrans.originWeighInTimestamp).format("HH:mm:ss");
  const jamKeluar = moment(dtTrans.originWeighOutTimestamp).format("HH:mm:ss");
  const tanggal = moment(dtTrans.originWeighOutTimestamp).format("DD- MM-YYYY");

  useEffect(() => {}, [isOpen]);

  return (
    <>
      <Button
        variant="contained"
        // disabled={isDisable}
        sx={{ mt: 2 }}
        {...others}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <PrintOutlinedIcon sx={{ mr: 1 }} />
        Cetak Slip
      </Button>
      <Dialog open={isOpen} fullWidth maxWidth={"md"}>
        <DialogTitle>Print Bontrip</DialogTitle>
        <DialogContent dividers>
          <form ref={formRef}>
            <Box display="flex">
              <Box>
                {/* `../assets/images/logo.png`  */}
                {/* <img alt="logodsn" width="90px" height="45px" src={require("../assets/images/logo.png")} /> */}
                <img alt="logodsn" height="45px" src={require("../assets/images/logo.png")} />

                <Typography fontSize="15px" fontWeight="bold">
                  SBU ABSD PT. DSN
                  <br />
                  PKS 4 MUARA WAHAU (KUTIM)
                  <br />
                  Country Of Origin : INDONESIA
                </Typography>
              </Box>
            </Box>
            <Box marginLeft={35}>
              <Typography fontSize="15px">NOTA PENGIRIMAN</Typography>
              <Typography fontSize="15px">{dtTrans.bonTripNo}</Typography>
            </Box>
            <Box
              mt="20px"
              display="grid"
              gap="10px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span " },
              }}
            >
              <Table striped sx={{ gridColumn: "span 2 " }}>
                <tbody>
                  <Typography fontSize="15px">
                    <tr>
                      <td height="25" width="100">
                        Tanggal
                      </td>
                      <td width="10">:</td>
                      <td className="nota-text">{tanggal}</td>
                    </tr>

                    <tr>
                      <td height="25" width="100">
                        Kebun
                      </td>
                      <td width="10">:</td>
                      <td className="nota-text">{dtTrans.kebun}</td>
                    </tr>
                    <tr>
                      <td height="25" width="100">
                        Afdeling
                      </td>
                      <td width="10">:</td>
                      <td className="nota-text"> {dtTrans.afdeling}</td>
                    </tr>
                    <tr>
                      <td height="25" width="100">
                        Field
                      </td>
                      <td width="10">:</td>
                      <td className="nota-text">{dtTrans.blok}</td>
                    </tr>

                    <tr>
                      <td height="25" width="100">
                        Jml. Tandan
                      </td>
                      <td width="10">:</td>
                      <td className="nota-text">{dtTrans.janjang}</td>
                    </tr>
                    <br />
                    <tr>
                      <td height="25" width="100">
                        No. Kend
                      </td>
                      <td width="10">:</td>
                      <td className="nota-text">{dtTrans.transportVehiclePlateNo}</td>
                    </tr>
                    <tr>
                      <td height="25" width="100">
                        Sopir
                      </td>
                      <td width="10">:</td>
                      <td className="nota-text">{dtTrans.driverName}</td>
                    </tr>
                    <tr>
                      <td height="25" width="100">
                        SPTBS
                      </td>
                      <td width="10">:</td>
                      <td className="nota-text">{dtTrans.sptbs}</td>
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
                      <td className="nota-text">{dtTrans.productName}</td>
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
                      <td className="nota-text">{dtTrans.originWeighInKg.toLocaleString()} KG</td>
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
                      <td className="nota-text">{dtTrans.originWeighOutKg.toLocaleString()} KG</td>
                    </tr>
                    <tr>
                      <td height="20" width="100">
                        Net Weight
                      </td>
                      <td width="10">:</td>
                      <td className="nota-text">
                        {Math.abs(dtTrans.originWeighOutKg - dtTrans.originWeighInKg).toLocaleString()} KG
                      </td>
                    </tr>
                    <tr>
                      <td height="20" width="100">
                        Potongan
                      </td>
                      <td width="10">:</td>
                      <td className="nota-text">
                        {Math.abs(dtTrans.mandatoryDeductionKg + dtTrans.othersKg).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td height="20" width="100">
                        Netto A G
                      </td>
                      <td width="10">:</td>
                      <td className="nota-text">
                        {Math.abs(
                          dtTrans.originWeighOutKg -
                            dtTrans.originWeighInKg -
                            dtTrans.mandatoryDeductionKg -
                            dtTrans.othersKg,
                        ).toLocaleString()}
                        KG
                      </td>
                    </tr>
                  </Typography>
                </tbody>
              </Table>

              <table>
                <tbody>
                  <Typography fontSize="12px">
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
                        PGS
                      </td>
                      <td
                        style={{
                          borderCollapse: "collapse",
                          border: "1px solid black",
                          fontWeight: 550,
                        }}
                      >
                        Mill Head
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
              trigger={() => <Button variant="contained">Print Transaction</Button>}
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

export default BonTripPrintManualEntry;
