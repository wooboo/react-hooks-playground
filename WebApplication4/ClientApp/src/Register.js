import { ErrorsSummary } from './components/ErrorsSummary';
import React from "react";
import Button from "@material-ui/core/Button";
import { useForm, useField } from "./formHooks";
import Field from "./components/Field";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import { getValidation } from "./fetchUtils";
import { minLength, match } from "./validators";

const styles = theme => ({
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
});

function Register({ onSubmit, classes }) {
  const form = useForm({
    onSubmit
  });

  const usernameField = useField("userName", form, {
    defaultValue: "",
    validations: [getValidation("/api/SampleData/ValidateUser")],
  });
  const passwordField = useField("password", form, {
    defaultValue: "",
    validations: [
      minLength(6,  "Password must be at least 6 characters")
    ],
    fieldsToValidateOnChange: ["password", "confirmPassword"]
  });
  const confirmPasswordField = useField("confirmPassword", form, {
    defaultValue: "",
    validations: [
      match("password", "Passwords do not match")
    ],
    fieldsToValidateOnChange: ["password", "confirmPassword"]
  });

  let requiredFields = [usernameField, passwordField, confirmPasswordField];
  return (
    <Paper className={classes.paper}>
      <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Register
      </Typography>
      <form onSubmit={form.onSubmit}>
        <ErrorsSummary errors={form.errors} fullWidth/>
        <Field
          {...usernameField}
          formSubmitted={form.submitted}
          label="Username"
          required
          fullWidth
        />
        <Field
          {...passwordField}
          formSubmitted={form.submitted}
          label="Password"
          type="password"
          required
          fullWidth
        />
        <Field
          {...confirmPasswordField}
          formSubmitted={form.submitted}
          label="Confirm Password"
          type="password"
          required
          fullWidth
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          disabled={
            !form.isValid() ||
            form.submitting ||
            requiredFields.some(f => f.pristine)
          }
        >
          {form.submitting ? "Registering" : "Register"}
        </Button>
      </form>
    </Paper>
  );
}

export default withStyles(styles)(Register);
