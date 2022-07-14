const { check, validationResult } = require("express-validator")

const validatorCreateUser = [
    check("name")
        .exists().withMessage("Name is required")
        .trim()
        .isAlpha('es-ES', { ignore: ' ' }).withMessage("Only letters")
        .notEmpty().withMessage("Name must not be empty")
        .isLength({ min: 2, max: 90 }).withMessage("Character count: min 2; max 90"),
    check("email")
        .exists().withMessage("Email is required")
        .isEmail().withMessage("Must be a valid email address")
        .normalizeEmail(),

    check("password")
        .exists().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
        .trim(),

    (req, res, next) => {
        //averiguamos si hay errores de validación en la request y los envolvemos en un objeto que tiene varias funciones útiles
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() })
        } else {
            next()
        }
    }
]

validatorLoginUser = [
    check("email")
        .exists().withMessage("Email is required")
        .isEmail().withMessage("Must be a valid email address")
        .normalizeEmail(),

    check("password")
        .exists().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
        .trim(),

    (req, res, next) => {
        //averiguamos si hay errores de validación en la request y los envolvemos en un objeto que tiene varias funciones útiles
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errores: errors.array() })
        } else {
            next()
        }
    }
]

const validatorResetPassword = [
    check("password_1")
        .exists()
        .isLength({ min: 8, max: 15 }).withMessage("Character count: min 8, max 15")
        .trim(),
    check("password_2")
        .custom(async (password_2, { req }) => {
            if (req.body.password_1 !== password_2) {
                throw new Error("Both passwords must be identical")
            }
        }),
    (req, res, next) => {
        const { token } = req.params
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const arrWarnings = errors.array()
            res.render("reset", { arrWarnings, token })
        } else {
            return next()
        }
    }
]


module.exports = { validatorCreateUser, validatorLoginUser, validatorResetPassword }