import { Router } from 'express'
import { pegaTodosOsNiveis, pegaUmNivel, criaNivel, atualizaNivel, apagaNivel } from '../controllers/NivelController'
 
const router = Router()
router
 .get('/niveis', pegaTodosOsNiveis)
 .get('/niveis/:id', pegaUmNivel)
 .post('/niveis', criaNivel)
 .put('/niveis/:id', atualizaNivel)
 .delete('/niveis/:id', apagaNivel)
export default router