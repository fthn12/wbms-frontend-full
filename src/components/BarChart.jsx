import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Select, MenuItem, FormControl, Typography, Box, Paper } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import { useConfig, useTransaction } from "../hooks";
import moment from "moment";
import "../index.css";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const BarChartComponent = () => {
  const { useFindManyTransactionQuery } = useTransaction();
  const { WBMS } = useConfig();

  const startOfYear = moment().startOf("year").toISOString();
  const endOfYear = moment().endOf("year").toISOString();

  const data = {
    where: {
      typeSite: +WBMS.SITE_TYPE,
      OR: [
        {
          progressStatus: { in: [21, 40, 41, 42] },
        },
      ],
      AND: [
        {
          dtTransaction: {
            gte: startOfYear,
            lte: endOfYear,
          },
        },
      ],
      NOT: {
        typeTransaction: 5,
      },
    },
    orderBy: { bonTripNo: "desc" },
  };
  const { data: results, refetch } = useFindManyTransactionQuery(data);
  const [selectedProduct, setSelectedProduct] = useState("All");

  const handleProductChange = (product) => {
    setSelectedProduct(product);
  };

  const transactions = results?.records || [];
  const filteredData =
    selectedProduct !== "All"
      ? transactions.filter(
          (transaction) =>
            (selectedProduct === "TBS" && transaction.productName === "TBS") ||
            (selectedProduct === "Others" && !["CPO", "PKO", "TBS"].includes(transaction.productName)) ||
            (selectedProduct !== "TBS" && selectedProduct !== "Others" && transaction.productName === selectedProduct),
        )
      : transactions;

  const productNames = ["CPO", "PKO", "TBS", "Others"];

  const monthlyData = monthNames.map((monthName, monthIndex) => {
    const monthTotal = { name: monthName };

    productNames.forEach((productName) => {
      monthTotal[productName] = 0;
    });

    const monthTransactions = filteredData.filter(
      (transaction) => new Date(transaction.dtTransaction).getMonth() === monthIndex,
    );

    monthTransactions.forEach((transaction) => {
      if (transaction.productName === "TBS") {
        monthTotal["TBS"] += 1;
      } else if (productNames.includes(transaction.productName)) {
        monthTotal[transaction.productName] += 1;
      } else {
        monthTotal["Others"] += 1;
      }
    });

    return monthTotal;
  });

  // Fill in missing months with zero transactions
  for (let i = 0; i < 12; i++) {
    const monthIndex = monthlyData.findIndex((data) => monthNames.indexOf(data.name) === i);

    if (monthIndex === -1) {
      const newMonthTotal = { name: monthNames[i] };
      productNames.forEach((productName) => {
        newMonthTotal[productName] = 0;
      });
      monthlyData.splice(i, 0, newMonthTotal);
    }
  }

  return (
    <Paper elevation={5} sx={{ p: 3, mx: 1, borderRadius: "10px" }}>
      <div style={{ width: "auto", height: "auto" }}>
        <div className="grafik">
          <Box display="flex" mt={1}>
            <BarChartIcon sx={{ mr: 1, fontSize: "23px" }} />
            <Typography variant="h5" mt={0.1}>
              Total Transaksi Per Bulan
            </Typography>
          </Box>
          <FormControl size="small">
            <Select
              value={selectedProduct}
              onChange={(e) => handleProductChange(e.target.value)}
              displayEmpty
              sx={{
                color: selectedProduct === "" ? "gray" : "black",
                // fontSize: "15px",
                borderRadius: "10px",
              }}
            >
              <MenuItem value="All">-- Pilih Semua --</MenuItem>
              <MenuItem value="CPO">CPO</MenuItem>
              <MenuItem value="PKO">PKO</MenuItem>
              <MenuItem value="TBS">TBS</MenuItem>
              <MenuItem value="Others">Others</MenuItem>
            </Select>
          </FormControl>
          <div className="barChart">
            <div className="chart">
              <hr />
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={500}
                  data={monthlyData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar type="monotone" dataKey="CPO" fill="#0B63F6" />
                  <Bar type="monotone" dataKey="PKO" fill="#33cc33" />
                  <Bar type="monotone" dataKey="TBS" fill="#ffc107" />
                  <Bar type="monotone" dataKey="Others" fill="#f44336" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default BarChartComponent;
