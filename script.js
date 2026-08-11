/* =========================================
NOSSA VIDA FINANCEIRA
VERSÃO FUNCIONAL
========================================= */

/* =========================================
DADOS
========================================= */

let dados;

try {

dados = JSON.parse(
    localStorage.getItem("nossaVidaFinanceira")
);

} catch (erro) {

dados = null;

}

if (!dados) {

dados = {

    receitas: {
        luiza: 0,
        daniel: 0,
        outras: 0
    },

    gastos: []

};

}

/* =========================================
ELEMENTOS
========================================= */

const modalGasto =
document.getElementById("modalGasto");

const modalReceitas =
document.getElementById("modalReceitas");

const formGasto =
document.getElementById("formGasto");

const formReceitas =
document.getElementById("formReceitas");

/* =========================================
SALVAR
========================================= */

function salvarDados() {

localStorage.setItem(
    "nossaVidaFinanceira",
    JSON.stringify(dados)
);

}

/* =========================================
DINHEIRO
========================================= */

function dinheiro(valor) {

return Number(valor || 0).toLocaleString(
    "pt-BR",
    {
        style: "currency",
        currency: "BRL"
    }
);

}

/* =========================================
DATA DE HOJE
========================================= */

function hoje() {

const agora = new Date();

const ano =
    agora.getFullYear();

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

/* =========================================
ABRIR MODAL DE GASTO
========================================= */

function abrirGasto(categoria) {

const select =
    document.getElementById(
        "subcategoria"
    );

select.innerHTML = "";


if (categoria === "casa") {

    adicionarOpcao(
        select,
        "casa-fixos",
        "Casa — gasto fixo"
    );

    adicionarOpcao(
        select,
        "casa-variaveis",
        "Casa — gasto variável"
    );

}


if (categoria === "luiza") {

    adicionarOpcao(
        select,
        "luiza-clinica",
        "Luiza — clínica"
    );

    adicionarOpcao(
        select,
        "luiza-pessoal",
        "Luiza — pessoal"
    );

}


if (categoria === "daniel") {

    adicionarOpcao(
        select,
        "daniel-pessoal",
        "Daniel — pessoal"
    );

}


if (categoria === "carro") {

    adicionarOpcao(
        select,
        "carro-fixos",
        "Carro — gasto fixo"
    );

    adicionarOpcao(
        select,
        "carro-variaveis",
        "Carro — gasto variável"
    );

}


formGasto.dataset.categoria =
    categoria;


document.getElementById("data").value =
    hoje();


document.getElementById("descricao").value =
    "";

document.getElementById("valor").value =
    "";


modalGasto.classList.add("aberto");


setTimeout(
    function() {

        document
            .getElementById("descricao")
            .focus();

    },
    100
);

}

/* =========================================
OPÇÃO DO SELECT
========================================= */

function adicionarOpcao(
select,
valor,
texto
) {

const option =
    document.createElement("option");

option.value = valor;

option.textContent = texto;

select.appendChild(option);

}

/* =========================================
FECHAR MODAIS
========================================= */

function fecharGasto() {

modalGasto.classList.remove(
    "aberto"
);

}

function fecharReceitas() {

modalReceitas.classList.remove(
    "aberto"
);

}

/* =========================================
RECEITAS
========================================= */

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


modalReceitas.classList.add(
    "aberto"
);

}

/* =========================================
EVENTOS DOS BOTÕES
========================================= */

document
.getElementById("btnReceitas")
.addEventListener(
"click",
abrirReceitas
);

document
.getElementById("fecharGasto")
.addEventListener(
"click",
fecharGasto
);

document
.getElementById("fecharReceitas")
.addEventListener(
"click",
fecharReceitas
);

/* BOTÕES + ADICIONAR */

document
.querySelectorAll(".btn-adicionar")
.forEach(
function(botao) {

        botao.addEventListener(
            "click",
            function() {

                abrirGasto(
                    botao.dataset.categoria
                );

            }
        );

    }
);

/* =========================================
SALVAR GASTO
========================================= */

