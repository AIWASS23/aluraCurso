/*

--- Código da conversa versão síncrono ---

console.log("Mandando oi pro amigo!");

function mandaMensagem() {
    console.log("Tudo bem?");
    console.log("Vou te mandar uma solicitação!");
    console.log("Solicitação recebida!");
}

mandaMensagem();

console.log("Tchau tchau!");

*/

/*

--- Código da conversa versão assíncrono ---

console.log("Mandando oi pro amigo!");

function mandaMensagem() {
    console.log("Tudo bem?");
    console.log("Vou te mandar uma solicitação!");
    console.log("Solicitação recebida!");
}

setTimeout(mandaMensagem, 5000);

console.log("Tchau tchau!");

*/

async function buscaEndereco(cep) {
    try {
        var consultaCEP = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        var consultaCEPConvertida = await consultaCEP.json();
        if (consultaCEPConvertida.erro) {
            throw Error('CEP não existente!');
        }
        console.log(consultaCEPConvertida);
        return consultaCEPConvertida;
    } catch (erro) {
        console.log(erro);
    }
}

/* --- Lidando com várias requisições ao mesmo tempo com Promise.all ---

let ceps = ['01001000', '01001001'];
let conjuntoCeps = ceps.map(valores => buscaEndereco(valores));
console.log(conjuntoCeps);
Promise.all(conjuntoCeps).then(respostas => console.log(respostas));

*/