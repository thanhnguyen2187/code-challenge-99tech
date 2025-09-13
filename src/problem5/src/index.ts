import express from "express";
import { DataAccess } from "./data-access.js";

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const dbUrl = process.env.DATABASE_URL ?? ":memory:";

const db = DataAccess.createDb(dbUrl);
DataAccess.migrate(db);

app.use(express.json());
app
  .get("/api/v1/todo-items", (req, res) => {
    try {
      const items = DataAccess.TodoItem.listAll(db);
      res.status(200).json({
        data: items,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
      });
    }
  })
  .post("/api/v1/todo-items", (req, res) => {
    const item = req.body;
    try {
      DataAccess.TodoItem.create(db, item);
      res.status(200).json({
        success: true,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        error: err,
      });
    }
  })
  .put("/api/v1/todo-items", (req, res) => {
    const item = req.body;
    try {
      DataAccess.TodoItem.update(db, item);
      res.status(200).json({
        success: true,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
      });
    }
  })
  .delete("/api/v1/todo-items/:id", (req, res) => {
    const id = req.params.id;
    try {
      DataAccess.TodoItem.deleteOne(db, id);
      res.status(200).json({
        success: true,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
      });
    }
  })
  .get("/api/v1/todo-items/:id", (req, res) => {
    const id = req.params.id;
    try {
      const item = DataAccess.TodoItem.findOne(db, id);
      res.status(200).json({
        data: item,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
      });
    }
  });

app.listen(port, () => {
  console.info("Started server at port", port);
});
