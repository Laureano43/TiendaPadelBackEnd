/* Aquí va la lógica que maneja el comportamiento de nuestra API cada vez que se recibe una request a través de las rutas*/
const {getAllUsers, getUserById, registerUser, loginUser, deleteUserById, editUserById, } = require("./usersModel");
const notNumber = require("../utils/notNumber");
const { hashPassword, checkPassword } = require("../utils/handlePassword");
const { tokenSign, tokenVerify } = require("../utils/handleJWT");
const { matchedData } = require("express-validator")
const nodemailer = require("nodemailer")
const url = process.env.public_url;

//get all users
const listAll = async (req, res, next) => {
  const dbResponse = await getAllUsers();
  if (dbResponse instanceof Error) return next(dbResponse);
  dbResponse.length ? res.status(200).json(dbResponse) : next();
};

/*-------------------*/
//get user by id
const listOne = async function (req, res, next) {
  if (notNumber(req.params.id, res)) return;
  const dbResponse = await getUserById(Number(req.params.id));
  if (dbResponse instanceof Error) return next(dbResponse);
  dbResponse.length ? res.status(200).json(dbResponse) : next();
};
//patch existing user
const editOne = async (req, res, next) => {
  if (notNumber(req.params.id, res)) return;
  const dbResponse = await editUserById(+req.params.id, req.body);
  if (dbResponse instanceof Error) return next(dbResponse);
  dbResponse.affectedRows ? res.status(200).json(req.body) : next();
};

//Register new user
const register = async (req, res, next) => {
  /*console.log("objeto req.body:", req.body)
  console.log("objeto req.file:", req.file)QUITAR*/ 
  //send.status(200)
 
  //console.log("register entrando...") QUITAR 
  const cleanBody = matchedData(req)
  const fileName = url + req.file.filename;
  //console.log({fileName, url}) QUITAR 
  //console.log(req.body.password) QUITAR 
  const password = await hashPassword(req.body.password);
  const dbResponse = await registerUser({ ...cleanBody, password, fileName });
  //console.log(dbResponse); QUITAR 
  if (dbResponse instanceof Error) return next(dbResponse);
  const user = {
    name: cleanBody.name,
    email: cleanBody.email,
  };
    const tokenData = {
    token: await tokenSign(user, "2h"),
    user,
  };
  res.status(201).json({ user: req.body.name});/* , Token_Info: tokenData });*/
};

//Login user
const login = async (req, res, next) => {
  const cleanBody = matchedData(req)
//  console.log(cleanBody) //QUITAR 
  const dbResponse = await loginUser(req.body.email);
  console.log(dbResponse)
  if (!dbResponse.length) return next();
  if (await checkPassword(req.body.password, dbResponse[0].password)) {
    const user = {
      id: dbResponse[0].id,
      name: dbResponse[0].name,
      email: dbResponse[0].email,
      image: dbResponse[0].image,
    };
    const tokenData = {
      token: await tokenSign(user, "1h"),
      user,
    };
    res
      .status(200)
      .json({ message: `User ${user.name} Logged in!`, Token_info: tokenData });
    } else {
    let error = new Error();
    error.status = 401;
    error.message = "Unauthorized";
    next(error);
  }
};

//delete user by ID
const removeOne = async (req, res, next) => {
  if (notNumber(req.params.id, res)) return;
  const dbResponse = await deleteUserById(+req.params.id);
  console.log(dbResponse);
  if (dbResponse instanceof Error) return next(dbResponse);
  dbResponse.affectedRows ? res.status(204).end() : next();
};


/*configurar nodemailer*/
const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.mailtrap_user,
      pass: process.env.mailtrap_pass
  }
});

/*forgot password*/
const forgot = async (req, res, next) => {
  const dbResponse = await loginUser(req.body.email);
  if (!dbResponse.length) return next();
  const user = {
    id: dbResponse[0].id,
    name: dbResponse[0].name,
    email: dbResponse[0].email
  }
  const token = await tokenSign(user, "30m")
  const link = `${process.env.public_url}users/reset/${token}`

    const mailDetails = {
    from: "support@tiendapadel.com",
    to: user.email,
    subject: "Recuperación de contraseña",
    html: `
    <h2>Servicio para recuperar la contraseña</h2>
    <p>Para reiniciar la contraseña por favor hacer Click en el link y seguir las instrucciones</p>
    <a href="${link}">Hacer click aquí para recuperar la contraseña</a>
    `
  }
  
  transport.sendMail(mailDetails, (err, data) => {
    if (err) return next(err);
    res.status(200).json({ message: `Hola ${user.name}, te hemos enviado un correo electrónico con las instrucciones a la casilla  ${user.email}. Dispones de 30 minutos para cambiar la contraseña, por favor apúrate!` })
  })
}

//RESET PASSWORD (GET)
//mostramos el formulario de recuperación de contraseña
const reset = async (req, res, next) => {
  const token = req.params.token
  const tokenStatus = await tokenVerify(req.params.token)
  console.log(tokenStatus)
  if (tokenStatus instanceof Error) {
    res.status(403).json({ message: "Invalid or Expired Token" })
  } else {
    res.render("reset", { token, tokenStatus })
  }
}

//RESET PASSWORD (POST)
//recibe la nueva contraseña desde el formulario de recuperación de contraseña
const saveNewPass = async (req, res, next) => {
  const { token } = req.params
  const tokenStatus = await tokenVerify(token)
  console.log()
  if (tokenStatus instanceof Error) return next(tokenStatus);
  const password = await hashPassword(req.body.password_1)
  const dbResponse = await editUserById(tokenStatus.id, { password })
  dbResponse instanceof Error ? next(dbResponse) : res.status(200).json({ message: `Password changed for user ${tokenStatus.name}` })
}

module.exports = { listAll, listOne, register, login, forgot, reset, saveNewPass, removeOne, editOne };