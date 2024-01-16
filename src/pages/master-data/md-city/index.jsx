import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { orange, blue, red, indigo, green } from "@mui/material/colors";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-enterprise";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { ModuleRegistry } from "@ag-grid-community/core";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import CreateCity from "../md-city/createCity";
import EditCity from "../md-city/editCity";
import ViewCity from "../md-city/viewCity";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { useProvince, useCity } from "../../../hooks";

const MDCity = () => {
  const { useGetCitiesQuery, useDeleteCitiesMutation } = useCity();
  const { useGetProvincesQuery } = useProvince();
  const [deleteCities] = useDeleteCitiesMutation();

  const { data: dataProvinces } = useGetProvincesQuery();
  console.log(dataProvinces, "data provinsi");
  const { data: dataCities, error, isLoading, isFetching, isSuccess, refetch } = useGetCitiesQuery();

  const deleteById = (id, name) => {
    Swal.fire({
      title: `Yakin Ingin Menghapus?`,
      html: `<span style="font-weight: bold; font-size: 28px;">"${name}"</span>`,
      icon: "question",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: "#D80B0B",
      cancelButtonColor: "grey",
      cancelButtonText: "Cancel",
      confirmButtonText: "Hapus",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCities(id)
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
      }
    });
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const actionsRenderer = (params) => {
    return (
      <Box display="flex" justifyContent="center">
        <Box
          display="flex"
          m="0 3px"
          bgcolor={indigo[700]}
          borderRadius="5px"
          padding="8px 8px"
          justifyContent="center"
          color="white"
          style={{
            width: "25%",
            textDecoration: "none",
            cursor: "pointer",
          }}
          onClick={() => {
            setSelectedCity(params.data);
            setIsViewOpen(true);
          }}
        >
          <VisibilityOutlinedIcon sx={{ fontSize: "16px" }} />
        </Box>

        <Box
          display="flex"
          m="0 3px"
          bgcolor={orange[600]}
          borderRadius="5px"
          justifyContent="center"
          padding="8px 8px"
          color="white"
          style={{
            width: "25%",
            textDecoration: "none",
            cursor: "pointer",
          }}
          onClick={() => {
            setSelectedCity(params.data);
            setIsEditOpen(true);
          }}
        >
          <DriveFileRenameOutlineIcon sx={{ fontSize: "16px" }} />
        </Box>
        <Box
          display="flex"
          m="0 3px"
          bgcolor={red[800]}
          borderRadius="5px"
          padding="8px 8px"
          justifyContent="center"
          color="white"
          style={{
            width: "25%",
            color: "white",
            textDecoration: "none",
            cursor: "pointer",
          }}
          onClick={() => deleteById(params.value, params.data.name)}
        >
          <DeleteOutlineOutlinedIcon sx={{ fontSize: "16px" }} />
        </Box>
      </Box>
    );
  };

  const [columnDefs] = useState([
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
      headerName: "Nama",
      field: "name",
      filter: true,
      sortable: true,
      hide: false,
      flex: 3,
      cellStyle: { textAlign: "center" },
    },
    {
      field: "id",
      headerName: "Actions",
      maxWidth: 150,
      cellRenderer: actionsRenderer,
      pinned: "right",
      lockPinned: true,
    },
  ]);

  if (error) console.log("error:", error);
  else if (isLoading) console.log("status: loading");
  else if (isFetching) console.log("status: fetching");
  else if (isSuccess) console.log("Cities:", dataCities);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    // Pastikan dataProvinces sudah dimuat dengan benar
    if (dataCities?.data?.city?.records) {
      // Filter data berdasarkan searchQuery
      const filteredData = dataCities?.data?.city?.records.filter((city) =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredData(filteredData);
    }
  }, [dataCities, searchQuery]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [refetch]);

  return (
    <Box m="20px">
      <Paper
        sx={{
          p: 3,
          mx: 3,
          mb: 5,
          mt: 2,
          borderTop: "5px solid #000",
          borderRadius: "10px 10px 10px 10px",
        }}
      >
        <div style={{ marginBottom: "5px" }}>
          <Box display="flex">
            <Typography variant="h3">Data City</Typography>
            <Box display="flex" ml="auto">
              <Button
                variant="contained"
                sx={{
                  fontSize: "11px",
                  padding: "8px 8px",
                  fontWeight: "bold",
                  color: "white",
                  marginLeft: "8px",
                }}
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                <AddIcon sx={{ mr: "5px", fontSize: "16px" }} />
                Tambah Data
              </Button>
            </Box>
          </Box>
          <hr sx={{ width: "100%" }} />
          <Box display="flex" pb={1}>
            <Box display="flex" borderRadius="5px" ml="auto" border="solid grey 1px">
              <InputBase
                sx={{ ml: 2, flex: 2, fontSize: "13px" }}
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <IconButton type="button" sx={{ p: 1 }}>
                <SearchIcon sx={{ mr: "3px", fontSize: "19px" }} />
              </IconButton>
            </Box>
          </Box>
        </div>

        <Box
          className="ag-theme-alpine"
          sx={{ "& .ag-header-cell-label": { justifyContent: "center" }, width: "auto", height: "75vh" }}
        >
          <AgGridReact
            columnDefs={columnDefs}
            rowData={filteredData}
            animateRows={true} // Optional - set to 'true' to have rows animate when sorted
            // defaultColDef={defaultColDef}
            // rowSelection="multiple" // Options - allows click selection of rows
            // rowGroupPanelShow="always"
            enableRangeSelection="true"
            groupSelectsChildren="true"
            suppressRowClickSelection="true"
            // autoGroupColumnDef={autoGroupColumnDef}
            pagination="true"
            paginationAutoPageSize="true"
            groupDefaultExpanded="1"
            rowHeight="32"
          />
        </Box>
      </Paper>
      {/* Create */}
      <CreateCity isOpen={isOpen} onClose={setIsOpen} dtProvinces={dataProvinces?.data?.province?.records} />

      {/* edit */}
      <EditCity
        isEditOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        dtProvinces={dataProvinces?.data?.province?.records}
        dtCity={selectedCity}
      />

      {/* View */}
      <ViewCity
        isViewOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        dtProvinces={dataProvinces?.data?.province?.records}
        dtCity={selectedCity}
      />
    </Box>
  );
};

export default MDCity;
