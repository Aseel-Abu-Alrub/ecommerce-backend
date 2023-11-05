import connectDB from '../DB/connection.js'
import categoriesRouter from './modules/categories/categories.router.js'
import productsRouter from './modules/products/products.router.js'
import categoryRouter from './modules/subcategory/subcategory.router.js'
import AuthRouter from './modules/auth/auth.router.js'

const initApp=(app,express)=>{
    app.use(express.json())
    connectDB()
    app.get('/',(req,res)=>{
        return res.json('welcome')
    })
    app.use('/auth',AuthRouter)
    app.use('/categories',categoriesRouter)
    app.use('/subcategory',categoryRouter)
    app.use('/products',productsRouter)
    app.get('/*',(req,res)=>{
        return res.json('page not found')
    })
}

export default initApp