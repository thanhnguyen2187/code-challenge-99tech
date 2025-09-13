import express from "express";

const port = 3000;
const app = express();

app.get("/", (req, res) => {
  res.send(
    JSON.stringify({
      hello: "world",
    }),
  );
});

app.listen(port, () => {
  console.info("Started server at port", port);
});
