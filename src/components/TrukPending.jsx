import { useMemo, useState, useEffect } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useConfig, useTransaction, useApp } from "../hooks";
import moment from "moment";

const TransactionPending = () => {
  const { WBMS } = useConfig();
  const { useFindManyTransactionQuery } = useTransaction();

  const data = {
    where: {
      typeSite: +WBMS.SITE_TYPE,
      OR: [
        {
          progressStatus: { in: [1, 6, 11, 35, 36, 37] },
        },
      ],
    },
    orderBy: [{ progressStatus: "asc" }, { bonTripNo: "desc" }],
  };

  const { data: results } = useFindManyTransactionQuery(data);

  const TotalPending = results?.records?.length;

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={5}
        sx={{
          pb: 2.5,
          px: 2,
          borderRadius: "10px",
          "&::-webkit-scrollbar": {
            width: "3px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#0B63F6",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#283593",
          },
        }}
      >
        <div
          style={{
            width: "auto",
            height: "auto",
          }}
        >
          <div className="grafik">
            <Box display="flex" mt={4}>
              <LocalShippingIcon sx={{ mr: 2, fontSize: "23px" }} />
              <Typography variant="h5" mb={1}>
                Truk Pending : {TotalPending}
              </Typography>
            </Box>
            <div className="barChart">
              <div className="chart">
                <hr />
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">NOPOL</TableCell>
                      <TableCell align="center">NAMA SUPIR</TableCell>
                      <TableCell align="center">PRODUK</TableCell>
                      <TableCell align="center">Waktu Transaksi</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {results && results.records && results.records.length > 0 ? (
                      results.records.map((row) => (
                        <TableRow key={row.transportVehiclePlateNo}>
                          <TableCell component="th" scope="row" align="left">
                            {row.transportVehiclePlateNo}
                          </TableCell>
                          <TableCell align="center">{row.driverName}</TableCell>
                          <TableCell align="center">{row.productName}</TableCell>
                          <TableCell align="center">{moment(row.dtModified).format("DD/MM/YYYY, HH:mm:ss")}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          Data Kosong
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </TableContainer>
    </>
  );
};

export default TransactionPending;
