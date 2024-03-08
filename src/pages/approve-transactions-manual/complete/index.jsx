import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-enterprise";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.min.css"; // Optional theme CSS
import "ag-grid-community/styles/ag-theme-balham.min.css"; // Optional theme CSS
import { ModuleRegistry } from "@ag-grid-community/core";
import { toast } from "react-toastify";
import * as moment from "moment";

import PlagiarismIcon from "@mui/icons-material/Plagiarism";

import Header from "../../../components/layout/signed/Header";

import { useConfig, useTransaction, useApp } from "../../../hooks";
import { useRef } from "react";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  RowGroupingModule,
  RichSelectModule,
]);

const ReportTransactionPending = () => {
  const navigate = useNavigate();
  const { setSidebar } = useApp();
  const { WBMS, PROGRESS_STATUS } = useConfig();
  const {
    useEDispatchTransactionMdispatchMutation,
    useFindManyTransactionQuery,
  } = useTransaction();

  const [isLoading, setIsLoading] = useState(false);

  const gridRef = useRef();

  const [eDispatchMdispatch] = useEDispatchTransactionMdispatchMutation();

  const data = {
    where: {
      typeSite: +WBMS.SITE_TYPE,
      progressStatus: { in: [21, 26, 31, 100, 40, 41, 42] },
      OR: [{ isManualEntry: 1 }, { isManualTonase: 1 }],
    },

    orderBy: [{ progressStatus: "asc" }, { bonTripNo: "desc" }],
  };

  const { data: dtTransaction, refetch: refetchDtTransaction } =
    useFindManyTransactionQuery(data);

  const handleViewClick = async (id, progressStatus, bonTripRef) => {
    try {
      setIsLoading(true);

      // const response = await transactionAPI.getById(id);

      // setOpenedTransaction(response.data.transaction);

      let urlPath = "";

      if (WBMS.SITE_TYPE === 1) {
        if (progressStatus === 1) {
          urlPath = "/wb/transactions/pks-edispatch-normal-in";
        } else if (progressStatus === 21) {
          urlPath = "/wb/transactions/pks/manual-entry-dispatch-view";
        } else if (progressStatus === 26) {
          urlPath =
            "/wb/transactions/pks/manual-entry-dispatch-cancel-out-view";
        } else if (progressStatus === 31) {
          urlPath = "/wb/transactions/pks-edispatch-reject-out";
        } else if (progressStatus === 40) {
          urlPath = "/wb/transactions/pks/manual-entry-other-view";
        } else if (progressStatus === 41) {
          urlPath = "/wb/transactions/pks/manual-entry-tbs-view";
        } else if (progressStatus === 42) {
          urlPath = "/wb/transactions/pks/manual-entry-kernel-view";
        } else if (progressStatus === 100) {
          urlPath = "/wb/transactions/t30-edispatch-deleted";
        } else {
          throw new Error("Progress Status tidak valid.");
        }
      } else if (WBMS.SITE_TYPE === 2) {
        if (progressStatus === 1) {
          urlPath = "/wb/transactions/t30-edispatch-normal-in";
        } else if (progressStatus === 21) {
          urlPath = "/wb/transactions/t30/manual-entry-dispatch-view";
        } else if (progressStatus === 26) {
          urlPath =
            "/wb/transactions/t30/manual-entry-dispatch-cancel-out-view";
        } else if (progressStatus === 42) {
          urlPath = "/wb/transactions/t30/manual-entry-others-view";
        } else if (progressStatus === 100) {
          urlPath = "/wb/transactions/t30-edispatch-deleted";
        } else {
          throw new Error("Progress Status tidak valid.");
        }
      } else if (WBMS.SITE_TYPE === 3) {
        if (progressStatus === 2) {
          urlPath = "/wb/transactions/bulking-edispatch-in";
        } else if (progressStatus === 21) {
          urlPath = "/wb/transactions/bulking/manual-entry-dispatch-view";
        } else if (progressStatus === 42) {
          urlPath = "/wb/transactions/bulking/manual-entry-others-view";
        } else {
          throw new Error("Progress Status tidak valid.");
        }
      }

      setIsLoading(false);

      return navigate(`${urlPath}/${id}`);
    } catch (error) {
      setIsLoading(false);
      return toast.error(`${error?.message}..!!`);
    }
  };

  useEffect(() => {
    setSidebar({ selected: "Transaksi Harian" });
  }, []);

  const statusFormatter = (params) => {
    return PROGRESS_STATUS[params.value];
    // if (WBMS.SITE_TYPE === 1) return PKS_PROGRESS_STATUS[params.value];
    // else if (WBMS.SITE_TYPE === 2) return T30_PROGRESS_STATUS[params.value];
    // else if (WBMS.SITE_TYPE === 3) return BULKING_PROGRESS_STATUS[params.value];
  };

  const dateFormatter = (params) => {
    if (params.data)
      return moment(params.value).format("DD MMM YYYY").toUpperCase();
  };

  const timeFormatter = (params) => {
    if (params.data) return moment(params.value).format("HH:mm:ss");
  };

  const datetimeFormatter = (params) => {
    if (params.data) return moment(params.value).format("DD/MM/YYYY, HH:mm:ss");
  };

  const originNettoFormatter = (params) => {
    if (params?.data) {
      let netto = 0;

      netto = Math.abs(
        params.data.originWeighInKg - params.data.originWeighOutKg
      );

      return netto.toLocaleString("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  };

  const returnNettoFormatter = (params) => {
    if (params?.data) {
      let netto = 0;

      netto = Math.abs(
        params.data.returnWeighInKg - params.data.returnWeighOutKg
      );

      return netto.toLocaleString("id-ID", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
  };

  const actionsRenderer = (params) => {
    return (
      <>
        {params.data && (
          <Box display="flex" justifyContent="center" alignItems="center">
            <IconButton
              size="small"
              onClick={() =>
                handleViewClick(
                  params.data.id,
                  params.data.progressStatus,
                  params.data.bonTripRef
                )
              }
            >
              <PlagiarismIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        )}
      </>
    );
  };

  const [columnDefs] = useState([
    {
      headerName: "ACTIONS",
      field: "id",
      width: 100,
      cellRenderer: actionsRenderer,
      sortable: false,
      resizable: false,
      filter: false,
      pinned: "left",
      lockPinned: true,
    },
    { headerName: "NO BONTRIP", field: "bonTripNo", hide: true },
    { headerName: "NOPOL", field: "transportVehiclePlateNo", maxWidth: 95 },
    { headerName: "NAMA SUPIR", field: "driverName", maxWidth: 130 },
    {
      headerName: "Status",
      field: "progressStatus",
      valueFormatter: statusFormatter,
      enableRowGroup: true,
      rowGroup: true,
      hide: true,
    },
    { headerName: "NO DO", field: "deliveryOrderNo", maxWidth: 115 },
    {
      headerName: "PRODUK",
      field: "productName",
      maxWidth: 90,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "WB-IN",
      field: "originWeighInKg",
      maxWidth: 90,
      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "WB-OUT",
      field: "originWeighOutKg",
      maxWidth: 90,
      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "NETTO",
      field: "id",
      maxWidth: 90,
      cellStyle: { textAlign: "right" },
      valueFormatter: originNettoFormatter,
    },
    {
      headerName: "RJCT-IN",
      field: "returnWeighInKg",
      maxWidth: 95,
      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "RJCT-OUT",
      field: "returnWeighOutKg",
      maxWidth: 95,
      cellStyle: { textAlign: "right" },
    },
    {
      headerName: "RJCT NETTO",
      field: "id",
      maxWidth: 110,
      cellStyle: { textAlign: "right" },
      valueFormatter: returnNettoFormatter,
    },
    {
      headerName: "TGL PENGAKUAN",
      field: "dtTransaction",
      maxWidth: 140,
      cellStyle: { textAlign: "center" },
      valueFormatter: dateFormatter,
    },
    {
      headerName: "WAKTU TRANSAKSI",
      field: "dtModified",
      maxWidth: 150,
      cellStyle: { textAlign: "center" },
      valueFormatter: datetimeFormatter,
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
      field: "bonTripNo",
      headerName: "STATUS",
      minWidth: "200",
      flex: 1,
    }),
    []
  );

  return (
    <Box>
      <Header
        title="TRANSAKSI MANUAL COMPLETE"
        subtitle="Transaksi Manual Entry Complete"
      />

      <Box display="flex" sx={{ mt: 3 }}>
        <Box flex={1}></Box>
        <Button
          variant="contained"
          sx={{ ml: 0.5 }}
          onClick={() => eDispatchMdispatch()}
        >
          Manual Submit All
        </Button>
        <Button
          variant="contained"
          sx={{ ml: 0.5 }}
          onClick={() => refetchDtTransaction()}
        >
          Reload
        </Button>
      </Box>

      <Paper sx={{ mt: 1, p: 2, minHeight: "77vh" }}>
        <Box
          className="ag-theme-balham"
          sx={{
            "& .ag-header-cell-label": { justifyContent: "center" },
            width: "auto",
            height: "75.5vh",
          }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={dtTransaction?.records} // Row Data for Rows
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
            left: "50%",
          }}
        />
      )}
    </Box>
  );
};

export default ReportTransactionPending;
