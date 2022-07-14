const pool = require("../data/config");

const getProductWith = async (string) => {
  const query = `SELECT * FROM producto WHERE categoria LIKE '%${string}%'`;
  try {
    return await pool.query(query);
  } catch (error) {
    error.message = error.code;
    return error;
  }
};
const getAllProduct = async () => {
  const query = "SELECT * FROM producto";
  try {
    return await pool.query(query);
  } catch (error) {
    error.message = error.code;
    return error;
  }
};

const getProductById = async (id) => {
  const query = `SELECT * FROM Producto WHERE id = ${id} LIMIT 1`
  try {
      return await pool.query(query)
  } catch (error) {
      error.message = error.code
      return error
  }
}

const addNewProduct = async (post) => {
  const query = "INSERT INTO Producto SET ?";
  try {
    return await pool.query(query, post);
  } catch (error) {
    error.message = error.code;
    return error;
  }
};

const editProductById = async (id, user) => {
  const query = `UPDATE Producto SET ? WHERE id = ${id}`;
  try {
      return await pool.query(query, user)
  } catch (error) {
      error.message = error.code
      return error
  }
};

const deleteProductById = async (id) => {
  const query = `DELETE FROM Producto WHERE id = ${id}`
  try {
      return await pool.query(query)
  } catch (error) {
      error.message = error.code
      return error
  }
}

module.exports = { getProductWith, getAllProduct, addNewProduct, getProductById, editProductById, deleteProductById};