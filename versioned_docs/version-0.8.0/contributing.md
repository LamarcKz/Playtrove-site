---
id: contributing
title: "Contribuir com o projeto"
sidebar_position: 10
---

O [repositório do aplicativo](https://github.com/LamarcKz/Playtrove) recebe bugs, ideias, traduções e pull requests. Issues podem ser escritas em português ou inglês.

Esta documentação descreve a versão estável **0.8.0**. A branch `main` acompanha a versão estável; o trabalho em andamento fica em `desenvolvimento`. O número do pacote pode continuar igual até o lançamento seguinte.

## Preparar o ambiente

Use Windows com:

- **Node.js 22.12 ou mais novo** e o Git;
- o **Rust estável**, instalado pelo [rustup](https://www.rust-lang.org/tools/install), com o conjunto MSVC;
- o **Visual Studio Build Tools** com a carga de trabalho de desenvolvimento para desktop com C++, que o Rust usa no Windows.

O WebView2, que exibe a interface, já vem no Windows 10 e 11.

```bash
git clone https://github.com/LamarcKz/Playtrove.git
cd Playtrove
git switch desenvolvimento
npm install
npm run dev
```

O primeiro `npm run dev` compila a parte em Rust e leva alguns minutos; depois, só o que mudou é recompilado. Alterações na interface aparecem na hora, e o aplicativo reabre sozinho quando o código em Rust muda.

Crie sua branch de alteração a partir de `desenvolvimento` e envie o pull request para ela. Para estudar exatamente a versão deste guia, consulte a [tag v0.8.0](https://github.com/LamarcKz/Playtrove/tree/v0.8.0).

## Verificar uma alteração

| Comando | Finalidade |
| --- | --- |
| `npm run typecheck` | Conferir os tipos do TypeScript |
| `npm run build` | Conferir os tipos e gerar a interface em `out/web` |
| `npm run test:unit` | Rodar os testes da lógica da interface com Vitest |
| `npm run test:rust` | Rodar os testes do Rust (`cargo test` em `src-tauri`) |
| `npm run test:app` | Compilar o aplicativo de testes em Tauri e rodar os testes com Playwright, que abrem a janela |
| `npm test` | Rodar a suíte completa: interface, Rust e aplicativo |
| `npm run dist` | Gerar o instalador, a portátil e os arquivos de atualização em `dist/` |

No Rust, formate com `cargo fmt` e mantenha o `cargo clippy` sem avisos. Antes de enviar um PR, rode `npm test` e descreva o comportamento alterado e a validação realizada. Os testes também rodam no GitHub, num Windows limpo, em cada pull request.

O `npm run dist` assina o instalador para a atualização automática e exige a chave privada do projeto, que fica só com quem o mantém. Sem ela, o comando avisa que falta a chave e para; não é preciso gerar versões para contribuir.

## Dados e idiomas

O DEV usa `%APPDATA%\Playtrove Dev`, uma cópia separada da biblioteca instalada, e sua janela mostra a marca **DEV**. Com o DEV fechado, `npm run dev:nova-copia` descarta essa cópia, e o próximo `npm run dev` copia a biblioteca de novo. Os testes usam dados temporários. Mantenha dados pessoais, ROMs, chaves e imagens da biblioteca real fora de commits, logs públicos e fixtures.

Textos novos do aplicativo devem existir em português e inglês, nos dicionários de `src/shared/i18n`. Os textos que o Rust mostra saem dos mesmos dicionários: depois de mudá-los, rode `npm run tauri:mensagens` para gerar de novo `src-tauri/messages.json`. Alterações neste guia também devem manter os dois idiomas coerentes. Use mensagens de commit no padrão Conventional Commits.

Veja a [arquitetura](architecture.md) antes de escolher onde implementar uma mudança. O [site tem seu próprio repositório](https://github.com/LamarcKz/Playtrove-site); os comandos acima são do aplicativo.
