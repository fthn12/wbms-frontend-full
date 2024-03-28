import { useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-enterprise";
import moment from "moment";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { ModuleRegistry } from "@ag-grid-community/core";

import PlagiarismOutlinedIcon from "@mui/icons-material/PlagiarismOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import Header from "../../../components/layout/signed/Header";

import CreateKualitasPko from "./createKualitasPko";
import ViewKualitasPko from "./view";

import { useConfig, useKualitasPko } from "../../../hooks";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);

const KualitasPko = () => {
  const { MD_SOURCE } = useConfig();
  const { useFindManyKualitasPkoQuery } = useKualitasPko();

  const KualitasPkoFilter = {
    orderBy: [{ dtCreated: "desc" }],
  };

  const { data, error, refetch } =
    useFindManyKualitasPkoQuery(KualitasPkoFilter);

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const actionsRenderer = (params) => {
    return (
      <>
        {params.data && (
          <Box display="flex" justifyContent="center" alignItems="center">
            <IconButton
              size="small"
              onClick={() => {
                setSelected(params.data);
                setIsViewOpen(true);
              }}
            >
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

  const datetimeFormatter = (params) => {
    if (params.data) return moment(params.value).format("DD/MM/YYYY, HH:mm:ss");
  };

  const [columnDefs] = useState([
    // {
    //   field: "refType",
    //   headerName: "Source Master Data",
    //   valueFormatter: sourceFormatter,
    //   enableRowGroup: true,
    //   rowGroup: true,
    //   hide: true,
    // },
    {
      field: "FfaPercentage",
      headerName: "Ffa Percentage",
      flex: 1,
      cellStyle: { textAlign: "center" },
    },
    {
      field: "MoistPercentage",
      headerName: "Moist Percentage",
      flex: 1,
      cellStyle: { textAlign: "center" },
    },
    {
      field: "DirtPercentage",
      headerName: "Dirt Percentage",
      flex: 1,
      cellStyle: { textAlign: "center" },
    },
    {
      field: "dtModified",
      headerName: "Tanggal",
      flex: 1,
      cellStyle: { textAlign: "center" },
      valueFormatter: datetimeFormatter,
    },
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
    []
  );

  if (error) console.log("error:", error);

  return (
    <Box>
      <Header title="KUALITAS PKO" subtitle="Kualitas PKO" />

      <Box display="flex" sx={{ mt: 3 }}>
        <Box flex={1}></Box>
        <Button
          variant="contained"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          UPDATE KUALITAS
        </Button>

        <Button variant="contained" sx={{ ml: 0.5 }} onClick={() => refetch()}>
          Reload
        </Button>
      </Box>

      <Paper sx={{ mt: 1, p: 2, minHeight: "71.5vh" }}>
        <Box
          className="ag-theme-alpine"
          sx={{
            "& .ag-header-cell-label": { justifyContent: "center" },
            width: "auto",
            height: "67.5vh",
          }}
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
 
      {/* Create */}
      <CreateKualitasPko
        isOpen={isOpen}
        onClose={setIsOpen}
        refetch={refetch}
      />

      {/* view */}
      <ViewKualitasPko
        isViewOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        data={selected}
        refetch={refetch}
      />
    </Box>
  );
};

export default KualitasPko;
