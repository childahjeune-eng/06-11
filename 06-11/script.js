// CARREGAR DADOS SALVOS NO NAVEGADOR

function carregarDados(chave) {
    try {
        const dados = JSON.parse(localStorage.getItem(chave));
        return Array.isArray(dados) ? dados : [];
    } catch {
        return [];
    }
}

let filmes = carregarDados("cinema_filmes");
let sessoes = carregarDados("cinema_sessoes");
let vendas = carregarDados("cinema_vendas");


// SALVAR DADOS

function salvarDados() {
    localStorage.setItem("cinema_filmes", JSON.stringify(filmes));
    localStorage.setItem("cinema_sessoes", JSON.stringify(sessoes));
    localStorage.setItem("cinema_vendas", JSON.stringify(vendas));
}


// FORMATAR DINHEIRO

function dinheiro(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}


// CONTAR INGRESSOS VENDIDOS

function contarIngressos(sessaoId) {
    let total = 0;

    for (const venda of vendas) {
        if (venda.sessaoId === sessaoId) {
            total += venda.quantidade;
        }
    }

    return total;
}


// CALCULAR ARRECADACAO

function calcularTotal() {
    let total = 0;

    for (const venda of vendas) {
        total += venda.total;
    }

    return total;
}


// MOSTRAR TELAS

function mostrarTela(id) {
    document.querySelectorAll(".tela").forEach(tela => {
        tela.classList.remove("ativa");
    });

    document.getElementById(id).classList.add("ativa");

    atualizarSistema();
}

document.getElementById("formFilme").addEventListener("submit", function(event) {

    event.preventDefault();

    const nome = document.getElementById("nomeFilme").value.trim();
    const genero = document.getElementById("generoFilme").value.trim();
    const duracao = Number(document.getElementById("duracaoFilme").value);
    const classificacao = document.getElementById("classificacaoFilme").value.trim();

    if (!nome || !genero || !classificacao || !Number.isInteger(duracao) || duracao <= 0) {
        alert("Preencha todos os campos corretamente!");
        return;
    }

    const filme = {
        id: Date.now(),
        nome: nome,
        genero: genero,
        duracao: duracao,
        classificacao: classificacao
    };

    filmes.push(filme);

    salvarDados();

    this.reset();

    alert("Filme cadastrado com sucesso!");

    atualizarSistema();

});

function atualizarFilmes() {

    const tabela = document.getElementById("listaFilmes");

    tabela.innerHTML = "";

    for (const filme of filmes) {

        const linha = document.createElement("tr");

        const valores = [
            filme.id,
            filme.nome,
            filme.genero,
            filme.duracao + " minutos",
            filme.classificacao
        ];

        for (const valor of valores) {
            const celula = document.createElement("td");
            celula.textContent = valor;
            linha.appendChild(celula);
        }

        tabela.appendChild(linha);
    }

    if (filmes.length === 0) {
        tabela.innerHTML = "<tr><td colspan='5'>Nenhum filme cadastrado.</td></tr>";
    }

    const select = document.getElementById("filmeSessao");

    const selecionado = select.value;

    select.innerHTML = "<option value=''>Selecione um filme</option>";

    for (const filme of filmes) {

        const opcao = document.createElement("option");

        opcao.value = filme.id;
        opcao.textContent = filme.nome;

        select.appendChild(opcao);
    }

    if (filmes.some(filme => String(filme.id) === selecionado)) {
        select.value = selecionado;
    }
}

document.getElementById("formSessao").addEventListener("submit", function(event) {

    event.preventDefault();

    const filmeId = Number(document.getElementById("filmeSessao").value);
    const filme = filmes.find(f => f.id === filmeId);

    const data = document.getElementById("dataSessao").value;
    const horario = document.getElementById("horarioSessao").value;
    const sala = document.getElementById("salaSessao").value.trim();

    const capacidade = Number(document.getElementById("capacidadeSessao").value);
    const preco = Number(document.getElementById("precoSessao").value);

    if (!filme || !data || !horario || !sala) {
        alert("Preencha todos os campos!");
        return;
    }

    if (!Number.isInteger(capacidade) || capacidade <= 0 ||
        !Number.isFinite(preco) || preco <= 0) {

        alert("Capacidade ou preço inválido!");
        return;
    }

    const sessao = {
        id: Date.now(),
        filmeId: filme.id,
        filme: filme.nome,
        data: data,
        horario: horario,
        sala: sala,
        capacidade: capacidade,
        preco: preco
    };

    sessoes.push(sessao);

    salvarDados();

    this.reset();

    alert("Sessão cadastrada com sucesso!");

    atualizarSistema();

});

