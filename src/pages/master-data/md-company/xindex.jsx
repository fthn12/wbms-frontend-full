import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Tab from "@mui/material/Tab";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import { orange, blue, red, indigo, green } from "@mui/material/colors";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/DriveFileRenameOutline";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-enterprise";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import SyncIcon from "@mui/icons-material/Sync";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { ModuleRegistry } from "@ag-grid-community/core";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import CreateCompanies from "./createCompanies";
import EditCompanies from "./editCompanies";
import ViewCompanies from "./viewCompanies";
import Swal from "sweetalert2";
import { toast } from "react-toastify";


import { useConfig, useCompany } from "../../../hooks";

ModuleRegistry.registerModules([ClientSideRowModelModule, RangeSelectionModule, RowGroupingModule, RichSelectModule]);

const MDCompnay = () => {
  const { MD_SOURCE } = useConfig();

  const { useGetCompanyQuery, useEDispatchCompanySyncMutation, useDeleteCompanyMutation } = useCompany();

  const [deleteCompany] = useDeleteCompanyMutation();

  const { data: response, error, refetch } = useGetCompanyQuery();

  const [eDispatchSync, results] = useEDispatchCompanySyncMutation();

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
        deleteCompany(id)
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

  const [value, setValue] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (response?.data?.company?.records) {
      const filteredData = response?.data?.company?.records.filter((company) => {
        const companyData = Object.values(company).join(" ").toLowerCase();
        return companyData.includes(searchQuery.toLowerCase());
      });
      setFilteredData(filteredData);
    }
  }, [response, searchQuery]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [refetch]);

  const actionsRenderer = (params) => {
    const { refType } = params.data;

    const commonButtonProps = {
      width: "25%",
      display: "flex",
      m: "0 3px",
      borderRadius: "5px",
      padding: "8px 8px",
      justifyContent: "center",
      color: "white",
      textDecoration: "none",
      cursor: "pointer",
      fontSize: "20px",
    };

    const viewButton = (
      <Box
        {...commonButtonProps}
        bgcolor={indigo[700]}
        onClick={() => {
          setSelectedCompany(params.data);
          setIsViewOpen(true);
        }}
      >
        <VisibilityOutlinedIcon sx={{ fontSize: "16px" }} />
      </Box>
    );

    const editButton = (
      <Box
        {...commonButtonProps}
        bgcolor={orange[600]}
        onClick={() => {
          setSelectedCompany(params.data);
          setIsEditOpen(true);
        }}
      >
        <BorderColorOutlinedIcon sx={{ fontSize: "16px" }} />
      </Box>
    );

    const deleteButton = (
      <Box {...commonButtonProps} bgcolor={red[800]} onClick={() => deleteById(params.value, params.data.name)}>
        <DeleteOutlineOutlinedIcon sx={{ fontSize: "16px" }} />
      </Box>
    );

    return (
      <Box display="flex" justifyContent="center">
        {refType === 0 ? [viewButton, editButton, deleteButton] : [viewButton]}
      </Box>
    );
  };

  const columnDefsAll = [
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
    { field: "code", resizable: true, headerName: "Kode", maxWidth: 180, cellStyle: { textAlign: "center" } },
    { field: "name", headerName: "Nama", resizable: true, flex: 2, cellStyle: { textAlign: "center" } },
    { field: "shortName", resizable: true, headerName: "Nama Pendek", cellStyle: { textAlign: "center" } },
    { field: "description", resizable: true, headerName: "Deskripsi", flex: 2, cellStyle: { textAlign: "center" } },
    {
      field: "refType",
      headerName: "Source Data",
      cellStyle: { textAlign: "center" },
      sortable: true,
      valueFormatter: (params) => {
        const refType = params.value;
        if (refType === 0) {
          return "Data Wbms";
        } else if (refType === 1) {
          return "Data E-Dispatch";
        } else if (refType === 2) {
          return "Data E-Lhp";
        } else {
          return "";
        }
      },
    },
  ];

  const [columnDefs] = useState([
    {
      headerName: "No",
      field: "no",
      filter: true,
      sortable: true,
      resizable: true,
      maxWidth: 80,
      hide: false,
      cellStyle: { textAlign: "center" },
      valueGetter: (params) => params.node.rowIndex + 1,
    },
    { field: "code", resizable: true, headerName: "Kode", maxWidth: 180, cellStyle: { textAlign: "center" } },
    { field: "name", headerName: "Nama", resizable: true, flex: 2, cellStyle: { textAlign: "center" } },
    { field: "shortName", resizable: true, headerName: "Nama Pendek", cellStyle: { textAlign: "center" } },
    { field: "description", headerName: "Deskripsi", flex: 2, cellStyle: { textAlign: "center" } },
    {
      field: "id",
      headerName: "Actions",
      maxWidth: 150,
      cellRenderer: actionsRenderer,
      pinned: "right",
      lockPinned: true,
    },
  ]);

  return (
    <Box m="20px">
      <TabContext value={value}>
        <Paper
          elevation={1}
          sx={{
            mt: 2,
            pt: 1,
            width: "96%",
            marginLeft: "37px",
            borderTop: "5px solid #000",
            borderRadius: "10px 10px 0px 0px",
          }}
        >
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="all" value="" />
            <Tab label="wbms" value="0" />
            <Tab label="e-dispatch" value="1" />
            <Tab label="e-lhp" value="2" />
          </TabList>
        </Paper>
        <TabPanel value="">
          <Paper
            sx={{
              p: 3,
              mx: 1,
              borderRadius: "10px 10px 10px 10px",
              mb: 3,
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              <Box display="flex">
                <Typography variant="h3">Data Company</Typography>
                {/* <Box display="flex" ml="auto">
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
                </Box> */}
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
                rowData={filteredData} // Row Data for Rows
                columnDefs={columnDefsAll}
                // defaultColDef={defaultColDef} // Default Column Properties
                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
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
        </TabPanel>
        <TabPanel value="0">
          <Paper
            sx={{
              p: 3,
              mx: 1,
              borderRadius: "10px 10px 10px 10px",
              mb: 3,
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              <Box display="flex">
                <Typography variant="h3">Data Company Wbms</Typography>
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
                rowData={filteredData.filter((company) => company.refType === 0)} // Row Data for Rows
                columnDefs={columnDefs} // Column Defs for Columns
                // defaultColDef={defaultColDef} // Default Column Properties
                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
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
        </TabPanel>
        <TabPanel value="1">
          <Paper
            sx={{
              p: 3,
              mx: 1,
              borderRadius: "10px 10px 10px 10px",
              mb: 3,
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              <Box display="flex">
                <Typography variant="h3">Data Company E-Dispatch</Typography>
                <Box display="flex" ml="auto">
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "goldenrod",
                      fontSize: "12px",
                      padding: "7px 10px",
                      color: "white",
                    }}
                    onClick={() => eDispatchSync()}
                  >
                    <SyncIcon sx={{ mr: "5px", fontSize: "16px" }} />
                    Sync
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
                rowData={filteredData.filter((company) => company.refType === 1)} // Row Data for Rows
                columnDefs={columnDefs} // Column Defs for Columns
                // defaultColDef={defaultColDef} // Default Column Properties
                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
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
        </TabPanel>
        <TabPanel value="2">
          <Paper
            sx={{
              p: 3,
              mx: 1,
              borderRadius: "10px 10px 10px 10px",
              mb: 3,
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              <Box display="flex">
                <Typography variant="h3">Data Company E-LHP</Typography>
                <Box display="flex" ml="auto">
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: green[800],
                      fontSize: "12px",
                      padding: "7px 10px",
                      color: "white",
                    }}
                  >
                    <SyncIcon sx={{ mr: "5px", fontSize: "16px" }} />
                    Sync
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
                rowData={filteredData.filter((company) => company.refType === 2)} // Row Data for Rows
                columnDefs={columnDefs} // Column Defs for Columns
                // defaultColDef={defaultColDef} // Default Column Properties
                animateRows={true} // Optional - set to 'true' to have rows animate when sorted
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
        </TabPanel>
      </TabContext>
      {/* Create */}
      <CreateCompanies isOpen={isOpen} onClose={setIsOpen} />

      {/* edit */}
      <EditCompanies isEditOpen={isEditOpen} onClose={() => setIsEditOpen(false)} dtCompanies={selectedCompany} />

      {/* View */}
      <ViewCompanies isViewOpen={isViewOpen} onClose={() => setIsViewOpen(false)} dtCompanies={selectedCompany} />
    </Box>
  );
};

export default MDCompnay;
