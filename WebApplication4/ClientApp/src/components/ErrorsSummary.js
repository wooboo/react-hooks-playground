import React from "react";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";

export function ErrorsSummary({ errors, fullWidth }) {
  return (
    <FormControl className="field" error={!!errors.length} fullWidth={fullWidth}>
      <FormHelperText component="div">
        {errors && errors.map(errorMsg => <div key={errorMsg}>{errorMsg}</div>)}
      </FormHelperText>
    </FormControl>
  );
}
