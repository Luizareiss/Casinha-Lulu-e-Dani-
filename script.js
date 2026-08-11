/*
NOSSA VIDA FINANCEIRA
Versão inicial

Nesta primeira versão os valores ainda são
exemplos/valores iniciais.

Nas próximas etapas vamos criar:
- cadastro de receitas
- cadastro de gastos
- edição e exclusão
- armazenamento dos dados
- controle por mês
- cartões
- metas

*/

// ==========================================
// DADOS INICIAIS
// ==========================================

const financeiro = {

receitas: {
    luiza: 0,
    daniel: 0,
    outras: 0
},

gastos: {

    casaFixos: 0,
    casaVariaveis: 0,

    luizaClinica: 0,
    luizaPessoal: 0,

    danielPessoal: 0,

    carroFixos: 0,
    carroVariaveis: 0,

    cartaoLuiza: 0,
    cartaoDaniel: 0
}

};

// ==========================================
// FORMATAÇÃO DE DINHEIRO
// ==========================================

function dinheiro(valor) {

return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
});

}

// ==========================================
// ATUALIZA O PAINEL
// ==========================================

function atualizarPainel() {

const receitas =
    financeiro.receitas.luiza +
    financeiro.receitas.daniel +
    financeiro.receitas.outras;


const gastos =
    financeiro.gastos.casaFixos +
    financeiro.gastos.casaVariaveis +
    financeiro.gastos.luizaClinica +
    financeiro.gastos.luizaPessoal +
    financeiro.gastos.danielPessoal +
    financeiro.gastos.carroFixos +
    financeiro.gastos.carroVariaveis +
    financeiro.gastos.cartaoLuiza +
    financeiro.gastos.cartaoDaniel;


const saldo = receitas - gastos;


let porcentagem = 0;

if (receitas > 0) {
    porcentagem = (gastos / receitas) * 100;
}


// RESUMO

document.getElementById("receitas").textContent =
    dinheiro(receitas);

document.getElementById("gastos").textContent =
    dinheiro(gastos);

document.getElementById("saldo").textContent =
    dinheiro(saldo);

document.getElementById("disponivel").textContent =
    dinheiro(saldo);


document.getElementById("porcentagem").textContent =
    porcentagem.toFixed(0) + "%";


// CASA

document.getElementById("casa-fixos").textContent =
    dinheiro(financeiro.gastos.casaFixos);

document.getElementById("casa-variaveis").textContent =
    dinheiro(financeiro.gastos.casaVariaveis);


// LUIZA

document.getElementById("luiza-clinica").textContent =
    dinheiro(financeiro.gastos.luizaClinica);

document.getElementById("luiza-pessoal").textContent =
    dinheiro(financeiro.gastos.luizaPessoal);


// DANIEL

document.getElementById("daniel-pessoal").textContent =
    dinheiro(financeiro.gastos.danielPessoal);


// CARRO

document.getElementById("carro-fixos").textContent =
    dinheiro(financeiro.gastos.carroFixos);

document.getElementById("carro-variaveis").textContent =
    dinheiro(financeiro.gastos.carroVariaveis);


// CARTÕES

document.getElementById("cartao-luiza").textContent =
    dinheiro(financeiro.gastos.cartaoLuiza);

document.getElementById("cartao-daniel").textContent =
    dinheiro(financeiro.gastos.cartaoDaniel);

}

// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener("DOMContentLoaded", function() {

atualizarPainel();

});
