/*
NOSSA VIDA FINANCEIRA
VERSÃO 2

Agora o site possui:

✓ Cadastro de gastos
✓ Cadastro de receitas
✓ Exclusão de gastos
✓ Cálculo automático
✓ Separação por categoria
✓ Salvamento no navegador

*/

// ==========================================
// BANCO DE DADOS
// ==========================================

let dados = JSON.parse(
localStorage.getItem("nossaVidaFinanceira")
) || {

receitas: {
    luiza: 0,
    daniel: 0,
    outras: 0
},

gastos: []

};

// ==========================================
// SALVAR
// ==========================================

function salvar() {

localStorage.setItem(
    "nossaVidaFinanceira",
    JSON.stringify(dados)
);

}

// ==========================================
// DINHEIRO
// ==========================================

function dinheiro(valor) {

return Number(valor).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
});

}

// ==========================================
// MÊS ATUAL
// ==========================================

function definirMes() {

const agora = new Date();

const texto = agora.toLocaleDateString(
    "pt-BR",
    {
        month: "long",
        year: "numeric"
    }
);

document.getElementById("mesAtual").textContent =
    texto.charAt(0).toUpperCase() + texto.slice(1);

}

// ==========================================
// CALCULAR TOTAL
// ==========================================

function totalGastos() {

const agora = new Date();

const mesAtual = agora.getMonth();
const anoAtual = agora.getFullYear();

return dados.gastos
    .filter(gasto => {

        const data = new Date(
            gasto.data + "T12:00:00"
        );

        return (
            data.getMonth() === mesAtual &&
            data.getFullYear() === anoAtual
        );

    })
    .reduce(
        (total, gasto) =>
            total + Number(gasto.valor),
        0
    );

}

// ==========================================
// ATUALIZAR PAINEL
// ==========================================

function atualizarPainel() {

const agora = new Date();

const mesAtual = agora.getMonth();
const anoAtual = agora.getFullYear();


const gastosMes = dados.gastos.filter(gasto => {

    const data = new Date(
        gasto.data + "T12:00:00"
    );

    return (
        data.getMonth() === mesAtual &&
        data.getFullYear() === anoAtual
    );

});


const receitas =
    Number(dados.receitas.luiza) +
    Number(dados.receitas.daniel) +
    Number(dados.receitas.outras);


const gastos =
    gastosMes.reduce(
        (total, gasto) =>
            total + Number(gasto.valor),
        0
    );


const saldo = receitas - gastos;


const porcentagem =
    receitas > 0
        ? (gastos / receitas) * 100
        : 0;


// RESUMO

document.getElementById("receitas")
    .textContent = dinheiro(receitas);

document.getElementById("gastos")
    .textContent = dinheiro(gastos);

document.getElementById("saldo")
    .textContent = dinheiro(saldo);

document.getElementById("disponivel")
    .textContent = dinheiro(saldo);

document.getElementById("porcentagem")
    .textContent =
    porcentagem.toFixed(0) + "%";


// ======================================
// CASA
// ======================================

atualizarCategoria(
    "casa",
    gastosMes
);


// ======================================
// LUIZA
// ======================================

atualizarCategoria(
    "luiza",
    gastosMes
);


// ======================================
// DANIEL
// ======================================

atualizarCategoria(
    "daniel",
    gastosMes
);


// ======================================
// CARRO
// ======================================

atualizarCategoria(
    "carro",
    gastosMes
);


// ======================================
// CARTÕES
// ======================================

const cartaoLuiza =
    gastosMes
        .filter(g => g.subcategoria === "cartao-luiza")
        .reduce(
            (t, g) => t + Number(g.valor),
            0
        );

const cartaoDaniel =
    gastosMes
        .filter(g => g.subcategoria === "cartao-daniel")
        .reduce(
            (t, g) => t + Number(g.valor),
            0
        );


document.getElementById("cartao-luiza")
    .textContent = dinheiro(cartaoLuiza);

document.getElementById("cartao-daniel")
    .textContent = dinheiro(cartaoDaniel);


renderizarLancamentos(
    gastosMes
);

}

// ==========================================
// ATUALIZAR CATEGORIA
// ==========================================

