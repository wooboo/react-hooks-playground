import React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import LoadingIcon from "@material-ui/icons/Cached";

export default function Field({
  label,
  name,
  value,
  onChange,
  errors,
  setErrors,
  pristine,
  validating,
  validate,
  formSubmitted,
  fullWidth,
  ...other
}) {
  const showErrors = (!pristine || formSubmitted) && !!errors.length;
  return (
    <FormControl className="field" error={showErrors} fullWidth={fullWidth}>
      <InputLabel htmlFor={name}>{label}</InputLabel>
      <Input
        id={name}
        value={value}
        onChange={onChange}
        onBlur={() => !pristine && validate()}
        endAdornment={
          <InputAdornment position="end">
            {validating && <LoadingIcon className="rotate" />}
          </InputAdornment>
        }
        fullWidth={fullWidth}
        {...other}
      />
      <FormHelperText component="div">
        {showErrors &&
          errors.map(errorMsg => <div key={errorMsg}>{errorMsg}</div>)}
      </FormHelperText>
    </FormControl>
  );
};
