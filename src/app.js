import express from 'express';
import dotenv from 'dotenv';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';

import { connectDB } from './config/db.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import ProductManagerMongo from './dao/ProductManagerMongo.js';

dotenv.config();

const app = express();
const productManager = new ProductManagerMongo();

const PORT = process.env.PORT || 8080;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'));

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

await connectDB();

const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const io = new Server(server);

app.set('io', io);

io.on('connection', (socket) => {
    console.log('Cliente conectado');

    productManager.getProducts({
        limit: 100,
        page: 1
    })
    .then(result => socket.emit('products', result.docs))
    .catch(error => console.error(error.message));
});