function atualizarCategoria(
categoria,
gastosMes
) {

const gastosCategoria =
    gastosMes.filter(
        gasto =>
            gasto.categoria === categoria
    );


const fixos =
    gastosCategoria
        .filter(g => g.tipo === "fixo")
        .reduce(
            (total, g) =>
                total + Number(g.valor),
            0
        );


const variaveis =
    gastosCategoria
        .filter(g => g.tipo === "variavel")
        .reduce(
            (total, g) =>
                total + Number(g.valor),
            0
        );


if (categoria === "casa") {

    document.getElementById("casa-fixos")
        .textContent = dinheiro(fixos);

    document.getElementById("casa-variaveis")
        .textContent = dinheiro(variaveis);

}


if (categoria === "luiza") {

    const clinica =
        gastosCategoria
            .filter(
                g =>
                    g.subcategoria ===
                    "luiza-clinica"
            )
            .reduce(
                (t, g) =>
                    t + Number(g.valor),
                0
            );


    const pessoal =
        gastosCategoria
            .filter(
                g =>
                    g.subcategoria ===
                    "luiza-pessoal"
            )
            .reduce(
                (t, g) =>
                    t + Number(g.valor),
                0
            );


    document.getElementById(
        "luiza-clinica"
    ).textContent = dinheiro(clinica);


    document.getElementById(
        "luiza-pessoal"
    ).textContent = dinheiro(pessoal);

}


if (categoria === "daniel") {

    const pessoal =
        gastosCategoria
            .filter(
                g =>
                    g.subcategoria ===
                    "daniel-pessoal"
            )
            .reduce(
                (t, g) =>
                    t + Number(g.valor),
                0
            );


    document.getElementById(
        "daniel-pessoal"
    ).textContent = dinheiro(pessoal);

}


if (categoria === "carro") {

    document.getElementById("carro-fixos")
        .textContent = dinheiro(fixos);

    document.getElementById("carro-variaveis")
        .textContent = dinheiro(variaveis);

}

}

// ==========================================
// ABRIR GASTO
// ==========================================

function abrirGasto(categoria) {

const select =
    document.getElementById("subcategoria");


select.innerHTML = "";


let opcoes = [];


if (categoria === "casa") {

    opcoes = [
        ["casa-fixos", "Casa — gasto fixo"],
        ["casa-variaveis", "Casa — gasto variável"]
    ];

}


if (categoria === "luiza") {

    opcoes = [
        ["luiza-clinica", "Luiza — clínica"],
        ["luiza-pessoal", "Luiza — pessoal"]
    ];

}


if (categoria === "daniel") {

    opcoes = [
        ["daniel-pessoal", "Daniel — pessoal"]
    ];

}


if (categoria === "carro") {

    opcoes = [
        ["carro-fixos", "Carro — gasto fixo"],
        ["carro-variaveis", "Carro — gasto variável"]
    ];

}


opcoes.forEach(
    ([valor, texto]) => {

        const option =
            document.createElement("option");

        option.value = valor;
        option.textContent = texto;

        select.appendChild(option);

    }
);


document.getElementById("formGasto")
    .dataset.categoria = categoria;


document.getElementById("data").value =
    dataHoje();


document.getElementById("modalGasto")
    .classList.add("aberto");

}

// ==========================================
// DATA DE HOJE
// ==========================================

function dataHoje() {

const agora = new Date();

const ano = agora.getFullYear();

const mes =
    String(
        agora.getMonth() + 1
    ).padStart(2, "0");

const dia =
    String(
        agora.getDate()
    ).padStart(2, "0");

return `${ano}-${mes}-${dia}`;

}

// ==========================================
// FECHAR MODAL
// ==========================================

function fecharModal(id) {

document.getElementById(id)
    .classList.remove("aberto");

}

// ==========================================
// CADASTRAR GASTO
// ==========================================

document.getElementById(
"formGasto"
).addEventListener(
"submit",
function(event) {

    event.preventDefault();


    const descricao =
        document.getElementById(
            "descricao"
        ).value.trim();


    const valor =
        Number(
            document.getElementById(
                "valor"
            ).value
        );


    const data =
        document.getElementById(
            "data"
        ).value;


    const tipo =
        document.getElementById(
            "tipo"
        ).value;


    const subcategoria =
        document.getElementById(
            "subcategoria"
        ).value;


    const categoria =
        this.dataset.categoria;


    if (
        !descricao ||
        !valor ||
        !data
    ) {

        alert(
            "Preencha todos os campos."
        );

        return;

    }


    const gasto = {

        id: Date.now(),

        descricao,

        valor,

        data,

        tipo,

        categoria,

        subcategoria

    };


    dados.gastos.push(gasto);


    salvar();


    atualizarPainel();


    this.reset();


    fecharModal(
        "modalGasto"
    );


}

);

