# Sistema de Disciplina (APP-SOLO-LEV)

App de disciplina gamificado, inspirado no clima de "Sistema" de animes de caçadores.
O usuário vira um **Jogador**, cumpre hábitos diários por 21 dias para transformá-los em
habilidades passivas, sobe de nível e enfrenta chefes numa história em 7 capítulos.

## Como rodar
É um único arquivo: abra `index.html` no navegador. Não precisa instalar nada.
O progresso fica salvo no `localStorage` do navegador (chave `sistema-disciplina-v2`).

## V1 imersiva — branch `v1-immersao`
A camada nova de imersão foi mantida separada do arquivo principal para evitar conflito e proteger o progresso existente.

Arquivos:
- `play.html` — launcher da versão imersiva.
- `assets/immersive-v1.js` — monstros, avatar por rank, 12 SFX, trilha dinâmica e eventos especiais.
- `assets/immersive-v1.css` — animações, efeitos de rank, boss, dia 21 e modo foco.

### Como testar a V1 imersiva
Use um servidor estático (GitHub Pages, Live Server, `python -m http.server`, etc.) e abra `play.html`.
O `play.html` carrega o `index.html` original e injeta a camada imersiva no mesmo contexto, sem mudar a chave de save.

Checklist de teste:
1. Onboarding completo e criação de jogador.
2. Avatar Rank E e diferenças visuais nos ranks D, C, B, A e S.
3. Nomes/arte: Titã da Preguiça, Devorador de Foco, Parasita da Procrastinação, Sussurrador da Dúvida e Abismo do Caos.
4. Botão `◎ Foco` e mudança de trilha entre ambient/focus/boss/victory.
5. Sons diferentes para missão, XP, level up, rank up, boss hit, fase 2, boss derrotado, warning, failure e domínio de hábito.
6. Conclusão do dia 21 abre o evento `21 DIAS · ASCENSÃO`.
7. Quebrar uma sequência existente faz aparecer o `Ladrão de Sequência`.
8. Reabrir o app preserva o progresso anterior.

> Durante o teste desta branch, não editar `assets/immersive-v1.js`, `assets/immersive-v1.css` ou os fluxos de áudio/arte/dia 21 do `index.html` em paralelo. Isso evita conflitos entre Claude e ChatGPT.

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
5. Imagens e músicas novas vão em `assets/`.
