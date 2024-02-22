import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, CircularProgress, IconButton, Paper } from "@mui/material";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-enterprise";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { ModuleRegistry } from "@ag-grid-community/core";

import PlagiarismOutlinedIcon from "@mui/icons-material/PlagiarismOutlined";

import Header from "../../../components/layout/signed/Header";

import { useConfig, useSite } from "../../../hooks";

ModuleRegistry.registerModules([ClientSideRowModelModule, RangeSelectionModule, RowGroupingModule, RichSelectModule]);

const MDSite = () => {
  const navigate = useNavigate();
  const { MD_SOURCE, useGetConfigsQuery } = useConfig();

  const { data: response, error, refetch } = useGetConfigsQuery();

  const actionsRenderer = (params) => {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        {params.data && (
          <IconButton size="small" onClick={() => navigate(`/wb/administration/configs/update/${params.data.id}`)}>
            <PlagiarismOutlinedIcon />
          </IconButton>
        )}
      </Box>
    );
  };
  const sourceFormatter = (params) => {
    return MD_SOURCE[params.value];
  };
  const [columnDefs] = useState([
    // {
    //   field: "role",
    //   headerName: "ROLE Type",
    //   valueFormatter: sourceFormatter,
    //   enableRowGroup: true,
    //   rowGroup: true,
    //   hide: true,
    // },
    {
      field: "id",
      headerName: "Actions",
      maxWidth: 150,
      cellRenderer: actionsRenderer,
      pinned: "left",
      lockPinned: true,
    },

    {
      field: "siteType",
      headerName: "Tipe Site",

      cellStyle: { textAlign: "center" },
      valueGetter: (params) => {
        const siteTypes = {
          1: "PKS",
          2: "T30",
          3: "Bulking",
        };
        return siteTypes[params.data.siteType] || "-";
      },
    },
    { field: "btSiteCode", headerName: "Kode BONTRIP", cellStyle: { textAlign: "center" } },
    {
      field: "btSuffixTrx",
      headerName: "Suffix BONTRIP Transaksi WB",
      flex: true,
      cellStyle: { textAlign: "center" },
    },
    { field: "siteCutOffHour", headerName: "Jam Cut Off", cellStyle: { textAlign: "center" } },
    { field: "siteCutOffMinute", headerName: "Menit Cut Off", cellStyle: { textAlign: "center" } },

    { field: "wbMinWeight", headerName: "Berat Minimum WB", cellStyle: { textAlign: "center" } },
    { field: "wbStablePeriod", headerName: "Lama Waktu Stabil WB", cellStyle: { textAlign: "center" } },
  ]);

  const defaultColDef = {
    sortable: true,
    resizable: true,
    floatingFilter: false,
    filter: true,
    enableRowGroup: false,
    rowGroup: false,
  };

  // never changes, so we can use useMemo
  const autoGroupColumnDef = useMemo(
    () => ({
      cellRendererParams: {
        suppressCount: false,
        checkbox: false,
      },
      field: "name",
      // valueFormatter: sourceFormatter,
      minWidth: "250",
      sort: "asc",
      // flex: 1,
      headerName: "ROLE Type",
    }),
    [],
  );

  if (error) console.log("error:", error);

  return (
    <Box>
      <Header title="CONFIGS" subtitle="List Configs" />

      <Paper sx={{ mt: 8, p: 2, minHeight: "71.5vh" }}>
        <Box
          className="ag-theme-alpine"
          sx={{ "& .ag-header-cell-label": { justifyContent: "center" }, width: "auto", height: "67.5vh" }}
        >
          <AgGridReact
            rowData={response?.records} // Row Data for Rows
            columnDefs={columnDefs} // Column Defs for Columns
            defaultColDef={defaultColDef} // Default Column Properties
            animateRows={true} // Optional - set to 'true' to have rows animate when sorted
            // rowSelection="multiple" // Options - allows click selection of rows
            // rowGroupPanelShow="always"
            enableRangeSelection="true"
            groupSelectsChildren="true"
            suppressRowClickSelection="true"
            autoGroupColumnDef={autoGroupColumnDef}
            pagination="true"
            paginationAutoPageSize="true"
            groupDefaultExpanded="1"
          />
        </Box>
      </Paper>
     
    </Box>
  );
};

export default MDSite;
