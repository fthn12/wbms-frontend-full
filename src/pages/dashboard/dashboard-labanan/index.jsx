import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, Paper } from "@mui/material";
import BarChartIcon from "@mui/icons-material/EqualizerOutlined";
import { useNavigate } from "react-router-dom";

import Header from "../../../components/layout/signed/Header";

// import AreaCharts from "../../../components/areaChart";
// import PieCharts from "../../../components/pieChart";

import { useConfig, useTransaction, useApp } from "../../../hooks";

const DashboardLabanan = () => {
  const navigate = useNavigate();

  const { useFindManyTransactionQuery, setOpenedTransaction, clearWbTransaction, clearOpenedTransaction } =
    useTransaction();
  const { WBMS } = useConfig();
  const { setSidebar, setUrlPrev } = useApp();
  const [CPOProduct, setCPOProduct] = useState(0);
  const [PKOProduct, setPKOProduct] = useState(0);
  const [TBSProduct, setTBSProduct] = useState(0);
  const [OtherProduct, setOtherProduct] = useState(0);



  const data = {
    where: {
      typeSite: +WBMS.SITE_TYPE,
      OR: [
        {
          progressStatus: 21,
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
      console.log("datatransaksi:", transactions);

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
    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px">
      <Box
        gridColumn="span 6"
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
      <Box
        gridColumn="span 6"
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
      {/* <Box
          gridColumn="span 3"
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
        </Box> */}
      {/* <Box
          gridColumn="span 3"
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
        </Box> */}
      <Box
        gridColumn="span 3"
        display="flex"
        flexDirection="column"
        height="150px"
        justifyContent="space-between"
        alignItems="center"
        borderRadius="10px"
        sx={{
          background: "linear-gradient(to right,#ffc107, #ffc107)",
          boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box mx={3}>
          <Typography variant="h5" mt={4} fontWeight="bold" color="white">
            TRUCK {OtherProduct}
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="white">
            TONASE {OtherProduct}
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight="bold" color="#A1EEBD">
          + {OtherProduct}
        </Typography>
        <Typography variant="h4" fontWeight="bold" color="white" mr={2}>
          STORGE TANK 1
        </Typography>
      </Box>
      <Box
        gridColumn="span 3"
        display="flex"
        flexDirection="column"
        height="150px"
        justifyContent="space-between"
        alignItems="center"
        borderRadius="10px"
        sx={{
          background: "linear-gradient(to right,#ffc107, #ffc107)",
          boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box mx={3}>
          <Typography variant="h5" mt={4} fontWeight="bold" color="white">
            TRUCK {OtherProduct}
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="white">
            TONASE {OtherProduct}
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight="bold" color="#A1EEBD">
          + {OtherProduct}
        </Typography>
        <Typography variant="h4" fontWeight="bold" color="white" mr={2}>
          STORGE TANK 2
        </Typography>
      </Box>
      <Box
        gridColumn="span 3"
        display="flex"
        flexDirection="column"
        height="150px"
        justifyContent="space-between"
        alignItems="center"
        borderRadius="10px"
        sx={{
          background: "linear-gradient(to right,#ffc107, #ffc107)",
          boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box mx={3}>
          <Typography variant="h5" mt={4} fontWeight="bold" color="white">
            TRUCK {OtherProduct}
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="white">
            TONASE {OtherProduct}
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight="bold" color="#A1EEBD">
          + {OtherProduct}
        </Typography>
        <Typography variant="h4" fontWeight="bold" color="white" mr={2}>
          STORGE TANK 3
        </Typography>
      </Box>
      <Box
        gridColumn="span 3"
        display="flex"
        flexDirection="column"
        height="150px"
        justifyContent="space-between"
        alignItems="center"
        borderRadius="10px"
        sx={{
          background: "linear-gradient(to right,#ffc107, #ffc107)",
          boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box mx={3}>
          <Typography variant="h5" mt={4} fontWeight="bold" color="white">
            TRUCK {OtherProduct}
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="white">
            TONASE {OtherProduct}
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight="bold" color="#A1EEBD">
          + {OtherProduct}
        </Typography>
        <Typography variant="h4" fontWeight="bold" color="white" mr={2}>
          STORGE TANK 4
        </Typography>
      </Box>
      <Box
        gridColumn="span 3"
        display="flex"
        flexDirection="column"
        height="150px"
        justifyContent="space-between"
        alignItems="center"
        borderRadius="10px"
        sx={{
          background: "linear-gradient(to right,#ffc107, #ffc107)",
          boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box mx={3}>
          <Typography variant="h5" mt={4} fontWeight="bold" color="white">
            TRUCK {OtherProduct}
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="white">
            TONASE {OtherProduct}
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight="bold" color="#A1EEBD">
          + {OtherProduct}
        </Typography>
        <Typography variant="h4" fontWeight="bold" color="white" mr={2}>
          STORGE TANK 5
        </Typography>
      </Box>
      <Box
        gridColumn="span 3"
        display="flex"
        flexDirection="column"
        height="150px"
        justifyContent="space-between"
        alignItems="center"
        borderRadius="10px"
        sx={{
          background: "linear-gradient(to right,#ffc107, #ffc107)",
          boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box mx={3}>
          <Typography variant="h5" mt={4} fontWeight="bold" color="white">
            TRUCK {OtherProduct}
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="white">
            TONASE {OtherProduct}
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight="bold" color="#A1EEBD">
          + {OtherProduct}
        </Typography>
        <Typography variant="h4" fontWeight="bold" color="white" mr={2}>
          STORGE TANK 6
        </Typography>
      </Box>
      <Box
        gridColumn="span 3"
        display="flex"
        flexDirection="column"
        height="150px"
        justifyContent="space-between"
        alignItems="center"
        borderRadius="10px"
        sx={{
          background: "linear-gradient(to right,#ffc107, #ffc107)",
          boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box mx={3}>
          <Typography variant="h5" mt={4} fontWeight="bold" color="white">
            TRUCK {OtherProduct}
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="white">
            TONASE {OtherProduct}
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight="bold" color="#A1EEBD">
          + {OtherProduct}
        </Typography>
        <Typography variant="h4" fontWeight="bold" color="white" mr={2}>
          STORGE TANK 7
        </Typography>
      </Box>
      <Box
        gridColumn="span 3"
        display="flex"
        flexDirection="column"
        height="150px"
        justifyContent="space-between"
        alignItems="center"
        borderRadius="10px"
        sx={{
          background: "linear-gradient(to right,#ffc107, #ffc107)",
          boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Box mx={3}>
          <Typography variant="h5" mt={4} fontWeight="bold" color="white">
            TRUCK {OtherProduct}
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="white">
            TONASE {OtherProduct}
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight="bold" color="#A1EEBD">
          + {OtherProduct}
        </Typography>
        <Typography variant="h4" fontWeight="bold" color="white" mr={2}>
          STORGE TANK 8
        </Typography>
      </Box>
      {/* <Box
          gridColumn="span 3"
          display="flex"
          height="150px"
          justifyContent="space-between"
          alignItems="center"
          borderRadius="10px"
          sx={{
            background: "linear-gradient(to right,#ffc107, #ffc107)",
            boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Box mx={3}>
            <Typography variant="h5" pb={1} fontWeight="bold" color="white">
              TRUCK {OtherProduct} 
            </Typography>
            <Typography variant="h5" pb={1} fontWeight="bold" color="white">
              TONASE {OtherProduct} 
            </Typography>
          </Box>
            <Typography variant="h4" fontWeight="bold" color="white" mr={2}>
              STORGE TANK 9
            </Typography>
        </Box>
        <Box
          gridColumn="span 3"
          display="flex"
          height="150px"
          justifyContent="space-between"
          alignItems="center"
          borderRadius="10px"
          sx={{
            background: "linear-gradient(to right,#ffc107, #ffc107)",
            boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Box mx={3}>
            <Typography variant="h5" pb={1} fontWeight="bold" color="white">
              TRUCK {OtherProduct} 
            </Typography>
            <Typography variant="h5" pb={1} fontWeight="bold" color="white">
              TONASE {OtherProduct} 
            </Typography>
          </Box>
            <Typography variant="h4" fontWeight="bold" color="white" mr={2}>
              STORGE TANK 10
            </Typography>
        </Box>
        <Box
          gridColumn="span 3"
          display="flex"
          height="150px"
          justifyContent="space-between"
          alignItems="center"
          borderRadius="10px"
          sx={{
            background: "linear-gradient(to right,#ffc107, #ffc107)",
            boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Box mx={3}>
            <Typography variant="h5" pb={1} fontWeight="bold" color="white">
              TRUCK {OtherProduct} 
            </Typography>
            <Typography variant="h5" pb={1} fontWeight="bold" color="white">
              TONASE {OtherProduct} 
            </Typography>
          </Box>
            <Typography variant="h4" fontWeight="bold" color="white" mr={2}>
              STORGE TANK 11
            </Typography>
        </Box>
        <Box
          gridColumn="span 3"
          display="flex"
          height="150px"
          justifyContent="space-between"
          alignItems="center"
          borderRadius="10px"
          sx={{
            background: "linear-gradient(to right,#ffc107, #ffc107)",
            boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Box mx={3}>
            <Typography variant="h5" pb={1} fontWeight="bold" color="white">
              TRUCK {OtherProduct} 
            </Typography>
            <Typography variant="h5" pb={1} fontWeight="bold" color="white">
              TONASE {OtherProduct} 
            </Typography>
          </Box>
            <Typography variant="h4" fontWeight="bold" color="white" mr={2}>
              STORGE TANK 12
            </Typography>
        </Box>
        <Box
          gridColumn="span 3"
          display="flex"
          height="150px"
          justifyContent="space-between"
          alignItems="center"
          borderRadius="10px"
          sx={{
            background: "linear-gradient(to right,#ffc107, #ffc107)",
            boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Box mx={3}>
            <Typography variant="h5" pb={1} fontWeight="bold" color="white">
              TRUCK {OtherProduct} 
            </Typography>
            <Typography variant="h5" pb={1} fontWeight="bold" color="white">
              TONASE {OtherProduct} 
            </Typography>
          </Box>
            <Typography variant="h4" fontWeight="bold" color="white" mr={2}>
              STORGE TANK 13
            </Typography>
        </Box>
        <Box
          gridColumn="span 3"
          display="flex"
          height="150px"
          justifyContent="space-between"
          alignItems="center"
          borderRadius="10px"
          sx={{
            background: "linear-gradient(to right,#ffc107, #ffc107)",
            boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Box mx={3}>
            <Typography variant="h5" pb={1} fontWeight="bold" color="white">
              TRUCK {OtherProduct} 
            </Typography>
            <Typography variant="h5" pb={1} fontWeight="bold" color="white">
              TONASE {OtherProduct} 
            </Typography>
          </Box>
            <Typography variant="h4" fontWeight="bold" color="white" mr={2}>
              STORGE TANK 14
            </Typography>
        </Box>
        <Box
          gridColumn="span 3"
          display="flex"
          height="150px"
          justifyContent="space-between"
          alignItems="center"
          borderRadius="10px"
          sx={{
            background: "linear-gradient(to right,#ffc107, #ffc107)",
            boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Box mx={3}>
            <Typography variant="h5" pb={1} fontWeight="bold" color="white">
              TRUCK {OtherProduct} 
            </Typography>
            <Typography variant="h5" pb={1} fontWeight="bold" color="white">
              TONASE {OtherProduct} 
            </Typography>
          </Box>
            <Typography variant="h4" fontWeight="bold" color="white" mr={2}>
              STORGE TANK 15
            </Typography>
        </Box>
        <Box
          gridColumn="span 3"
          display="flex"
          flexDirection="column"
          height="150px"
          justifyContent="space-between"
          alignItems="center"
          borderRadius="10px"
          sx={{
            background: "linear-gradient(to right,#ffc107, #ffc107)",
            boxShadow: "0px 8px 8px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Box mx={3}>
            <Typography variant="h5" mt={4} fontWeight="bold" color="white">
              TRUCK {OtherProduct} 
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="white">
              TONASE {OtherProduct} 
            </Typography>
          </Box>
            <Typography variant="h6" fontWeight="bold" color="#A1EEBD">
              + {OtherProduct}
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="white" mr={2}>
              STORGE TANK 16
            </Typography>
        </Box> */}
      {/* <Box gridColumn="span 8" pt={3}>
          <Paper elevation={5} sx={{ p: 3, mx: 1, borderRadius: "10px" }}>
            <div style={{ width: "auto", height: "auto" }}>
              <AreaCharts />
            </div>
          </Paper>
        </Box>
        <Box gridColumn="span 4" pt={3}>
          <Paper elevation={5} sx={{ p: 3, mx: 1, borderRadius: "10px" }}>
            <div style={{ width: "auto", height: "auto" }}>
              <Box display="flex">
                <PieChartOutlinedIcon sx={{ mr: 1 }} />
                <Typography fontSize="18px" mb={2}>
                  Sales Chart
                </Typography>
              </Box>
              <hr />
              <PieCharts />
            </div>
          </Paper>
        </Box> */}
    </Box>
  );
};

export default DashboardLabanan;
