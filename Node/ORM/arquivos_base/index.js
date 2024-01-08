import { json } from 'body-parser'
 
import pessoas from './pessoasRoute'
import niveis from './niveisRoute'
import turmas from './turmasRoute'

export default app => {
 app.use(
   json(),
   pessoas,
   niveis,
   turmas
   )
 }
