import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GiFuelTank } from "react-icons/gi";
import TonaseStorageTank from "../../../components/TrukPending";
import moment from "moment";

import { useConfig, useTransaction, useApp } from "../../../hooks";

const DashboardT30 = () => {
  const navigate = useNavigate();

  const { useFindManyTransactionQuery, setOpenedTransaction, clearWbTransaction, clearOpenedTransaction } =
    useTransaction();
  const { WBMS } = useConfig();
  const { setSidebar, setUrlPrev } = useApp();

  const [T30PKS2, setT30PKS2] = useState(0);
  const [T30PKS3, setT30PKS3] = useState(0);
  const [T30PKS4, setT30PKS4] = useState(0);
  const [T30PKS6, setT30PKS6] = useState(0);
  const [T30PKS11, setT30PKS11] = useState(0);
  const [T30PKO, setT30PKO] = useState(0);

  const startOf = moment().startOf("day");
  const endOf = moment().endOf("day");

  const data = {
    where: {
      typeSite: +WBMS.SITE_TYPE,
      OR: [
        {
          progressStatus: { in: [21, 42] },
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
    if (!isLoading && !isError && results?.records?.length > 0) {
      const transactions = results.records;
      console.log("datatransaksi:", transactions);

      const T30PKS2 = transactions.filter((transaction) => transaction.originSourceStorageTankName === "T30 PKS2");
      const T30PKS3 = transactions.filter((transaction) => transaction.originSourceStorageTankName === "T30 PKS3");
      const T30PKS4 = transactions.filter((transaction) => transaction.originSourceStorageTankName === "T30 PKS4");
      const T30PKS6 = transactions.filter((transaction) => transaction.originSourceStorageTankName === "T30 PKS6");
      const T30PKS11 = transactions.filter((transaction) => transaction.originSourceStorageTankName === "T30 PKS11");
      const T30PKO = transactions.filter((transaction) => transaction.originSourceStorageTankName === "T30 PKO");

      setT30PKS2(T30PKS2.length);
      setT30PKS3(T30PKS3.length);
      setT30PKS4(T30PKS4.length);
      setT30PKS6(T30PKS6.length);
      setT30PKS11(T30PKS11.length);
      setT30PKO(T30PKO.length);
    }
  }, [results, isLoading, isError]);

  return (
    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px">
      <Box
        gridColumn="span 4"
        display="flex"
        height="150px"
        justifyContent="space-between"
        alignItems="center"
        borderRadius="10px"
        sx={{
          background: "linear-gradient(to right,#ffca28, #ffa000 )",
          boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box mx={3}>
          <Typography variant="h4" color="black" fontWeight="bold">
            TANGKI CPO PKS 2
          </Typography>
          <Typography variant="h6" mt={4} color="black">
            Truck : {T30PKS2}
          </Typography>
          <Typography variant="h6" mt={1} color="black" display="flex">
            Tonase :
          </Typography>
        </Box>
        <Box sx={{ marginRight: "20px" }}>
          <GiFuelTank size="100px" color="#ff6f00" />
        </Box>
      </Box>
      <Box
        gridColumn="span 4"
        display="flex"
        height="150px"
        justifyContent="space-between"
        alignItems="center"
        borderRadius="10px"
        sx={{
          background: "linear-gradient(to right,#ffca28, #ffa000 )",
          boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box mx={3}>
          <Typography variant="h4" color="black" fontWeight="bold">
            TANGKI CPO PKS 3
          </Typography>
          <Typography variant="h6" mt={4} color="black">
            Truck : {T30PKS3}
          </Typography>
          <Typography variant="h6" mt={1} color="black">
            Tonase :
          </Typography>
        </Box>
        <Box sx={{ marginRight: "20px" }}>
          <GiFuelTank size="100px" color="#ff6f00" />
        </Box>
      </Box>
      <Box
        gridColumn="span 4"
        display="flex"
        height="150px"
        justifyContent="space-between"
        alignItems="center"
        borderRadius="10px"
        sx={{
          background: "linear-gradient(to right,#ffca28, #ffa000 )",
          boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box mx={3}>
          <Typography variant="h4" color="black" fontWeight="bold">
            TANGKI CPO PKS 4
          </Typography>
          <Typography variant="h6" mt={4} color="black">
            Truck : {T30PKS4}
          </Typography>
          <Typography variant="h6" mt={1} color="black">
            Tonase :
          </Typography>
        </Box>
        <Box sx={{ marginRight: "20px" }}>
          <GiFuelTank size="100px" color="#ff6f00" />
        </Box>
      </Box>
      <Box
        gridColumn="span 4"
        display="flex"
        height="150px"
        justifyContent="space-between"
        alignItems="center"
        borderRadius="10px"
        sx={{
          background: "linear-gradient(to right,#ffca28, #ffa000 )",
          boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box mx={3}>
          <Typography variant="h4" color="black" fontWeight="bold">
            TANGKI CPO PKS 6
          </Typography>
          <Typography variant="h6" mt={4} color="black">
            Truck : {T30PKS6}
          </Typography>
          <Typography variant="h6" mt={1} color="black">
            Tonase :
          </Typography>
        </Box>
        <Box sx={{ marginRight: "20px" }}>
          <GiFuelTank size="100px" color="#ff6f00" />
        </Box>
      </Box>
      <Box
        gridColumn="span 4"
        display="flex"
        height="150px"
        justifyContent="space-between"
        alignItems="center"
        borderRadius="10px"
        sx={{
          background: "linear-gradient(to right,#ffca28, #ffa000 )",
          boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box mx={3}>
          <Typography variant="h4" color="black" fontWeight="bold">
            TANGKI CPO PKS 11
          </Typography>
          <Typography variant="h6" mt={4} color="black">
            Truck : {T30PKS11}
          </Typography>
          <Typography variant="h6" mt={1} color="black">
            Tonase :
          </Typography>
        </Box>
        <Box sx={{ marginRight: "20px" }}>
          <GiFuelTank size="100px" color="#ff6f00" />
        </Box>
      </Box>
      <Box
        gridColumn="span 4"
        display="flex"
        height="150px"
        justifyContent="space-between"
        alignItems="center"
        borderRadius="10px"
        sx={{
          background: "linear-gradient(to right,#ffca28, #ffa000 )",
          boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box mx={3}>
          <Typography variant="h4" color="black" fontWeight="bold">
            TANGKI PKO
          </Typography>
          <Typography variant="h6" mt={4} color="black">
            Truck : {T30PKO}
          </Typography>
          <Typography variant="h6" mt={1} color="black">
            Tonase :
          </Typography>
        </Box>
        <Box sx={{ marginRight: "20px" }}>
          <GiFuelTank size="100px" color="#ff6f00" />
        </Box>
      </Box>
      <Box gridColumn="span 12" pt={3}>
        <TonaseStorageTank />
      </Box>
    </Box>
  );
};

export default DashboardT30;
