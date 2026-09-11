# Backlog de visualização e simulação

Este documento detalha o item 7 de `tools-inventory.md` ("visualização:
zoom/filtros, 3D, diagramas técnicos, multidimensionalidade e simulações
científicas mais completas"). A lista abaixo foi levantada em conversa
externa ao repositório, cruzando sugestões de dados/matemática/física/química
contra as 130 rotas já registradas em `ToolCatalog.cs` (dados de
2026-09-09), para isolar apenas o que ainda não tem equivalente.

Duas dependências já estão vendorizadas e podem ser reaproveitadas nos itens
abaixo: Tabulator (`src/Portfolio/Portfolio.Blazor/wwwroot/vendor/tabulator`), usado hoje só
no editor de tabela, e ECharts, usado hoje só na calculadora de matrizes.
Nenhuma das libs listadas na seção final está presente no projeto ainda.

## Visualização de dados e tabelas

- Gráfico de pizza/donut a partir de CSV colado
- Boxplot, reaproveitando os quartis já calculados em `statistics-analyzer`
- Sparkline embutida em linha de tabela
- Heatmap de matriz/correlação
- Gantt a partir de lista de tarefas com datas
- Diagrama de Venn (2 ou 3 conjuntos)
- Exportador de tabela para LaTeX, complementando `markdown-table-generator`

## Matemática interativa/animada

- Círculo trigonométrico animado
- Visualizador de derivada, com reta tangente móvel
- Soma de Riemann com retângulos ajustáveis por slider (integral)
- Transformações lineares 2D animando um grid, sobre a base de
  `matrix-calculator`
- Fractal de Mandelbrot e de Julia
- Floco de Koch, triângulo de Sierpinski, samambaia de Barnsley
- Espiral de Fibonacci sobre imagem
- Triângulo de Pascal com padrões coloridos
- Quincunx de Galton, ilustrando a distribuição normal emergindo de colisões
- Random walk 1D/2D

## Física (simulação animada, não calculadora)

O catálogo atual cobre bem a parte de cálculo (`kinematics`,
`newtons-second-law`, `ideal-gas`, `wave-calculator`,
`projectile-motion`, `circular-motion`, `mechanical-energy`,
`sensible-heat`), mas nenhuma dessas rotas anima o sistema ao longo do
tempo. Os itens abaixo preenchem essa lacuna e podem usar as calculadoras
existentes como validação dos números da simulação.

- Pêndulo simples
- Pêndulo duplo (caos)
- Massa-mola com amortecimento
- Colisões 1D/2D, com conservação de momento visível
- Órbitas gravitacionais de N corpos
- Ondas estacionárias em corda, com interferência e batimento
- Efeito Doppler animado
- Ray tracing em lentes e espelhos
- Partículas de gás numa caixa, ilustrando a mesma lei de `ideal-gas`
- Decaimento radioativo como população estatística

## Química

- Tabela periódica como mapa de calor por propriedade, estendendo
  `periodic-table` em vez de criar rota nova
- Distribuição eletrônica animada
- Geometria molecular VSEPR
- Curva de titulação simulada, a partir da lógica de `ph-calculator`
- Cinética de reação (concentração por tempo)
- Equilíbrio químico e princípio de Le Chatelier ilustrado

## Dependências candidatas (via esm.sh, nenhuma presente hoje)

- KaTeX, para renderizar fórmula nas calculadoras existentes de
  matemática, física e química
- Mermaid, para os tipos de diagrama que `flowchart-builder` não cobre
  (sequência, classe, ER, Gantt, mindmap)
- Three.js, para as simulações físicas 3D e para a geometria molecular
  VSEPR
- JSXGraph, para geometria dinâmica estilo GeoGebra
- Matter.js, como motor físico 2D pronto para colisões e pêndulos, em vez
  de escrever RK4 à mão em cada simulação
- 3Dmol.js, opcional, para visualizar moléculas reais a partir de
  arquivos PDB ou SDF, além do VSEPR simples
