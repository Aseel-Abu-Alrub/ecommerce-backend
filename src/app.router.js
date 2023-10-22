import categoriesRouter from './modules/categories/categories.router.js'
import productsRouter from './modules/products/products.router.js'

const initApp=(app,express)=>{
    app.use(express.json())
    app.get('/',(req,res)=>{
        return res.json('welcome')
    })
    app.use('/categories',categoriesRouter)
    app.use('/products',productsRouter)
    app.get('/*',(req,res)=>{
        return res.json('page not found')
    })
}

export default initApp