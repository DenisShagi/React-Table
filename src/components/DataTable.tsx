import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

// Интерфейс для одной позиции (элемента массива pos)
interface PosItem {
  name: string;
  in_id: number;
  in_name: string;
  in_flow: boolean | number;
  out_id: number;
  out_name: string;
  out_flow: boolean | number;
  rem_id: number;
  rem_name: string;
  rem_flow: boolean | number;
}

// Интерфейс для объекта, возвращаемого API
interface WidgetData {
  widget: number;
  pos: PosItem[];
  date: string;
}

const DataTable: React.FC = () => {
  const [widgetData, setWidgetData] = useState<WidgetData | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get<WidgetData>('http://172.16.3.40:8083/api/widget/408/init');
      setWidgetData(response.data);
    } catch (error) {
      console.error('Ошибка получения данных:', error);
    }
  };

  // Если значение потока равно false, возвращаем строку "false", иначе само значение
  const displayFlow = (flow: boolean | number) => {
    return flow === false ? 'false' : flow;
  };

  return (
    // Реализовать компнонент Datepicker
    // Реализовать компонент для редактирования 
    // Реализовать возможность выбора дат
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Название</TableCell>
            <TableCell>Остаток на складу</TableCell>
            <TableCell>Направлено на склад</TableCell>
            <TableCell>Отгрузка потребителям</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {widgetData?.pos.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{displayFlow(item.in_flow)}</TableCell>
              <TableCell>{displayFlow(item.out_flow)}</TableCell>
              <TableCell>{displayFlow(item.rem_flow)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
