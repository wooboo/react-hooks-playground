import { withStyles } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import React, { useState } from "react";
import Input from "@material-ui/core/Input";
import { postForm } from "./utils/fetchUtils";
import Register from "./Register";
import useFetch from "./utils/useFetch";
import useDebounce from "./utils/useDebounce";

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
  const [area, setArea] = useState("home");
  const debouncedArea = useDebounce(area, 500);
  const { data } = useFetch(`/api/SampleData/WeatherForecasts?area=${debouncedArea}`);

  return (
    <main className={classes.main}>
      <CssBaseline />
      {/* <Register onSubmit={postForm("/api/SampleData/Register")} /> */}
      <Input
        value={area}
        onChange={e=>setArea(e.target.value)}
        fullWidth
      />
      {data && data.map(d=><div key={d.dateFormatted}>{d.area} {d.dateFormatted} {d.temperatureC}°C {d.summary} </div>)}
    </main>
  );
}

export default withStyles(styles)(App);
