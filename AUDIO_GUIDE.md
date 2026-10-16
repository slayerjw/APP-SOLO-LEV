# AUDIO GUIDE — V1 Sistema de Disciplina

## Objetivo

O áudio deve dar sensação de Sistema, progresso e conquista sem cansar o usuário. Sons curtos são recompensas; trilhas longas devem ser discretas.

## Identidade sonora

Mistura de:
- interface futurista;
- fantasia sombria;
- synth atmosférico;
- impactos leves de RPG;
- graves para perigo;
- brilhos agudos para recompensa.

Evitar copiar trilhas ou efeitos reconhecíveis de animes, jogos ou filmes.

## Eventos da V1

### ui_click
Duração: 40–90 ms. Clique digital seco e discreto.

### quest_complete
Duração: 250–450 ms. Duas ou três notas ascendentes com brilho.

### xp_gain
Duração: 100–250 ms. Pulso curto, leve e repetível.

### streak_complete
Duração: 500–800 ms. Camada ascendente mais encorpada que `quest_complete`.

### level_up
Duração: 1–1.8 s. Arpejo ascendente + impacto suave.

### rank_up
Duração: 2–3 s. Evento raro: subida, pausa curta e impacto amplo.

### boss_hit
Duração: 150–300 ms. Impacto grave/metálico sem ser agressivo demais.

### boss_phase2
Duração: 1–2 s. Queda grave + ruído/energia crescente.

### boss_defeat
Duração: 2–4 s. Impacto forte seguido de acorde ascendente de vitória.

### warning
Duração: 300–700 ms. Pulso vermelho/alarme discreto, não irritante.

### failure
Duração: 500–900 ms. Três notas descendentes, graves.

### skill_mastered
Duração: 2–3 s. Brilho dourado, coro sintético leve e resolução positiva.

## Trilha procedural

### ambient
Tela principal. Drone profundo, pads frios e notas espaçadas. Volume baixo.

### focus
Missões/execução. Pulso repetitivo suave, sem melodia chamativa. Deve ajudar concentração.

### boss
Mais graves, tensão, pulsação mais rápida e menos notas agudas.

### victory
Não precisa ser loop. Camada curta de 3–6 s sobre a trilha normal.

## Regras de UX

- O áudio deve iniciar somente após interação do usuário, respeitando restrições do navegador.
- Um único botão liga/desliga todos os sons na V1.
- SFX sempre mais altos que a trilha, mas sem clipping.
- Eventos comuns nunca devem soar mais grandiosos que `level_up`, `rank_up` ou `boss_defeat`.
- Não tocar muitos efeitos simultaneamente; priorizar o evento mais importante.
- Manter Web Audio como fallback mesmo quando arquivos de áudio originais forem adicionados depois.

## Fase seguinte

Quando houver orçamento/tempo, substituir gradualmente os tons procedurais por arquivos próprios:

- `assets/audio/sfx/*.ogg` ou `.mp3`
- `assets/audio/music/ambient.*`
- `assets/audio/music/focus.*`
- `assets/audio/music/boss.*`

Licença e autoria devem ser registradas no projeto.