formGasto.addEventListener(
"submit",
function(event) {

    event.preventDefault();


    const descricao =
        document
            .getElementById("descricao")
            .value
            .trim();


    const valor =
        Number(
            document
                .getElementById("valor")
                .value
        );


    const data =
        document
            .getElementById("data")
            .value;


    const tipo =
        document
            .getElementById("tipo")
            .value;


    const subcategoria =
        document
            .getElementById("subcategoria")
            .value;


    const categoria =
        formGasto.dataset.categoria;


    if (
        !descricao ||
        valor <= 0 ||
        !data
    ) {

        alert(
            "Preencha a descrição, o valor e a data."
        );

        return;

    }


    const novoGasto = {

        id: Date.now(),

        descricao: descricao,

        valor: valor,

        data: data,

        tipo: tipo,

        categoria: categoria,

        subcategoria: subcategoria

    };


    dados.gastos.push(
        novoGasto
    );


    salvarDados();

    atualizarTudo();

    fecharGasto();

}

);

/* =========================================
SALVAR RECEITAS
========================================= */

formReceitas.addEventListener(
"submit",
function(event) {

    event.preventDefault();


    dados.receitas.luiza =
        Number(
            document
                .getElementById(
                    "receitaLuiza"
                )
                .value
        ) || 0;


    dados.receitas.daniel =
        Number(
            document
                .getElementById(
                    "receitaDaniel"
                )
                .value
        ) || 0;


    dados.receitas.outras =
        Number(
            document
                .getElementById(
                    "outrasReceitas"
                )
                .value
        ) || 0;


    salvarDados();

    atualizarTudo();

    fecharReceitas();

}

);

/* =========================================
GASTOS DO MÊS
========================================= */

function gastosDoMes() {

const agora =
    new Date();

const mes =
    agora.getMonth();

const ano =
    agora.getFullYear();


return dados.gastos.filter(
    function(gasto) {

        const data =
            new Date(
                gasto.data +
                "T12:00:00"
            );

        return (
            data.getMonth() === mes &&
            data.getFullYear() === ano
        );

    }
);

}

/* =========================================
ATUALIZAR TUDO
========================================= */

function atualizarTudo() {

const gastos =
    gastosDoMes();


const receitas =
    Number(
        dados.receitas.luiza
    ) +

    Number(
        dados.receitas.daniel
    ) +

    Number(
        dados.receitas.outras
    );


const totalGastos =
    gastos.reduce(
        function(total, gasto) {

            return (
                total +
                Number(gasto.valor)
            );

        },
        0
    );


const saldo =
    receitas -
    totalGastos;


let percentual = 0;


if (receitas > 0) {

    percentual =
        (totalGastos / receitas) *
        100;

}


document.getElementById(
    "totalReceitas"
).textContent =
    dinheiro(receitas);


document.getElementById(
    "totalGastos"
).textContent =
    dinheiro(totalGastos);


document.getElementById(
    "saldo"
).textContent =
    dinheiro(saldo);


document.getElementById(
    "disponivel"
).textContent =
    dinheiro(saldo);


document.getElementById(
    "percentual"
).textContent =
    percentual.toFixed(0) +
    "%";


atualizarCasa(gastos);

atualizarLuiza(gastos);

atualizarDaniel(gastos);

atualizarCarro(gastos);

atualizarCartoes(gastos);

atualizarLancamentos(gastos);

}

/* =========================================
CASA
========================================= */

function atualizarCasa(gastos) {

const fixos =
    somar(
        gastos.filter(
            g =>
                g.subcategoria ===
                "casa-fixos"
        )
    );


const variaveis =
    somar(
        gastos.filter(
            g =>
                g.subcategoria ===
                "casa-variaveis"
        )
    );


document.getElementById(
    "casaFixos"
).textContent =
    dinheiro(fixos);


document.getElementById(
    "casaVariaveis"
).textContent =
    dinheiro(variaveis);

}

/* =========================================
LUIZA
========================================= */

function atualizarLuiza(gastos) {

const clinica =
    somar(
        gastos.filter(
            g =>
                g.subcategoria ===
                "luiza-clinica"
        )
    );


const pessoal =
    somar(
        gastos.filter(
            g =>
                g.subcategoria ===
                "luiza-pessoal"
        )
    );


document.getElementById(
    "luizaClinica"
).textContent =
    dinheiro(clinica);


document.getElementById(
    "luizaPessoal"
).textContent =
    dinheiro(pessoal);

}

/* =========================================
DANIEL
========================================= */

function atualizarDaniel(gastos) {

const pessoal =
    somar(
        gastos.filter(
            g =>
                g.subcategoria ===
                "daniel-pessoal"
        )
    );


document.getElementById(
    "danielPessoal"
).textContent =
    dinheiro(pessoal);

}

