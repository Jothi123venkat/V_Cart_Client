import React from 'react';
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Typography, Box, Container, Paper, Grid } from "@mui/material";

const Contactus = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    // Add API logic here
  };

  return (
    <Box sx={{ py: 10, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
            {/* Left Side: Contact Info */}
            <Grid item xs={12} md={5}>
                <Typography variant="overline" color="secondary" sx={{ letterSpacing: 2, fontWeight: 'bold' }}>
                    CONTACT US
                </Typography>
                <Typography variant="h2" sx={{ fontFamily: 'Playfair Display', mb: 3, fontWeight: 700, color: 'primary.main' }}>
                   Let's Discuss Your <br/> Next Project
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary', lineHeight: 1.8 }}>
                    Whether you are a professional courtier or a passionate hobbyist, we are here to assist you with the finest materials and tools.
                </Typography>
                
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" fontWeight="bold">Showroom</Typography>
                    <Typography variant="body2" color="text.secondary">123 Fashion Avenue, Design District, NY 10012</Typography>
                </Box>
                
                <Box>
                    <Typography variant="h6" fontWeight="bold">Email Us</Typography>
                    <Typography variant="body2" color="text.secondary">concierge@v-cart-tailoring.com</Typography>
                </Box>
            </Grid>

            {/* Right Side: Form */}
            <Grid item xs={12} md={7}>
                <Paper elevation={4} sx={{ p: 5, borderRadius: 2 }}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="name"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: "Name is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Name"
                                            fullWidth
                                            error={!!errors.name}
                                            helperText={errors.name?.message}
                                            variant="outlined"
                                            sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: 'secondary.main' } } }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="email"
                                    control={control}
                                    defaultValue=""
                                    rules={{ 
                                        required: "Email is required",
                                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Email"
                                            fullWidth
                                            error={!!errors.email}
                                            helperText={errors.email?.message}
                                            sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: 'secondary.main' } } }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name="subject"
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Subject"
                                            fullWidth
                                            sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: 'secondary.main' } } }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name="message"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: "Message is required" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Message"
                                            multiline
                                            rows={4}
                                            fullWidth
                                            error={!!errors.message}
                                            helperText={errors.message?.message}
                                            sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: 'secondary.main' } } }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    color="secondary" 
                                    size="large"
                                    fullWidth
                                    sx={{ color: 'white', py: 1.5 }}
                                >
                                    Send Message
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contactus;
