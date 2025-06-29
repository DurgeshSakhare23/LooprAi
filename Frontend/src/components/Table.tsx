// src/components/Table.tsx
import React, { useState } from 'react';
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel, TablePagination, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { Transaction } from '../types/Transaction';

interface Props {
  transactions: Transaction[];
}

const headCells = [
  { id: 'date', label: 'Date' },
  { id: 'amount', label: 'Amount' },
  { id: 'category', label: 'Category' },
  { id: 'status', label: 'Status' },
  { id: 'user_profile', label: 'User' },
];

type Order = 'asc' | 'desc';

const TransactionTable = ({ transactions }: Props) => {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>('date');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = [...transactions].sort((a, b) => {
    const valueA = a[orderBy as keyof Transaction];
    const valueB = b[orderBy as keyof Transaction];

    if (valueA < valueB) return order === 'asc' ? -1 : 1;
    if (valueA > valueB) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper
      component={motion.div}
      elevation={6}
      sx={{
        borderRadius: 4,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
        bgcolor: 'background.paper',
        mb: 3,
        transition: 'box-shadow 0.3s',
        '&:hover': {
          boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.18)',
        },
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
    >
      <Typography variant="h6" sx={{ p: 2, fontWeight: 700, color: 'primary.main' }}>
        Transactions
      </Typography>
      <TableContainer>
        <Table size="small" aria-label="transactions table">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell key={headCell.id} align="center" sx={{ fontWeight: 600, bgcolor: 'grey.100' }}>
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={() => handleSort(headCell.id)}
                  >
                    {headCell.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, idx) => (
              <TableRow
                key={row._id || idx}
                hover
                sx={{ transition: 'background 0.2s', cursor: 'pointer', '&:hover': { bgcolor: 'grey.100' } }}
              >
                <TableCell align="center">{row.date}</TableCell>
                <TableCell align="center">{row.amount}</TableCell>
                <TableCell align="center">{row.category}</TableCell>
                <TableCell align="center">{row.status}</TableCell>
                <TableCell align="center">{row.user_profile}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={transactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ bgcolor: 'background.paper' }}
      />
    </Paper>
  );
};

export default TransactionTable;
