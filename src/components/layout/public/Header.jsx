import { Typography, Box, useTheme, Paper } from "@mui/material";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();

  return (
    <Paper sx={{ display: "flex", p: 2, width: "100%" }}>
      <Box>
        <Typography variant="h2" color={theme.palette.neutral.dark} fontWeight="bold" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="h5" color={theme.palette.neutral.dark}>
          {subtitle}
        </Typography>
      </Box>
    </Paper>
  );
};

export default Header;