function atualizarSessoes() {

    const tabela = document.getElementById("listaSessoes");

    tabela.innerHTML = "";

    for (const sessao of sessoes) {

        const vendidos = contarIngressos(sessao.id);

        const vagas = sessao.capacidade - vendidos;

        const linha = document.createElement("tr");

        const valores = [
            sessao.id,
            sessao.filme,
            sessao.data.split("-").reverse().join("/"),
            sessao.horario,
            sessao.sala,
            dinheiro(sessao.preco),
            vagas
        ];

        for (const valor of valores) {
            const celula = document.createElement("td");
            celula.textContent = valor;
            linha.appendChild(celula);
        }

        tabela.appendChild(linha);
    }

    if (sessoes.length === 0) {
        tabela.innerHTML = "<tr><td colspan='7'>Nenhuma sessão cadastrada.</td></tr>";
    }

    atualizarSelecaoSessoes();
}

function atualizarSelecaoSessoes() {

    const ids = ["sessaoVenda", "sessaoVagas"];

    for (const id of ids) {

        const select = document.getElementById(id);

        const selecionado = select.value;

        select.innerHTML = "<option value=''>Selecione uma sessão</option>";

        for (const sessao of sessoes) {

            const vendidos = contarIngressos(sessao.id);

            const vagas = sessao.capacidade - vendidos;

            const opcao = document.createElement("option");

            opcao.value = sessao.id;

            opcao.textContent =
                sessao.filme + " - " +
                sessao.data.split("-").reverse().join("/") + " - " +
                sessao.horario + " - " +
                vagas + " vagas";

            select.appendChild(opcao);
        }

        if (sessoes.some(sessao => String(sessao.id) === selecionado)) {
            select.value = selecionado;
        }
    }

}

document.getElementById("formVenda").addEventListener("submit", function(event) {

    event.preventDefault();

    const sessaoId = Number(document.getElementById("sessaoVenda").value);

    const quantidade = Number(document.getElementById("quantidadeVenda").value);

    const sessao = sessoes.find(s => s.id === sessaoId);

    if (!sessao) {
        alert("Selecione uma sessão válida!");
        return;
    }

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
        alert("Digite uma quantidade válida!");
        return;
    }

    const vendidos = contarIngressos(sessao.id);

    const vagas = sessao.capacidade - vendidos;

    if (quantidade > vagas) {
        alert("Não existem vagas suficientes! Disponíveis: " + vagas);
        return;
    }

    const total = quantidade * sessao.preco;

    const venda = {
        id: Date.now(),
        sessaoId: sessao.id,
        quantidade: quantidade,
        total: total
    };

    vendas.push(venda);

    salvarDados();

    document.getElementById("resultadoVenda").innerHTML =
        "<h3>Venda realizada com sucesso!</h3>" +
        "<p>Filme: " + sessao.filme + "</p>" +
        "<p>Ingressos: " + quantidade + "</p>" +
        "<p>Valor unitário: " + dinheiro(sessao.preco) + "</p>" +
        "<p>Total: " + dinheiro(total) + "</p>";

    this.reset();

    atualizarSistema();

});

function consultarVagas() {

    const sessaoId = Number(document.getElementById("sessaoVagas").value);

    const resultado = document.getElementById("resultadoVagas");

    const sessao = sessoes.find(s => s.id === sessaoId);

    if (!sessao) {
        resultado.innerHTML = "";
        return;
    }

    const vendidos = contarIngressos(sessao.id);

    const vagas = sessao.capacidade - vendidos;

    resultado.innerHTML =
        "<h3>Informações da sessão</h3>" +
        "<p>Filme: " + sessao.filme + "</p>" +
        "<p>Sala: " + sessao.sala + "</p>" +
        "<p>Capacidade: " + sessao.capacidade + "</p>" +
        "<p>Ingressos vendidos: " + vendidos + "</p>" +
        "<p>Vagas disponíveis: " + vagas + "</p>";

}

function atualizarArrecadacao() {

    let quantidadeTotal = 0;

    for (const venda of vendas) {
        quantidadeTotal += venda.quantidade;
    }

    document.getElementById("valorArrecadacao").textContent =
        dinheiro(calcularTotal());

    document.getElementById("ingressosArrecadacao").textContent =
        quantidadeTotal;

    document.getElementById("quantidadeVendas").textContent =
        vendas.length;

}

function atualizarPainel() {

    let ingressos = 0;

    for (const venda of vendas) {
        ingressos += venda.quantidade;
    }

    document.getElementById("totalFilmes").textContent =
        filmes.length;

    document.getElementById("totalSessoes").textContent =
        sessoes.length;

    document.getElementById("totalIngressos").textContent =
        ingressos;

    document.getElementById("totalArrecadado").textContent =
        dinheiro(calcularTotal());

}

function atualizarSistema() {

    atualizarFilmes();

    atualizarSessoes();

    atualizarPainel();

    atualizarArrecadacao();

    consultarVagas();

}

atualizarSistema();
