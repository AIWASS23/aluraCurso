import { Router } from 'express'
import { pegaTodasAsTurmas, pegaUmaTurma, criaTurma, atualizaTurma, apagaTurma } from '../controllers/TurmaController'
 
const router = Router()
router
 .get('/turmas', pegaTodasAsTurmas)
 .get('/turmas/:id', pegaUmaTurma)
 .post('/turmas', criaTurma)
 .put('/turmas/:id', atualizaTurma)
 .delete('/turmas/:id', apagaTurma)
export default router