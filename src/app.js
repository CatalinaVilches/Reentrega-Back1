import express from 'express'
import productRouter from './routes/productRoutes.js'
import cartRouter from './routes/cartRoutes.js'
import viewRouter from './routes/views.js'
import  {engine}  from 'express-handlebars'
import { config } from './config/config.js'
import { conectarDB } from './connDB.js'

const app =express()
const PORT = config.PORT || 8080;


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('./src/public'));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');


app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewRouter);
app.get('/', (req, res)=>{
    res.send('todo 0k');
});

app.listen(PORT, ()=>{
    console.log(`server on en http://localhost:${PORT}`)
})

conectarDB(config.MOONGODB, config.DBNAME)