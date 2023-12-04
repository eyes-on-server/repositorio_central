const express = require("express");
const path = require("path");
const cors = require("cors");

require("dotenv").config();

const app = express();
const porta = 80;

// Chamada de rotas --------------------
const servidorRota = require("./src/routers/servidor");
const empresaRota = require("./src/routers/empresa");
const userRota = require("./src/routers/user");
const indexRota = require("./src/routers/index");
const alertasRota = require("./src/routers/alertas");
const graficosRota = require("./src/routers/graficos");
const analystGraphRouter = require("./src/routers/analystGraph");
const mailerRota = require("./src/routers/mailer");
const downtimeRota = require("./src/routers/downtime");
const otavioRota = require("./src/routers/otavioRoute");
const percentQuedaRota = require("./src/routers/percentQueda");
const isaRoute = require("./src/routers/isaRoute");

// Configurações -----------------------
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// Criação de Rotas --------------------
app.use("/", indexRota);
app.use("/user", userRota);
app.use("/empresa", empresaRota);
app.use("/servidor", servidorRota);
app.use("/alertas", alertasRota);
app.use("/analystGraph", analystGraphRouter);
app.use("/mailer", mailerRota);
app.use("/downtime", downtimeRota);
app.use("/otavioRoute", otavioRota);
app.use("/percentQueda", percentQuedaRota);
app.use("/isaRoute", isaRoute);

// Iniciar servidor --------------------
app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});
