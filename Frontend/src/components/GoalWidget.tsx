import React, { useState } from 'react';
import { Card, CardContent, Typography, LinearProgress, Box, Button, TextField } from '@mui/material';

const GoalWidget: React.FC = () => {
  const [goal, setGoal] = useState<number>(10000);
  const [current, setCurrent] = useState<number>(0);
  const [input, setInput] = useState<string>('');

  const handleAdd = () => {
    const val = parseFloat(input);
    if (!isNaN(val)) {
      setCurrent(c => c + val);
      setInput('');
    }
  };

  const progress = Math.min((current / goal) * 100, 100);

  return (
    <Card sx={{ mb: 2, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Savings Goal
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            Goal:
          </Typography>
          <TextField
            size="small"
            type="number"
            value={goal}
            onChange={e => setGoal(Number(e.target.value))}
            sx={{ width: 100 }}
          />
        </Box>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5, mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          {`Saved: $${current} / $${goal}`}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <TextField
            size="small"
            type="number"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Add amount"
            sx={{ width: 120 }}
          />
          <Button variant="contained" onClick={handleAdd} disabled={!input}>
            Add
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GoalWidget;
