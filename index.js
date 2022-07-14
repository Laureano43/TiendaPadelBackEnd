require("dotenv").config();
require("./data/config");
const PORT = process.env.PORT;
const express = require("express");
const hbs = require("express-handlebars")
const path = require("path")


const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true })); //lectura de formularios
server.use(express.static("public"));

const cors = require("cors");
server.use(cors());

//bootstrap files access via static routes
server.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
server.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))

//Handlebars setup
server.set("view engine", "hbs");
server.set("views", path.join(__dirname, "views")) // "./views"
server.engine("hbs", hbs.engine({ extname: "hbs" }))

server.get("/", (req, res) => {
  const content = `
    <h1>API para Web de Tienda de PADEL</h1>
    <a href="https://documenter.getpostman.com/view/13262806/UzQuN4r7" target="blank">Si desea visualizar nuestra Documentación haga click Aquí</a>
    `;
  res.send(content);
});

//Router for /users endpoint
server.use("/users", require("./users/usersRoute"));

//Router for /ranking endpoint
server.use("/ranking", require("./ranking/rankingRoute"));

//Router for /product endpoint
server.use("/product", require("./product/productRoute"));

//catch all route (404)
server.use((req, res, next) => {
  let error = new Error();
  error.status = 404;
  error.message = "Resource not found";
  next(error);
});

//Error handler
server.use((error, req, res, next) => {
  if (!error.status) {
    error.status = 500;
    error.message = "Internal Error Server"
  }

  res.status(error.status).json({ status: error.status, message: error.message });
});

server.listen(PORT, (err) => {
  err ? console.log(`Error: ${err}`) : console.log(`App corre en http://localhost:${PORT}`);
});