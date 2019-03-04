import { withStyles } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";
import { postForm } from "./fetchUtils";
import Register from "./Register";
import useJsonApi from "./useJsonApi";

const styles = theme => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  }
});

function App({ classes }) {
  const { data, isLoading, isError, doGet } = useJsonApi(
    "/api/SampleData/WeatherForecasts"
  );
  return (
    <main className={classes.main}>
      <CssBaseline />
      <Register onSubmit={postForm("/api/SampleData/Register")} />
    </main>
  );
}

export default withStyles(styles)(App);
