import React, { useState, useMemo } from 'react';
import { createTheme, ThemeProvider, CssBaseline, IconButton, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import DataTable from './components/DataTable';

const App: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  // Создаём тему на основе текущего режима
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  // Переключатель темы
  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 2 }}>
        <IconButton onClick={toggleTheme} color="inherit">
          {mode === 'light' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <DataTable />
      </Box>
    </ThemeProvider>
  );
};

export default App;
