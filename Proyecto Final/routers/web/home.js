const Router = require('express')
const path = require('path')

const homeRouter = new Router;

homeRouter.get('/', (req, res) => {
    res.render(path.join(process.cwd(), '/views/pages/home.ejs'), { nombre: req.body.nombre })
    console.log({nombre: req.body.nombre})
})

module.exports= homeRouter