import React, { useState, useMemo, useEffect } from "react";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  IconButton,
  Box,
  TextField,
  Autocomplete,
} from "@mui/material";

import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import DataTable from "./components/DataTable";

const App: React.FC = () => {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [searchInput, setSearchInput] = useState<string>("");
  const [debouncedSearchInput, setDebouncedSearchInput] = useState<string>("");

  // Debounce: обновляем debouncedSearchInput через 1 секунду без изменений
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchInput(searchInput);
    }, 1000);
    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode },
        typography: { fontFamily: "Monrope, sans-serif" },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Autocomplete
            freeSolo
            options={[]} // Можно динамически заполнять, если потребуется
            value={searchInput}
            onInputChange={(_, newValue) => setSearchInput(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Поиск по названию"
                variant="outlined"
              />
            )}
            sx={{ width: "92%" }}
          />
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === "light" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          
        </Box>
        <DataTable searchTerm={debouncedSearchInput} />
      </Box>
    </ThemeProvider>
  );
};

export default App;
