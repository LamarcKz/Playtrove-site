---
id: metadata
title: "Metadados e imagens"
sidebar_position: 5
---

O Playtrove combina três fontes:

| Fonte | Conteúdo | Precisa de chave? |
| --- | --- | --- |
| libretro-thumbnails | Capas das ROMs, pelo nome do arquivo e console | Não |
| IGDB | Descrição, gêneros, desenvolvedora, publicadora e lançamento | Sim |
| SteamGridDB | Arte de fundo e capas que faltarem | Sim |

As capas são procuradas primeiro no libretro-thumbnails, depois no SteamGridDB e por fim no IGDB. Os fundos vêm do SteamGridDB ou, quando não houver, do IGDB.

## Configurar os serviços

Abra **Configurações → Metadados**. Os cartões do IGDB e SteamGridDB têm o passo a passo para criar as chaves gratuitas e um botão que abre o site de cada serviço.

Digite as chaves no aplicativo e salve. O Playtrove confere os dados antes de guardá-los. As chaves secretas são protegidas pelo Windows e não voltam para os campos da tela. Não as publique em issues.

## Baixar e atualizar

Deixe ativado o download automático para jogos novos ou use o botão de download nas configurações. Pelo menu **Mais**, você pode atualizar um jogo específico.

A fila processa um jogo por vez e mostra o andamento na barra do topo. Um resultado não encontrado não apaga os metadados e imagens existentes.

A correspondência depende do nome e da plataforma do jogo. Descrições do IGDB permanecem em inglês; os gêneros aparecem traduzidos quando o aplicativo conhece a tradução. Na versão 0.7.0, a troca manual de capa ainda não está disponível.

Veja [solução de problemas](troubleshooting.md) se faltarem imagens ou houver erro de credenciais.
