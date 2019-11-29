export default function validateDraft(draft, fields) {
  const errors = {};

  for (const field of fields) {
    if (field.required) {
      if (!draft[field.name]) {
        errors[field.name] = `${field.label} is required`;
      }
    }
  }

  return errors;
}
