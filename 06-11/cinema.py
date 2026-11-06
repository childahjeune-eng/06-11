import json
import os

ARQUIVO_DADOS = "dados_cinema.json"


def carregar_dados():
    """Carrega os dados salvos. Se ainda nao existir arquivo, comeca vazio."""
    if os.path.exists(ARQUIVO_DADOS):
        try:
            with open(ARQUIVO_DADOS, "r", encoding="utf-8") as arquivo:
                dados = json.load(arquivo)
                return dados
        except (json.JSONDecodeError, OSError):
            print("Aviso: nao foi possivel ler os dados salvos. Comecando vazio.")

    return {"filmes": [], "sessoes": [], "vendas": []}


dados = carregar_dados()


def salvar_dados():
    """Salva filmes, sessoes e vendas em um arquivo JSON."""
    with open(ARQUIVO_DADOS, "w", encoding="utf-8") as arquivo:
        json.dump(dados, arquivo, ensure_ascii=False, indent=4)


def ler_inteiro(mensagem, minimo=1):
    while True:
        try:
            valor = int(input(mensagem))
            if valor < minimo:
                print(f"Digite um numero igual ou maior que {minimo}.")
            else:
                return valor
        except ValueError:
            print("Digite apenas numeros inteiros.")


def ler_preco(mensagem):
    while True:
        try:
            texto = input(mensagem).replace(",", ".")
            valor = float(texto)
            if valor <= 0:
                print("O preco precisa ser maior que zero.")
            else:
                return valor
        except ValueError:
            print("Digite um valor valido. Exemplo: 25,00")


def cadastrar_filme():
    print("\n--- CADASTRAR FILME ---")
    titulo = input("Nome do filme: ").strip()
    if not titulo:
        print("O nome do filme nao pode ficar vazio.")
        return

    genero = input("Genero: ").strip()
    duracao = ler_inteiro("Duracao em minutos: ")
    classificacao = input("Classificacao indicativa (ex.: 12 anos): ").strip()

    novo_id = max([filme["id"] for filme in dados["filmes"]], default=0) + 1
    dados["filmes"].append({
        "id": novo_id,
        "titulo": titulo,
        "genero": genero,
        "duracao": duracao,
        "classificacao": classificacao
    })
    salvar_dados()
    print(f"Filme '{titulo}' cadastrado com sucesso!")


def listar_filmes():
    print("\n--- FILMES CADASTRADOS ---")
    if not dados["filmes"]:
        print("Nenhum filme cadastrado.")
        return

    for filme in dados["filmes"]:
        print(
            f'{filme["id"]} - {filme["titulo"]} | '
            f'{filme["genero"]} | {filme["duracao"]} min | '
            f'Classificacao: {filme["classificacao"]}'
        )


def cadastrar_sessao():
    print("\n--- CADASTRAR SESSAO ---")
    if not dados["filmes"]:
        print("Cadastre pelo menos um filme antes de criar uma sessao.")
        return

    listar_filmes()
    filme_id = ler_inteiro("Digite o ID do filme: ")
    filme = next((f for f in dados["filmes"] if f["id"] == filme_id), None)

    if filme is None:
        print("ID de filme nao encontrado.")
        return

    data = input("Data da sessao (ex.: 06/11/2026): ").strip()
    horario = input("Horario (ex.: 19:30): ").strip()
    sala = input("Sala: ").strip()
    capacidade = ler_inteiro("Quantidade de lugares na sala: ")
    preco = ler_preco("Preco de cada ingresso (ex.: 25,00): R$ ")

novo_id = max([sessao["id"] for sessao in dados["sessoes"]], default=0) + 1
class filme_id:
    ...

class data:
    ...

class horario:
    ...

class sala:
    ...

class preco:
    ...

class capacidade:
    ...

dados["sessoes"].append({
        "id": novo_id,
        "filme_id": filme_id,
        "data": data,
        "horario": horario,
        "sala": sala,
        "capacidade": capacidade,
        "preco": preco
    })
salvar_dados()
print("Sessao cadastrada com sucesso!")


def nome_do_filme(filme_id):
    filme = next((f for f in dados["filmes"] if f["id"] == filme_id), None)
    return filme["titulo"] if filme else "Filme nao encontrado"


def ingressos_vendidos(sessao_id):
    return sum(
        venda["quantidade"]
        for venda in dados["vendas"]
        if venda["sessao_id"] == sessao_id
    )


