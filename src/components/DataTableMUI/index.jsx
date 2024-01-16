import { Box, IconButton, Toolbar, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import { tokens } from "../../hooks/useTheme";

import FindInPageOutlinedIcon from "@mui/icons-material/FindInPageOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";

function DataTable(props) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { data, columns, viewHandler, editHandler, deleteHandler } = props;

  const actionsColumn = {
    field: "actions",
    headerName: "Actions",
    width: 150,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      return (
        <div>
          <IconButton onClick={() => viewHandler(params.row.id)} sx={{ color: theme.palette.neutral.dark }}>
            <DescriptionOutlinedIcon />
          </IconButton>
          <IconButton onClick={() => editHandler(params.row.id)} sx={{ color: theme.palette.neutral.dark }}>
            <EditNoteOutlinedIcon />
          </IconButton>
          <IconButton onClick={() => deleteHandler(params.row.id)} sx={{ color: theme.palette.neutral.dark }}>
            <DeleteForeverOutlinedIcon />
          </IconButton>
        </div>
      );
    },
  };

  return (
    <Box
      m="5px 0 0 0"
      height="75vh"
      sx={{
        "& .MuiDataGrid-root": {
          border: "none",
        },
        "& .MuiDataGrid-cell": {
          // borderBottom: "none",
        },
        "& .MuiDataGrid-columnHeaders": {
          borderBottom: "none",
          backgroundColor: theme.palette.neutral.dark,
          color: theme.palette.neutral.light,
        },
        "& .MuiDataGrid-virtualScroller": {
          // backgroundColor: colors.primary[500],
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
          backgroundColor: theme.palette.neutral.dark,
          color: theme.palette.neutral.light,
        },
        "& .MuiDataGrid-cellContent": {
          color: theme.palette.neutral.dark,
        },
        "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
          color: `${theme.palette.neutral.dark} !important`,
          // "flex-direction": "row-reverse",
        },

        "& .MuiDataGrid-toolbarContainer .MuiInput-root": {
          borderTopLeftRadius: "2px",
          borderTopRightRadius: "2px",
          color: `${theme.palette.neutral.dark} !important`,
          backgroundColor: theme.palette.neutral.medium,
        },
        "& .MuiDataGrid-main .MuiDataGrid-overlay": {
          color: `${theme.palette.neutral.dark} !important`,
        },

        "& .MuiTablePagination-root": {
          color: theme.palette.neutral.light,
        },
      }}
    >
      <DataGrid
        rows={data}
        columns={[...columns, actionsColumn]}
        slots={{ toolbar: GridToolbar }}
        slotProps={{ toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 500 } } }}
      />
    </Box>
  );
}

export default DataTable;
