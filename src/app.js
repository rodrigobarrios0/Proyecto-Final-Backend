import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

dotenv.config();

const app=express();
const PORT=process.env.PORT || 8080;

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Routes de prueba
app.get('/', (req,res)=>{
    res.send('Servidor funcionando correctamente');
});

//Conectar a la base de datos
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
}).catch((error) => {
    console.error('Error al conectar a la base de datos:', error.message);
});