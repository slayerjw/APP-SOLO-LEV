# Sistema de Disciplina (APP-SOLO-LEV)

App de disciplina gamificado, inspirado no clima de "Sistema" de animes de caçadores.
O usuário vira um **Jogador**, cumpre hábitos diários por 21 dias para transformá-los em habilidades passivas, sobe de nível e enfrenta chefes numa história em 7 capítulos.

## Como rodar a V1 imersiva
Use um servidor local para testar os assets e as camadas externas:

```bash
python -m http.server 8000
```

Depois abra:

```text
http://localhost:8000/play.html
```

O `play.html` carrega o app original e injeta as camadas `immersive-v1` e `immersive-art-v1`, preservando o save na chave `sistema-disciplina-v2`.

## O que testar agora
- Escolha a classe **Assassino das Sombras**.
- Na tela de forma física, altere altura e peso: o avatar SVG muda de proporção em tempo real.
- Exemplo leve/compacto: 160 cm / 55 kg.
- Exemplo alto/encorpado: 188 cm / 92 kg.
- Após entrar no app, confira o card **Evolução do Assassino** e abra `Ver evolução E → S`.
- O Rank atual usa uma das seis artes premium: E, D, C, B, A ou S.
- O **Titã da Preguiça** usa a nova arte premium em boss/bestiário.
- Ligue `♪ Trilha` para testar a trilha procedural original do app. Ela possui estados de ambiente, foco, chefe e vitória.
- Use o botão de **Modo Foco** da camada imersiva para testar a mudança de estado musical.

## Áudio da V1
Nesta versão de teste a trilha é gerada em tempo real pelo **Web Audio API**, sem música comercial ou arquivo protegido. O sistema já diferencia ambiente, foco, boss e vitória, além de 12 efeitos sonoros. Arquivos de música masterizados podem substituir essa camada futuramente sem alterar a lógica de progressão.

## Artes implementadas

```text
assets/avatars/assassino/rank-e.webp
assets/avatars/assassino/rank-d.webp
assets/avatars/assassino/rank-c.webp
assets/avatars/assassino/rank-b.webp
assets/avatars/assassino/rank-a.webp
assets/avatars/assassino/rank-s.webp
assets/monsters/titan-preguica.webp
```

As imagens são versões WebP otimizadas para o teste em celular. As artes-fonte em resolução maior podem ser colocadas depois que a direção visual estiver aprovada.

## Estrutura principal
- `index.html`: app/base e estado persistente.
- `assets/immersive-v1.js`: sons, trilha dinâmica, eventos de imersão, monstros simbólicos e rank effects.
- `assets/immersive-v1.css`: efeitos da camada imersiva.
- `assets/immersive-art-v1.js`: integração das artes premium, avatar proporcional e galeria E → S.
- `assets/immersive-art-v1.css`: apresentação das artes premium.
- `play.html`: launcher seguro para testes.

## Regras principais
- Hábito de 21 dias em 3 fases: Resistência (1–7), Adaptação (8–14), Consolidação (15–21).
- Falhar um dia faz o hábito voltar ao início da fase atual, não ao zero.
- No dia 21 o hábito vira habilidade passiva (+3 no atributo) e libera uma missão oculta.
- Cada hábito concluído causa dano no chefe igual ao XP. Hábitos do atributo-fraqueza causam 1,5×.
- Com metade do HP o chefe entra na fase 2.
- Ranks: E (1), D (10), C (20), B (30), A (45), S (60).

## Regras para quem editar (Claude, ChatGPT ou pessoas)
1. Sempre puxe a versão mais recente antes de começar (`git pull`).
2. Uma IA mexe por vez no mesmo arquivo.
3. Não use personagens, imagens ou músicas protegidas de anime/jogo. Use arte própria e áudio original/licenciado.
4. Se mudar o formato dos dados salvos, atualize `migrate()` para não apagar progresso.
5. Durante esta etapa, testar pelo `play.html` antes de alterar a `main`.
