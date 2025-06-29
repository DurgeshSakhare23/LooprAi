// src/components/FilterBar.tsx
import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Transaction } from '../types/Transaction';
import { motion } from 'framer-motion';

interface Props {
  transactions: Transaction[];
  onFilter: (filtered: Transaction[]) => void;
}

const FilterBar = ({ transactions, onFilter }: Props) => {
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [user, setUser] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const applyFilter = () => {
    let filtered = [...transactions];

    if (category) filtered = filtered.filter((t) => t.category === category);
    if (status) filtered = filtered.filter((t) => t.status === status);
    if (user) filtered = filtered.filter((t) => t.user_profile.includes(user));
    if (minAmount) filtered = filtered.filter((t) => t.amount >= parseFloat(minAmount));
    if (maxAmount) filtered = filtered.filter((t) => t.amount <= parseFloat(maxAmount));
    if (startDate) filtered = filtered.filter((t) => new Date(t.date) >= new Date(startDate));
    if (endDate) filtered = filtered.filter((t) => new Date(t.date) <= new Date(endDate));

    onFilter(filtered);
  };

  const clearFilter = () => {
    setCategory('');
    setStatus('');
    setUser('');
    setMinAmount('');
    setMaxAmount('');
    setStartDate('');
    setEndDate('');
    onFilter(transactions);
  };

  return (
    <Card
      component={motion.div}
      elevation={4}
      sx={{
        mb: 3,
        borderRadius: 3,
        boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.10)',
        transition: 'box-shadow 0.3s',
        '&:hover': {
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        },
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
          Filter Transactions
        </Typography>
        <Stack spacing={2} direction="row" useFlexGap flexWrap="wrap">
          <TextField
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            select
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="revenue">Revenue</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
          </TextField>

          <TextField
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            select
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Paid">Paid</MenuItem>
          </TextField>

          <TextField
            label="User"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            sx={{ minWidth: 120 }}
          />

          <TextField
            label="Min Amount"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            type="number"
            sx={{ minWidth: 120 }}
          />

          <TextField
            label="Max Amount"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            type="number"
            sx={{ minWidth: 120 }}
          />

          <TextField
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            type="date"
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 140 }}
          />

          <TextField
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            type="date"
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 140 }}
          />

          <Button variant="contained" color="primary" onClick={applyFilter} sx={{ minWidth: 120, boxShadow: 2 }}>
            Apply
          </Button>
          <Button variant="outlined" color="secondary" onClick={clearFilter} sx={{ minWidth: 120 }}>
            Clear
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default FilterBar;
