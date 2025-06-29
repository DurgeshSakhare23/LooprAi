// src/components/ExportModal.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  FormGroup,
} from '@mui/material';
import { Transaction } from '../types/Transaction';
import api from '../services/api';
import { motion } from 'framer-motion';

interface Props {
  open: boolean;
  onClose: () => void;
  data: Transaction[];
}

const allFields = [
  { id: 'date', label: 'Date' },
  { id: 'amount', label: 'Amount' },
  { id: 'category', label: 'Category' },
  { id: 'status', label: 'Status' },
  { id: 'user_profile', label: 'User' },
];

const ExportModal = ({ open, onClose, data }: Props) => {
  const [selectedFields, setSelectedFields] = useState<string[]>(
    allFields.map((f) => f.id)
  );

  const toggleField = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field)
        ? prev.filter((f) => f !== field)
        : [...prev, field]
    );
  };

  const handleExport = async () => {
    try {
      const response = await api.post(
        '/api/transactions/export',
        {
          fields: selectedFields,
          transactionIds: data.map((d) => d._id),
        },
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      onClose();
    } catch (error) {
      alert('Failed to export CSV.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3 },
        sx: {
          borderRadius: 4,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, color: 'primary.main', textAlign: 'center' }}>
        Export Transactions
      </DialogTitle>
      <DialogContent>
        <FormGroup>
          {allFields.map((field) => (
            <FormControlLabel
              key={field.id}
              control={
                <Checkbox
                  checked={selectedFields.includes(field.id)}
                  onChange={() => toggleField(field.id)}
                  color="primary"
                />
              }
              label={field.label}
            />
          ))}
        </FormGroup>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button onClick={onClose} color="secondary" variant="outlined" sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button onClick={handleExport} color="primary" variant="contained" sx={{ boxShadow: 2 }}>
          Export
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportModal;
