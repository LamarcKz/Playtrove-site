---
id: metadata
title: "Metadados e imagens"
sidebar_position: 5
---

O Playtrove combina três fontes:

| Fonte | Conteúdo | Precisa de chave? |
| --- | --- | --- |
| SteamGridDB | Capas em pé, arte de fundo e a logo do jogo | Sim |
| IGDB | Descrição, gêneros, desenvolvedora, publicadora, lançamento, capas e trailers | Sim |
| libretro-thumbnails | Caixas escaneadas das ROMs, pelo nome do arquivo e console | Não |

Como no Playnite, a capa vem primeiro das desenhadas em pé, que encaixam no quadro 3:4 das telas: a do SteamGridDB, depois a do IGDB e, por fim, a caixa escaneada do libretro-thumbnails, que pode ser quadrada ou deitada e aparece cortada nas bordas. Sem chaves, só o libretro-thumbnails é usado. Os fundos vêm do SteamGridDB ou, quando não houver, do IGDB. A **logo** (o nome do jogo desenhado, com fundo transparente) vem do SteamGridDB e aparece nos temas da [tela cheia](fullscreen.md).

## Configurar os serviços

Abra **Configurações → Metadados**. Os cartões do IGDB e SteamGridDB têm o passo a passo para criar as chaves gratuitas e um botão que abre o site de cada serviço.

Digite as chaves no aplicativo e salve. O Playtrove confere os dados antes de guardá-los. As chaves secretas são protegidas pelo Windows e não voltam para os campos da tela. Não as publique em issues.

## Baixar e atualizar

Deixe ativado o download automático para jogos novos ou use o botão **Baixar metadados** nas configurações. Pelo menu **Mais**, você pode atualizar um jogo específico.

Os jogos que já têm capa só a trocam quando os metadados são baixados de novo. Para trocar as capas de toda a biblioteca, use **Configurações → Metadados → Baixar de novo para todos**.

A fila processa um jogo por vez e mostra o andamento na barra do topo. Um resultado não encontrado não apaga os metadados e imagens existentes.

A correspondência depende do nome e da plataforma do jogo. Descrições do IGDB permanecem em inglês; os gêneros aparecem traduzidos quando o aplicativo conhece a tradução. Na versão 1.0.0, a troca manual de capa ainda não está disponível.

## Trailers e músicas automáticos

Com o IGDB configurado, a fila também procura um **trailer** do jogo e guarda uma cópia local, em até 720p e 100 MB. Ele toca sem som no fundo do modo Detalhes e da tela cheia. Na primeira vez, o Playtrove prepara as ferramentas necessárias, cerca de 58 MB, sem instalar nada no Windows.

A **música tema** também pode ser procurada sozinha para jogos novos; a opção fica em **Configurações → Metadados**, separada do download dos outros metadados. Quando a escolha não é certa, as candidatas ficam guardadas, e **Revisar músicas** deixa você ouvir e escolher depois que a leva terminar.

Um vídeo ou uma música escolhidos por você têm prioridade sobre os automáticos. Veja [organizar a biblioteca](library.md#vídeo-de-fundo-e-música-tema).

Veja [solução de problemas](troubleshooting.md) se faltarem imagens ou houver erro de credenciais.
