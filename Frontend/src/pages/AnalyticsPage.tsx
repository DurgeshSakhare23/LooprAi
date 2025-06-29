import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, CircularProgress, Divider } from '@mui/material';
import { Send as SendIcon, Chat as ChatIcon, BarChart as BarChartIcon } from '@mui/icons-material';
import api from '../services/api';
import ChartMessage from '../components/ChartMessage';
import { Transaction } from '../types/Transaction';

const AnalyticsPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [fetching, setFetching] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', text: input }]);
    setLoading(true);
    try {
      const res = await api.post('/ai/ask', { question: input });
      setMessages((prev) => [...prev, { role: 'ai', text: res.data.answer }]);
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: 'ai', text: 'AI error: ' + (err.message || 'Failed to get response') }]);
    }
    setInput('');
    setLoading(false);
  };

  const fetchAllTransactions = async () => {
    setFetching(true);
    try {
      const res = await api.get('/transactions/all');
      setUserTransactions(res.data as Transaction[]);
    } catch (err: any) {
      alert('Failed to fetch transactions: ' + (err.message || 'Unknown error'));
    }
    setFetching(false);
  };

  const renderAIMessage = (text: string) => {
    // Try to parse as chart JSON
    try {
      const chart = JSON.parse(text);
      if (chart && chart.type && chart.labels && chart.data) {
        return <ChartMessage chart={chart} />;
      }
    } catch (e) {}
    // Fallback to plain text
    return (
      <Typography
        sx={{
          display: 'inline-block',
          px: 2,
          py: 1,
          borderRadius: 2,
          background: 'grey.200',
          color: 'text.primary',
          fontWeight: 'normal',
          maxWidth: '80%',
          wordBreak: 'break-word',
        }}
      >
        {text}
      </Typography>
    );
  };

  return (
    <Container maxWidth="md" sx={{ pt: { xs: 10, md: 12 }, pb: 8 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <BarChartIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
        <Typography variant="h3" fontWeight="bold" color="primary.main">
          Analytics & AI Chat
        </Typography>
      </Box>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        Ask questions about your financial data, get insights, and chat with AI for analytics.
      </Typography>
      <Paper elevation={3} sx={{ p: 3, minHeight: 350, mb: 3, background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)' }}>
        <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 2 }}>
          {messages.length === 0 && (
            <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 8 }}>
              <ChatIcon sx={{ fontSize: 40, mb: 1, color: 'primary.light' }} />
              <br />Start a conversation with AI about your data!
            </Typography>
          )}
          {messages.map((msg, idx) => (
            <Box key={idx} sx={{ mb: 2, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
              {msg.role === 'ai' ? renderAIMessage(msg.text) : (
                <Typography
                  sx={{
                    display: 'inline-block',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    background: 'primary.main',
                    color: 'white',
                    fontWeight: 'bold',
                    maxWidth: '80%',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.text}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
        {loading && <CircularProgress size={28} sx={{ display: 'block', mx: 'auto', my: 2 }} />}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask AI about your data..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
            disabled={loading}
          />
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSend}
            disabled={loading || !input.trim()}
            sx={{ minWidth: 120 }}
          >
            Send
          </Button>
        </Box>
      </Paper>
      <Button
        variant="outlined"
        color="secondary"
        onClick={fetchAllTransactions}
        disabled={fetching}
        sx={{ mb: 2 }}
      >
        {fetching ? 'Fetching...' : 'Fetch All My Transactions'}
      </Button>
      {userTransactions.length > 0 && (
        <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>All My Transactions</Typography>
          <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
            {userTransactions.map((t, i) => (
              <Typography key={i} variant="body2">
                {t.category} - ₹{t.amount} on {new Date(t.date).toLocaleDateString()}
              </Typography>
            ))}
          </Box>
        </Paper>
      )}
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        <b>Note:</b> This is a demo AI chat. Integrate with your backend and fetches only last 12 transactions for now.
      </Typography>
    </Container>
  );
};

export default AnalyticsPage;