import express from 'express'
import routes from './routes/index.js'

const app = express()
const port = 3000

//app.use('/', routes);

routes(app)

app.listen(port, () => console.log(`servidor está rodando na porta ${port}`))

export default app