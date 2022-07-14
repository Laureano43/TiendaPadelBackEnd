const router = require("express").Router();
const { listAll, addOne, listOne, updateOne, deleteOne } = require("./productController");
const isAuth = require("../middlewares/isAuth");

router.get("/", listAll);
router.get("/:id", listOne);

router.post("/", isAuth, addOne);
router.patch("/:id", updateOne);

router.delete("/:id", deleteOne)

module.exports = router;