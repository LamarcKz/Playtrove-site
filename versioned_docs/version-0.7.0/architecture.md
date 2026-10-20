---
id: architecture
title: "Arquitetura do aplicativo"
sidebar_position: 11
---

Na versão 0.7.0, o Playtrove é um aplicativo **Electron**, com interface React e TypeScript, estilos Tailwind/shadcn e persistência SQLite com better-sqlite3.

## As partes

| Parte | Responsabilidade |
| --- | --- |
| `src/renderer` | Telas, componentes React, busca e apresentação dos dados |
| `src/preload` | Ponte que expõe operações específicas em `window.api` |
| `src/main` | Janela, SQLite, arquivos, emuladores e integrações externas |
| `src/shared` | Tipos, canais IPC, idiomas e contratos compartilhados |

A interface chama `window.api`; o preload encaminha as operações por IPC ao processo principal. Depois de uma alteração na biblioteca, o processo principal notifica a interface para recarregar os dados.

O renderer não tem acesso direto ao Node.js. A leitura do controle usa WebHID diretamente na interface, com acesso autorizado pelo processo principal.

## Dados e integrações

O processo principal mantém uma conexão SQLite local. Migrações atualizam a estrutura dos dados. Uma mudança de esquema deve acrescentar uma migração, preservando as já publicadas.

Os módulos de metadados consultam IGDB, SteamGridDB e libretro-thumbnails; os de conquistas consultam RetroAchievements e leem os arquivos locais do RPCS3. Chaves são protegidas com o armazenamento seguro do Electron.

## Testes e código de referência

Vitest verifica lógica e banco; Playwright abre uma instância Electron com dados temporários para conferir os fluxos. As integrações externas são substituídas por serviços e arquivos fictícios nos testes.

Para detalhes da versão documentada, consulte o [mapa do projeto em v0.7.0](https://github.com/LamarcKz/Playtrove/blob/v0.7.0/ESTRUTURA.md) e o [contrato IPC](https://github.com/LamarcKz/Playtrove/blob/v0.7.0/src/shared/ipc.ts).

O código em `desenvolvimento` pode ter organização e comportamentos posteriores aos deste guia. Veja [como contribuir](contributing.md) para preparar o ambiente.