def listar_sessoes():
    print("\n--- SESSOES DISPONIVEIS ---")
    if not dados["sessoes"]:
        print("Nenhuma sessao cadastrada.")
        return

    for sessao in dados["sessoes"]:
        vendidos = ingressos_vendidos(sessao["id"])
        vagas = sessao["capacidade"] - vendidos
        print(
            f'ID {sessao["id"]} | {nome_do_filme(sessao["filme_id"])} | '
            f'{sessao["data"]} as {sessao["horario"]} | Sala {sessao["sala"]} | '
            f'R$ {sessao["preco"]:.2f} | Vagas: {vagas}/{sessao["capacidade"]}'
        )

def vender_ingressos():
    print("\n--- VENDER INGRESSOS ---")
    if not dados["sessoes"]:
        print("Cadastre uma sessao antes de vender ingressos.")
        return

    listar_sessoes()
    sessao_id = ler_inteiro("Digite o ID da sessao: ")
    sessao = next((s for s in dados["sessoes"] if s["id"] == sessao_id), None)

    if sessao is None:
        print("ID de sessao nao encontrado.")
        return

    vagas = sessao["capacidade"] - ingressos_vendidos(sessao_id)
    if vagas == 0:
        print("Essa sessao esta lotada.")
        return

    quantidade = ler_inteiro("Quantos ingressos deseja comprar? ")
    if quantidade > vagas:
        print(f"Nao ha vagas suficientes. Existem apenas {vagas} vaga(s).")
        return

    dados["vendas"].append({
        "sessao_id": sessao_id,
        "quantidade": quantidade
    })
    salvar_dados()
    total = quantidade * sessao["preco"]
    print(f"Venda realizada! Total: R$ {total:.2f}")


def verificar_vagas():
    print("\n--- CONSULTAR VAGAS ---")
    if not dados["sessoes"]:
        print("Nenhuma sessao cadastrada.")
        return

    listar_sessoes()
    sessao_id = ler_inteiro("Digite o ID da sessao para consultar: ")
    sessao = next((s for s in dados["sessoes"] if s["id"] == sessao_id), None)

    if sessao is None:
        print("ID de sessao nao encontrado.")
        return

    vendidos = ingressos_vendidos(sessao_id)
    vagas = sessao["capacidade"] - vendidos
    print(f"Filme: {nome_do_filme(sessao['filme_id'])}")
    print(f"Ingressos vendidos: {vendidos}")
    print(f"Vagas disponiveis: {vagas}")


def calcular_arrecadacao():
    print("\n--- ARRECADACAO ---")
    total_geral = 0

    if not dados["vendas"]:
        print("Ainda nao houve vendas.")
        print("Arrecadacao total: R$ 0.00")
        return

    for sessao in dados["sessoes"]:
        quantidade = ingressos_vendidos(sessao["id"])
        valor = quantidade * sessao["preco"]
        total_geral += valor
        if quantidade > 0:
            print(
                f'{nome_do_filme(sessao["filme_id"])} - '
                f'{sessao["data"]} {sessao["horario"]}: '
                f'{quantidade} ingresso(s) = R$ {valor:.2f}'
            )

    for sessao in dados["sessoes"]:
        quantidade = ingressos_vendidos(sessao["id"])
        valor = quantidade * sessao["preco"]
        total_geral += valor
        if quantidade > 0:
            print(
                f'{nome_do_filme(sessao["filme_id"])} - '
                f'{sessao["data"]} {sessao["horario"]}: '
                f'{quantidade} ingresso(s) = R$ {valor:.2f}'
            )

    print(f"\nARRECADACAO TOTAL: R$ {total_geral:.2f}")


def menu():
    while True:
        print("\n" + "=" * 42)
        print("          SISTEMA DE CINEMA")
        print("=" * 42)
        print("1 - Cadastrar filme")
        print("2 - Listar filmes")
        print("3 - Cadastrar sessao")
        print("4 - Listar sessoes")
        print("5 - Vender ingressos")
        print("6 - Verificar vagas")
        print("7 - Calcular arrecadacao")
        print("0 - Sair")
        print("=" * 42)

        opcao = input("Escolha uma opcao: ").strip()

        if opcao == "1":
            cadastrar_filme()
        elif opcao == "2":
            listar_filmes()
        elif opcao == "3":
            cadastrar_sessao()
        elif opcao == "4":
            listar_sessoes()
        elif opcao == "5":
            vender_ingressos()
        elif opcao == "6":
            verificar_vagas()
        elif opcao == "7":
            calcular_arrecadacao()
        elif opcao == "0":
            print("Sistema encerrado. Ate mais!")
            break
        else:
            print("Opcao invalida. Escolha uma opcao do menu.")


if __name__ == "__main__":
    menu()
