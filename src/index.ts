import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import AddressRoutes from "./routes/AddressRoutes";
import BandRoutes from "./routes/BandRoutes";
import BookingRoutes from "./routes/BookingRoutes";
import EstablishmentRoutes from "./routes/EstablishmentRoutes";
import BandApplicationRoutes from "./routes/BandApplicationRoutes";
import FavoriteRoutes from "./routes/FavoriteRoutes";
import UserRoutes from "./routes/UserRoutes";
import BandManagementRoutes from "./routes/BandManagementRoutes";

import './models/associations';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/enderecos", AddressRoutes);
app.use("/bandas", BandRoutes);
app.use("/estabelecimentos", EstablishmentRoutes);
app.use("/agendamentos", BookingRoutes);
app.use("/eventos", BandApplicationRoutes);
app.use("/favoritos", FavoriteRoutes);
app.use("/usuarios", UserRoutes);
app.use("/gerenciamento-bandas", BandManagementRoutes);

import sequelize from "./config/database"; 


sequelize
  .authenticate()
  .then(() => {
    console.log("Banco de dados conectado com sucesso!");
    // Para criar as tabelas automaticamente 
     sequelize.sync();
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados:", error);
  });

// Rota básica
app.get("/", (req, res) => {
  res.json({ message: "API funcionando!" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
