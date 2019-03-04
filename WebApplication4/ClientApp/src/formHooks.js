import React, { useState, useEffect, useRef } from "react";

export const useField = (
  name,
  form,
  { defaultValue, validations = [], fieldsToValidateOnChange = [name] } = {}
) => {
  const [value, setValue] = useState(defaultValue);
  const [errors, setErrors] = useState([]);
  const [pristine, setPristine] = useState(true);
  const [validating, setValidating] = useState(false);
  const validateCounter = useRef(0);

  const validate = async () => {
    const validateIteration = ++validateCounter.current;
    setValidating(true);
    const formData = form.getFormData();
    let errorMessages = await Promise.all(
      validations.map(validation => validation(formData, name))
    );
    errorMessages = errorMessages.filter(errorMsg => !!errorMsg);
    if (validateIteration === validateCounter.current) {
      // this is the most recent invocation

      setErrors([].concat(...errorMessages));
      setValidating(false);
    }
    const fieldValid = errorMessages.length === 0;
    return fieldValid;
  };

  useEffect(() => {
    if (pristine) return; // Avoid validate on mount
    form.validateFields(fieldsToValidateOnChange);
  }, [value]);

  let field = {
    name,
    value,
    errors,
    setErrors,
    pristine,
    onChange: e => {
      if (pristine) {
        setPristine(false);
      }
      setValue(e.target.value);
    },
    validate,
    validating
  };
  form.addField(field);
  return field;
};

export const useForm = ({ onSubmit }) => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);
  const fields = [];

  const validateFields = async fieldNames => {
    let fieldsToValidate;
    if (fieldNames instanceof Array) {
      fieldsToValidate = fields.filter(field =>
        fieldNames.includes(field.name)
      );
    } else {
      //if fieldNames not provided, validate all fields
      fieldsToValidate = fields;
    }
    const fieldsValid = await Promise.all(
      fieldsToValidate.map(field => field.validate())
    );
    const formValid = fieldsValid.every(isValid => isValid === true);
    return formValid;
  };

  const getFormData = () => {
    return fields.reduce((formData, f) => {
      formData[f.name] = f.value;
      return formData;
    }, {});
  };

  return {
    onSubmit: async e => {
      e.preventDefault();
      setSubmitting(true);
      setSubmitted(true); // User has attempted to submit form at least once
      let formValid = await validateFields();
      try {
        return await onSubmit(getFormData(), formValid);
      } catch (error) {
        const err = await error;
        if (typeof err === "string") {
          setErrors([...errors, err]);
        } else if (Array.isArray(err)) {
          setErrors([...errors, ...err.filter(o => typeof o === "string")]);
        } else {
          Object.entries(err).forEach(([key, value]) => {
            const field = fields.filter(o => o.name === key);
            if (field && field.length) {
              field.forEach(f => f.setErrors([...f.errors, ...value]));
            } else {
              setErrors([...errors, ...value]);
            }
          });
        }
      } finally {
        setSubmitting(false);
      }
    },
    isValid: () => fields.every(f => f.errors.length === 0),
    addField: field => fields.push(field),
    getFormData,
    validateFields,
    submitted,
    submitting,
    errors
  };
};
