/* =========================================================
   NOSSA VIDA FINANCEIRA
   SCRIPT.JS

   Recursos:
   - Receitas
   - Gastos da casa
   - Gastos Luiza
   - Gastos Daniel
   - Gastos do carro
   - Cartões
   - Metas
   - Parcelamentos
   - Lista de gastos
   - Status pago / pendente
   - Filtros
   - Saldo
   - Disponível
   - Salvamento automático no navegador
========================================================= */


/* =========================================================
   BANCO DE DADOS
========================================================= */

let dados;

try {
    dados = JSON.parse(
        localStorage.getItem("nossaVidaFinanceira")
    );
} catch (erro) {
    dados = null;
}


/* Caso não exista nenhum dado */

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


/* Compatibilidade */

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


/* Adiciona "pago" aos gastos antigos */

dados.gastos.forEach(function(gasto) {

    if (typeof gasto.pago === "undefined") {

        gasto.pago = false;

    }

});


/* =========================================================
   ELEMENTOS
========================================================= */

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


/* =========================================================
   SALVAR DADOS
========================================================= */

function salvarDados() {

    localStorage.setItem(
        "nossaVidaFinanceira",
        JSON.stringify(dados)
    );

}


/* =========================================================
   DINHEIRO
========================================================= */

function dinheiro(valor) {

    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


/* =========================================================
   DATA ATUAL
========================================================= */

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


/* =========================================================
   ADICIONAR MESES
========================================================= */

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


/* =========================================================
   FORMATAÇÃO DE DATA
========================================================= */

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


/* =========================================================
   PROTEÇÃO DE TEXTO
========================================================= */

function textoSeguro(texto) {

    const div =
        document.createElement("div");

    div.textContent =
        texto;

    return div.innerHTML;

}


/* =========================================================
   NOMES DAS CATEGORIAS
========================================================= */

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


/* =========================================================
   ABRIR MODAL DE GASTO
========================================================= */

function abrirGasto(categoria) {

    const select =
        document.getElementById(
            "subcategoria"
        );

    if (!select) {
        return;
    }

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


    if (categoria === "cartao-luiza") {

        adicionarOpcao(
            select,
            "cartao-luiza",
            "Cartão Luiza"
        );

    }


    if (categoria === "cartao-daniel") {

        adicionarOpcao(
            select,
            "cartao-daniel",
            "Cartão Daniel"
        );

    }


    formGasto.dataset.categoria =
        categoria;


    const campoData =
        document.getElementById("data");

    if (campoData) {

        campoData.value =
            hoje();

    }


    document.getElementById(
        "descricao"
    ).value = "";


    document.getElementById(
        "valor"
    ).value = "";


    const pagamento =
        document.getElementById(
            "pagamento"
        );


    if (
        categoria === "cartao-luiza"
    ) {

        pagamento.value =
            "cartao-luiza";

    }

    else if (
        categoria === "cartao-daniel"
    ) {

        pagamento.value =
            "cartao-daniel";

    }

    else {

        pagamento.value =
            "pix";

    }


    document.getElementById(
        "parcelado"
    ).value =
        "nao";


    document.getElementById(
        "numeroParcelas"
    ).value =
        2;


    const campoParcelas =
        document.getElementById(
            "campoParcelas"
        );


    if (campoParcelas) {

        campoParcelas.classList.add(
            "campo-oculto"
        );

    }


    atualizarPreviewParcelamento();


    modalGasto.classList.add(
        "aberto"
    );


    setTimeout(
        function() {

            const campo =
                document.getElementById(
                    "descricao"
                );

            if (campo) {

                campo.focus();

            }

        },
        100
    );

}


/* =========================================================
   ADICIONAR OPÇÃO AO SELECT
========================================================= */

function adicionarOpcao(
    select,
    valor,
    texto
) {

    const option =
        document.createElement(
            "option"
        );

    option.value =
        valor;

    option.textContent =
        texto;

    select.appendChild(
        option
    );

}


/* =========================================================
   FECHAR MODAIS
========================================================= */

function fecharGasto() {

    if (modalGasto) {

        modalGasto.classList.remove(
            "aberto"
        );

    }

}


function fecharReceitas() {

    if (modalReceitas) {

        modalReceitas.classList.remove(
            "aberto"
        );

    }

}


/* =========================================================
   BOTÕES DE FECHAR
========================================================= */

const fecharGastoBtn =
    document.getElementById(
        "fecharGasto"
    );

if (fecharGastoBtn) {

    fecharGastoBtn.addEventListener(
        "click",
        fecharGasto
    );

}


const fecharReceitasBtn =
    document.getElementById(
        "fecharReceitas"
    );

if (fecharReceitasBtn) {

    fecharReceitasBtn.addEventListener(
        "click",
        fecharReceitas
    );

}


const fecharListaBtn =
    document.getElementById(
        "fecharLista"
    );

if (fecharListaBtn) {

    fecharListaBtn.addEventListener(
        "click",
        function() {

            modalLista.classList.remove(
                "aberto"
            );

        }
    );

}


const fecharMetaBtn =
    document.getElementById(
        "fecharMeta"
    );

if (fecharMetaBtn) {

    fecharMetaBtn.addEventListener(
        "click",
        function() {

            modalMeta.classList.remove(
                "aberto"
            );

        }
    );

}


/* =========================================================
   BOTÕES ADICIONAR
========================================================= */

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


/* =========================================================
   BOTÕES DOS CARTÕES
========================================================= */

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


/* =========================================================
   RECEITAS
========================================================= */

function abrirReceitas() {

    const campoLuiza =
        document.getElementById(
            "receitaLuiza"
        );

    const campoDaniel =
        document.getElementById(
            "receitaDaniel"
        );

    const campoOutras =
        document.getElementById(
            "outrasReceitas"
        );


    if (campoLuiza) {

        campoLuiza.value =
            dados.receitas.luiza || "";

    }


    if (campoDaniel) {

        campoDaniel.value =
            dados.receitas.daniel || "";

    }


    if (campoOutras) {

        campoOutras.value =
            dados.receitas.outras || "";

    }


    modalReceitas.classList.add(
        "aberto"
    );

}


const btnReceitas =
    document.getElementById(
        "btnReceitas"
    );


if (btnReceitas) {

    btnReceitas.addEventListener(
        "click",
        abrirReceitas
    );

}


/* =========================================================
   PARCELAMENTO
========================================================= */

const campoParcelado =
    document.getElementById(
        "parcelado"
    );


if (campoParcelado) {

    campoParcelado.addEventListener(
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

            }

            else {

                campo.classList.add(
                    "campo-oculto"
                );

            }


            atualizarPreviewParcelamento();

        }
    );

}


