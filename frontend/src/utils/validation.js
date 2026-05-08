const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);

export const validateLogin = ({ email, password }) => {
  const errors = {};

  if (!isValidEmail(email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!password.trim()) {
    errors.password = "Password is required.";
  }

  return errors;
};

export const validateRegister = ({ name, email, password }) => {
  const errors = validateLogin({ email, password });

  if (name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (password.trim().length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
};

export const validateTask = ({ title, description, dueDate }) => {
  const errors = {};

  if (!title.trim()) {
    errors.title = "Task title is required.";
  } else if (title.trim().length > 120) {
    errors.title = "Task title must be 120 characters or fewer.";
  }

  if (description.trim().length > 1000) {
    errors.description = "Description must be 1000 characters or fewer.";
  }

  if (dueDate && Number.isNaN(new Date(dueDate).getTime())) {
    errors.dueDate = "Choose a valid due date.";
  }

  return errors;
};

export const validateProfile = ({ name, email }) => {
  const errors = {};

  if (name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (!isValidEmail(email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
};

export const validatePasswordChange = ({ currentPassword, newPassword }) => {
  const errors = {};

  if (!currentPassword.trim()) {
    errors.currentPassword = "Current password is required.";
  }

  if (newPassword.trim().length < 8) {
    errors.newPassword = "New password must be at least 8 characters.";
  }

  return errors;
};
