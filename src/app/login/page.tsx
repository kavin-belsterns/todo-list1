"use client";
import { signIn, useSession } from "next-auth/react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CssBaseline,
} from "@mui/material";
import { Grid2 as Grid } from "@mui/material";

interface IFormInput {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});



export default function Login() {
  const { data: session } = useSession(); // Access the current session

  const router = useRouter();
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.error) {
      setError(res.error);
    } 
  
     else {
      // if(session?.user.role==="USER")
      //   {
      //     router.replace("/home"); 
      //   }
      //   else
      //   {
      //     router.replace("/admin/home"); 
      //   }
      window.location.reload();

      //  router?.replace("/home");
     }
  };
 

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <AppBar
    position="absolute"
    color="primary"
    
  >
    <Toolbar>
      <Typography variant="h6" noWrap>
        Todo List
      </Typography>
    </Toolbar>
  </AppBar>
      
      <Box
        sx={{
          marginTop: 18,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ padding: "30px", width: "100%" }}>
          <Typography component="h1" variant="h5" align="center">
            Login
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
            <a style={{marginTop:12}} href="/register">Create New account?</a>

            <Box mt={3}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Login
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