const campoNumeroParcelas =
    document.getElementById(
        "numeroParcelas"
    );


if (campoNumeroParcelas) {

    campoNumeroParcelas.addEventListener(
        "input",
        atualizarPreviewParcelamento
    );

}


const campoValor =
    document.getElementById(
        "valor"
    );


if (campoValor) {

    campoValor.addEventListener(
        "input",
        atualizarPreviewParcelamento
    );

}


/* =========================================================
   PREVIEW DO PARCELAMENTO
========================================================= */

function atualizarPreviewParcelamento() {

    const campoParcelado =
        document.getElementById(
            "parcelado"
        );

    const preview =
        document.getElementById(
            "previewParcelamento"
        );


    if (
        !campoParcelado ||
        !preview
    ) {

        return;

    }


    if (
        campoParcelado.value !==
        "sim"
    ) {

        preview.innerHTML =
            "";

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
        valor /
        quantidade;


    preview.innerHTML = `

        <strong>
            ${quantidade}
            parcelas de
            ${dinheiro(parcela)}
        </strong>

        <br>

        Total da compra:
        ${dinheiro(valor)}

    `;

}


/* =========================================================
   SALVAR GASTO
========================================================= */

if (formGasto) {

    formGasto.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const descricao =
                document
                    .getElementById(
                        "descricao"
                    )
                    .value
                    .trim();


            const valor =
                Number(
                    document
                        .getElementById(
                            "valor"
                        )
                        .value
                );


            const data =
                document
                    .getElementById(
                        "data"
                    )
                    .value;


            const tipo =
                document
                    .getElementById(
                        "tipo"
                    )
                    .value;


            const pagamento =
                document
                    .getElementById(
                        "pagamento"
                    )
                    .value;


            const parcelado =
                document
                    .getElementById(
                        "parcelado"
                    )
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


            const categoria =
                formGasto.dataset.categoria;


            /* =====================================================
               GASTO À VISTA
            ===================================================== */

            if (
                parcelado !== "sim"
            ) {

                const novoGasto = {

                    id:
                        Date.now(),

                    descricao:
                        descricao,

                    valor:
                        valor,

                    valorTotal:
                        valor,

                    data:
                        data,

                    tipo:
                        tipo,

                    pagamento:
                        pagamento,

                    categoria:
                        categoria,

                    subcategoria:
                        subcategoria,

                    parcelado:
                        false,

                    parcelaAtual:
                        1,

                    totalParcelas:
                        1,

                    grupoParcela:
                        null,

                    pago:
                        false

                };


                if (
                    pagamento ===
                    "cartao-luiza"
                ) {

                    novoGasto.cartao =
                        "cartao-luiza";

                }


                if (
                    pagamento ===
                    "cartao-daniel"
                ) {

                    novoGasto.cartao =
                        "cartao-daniel";

                }


                dados.gastos.push(
                    novoGasto
                );

            }


            /* =====================================================
               GASTO PARCELADO
            ===================================================== */

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
                                    quantidadeParcelas -
                                    1
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
                        i ===
                        quantidadeParcelas - 1

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
                            grupo,

                        pago:
                            false

                    };


                    if (
                        pagamento ===
                        "cartao-luiza"
                    ) {

                        parcela.cartao =
                            "cartao-luiza";

                    }


                    if (
                        pagamento ===
                        "cartao-daniel"
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

}


/* =========================================================
   SALVAR RECEITAS
========================================================= */

if (formReceitas) {

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

}


/* =========================================================
   GASTOS DO MÊS ATUAL
========================================================= */

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

                data.getMonth() ===
                mes

                &&

                data.getFullYear() ===
                ano

            );

        }
    );

}


