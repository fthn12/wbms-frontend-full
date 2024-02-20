import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Button } from "@mui/material";
import moment from "moment";

import Header from "../../components/layout/signed/HeaderTransaction";
import TransactionManualEntryGrid from "../../components/TransactionManualEntryGrid";

import { TransactionAPI } from "../../apis";
import { useConfig, useTransaction, useApp } from "../../hooks";

const TransactionManualEntry = () => {
  const navigate = useNavigate();

  const transactionAPI = TransactionAPI();
  const { WBMS } = useConfig();
  const { setSidebar, setUrlPrev } = useApp();
  const { setOpenedTransaction, clearWbTransaction, clearOpenedTransaction } = useTransaction();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    // navigate dari child (content didalam Outlet) tidak merunning useEffect ini
    // console.clear();
    clearWbTransaction();
    clearOpenedTransaction();

    if (WBMS.SITE_TYPE === 1) {
      setSidebar({ selected: "Transaksi Manual Entry PKS" });

      setTitle("Transaksi Manual Entry PKS");
      setSubtitle("Transaksi Manual Entry pada PKS");
    } else if (WBMS.SITE_TYPE === 2) {
      setSidebar({ selected: "Transaksi Manual Entry T30" });

      setTitle("Transaksi Manual Entry T30");
      setSubtitle("Transaksi Manual Entry pada T30");
    } else if (WBMS.SITE_TYPE === 3) {
      setSidebar({ selected: "Transaksi Manual Entry Bulking" });

      setTitle("Transaksi Manual Entry Bulking");
      setSubtitle("Transaksi Manual Entry pada Bulking");
    } else {
      navigate("wb/404");
    }

    setUrlPrev("/wb/transactions");

    return () => {
      // console.clear();
    };
  }, []);

  return (
    <Box>
      <Header title={title} subtitle={subtitle} />

      <Box display="flex" sx={{ mt: 3 }}>
        <Box flex={1}></Box>
        <Button
          variant="contained"
          sx={{ mr: 0.5 }}
          onClick={() => {
            if (WBMS.SITE_TYPE === 1) {
              navigate(`/wb/transactions/pks/manual-entry-netto-in`);
            } else if (WBMS.SITE_TYPE === 2) {
              navigate(`/wb/transactions/t30/manual-entry-netto-in`);
            } else if (WBMS.SITE_TYPE === 3) {
              navigate(`/wb/transactions/bulking/manual-entry-netto-in`);
            }
          }}
        >
          new
        </Button>
        {/* <Button
          variant="contained"
          onClick={() => {
            navigate("/wb/transactions/pks-new-backdate");
          }}
        >
          Form
        </Button> */}
      </Box>

      <Paper sx={{ mt: 1, p: 2, minHeight: "75vh" }}>
        <TransactionManualEntryGrid />
      </Paper>
    </Box>
  );
};

export default TransactionManualEntry;
