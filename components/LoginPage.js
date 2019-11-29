import React from "react";
import color from "tinycolor2";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

const styles = theme => {
  return {
    container: {
      paddingTop: 50
    },
    logo: {
      width: 100,
      height: 100,
      boxShadow: theme.shadows[1],
      marginBottom: theme.spacing(2),
      position: "absolute",
      left: "50%",
      top: -52,
      marginLeft: -50
    },
    paper: {
      padding: theme.spacing(4),
      paddingTop: 50 + theme.spacing(4),
      maxWidth: 360,
      position: "relative"
    },
    footer: {
      marginTop: theme.spacing(2),
      "& > *": {
        margin: theme.spacing(0.5),
        marginTop: 0,
        marginBottom: 0
      }
    },
    google: {
      background: "#4285F4",
      "&:hover": {
        background: color("#4285F4").darken()
      }
    },
    github: {
      background: "#24292e",
      "&:hover": {
        background: color("#24292e").darken()
      }
    },
    forgotPassword: {
      marginTop: theme.spacing(1)
    }
  };
};

function LoginPage(props) {
  const {
    email,
    emailError,
    password,
    passwordError,
    onEmailChange,
    onPasswordChange,
    onSignIn,
    onGoogleSignIn,
    onFacebookSignIn,
    onGithubSignIn,
    onPasswordReset,
    emailRef,
    passwordRef,
    classes
  } = props;

  return (
    <Grid className={classes.container}>
      <form onSubmit={onSignIn}>
        <Paper className={classes.paper}>
          <Avatar
            src={require("../assets/logo.png")}
            className={classes.logo}
          />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5" align="center">
                Sign into your account
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="standard"
                type="email"
                name="email"
                fullWidth
                value={email}
                helperText={emailError}
                error={!!emailError}
                onChange={onEmailChange}
                inputRef={emailRef}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                variant="standard"
                type="password"
                name="password"
                fullWidth
                value={password}
                helperText={passwordError}
                error={!!passwordError}
                onChange={onPasswordChange}
                inputRef={passwordRef}
              />
              <Typography
                variant="body2"
                color="textSecondary"
                align="center"
                className={classes.forgotPassword}
                gutterBottom
              >
                Forgot your password?{" "}
                <Link href="" onClick={onPasswordReset}>
                  Reset password
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                type="submit"
              >
                Sign in
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Divider light />
            </Grid>
            <Grid item xs={12}>
              <Grid container justify="center">
                <IconButton onClick={onGoogleSignIn}>
                  <Avatar src={require("../assets/google.jpg")} />
                </IconButton>
                <IconButton onClick={onFacebookSignIn}>
                  <Avatar src={require("../assets/facebook.jpg")} />
                </IconButton>
                <IconButton onClick={onGithubSignIn}>
                  <Avatar src={require("../assets/github.png")} />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </form>
      <Grid
        container
        justify="center"
        alignItems="center"
        className={classes.footer}
      >
        <Typography variant="body1">
          Not a customer?{" "}
          <Link
            color="primary"
            href="https://blondieapps.typeform.com/to/scV2g5"
          >
            Try for free
          </Link>
        </Typography>
      </Grid>
    </Grid>
  );
}

export default withStyles(styles)(LoginPage);
