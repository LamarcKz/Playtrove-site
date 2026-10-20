# Manutenção do site

## Contratos

- O aplicativo é publicado em `LamarcKz/Playtrove`; as fontes do site ficam em `LamarcKz/Playtrove-site`.
- `npm test` verifica o processamento das releases e os contratos do site. `npm run build:test` usa fixtures locais e não consulta as releases reais. `npm run build` sincroniza as releases públicas e gera o site em `build/`. Para os testes de navegação, instalar o Chromium com `npx playwright install chromium` (no Linux do CI, `npx playwright install --with-deps chromium`) e rodar `npm run test:site` depois do build.
- O conteúdo público é em português e inglês. Os guias mostram o snapshot estável revisado mais recente cuja versão seja menor ou igual à última release publicada (`docsVersion <= latest.version`). O rótulo usa `docsVersion`, a versão real do conteúdo. Uma release nova pode atualizar os posts e downloads enquanto os guias ainda mostram a revisão anterior; eles só avançam depois de revisar os dois idiomas e adicionar o snapshot a `versions.json`. Essa revisão faz parte da preparação do lançamento e não é gerada das notas automaticamente. O Docusaurus publica somente o snapshot versionado da estável selecionada: `includeCurrentVersion: false`, `onlyIncludeVersions` e `lastVersion` seguem o marcador dos guias. Rascunhos de desenvolvimento ficam desabilitados; não há seletor de versões antigas.
- Os posts vêm das notas bilíngues publicadas no GitHub. Preservar o texto de cada idioma, a tag, a data original e o link da release, sem reescrever por IA. O Markdown é convertido em HTML sanitizado: HTML ativo e imagens remotas não são incorporados. Builds posteriores também refletem correções feitas nas notas. Não há commits automáticos de posts.
- Os instaladores continuam hospedados nas Releases do aplicativo. Uma publicação do site não muda a versão nem lança o aplicativo.

## Workflows deste repositório

`ci.yml` roda em pull requests para `main`: instala com `npm ci`, executa `npm test` e compila com `npm run build:test`. Depois instala somente o Chromium do Playwright e roda `npm run test:site` no build de teste, sem capturas. Tem somente `contents: read` e usa fixtures.

`deploy.yml` roda em pushes na `main` e por `workflow_dispatch`, na referência `main`: instala, testa, executa o build com as releases públicas e confere o site compilado com `npm run test:site` no Chromium sem interface e sem capturas antes de publicar o artefato `build/` no Pages. O build tem `contents: read`; só o job de publicação recebe `pages: write` e `id-token: write`. A fila `github-pages` evita publicações simultâneas e deixa a publicação ativa terminar. Os workflows não escrevem no Git.

O token automático do site só serve para a execução corrente. Nenhuma chave das APIs do aplicativo, banco, biblioteca de usuário ou chave privada do GitHub App é necessária no site.

## Ativar o GitHub Pages

1. Em `Playtrove-site`, abrir **Settings → Pages → Build and deployment** e escolher **GitHub Actions** como fonte.
2. No ambiente `github-pages`, permitir publicações da branch `main`. O deploy usa esse ambiente; não precisa permitir branches de pull request.
3. Depois que os arquivos estiverem na `main`, executar **Actions → Publish site → Run workflow**, na `main`, ou enviar uma alteração aprovada para ela.
4. Conferir o endereço mostrado pelo job de publicação. O build usa o caminho de projeto do Pages; nenhum domínio pago é necessário.

## Conectar os lançamentos do aplicativo

O mantenedor precisa do Node.js 24, do GitHub CLI (`gh`) disponível no PATH e de uma sessão autenticada com acesso às variáveis e aos secrets de Actions de `LamarcKz/Playtrove`. Nunca gravar chaves em arquivos do projeto nem enviar a chave privada em conversa.

### Configuração assistida

1. Nesta pasta do site, rodar:

   ```sh
   node scripts/setup-github-app.mjs
   ```

2. O comando inicia um servidor somente em `127.0.0.1`, numa porta livre, e mostra uma URL de loopback. Abrir essa URL no navegador e manter o comando em execução durante o retorno do GitHub.
3. Clicar em **Revisar o cadastro no GitHub**. Uma pessoa entra na conta do GitHub, confere o cadastro e cria o App. O manifesto pede somente **Actions: Read and write**, desativa o webhook e não exige servidor externo. Conferir essas permissões antes de concluir.
4. Ao retornar ao endereço de loopback, o assistente troca o código temporário pelo cadastro do App. Salva o Client ID na variável `PLAYTROVE_SITE_APP_CLIENT_ID` e envia o PEM diretamente por stdin ao `gh secret set PLAYTROVE_SITE_APP_PRIVATE_KEY`, ambos no repositório **do aplicativo**, `LamarcKz/Playtrove`. A chave é manipulada somente na memória do processo durante a configuração: o assistente não a grava em arquivo nem a imprime em logs.
5. Abrir o link de instalação apresentado e escolher **Only select repositories → Playtrove-site**. Essa instalação é uma ação da pessoa no GitHub; o assistente não escolhe repositórios nem confirma a instalação por ela.
6. Depois da instalação, encerrar o assistente com `Ctrl+C`. Na `main` do aplicativo, executar **Actions → Refresh website → Run workflow** e conferir **Publish site** em `Playtrove-site`. Assim a verificação passa pela conexão entre os dois repositórios.

