import { useMemo, useState } from "react";
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

import { useConfig, useCompany } from "../../../hooks";

ModuleRegistry.registerModules([ClientSideRowModelModule, RangeSelectionModule, RowGroupingModule, RichSelectModule]);

const MDCompany = () => {
  const { MD_SOURCE } = useConfig();
  const { useGetCompaniesQuery, useEDispatchCompanySyncMutation } = useCompany();

  const { data, error, refetch } = useGetCompaniesQuery();
  const [eDispatchSync, { isLoading }] = useEDispatchCompanySyncMutation();

  const handleViewClick = async (id) => {
    // try {
    //   setIsLoading(true);
    //   const response = await transactionAPI.getById(id);
    //   setOpenedTransaction(response.data.transaction);
    //   setIsLoading(false);
    //   return navigate(response.data.urlPath);
    // } catch (error) {
    //   setIsLoading(false);
    //   return toast.error(`${error?.message}..!!`);
    // }
  };

  const actionsRenderer = (params) => {
    return (
      <>
        {params.data && (
          <Box display="flex" justifyContent="center" alignItems="center">
            <IconButton size="small" onClick={() => handleViewClick(params.data.id)}>
              <PlagiarismOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        )}
      </>
    );
  };

  const sourceFormatter = (params) => {
    return MD_SOURCE[params.value];
  };

  const booleanFormatter = (params) => {
    if (params.data) {
      if (params.value) return "YES";
      else return "NO";
    }
  };

  const [columnDefs] = useState([
    {
      field: "refType",
      headerName: "Source Master Data",
      valueFormatter: sourceFormatter,
      enableRowGroup: true,
      rowGroup: true,
      hide: true,
    },
    { field: "codeSap", headerName: "Kode SAP", maxWidth: 150, cellStyle: { textAlign: "center" } },
    // { field: "name", headerName: "Nama", flex: 1 },
    { field: "shortName", headerName: "Nama Pendek", maxWidth: 150, cellStyle: { textAlign: "center" } },
    {
      field: "isMillOperator",
      headerName: "Is Mill",
      valueFormatter: booleanFormatter,
      cellDataType: "text",
      maxWidth: 140,
      cellStyle: { textAlign: "center" },
    },
    {
      field: "isEstate",
      headerName: "Is Estate",
      valueFormatter: booleanFormatter,
      cellDataType: "text",
      maxWidth: 140,
      cellStyle: { textAlign: "center" },
    },
    {
      field: "isTransporter",
      headerName: "Is Transporter",
      valueFormatter: booleanFormatter,
      cellDataType: "text",
      maxWidth: 140,
      cellStyle: { textAlign: "center" },
    },

    { field: "contactName", headerName: "Nama Kontak" },
    { field: "contactEmail", headerName: "Email Kontak", flex: 1 },

    {
      field: "id",
      headerName: "Actions",
      maxWidth: 150,
      cellRenderer: actionsRenderer,
      pinned: "left",
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
      headerName: "Source Master Data",
      // valueFormatter: sourceFormatter,
      minWidth: "250",
      // flex: 1,
    }),
    [],
  );

  if (error) console.log("error:", error);

  return (
    <Box>
      <Header title="COMPANIES" subtitle="Master Data Perusahaan" />

      <Box display="flex" sx={{ mt: 3 }}>
        <Box flex={1}></Box>
        <Button variant="contained" onClick={() => eDispatchSync()}>
          Add
        </Button>
        <Button variant="contained" sx={{ ml: 0.5 }} onClick={() => eDispatchSync()}>
          eDispatch Sync
        </Button>
        <Button variant="contained" sx={{ ml: 0.5 }} onClick={() => refetch()}>
          Reload
        </Button>
      </Box>

      <Paper sx={{ mt: 1, p: 2, minHeight: "71.5vh" }}>
        <Box
          className="ag-theme-alpine"
          sx={{ "& .ag-header-cell-label": { justifyContent: "center" }, width: "auto", height: "67.5vh" }}
        >
          <AgGridReact
            rowData={data?.records} // Row Data for Rows
            columnDefs={columnDefs} // Column Defs for Columns
            defaultColDef={defaultColDef} // Default Column Properties
            animateRows={true} // Optional - set to 'true' to have rows animate when sorted
            rowSelection="multiple" // Options - allows click selection of rows
            rowGroupPanelShow="always"
            enableRangeSelection="true"
            groupSelectsChildren="true"
            suppressRowClickSelection="true"
            autoGroupColumnDef={autoGroupColumnDef}
            pagination="true"
            paginationAutoPageSize="true"
            groupDefaultExpanded="1"
            rowHeight="32"
          />
        </Box>
      </Paper>
      {isLoading && (
        <CircularProgress
          size={50}
          sx={{
            color: "goldenrod",
            position: "absolute",
            top: "50%",
            left: "48.5%",
          }}
        />
      )}
    </Box>
  );
};

export default MDCompany;
