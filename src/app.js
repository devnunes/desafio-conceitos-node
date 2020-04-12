const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function repositoryExists(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid repository ID" });
  }

  const findRepositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (findRepositoryIndex === -1) {
    return res.status(400).json({ error: "Repository does not exists" })
  }

  req.repositoryIndex = findRepositoryIndex

  return next();
}


app.use('/repositories/:id', repositoryExists);

app.get("/repositories", (req, res) => {
  return res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return res.json(repository);
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;
  const repositoryIndex = req.repositoryIndex

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repository

  return res.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  repositories.splice(req.repositoryIndex, 1);
  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  repositories[req.repositoryIndex].likes += 1;
  return res.json(repositories[req.repositoryIndex]);
});

module.exports = app;
