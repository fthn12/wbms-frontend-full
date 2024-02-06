import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
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
import { toast } from "react-toastify";
import * as moment from "moment";

import PlagiarismOutlinedIcon from "@mui/icons-material/PlagiarismOutlined";

import { TransactionAPI } from "../apis";

import { useConfig, useTransaction } from "../hooks";
import QRCodeViewer from "./QRCodeViewer";

ModuleRegistry.registerModules([ClientSideRowModelModule, RangeSelectionModule, RowGroupingModule, RichSelectModule]);

const TransactionGrid = (props) => {
  const navigate = useNavigate();

  const { WBMS, PROGRESS_STATUS } = useConfig();
  const { wbTransaction, setOpenedTransaction, useFindManyTransactionQuery } = useTransaction();

  const transactionAPI = TransactionAPI();

  const [isLoading, setIsLoading] = useState(false);

  // const [searchMany, results] = useSearchManyMutation();
  // Number.isNaN(+message.data) ? 0 : +message.data;
  // var now = new Date();
  // var WH = Number.isNaN(+WBMS.SITE_WORKING_HOUR) ? 0 : +WBMS.SITE_WORKING_HOUR;
  // var WM = Number.isNaN(+WBMS.SITE_WORKING_MINUTE) ? 0 : +WBMS.SITE_WORKING_MINUTE;

  // console.log("now:", now);
  // console.log("WH:", WH);
  // console.log("moment:", moment().format());
  // console.log("moment substract:", moment().subtract(1, "hours").format());
  // if (now.getHours() < WH) {
  //   console.log("less then");
  // } else if (now.getHours() === WH) {
  // } else {
  // }

  const transactionFilter = {
    where: {
      typeSite: WBMS.SITE_TYPE,
      OR: [
        { dtModified: { gte: moment().subtract(3, "hours").format() } },
        { progressStatus: { in: [1, 2, 6, 11, 35, 36, 37] } },
      ],
      NOT: {
        typeTransaction: 5,
      },
    },
    orderBy: [{ progressStatus: "asc" }, { bonTripNo: "desc" }],
  };
  const { data: results, refetch } = useFindManyTransactionQuery(transactionFilter);

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
          urlPath = "/wb/transactions/pks-edispatch-normal-out";
        } else if (progressStatus === 6) {
          urlPath = "/wb/transactions/pks-edispatch-cancel-in";
        } else if (progressStatus === 26) {
          urlPath = "/wb/transactions/pks-edispatch-cancel-out";
        } else if (progressStatus === 11 && bonTripRef) {
          urlPath = "/wb/transactions/pks-edispatch-reject-bulking-in";
        } else if (progressStatus === 11) {
          urlPath = "/wb/transactions/pks-edispatch-reject-t300-in";
        } else if (progressStatus === 31) {
          urlPath = "/wb/transactions/pks-edispatch-reject-out";
        } else if (progressStatus === 35) {
          urlPath = "/wb/transactions/pks/manual-entry-tbs-out";
        } else if (progressStatus === 36) {
          urlPath = "/wb/transactions/pks/manual-entry-kernel-out";
        } else if (progressStatus === 37) {
          urlPath = "/wb/transactions/pks/manual-entry-others-out";
        } else if (progressStatus === 40) {
          urlPath = "/wb/transactions/pks/manual-entry-tbs-view";
        } else if (progressStatus === 41) {
          urlPath = "/wb/transactions/pks/manual-entry-kernel-view";
        } else if (progressStatus === 42) {
          urlPath = "/wb/transactions/pks/manual-entry-other-view";
        } else if (progressStatus === 100) {
          urlPath = "/wb/transactions/t30-edispatch-deleted";
        } else {
          throw new Error("Progress Status tidak valid.");
        }
      } else if (WBMS.SITE_TYPE === 2) {
        if (progressStatus === 1) {
          urlPath = "/wb/transactions/t30-edispatch-normal-in";
        } else if (progressStatus === 21) {
          urlPath = "/wb/transactions/t30-edispatch-normal-out";
        } else if (progressStatus === 6) {
          urlPath = "/wb/transactions/t30-edispatch-cancel-in";
        } else if (progressStatus === 26) {
          urlPath = "/wb/transactions/t30-edispatch-cancel-out";
        } else if (progressStatus === 37) {
          urlPath = "/wb/transactions/t30/manual-entry-others-out";
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
          urlPath = "/wb/transactions/bulking-edispatch-out";
        } else if (progressStatus === 31) {
          urlPath = "/wb/transactions/bulking-edispatch-out";
        } else if (progressStatus === 37) {
          urlPath = "/wb/transactions/bulking/manual-entry-others-out";
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

  const actionsRenderer = (params) => {
    return (
      <>
        {params.data && (
          <Box display="flex" justifyContent="center" alignItems="center">
            <QRCodeViewer
              progressStatus={params.data.progressStatus}
              deliveryOrderId={params.data.deliveryOrderId}
              type="grid"
            />
            <IconButton
              size="small"
              onClick={() => handleViewClick(params.data.id, params.data.progressStatus, params.data.bonTripRef)}
            >
              <PlagiarismOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        )}
      </>
    );
  };

  const statusFormatter = (params) => {
    return PROGRESS_STATUS[params.value];
  };

  const dateFormatter = (params) => {
    if (params.data) return moment(params.value).format("DD MMM YYYY").toUpperCase();
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

      netto = Math.abs(params.data.originWeighInKg - params.data.originWeighOutKg);

      return netto.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  };

  const returnNettoFormatter = (params) => {
    if (params?.data) {
      let netto = 0;

      netto = Math.abs(params.data.returnWeighInKg - params.data.returnWeighOutKg);

      return netto.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
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
    { headerName: "NAMA SUPIR", field: "driverName", maxWidth: 130, cellStyle: { textAlign: "center" } },
    {
      headerName: "STATUS",
      field: "progressStatus",
      valueFormatter: statusFormatter,
      enableRowGroup: true,
      rowGroup: true,
      hide: true,
    },
    { headerName: "NO DO", field: "deliveryOrderNo", maxWidth: 115, cellStyle: { textAlign: "center" } },
    { headerName: "PRODUK", field: "productName", maxWidth: 140, cellStyle: { textAlign: "center" } },
    { headerName: "WB-IN", field: "originWeighInKg", maxWidth: 80, cellStyle: { textAlign: "right" } },
    { headerName: "WB-OUT", field: "originWeighOutKg", maxWidth: 90, cellStyle: { textAlign: "right" } },
    {
      headerName: "NETTO",
      field: "id",
      maxWidth: 90,
      cellStyle: { textAlign: "right" },
      valueFormatter: originNettoFormatter,
    },
    { headerName: "RJCT-IN", field: "returnWeighInKg", maxWidth: 95, cellStyle: { textAlign: "right" } },
    { headerName: "RJCT-OUT", field: "returnWeighOutKg", maxWidth: 95, cellStyle: { textAlign: "right" } },
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
      maxWidth: 130,
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
      // flex: 1,
    }),
    [],
  );

  useEffect(() => {
    return () => {
      // console.clear();
    };
  }, []);

  useEffect(() => {
    refetch();
  }, [wbTransaction]);

  return (
    <Box
      className="ag-theme-balham"
      sx={{ "& .ag-header-cell-label": { justifyContent: "center" }, width: "auto", height: "71.5vh" }}
    >
      <AgGridReact
        rowData={results?.records} // Row Data for Rows
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
        // rowHeight="33"
      />
    </Box>
  );
};

export default TransactionGrid;
