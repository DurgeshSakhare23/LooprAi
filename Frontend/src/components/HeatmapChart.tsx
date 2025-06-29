import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Transaction } from '../types/Transaction';
import dayjs from 'dayjs';
import HeatMapGrid from 'react-heatmap-grid';

interface Props {
  transactions: Transaction[];
}

const HeatmapChart: React.FC<Props> = ({ transactions }) => {
  // Prepare data: days as rows, hours as columns
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const data: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));

  transactions.forEach(t => {
    const date = dayjs(t.date);
    const day = date.day();
    const hour = date.hour();
    if (day >= 0 && day < 7 && hour >= 0 && hour < 24) {
      data[day][hour] += Math.abs(t.amount);
    }
  });

  return (
    <Card sx={{ mb: 2, borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Spending Pattern Heatmap
        </Typography>
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <HeatMapGrid
            data={data}
            xLabels={hours}
            yLabels={days}
            xLabelsStyle={(index: number) => ({ color: '#888', fontSize: '0.7rem', transform: 'rotate(-45deg)' })}
            yLabelsStyle={(_index: number) => ({ color: '#888', fontSize: '0.8rem' })}
            cellStyle={(_x: number, _y: number, value: number) => ({
              background: `rgba(33, 150, 243, ${value ? Math.min(0.8, value / 500) : 0.05})`,
              fontSize: '0.7rem',
              color: value > 200 ? '#fff' : '#222',
              border: '1px solid #eee',
              minWidth: 24,
              minHeight: 24,
            })}
            cellRender={(_x: number, _y: number, value: number) =>
              typeof value === 'number' && !isNaN(value) && value !== 0 ? value.toFixed(0) : ''
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default HeatmapChart;
