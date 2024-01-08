// import Turmas from '../models/turmas.js'

// class TurmaController {
//   static async pegaTodasAsTurmas(req, res){
//     try {
//       const todasAsTurmas = await Turmas.findAll()
//       return res.status(200).json(todasAsTurmas)  
//     } catch (error) {
//       return res.status(500).json(error.message)
//     }
//   }

//   static async pegaUmaTurma(req, res) {
//     const { id } = req.params
//     try {
//       const umaTurma = await Turmas.findOne( { 
//         where: { 
//           id: Number(id) 
//         }
//       })
//       return res.status(200).json(umaTurma)
//     } catch (error) {
//       return res.status(500).json(error.message)
//     }
//   }

//   static async criaTurma(req, res) {
//     const novaTurma = req.body
//     try {
//       const novaTurmaCriada = await Turmas.create(novaTurma)
//       return res.status(200).json(novaTurmaCriada)
//     } catch (error) {
//       return res.status(500).json(error.message)
//     }
//   }

//   static async atualizaTurma(req, res) {
//     const { id } = req.params
//     const novasInfos = req.body
//     try {
//       await Turmas.update(novasInfos, { where: { id: Number(id) }})
//       const turmaAtualizada = await Turmas.findOne( { where: { id: Number(id) }})
//       return res.status(200).json(turmaAtualizada)
//     } catch (error) {
//       return res.status(500).json(error.message)
//     }
//   }

//   static async apagaTurma(req, res) {
//     const { id } = req.params
//     try {
//       await Turmas.destroy({ where: { id: Number(id) }})
//       return res.status(200).json({ mensagem: `id ${id} deletado` })

//     } catch (error) {
//       return res.status(500).json(error.message)
//     }
//   }

// }

// export default TurmaController

// TurmaController.js
import Turmas from '../models/turmas.js';

export const pegaTodasAsTurmas = async (req, res) => {
  try {
    const todasAsTurmas = await Turmas.findAll();
    return res.status(200).json(todasAsTurmas);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const pegaUmaTurma = async (req, res) => {
  const { id } = req.params;
  try {
    const umaTurma = await Turmas.findOne({ where: { id: Number(id) } });
    return res.status(200).json(umaTurma);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const criaTurma = async (req, res) => {
  const novaTurma = req.body;
  try {
    const novaTurmaCriada = await Turmas.create(novaTurma);
    return res.status(200).json(novaTurmaCriada);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const atualizaTurma = async (req, res) => {
  const { id } = req.params;
  const novasInfos = req.body;
  try {
    await Turmas.update(novasInfos, { where: { id: Number(id) } });
    const turmaAtualizada = await Turmas.findOne({ where: { id: Number(id) } });
    return res.status(200).json(turmaAtualizada);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const apagaTurma = async (req, res) => {
  const { id } = req.params;
  try {
    await Turmas.destroy({ where: { id: Number(id) } });
    return res.status(200).json({ mensagem: `id ${id} deletado` });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
