import React, { useEffect, useState } from 'react';
import { fetchReviews, Review } from '../services/reviews';
import { Card, CardContent, Typography, Avatar, Box, Grid, Rating, CircularProgress } from '@mui/material';

const ReviewSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews().then(data => {
      setReviews(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748', mb: 3, textAlign: 'center' }}>
        What Our Users Say
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {reviews.map((review) => (
          <Grid item xs={12} sm={6} md={4} key={review._id}>
            <Card sx={{ p: 2, borderRadius: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', minHeight: 200 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: '#667eea', color: 'white', fontWeight: 700, mx: 'auto', mb: 1 }} src={review.avatar && review.avatar.startsWith('data:') ? review.avatar : undefined}>
                  {(!review.avatar || !review.avatar.startsWith('data:')) ? (review.avatar || review.name[0]) : ''}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{review.name}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>{review.role}</Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.6, mb: 1 }}>
                  "{review.content}"
                </Typography>
                <Rating value={review.rating} readOnly max={5} sx={{ color: '#ffd700' }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ReviewSection;
