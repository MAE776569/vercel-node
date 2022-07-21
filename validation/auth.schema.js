const { EMAIL_PROVIDERS } = require("../helpers/constants")
const { validator } = require("../library/xprevalent/validators")

const generateEmailRegex = () =>
  new RegExp(`^[A-Za-z0-9._%+-]+@(${EMAIL_PROVIDERS.join("|")})\.[A-Za-z]{2,}$`)

const signupUserSchema = {
  body: validator
    .object({
      email: validator.string().email().required(),
      name: validator.string().min(3).required(),
      password: validator
        .string()
        .matches(/^(?=.*[0-9])(?=.*[a-zA-Z])([^ ]){8,}$/)
        .min(8)
        .required(),
      confirmPassword: validator
        .string()
        .matches(/^(?=.*[0-9])(?=.*[a-zA-Z])([^ ]){8,}$/)
        .min(8)
        .required()
        .oneOf([validator.ref("password")]),
    })
    .test("emailProvider", "Email provider is not valid", ({ email }) => {
      return generateEmailRegex().test(email)
    }),
}

const loginUserSchema = {
  body: validator
    .object({
      email: validator.string().email().required(),
      password: validator
        .string()
        .matches(/^(?=.*[0-9])(?=.*[a-zA-Z])([^ ]){8,}$/)
        .min(8)
        .required(),
    })
    .test("emailProvider", "Email provider is not valid", ({ email }) => {
      return generateEmailRegex().test(email)
    }),
}

const accountVerificationSchema = {
  params: validator.object({
    token: validator.string().length(64).hexadecimal().required(),
  }),
}

module.exports = {
  signupUserSchema,
  loginUserSchema,
  accountVerificationSchema,
}
