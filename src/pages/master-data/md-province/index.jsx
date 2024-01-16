import { Box } from "@mui/material";

import Header from "../../../components/layout/signed/Header";
import DataTableMUI from "../../../components/DataTableMUI";

import { useProvince } from "../../../hooks";

const MDProvince = () => {
  const { useGetProvincesQuery } = useProvince();

  const { data: dataProvinces, error, isLoading, isFetching, isSuccess } = useGetProvincesQuery();

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1, cellClassName: "name-column--cell" },
    { field: "age", headerName: "Age", type: "number" },
  ];

  if (error) console.log("error:", error);
  else if (isLoading) console.log("status: loading");
  else if (isFetching) console.log("status: fetching");
  else if (isSuccess) console.log("Provinces:", dataProvinces);

  return (
    <Box m="20px">
      <Header title="PROVINCES" subtitle="Master Data Province" />

      <button>Add</button>
      {isSuccess && <DataTableMUI data={dataProvinces?.data?.province?.records} columns={columns} />}
    </Box>
  );
};

export default MDProvince;
