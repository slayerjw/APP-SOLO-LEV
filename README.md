# Sistema de Disciplina (APP-SOLO-LEV)

App de disciplina gamificado, inspirado no clima de "Sistema" de animes de caçadores.
O usuário vira um **Jogador**, cumpre hábitos diários por 21 dias para transformá-los em
habilidades passivas, sobe de nível e enfrenta chefes numa história em 7 capítulos.

## Como rodar
Abra `index.html` no navegador. Para as imagens e as camadas extras carregarem, use um servidor
(GitHub Pages, ou `python -m http.server 8000` e depois `http://localhost:8000`).
O progresso fica salvo no `localStorage` do navegador (chave `sistema-disciplina-v2`).

## Arquivos
| Arquivo | O que é |
|---|---|
| `index.html` | App base: dados, história, lógica, telas e estado salvo |
| `assets/immersive-v1.js` | Camada imersiva V1: 12 efeitos sonoros, trilha com 4 estados (ambiente, foco, chefe, vitória), Modo Foco, eventos de rank e dia 21, monstros renomeados e Ladrão de Sequência |
| `assets/immersive-v1.css` | Estilos da camada imersiva |
| `assets/cloud-config.js`, `assets/cloud-v1.js`, `supabase/schema.sql` | Cadastro e progresso na nuvem com Supabase. Sem `url`/`anonKey` em `cloud-config.js`, o app funciona só no aparelho |
| `assets/dev-v1.js` | Modo desenvolvedor: abra o app com `#dev` no final do endereço ou toque 5 vezes em SISTEMA. Mostra todas as evoluções e monstros, dispara eventos e ajusta o progresso, com backup do save |
| `assets/art-manifest.js` | Lista das ilustrações em imagem (avatares e monstros). Veja `ILLUSTRATION_BRIEF.md` |
| `assets/art-v1.js` | Artes desenhadas em SVG: Titã da Preguiça e avatar do Assassino com evolução do Rank E ao S |
| `assets/monsters/` | Referências de arte (`titan-preguica.webp`, conceito usado para desenhar o Titã) |
| `ART_BIBLE.md`, `AUDIO_GUIDE.md`, `V1_LAUNCH_PLAN.md` | Guias de arte, áudio e plano da V1 |

A camada imersiva substitui algumas funções do `index.html` (`gainXP`, `hitBoss`, `master`, `rollover`,
`toggle`, `render`, `avatar`, `mArt`). Quem mexer nessas funções no `index.html` precisa conferir a
versão correspondente em `assets/immersive-v1.js`. O `index.html` só inicia o app depois que a camada carrega.

## Estrutura do `index.html`
Tudo está num arquivo só, dividido por comentários `/* ===== ... ===== */` no script:

| Seção | O que contém |
|---|---|
| `DADOS` | Atributos, classes (Guerreiro, Assassino, Mago, Guardião, Xamã), hábitos por classe, inimigos, ranks, penalidades, mensagens diárias |
| `MONSTROS` | Os 10 monstros: nome, rank, fraqueza, história, habilidade e falas |
| `HISTÓRIA` | Os 7 capítulos (`CH`): intro, fase 2 e desfecho de cada chefe |
| `ARTE` | `avatar()` desenha o jogador em SVG (gênero, altura, peso, pele, cabelo, classe, rank). `mArt()` desenha os monstros |
| `ESTADO` | Formato dos dados salvos, criação de novo jogo, migração de versões antigas |
| `SOM` | Efeitos sonoros e trilha ambiente geradas com Web Audio |
| `LÓGICA` | XP, level up, dano no chefe, fase 2, hábitos de 21 dias, virada do dia e penalidades |
| `RENDER` | Desenha a tela principal |
| `ONBOARDING` | Despertar, registro, forma física, entrevista em 3 perguntas e prólogo |

## Regras principais
- **Hábito de 21 dias** em 3 fases: Resistência (1–7), Adaptação (8–14), Consolidação (15–21).
- Falhar um dia faz o hábito voltar ao **início da fase atual**, não ao zero.
- No dia 21 o hábito vira **habilidade passiva** (+3 no atributo) e libera uma missão oculta.
- Cada hábito concluído causa dano no chefe igual ao XP. Hábitos do atributo-fraqueza causam 1,5×.
- Com metade do HP o chefe entra na **fase 2** e passa a curar 25% (em vez de 15%) a cada dia de falha.
- Ranks: E (1), D (10), C (20), B (30), A (45), S (60).

## Regras para quem for editar (Claude, ChatGPT ou pessoas)
1. Sempre puxe a versão mais recente antes de começar (`git pull`).
2. Uma IA mexe por vez. Descreva no commit o que mudou.
3. Não use personagens, imagens ou músicas protegidas do anime. Use arte e áudio próprios ou com licença livre.
4. Se mudar o formato dos dados salvos, atualize `migrate()` para não apagar o progresso de quem já usa.
5. Imagens e músicas novas vão em `assets/`. Confira se o arquivo abre antes de enviar.
6. Avatares e monstros não podem lembrar personagens existentes (por exemplo, o protagonista de Solo Leveling).
