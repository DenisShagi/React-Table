import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Box,
} from "@mui/material";
import Preloader from "./Preloader"; // убедитесь, что путь корректный
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

interface PosItem {
  name: string;
  in_id: number;
  in_name: string;
  in_flow: boolean | number | string | null;
  out_id: number;
  out_name: string;
  out_flow: boolean | number | string | null;
  rem_id: number;
  rem_name: string;
  rem_flow: boolean | number | string | null;
}

interface WidgetData {
  widget: number;
  pos: PosItem[];
  date: string;
}

interface DataTableProps {
  searchTerm: string;
}

const DataTable: React.FC<DataTableProps> = ({ searchTerm }) => {
  const [widgetData, setWidgetData] = useState<WidgetData | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [editRowIndex, setEditRowIndex] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<
    Partial<Record<"in_flow" | "out_flow" | "rem_flow", string>>
  >({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Минимальная задержка 2 секунды для показа preloader
    const delay = new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      const [response] = await Promise.all([
        axios.get<WidgetData>("http://172.16.3.40:8083/api/widget/408/init"),
        delay,
      ]);
      setWidgetData(response.data);
      setError(false);
    } catch (err) {
      console.error("Ошибка получения данных:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const displayFlow = (flow: boolean | number | string | null) => {
    return flow === false ? "false" : flow;
  };

  const handleEditClick = (index: number) => {
    if (!widgetData) return;
    setEditRowIndex(index);
    const row = widgetData.pos[index];
    setEditFormData({
      in_flow:
        row.in_flow != null && row.in_flow !== false
          ? row.in_flow.toString()
          : "",
      out_flow:
        row.out_flow != null && row.out_flow !== false
          ? row.out_flow.toString()
          : "",
      rem_flow:
        row.rem_flow != null && row.rem_flow !== false
          ? row.rem_flow.toString()
          : "",
    });
  };

  const handleCancelClick = () => {
    setEditRowIndex(null);
    setEditFormData({});
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (/^\d*\.?\d*$/.test(value)) {
      setEditFormData({
        ...editFormData,
        [name]: value,
      });
    }
  };

  const handleSaveClick = async () => {
    if (editRowIndex === null || !widgetData) return;
    const updatedRow: PosItem = {
      ...widgetData.pos[editRowIndex],
      in_flow: editFormData.in_flow === "" ? "" : Number(editFormData.in_flow),
      out_flow:
        editFormData.out_flow === "" ? "" : Number(editFormData.out_flow),
      rem_flow:
        editFormData.rem_flow === "" ? "" : Number(editFormData.rem_flow),
    };
    try {
      await axios.put(
        `http://172.16.3.40:8083/api/widget/408/init/${editRowIndex}`,
        updatedRow
      );
      const newWidgetData = { ...widgetData };
      newWidgetData.pos[editRowIndex] = updatedRow;
      setWidgetData(newWidgetData);
      setEditRowIndex(null);
      setEditFormData({});
    } catch (error) {
      console.error("Ошибка обновления данных:", error);
    }
  };

  const filteredPos =
    widgetData?.pos.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <TableContainer component={Paper}>
      {loading ? (
        <Preloader />
      ) : error ? (
        <div style={{ padding: "16px", textAlign: "center" }}>404</div>
      ) : widgetData && widgetData.pos ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ py: "14px" }}>Название</TableCell>
              <TableCell>Остаток на складу</TableCell>
              <TableCell>Направлено на склад</TableCell>
              <TableCell>Отгрузка потребителям</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPos.map((item) => {
              const originalIndex = widgetData.pos.findIndex(
                (pos) => pos.name === item.name
              );
              return (
                <TableRow key={originalIndex}>
                  <TableCell sx={{ py: "30px" }}>{item.name}</TableCell>
                  <TableCell>
                    {editRowIndex === originalIndex ? (
                      <TextField
                        name="in_flow"
                        type="text"
                        value={editFormData.in_flow || ""}
                        onChange={handleInputChange}
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        sx={{ width: 120 }}
                        size="small"
                      />
                    ) : (
                      displayFlow(item.in_flow)
                    )}
                  </TableCell>
                  <TableCell>
                    {editRowIndex === originalIndex ? (
                      <TextField
                        name="out_flow"
                        type="text"
                        value={editFormData.out_flow || ""}
                        onChange={handleInputChange}
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        sx={{ width: 120 }}
                        size="small"
                      />
                    ) : (
                      displayFlow(item.out_flow)
                    )}
                  </TableCell>
                  <TableCell>
                    {editRowIndex === originalIndex ? (
                      <TextField
                        name="rem_flow"
                        type="text"
                        value={editFormData.rem_flow || ""}
                        onChange={handleInputChange}
                        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                        sx={{ width: 120 }}
                        size="small"
                      />
                    ) : (
                      displayFlow(item.rem_flow)
                    )}
                  </TableCell>
                  <TableCell sx={{ width: 100, textAlign: "center" }}>
                    <Box
                      sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                    >
                      {editRowIndex === originalIndex ? (
                        <>
                          <IconButton
                            onClick={handleCancelClick}
                            color="secondary"
                            sx={{ width: 40, height: 40 }}
                          >
                            <CancelIcon />
                          </IconButton>
                          <IconButton
                            onClick={handleSaveClick}
                            color="primary"
                            sx={{ width: 40, height: 40 }}
                          >
                            <SaveIcon />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton
                            onClick={() => handleEditClick(originalIndex)}
                            sx={{ width: 40, height: 40 }}
                          >
                            <EditIcon />
                          </IconButton>
                          {/* Добавляем невидимый placeholder, чтобы сохранить ширину */}
                          <Box
                            sx={{ width: 40, height: 40, visibility: "hidden" }}
                          />
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div style={{ padding: "16px", textAlign: "center" }}>Нет данных</div>
      )}
    </TableContainer>
  );
};

export default DataTable;
