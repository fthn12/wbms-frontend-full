import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useConfig, useTransaction } from "../../../hooks";
import Header from "../../../components/layout/signed/Header";

import DashboardPKS from "../dashboard-pks";
import DashboardT30 from "../dashboard-t30";
import DashboardLabanan from "../dashboard-labanan";

import { useApp } from "../../../hooks";

const DashboardAll = () => {
  const navigate = useNavigate();

  const { clearWbTransaction, clearOpenedTransaction } = useTransaction();
  const { WBMS } = useConfig();
  const { setSidebar, setUrlPrev } = useApp();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    // navigate dari child (content didalam Outlet) tidak merunning useEffect ini
    // console.clear();
    clearWbTransaction();
    clearOpenedTransaction();

    if (WBMS.SITE_TYPE === 1) {
      setSidebar({ selected: "Dashboard PKS" });

      setTitle("DASHBOARD PKS");
      setSubtitle("WBMS Dashboard PKS");
    } else if (WBMS.SITE_TYPE === 2) {
      setSidebar({ selected: "Dashboard T30" });

      setTitle("DASHBOARD T30");
      setSubtitle("WBMS Dashboard T30");
    } else if (WBMS.SITE_TYPE === 3) {
      setSidebar({ selected: "Dashboard Bulking" });

      setTitle("DASHBOARD BULKING");
      setSubtitle("WBMS Dashboard Bulking");
    } else {
      navigate("wb/404");
    }

    setUrlPrev("/wb/transactions");

    return () => {
      // console.clear();
    };
  }, []);

  return (
    <div className="dashboard">
      <Box mb={3}>
        <Header title={title} subtitle={subtitle} />
      </Box>
      {WBMS.SITE_TYPE === 1 && <DashboardPKS />}
      {WBMS.SITE_TYPE === 2 && <DashboardT30 />}
      {WBMS.SITE_TYPE === 3 && <DashboardLabanan />}
    </div>
  );
};

export default DashboardAll;