/* =========================================================
   ATUALIZAR PAINEL PRINCIPAL
========================================================= */

function atualizarTudo() {

    const gastos =
        gastosDoMes();


    /* =====================================================
       RECEITAS
    ===================================================== */

    const receitas =
        Number(
            dados.receitas.luiza || 0
        )

        +

        Number(
            dados.receitas.daniel || 0
        )

        +

        Number(
            dados.receitas.outras || 0
        );


    /* =====================================================
       TODOS OS GASTOS DO MÊS

       Pago + pendente
    ===================================================== */

    const totalGastos =
        somar(gastos);


    /* =====================================================
       SOMENTE O QUE JÁ FOI PAGO
    ===================================================== */

    const totalPago =
        somar(
            gastos.filter(
                gasto =>
                    gasto.pago
            )
        );


    /* =====================================================
       O QUE AINDA FALTA PAGAR
    ===================================================== */

    const totalPendente =
        totalGastos -
        totalPago;


    /* =====================================================
       SALDO DO MÊS

       Aqui entram TODOS os gastos.

       Exemplo:

       Receitas:       R$ 10.000
       Gastos totais:  R$ 4.000

       Saldo:
       R$ 6.000

       Marcar um gasto como pago NÃO altera
       o saldo final do mês, porque aquele gasto
       já estava contabilizado.
    ===================================================== */

    const saldo =
        receitas -
        totalGastos;


    /* =====================================================
       DISPONÍVEL AGORA

       Aqui entram somente os gastos que
       efetivamente já foram pagos.

       Exemplo:

       Receitas:     R$ 10.000
       Pagos:        R$ 1.500

       Disponível:
       R$ 8.500
    ===================================================== */

    const disponivel =
        receitas -
        totalPago;


    /* =====================================================
       PERCENTUAL DE GASTOS
    ===================================================== */

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


    /* =====================================================
       TOPO
    ===================================================== */

    const totalReceitas =
        document.getElementById(
            "totalReceitas"
        );


    const totalGastosElemento =
        document.getElementById(
            "totalGastos"
        );


    const saldoElemento =
        document.getElementById(
            "saldo"
        );


    const disponivelElemento =
        document.getElementById(
            "disponivel"
        );


    const percentualElemento =
        document.getElementById(
            "percentual"
        );


    if (totalReceitas) {

        totalReceitas.textContent =
            dinheiro(receitas);

    }


    if (totalGastosElemento) {

        totalGastosElemento.textContent =
            dinheiro(totalGastos);

    }


    if (saldoElemento) {

        saldoElemento.textContent =
            dinheiro(saldo);

    }


    if (disponivelElemento) {

        disponivelElemento.textContent =
            dinheiro(disponivel);

    }


    if (percentualElemento) {

        percentualElemento.textContent =
            percentual.toFixed(0) +
            "%";

    }


    /* =====================================================
       SEÇÕES
    ===================================================== */

    atualizarCasa(gastos);

    atualizarLuiza(gastos);

    atualizarDaniel(gastos);

    atualizarCarro(gastos);

    atualizarCartoes(gastos);

    atualizarLancamentos(gastos);

}


