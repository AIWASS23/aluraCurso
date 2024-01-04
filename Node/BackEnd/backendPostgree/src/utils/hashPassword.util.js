import bcrypt from 'bcryptjs';

async function hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    return hash;
}

export default hashPassword;