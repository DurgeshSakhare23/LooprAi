import React from 'react';
import { Box, Typography } from '@mui/material';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  labels: string[];
  data: number[];
  type: 'bar' | 'pie';
  title?: string;
}

interface ChartMessageProps {
  chart: ChartData;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ChartMessage: React.FC<ChartMessageProps> = ({ chart }) => {
  if (!chart || !chart.type) return null;

  if (chart.type === 'bar') {
    const data = chart.labels.map((label: string, i: number) => ({ label, value: chart.data[i] }));
    return (
      <Box sx={{ my: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>{chart.title || 'Bar Chart'}</Typography>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  }
  if (chart.type === 'pie') {
    const data = chart.labels.map((label: string, i: number) => ({ name: label, value: chart.data[i] }));
    return (
      <Box sx={{ my: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>{chart.title || 'Pie Chart'}</Typography>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {data.map((entry: { name: string; value: number }, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    );
  }
  return null;
};

export default ChartMessage;
