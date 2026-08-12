/* =========================================
NOSSA VIDA FINANCEIRA
VERSÃO 3
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

/* Compatibilidade com versões anteriores */

if (!dados.receitas) {

dados.receitas = {
    luiza: 0,
    daniel: 0,
    outras: 0
};

}

if (!dados.gastos) {

dados.gastos = [];

}

/* =========================================
ELEMENTOS
========================================= */

const modalGasto =
document.getElementById("modalGasto");

const modalReceitas =
document.getElementById("modalReceitas");

const modalLista =
document.getElementById("modalLista");

const modalMeta =
document.getElementById("modalMeta");

const formGasto =
document.getElementById("formGasto");

const formReceitas =
document.getElementById("formReceitas");

const formMeta =
document.getElementById("formMeta");

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
DATA
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

function adicionarMes(data, quantidade) {

const partes =
    data.split("-");

const ano =
    Number(partes[0]);

const mes =
    Number(partes[1]) - 1;

const dia =
    Number(partes[2]);


const novaData =
    new Date(
        ano,
        mes + quantidade,
        dia
    );


/*
   Corrige datas como 31/02,
   levando para o último dia
   possível do mês.
*/

const ultimoDia =
    new Date(
        novaData.getFullYear(),
        novaData.getMonth() + 1,
        0
    ).getDate();


const diaFinal =
    Math.min(
        dia,
        ultimoDia
    );


const anoFinal =
    novaData.getFullYear();

const mesFinal =
    String(
        novaData.getMonth() + 1
    ).padStart(2, "0");

const diaFormatado =
    String(
        diaFinal
    ).padStart(2, "0");


return `${anoFinal}-${mesFinal}-${diaFormatado}`;

}

/* =========================================
FORMATAÇÃO
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

function textoSeguro(texto) {

const div =
    document.createElement("div");

div.textContent = texto;

return div.innerHTML;

}

/* =========================================
CATEGORIAS
========================================= */

const nomesCategorias = {

"casa-fixos":
    "Gastos fixos da casa",

"casa-variaveis":
    "Gastos variáveis da casa",

"luiza-clinica":
    "Gastos da clínica",

"luiza-pessoal":
    "Gastos pessoais da Luiza",

"daniel-pessoal":
    "Gastos pessoais do Daniel",

"carro-fixos":
    "Gastos fixos do carro",

"carro-variaveis":
    "Gastos variáveis do carro",

"cartao-luiza":
    "Gastos do cartão da Luiza",

"cartao-daniel":
    "Gastos do cartão do Daniel"

};

/* =========================================
ABRIR GASTO
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


/*
   Quando o botão vem do cartão,
   a categoria já é conhecida.
*/

if (
    categoria === "cartao-luiza"
) {

    adicionarOpcao(
        select,
        "cartao-luiza",
        "Cartão Luiza"
    );

}


if (
    categoria === "cartao-daniel"
) {

    adicionarOpcao(
        select,
        "cartao-daniel",
        "Cartão Daniel"
    );

}


formGasto.dataset.categoria =
    categoria;


document.getElementById(
    "data"
).value = hoje();


document.getElementById(
    "descricao"
).value = "";


document.getElementById(
    "valor"
).value = "";


document.getElementById(
    "pagamento"
).value =
    categoria === "cartao-luiza"
        ? "cartao-luiza"
        : categoria === "cartao-daniel"
            ? "cartao-daniel"
            : "pix";


document.getElementById(
    "parcelado"
).value = "nao";


document.getElementById(
    "numeroParcelas"
).value = 2;


document.getElementById(
    "campoParcelas"
).classList.add(
    "campo-oculto"
);


atualizarPreviewParcelamento();


modalGasto.classList.add(
    "aberto"
);


setTimeout(
    function() {

        document
            .getElementById("descricao")
            .focus();

    },
    100
);

}

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
MODAIS
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

document
.getElementById("fecharLista")
.addEventListener(
"click",
function() {

        modalLista.classList.remove(
            "aberto"
        );

    }
);

document
.getElementById("fecharMeta")
.addEventListener(
"click",
function() {

        modalMeta.classList.remove(
            "aberto"
        );

    }
);

/* =========================================
BOTÕES + ADICIONAR
========================================= */

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
CARTÕES
========================================= */

