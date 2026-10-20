# AGENTS.md — Playtrove website

Este repositório é exclusivamente do site. Leia o README e o MAINTENANCE.md antes de trabalhar; confira o estado do Git e preserve alterações existentes. O aplicativo desktop fica em outro repositório e não deve ser alterado como parte de uma tarefa do site.

- Português e inglês têm as mesmas páginas e informações. Os guias de usuários e colaboradores descrevem a última release estável, sem apresentar recursos ainda em desenvolvimento como disponíveis.
- A fonte dos posts é o corpo público das releases do aplicativo. Preserve as notas em cada idioma, a versão, a data e o link da release. Não invente novidades nem use APIs de IA para reescrevê-las.
- Não edite ou versione posts gerados e arquivos de build. Não faça commits automáticos a partir dos workflows.
- Nunca inclua chaves, tokens, caminhos pessoais ou a biblioteca real de alguém. O GitHub App é configurado no repositório do aplicativo; sua chave privada nunca entra neste repositório ou em mensagens.
- Use npm test e npm run build:test para a validação local com fixtures. Não abra o aplicativo, emuladores ou dados privados para testar o site.
- Os testes do site validam estrutura, conteúdo e comportamento sem capturas, vídeos ou traces. A produção de mídia pública foi autorizada em 2026-10-20 como etapa manual separada: grave apenas a instância isolada de demonstração, com dados temporários e capas públicas, sem acessar bibliotecas pessoais nem abrir emuladores ou jogos. Avise antes de abrir a janela. Siga o contrato em MAINTENANCE.md; as fontes do aplicativo permanecem inalteradas.
- Atualize os dois READMEs e o MAINTENANCE.md quando seus comandos ou contratos mudarem. Decisões de produto pertencem ao usuário; detalhes técnicos podem ser resolvidos dentro do escopo autorizado.
