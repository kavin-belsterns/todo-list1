"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CssBaseline,
} from "@mui/material";
import { Grid2 as Grid } from "@mui/material";
import axios from 'axios'; // Import axios
import { signIn } from "next-auth/react"; // Import NextAuth signIn

interface IFormInput {
  email: string;
  password: string;
  name: string;
}

// Define a validation schema using Yup
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  name: yup.string().required("Name is required"),
});

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  // useForm from react-hook-form, with Yup for validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  // Handle form submission
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      // Post the data to the register API endpoint
      const response = await axios.post("/api/register", data);
      
      // If registration is successful, use signIn to log in the user via NextAuth credentials provider
      if (response.status === 201) {
        const signInResponse = await signIn("credentials", {
          redirect: false, // Do not redirect automatically
          email: data.email,
          password: data.password,
        });

        // If signIn is successful, redirect to the homepage
        if (!signInResponse?.error) {
          router.push("/home"); // Redirect to homepage on success
        } else {
          setError(signInResponse.error); // Display error if signIn failed
          
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Set error message from API response
        setError(error.response?.data.message || "Something went wrong");
      } else {
        setError("Failed to register");
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ padding: "30px", width: "100%" }}>
          <Typography component="h1" variant="h5" align="center">
            Register
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  sx={{ paddingTop: "30px" }}
                  fullWidth
                  placeholder="Email"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  variant="outlined"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  placeholder="Name"
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  variant="outlined"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  variant="outlined"
                />
              </Grid>
              {error && (
                <Grid size={{ xs: 12 }}>
                  <Typography color="error" align="center">
                    {error}
                  </Typography>
                </Grid>
              )}
            </Grid>
            <Box mt={3}>
              <Button type="submit" fullWidth variant="contained" color="primary">
                Register
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