document
.querySelectorAll("[data-cartao]")
.forEach(
function(botao) {

        botao.addEventListener(
            "click",
            function() {

                abrirGasto(
                    botao.dataset.cartao
                );

            }
        );

    }
);

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

document
.getElementById("btnReceitas")
.addEventListener(
"click",
abrirReceitas
);

/* =========================================
PARCELAMENTO
========================================= */

document
.getElementById("parcelado")
.addEventListener(
"change",
function() {

        const campo =
            document.getElementById(
                "campoParcelas"
            );


        if (
            this.value === "sim"
        ) {

            campo.classList.remove(
                "campo-oculto"
            );

        } else {

            campo.classList.add(
                "campo-oculto"
            );

        }


        atualizarPreviewParcelamento();

    }
);

document
.getElementById("numeroParcelas")
.addEventListener(
"input",
atualizarPreviewParcelamento
);

document
.getElementById("valor")
.addEventListener(
"input",
atualizarPreviewParcelamento
);

function atualizarPreviewParcelamento() {

const parcelado =
    document.getElementById(
        "parcelado"
    ).value;


const preview =
    document.getElementById(
        "previewParcelamento"
    );


if (
    parcelado !== "sim"
) {

    preview.innerHTML = "";

    return;

}


const valor =
    Number(
        document.getElementById(
            "valor"
        ).value
    );


const quantidade =
    Number(
        document.getElementById(
            "numeroParcelas"
        ).value
    );


if (
    !valor ||
    !quantidade ||
    quantidade < 2
) {

    preview.innerHTML =
        "Informe o valor e o número de parcelas.";

    return;

}


const parcela =
    valor / quantidade;


preview.innerHTML = `

    <strong>
        ${quantidade} parcelas de
        ${dinheiro(parcela)}
    </strong>

    <br>

    Total da compra:
    ${dinheiro(valor)}

`;

}

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


    const pagamento =
        document
            .getElementById("pagamento")
            .value;


    const parcelado =
        document
            .getElementById("parcelado")
            .value;


    const quantidadeParcelas =
        Number(
            document
                .getElementById(
                    "numeroParcelas"
                )
                .value
        );


    const subcategoria =
        document
            .getElementById(
                "subcategoria"
            )
            .value;


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


    /*
       Se veio de um cartão,
       usamos automaticamente a
       categoria do cartão.
    */

    let categoria =
        formGasto.dataset.categoria;


    if (
        pagamento === "cartao-luiza" &&
        (
            categoria === "cartao-luiza"
        )
    ) {

        categoria =
            "cartao-luiza";

    }


    if (
        pagamento === "cartao-daniel" &&
        (
            categoria === "cartao-daniel"
        )
    ) {

        categoria =
            "cartao-daniel";

    }


    /*
       À vista
    */

    if (
        parcelado !== "sim"
    ) {

        const novoGasto = {

            id: Date.now(),

            descricao: descricao,

            valor: valor,

            valorTotal: valor,

            data: data,

            tipo: tipo,

            pagamento: pagamento,

            categoria: categoria,

            subcategoria: subcategoria,

            parcelado: false,

            parcelaAtual: 1,

            totalParcelas: 1,

            grupoParcela: null

        };


        /*
           Se foi escolhido um cartão
           enquanto estamos dentro de
           outra categoria, mantemos a
           categoria original.
        */

        if (
            pagamento === "cartao-luiza" &&
            categoria !== "cartao-luiza" &&
            categoria !== "cartao-daniel"
        ) {

            novoGasto.cartao =
                "cartao-luiza";

        }


        if (
            pagamento === "cartao-daniel" &&
            categoria !== "cartao-luiza" &&
            categoria !== "cartao-daniel"
        ) {

            novoGasto.cartao =
                "cartao-daniel";

        }


        dados.gastos.push(
            novoGasto
        );

    }


    /*
       Parcelado
    */

    else {

        if (
            quantidadeParcelas < 2
        ) {

            alert(
                "Uma compra parcelada precisa ter pelo menos 2 parcelas."
            );

            return;

        }


        const grupo =
            Date.now();


        const valorBase =
            Math.floor(
                (
                    valor /
                    quantidadeParcelas
                ) * 100
            ) / 100;


        const valorUltima =
            Math.round(
                (
                    valor -
                    (
                        valorBase *
                        (
                            quantidadeParcelas - 1
                        )
                    )
                ) * 100
            ) / 100;


        for (
            let i = 0;
            i < quantidadeParcelas;
            i++
        ) {

            const valorParcela =
                i === quantidadeParcelas - 1
                    ? valorUltima
                    : valorBase;


            const dataParcela =
                adicionarMes(
                    data,
                    i
                );


            const parcela = {

                id:
                    grupo + i,

                descricao:
                    descricao,

                valor:
                    valorParcela,

                valorTotal:
                    valor,

                data:
                    dataParcela,

                tipo:
                    tipo,

                pagamento:
                    pagamento,

                categoria:
                    categoria,

                subcategoria:
                    subcategoria,

                parcelado:
                    true,

                parcelaAtual:
                    i + 1,

                totalParcelas:
                    quantidadeParcelas,

                grupoParcela:
                    grupo

            };


            if (
                pagamento === "cartao-luiza" &&
                categoria !== "cartao-luiza" &&
                categoria !== "cartao-daniel"
            ) {

                parcela.cartao =
                    "cartao-luiza";

            }


            if (
                pagamento === "cartao-daniel" &&
                categoria !== "cartao-luiza" &&
                categoria !== "cartao-daniel"
            ) {

                parcela.cartao =
                    "cartao-daniel";

            }


            dados.gastos.push(
                parcela
            );

        }

    }


    salvarDados();

    atualizarTudo();

    fecharGasto();

}

);

