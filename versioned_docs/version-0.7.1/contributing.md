---
id: contributing
title: "Contribuir com o projeto"
sidebar_position: 10
---

O [repositório do aplicativo](https://github.com/LamarcKz/Playtrove) recebe bugs, ideias, traduções e pull requests. Issues podem ser escritas em português ou inglês.

Esta documentação descreve a versão estável **0.7.1**. A branch `main` acompanha a versão estável; o trabalho em andamento fica em `desenvolvimento`. O número do pacote pode continuar igual até o lançamento seguinte.

## Preparar o ambiente

Use Windows e **Node.js 22.12 ou mais novo**, além do Git. O fluxo documentado do aplicativo não exige Visual Studio ou compilador C++.

```bash
git clone https://github.com/LamarcKz/Playtrove.git
cd Playtrove
git switch desenvolvimento
npm install
npm run dev
```

Crie sua branch de alteração a partir de `desenvolvimento` e envie o pull request para ela. Para estudar exatamente a versão deste guia, consulte a [tag v0.7.1](https://github.com/LamarcKz/Playtrove/tree/v0.7.1).

## Verificar uma alteração

| Comando | Finalidade |
| --- | --- |
| `npm run typecheck` | Conferir os tipos |
| `npm run build` | Conferir tipos e gerar `out/` |
| `npm run test:unit` | Rodar os testes de lógica com Vitest |
| `npm run test:app` | Compilar e abrir o Electron para os testes com Playwright |
| `npm test` | Rodar a suíte completa |
| `npm run dist` | Gerar instalador e portátil em `dist/` |

Antes de enviar um PR, rode `npm test` e descreva o comportamento alterado e a validação realizada.

## Dados e idiomas

O DEV usa `%APPDATA%\Playtrove Dev`, uma cópia separada da biblioteca instalada. Os testes usam dados temporários. Mantenha dados pessoais, ROMs, chaves e imagens da biblioteca real fora de commits, logs públicos e fixtures.

Textos novos do aplicativo devem existir em português e inglês. Alterações neste guia também devem manter os dois idiomas coerentes. Use mensagens de commit no padrão Conventional Commits.

Veja a [arquitetura](architecture.md) antes de escolher onde implementar uma mudança. O [site tem seu próprio repositório](https://github.com/LamarcKz/Playtrove-site); os comandos acima são do aplicativo.
