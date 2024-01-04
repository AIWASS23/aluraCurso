const validacoesMiddleware = (appointmentSchema) => async (req, res, next) => {
    const body = req.body;

    try {
        await appointmentSchema.validate(body);
        next();
    } catch (error) {
        console.error(error);
        res.status(400).json({ mensagem: error.message , error_path: error.path });
    }
}

export default validacoesMiddleware;