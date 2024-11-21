import { validationResult, body } from "express-validator";

export const validateUserInput = [
  body("email").isEmail().withMessage("Invalid email address"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
];
