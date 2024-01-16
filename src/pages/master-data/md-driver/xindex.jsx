import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Tab from "@mui/material/Tab";
import { TabList, TabPanel, TabContext } from "@mui/lab";
import { orange, blue, red, indigo, green } from "@mui/material/colors";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DriveFileRenameOutline from "@mui/icons-material/BorderColorOutlined";
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
import CreateDriver from "./createDriver";
import EditDriver from "./editDriver";
import ViewDriver from "./viewDriver";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useDriver, useCompany } from "../../../hooks";

ModuleRegistry.registerModules([ClientSideRowModelModule, RangeSelectionModule, RowGroupingModule, RichSelectModule]);

const MDdriver = () => {
  const { useGetDriverQuery, useEDispatchDriverSyncMutation, useDeleteDriverMutation } = useDriver();
  const { useGetCompanyQuery } = useCompany();
  const [deleteDriver] = useDeleteDriverMutation();

  const { data: response, error, refetch } = useGetDriverQuery();
  const { data: dtCompany } = useGetCompanyQuery();
  const [eDispatchSync, results] = useEDispatchDriverSyncMutation();

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
        deleteDriver(id)
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
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (response?.data?.driver?.records) {
      const filteredData = response?.data?.driver?.records.filter((driver) => {
        const driverData = Object.values(driver).join(" ").toLowerCase();
        return driverData.includes(searchQuery.toLowerCase());
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
          setSelectedDriver(params.data);
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
          setSelectedDriver(params.data);
          setIsEditOpen(true);
        }}
      >
        <DriveFileRenameOutline sx={{ fontSize: "16px" }} />
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
    {
      headerName: "Code",
      field: "code",
      filter: true,
      sortable: true,
      hide: false,
      resizable: true,
      cellStyle: { textAlign: "center" },
    },
    {
      field: "nik",
      sortable: true,
      headerName: "NPK",
      resizable: true,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "Nama",
      field: "name",
      sortable: true,
      flex: 1,
      hide: false,
      resizable: true,
      cellStyle: { textAlign: "center" },
    },

    {
      headerName: "Company",
      field: "companyName",
      filter: true,
      sortable: true,
      hide: false,
      flex: 1,
      resizable: true,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "License (SIM)",
      field: "licenseNo",
      filter: true,
      sortable: true,
      hide: false,
      resizable: true,
      cellStyle: { textAlign: "center" },
    },
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
      maxWidth: 80,
      hide: false,
      resizable: true,
      cellStyle: { textAlign: "center" },
      valueGetter: (params) => params.node.rowIndex + 1,
    },
    {
      headerName: "Code",
      field: "code",
      filter: true,
      sortable: true,
      hide: false,
      resizable: true,
      cellStyle: { textAlign: "center" },
    },
    {
      field: "nik",
      sortable: true,
      headerName: "NPK",
      resizable: true,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "Nama",
      field: "name",
      sortable: true,
      hide: false,
      flex: 1,
      resizable: true,
      cellStyle: { textAlign: "center" },
    },

    {
      headerName: "Company",
      field: "companyName",
      filter: true,
      sortable: true,
      hide: false,
      flex: 1,
      cellStyle: { textAlign: "center" },
    },
    {
      headerName: "License (SIM)",
      field: "licenseNo",
      filter: true,
      sortable: true,
      hide: false,
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
                <Typography variant="h3">Data Driver</Typography>
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
                <Typography variant="h3">Data Driver Wbms</Typography>
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
                rowData={filteredData.filter((driver) => driver.refType === 0)} // Row Data for Rows
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
                <Typography variant="h3">Data Driver E-Dispatch</Typography>
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
                rowData={filteredData.filter((driver) => driver.refType === 1)} // Row Data for Rows
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
                <Typography variant="h3">Data Driver E-LHP</Typography>
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
                rowData={filteredData.filter((driver) => driver.refType === 2)} // Row Data for Rows
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
      <CreateDriver isOpen={isOpen} onClose={setIsOpen} dtCompany={dtCompany?.data?.company?.records} />

      {/* edit */}
      <EditDriver
        isEditOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        dtCompanies={dtCompany?.data?.company?.records}
        dtDriver={selectedDriver}
      />

      {/* view */}
      <ViewDriver
        isViewOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        dtCompanies={dtCompany?.data?.company?.records}
        dtDriver={selectedDriver}
      />
    </Box>
  );
};

export default MDdriver;
