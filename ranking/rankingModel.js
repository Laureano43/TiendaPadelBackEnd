const pool = require("../data/config");

const getRankingWith = async (string) => {
  const query = `SELECT * FROM ranking WHERE genero LIKE '%${string}%'`;
  try {
    return await pool.query(query);
  } catch (error) {
    error.message = error.code;
    return error;
  }
};
const getAllRanking = async () => {
  const query = "SELECT * FROM ranking where genero = 'M'";
  try {
    return await pool.query(query);
  } catch (error) {
    error.message = error.code;
    return error;
  }
};

const getRankingById = async (id) => {
  const query = `SELECT * FROM ranking WHERE id = ${id} LIMIT 1`
  try {
      return await pool.query(query)
  } catch (error) {
      error.message = error.code
      return error
  }
}

const addNewRanking = async (post) => {
  const query = "INSERT INTO ranking SET ?";
  console.log(query)
  try {
    return await pool.query(query, post);
  } catch (error) {
    error.message = error.code;
    return error;
  }
};

const editRankingById = async (id, user) => {
  const query = `UPDATE ranking SET ? WHERE id = ${id}`;
  try {
      return await pool.query(query, user)
  } catch (error) {
      error.message = error.code
      return error
  }
};

const deleteRankingById = async (id) => {
  const query = `DELETE FROM ranking WHERE id = ${id}`
  try {
      return await pool.query(query)
  } catch (error) {
      error.message = error.code
      return error
  }
}

module.exports = { getRankingWith, getAllRanking, addNewRanking, getRankingById, editRankingById, deleteRankingById};