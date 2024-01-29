import { useMemo, useState, useEffect } from "react";
import { Grid, Box, IconButton, Typography, Paper } from "@mui/material";

import { useConfig, useTransaction, useApp } from "../hooks";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const TransactionPending = () => {
  const { WBMS, PROGRESS_STATUS } = useConfig();
  const { setOpenedTransaction, useFindManyTransactionQuery } = useTransaction();

  const [CPOlength, setCPOlength] = useState(0);
  const [PKOLength, setPKOLength] = useState(0);
  const [TBSLength, setTBSLength] = useState(0);
  const [OtherLength, setOtherLength] = useState(0);

  const data = {
    where: {
      typeSite: +WBMS.SITE_TYPE,
      OR: [
        {
          progressStatus: { in: [1, 6, 11, 35, 36, 37] },
        },
      ],
      // AND: [
      //   {
      //     dtTransaction: {
      //       gte: startOf,
      //       lte: endOf,
      //     },
      //   },
      // ],
    },
  };

  const { data: results, isLoading, isError, refetch } = useFindManyTransactionQuery(data);

  useEffect(() => {
    const lowerCaseProductName = (productName) => productName.toLowerCase();
    if (!isLoading && !isError && results?.records?.length > 0) {
      const transactions = results.records;
      console.log("datatransaksi:", transactions);

      const filteredCPO = transactions.filter((transaction) => transaction.productName === "CPO");
      const filteredPKO = transactions.filter((transaction) => transaction.productName === "PKO");
      const filteredTBS = transactions.filter((transaction) => lowerCaseProductName(transaction.productName) === "tbs");
      const filteredOther = transactions.filter((transaction) => {
        const lowerCaseProduct = lowerCaseProductName(transaction.productName);
        return lowerCaseProduct !== "cpo" && lowerCaseProduct !== "pko" && lowerCaseProduct !== "tbs";
      });

      setCPOlength(filteredCPO.length);
      setPKOLength(filteredPKO.length);
      setTBSLength(filteredTBS.length);
      setOtherLength(filteredOther.length);
    }
  }, [results, isLoading, isError]);

  return (
    <>
      <Paper elevation={5} sx={{ p: 3, mx: 1, borderRadius: "10px" }}>
        <div style={{ width: "auto", height: "48vh" }}>
          <Box display="flex">
            <LocalShippingIcon sx={{ mr: 2, mt: 0.1, fontSize: "25px" }} />
            <Typography variant="h4" fontWeight="bold" mb={2}>
              Truk Pending
            </Typography>
          </Box>
          <hr />

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={3}>
              <span style={{ color: "#283593", fontWeight: "bold" }}> CPO : {CPOlength}</span>
            </Grid>

            <Grid item xs={3}>
              <span style={{ color: "#2e7d32", fontWeight: "bold" }}> PKO : {PKOLength}</span>
            </Grid>
            <Grid item xs={3}>
              <span style={{ color: "#ff8f00", fontWeight: "bold" }}> TBS : {TBSLength}</span>
            </Grid>
            <Grid item xs={3}>
              <span style={{ color: "#b71c1c", fontWeight: "bold" }}>OTHERS : {OtherLength}</span>
            </Grid>

            <Grid item xs={3}>
              <Box
                sx={{
                  overflow: "auto",
                  maxHeight: "40vh",
                  "&::-webkit-scrollbar": {
                    width: "4px",
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
                {results &&
                  results?.records
                    ?.filter((item) => item.productName.toLowerCase() === "cpo")
                    .map((item, index) => (
                      <Grid item xs={3} key={index} style={{ marginBottom: "10px", fontWeight: "bold" }}>
                        {item.transportVehiclePlateNo}
                      </Grid>
                    ))}
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box
                sx={{
                  overflow: "auto",
                  maxHeight: "40vh",
                  "&::-webkit-scrollbar": {
                    width: "4px",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#f1f1f1",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#33cc33",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#2e7d32",
                  },
                }}
              >
                {results &&
                  results?.records
                    ?.filter((item) => item.productName.toLowerCase() === "pko")
                    .map((item, index) => (
                      <Grid item xs={3} key={index} style={{ marginBottom: "10px", fontWeight: "bold" }}>
                        {item.transportVehiclePlateNo}
                      </Grid>
                    ))}
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box
                sx={{
                  overflow: "auto",
                  maxHeight: "40vh",
                  "&::-webkit-scrollbar": {
                    width: "4px",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#f1f1f1",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#ffc107",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#ff8f00",
                  },
                }}
              >
                {results &&
                  results?.records
                    ?.filter((item) => item.productName.toLowerCase() === "tbs")
                    .map((item, index) => (
                      <Grid item xs={3} key={index} style={{ marginBottom: "10px", fontWeight: "bold" }}>
                        {item.transportVehiclePlateNo}
                      </Grid>
                    ))}
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box
                sx={{
                  overflow: "auto",
                  maxHeight: "40vh",
                  "&::-webkit-scrollbar": {
                    width: "4px",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#f1f1f1",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#f44336",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#b71c1c",
                  },
                }}
              >
                {results &&
                  results?.records
                    ?.filter(
                      (item) =>
                        item.productName.toLowerCase() !== "cpo" &&
                        item.productName.toLowerCase() !== "pko" &&
                        item.productName.toLowerCase() !== "tbs",
                    )
                    .map((item, index) => (
                      <Grid item xs={3} key={index} style={{ marginBottom: "10px", fontWeight: "bold" }}>
                        {item.transportVehiclePlateNo}
                      </Grid>
                    ))}
              </Box>
            </Grid>
          </Grid>
        </div>
      </Paper>
    </>
  );
};

export default TransactionPending;
