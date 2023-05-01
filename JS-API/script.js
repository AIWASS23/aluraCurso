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
    var mensagemErro = document.getElementById('erro');
    mensagemErro.innerHTML = "";
    try {
        var consultaCEP = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        var consultaCEPConvertida = await consultaCEP.json();
        if (consultaCEPConvertida.erro) {
            throw Error('CEP não existente!');
        }
        var cidade = document.getElementById('cidade');
        var logradouro = document.getElementById('endereco');
        var estado = document.getElementById('estado');

        cidade.value = consultaCEPConvertida.localidade;
        logradouro.value = consultaCEPConvertida.logradouro;
        estado.value = consultaCEPConvertida.uf;

        console.log(consultaCEPConvertida);
        return consultaCEPConvertida;
    } catch (erro) {
        mensagemErro.innerHTML = `<p>CEP inválido. Tente novamente!</p>`
        console.log(erro);
    }
}

var cep = document.getElementById('cep');
cep.addEventListener("focusout", () => buscaEndereco(cep.value));

/* --- Lidando com várias requisições ao mesmo tempo com Promise.all ---

let ceps = ['01001000', '01001001'];
let conjuntoCeps = ceps.map(valores => buscaEndereco(valores));
console.log(conjuntoCeps);
Promise.all(conjuntoCeps).then(respostas => console.log(respostas));

*/