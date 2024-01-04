import multer from "multer";

const uploadImagemCliente = () => multer({

    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './src/public/images/clientes')
        },
        filename: (req, file, cb) => {
            cb(null, req.query.logix + "_" + file.originalname);
        }
    }),

    fileFilter: (req, file, cb) => {
        const extensao = ['image/png', 'image/jpg', 'image/jpeg', 'image/pjpeg'].find(formatoAceito => formatoAceito == file.mimetype);

        if(extensao)
            return cb(null, true);

        return cb(null, false);
    }

});

export default uploadImagemCliente;