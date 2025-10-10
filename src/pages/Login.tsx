import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Container,
    TextField,
    Button,
    Card,
    Divider,
    Link as MuiLink
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import MainLayout from "../components/layout/MainLayout.tsx";
import {login} from "../api/auth-service.ts";

const Login: React.FC = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            console.error('Login and password required');
            return;
        }

        try {
            const loginData = await login(email, password);
            localStorage.setItem('token', loginData.token);
            console.log(loginData);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <MainLayout minimalist={true}>
            <Container maxWidth="xs" sx={{ py: 6 }}>
                <Card sx={{ p: 4, textAlign: 'center', boxShadow: 3 }}>
                    <Typography variant="h4" component="h1" gutterBottom fontWeight={500}>
                        Zaloguj się
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Witaj ponownie w E-COMMERCE
                    </Typography>

                    <Button
                        variant="outlined"
                        fullWidth
                        size="large"
                        sx={{ mb: 2, borderColor: '#ccc', color: 'text.primary' }}
                        startIcon={<GoogleIcon />}
                        onClick={() => console.log('Logowanie Google...')}
                    >
                        Zaloguj przez Google
                    </Button>

                    <Divider sx={{ my: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                            lub
                        </Typography>
                    </Divider>

                    <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Adres Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            variant="outlined"
                            size="small"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Hasło"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            variant="outlined"
                            size="small"
                            sx={{ mb: 3 }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mb: 2 }}
                        >
                            Zaloguj się
                        </Button>
                    </Box>

                    <MuiLink
                        component="button"
                        variant="body2"
                        onClick={() => navigate('/register')}
                        sx={{ cursor: 'pointer', mt: 1 }}
                    >
                        Nie masz konta? Zarejestruj się!
                    </MuiLink>
                </Card>
            </Container>
        </MainLayout>
    );
};

export default Login;