// ==========================================
// RECEITAS
// ==========================================

function abrirReceitas() {

document.getElementById(
    "receitaLuiza"
).value =
    dados.receitas.luiza || "";


document.getElementById(
    "receitaDaniel"
).value =
    dados.receitas.daniel || "";


document.getElementById(
    "outrasReceitas"
).value =
    dados.receitas.outras || "";


document.getElementById(
    "modalReceitas"
).classList.add("aberto");

}

document.getElementById(
"formReceitas"
).addEventListener(
"submit",
function(event) {

    event.preventDefault();


    dados.receitas.luiza =
        Number(
            document.getElementById(
                "receitaLuiza"
            ).value
        ) || 0;


    dados.receitas.daniel =
        Number(
            document.getElementById(
                "receitaDaniel"
            ).value
        ) || 0;


    dados.receitas.outras =
        Number(
            document.getElementById(
                "outrasReceitas"
            ).value
        ) || 0;


    salvar();


    atualizarPainel();


    fecharModal(
        "modalReceitas"
    );

}

);

// ==========================================
// LISTA DE LANÇAMENTOS
// ==========================================

function renderizarLancamentos(
gastosMes
) {

const lista =
    document.getElementById(
        "listaLancamentos"
    );


if (gastosMes.length === 0) {

    lista.innerHTML =
        `<p class="vazio">
            Nenhum lançamento neste mês.
        </p>`;

    return;

}


const ordenados =
    [...gastosMes].sort(
        (a, b) =>
            new Date(b.data) -
            new Date(a.data)
    );


lista.innerHTML =
    ordenados.map(
        gasto => `

        <div class="lancamento">

            <div class="lancamento-info">

                <div class="lancamento-icone">
                    ${iconeCategoria(gasto.categoria)}
                </div>

                <div>

                    <div class="lancamento-nome">
                        ${escaparHTML(gasto.descricao)}
                    </div>

                    <div class="lancamento-data">
                        ${formatarData(gasto.data)}
                    </div>

                </div>

            </div>


            <div class="lancamento-direita">

                <span class="lancamento-valor">
                    ${dinheiro(gasto.valor)}
                </span>

                <button
                    class="btn-excluir"
                    onclick="excluirGasto(${gasto.id})"
                    title="Excluir"
                >
                    🗑️
                </button>

            </div>

        </div>

    `
    ).join("");

}

// ==========================================
// ÍCONE
// ==========================================

function iconeCategoria(categoria) {

const icones = {

    casa: "🏠",

    luiza: "👩🏻",

    daniel: "👨🏻",

    carro: "🚗"

};


return icones[categoria] || "💸";

}

// ==========================================
// DATA FORMATADA
// ==========================================

function formatarData(data) {

const partes =
    data.split("-");

return `${partes[2]}/${partes[1]}/${partes[0]}`;

}

// ==========================================
// EXCLUIR
// ==========================================

function excluirGasto(id) {

const confirmar =
    confirm(
        "Deseja excluir este gasto?"
    );


if (!confirmar) return;


dados.gastos =
    dados.gastos.filter(
        gasto =>
            gasto.id !== id
    );


salvar();

atualizarPainel();

}

// ==========================================
// SEGURANÇA PARA DESCRIÇÃO
// ==========================================

function escaparHTML(texto) {

const div =
    document.createElement("div");

div.textContent = texto;

return div.innerHTML;

}

// ==========================================
// FECHAR MODAIS CLICANDO FORA
// ==========================================

document.querySelectorAll(".modal")
.forEach(modal => {

    modal.addEventListener(
        "click",
        function(event) {

            if (
                event.target === modal
            ) {

                modal.classList.remove(
                    "aberto"
                );

            }

        }
    );

});

// ==========================================
// INICIAR
// ==========================================

document.addEventListener(
"DOMContentLoaded",
function() {

    definirMes();

    atualizarPainel();

}

);
