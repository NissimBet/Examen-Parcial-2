let express = require("express");
let bodyParser = require("body-parser");
let morgan = require("morgan");
let mongoose = require("mongoose");
let jsonParser = bodyParser.json();
let { DATABASE_URL, PORT } = require("./config");
const { updateBookmark, createBookmark } = require("./model");

let app = express();

let server;

app.use(morgan("default"));
app.use(jsonParser);

app.put("/api/bookmarks/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, url, id: bodyId } = req.body;

  if (!bodyId) {
    res.statusMessage = "No se envio el id del bookmark";
    return res.sendStatus(406);
  }
  if (id != bodyId) {
    res.statusMessage = "Ids no coinciden";
    return res.sendStatus(409);
  }
  if (!(titulo || descripcion || url)) {
    res.statusMessage = "No se enviaron datos a modificar";
    res.sendStatus(406);
  }

  const data = {};
  titulo ? (data.titulo = titulo) : "";
  descripcion ? (data.descripcion = descripcion) : "";
  url ? data.url : "";

  try {
    const newBookmark = await updateBookmark(bodyId, data);
    res.status(200).json(newBookmark);
  } catch (error) {
    console.log(error);
    res.sendStatus(404);
  }
});

function runServer(port, databaseUrl) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      { useNewUrlParser: true, useUnifiedTopology: true },
      response => {
        if (response) {
          return reject(response);
        } else {
          server = app
            .listen(port, () => {
              console.log("App is running on port " + port);
              resolve();
            })
            .on("error", err => {
              mongoose.disconnect();
              return reject(err);
            });
        }
      }
    );
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log("Closing the server");
      server.close(err => {
        if (err) {
          return reject(err);
        } else {
          resolve();
        }
      });
    });
  });
}
runServer(PORT, DATABASE_URL);

module.exports = {
  app,
  runServer,
  closeServer
};
