export function minLength(min, message) {
  return (formData, field) => {
    if (formData[field].length < min) {
      return message;
    }
  };
}

export function match(withField, message) {
  return (formData, field) => {
    if (formData[field] !== formData[withField]) {
      return message;
    }
  };
}