/* =========================================
RECEITAS
========================================= */

formReceitas.addEventListener(
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
    somar(gastos);


const saldo =
    receitas -
    totalGastos;


let percentual = 0;


if (
    receitas > 0
) {

    percentual =
        (
            totalGastos /
            receitas
        ) * 100;

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

function gastoPertenceAoCartao(
gasto,
cartao
) {

return (
    gasto.pagamento === cartao ||
    gasto.cartao === cartao ||
    gasto.subcategoria === cartao
);

}

function atualizarCartoes(gastos) {

const luiza =
    somar(
        gastos.filter(
            g =>
                gastoPertenceAoCartao(
                    g,
                    "cartao-luiza"
                )
        )
    );


const daniel =
    somar(
        gastos.filter(
            g =>
                gastoPertenceAoCartao(
                    g,
                    "cartao-daniel"
                )
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


if (
    gastos.length === 0
) {

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


        let parcelaTexto = "";


        if (
            gasto.parcelado
        ) {

            parcelaTexto =
                ` • ${gasto.parcelaAtual}/${gasto.totalParcelas}`;

        }


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
                        ${parcelaTexto}
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

const gasto =
    dados.gastos.find(
        g =>
            g.id === id
    );


if (!gasto) {
    return;
}


let mensagem =
    "Deseja excluir este gasto?";


if (
    gasto.parcelado &&
    gasto.grupoParcela
) {

    mensagem =
        "Esta compra é parcelada. Deseja excluir TODAS as parcelas desta compra?";

}


const confirmar =
    confirm(mensagem);


if (!confirmar) {
    return;
}


if (
    gasto.parcelado &&
    gasto.grupoParcela
) {

    dados.gastos =
        dados.gastos.filter(
            g =>
                g.grupoParcela !==
                gasto.grupoParcela
        );

} else {

    dados.gastos =
        dados.gastos.filter(
            g =>
                g.id !== id
        );

}


salvarDados();

atualizarTudo();

}

/* =========================================
LISTAS INDIVIDUAIS
========================================= */

function abrirLista(categoria) {

const gastos =
    gastosDoMes().filter(
        function(gasto) {

            if (
                categoria ===
                "cartao-luiza"
            ) {

                return gastoPertenceAoCartao(
                    gasto,
                    "cartao-luiza"
                );

            }


            if (
                categoria ===
                "cartao-daniel"
            ) {

                return gastoPertenceAoCartao(
                    gasto,
                    "cartao-daniel"
                );

            }


            return (
                gasto.subcategoria ===
                categoria
            );

        }
    );


document.getElementById(
    "tituloLista"
).textContent =
    nomesCategorias[categoria] ||
    "Lista de gastos";


const conteudo =
    document.getElementById(
        "conteudoLista"
    );


conteudo.innerHTML = "";


const total =
    somar(gastos);


const totalElemento =
    document.createElement("div");


totalElemento.className =
    "total-lista";


totalElemento.innerHTML = `

    <span>
        Total no mês
    </span>

    <strong>
        ${dinheiro(total)}
    </strong>

`;


conteudo.appendChild(
    totalElemento
);


if (
    gastos.length === 0
) {

    const vazio =
        document.createElement("p");


    vazio.className =
        "vazio";


    vazio.textContent =
        "Nenhum gasto registrado nesta categoria neste mês.";


    conteudo.appendChild(
        vazio
    );


    modalLista.classList.add(
        "aberto"
    );

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


ordenados.forEach(
    function(gasto) {

        const item =
            document.createElement(
                "div"
            );


        item.className =
            "item-lista";


        let parcelaTexto =
            "";


        if (
            gasto.parcelado
        ) {

            parcelaTexto =
                ` • Parcela ${gasto.parcelaAtual}/${gasto.totalParcelas}`;

        }


        let pagamentoTexto =
            "";


        if (
            gasto.pagamento ===
            "cartao-luiza"
        ) {

            pagamentoTexto =
                " • Cartão Luiza";

        }


        if (
            gasto.pagamento ===
            "cartao-daniel"
        ) {

            pagamentoTexto =
                " • Cartão Daniel";

        }


        item.innerHTML = `

            <div class="item-lista-info">

                <div class="item-lista-nome">
                    ${textoSeguro(gasto.descricao)}
                </div>

                <div class="item-lista-detalhes">

                    ${formatarData(gasto.data)}
                    ${parcelaTexto}
                    ${pagamentoTexto}

                </div>

            </div>

            <div class="item-lista-valor">
                ${dinheiro(gasto.valor)}
            </div>

        `;


        conteudo.appendChild(
            item
        );

    }
);


modalLista.classList.add(
    "aberto"
);

}

document
.querySelectorAll(".btn-lista")
.forEach(
function(botao) {

        botao.addEventListener(
            "click",
            function() {

                abrirLista(
                    botao.dataset.lista
                );

            }
        );

    }
);

/* =========================================
META
========================================= */

let valorReserva =
Number(
localStorage.getItem(
"valorReservaEmergencia"
)
) || 0;

const metaReserva =
20000;

function atualizarMeta() {

const porcentagem =
    Math.min(
        (
            valorReserva /
            metaReserva
        ) * 100,
        100
    );


document.getElementById(
    "valorMeta"
).textContent =
    dinheiro(valorReserva);


document.getElementById(
    "progressoMeta"
).style.width =
    porcentagem + "%";


document.getElementById(
    "percentualMeta"
).textContent =
    porcentagem.toFixed(0) +
    "% concluído";

}

document
.getElementById(
"btnAdicionarMeta"
)
.addEventListener(
"click",
function() {

        document.getElementById(
            "valorMetaInput"
        ).value = "";


        modalMeta.classList.add(
            "aberto"
        );

    }
);

formMeta.addEventListener(
"submit",
function(event) {

    event.preventDefault();


    const valor =
        Number(
            document.getElementById(
                "valorMetaInput"
            ).value
        );


    if (
        !valor ||
        valor <= 0
    ) {

        alert(
            "Digite um valor válido."
        );

        return;

    }


    valorReserva += valor;


    localStorage.setItem(
        "valorReservaEmergencia",
        valorReserva
    );


    atualizarMeta();


    modalMeta.classList.remove(
        "aberto"
    );

}

);

/* =========================================
ÍCONES
========================================= */

function icone(categoria) {

if (
    categoria === "casa"
) {
    return "🏠";
}

if (
    categoria === "luiza"
) {
    return "👩🏻";
}

if (
    categoria === "daniel"
) {
    return "👨🏻";
}

if (
    categoria === "carro"
) {
    return "🚗";
}

if (
    categoria ===
    "cartao-luiza"
) {
    return "💳";
}

if (
    categoria ===
    "cartao-daniel"
) {
    return "💳";
}

return "💸";

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
FECHAR MODAIS CLICANDO FORA
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

atualizarMeta();
