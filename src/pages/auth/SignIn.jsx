import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, CircularProgress, Container, Grid, Paper, TextField } from "@mui/material";
import { toast } from "react-toastify";

import { FaUser, FaLock } from "react-icons/fa";

import { AuthAPI } from "../../apis";
import { useAuth } from "../../hooks";

const initialValues = { username: "", password: "" };

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const authAPI = AuthAPI();

  const { user, setCredentials } = useAuth();

  const [values, setValues] = useState(initialValues);
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || "/wb";

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await authAPI.Signin(values);

      setIsLoading(false);

      if (response?.status === false) return toast.error(`${response.message}..!!`);

      setCredentials({ ...response.data });

      navigate(from, { replace: true });
    } catch (error) {
      setIsLoading(false);
      toast.error(`${error.message}..!!`);
      // toast.error("Login failed.");
    }
  };

  const handleInputChange = (e) => {
    const { value, name } = e.target;

    setValues((prev) => {
      return { ...prev, [name]: value };
    });
  };

  useEffect(() => {
    // if (user) navigate("/wb");

    return () => {};
  }, [navigate, user]);

  return (
    <div>
      <Container maxWidth="sm">
        <Grid container spacing={2} direction="column" justifyContent="center" sx={{ height: "calc(100vh - 64px)" }}>
          <Paper elevation={2} sx={{ px: 5, pt: 2, pb: 4 }}>
            <form onSubmit={handleSubmit}>
              <h1>Sign In</h1>
              <p>Sign in to your account</p>
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <TextField
                    name="username"
                    type="text"
                    fullWidth
                    label="Username"
                    placeholder="Username"
                    variant="outlined"
                    autoComplete="username"
                    onChange={(e) => handleInputChange(e)}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    name="password"
                    type="password"
                    fullWidth
                    label="Password"
                    placeholder="Password"
                    variant="outlined"
                    onChange={(e) => handleInputChange(e)}
                  />
                  {isLoading && (
                    <CircularProgress
                      size={50}
                      sx={{
                        color: "goldenrod",
                        position: "absolute",
                        top: "52%",
                        left: "49%",
                        marginTop: "-12px",
                        marginLeft: "-12px",
                      }}
                    />
                  )}
                </Grid>
                <Grid item>
                  <Button type="submit" variant="contained" fullWidth>
                    Sign In
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Container>
    </div>
  );
};

export default SignIn;
