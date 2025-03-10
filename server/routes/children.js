const express = require("express");
const router = express.Router();
const pool = require("../db");
const etagMiddleware = require("../middleware/etagMiddleware");
const cacheMiddleware = require("../middleware/cacheMiddleware");
const client = require("../utils/redisClient");
router.use(etagMiddleware);

// router.post("/add-child", authorization, async (req, res) => {
router.post("", cacheMiddleware, async (req, res) => {
  const { name, age, gender, parent_id } = req.body;
  try {
    const newChild = await pool.query(
      `INSERT INTO children (name, age, gender, parent_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, age, gender, parent_id]
    );

    // Optionally, invalidate or update related cache entries, like the list of all listings
    await client.del(`/children/${parent_id}`);

    res.status(201).json({
      message: "Child has been created!",
      data: newChild,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get("/:parent_id", cacheMiddleware, async (req, res) => {
  const parent_id = req.params.parent_id;

  try {
    const children = await pool.query(
      "SELECT * FROM children WHERE parent_id = $1",
      [parent_id]
    );
    return res.status(200).json(children.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
