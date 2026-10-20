---
id: data-updates
title: "Dados, privacidade e atualizações"
sidebar_position: 8
---

A biblioteca, as notas e as análises ficam num banco de dados local. Não é necessária uma conta do Playtrove.

## Onde ficam os dados

| Edição | Pasta |
| --- | --- |
| Aplicativo instalado | `%APPDATA%\Playtrove` |
| Portátil | `data`, ao lado de `Playtrove.exe`, com `portable.txt` presente |

O banco se chama `playtrove.db`; as imagens ficam na mesma área de dados. Desinstalar a edição instalada preserva a biblioteca.

Feche o aplicativo antes de copiar sua pasta de dados. Para mover uma edição portátil, mantenha sua pasta completa. Chaves protegidas pelo Windows podem precisar ser configuradas novamente em outro computador ou conta.

## Conexões externas

O aplicativo usa a internet para obter metadados e imagens, consultar o RetroAchievements quando há uma conta configurada e procurar versões no GitHub. As chaves secretas são protegidas pelo Windows e não são exibidas novamente.

## Atualizar o aplicativo

Em **Configurações → Sobre**, use **Procurar atualizações**. A procura automática ao abrir vem ativada e pode ser desligada.

Na edição instalada, o aviso de nova versão oferece o download e a instalação; o aplicativo fecha e abre novamente. Na portátil, o botão abre a página da release para baixar a nova versão.

Os downloads oficiais ficam em [Releases](https://github.com/LamarcKz/Playtrove/releases). Consulte as notas da versão antes de atualizar.

A edição de desenvolvimento usa uma cópia separada dos dados; veja [como contribuir](contributing.md).
