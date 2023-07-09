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
import {database} from '../config/firebase';
import {ref, set} from 'firebase/database';
import InputAdornment from '@mui/material/InputAdornment';
import {IconButton} from '@mui/material';
import {VisibilityOff} from '@mui/icons-material';
import {Visibility} from '@mui/icons-material';

const defaultTheme = createTheme();

const SignUp = () => {
  const router = useRouter();
  const {signup} = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

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
        // Create user with email and password
        const {email, password} = data;
        const {user} = await signup(email, password);

        // Add data to Realtime Database
        if (user) {
          const userData = {
            name: data.name,
            email: data.email,
            uid: user.uid,
          };
          await set(ref(database, `${user.uid}/credential`), userData);
        }

        // Redirect to login page
        router.push('/login');
      } catch (error) {
        console.error('Error creating user:', error);
      }
    }
  };

  const validateForm = () => {
    let errors = {};

    if (data.name.trim() === '') {
      errors.name = 'Name is required';
    }

    if (data.email.trim() === '') {
      errors.email = 'Email is required';
    }

    if (data.password === '') {
      errors.password = 'Password is required';
    }

    if (data.confirmPassword !== data.password) {
      errors.confirmPassword = "Passwords don't match";
    }

    return errors;
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
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
            <TextField margin="normal" required fullWidth id="name" label="Name" name="name" autoFocus value={data.name} onChange={handleInputChange} error={errors.name ? true : false} helperText={errors.name} />
            <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" value={data.email} onChange={handleInputChange} error={errors.email ? true : false} helperText={errors.email} />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={data.password}
              onChange={handleInputChange}
              error={errors.password ? true : false}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Re-enter Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={data.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword ? true : false}
              helperText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowConfirmPassword} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button type="submit" fullWidth variant="contained" sx={{mt: 3, mb: 2}}>
              Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default SignUp;
