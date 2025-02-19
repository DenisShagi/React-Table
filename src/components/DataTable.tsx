import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from 'date-fns';

interface RowData {
  row_id: number;
  initial_value: number;
  expense: number;
  remainder: number;
  change_time: string; // формат: "2025-02-01 00:00:00"
}

const DataTable: React.FC = () => {
  const [data, setData] = useState<RowData[]>([]);
  const [editRowId, setEditRowId] = useState<number | null>(null);
  // Храним значения формы как строки, чтобы инпуты корректно отображали текст
  const [editFormData, setEditFormData] = useState<Partial<Record<keyof RowData, string>>>({});
  // Состояние выбранной даты (по умолчанию 2025-02-01)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date("2025-02-01"));

  // При изменении выбранной даты вызываем API для получения данных за этот день
  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    try {
      const response = await axios.get<RowData[]>(`http://localhost:3001/api/manual/value/${formattedDate}`);
      setData(response.data);
    } catch (error) {
      console.error('Ошибка получения данных:', error);
    }
  };

  // Начало редактирования строки
  const handleEditClick = (row: RowData) => {
    setEditRowId(row.row_id);
    setEditFormData({
      initial_value: row.initial_value?.toString() || '',
      expense: row.expense?.toString() || '',
      remainder: row.remainder?.toString() || '',
      change_time: row.change_time,
    });
  };

  // Отмена редактирования
  const handleCancelClick = () => {
    setEditRowId(null);
    setEditFormData({});
  };

  // Обновление полей формы
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Сохранение изменений: преобразование строк в числа и отправка PUT-запроса
  const handleSaveClick = async () => {
    if (!editRowId) return;
    try {
      const updatedData = {
        ...editFormData,
        initial_value: Number(editFormData.initial_value),
        expense: Number(editFormData.expense),
        remainder: Number(editFormData.remainder),
      };
      await axios.put(`http://localhost:3001/api/manual/value/${editRowId}`, updatedData);
      setData(prevData =>
        prevData.map(row =>
          row.row_id === editRowId ? { ...row, ...updatedData } as RowData : row
        )
      );
      setEditRowId(null);
      setEditFormData({});
    } catch (error) {
      console.error('Ошибка сохранения данных:', error);
    }
  };

  // Функция для форматирования числовых значений (без десятичных)
  const formatValue = (value: any) => {
    return value != null ? Number(value).toFixed(0) : '';
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          {/* Первая строка: календарь для выбора даты */}
          <TableRow>
            <TableCell colSpan={5}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Выберите дату"
                  value={selectedDate}
                  onChange={(newValue) => {
                    if (newValue) setSelectedDate(newValue);
                  }}
                  slotProps={{ textField: { variant: 'outlined' } }}
                />
              </LocalizationProvider>
            </TableCell>
          </TableRow>
          {/* Вторая строка: заголовки колонок */}
          <TableRow>
            <TableCell>№</TableCell>
            <TableCell>Initial Value</TableCell>
            <TableCell>Expense</TableCell>
            <TableCell>Remainder</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={row.row_id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {editRowId === row.row_id ? (
                  <TextField
                    name="initial_value"
                    type="text"
                    value={editFormData.initial_value ?? ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  formatValue(row.initial_value)
                )}
              </TableCell>
              <TableCell>
                {editRowId === row.row_id ? (
                  <TextField
                    name="expense"
                    type="text"
                    value={editFormData.expense ?? ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  formatValue(row.expense)
                )}
              </TableCell>
              <TableCell>
                {editRowId === row.row_id ? (
                  <TextField
                    name="remainder"
                    type="text"
                    value={editFormData.remainder ?? ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  formatValue(row.remainder)
                )}
              </TableCell>
              <TableCell>
                {editRowId === row.row_id ? (
                  <>
                    <IconButton onClick={handleSaveClick} color="primary">
                      <SaveIcon />
                    </IconButton>
                    <IconButton onClick={handleCancelClick} color="secondary">
                      <CancelIcon />
                    </IconButton>
                  </>
                ) : (
                  <IconButton onClick={() => handleEditClick(row)}>
                    <EditIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
