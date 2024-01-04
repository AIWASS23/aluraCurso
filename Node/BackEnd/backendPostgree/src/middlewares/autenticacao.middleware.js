import jsonwebtoken from 'jsonwebtoken';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET;

const autenticacaoMiddleware = async (req, res, next) => {
    const token = req.headers['x-access-token'];

    if(req.url === "/" || req.url === "/admin/login" || req.url === "/recoverPassword" || req.url === "/reader/login" || 
    req.url === "/reader/recoverPassword") {
        return next();
    }

    if(req.url.split("/").includes("verify") || req.url.split("/").includes("file")) {
        return next();
    }

    if(!token) {
        return res.status(401).json({ message: "Token não encontrado" });
    }

    jsonwebtoken.verify(token, JWT_SECRET, (err, decoded) => {
        if(err) {
            return res.status(500).json({ auth: false, message: "Falha ao autenticar token" });
        }

        req.userId = decoded.id;
        next();
    });
}

export default autenticacaoMiddleware;