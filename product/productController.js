const { addNewProduct, getProductWith, getAllProduct, getProductById, editProductById, deleteProductById } = require("./productModel");
const notNumber = require("../utils/notNumber");

const listAll = async (req, res, next) => {
  let dbResponse = null;
  if (req.query.categoria) { //http://localhost:3030/posts?title=JavaScript este endpoint indica: req.query.title = JavaScript
    dbResponse = await getProductWith(req.query.categoria);
  } else {
    dbResponse = await getAllProduct();
  }
  if (dbResponse instanceof Error) return next(dbResponse);
  dbResponse.length ? res.status(200).json(dbResponse) : next();
};

const listOne = async function (req, res, next) {
  if (notNumber(req.params.id, res)) return;
  const dbResponse = await getProductById(Number(req.params.id));
  if (dbResponse instanceof Error) return next(dbResponse);
  dbResponse.length ? res.status(200).json(dbResponse) : next();
};

const addOne = async (req, res, next) => {
  const dbResponse = await addNewProduct({userid: req.token.id , ...req.body }); 
  dbResponse instanceof Error
    ? next(dbResponse)
    : res.status(201).json({ message: `Product created by ${req.token.name}` });
};

const updateOne = async (req, res, next) => {
  if (notNumber(req.params.id, res)) return;
  const dbResponse = await editProductById(+req.params.id, req.body);
  if (dbResponse instanceof Error) return next(dbResponse);
  dbResponse.affectedRows ? res.status(200).json(req.body) : next();
};

const deleteOne = async (req, res, next) => {
  if (notNumber(req.params.id, res)) return;
  const dbResponse = await deleteProductById(+req.params.id);
  console.log(dbResponse);
  if (dbResponse instanceof Error) return next(dbResponse);
  dbResponse.affectedRows ? res.status(204).end() : next();
};

module.exports = { listAll, addOne, listOne, updateOne, deleteOne };