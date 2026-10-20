---
id: emulators
title: "Emuladores e pastas de ROMs"
sidebar_position: 3
---

O Playtrove 0.7.1 integra os seguintes emuladores:

| Emulador | Plataforma |
| --- | --- |
| PCSX2 | PlayStation 2 |
| DuckStation | PlayStation |
| RetroArch | Vários consoles, conforme o core |
| RPCS3 | PlayStation 3 |
| PPSSPP | PSP |
| Dolphin | GameCube e Wii |
| Azahar | Nintendo 3DS |

Em janelas largas, as seções **Emuladores** e **Pastas de ROMs** ficam em duas colunas. Quando falta largura, uma fica abaixo da outra. Caminhos longos podem quebrar linha e os botões se ajustam ao espaço. Redimensionar preserva os campos que você estiver preenchendo; a detecção, a procura de jogos e a abertura dos emuladores seguem os procedimentos abaixo.

## Configurar o executável

A aba **Emuladores** procura instalações automaticamente. Use **Procurar de novo** para repetir a detecção dos emuladores ainda não encontrados, ou **Escolher… / Trocar…** para indicar outro executável.

O Playtrove abre o emulador instalado no computador; ele não o substitui.

## Adicionar e procurar jogos

Cada pasta de ROMs tem um emulador e um console. O RetroArch exige também um core instalado. As sugestões vêm do nome da pasta, mas você deve conferir os campos antes de adicionar.

Use **Procurar** numa pasta, ou **Procurar jogos em todas**, para encontrar jogos novos. O mesmo caminho de ROM não entra duas vezes. Remover uma pasta dessa lista mantém seus jogos na biblioteca.

Os formatos aceitos dependem do emulador ou core. No RPCS3, a busca reconhece ISOs e pastas extraídas com `PS3_GAME/USRDIR/EBOOT.BIN`.

## Abrir um jogo

**Jogar** usa as configurações do emulador. O RetroArch abre maximizado em janela, preservando o modo de tela cheia quando ele já estiver configurado. Fechar o Playtrove não fecha o emulador.

No Azahar, o tempo da sessão continua sendo contado até fechar o emulador. Saiba mais em [tempo jogado e estatísticas](statistics.md).
