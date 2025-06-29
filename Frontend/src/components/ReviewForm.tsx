import React, { useState } from 'react';
import { addReview } from '../services/reviews';
import { Box, Button, TextField, Typography, Rating, Stack, Alert } from '@mui/material';

const ReviewForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number | null>(5);
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!name || !role || !content || !rating) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    try {
      await addReview({ name, role, content, rating, avatar });
      setSuccess(true);
      setName('');
      setRole('');
      setContent('');
      setRating(5);
      setAvatar('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError('Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mb: 4, p: 3, background: 'rgba(255,255,255,0.95)', borderRadius: 3, boxShadow: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, textAlign: 'center' }}>Leave a Review</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Thank you for your review!</Alert>}
      <Stack spacing={2}>
        <TextField label="Name" value={name} onChange={e => setName(e.target.value)} fullWidth required />
        <TextField label="Role (e.g. Student, Business Owner)" value={role} onChange={e => setRole(e.target.value)} fullWidth required />
        <TextField label="Your Review" value={content} onChange={e => setContent(e.target.value)} fullWidth required multiline minRows={3} />
        <Rating value={rating} onChange={(_, v) => setRating(v)} max={5} />
        <TextField label="Avatar Initials (optional)" value={avatar} onChange={e => setAvatar(e.target.value)} fullWidth />
        <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </Stack>
    </Box>
  );
};

export default ReviewForm;
