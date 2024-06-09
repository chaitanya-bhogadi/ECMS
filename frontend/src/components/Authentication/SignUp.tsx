import * as React from 'react';
import { useEffect, useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, Paper, Box, Grid, Typography, Link, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../contexts/SnackbarContext';
import axiosInstance from '../Common/axios';

const defaultTheme = createTheme();

interface Errors {
    username: boolean;
    email: boolean;
    password: boolean;
    confirmPassword: boolean;
}

export default function SignUpSide() {
    const navigate = useNavigate();
    const { showMessage } = useSnackbar();

    const [errors, setErrors] = useState<Errors>({
        username: false,
        email: false,
        password: false,
        confirmPassword: false
    });

    useEffect(() => {
        const isAuth = localStorage.getItem("accessToken");
        if (isAuth) {
            navigate("/");
        }
    }, [navigate]);

    const validateEmail = (email: string): boolean => {
        return /\S+@\S+\.\S+/.test(email);
    };


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const username = data.get('username') as string;
        const email = data.get('email') as string;
        const password = data.get('password') as string;
        const confirmPassword = data.get('confirmPassword') as string;

        let hasError = false;
        let validationErrors: Errors = {
            username: !username,
            email: !validateEmail(email),
            password: password !== confirmPassword,
            confirmPassword: password !== confirmPassword
        };

        Object.values(validationErrors).forEach(error => {
            if (error) hasError = true;
        });

        setErrors(validationErrors);

        if (!hasError) {
            axiosInstance.post('/api/auth/signup/', {
                username,
                email,
                password
            }).then(() => {
                navigate('/login');
                showMessage('Signup successful', 'success');
            }).catch(() => {
                showMessage('Failed to signup please try again', 'error');
            });
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid item xs={false} sm={4} md={7} sx={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/static/login.svg)`,
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }} />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                error={errors.username}
                                helperText={errors.username ? 'Invalid username' : ''}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                error={errors.email}
                                helperText={errors.email ? 'Invalid email format' : ''}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                error={errors.password}
                                helperText={errors.password ? 'Passwords do not match' : ''}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                id="confirmPassword"
                                autoComplete="new-password"
                                error={errors.confirmPassword}
                                helperText={errors.confirmPassword ? 'Passwords do not match' : ''}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign Up
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link href="/login" variant="body2">
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}