/* =========================================================
   CASA
========================================================= */

function atualizarCasa(gastos) {

    const fixos =
        somar(
            gastos.filter(
                gasto =>
                    gasto.subcategoria ===
                    "casa-fixos"
            )
        );


    const variaveis =
        somar(
            gastos.filter(
                gasto =>
                    gasto.subcategoria ===
                    "casa-variaveis"
            )
        );


    const elementoFixos =
        document.getElementById(
            "casaFixos"
        );


    const elementoVariaveis =
        document.getElementById(
            "casaVariaveis"
        );


    if (elementoFixos) {

        elementoFixos.textContent =
            dinheiro(fixos);

    }


    if (elementoVariaveis) {

        elementoVariaveis.textContent =
            dinheiro(variaveis);

    }

}


/* =========================================================
   LUIZA
========================================================= */

function atualizarLuiza(gastos) {

    const clinica =
        somar(
            gastos.filter(
                gasto =>
                    gasto.subcategoria ===
                    "luiza-clinica"
            )
        );


    const pessoal =
        somar(
            gastos.filter(
                gasto =>
                    gasto.subcategoria ===
                    "luiza-pessoal"
            )
        );


    const elementoClinica =
        document.getElementById(
            "luizaClinica"
        );


    const elementoPessoal =
        document.getElementById(
            "luizaPessoal"
        );


    if (elementoClinica) {

        elementoClinica.textContent =
            dinheiro(clinica);

    }


    if (elementoPessoal) {

        elementoPessoal.textContent =
            dinheiro(pessoal);

    }

}


/* =========================================================
   DANIEL
========================================================= */

function atualizarDaniel(gastos) {

    const pessoal =
        somar(
            gastos.filter(
                gasto =>
                    gasto.subcategoria ===
                    "daniel-pessoal"
            )
        );


    const elemento =
        document.getElementById(
            "danielPessoal"
        );


    if (elemento) {

        elemento.textContent =
            dinheiro(pessoal);

    }

}


/* =========================================================
   CARRO
========================================================= */

function atualizarCarro(gastos) {

    const fixos =
        somar(
            gastos.filter(
                gasto =>
                    gasto.subcategoria ===
                    "carro-fixos"
            )
        );


    const variaveis =
        somar(
            gastos.filter(
                gasto =>
                    gasto.subcategoria ===
                    "carro-variaveis"
            )
        );


    const elementoFixos =
        document.getElementById(
            "carroFixos"
        );


    const elementoVariaveis =
        document.getElementById(
            "carroVariaveis"
        );


    if (elementoFixos) {

        elementoFixos.textContent =
            dinheiro(fixos);

    }


    if (elementoVariaveis) {

        elementoVariaveis.textContent =
            dinheiro(variaveis);

    }

}


/* =========================================================
   CARTÕES
========================================================= */

