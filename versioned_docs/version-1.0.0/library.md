---
id: library
title: "Organizar a biblioteca"
sidebar_position: 4
---

A biblioteca oferece quatro modos, escolhidos na barra do topo:

- **Detalhes:** lista de jogos à esquerda e informações do selecionado à direita, com a arte de fundo do jogo.
- **Grade:** capas com o status abaixo da imagem; selecionar um jogo abre o painel lateral.
- **Lista:** uma linha por jogo, com plataforma, biblioteca, tempo, avaliação e conquistas.
- **Kanban:** uma coluna por status. Arrastar um jogo para outra coluna altera seu status.

Ao trocar de modo, o painel lateral fecha e o jogo escolhido continua destacado. Para jogar no sofá, com o controle, use a [tela cheia](fullscreen.md).

## Capas

Todas as capas do aplicativo, nos modos da biblioteca, no painel lateral e na tela cheia, ficam no mesmo quadro em pé, na proporção **3:4**, como no Playnite. A arte enche o quadro: uma capa de outro formato perde um pouco das bordas, sem distorção nem preenchimento desfocado. Na Grade, os cartões ficam alinhados pelo topo; a faixa do status continua logo abaixo da capa, e títulos e status longos podem quebrar linha.

Durante o carregamento, quando não há capa ou se a imagem falhar, aparece o desenho padrão no mesmo quadro. Veja em [metadados](metadata.md) de onde as capas vêm.

## Buscar e filtrar

A busca ignora diferenças de maiúsculas e acentos. O botão **Filtros** abre o painel da direita. Você pode combinar status, plataforma, tempo jogado, nota e outros critérios.

**Favoritos** e **Recentes** são filtros independentes do status. Recentes considera os últimos 30 dias. Filtros de gênero, desenvolvedora, publicadora e lançamento dependem de metadados disponíveis.

## Status e avaliação

Em **Configurações → Status**, crie, renomeie, reordene ou apague status. Ao apagar um status com jogos, escolha para qual status eles serão movidos. As regras automáticas definem o status de jogos novos e o da primeira sessão.

No menu **Mais** de um jogo:

- Marque ou remova o favorito.
- Use **Avaliar jogo…** para dar nota em estrelas e dificuldade em pimentas, de meia a cinco.
- Use **Escrever análise…** para registrar seu texto.
- Escolha ou remova o vídeo de fundo e a música tema (veja abaixo).
- Baixe os metadados ou mostre a ROM no Explorador.

## Vídeo de fundo e música tema

No modo Detalhes, o fundo do jogo pode ser um vídeo, que toca sem som e em repetição. Ele vem do trailer automático (veja [metadados](metadata.md)) ou de um MP4 ou WebM seu, escolhido em **Mais → Escolher vídeo de fundo…**; o Playtrove guarda uma cópia e não mexe no arquivo original. Com o movimento reduzido do Windows, o vídeo começa pausado.

Cada jogo também pode ter uma **música tema**, que toca sem internet, em repetição, nos quatro modos da biblioteca. Use **Mais → Escolher música tema…** para um MP3, M4A ou WAV seu, ou deixe o Playtrove procurar uma automaticamente com os metadados. A reprodução e o volume ficam em **Configurações → Geral**, e a música pausa quando a janela sai de foco ou um jogo está aberto.

Na versão 1.0.0, modo de exibição e filtros não são lembrados ao reabrir o aplicativo.
