import express from 'express';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta de prueba
app.get('/', (req, res) => {
res.send('Servidor funcionando 🚀');
});

// Conexión DB
connectDB().then(() => {
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
});