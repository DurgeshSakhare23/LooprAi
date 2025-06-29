import React, { useState } from 'react';
import { Box, FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';

interface WidgetSelectorProps {
  widgets: { key: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

const WidgetSelector: React.FC<WidgetSelectorProps> = ({ widgets, selected, onChange }) => {
  const handleToggle = (key: string) => {
    if (selected.includes(key)) {
      onChange(selected.filter(k => k !== key));
    } else {
      onChange([...selected, key]);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>Customize Dashboard</Typography>
      <FormGroup row>
        {widgets.map(w => (
          <FormControlLabel
            key={w.key}
            control={<Checkbox checked={selected.includes(w.key)} onChange={() => handleToggle(w.key)} />}
            label={w.label}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default WidgetSelector;
