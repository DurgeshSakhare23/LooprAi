// src/components/Chart.tsx
import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Transaction } from '../types/Transaction';
import dayjs from 'dayjs';
import { Card, CardContent, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { Button, FormControl, InputLabel, MenuItem, Select, Box, Switch, FormControlLabel } from '@mui/material';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

interface Props {
  transactions: Transaction[];
}

const Chart: React.FC<Props> = ({ transactions }) => {
  const theme = useTheme();

  // --- New State for Filters and Toggles ---
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showTrend, setShowTrend] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });

  // --- Extract unique categories ---
  const categories = Array.from(new Set(transactions.map(t => t.category))).filter(Boolean);

  // --- Filtered Transactions ---
  const filteredTransactions = transactions.filter(t => {
    const inCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const inDate = (!dateRange.start || new Date(t.date) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(t.date) <= new Date(dateRange.end));
    return inCategory && inDate;
  });

  const aggregated: Record<string, {
    date: string;
    revenue: number;
    expense: number;
    balance: number;
  }> = {};

  filteredTransactions.forEach((t) => {
    if (!t.date || isNaN(Date.parse(t.date))) {
      console.warn('Skipping invalid date:', t);
      return;
    }

    const key = dayjs(t.date).format('YYYY-MM');

    if (!aggregated[key]) {
      aggregated[key] = { date: key, revenue: 0, expense: 0, balance: 0 };
    }

    const category = t.category?.toLowerCase();

    if (category === 'revenue') {
      aggregated[key].revenue += t.amount;
    } else if (category === 'expense') {
      aggregated[key].expense += Math.abs(t.amount);
    }

    aggregated[key].balance =
      aggregated[key].revenue - aggregated[key].expense;
  });

  const chartData = Object.values(aggregated).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  // --- Export to Excel ---
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(chartData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'FinancialData');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'financial_data.xlsx');
  };

  return (
    <Card
      component={motion.div}
      elevation={6}
      sx={{
        borderRadius: 4,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        bgcolor: 'background.paper',
        p: 2,
        mb: 3,
        transition: 'box-shadow 0.3s',
        '&:hover': {
          boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.25)',
        },
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <CardContent>
        <Typography
          variant="subtitle1"
          sx={{
            mb: 2,
            fontWeight: 600,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            color: theme.palette.text.secondary,
          }}
        >
          Monthly Financial Overview
        </Typography>

        {/* --- Filter Controls --- */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              {categories.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel shrink>Date Start</InputLabel>
            <input
              type="date"
              value={dateRange.start}
              onChange={e => setDateRange(r => ({ ...r, start: e.target.value }))}
              style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </FormControl>
          <FormControl size="small">
            <InputLabel shrink>Date End</InputLabel>
            <input
              type="date"
              value={dateRange.end}
              onChange={e => setDateRange(r => ({ ...r, end: e.target.value }))}
              style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            />
          </FormControl>
          <FormControlLabel
            control={<Switch checked={showTrend} onChange={e => setShowTrend(e.target.checked)} />}
            label="Show Trend Line"
          />
          <Button variant="outlined" onClick={handleExportExcel}>Export Excel</Button>
        </Box>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" angle={-30} textAnchor="end" height={60} />
            <YAxis />
            <Tooltip contentStyle={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Line type="monotone" dataKey="revenue" stroke="#4caf50" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} name="Revenue" />
            <Line type="monotone" dataKey="expense" stroke="#f44336" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} name="Expense" />
            <Line type="monotone" dataKey="balance" stroke="#2196f3" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} name="Balance" />
            {showTrend && <Line type="linear" dataKey="balance" stroke="#8884d8" strokeDasharray="5 5" dot={false} name="Trend" />}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default Chart;
