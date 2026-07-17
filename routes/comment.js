const express = require("express");
const router = express.Router();
const { handleComment } = require("../services/commentBot");

router.post("/comment", async (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    for (const entry of body.entry) {
      if (entry.changes) {
        for (const change of entry.changes) {
          if (change.field === "feed" && change.value.item === "comment") {
            await handleComment(change.value);
          }
        }
      }
    }
    res.status(200).send("OK");
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
