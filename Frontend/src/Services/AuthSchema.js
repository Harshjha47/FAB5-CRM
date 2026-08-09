import * as yup from "yup";

const emailRegex = /^[a-zA-Z0-9._%+-]+@fab5network\.com$/;

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/;
const genericPasswordError = "Password must be 8-72 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character.";

export const RegisterSchema = yup.object().shape({
  email: yup
    .string()
    .trim() 
    .lowercase() 
    .email("Invalid email format")
    .matches(emailRegex, "Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, genericPasswordError) 
    .max(72, genericPasswordError) 
    .matches(passwordRules, genericPasswordError), 
});

export const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .matches(emailRegex, "Invalid email format")
    .required("Required"),
  password: yup.string().required("Required"),
});