function gastoPertenceAoCartao(
    gasto,
    cartao
) {

    return (

        gasto.pagamento === cartao

        ||

        gasto.cartao === cartao

        ||

        gasto.subcategoria === cartao

    );

}


function atualizarCartoes(gastos) {

    const luiza =
        somar(
            gastos.filter(
                gasto =>
                    gastoPertenceAoCartao(
                        gasto,
                        "cartao-luiza"
                    )
            )
        );


    const daniel =
        somar(
            gastos.filter(
                gasto =>
                    gastoPertenceAoCartao(
                        gasto,
                        "cartao-daniel"
                    )
            )
        );


    const elementoLuiza =
        document.getElementById(
            "cartaoLuiza"
        );


    const elementoDaniel =
        document.getElementById(
            "cartaoDaniel"
        );


    if (elementoLuiza) {

        elementoLuiza.textContent =
            dinheiro(luiza);

    }


    if (elementoDaniel) {

        elementoDaniel.textContent =
            dinheiro(daniel);

    }

}


/* =========================================================
   SOMAR
========================================================= */

function somar(lista) {

    return lista.reduce(
        function(total, item) {

            return (
                total +
                Number(
                    item.valor || 0
                )
            );

        },
        0
    );

}


/* =========================================================
   LANÇAMENTOS
========================================================= */

