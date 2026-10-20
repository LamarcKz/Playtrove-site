# Site do Playtrove

[English](README.md) · **Português**

[Site](https://lamarckz.github.io/Playtrove-site/)

O site público, a documentação e as novidades das versões do [Playtrove](https://github.com/LamarcKz/Playtrove), uma biblioteca de jogos para Windows. Este repositório contém somente o site; o aplicativo desktop tem seu próprio repositório e processo de lançamento.

O site segue o visual do Playtrove e oferece as mesmas páginas em português e inglês. Os guias de usuários e colaboradores mostram o último snapshot de documentação estável revisado, com seu número verdadeiro e nunca à frente da última release publicada do aplicativo. Novas releases atualizam os downloads e as novidades automaticamente; os guias avançam depois de uma revisão própria. Os posts de novidades reaproveitam as notas de cada idioma publicadas nas releases do GitHub, sem serviço de IA nem uma cópia editorial separada. O Markdown é convertido e sanitizado; HTML ativo e imagens remotas não são incorporados.

## Desenvolver localmente

Use Node.js 24 e npm. Nesta pasta:

```sh
npm ci
npm run dev
```

Esse comando serve o site localmente. Ele não abre o aplicativo desktop nem acessa sua biblioteca.

| Comando | O que faz |
| --- | --- |
| `npm test` | Confere o processamento das releases e os contratos do site |
| `npm run build:test` | Compila com releases de teste locais, sem buscar releases reais |
| `npm run build` | Busca as releases publicadas do aplicativo e compila o site público |
| `npm run test:site` | Confere o site compilado no Chromium sem interface e sem capturas |

Para os testes de navegação, instale o Chromium com `npx playwright install chromium` e rode `npm run test:site` depois de compilar. O site gerado fica em `build/`. Os posts gerados das releases e o resultado da compilação não são editados nem versionados manualmente. Para a automação das releases, a configuração do Pages e a conexão com o GitHub App, veja [MAINTENANCE.md](MAINTENANCE.md).

## Publicação

Pull requests para a `main` rodam os testes e compilam com dados de teste. Um push na `main`, ou o acionamento do `deploy.yml` na `main`, roda os testes, lê as releases publicadas do aplicativo e publica no GitHub Pages. O workflow de lançamento do aplicativo pode fazer esse acionamento por um GitHub App instalado somente neste repositório.

Para a configuração assistida inicial, rode `node scripts/setup-github-app.mjs` e abra a URL de loopback mostrada no terminal. Uma pessoa entra no GitHub, revisa e cria o App e o instala somente em `Playtrove-site`. O assistente salva o Client ID como variável de Actions e envia a chave privada diretamente pela entrada padrão ao `gh secret set` no repositório do aplicativo, sem arquivo da chave nem logs de credenciais. O [guia de manutenção](MAINTENANCE.md) também traz a alternativa manual.

Os instaladores continuam nas [Releases do GitHub](https://github.com/LamarcKz/Playtrove/releases). Este repositório não compila, assina ou publica o aplicativo desktop e não guarda as chaves das APIs nem os dados de quem o usa.

## Contribuir

Mantenha os dois idiomas equivalentes, confira o comportamento na última versão estável do app e rode as verificações locais antes de propor uma mudança. Use dados fictícios nos testes. Siga o [AGENTS.md](AGENTS.md) ao trabalhar com um agente de programação.
