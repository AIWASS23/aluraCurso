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

var consultaCEP = fetch('https://viacep.com.br/ws/01001000/json/')
    .then(resposta => resposta.json())
    .then(r => {
        if (r.erro) {
            throw Error('Esse cep não existe!')
        } else
            console.log(r)
    })
    .catch(erro => console.log(erro))
    .finally(mensagem => console.log('Processamento concluido!'));

console.log(consultaCEP);