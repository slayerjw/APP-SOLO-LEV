# V1 — Plano de lançamento rápido

Objetivo: colocar o app utilizável o quanto antes, sem travar o projeto em arte perfeita. A V1 deve parecer um **Sistema de evolução pessoal**, não apenas uma lista de hábitos.

## Escopo da V1

### Manter
- App em um único `index.html`.
- `localStorage` atual e migração de dados.
- Missões de 21 dias divididas em 3 fases.
- XP, níveis, ranks, chefes, história e bestiário.
- Web Audio para evitar arquivos pesados e dependências externas.

### Melhorar agora
1. **Avatar**: reforçar leitura visual por rank e classe, com aura, silhueta e equipamentos mais marcantes.
2. **Monstros**: priorizar 6 inimigos simbólicos principais e dar a cada um uma identidade visual própria.
3. **Feedback sonoro**: distinguir clique, missão concluída, combo/streak, level up, rank up, dano em boss, fase 2 e derrota de boss.
4. **Trilha**: manter trilha procedural leve, mas com estados: lobby, foco, boss e vitória.
5. **Imersão**: melhorar transições de boss, level up, conclusão de 21 dias e desbloqueios.
6. **21 dias**: tratar como arco de treinamento/consolidação dentro do jogo; depois do dia 21 o hábito vira habilidade passiva e entra em manutenção.

## Monstros prioritários da V1

1. **Titã da Preguiça** — inércia e resistência para começar.
2. **Devorador de Foco** — distração e excesso de estímulos.
3. **Parasita da Procrastinação** — adiamento e fuga.
4. **Sussurrador da Dúvida** — insegurança e autossabotagem.
5. **Ladrão de Sequência** — quebra de consistência e streak.
6. **Abismo do Caos** — desorganização acumulada; boss especial.

Os monstros já existentes podem continuar funcionando; a V1 deve renomear/reinterpretar gradualmente sem quebrar a história salva.

## Avatar principal

Nome conceitual: **O Desperto**.

Evolução visual:
- Rank E: roupa simples, pouca aura.
- Rank D: detalhes metálicos e brilho discreto.
- Rank C: silhueta mais heroica e equipamento mais evidente.
- Rank B: aura contínua e detalhes energéticos.
- Rank A: presença de comandante, efeitos mais nobres.
- Rank S: forma lendária, aura intensa e acabamento raro.

As classes continuam determinando o equipamento: Guerreiro, Assassino, Mago, Guardião e Xamã.

## Áudio mínimo da V1

Eventos obrigatórios:
- `ui_click`
- `quest_complete`
- `xp_gain`
- `streak_complete`
- `level_up`
- `rank_up`
- `boss_hit`
- `boss_phase2`
- `boss_defeat`
- `warning`
- `failure`
- `skill_mastered`

Trilha procedural deve possuir 4 estados:
- `ambient` — tela normal.
- `focus` — execução/rotina.
- `boss` — confronto e fase 2.
- `victory` — curta camada de celebração.

## Critérios para considerar a V1 pronta

- Onboarding funciona em celular e desktop.
- É possível iniciar, fechar o navegador, voltar e manter o progresso.
- Completar missão dá feedback visual e sonoro claro.
- Level up é percebido imediatamente.
- Chefes possuem visual, fala e som diferentes da rotina normal.
- O dia 21 parece um acontecimento importante.
- Controle de áudio pode ser ligado/desligado.
- Nenhum asset protegido de anime, jogo ou trilha comercial é usado.

## Depois do lançamento

Prioridade V1.1:
- substituir SVGs mais simples por artes próprias em `assets/`;
- criar variações de avatar por rank;
- adicionar trilhas originais/licenciadas;
- melhorar animações;
- telemetria/analytics e testes com usuários reais;
- revisar equilíbrio de XP, dano e progressão com dados de uso.

Regra do projeto: **lançar simples, medir, melhorar sem quebrar o progresso existente**.