### Alternativa manual

1. Criar um GitHub App para essa automação, com o webhook desativado: não há servidor externo para receber eventos.
2. Nas permissões de repositório do App, permitir somente **Actions: Read and write**. O acesso básico de metadados é concedido pelo GitHub. Não conceder escrita em Contents, Pages, Issues ou outros recursos.
3. Instalar o App somente em `LamarcKz/Playtrove-site`, usando **Only select repositories**.
4. No repositório do **aplicativo** (`Playtrove`), salvar o Client ID como variável de Actions `PLAYTROVE_SITE_APP_CLIENT_ID` e a chave privada como secret de Actions `PLAYTROVE_SITE_APP_PRIVATE_KEY`. Esses valores não são configurados neste repositório.
5. O workflow do aplicativo gera um token de instalação limitado a `Playtrove-site` e usa a API de `workflow_dispatch` para acionar **`deploy.yml`**, com **`ref: main`**, após publicar uma release estável ou editar, remover ou despublicar uma release, inclusive convertê-la para pré-lançamento. Publicar um pré-lançamento novo é ignorado; edições e retiradas apenas pedem reconstrução, e o site seleciona novamente somente releases publicadas e estáveis. O token temporário não deve ser impresso em logs.
6. Confirmar que a execução de **Publish site** apareceu neste repositório e que o post corresponde às notas da release publicada. A publicação termina quando o job do Pages fica verde; pode haver fila no Actions.

O token de instalação expira em uma hora. A chave privada do App precisa continuar protegida e pode ser rotacionada ou revogada; ela evita um PAT pessoal com renovação recorrente, mas continua sendo uma credencial que o mantenedor controla.

O listener de release do aplicativo precisa existir no commit da tag lançada. Tags antigas não recebem um workflow retroativamente: a importação inicial e edições ou retiradas de releases históricas sem esse listener podem ser refletidas executando `deploy.yml` manualmente na `main`. Nas tags que já contêm o listener atualizado, `published` estável, `edited`, `deleted` e `unpublished` pedem a reconstrução automaticamente; converter uma estável para pré-lançamento também passa pelo caminho de edição. Se o aplicativo passar a criar releases com seu `GITHUB_TOKEN` dentro do Actions, o próprio workflow de lançamento deve chamar o dispatch; não presumir que um segundo workflow será disparado pelo evento dessa release.

## Corrigir uma publicação

Se o build ou a consulta ao GitHub falhar, corrigir a causa e executar `deploy.yml` novamente. Conferir testes, links de downloads, idiomas e a última estável antes de publicar. Para alterar notas, editar a release de origem no aplicativo e reconstruir o site; para alterar os guias ou o visual, abrir uma mudança neste repositório.

## Referências oficiais

- [Workflows e seleção do commit do evento](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflows)
- [Eventos de release e workflow_dispatch](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
- [GitHub Pages por workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Token do GitHub App em Actions](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/making-authenticated-api-requests-with-a-github-app-in-a-github-actions-workflow)
- [API de workflow_dispatch](https://docs.github.com/en/rest/actions/workflows#create-a-workflow-dispatch-event)

## Preparar os guias de um lançamento

Antes de lançar uma versão do aplicativo, preparar uma branch neste repositório e copiar o snapshot atual para o novo número: `versioned_docs/version-X.Y.Z/`, `i18n/en/docusaurus-plugin-content-docs/version-X.Y.Z/` e `versioned_sidebars/version-X.Y.Z-sidebars.json`. Revisar os dois idiomas, manter os IDs correspondentes e adicionar o número a `versions.json`, preservando os snapshots anteriores para a seleção compatível.

Uma versão de guias maior que a release estável fica fora do build público, mesmo depois de aprovada na main. Para revisar esse conteúdo antes do lançamento, usar uma fixture local dessa versão, sem alterar as releases reais. Quando a release estável correspondente for publicada, a reconstrução passa a selecionar esse snapshot. Rodar os testes, o build e a validação de navegação em cada alteração.

## Formato das notas de release

A automação aceita tags estáveis `vX.Y.Z` a partir de 0.5.0. Cada release deve ter os arquivos `Playtrove-Setup-X.Y.Z.exe` e `Playtrove-X.Y.Z-portable.zip` nos Assets. Os outros arquivos exigidos pelo atualizador do aplicativo continuam seguindo o processo de lançamento dele.

O corpo começa com as notas revisadas em inglês e separa as notas em português com o título Markdown exato `## Português`. O cabeçalho inicial `**English** · [Português](#português)` e o separador `---` são opcionais. Não criar um post separado no site. A ausência de um idioma, de um download ou de guias compatíveis faz o build falhar; a publicação anterior permanece disponível.
