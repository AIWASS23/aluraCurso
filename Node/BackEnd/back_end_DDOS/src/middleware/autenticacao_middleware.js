import jsonwebtoken from "jsonwebtoken";

const AutenticacaoMiddleware = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if(req.url.includes("login")){
        return next();
    }

    if(!token) {
        return res.status(401).json({ message: "Token não encontrado" });
    }

    jsonwebtoken.verify(token, "secret", (err, decoded) => {
        if(err) {
            return res.status(500).json({ auth: false, message: "Falha ao autenticar token" });
        }
        next();
    });
};

export default AutenticacaoMiddleware;