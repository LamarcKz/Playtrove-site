---
id: installation
title: "Instalação"
sidebar_position: 1
---

O Playtrove 0.8.0 funciona no **Windows 10 ou 11 de 64 bits**. Use os arquivos da [release oficial](https://github.com/LamarcKz/Playtrove/releases/tag/v0.8.0).

## Escolher o formato

| Arquivo | Como usar | Onde fica a biblioteca |
| --- | --- | --- |
| `Playtrove-Setup-0.8.0.exe` (cerca de 5 MB) | Execute o instalador e siga as telas: boas-vindas, pasta da instalação, instalação e conclusão. Ele instala para seu usuário, sem pedir administrador, e cria o atalho no menu Iniciar; a última tela também oferece o atalho na Área de Trabalho. | Na pasta de dados do usuário do Windows. |
| `Playtrove-0.8.0-portable.zip` (cerca de 7 MB) | Extraia o ZIP inteiro numa pasta nova e abra `Playtrove.exe`. Mantenha `portable.txt` ao lado do executável. | Na pasta `data`, ao lado do executável. |

Não é preciso instalar Node.js ou ferramentas de programação para usar o aplicativo.

## WebView2

A partir da 0.8.0, a interface do Playtrove é exibida pelo **Microsoft Edge WebView2**, que já vem no Windows 10 e 11, em vez de um navegador embutido no aplicativo. É por isso que os arquivos ficaram bem menores.

Se o WebView2 faltar, o instalador o baixa e instala, o que exige internet. A versão portátil não instala nada: ela usa o WebView2 que já estiver no Windows.

## Quem já tem a 0.7.x

Na edição instalada, use o aviso de atualização do próprio aplicativo, ou **Configurações → Sobre → Procurar atualizações**, e escolha **Atualizar**. O aplicativo baixa o instalador da 0.8.0, a versão anterior é removida e a nova abre sozinha, com a biblioteca, as configurações e as chaves das APIs que você já tinha salvado.

Executar o instalador da 0.8.0 manualmente também remove a versão anterior antes de instalar, sem apagar a biblioteca.

Na versão portátil, extraia a 0.8.0 numa pasta nova. Para manter a biblioteca, feche o aplicativo antigo e mova a pasta `data` dele para o lado do novo `Playtrove.exe`.

## Primeira abertura

O instalador e o executável da 0.8.0 ainda não têm assinatura digital de código. O Windows pode mostrar **O Windows protegeu o computador**. Depois de conferir que o arquivo veio da release oficial, use **Mais informações → Executar assim mesmo** para abri-lo.

Essa assinatura do Windows é diferente da assinatura das atualizações: o próprio Playtrove só instala uma versão nova assinada com a chave do projeto.

A biblioteca começa vazia. O aplicativo não inclui jogos nem emuladores. Continue em [Primeiros passos](getting-started.md) para adicionar seus jogos.

Veja também [dados e atualizações](data-updates.md).
