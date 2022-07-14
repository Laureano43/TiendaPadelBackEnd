/*En este archivo pondremos la referencia a la ruta asociada y, si las hubiera, subrutas (por ejemplo, podríamos recibir todas las peticiones de /users, pero también de /users/otracosa... etc). Luego de recibir la petición diferenciando el verbo HTTP, enviaríamos al controlador apropiado. Si hubiera middlewares, se aplicarían en este archivo, entre la petición y el controlador*/
const { listAll, listOne, register, login, forgot, reset, saveNewPass, removeOne, editOne } = require("./usersController")
const router = require("express").Router()
const { validatorCreateUser, validatorLoginUser, validatorResetPassword } = require("../validators/users");
const fileUpload = require("../utils/handleStorage");

//get all users
router.get("/", listAll);
//get user by id
router.get("/:id", listOne);
//patch user
router.patch("/:id", editOne)
//delete user by ID
router.delete("/:id", removeOne)
//Login user
router.post("/login", validatorLoginUser, login)
//Register new user
router.post("/register", fileUpload.single("file"), validatorCreateUser, register) 

//Forgot password
router.post("/forgot-password", forgot) //desde el front entra el mail del usuario quen olvidó password
//Create and send magic link
router.get("/reset/:token", reset) //mostramos el formulario de recuperación de contraseña
router.post("/reset/:token", validatorResetPassword, saveNewPass)//recibimos la nueva contraseña desde el formulario

module.exports = router