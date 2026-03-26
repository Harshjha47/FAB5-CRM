import * as yup from "yup";

const emailRegex = /^[a-zA-Z0-9._%+-]+@fab5network\.com$/;
const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

export const RegisterSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .matches(emailRegex, "Invalid email domain address")
    .required("Required"),
  password: yup
    .string()
    .min(8)
    .matches(passwordRules, { message: "Please create a stronger password" })
    .required("Required"),
});

export const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .matches(emailRegex, "Invalid email domain address")
    .required("Required"),
  password: yup.string().required("Required"),
});