import * as yup from 'yup';

const allFieldsRequired = async (obj) => {
    const entries = Object.entries(obj);
    for(let item of entries) {
        if(!item[1]) {
            return `${item[0]} é um campo obrigatório`;
        }
    }
}

const isValidEmail = async (email) => {
    const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if(email.length > 256) {
        return "Email deve ter até 256 caracteres";
    }

    if (!email.match(emailFormat)) {
        return "Email inválido";
    }
}

const isValidPassword = async (password) => {
    const upperCaseLetters = /[A-Z]/g;
    const numbers = /[0-9]/g;

    if(password.length < 8) {
        return "A senha deve conter, no mínimo, 8 caracteres";
    }

    if(!password.match(upperCaseLetters) || !password.match(numbers)) {
        return "A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número";
    }
}

const isConfirmPassword = async (senha, confirmar_senha) => {
    if(senha !== confirmar_senha) {
        return "A confirmação de senha não corresponde à nova senha";
    }
}

const newUserSchema = yup.object({
    nome: yup.string("O campo não está no formato adequado").required("Este campo é obrigatório"),
    email: yup.string("O campo não está no formato adequado").email("Email em formato inválido").required("Este campo é obrigatório"),
    telefone: yup.string("O campo não está no formato adequado").required("Este campo é obrigatório"),
    categoria: yup.array().of(yup.string()).required("Este campo é obrigatório")
});

const editUserSchema = yup.object({
    nome: yup.string("O campo não está no formato adequado"),
    telefone: yup.string("O campo não está no formato adequado"),
    categoria: yup.array().of(yup.string())
});

const verifyPasswordSchema = yup.object({
    nova_senha: yup.string("O campo não está no formato adequado").matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.{8,})/,
        "A senha deve conter, no mínimo, 8 caracteres com pelo menos uma letra maiúscula, uma minúscula e um número"
      ).required("Este campo é obrigatório"),
    confirmar_senha: yup.string("O campo não está no formato adequado").matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.{8,})/,
        "A senha deve conter, no mínimo, 8 caracteres com pelo menos uma letra maiúscula, uma minúscula e um número"
      ).oneOf([yup.ref('nova_senha'), null], 'As senhas não coincidem').required("Este campo é obrigatório")
});

const verifyEmailSchema = yup.object({
    email: yup.string("O campo não está no formato adequado").email("Email em formato inválido").required("Este campo é obrigatório")
});

const verifyLeituraSchema = yup.object({
    id_medidor: yup.string("O campo não está no formato adequado").required("Este campo é obrigatório"),
    leitura_imagem: yup.string("O campo não está no formato adequado").required("Este campo é obrigatório"),
    valor: yup.number("O campo não está no formato adequado").required("Este campo é obrigatório"),
});

export default {
    allFieldsRequired,
    isValidEmail,
    isValidPassword,
    isConfirmPassword,
    newUserSchema,
    editUserSchema,
    verifyPasswordSchema,
    verifyEmailSchema,
    verifyLeituraSchema
};