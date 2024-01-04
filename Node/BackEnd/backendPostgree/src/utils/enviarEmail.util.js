import emailTransporter from "./emailTransporter.util.js";
import 'dotenv/config';

const senderAddress = '"Cegás" <cegas-nao-responda@gmail.com>';
const CEGAS_ADDRESS_WEB = process.env.CEGAS_ADDRESS_WEB;

async function confirmRegistration (email, randomAddress) {
    try {
        const message = `Seu cadastro no sistema Cegás está quase concluído! Acesse ${CEGAS_ADDRESS_WEB}/verify/${randomAddress} para confirmar seu email`;

        await emailTransporter.sendMail({
            from: senderAddress,
            to: email, 
            subject: "Cegás | Confirme seu email",
            text: message, 
            html: `<b>Seu cadastro no sistema Cegás está quase concluído! Acesse <a href="${CEGAS_ADDRESS_WEB}/verify/${randomAddress}">este endereço</a> para confirmar seu email</b>`,
            headers:  { 'id_usuario': randomAddress }
        });
    } catch (error) {
        console.error(error);
        return error.message;
    }
}

async function newUserEmailChanged (email, id) {
    try {
        const message = `Seu email de cadastro foi alterado para ${email}. Acesse ${CEGAS_ADDRESS_WEB}/verify/${id} para confirmar seu cadastro e alterar sua senha`;

        await emailTransporter.sendMail({
            from: senderAddress,
            to: email,
            subject: "Cegás | Email alterado",
            text: message,
            html: `<b>Seu email de cadastro foi alterado para ${email}. Acesse <a href="${CEGAS_ADDRESS_WEB}/verify/${id}">este endereço</a> para confirmar seu cadastro e alterar sua senha</b>`
        });
    } catch (error) {
        console.error(error);
        return error.message;
    }
}

async function editEmail (email, id) {
    try {
        const message = `Para confirmar a alteração do e-mail, clique no link a seguir: ${CEGAS_ADDRESS_WEB}/verifyEmail/${id}`;

        await emailTransporter.sendMail({
            from: senderAddress,
            to: email,
            subject: "Cegás | Email alterado",
            text: message,
            html: `<b>Para confirmar a alteração do e-mail, clique no link a seguir: <a href="${CEGAS_ADDRESS_WEB}/verifyEmail/${id}">${CEGAS_ADDRESS_WEB}/verifyEmail/${id}</a></b>`
        });
    } catch (error) {
        console.error(error);
        return error.message;
    }
}

async function archiveUserEmail (userFound) {
    try {
        const accountSituation = userFound.situacao === "Arquivado" ? "arquivada" : "desarquivada"
        const message = `Sua conta foi ${accountSituation}`;

        await emailTransporter.sendMail({
            from: senderAddress,
            to: userFound.email,
            subject: `Cegás | Conta ${accountSituation}`,
            text: message,
            html: `<b>${message}</b>`
        });
    } catch (error) {
        console.error(error);
        return error.message;
    }
}

async function blockUserEmail (userFound) {
    try {
        const accountSituation = userFound.situacao === "Bloqueado" ? "bloqueada" : "desbloqueada"
        const message = `Sua conta foi ${accountSituation}`;

        await emailTransporter.sendMail({
            from: senderAddress,
            to: userFound.email,
            subject: `Cegás | Conta ${accountSituation}`,
            text: message,
            html: `<b>${message}</b>`
        });
    } catch (error) {
        console.error(error);
        return error.message;
    }
}

async function recoverPasswordEmail (email, id) {
    try {
        const message = `Você solicitou uma alteração de senha. Acesse ${CEGAS_ADDRESS_WEB}/verify/${id} para configurar sua nova senha`;

        await emailTransporter.sendMail({
            from: senderAddress,
            to: email,
            subject: "Cegás | Recuperar senha",
            text: message,
            html: `<b>Você solicitou uma alteração de senha. Acesse <a href="${CEGAS_ADDRESS_WEB}/verify/${id}">este endereço</a> para configurar sua nova senha</b>`
        });
    } catch (error) {
        console.error(error);
        return error.message;
    }
}

export default {
    confirmRegistration,
    newUserEmailChanged,
    editEmail,
    archiveUserEmail,
    blockUserEmail,
    recoverPasswordEmail
}