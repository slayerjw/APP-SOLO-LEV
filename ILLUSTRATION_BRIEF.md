# Ilustrações do app — pedido de arte

O app já está pronto para receber ilustrações. Coloque o arquivo na pasta indicada e registre
o caminho em `assets/art-manifest.js`. Enquanto não houver ilustração, o app usa o desenho em SVG.

## Estilo (vale para tudo)
- Ilustração estilo anime/manhwa de ação, traço limpo, sombreamento dramático e iluminação de fantasia sombria.
- Paleta do app: preto, grafite e azul-noite, com brilho de energia na cor do rank.
- **Personagens 100% originais.** Não usar como referência rosto, cabelo, roupa ou aura de
  personagens existentes (por exemplo, o protagonista de Solo Leveling). O estilo pode ser de anime;
  o personagem não pode lembrar um que já existe.
- **Sem texto, logo, letra japonesa, moldura ou painel de referência** dentro da imagem.

## Avatares
- Pasta: `assets/avatars/<classe>/<sexo>/rank-<rank>.webp` (ou `.png`)
  - classe: `guerreiro`, `assassino`, `mago`, `guardiao`, `xama`
  - sexo: `m` ou `f`
  - rank: `e`, `d`, `c`, `b`, `a`, `s`
- **Fundo transparente**, corpo inteiro, de frente ou 3/4, pés encostando na borda de baixo.
- Tamanho: 1100 × 1400 px, personagem com cerca de 1390 px de altura (igual em todos os ranks). WebP com transparência ou PNG.
- Pode mandar o PNG direto do gerador: o Claude recorta, padroniza a altura e converte.
- O mesmo personagem nos 6 ranks; cada rank acrescenta equipamento e energia:
  - E: roupa simples, quase sem brilho.
  - D: primeiras peças de metal.
  - C: silhueta mais heroica, casaco/capa, equipamento de classe claro.
  - B: detalhes luminosos e aura contínua.
  - A: presença de comandante, detalhes dourados.
  - S: forma lendária, aura intensa e partículas, sem esconder o corpo.
- Altura e peso do jogador ajustam levemente a imagem dentro do app.

### Prompt modelo (troque os campos entre colchetes)
> Ilustração estilo anime de ação, corpo inteiro, fundo transparente, personagem original:
> [homem/mulher] jovem, classe [Assassino], Rank [E]. Roupa: [jaqueta tática preta aberta com capuz
> abaixado, gola alta, alças cruzadas no peito, dois cintos, coldre na coxa, luvas sem dedos com faixas,
> botas de combate, casaco rasgado nas costas]. Arma: [duas adagas curvas serrilhadas em pegada reversa].
> Energia de cor [azul-esverdeado] [fraca/moderada/intensa conforme o rank]. Rosto e cabelo originais,
> sem semelhança com personagens existentes. Pose de prontidão, iluminação dramática, sem texto e sem moldura.

## Monstros
- Pasta: `assets/monsters/<id>.webp` — ids em `assets/art-manifest.js` (ex.: `golem` = Titã da Preguiça).
- Cena completa com fundo, 1280 × 1040 px (proporção 16:13), monstro centralizado e inteiro.
- Sem texto e sem painéis de referência (uma única ilustração, não uma folha de conceito).

## Depois de adicionar
1. Confira se o arquivo abre no navegador.
2. Adicione a linha em `assets/art-manifest.js`, por exemplo:
   `'assassino/m/E': 'assets/avatars/assassino/m/rank-e.webp',`
