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

O banco se chama `playtrove.db`; as imagens ficam na mesma área de dados, e o WebView2 guarda seus arquivos de funcionamento na subpasta `webview`. É a mesma pasta usada desde as versões 0.7.x: ao atualizar, a biblioteca abre direto. Desinstalar a edição instalada preserva a biblioteca.

Feche o aplicativo antes de copiar sua pasta de dados. Para mover uma edição portátil, mantenha sua pasta completa. Chaves protegidas pelo Windows podem precisar ser configuradas novamente em outro computador ou conta.

## Conexões externas

O aplicativo usa a internet para obter metadados e imagens, consultar o RetroAchievements quando há uma conta configurada e procurar versões no GitHub. As chaves secretas são protegidas pelo Windows e não são exibidas novamente.

## Atualizar o aplicativo

Em **Configurações → Sobre**, use **Procurar atualizações**. A procura automática ao abrir vem ativada e pode ser desligada.

Na edição instalada, o aviso de nova versão oferece **Atualizar**: o aplicativo baixa a versão nova, instala e abre novamente. Antes de instalar, ele confere a assinatura da atualização com a chave do projeto; um arquivo sem essa assinatura ou alterado depois de assinado é recusado. Na portátil, o botão **Baixar** abre a página da release para baixar a nova versão.

Quem tem uma versão anterior, inclusive as 0.7.x, passa para a 1.0.0 pelo mesmo aviso de atualização; veja [instalação](installation.md#quem-já-tem-a-07x).

Os downloads oficiais ficam em [Releases](https://github.com/LamarcKz/Playtrove/releases). Consulte as notas da versão antes de atualizar.

A edição de desenvolvimento usa uma cópia separada dos dados; veja [como contribuir](contributing.md).
