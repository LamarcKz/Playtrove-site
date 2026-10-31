---
id: architecture
title: "Arquitetura do aplicativo"
sidebar_position: 11
---

Na versão 1.0.0, o Playtrove é um aplicativo **Tauri 2**: a parte de trás é escrita em **Rust** e a interface continua em React e TypeScript, com estilos Tailwind/shadcn, exibida pelo WebView2 do Windows. Os dados ficam em SQLite, pelo rusqlite, com o SQLite embutido no aplicativo. Até a 0.7.x, o Playtrove usava Electron; a interface é a mesma.

## As partes

| Parte | Responsabilidade |
| --- | --- |
| `src/renderer` | Telas, componentes React, busca e apresentação dos dados |
| `src/renderer/lib/tauriApi.ts` | Ponte que monta `window.api` e liga cada função a um comando do Rust |
| `src-tauri/src` | Janela, SQLite, arquivos, emuladores, controle e integrações externas, com um módulo Rust por assunto |
| `src/shared` | Tipos, nomes dos avisos, idiomas e o contrato `AppApi` (`ipc.ts`) |

A interface chama `window.api`. A ponte transforma cada função num comando do Rust de mesmo nome, em snake_case: `games.setStatus` chama `games_set_status`, em `src-tauri/src/commands.rs`. Os comandos conferem os valores recebidos antes de usá-los e devolvem os erros já no idioma do aplicativo. No sentido contrário, o Rust emite avisos; depois de uma alteração na biblioteca, por exemplo, `library:changed` faz a interface recarregar os dados.

A interface só fala com o Rust por esses comandos: ela não lê o disco nem abre endereços por conta própria. As imagens dos jogos chegam por um protocolo do aplicativo, restrito à sua pasta de imagens.

## Dados e integrações

O Rust mantém uma conexão SQLite local. Migrações atualizam a estrutura dos dados; as oito primeiras são as mesmas das versões em Electron, na mesma ordem, para que o banco da 0.7.x abra direto. Uma mudança de esquema deve acrescentar uma migração, preservando as já publicadas.

Os módulos de metadados consultam IGDB, SteamGridDB e libretro-thumbnails; os de conquistas consultam RetroAchievements e leem os arquivos locais do RPCS3. As chaves das APIs são protegidas pelo Windows (DPAPI), no mesmo formato do armazenamento seguro do Electron, para que as chaves salvas na 0.7.x continuem válidas. O DualSense é lido pelo Rust com a biblioteca `hidapi`.

As atualizações passam pelo atualizador do Tauri, que só instala versões assinadas com a chave do projeto.

## Testes e código de referência

| Testes | O que conferem |
| --- | --- |
| Vitest (`tests/unit`) | A lógica da interface, os dicionários dos dois idiomas e os textos que o Rust usa |
| Rust (`cargo test`) | A lógica da parte de trás, no fim de cada módulo, com banco em memória e pastas temporárias |
| Playwright (`tests/app`) | Os fluxos no aplicativo em Tauri, compilado para testes e aberto com dados temporários |

As integrações externas são substituídas por serviços e arquivos fictícios, e os testes nunca abrem um emulador de verdade.

Para detalhes da versão documentada, consulte o [mapa do projeto em v1.0.0](https://github.com/LamarcKz/Playtrove/blob/v1.0.0/ESTRUTURA.md), o [contrato da interface](https://github.com/LamarcKz/Playtrove/blob/v1.0.0/src/shared/ipc.ts) e os [comandos do Rust](https://github.com/LamarcKz/Playtrove/blob/v1.0.0/src-tauri/src/commands.rs).

O código em `desenvolvimento` pode ter organização e comportamentos posteriores aos deste guia. Veja [como contribuir](contributing.md) para preparar o ambiente.