/* =========================================
CARRO
========================================= */

function atualizarCarro(gastos) {

const fixos =
    somar(
        gastos.filter(
            g =>
                g.subcategoria ===
                "carro-fixos"
        )
    );


const variaveis =
    somar(
        gastos.filter(
            g =>
                g.subcategoria ===
                "carro-variaveis"
        )
    );


document.getElementById(
    "carroFixos"
).textContent =
    dinheiro(fixos);


document.getElementById(
    "carroVariaveis"
).textContent =
    dinheiro(variaveis);

}

/* =========================================
CARTÕES
========================================= */

function atualizarCartoes(gastos) {

const luiza =
    somar(
        gastos.filter(
            g =>
                g.subcategoria ===
                "cartao-luiza"
        )
    );


const daniel =
    somar(
        gastos.filter(
            g =>
                g.subcategoria ===
                "cartao-daniel"
        )
    );


document.getElementById(
    "cartaoLuiza"
).textContent =
    dinheiro(luiza);


document.getElementById(
    "cartaoDaniel"
).textContent =
    dinheiro(daniel);

}

/* =========================================
SOMAR
========================================= */

function somar(lista) {

return lista.reduce(
    function(total, item) {

        return (
            total +
            Number(item.valor)
        );

    },
    0
);

}

/* =========================================
LANÇAMENTOS
========================================= */

function atualizarLancamentos(gastos) {

const lista =
    document.getElementById(
        "listaLancamentos"
    );


if (gastos.length === 0) {

    lista.innerHTML =
        `<p class="vazio">
            Nenhum lançamento neste mês.
        </p>`;

    return;

}


const ordenados =
    [...gastos].sort(
        function(a, b) {

            return (
                new Date(b.data) -
                new Date(a.data)
            );

        }
    );


lista.innerHTML = "";


ordenados.forEach(
    function(gasto) {

        const item =
            document.createElement(
                "div"
            );

        item.className =
            "lancamento";


        item.innerHTML = `

            <div class="lancamento-info">

                <div class="lancamento-icone">
                    ${icone(gasto.categoria)}
                </div>

                <div>

                    <div class="lancamento-nome">
                        ${textoSeguro(gasto.descricao)}
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
                    data-id="${gasto.id}"
                >
                    🗑️
                </button>

            </div>

        `;


        item
            .querySelector(
                ".btn-excluir"
            )
            .addEventListener(
                "click",
                function() {

                    excluirGasto(
                        gasto.id
                    );

                }
            );


        lista.appendChild(item);

    }
);

}

/* =========================================
EXCLUIR
========================================= */

function excluirGasto(id) {

const confirmar =
    confirm(
        "Deseja excluir este gasto?"
    );


if (!confirmar) {
    return;
}


dados.gastos =
    dados.gastos.filter(
        function(gasto) {

            return gasto.id !== id;

        }
    );


salvarDados();

atualizarTudo();

}

/* =========================================
ÍCONES
========================================= */

function icone(categoria) {

if (categoria === "casa") {
    return "🏠";
}

if (categoria === "luiza") {
    return "👩🏻";
}

if (categoria === "daniel") {
    return "👨🏻";
}

if (categoria === "carro") {
    return "🚗";
}

return "💸";

}

/* =========================================
DATA
========================================= */

function formatarData(data) {

const partes =
    data.split("-");


return (
    partes[2] +
    "/" +
    partes[1] +
    "/" +
    partes[0]
);

}

/* =========================================
SEGURANÇA
========================================= */

function textoSeguro(texto) {

const div =
    document.createElement(
        "div"
    );

div.textContent = texto;

return div.innerHTML;

}

/* =========================================
MÊS
========================================= */

function mostrarMes() {

const agora =
    new Date();


let texto =
    agora.toLocaleDateString(
        "pt-BR",
        {
            month: "long",
            year: "numeric"
        }
    );


texto =
    texto.charAt(0).toUpperCase() +
    texto.slice(1);


document.getElementById(
    "mesAtual"
).textContent =
    texto;

}

/* =========================================
FECHAR AO CLICAR FORA
========================================= */

document
.querySelectorAll(".modal")
.forEach(
function(modal) {

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

    }
);

/* =========================================
INICIAR
========================================= */

mostrarMes();

atualizarTudo();
