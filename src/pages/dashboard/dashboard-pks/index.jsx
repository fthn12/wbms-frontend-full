import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, Paper } from "@mui/material";
import BarChartIcon from "@mui/icons-material/EqualizerOutlined";
import { useConfig, useTransaction } from "../../../hooks";
import moment from "moment";

import BarCharts from "../../../components/BarChart";
import TrukPending from "../../../components/TrukPending";

import { useApp } from "../../../hooks";

const DashboardPKS = () => {
  const { useFindManyTransactionQuery } = useTransaction();
  const { WBMS } = useConfig();
  const { setSidebar } = useApp();
  const [CPOProduct, setCPOProduct] = useState(0);
  const [PKOProduct, setPKOProduct] = useState(0);
  const [TBSProduct, setTBSProduct] = useState(0);
  const [OtherProduct, setOtherProduct] = useState(0);

  const startOf = moment().startOf("day");
  const endOf = moment().endOf("day");

  const data = {
    where: {
      typeSite: +WBMS.SITE_TYPE,
      OR: [
        {
          progressStatus: { in: [21, 40, 41, 42] },
          isManualEntry : 0,
          isManualTonase : 0,
        },
      ],
      AND: [
        {
          dtTransaction: {
            gte: startOf,
            lte: endOf,
          },
        },
      ],
  
    },
  };

  // useEffect(() => {
  //   setSidebar({ selected: "Dashboard" });
  // }, []);

  const { data: results, isLoading, isError, refetch } = useFindManyTransactionQuery(data);

  useEffect(() => {
    const lowerCaseProductName = (productName) => productName.toLowerCase();
    if (!isLoading && !isError && results?.records?.length > 0) {
      const transactions = results.records;

      const filteredCPO = transactions.filter((transaction) => transaction.productName === "CPO");
      const filteredPKO = transactions.filter((transaction) => transaction.productName === "PKO");
      const filteredTBS = transactions.filter((transaction) => lowerCaseProductName(transaction.productName) === "tbs");
      const filteredOther = transactions.filter((transaction) => {
        const lowerCaseProduct = lowerCaseProductName(transaction.productName);
        return lowerCaseProduct !== "cpo" && lowerCaseProduct !== "pko" && lowerCaseProduct !== "tbs";
      });

      setCPOProduct(filteredCPO.length);
      setPKOProduct(filteredPKO.length);
      setTBSProduct(filteredTBS.length);
      setOtherProduct(filteredOther.length);
    }
  }, [results, isLoading, isError]);

  return (
    <>
     <Grid container spacing={2}>
    <Grid item xs={3}>
      <Box
        display="flex"
        height="150px"
        justifyContent="space-between"
        alignItems="center"
        borderRadius="10px"
        sx={{
          background: "linear-gradient(to right, #0B63F6, #003CC5)",
          boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box mx={3}>
          <Typography variant="h5" pb={1} fontWeight="bold" color="white">
            {CPOProduct}
          </Typography>
          <Typography variant="h7" color="white">
            CPO TRANSACTION
          </Typography>
        </Box>
        <BarChartIcon sx={{ fontSize: 90, color: "#283593", mr: 2 }} />
      </Box>
    </Grid>

    <Grid item xs={3}>
      <Box
        display="flex"
        height="150px"
        justifyContent="space-between"
        alignItems="center"
        borderRadius="10px"
        sx={{
          background: "linear-gradient(to right,#33cc33, #009933)",
          boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box mx={3}>
          <Typography variant="h5" pb={1} fontWeight="bold" color="white">
            {PKOProduct}
          </Typography>
          <Typography variant="h7" color="white">
            PKO TRANSACTION
          </Typography>
        </Box>
        <BarChartIcon sx={{ fontSize: 90, color: "#2e7d32", mr: 2 }} />
      </Box>
    </Grid>

    <Grid item xs={3}>
      <Box
        display="flex"
        height="150px"
        justifyContent="space-between"
        alignItems="center"
        borderRadius="10px"
        sx={{
          background: "linear-gradient(to right,#ffc107, #ffc107 )",
          boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box mx={3}>
          <Typography variant="h5" pb={1} fontWeight="bold" color="white">
            {TBSProduct}
          </Typography>
          <Typography variant="h7" color="white">
            TBS TRANSACTION
          </Typography>
        </Box>
        <BarChartIcon sx={{ fontSize: 90, color: "#ff8f00", mr: 2 }} />
      </Box>
    </Grid>

    <Grid item xs={3}>
      <Box
        display="flex"
        height="150px"
        justifyContent="space-between"
        alignItems="center"
        borderRadius="10px"
        sx={{
          background: "linear-gradient(to right,#f44336,#d32f2f)",
          boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box mx={3}>
          <Typography variant="h5" pb={1} fontWeight="bold" color="white">
            {OtherProduct}
          </Typography>
          <Typography variant="h7" color="white">
            OTHERS TRANSACTION
          </Typography>
        </Box>
        <BarChartIcon sx={{ fontSize: 90, color: "#b71c1c", mr: 2 }} />
      </Box>
    </Grid>

    <Grid item xs={8} pt={3}>
      <BarCharts />
    </Grid>

    <Grid item xs={4} pt={3}>
      <TrukPending />
    </Grid></Grid>
  </>
  );
};

export default DashboardPKS;
