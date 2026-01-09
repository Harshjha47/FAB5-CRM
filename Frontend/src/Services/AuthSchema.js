import * as yup from "yup"
const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
export const RegisterSchema = yup.object().shape({
    email:yup.string().email().required("Required"),
    password:yup.string().min(8).matches(passwordRules,{message:"Please create a stronger password"}).required("Required"),
})
export const LoginSchema = yup.object().shape({
  email: yup.string().email().required("Required"),
  password: yup.string().required("Required"),
});