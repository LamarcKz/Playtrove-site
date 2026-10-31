---
id: troubleshooting
title: "Solução de problemas"
sidebar_position: 9
---

Este guia se refere ao Playtrove 1.0.0. Confira sua versão em **Configurações → Sobre**.

## O aplicativo não abre

O Playtrove precisa do **Microsoft Edge WebView2**, que já vem no Windows 10 e 11. Se ele tiver sido removido, execute de novo o instalador da [release oficial](https://github.com/LamarcKz/Playtrove/releases/latest): ele instala o WebView2 quando falta. Na versão portátil, que não instala nada, instale o [WebView2 Runtime](https://developer.microsoft.com/microsoft-edge/webview2/) pelo site da Microsoft.

Se o Windows mostrar **O Windows protegeu o computador**, veja a [instalação](installation.md#primeira-abertura).

## Minha biblioteca está vazia

Adicione uma pasta na aba **Emuladores** e procure jogos. A biblioteca não importa Steam, GOG ou pastas de jogos de PC nesta versão. Confira também o emulador, o console e, no RetroArch, o core escolhido para a pasta.

Se você usava a versão portátil 0.7.x, mova a pasta `data` dela para o lado do novo `Playtrove.exe`, com o aplicativo fechado.

Veja [primeiros passos](getting-started.md).

## O jogo não abre

Confira se a ROM continua no caminho original e se o executável do emulador existe. Use **Escolher… / Trocar…** na aba Emuladores quando a instalação tiver mudado. No RetroArch, verifique se o core configurado está instalado.

O próprio emulador precisa estar preparado para executar o jogo.

## Faltam capas ou informações

Confira as chaves em **Configurações → Metadados**, a conexão e o nome/plataforma do jogo. Sem as chaves, as capas vêm só do libretro-thumbnails, que depende de encontrar a caixa pelo nome da ROM.

Se uma capa aparecer cortada, ela provavelmente é uma caixa escaneada do libretro-thumbnails num formato diferente do quadro em pé. Com o SteamGridDB configurado, use **Configurações → Metadados → Baixar de novo para todos** para trocar as capas que já existem pelas capas em pé.

Nem toda fonte terá todas as informações. Veja [metadados](metadata.md).

## As conquistas não aparecem

Verifique o usuário e a chave do RetroAchievements e se o emulador está conectado à mesma conta. Para RPCS3, confirme o executável e se o jogo já foi iniciado nele para instalar os troféus.

Veja [conquistas](achievements.md).

## O aplicativo avisou que recuperou o banco

Leia o aviso de recuperação. O arquivo danificado é preservado ao lado do banco. Se o problema continuar, feche o aplicativo e relate o que aconteceu; não publique o banco ou suas chaves numa issue.

## Relatar um problema

Use **Configurações → Sobre → Reportar um problema** ou abra uma [issue](https://github.com/LamarcKz/Playtrove/issues/new/choose). Descreva os passos, o resultado esperado e o observado. A interface do aplicativo preenche sua versão e a do Windows no formulário.

Para vulnerabilidades, use o [canal privado de segurança](https://github.com/LamarcKz/Playtrove/security/advisories/new). Remova chaves e caminhos pessoais das informações compartilhadas.
