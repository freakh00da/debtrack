import {useState} from 'react';
import {useRouter} from 'next/router';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {useAuth} from '../context/AuthContext';

const defaultTheme = createTheme();

const Login = () => {
  const router = useRouter();
  const {login} = useAuth();

  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    setData({...data, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        // Log in user with email and password
        const {email, password} = data;
        await login(email, password);

        // Redirect to home page or desired route
        router.push('/');
      } catch (error) {
        console.error('Error logging in:', error);
        // Handle error logging in (display error message, etc.)
      }
    }
  };

  const validateForm = () => {
    let errors = {};

    if (data.email.trim() === '') {
      errors.email = 'Email is required';
    }

    if (data.password === '') {
      errors.password = 'Password is required';
    }

    return errors;
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Log In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
            <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoFocus value={data.email} onChange={handleInputChange} error={errors.email ? true : false} helperText={errors.email} />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={data.password}
              onChange={handleInputChange}
              error={errors.password ? true : false}
              helperText={errors.password}
            />
            <Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}}>
              Log In
            </Button>
            <Button fullWidth onClick={handleSignup} color="primary">
              Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
