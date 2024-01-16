import { Typography, Box, useTheme, Paper } from "@mui/material";

import ProgressStatusHeader from "../../ProgressStatusHeader";
import GetWeightWB from "../../GetWeightWB";
import QRCodeScanner from "../../QRCodeScanner";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();

  return (
    <Paper sx={{ display: "flex", p: 2, width: "100%" }}>
      <Box>
        <Typography variant="h2" fontWeight="bold" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="h5">{subtitle}</Typography>
      </Box>
      <Box flex={1} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      ></Box>
      <Box sx={{ ml: 1 }}>
        <ProgressStatusHeader />
      </Box>
      <Box sx={{ ml: 1 }}>
        <GetWeightWB />
      </Box>
      <Box sx={{ ml: 1 }}>
        <QRCodeScanner />
      </Box>
    </Paper>
  );
};

export default Header;
