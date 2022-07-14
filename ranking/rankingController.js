const { addNewRanking, getRankingWith, getAllRanking, getRankingById, editRankingById, deleteRankingById } = require("./rankingModel");
const notNumber = require("../utils/notNumber");

const listAll = async (req, res, next) => {
  let dbResponse = null;
  console.log(req.query.id)
  if (req.query.genero) { //http://localhost:3030/posts?title=JavaScript este endpoint indica: req.query.title = JavaScript
    dbResponse = await getRankingWith(req.query.genero);
  } else {
    dbResponse = await getAllRanking();
  }
  if (dbResponse instanceof Error) return next(dbResponse);
  dbResponse.length ? res.status(200).json(dbResponse) : next();
};

const listOne = async function (req, res, next) {
  if (notNumber(req.params.id, res)) return;
  const dbResponse = await getRankingById(Number(req.params.id));
  if (dbResponse instanceof Error) return next(dbResponse);
  dbResponse.length ? res.status(200).json(dbResponse) : next();
};

const addOne = async (req, res, next) => {
  const dbResponse = await addNewRanking({userid: req.token.id , ...req.body }); 
  dbResponse instanceof Error
    ? next(dbResponse)
    : res.status(201).json({ message: `Ranking created by ${req.token.name}` });
};

const updateOne = async (req, res, next) => {
  if (notNumber(req.params.id, res)) return;
  const dbResponse = await editRankingById(+req.params.id, req.body);
  if (dbResponse instanceof Error) return next(dbResponse);
  dbResponse.affectedRows ? res.status(200).json(req.body) : next();
};

const deleteOne = async (req, res, next) => {
  if (notNumber(req.params.id, res)) return;
  const dbResponse = await deleteRankingById(+req.params.id);
  console.log(dbResponse);
  if (dbResponse instanceof Error) return next(dbResponse);
  dbResponse.affectedRows ? res.status(204).json({ message: "ID de Ranking borrado" }) : next();
};

module.exports = { listAll, addOne, listOne , updateOne, deleteOne};
