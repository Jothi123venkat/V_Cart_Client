import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Rating, TextField, Button, 
    List, ListItem, ListItemText, Divider, Paper,
    CircularProgress, Alert, Grid
} from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const ReviewSection = ({ productId, onReviewAdded }) => {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get('orderId');

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/products/${productId}/reviews`);
            setReviews(res.data);
        } catch (err) {
            console.error("Fetch reviews error", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('vcart_token');
            await axios.post(
                `${API_BASE_URL}/api/products/${productId}/reviews`,
                { rating, comment, name: user?.name, orderId },
                { headers: { 'x-auth-token': token } }
            );

            Swal.fire({
                icon: 'success',
                title: 'Review Submitted',
                text: 'Thank you for your feedback!',
                timer: 2000,
                showConfirmButton: false
            });

            setRating(0);
            setComment('');
            fetchReviews();
            if (onReviewAdded) onReviewAdded();
        } catch (err) {
            console.error("Submit review error", err);
            setError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ mt: 6 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                Customer Reviews
            </Typography>
            
            <Grid container spacing={4}>
                {/* Review Form */}
                <Grid item xs={12} md={5}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid #eee', borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Review this product
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Share your thoughts with other customers
                        </Typography>

                        {!isAuthenticated ? (
                            <Alert severity="info" sx={{ mb: 2 }}>
                                Please login to write a review
                            </Alert>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <Box sx={{ mb: 2 }}>
                                    <Typography component="legend">Rating</Typography>
                                    <Rating
                                        name="product-rating"
                                        value={rating}
                                        onChange={(event, newValue) => setRating(newValue)}
                                        size="large"
                                    />
                                </Box>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    label="Add a written review"
                                    placeholder="What did you like or dislike?"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    sx={{ mb: 2 }}
                                    required
                                />
                                {error && <Typography color="error" variant="caption" sx={{ mb: 1, display: 'block' }}>{error}</Typography>}
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    color="warning" 
                                    disabled={submitting}
                                    sx={{ borderRadius: 2, textTransform: 'none' }}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Review'}
                                </Button>
                            </form>
                        )}
                    </Paper>
                </Grid>

                {/* Reviews List */}
                <Grid item xs={12} md={7}>
                    {reviews.length === 0 ? (
                        <Typography variant="body1" color="text.secondary">
                            No reviews yet. Be the first to review this product!
                        </Typography>
                    ) : (
                        <List>
                            {reviews.map((review, index) => (
                                <Box key={review._id}>
                                    <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                                    <Rating value={review.rating} readOnly size="small" />
                                                    <Typography variant="subtitle2" sx={{ ml: 1, fontWeight: 'bold' }}>
                                                        {review.name}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={
                                                <>
                                                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                                                        Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.primary">
                                                        {review.comment}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    {index < reviews.length - 1 && <Divider component="li" />}
                                </Box>
                            ))}
                        </List>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default ReviewSection;
