import {
  Button,
  CircularProgress,
  Fade,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@material-ui/core";
// logo
// import logo from "./logo.svg";
// styles
import axios from "axios";
import classnames from "classnames";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import {
  disconnectSocket,
  initiateSocketConnection,
  subscribeToNotifications,
} from "../../config/socket";
// context
import { loginUser, useUserDispatch } from "../../context/UserContext";
import google from "../../images/google.svg";
import logo from "../../images/logo.png";
import useStyles from "./styles";

const api = axios.create({
  baseURL: process.env.REACT_APP_REST_API_LOCATION,
});

function Login(props) {
  var classes = useStyles();

  // global
  var userDispatch = useUserDispatch();

  useEffect(() => {
    initiateSocketConnection();
    console.log("init");
    subscribeToNotifications((err, data) => {
      console.log("data", data);
      checkMyPresta(data);
    });
    return () => {
      disconnectSocket();
    };
  }, [subscribeToNotifications]);

  function checkMyPresta(details) {
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNjI2MjQ0MTk2LCJleHAiOjE2Mjg4MzYxOTZ9.sohQGDOpa7kkz8RmvznXDZnJcfS8ouCIQgJtu5tSF48`,
      },
    };

    api
      .get(
        `/check-prestations/${details.categorie_id}/${details.categorie_type_id}/18?latitude=${details.latitude_position_user}&longitude=${details.longitude_position_user}&idUser=${details.from}&idRequest=${details.idRequest}`,
        headers,
      )
      .then((res) => {
        console.log("if resulat", res);
      })
      .catch((error) => {
        console.log("Error");
      });
  }
  // local
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);
  var [activeTabId, setActiveTabId] = useState(0);
  var [nameValue, setNameValue] = useState("");
  var [loginValue, setLoginValue] = useState("");
  var [passwordValue, setPasswordValue] = useState("");

  function generateGreetings() {
    var currentHour = moment().format("HH");

    if (currentHour >= 3 && currentHour < 12) {
      return "Good Morning";
    } else if (currentHour >= 12 && currentHour < 15) {
      return "Good Afternoon";
    } else if (currentHour >= 15 && currentHour < 20) {
      return "Good Evening";
    } else if (currentHour >= 20 && currentHour < 3) {
      return "Good Night";
    } else {
      return "Hello";
    }
  }
  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
        <img src={logo} alt="logo" className={classes.logotypeImage} />
        <Typography className={classes.logotypeText}>Admin </Typography>
      </div>
      <div className={classes.formContainer}>
        <div className={classes.form}>
          <Tabs
            value={activeTabId}
            onChange={(e, id) => setActiveTabId(id)}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Login" classes={{ root: classes.tab }} />
            {/* <Tab label="New User" classes={{ root: classes.tab }} />*/}
          </Tabs>
          {activeTabId === 0 && (
            <React.Fragment>
              <Typography variant="h1" className={classes.greeting}>
                {generateGreetings()}
              </Typography>

              <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  Something is wrong with your login or password :(
                </Typography>
              </Fade>
              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
                margin="normal"
                placeholder="Email Adress"
                type="email"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                margin="normal"
                placeholder="Password"
                type="password"
                fullWidth
              />
              <div className={classes.formButtons}>
                {isLoading ? (
                  <CircularProgress size={26} className={classes.loginLoader} />
                ) : (
                  <Button
                    disabled={
                      loginValue.length === 0 || passwordValue.length === 0
                    }
                    onClick={() =>
                      loginUser(
                        userDispatch,
                        loginValue,
                        passwordValue,
                        props.history,
                        setIsLoading,
                        setError,
                      )
                    }
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    Login
                  </Button>
                )}
                <Button
                  color="primary"
                  size="large"
                  className={classes.forgetButton}
                >
                  Forget Password
                </Button>
              </div>
            </React.Fragment>
          )}
          {activeTabId === 1 && (
            <React.Fragment>
              <Typography variant="h1" className={classes.greeting}>
                Welcome!
              </Typography>
              <Typography variant="h2" className={classes.subGreeting}>
                Create your account
              </Typography>
              <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  Quelque chose ne va pas avec votre login ou mot de passe
                </Typography>
              </Fade>
              <TextField
                id="name"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                margin="normal"
                placeholder="Full Name"
                type="text"
                fullWidth
              />
              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
                margin="normal"
                placeholder="Email Adress"
                type="email"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                margin="normal"
                placeholder="Password"
                type="password"
                fullWidth
              />
              <div className={classes.creatingButtonContainer}>
                {isLoading ? (
                  <CircularProgress size={26} />
                ) : (
                  <Button
                    onClick={() =>
                      loginUser(
                        userDispatch,
                        loginValue,
                        passwordValue,
                        props.history,
                        setIsLoading,
                        setError,
                      )
                    }
                    disabled={
                      loginValue.length === 0 ||
                      passwordValue.length === 0 ||
                      nameValue.length === 0
                    }
                    size="large"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className={classes.createAccountButton}
                  >
                    Create your account
                  </Button>
                )}
              </div>
              <div className={classes.formDividerContainer}>
                <div className={classes.formDivider} />
                <Typography className={classes.formDividerWord}>or</Typography>
                <div className={classes.formDivider} />
              </div>
              <Button
                size="large"
                className={classnames(
                  classes.googleButton,
                  classes.googleButtonCreating,
                )}
              >
                <img src={google} alt="google" className={classes.googleIcon} />
                &nbsp;Sign in with Google
              </Button>
            </React.Fragment>
          )}
        </div>
        <Typography color="primary" className={classes.copyright}>
          © {new Date().getFullYear()}{" "}
          <a
            style={{ textDecoration: "none", color: "inherit" }}
            href="https://flatlogic.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            Flatlogic
          </a>
          , LLC. All rights reserved.
        </Typography>
      </div>
    </Grid>
  );
}

export default withRouter(Login);