function atualizarLancamentos(
    gastos
) {

    const lista =
        document.getElementById(
            "listaLancamentos"
        );


    if (!lista) {

        return;

    }


    if (
        gastos.length === 0
    ) {

        lista.innerHTML = `

            <p class="vazio">
                Nenhum lançamento neste mês.
            </p>

        `;

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


    lista.innerHTML =
        "";


    ordenados.forEach(
        function(gasto) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "lancamento";


            if (
                gasto.pago
            ) {

                item.classList.add(
                    "gasto-pago"
                );

            }


            let parcelaTexto =
                "";


            if (
                gasto.parcelado
            ) {

                parcelaTexto =
                    ` • ${gasto.parcelaAtual}/${gasto.totalParcelas}`;

            }


            item.innerHTML = `

                <div class="lancamento-info">

                    <div class="lancamento-icone">

                        ${icone(
                            gasto.categoria
                        )}

                    </div>


                    <div>

                        <div class="lancamento-nome">

                            ${textoSeguro(
                                gasto.descricao
                            )}

                        </div>


                        <div class="lancamento-data">

                            ${formatarData(
                                gasto.data
                            )}

                            ${parcelaTexto}

                        </div>

                    </div>

                </div>


                <div class="lancamento-direita">

                    <span class="lancamento-valor">

                        ${dinheiro(
                            gasto.valor
                        )}

                    </span>


                    <button
                        class="btn-excluir"
                        data-id="${gasto.id}"
                    >
                        🗑️
                    </button>

                </div>

            `;


            const excluir =
                item.querySelector(
                    ".btn-excluir"
                );


            if (excluir) {

                excluir.addEventListener(
                    "click",
                    function() {

                        excluirGasto(
                            gasto.id
                        );

                    }
                );

            }


            lista.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   EXCLUIR GASTO
========================================================= */

function excluirGasto(id) {

    const gasto =
        dados.gastos.find(
            item =>
                item.id === id
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
        confirm(
            mensagem
        );


    if (!confirmar) {

        return;

    }


    if (
        gasto.parcelado &&
        gasto.grupoParcela
    ) {

        dados.gastos =
            dados.gastos.filter(
                item =>
                    item.grupoParcela !==
                    gasto.grupoParcela
            );

    }

    else {

        dados.gastos =
            dados.gastos.filter(
                item =>
                    item.id !== id
            );

    }


    salvarDados();

    atualizarTudo();

}


/* =========================================================
   ABRIR LISTA DE GASTOS
========================================================= */

function abrirLista(categoria) {

    const todosGastos =
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


    const titulo =
        document.getElementById(
            "tituloLista"
        );


    if (titulo) {

        titulo.textContent =
            nomesCategorias[categoria] ||
            "Lista de gastos";

    }


    const conteudo =
        document.getElementById(
            "conteudoLista"
        );


    if (!conteudo) {

        return;

    }


    conteudo.innerHTML =
        "";


    /* =====================================================
       RESUMO
    ===================================================== */

    const total =
        somar(todosGastos);


    const pagos =
        somar(
            todosGastos.filter(
                gasto =>
                    gasto.pago
            )
        );


    const pendentes =
        total -
        pagos;


    const resumo =
        document.createElement(
            "div"
        );


    resumo.className =
        "resumo-lista";


    resumo.innerHTML = `

        <div class="resumo-card">

            <span>
                Total
            </span>

            <strong>
                ${dinheiro(total)}
            </strong>

        </div>


        <div class="resumo-card">

            <span>
                Pago
            </span>

            <strong>
                ${dinheiro(pagos)}
            </strong>

        </div>


        <div class="resumo-card">

            <span>
                Pendente
            </span>

            <strong>
                ${dinheiro(pendentes)}
            </strong>

        </div>

    `;


    conteudo.appendChild(
        resumo
    );


    /* =====================================================
       FILTROS
    ===================================================== */

    const filtros =
        document.createElement(
            "div"
        );


    filtros.className =
        "filtros-gastos";


    filtros.innerHTML = `

        <button
            class="filtro-gasto ativo"
            data-filtro="todos"
        >
            Todos
        </button>


        <button
            class="filtro-gasto"
            data-filtro="pagos"
        >
            ✓ Pagos
        </button>


        <button
            class="filtro-gasto"
            data-filtro="pendentes"
        >
            ☐ Pendentes
        </button>

    `;


    conteudo.appendChild(
        filtros
    );


    /* =====================================================
       LISTA
    ===================================================== */

    const lista =
        document.createElement(
            "div"
        );


    lista.className =
        "lista-itens-gastos";


    conteudo.appendChild(
        lista
    );


    /* =====================================================
       RENDERIZAR
    ===================================================== */

    function renderizarItens(
        filtro
    ) {

        lista.innerHTML =
            "";


        let gastosFiltrados =
            [...todosGastos];


        if (
            filtro === "pagos"
        ) {

            gastosFiltrados =
                todosGastos.filter(
                    gasto =>
                        gasto.pago
                );

        }


        if (
            filtro === "pendentes"
        ) {

            gastosFiltrados =
                todosGastos.filter(
                    gasto =>
                        !gasto.pago
                );

        }


        gastosFiltrados.sort(
            function(a, b) {

                return (
                    new Date(b.data) -
                    new Date(a.data)
                );

            }
        );


        if (
            gastosFiltrados.length === 0
        ) {

            lista.innerHTML = `

                <div class="lista-vazia">

                    <div>

                        ${
                            filtro === "pagos"
                                ? "✓"
                                : "☐"
                        }

                    </div>


                    <p>

                        ${
                            filtro === "pagos"

                                ? "Nenhum gasto pago ainda."

                                : filtro === "pendentes"

                                    ? "Nenhum gasto pendente. 🎉"

                                    : "Nenhum gasto registrado."

                        }

                    </p>

                </div>

            `;

            return;

        }


        gastosFiltrados.forEach(
            function(gasto) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "item-lista";


                if (
                    gasto.pago
                ) {

                    item.classList.add(
                        "item-pago"
                    );

                }


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

                            ${textoSeguro(
                                gasto.descricao
                            )}

                        </div>


                        <div class="item-lista-detalhes">

                            ${formatarData(
                                gasto.data
                            )}

                            ${parcelaTexto}

                            ${pagamentoTexto}

                        </div>

                    </div>


                    <div class="item-lista-valor">

                        ${dinheiro(
                            gasto.valor
                        )}

                    </div>


                    <button
                        class="btn-status-pagamento
                        ${gasto.pago ? "pago" : ""}"
                        data-id="${gasto.id}"
                    >

                        ${
                            gasto.pago
                                ? "✓ Pago"
                                : "☐ Pendente"
                        }

                    </button>

                `;


                const botaoStatus =
                    item.querySelector(
                        ".btn-status-pagamento"
                    );


                if (botaoStatus) {

                    botaoStatus.addEventListener(
                        "click",
                        function() {

                            alternarPagamento(
                                gasto.id,
                                categoria
                            );

                        }
                    );

                }


                lista.appendChild(
                    item
                );

            }
        );

    }


    /* Começa mostrando todos */

    renderizarItens(
        "todos"
    );


    /* =====================================================
       FUNCIONAMENTO DOS FILTROS
    ===================================================== */

    filtros
        .querySelectorAll(
            ".filtro-gasto"
        )
        .forEach(
            function(botao) {

                botao.addEventListener(
                    "click",
                    function() {

                        filtros
                            .querySelectorAll(
                                ".filtro-gasto"
                            )
                            .forEach(
                                function(btn) {

                                    btn.classList.remove(
                                        "ativo"
                                    );

                                }
                            );


                        botao.classList.add(
                            "ativo"
                        );


                        renderizarItens(
                            botao.dataset.filtro
                        );

                    }
                );

            }
        );


    modalLista.classList.add(
        "aberto"
    );

}


/* =========================================================
   ALTERNAR PAGO / PENDENTE
========================================================= */

function alternarPagamento(
    id,
    categoria
) {

    const gasto =
        dados.gastos.find(
            function(item) {

                return item.id === id;

            }
        );


    if (!gasto) {

        return;

    }


    /* Pendente → Pago
       Pago → Pendente */

    gasto.pago =
        !gasto.pago;


    /* Salva */

    salvarDados();


    /* Atualiza TODO o painel */

    atualizarTudo();


    /* Atualiza a lista */

    abrirLista(
        categoria
    );

}


/* =========================================================
   BOTÕES "LISTA DE GASTOS"
========================================================= */

document
    .querySelectorAll(
        ".btn-lista"
    )
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


/* =========================================================
   META
========================================================= */

let valorReserva =
    Number(
        localStorage.getItem(
            "valorReservaEmergencia"
        )
    ) || 0;


const metaReserva =
    20000;


/* =========================================================
   ATUALIZAR META
========================================================= */

function atualizarMeta() {

    const porcentagem =
        Math.min(
            (
                valorReserva /
                metaReserva
            ) * 100,
            100
        );


    const valorElemento =
        document.getElementById(
            "valorMeta"
        );


    const progressoElemento =
        document.getElementById(
            "progressoMeta"
        );


    const percentualElemento =
        document.getElementById(
            "percentualMeta"
        );


    if (valorElemento) {

        valorElemento.textContent =
            dinheiro(
                valorReserva
            );

    }


    if (progressoElemento) {

        progressoElemento.style.width =
            porcentagem + "%";

    }


    if (percentualElemento) {

        percentualElemento.textContent =
            porcentagem.toFixed(0) +
            "% concluído";

    }

}


/* =========================================================
   ADICIONAR À META
========================================================= */

const btnAdicionarMeta =
    document.getElementById(
        "btnAdicionarMeta"
    );


if (btnAdicionarMeta) {

    btnAdicionarMeta.addEventListener(
        "click",
        function() {

            const campo =
                document.getElementById(
                    "valorMetaInput"
                );


            if (campo) {

                campo.value =
                    "";

            }


            modalMeta.classList.add(
                "aberto"
            );

        }
    );

}


/* =========================================================
   SALVAR META
========================================================= */

if (formMeta) {

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


            valorReserva +=
                valor;


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

}


/* =========================================================
   ÍCONES
========================================================= */

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


/* =========================================================
   MÊS ATUAL
========================================================= */

function mostrarMes() {

    const elemento =
        document.getElementById(
            "mesAtual"
        );


    if (!elemento) {

        return;

    }


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


    elemento.textContent =
        texto;

}


/* =========================================================
   FECHAR MODAIS AO CLICAR FORA
========================================================= */

document
    .querySelectorAll(
        ".modal"
    )
    .forEach(
        function(modal) {

            modal.addEventListener(
                "click",
                function(event) {

                    if (
                        event.target ===
                        modal
                    ) {

                        modal.classList.remove(
                            "aberto"
                        );

                    }

                }
            );

        }
    );


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

salvarDados();

mostrarMes();

atualizarTudo();

atualizarMeta();
