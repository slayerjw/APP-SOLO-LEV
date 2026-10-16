/* Ilustrações do app.
   Para usar uma ilustração, coloque o arquivo na pasta e adicione a linha aqui.
   Enquanto uma entrada não existir, o app usa o desenho em SVG.

   AVATARES  — chave "classe/sexo/rank"
     classe: guerreiro | assassino | mago | guardiao | xama
     sexo:   m | f
     rank:   E | D | C | B | A | S
     Arquivo: PNG ou WebP com FUNDO TRANSPARENTE, corpo inteiro de frente,
              proporção 4:7 (ex.: 800 x 1400), pés encostando na borda de baixo.

   MONSTROS  — chave = id do monstro
     golem (Titã da Preguiça), aranha (Devorador de Foco), espectro (Parasita da Procrastinação),
     hidra (Abismo do Caos), sombra (Sussurrador da Dúvida), ladrao (Ladrão de Sequência),
     lobo, cavaleiro, comandante, arauto
     Arquivo: PNG ou WebP, cena completa, proporção 16:13 (ex.: 1280 x 1040), SEM TEXTO na imagem.
*/
window.AVATAR_ART = {
  // 'assassino/m/E': 'assets/avatars/assassino/m/rank-e.webp',
};
window.MONSTER_ART = {
  // golem: 'assets/monsters/golem.webp',
};
