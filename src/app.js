import express from 'express';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

import { engine } from 'express-handlebars';
import viewsRouter from './routes/views.router.js';

import { Server } from 'socket.io';


dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;

app.use('/', viewsRouter);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Conexión a la base de datos
await connectDB();
const server = app.listen(PORT, () => {

    console.log(
    `Servidor escuchando en el puerto ${PORT}`
    );

});

const io = new Server(server);

app.set('io', io);

io.on('connection', (socket) => {

    console.log('Cliente conectado');

});
