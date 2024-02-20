import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, IconButton, Paper } from "@mui/material";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-enterprise";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import "ag-grid-community/styles/ag-theme-balham.min.css"; // Optional theme CSS
import { ModuleRegistry } from "@ag-grid-community/core";

import PlagiarismOutlinedIcon from "@mui/icons-material/PlagiarismOutlined";

import Header from "../../../components/layout/signed/Header";

import { useConfig, useUser } from "../../../hooks";

ModuleRegistry.registerModules([ClientSideRowModelModule, RangeSelectionModule, RowGroupingModule, RichSelectModule]);

const ConfigsTable = () => {
  const navigate = useNavigate();

  const { ROLES, useGetConfigsQuery } = useConfig();
  const { useGetUsersQuery } = useUser();

  const { data: response, error, refetch } = useGetConfigsQuery();

  const sourceFormatter = (params) => {
    let value = "-";

    // const filteredRoles = ROLES.filter((role) => role.id === +params.value);
    const findRole = ROLES.find((role) => role.id === +params.value);

    if (findRole) value = findRole.value;

    return value;
  };

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
      headerName: "No",
      field: "no",
      filter: true,
      sortable: true,
      resizable: true,
      hide: false,
      maxWidth: 80,
      cellStyle: { textAlign: "center" },
      valueGetter: (params) => params.node.rowIndex + 1,
    },
    {
      field: "siteType",
      headerName: "Tipe Site",
      maxWidth: 120,
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
    { field: "siteCutOffHour", headerName: "Jam Cut Off", maxWidth: 120, cellStyle: { textAlign: "center" } },
    { field: "siteCutOffMinute", headerName: "Menit Cut Off", maxWidth: 120, cellStyle: { textAlign: "center" } },
    { field: "btSiteCode", headerName: "Kode BONTRIP", maxWidth: 125, cellStyle: { textAlign: "center" } },
    {
      field: "btSuffixTrx",
      headerName: "Suffix BONTRIP Transaksi WB",

      cellStyle: { textAlign: "center" },
    },
    {
      field: "btSuffixForm",
      headerName: "Suffix BONTRIP Backdate Form",

      cellStyle: { textAlign: "center" },
    },
    {
      field: "btSuffixTemplate",
      headerName: "Suffix BONTRIP Backdate Template",

      cellStyle: { textAlign: "center" },
    },
    { field: "wbMinWeight", headerName: "Berat Minimum WB", maxWidth: 140, cellStyle: { textAlign: "center" } },
    { field: "wbStablePeriod", headerName: "Lama Waktu Stabil WB", maxWidth: 149, cellStyle: { textAlign: "center" } },

    {
      field: "id",
      headerName: "Actions",
      maxWidth: 150,
      cellRenderer: actionsRenderer,
      pinned: "right",
      lockPinned: true,
    },
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

      {/* <Box display="flex" sx={{ mt: 3 }}>
        <Box flex={1}></Box>
        <Button
          variant="contained"
          onClick={() => {
            navigate("/wb/administration/users/add");
          }}
        >
          Add
        </Button>
        <Button variant="contained" sx={{ ml: 0.5 }} onClick={() => refetch()}>
          Reload
        </Button>
      </Box> */}

      <Paper sx={{ mt: 5, p: 2, minHeight: "72vh" }}>
        <Box
          className="ag-theme-balham"
          sx={{ "& .ag-header-cell-label": { justifyContent: "center" }, width: "auto", height: "69vh" }}
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

export default ConfigsTable;
