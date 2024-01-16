import { useMemo, useState } from "react";
import { Box, Button, CircularProgress, IconButton, Paper } from "@mui/material";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-enterprise";
import { toast } from "react-toastify";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { ModuleRegistry } from "@ag-grid-community/core";
import CreateProducts from "./createProduct";
import EditProducts from "./editProduct";
import PlagiarismOutlinedIcon from "@mui/icons-material/PlagiarismOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import Header from "../../../components/layout/signed/Header";

import { useConfig, useProduct } from "../../../hooks";

ModuleRegistry.registerModules([ClientSideRowModelModule, RangeSelectionModule, RowGroupingModule, RichSelectModule]);

const MDSite = () => {
  const { MD_SOURCE } = useConfig();
  const { useGetProductsQuery, useEDispatchProductSyncMutation, useDeleteProductMutation } = useProduct();

  const { deleteProduct } = useDeleteProductMutation();
  const { data, error, refetch } = useGetProductsQuery();
  const [eDispatchSync, { isLoading }] = useEDispatchProductSyncMutation();

  const deleteById = (id, name) => {
    try {
      const userConfirmed = window.confirm(`Anda yakin ingin menghapus data ${name}?`);

      if (userConfirmed) {
        deleteProduct(id)
          .then((res) => {
            console.log("Data berhasil dihapus:", res.data);
            toast.success("Data berhasil dihapus"); // Tampilkan toast sukses
            // Lakukan tindakan tambahan atau perbarui state sesuai kebutuhan
          })
          .catch((error) => {
            console.error("Data Gagal dihapus:", error);
            toast.error("Data Gagal dihapus"); // Tampilkan toast error
            // Tangani error atau tampilkan pesan error
          });
      } else {
        console.log("Penghapusan dibatalkan oleh pengguna");
        // Lakukan sesuatu jika pengguna membatalkan penghapusan
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      // Tangani error atau tampilkan pesan error jika ada kesalahan
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const actionsRenderer = (params) => {
    return (
      <>
        {params.data && params.data.refType === 0 && (
          <Box display="flex" justifyContent="center" alignItems="center">
            <IconButton
              size="small"
              onClick={() => {
                setSelectedProduct(params.data);
                setIsEditOpen(true);
              }}
            >
              <PlagiarismOutlinedIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <IconButton size="small" onClick={() => deleteById(params.value, params.data.name)}>
              <DeleteForeverOutlinedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        )}
      </>
    );
  };

  const sourceFormatter = (params) => {
    return MD_SOURCE[params.value];
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
    { field: "code", headerName: "Kode", maxWidth: 150, cellStyle: { textAlign: "center" } },
    { field: "codeSap", headerName: "Kode SAP", maxWidth: 150, cellStyle: { textAlign: "center" } },
    {
      field: "productGroupName",
      headerName: "Grup Produk",
      cellStyle: { textAlign: "center" },
    },
    { field: "shortName", headerName: "Nama Pendek", cellStyle: { textAlign: "center" } },

    { field: "description", headerName: "Deskripsi", flex: 1, cellStyle: { textAlign: "center" } },
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
      <Header title="PRODUCTS" subtitle="Master Data Produk" />

      <Box display="flex" sx={{ mt: 3 }}>
        <Box flex={1}></Box>
        <Button
          variant="contained"
          onClick={() => {
            setIsOpen(true);
          }}
        >
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
      {/* Create */}
      <CreateProducts isOpen={isOpen} onClose={setIsOpen} refetch={refetch} />

      {/* edit */}
      <EditProducts
        isEditOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        dtProducts={selectedProduct}
        refetch={refetch}
      />
    </Box>
  );
};

export default MDSite;
