# Inventário de ferramentas

## Auditoria da fonte

Os dois inventários originais fornecidos no projeto contêm 182 itens em lista:

- 92 itens de texto, código, segurança, datas, design, imagem, utilidades e finanças;
- 90 itens de matemática, estatística, física, engenharia e química.

Um item do inventário pode agrupar várias capacidades. Por isso, a contagem de
itens não deve ser confundida com a contagem de rotas: uma ferramenta pode
entregar mais de uma capacidade, enquanto capacidades muito próximas devem
compartilhar uma engine.

## Estado atual

O registro tem 117 rotas, cada uma com view Blade, entrada JavaScript e título
nos dois idiomas. A distribuição atual é:

| Área | Rotas |
| --- | ---: |
| texto | 23 |
| imagem | 7 |
| código | 18 |
| geradores | 12 |
| dev | 8 |
| design | 4 |
| matemática | 18 |
| estatística | 7 |
| física | 8 |
| engenharia | 3 |
| química | 6 |
| finanças | 3 |
| **total** | **117** |

## Sobreposições já identificadas

Estas capacidades do inventário devem ampliar ferramentas existentes, em vez
de criar rotas duplicadas:

| Capacidade da fonte | Rota/engine relacionada |
| --- | --- |
| caixa de texto e estilos de case | `text-case`, `case-style-converter` |
| Base64 de texto e arquivo | `base64-encoder`, `image-to-base64` |
| SVG para PNG | `svg-to-png` e `shared/chart-export.js` |
| estatística e histograma | `statistics-analyzer`, `correlation-calculator` |
| MRU/MRUV | `kinematics` e `shared/physics.js` |
| ondas | `wave-calculator` e `shared/physics.js` |
| energia mecânica | `mechanical-energy` e `shared/engineering.js` |
| resistores e Lei de Ohm | `ohms-law`, `resistor-network` |
| massa molar e composição | `molar-mass`, `composition-calculator` |
| balanceamento químico | `chemical-equation-balancer`, `shared/chemistry.js` |
| diluição | `dilution-calculator`, `shared/engineering.js` |
| pH/pOH | `ph-calculator`, `shared/chemistry-extra.js` |
| regressão/correlação | `linear-regression`, `correlation-calculator` |

## Próximos itens sem rota dedicada

O saldo nominal é de 65 itens de inventário ainda não cobertos por uma rota
dedicada ou por uma extensão claramente documentada. A ordem recomendada é:

1. dados: limpeza/transformação, pivot table, séries temporais, estatísticas
   adicionais e exportação de resultados;
2. matemática: cálculo diferencial/integral, geometria de sólidos, números
   complexos, interpolação, métodos numéricos e otimização;
3. física/engenharia: torque, fluidos, óptica, termodinâmica, circuitos,
   esforços, vigas, tolerâncias e simulações interativas;
4. química: estequiometria, concentração, tampões, equilíbrio, redox,
   estruturas de Lewis, geometria molecular e modelos de moléculas;
5. finanças: SAC/Price, valor presente/futuro, inflação, fluxo de caixa,
   aportes, ponto de equilíbrio, margem, markup, cenários e TIR;
6. texto/código/imagem: criptografia Web Crypto, rede/CIDR, conversores
   adicionais, playground sandbox, áudio/vídeo e ferramentas de imagem;
7. visualização: zoom/filtros, 3D, diagramas técnicos, multidimensionalidade
   e simulações científicas mais completas.

Cada novo item deve primeiro procurar uma engine compartilhada existente,
registrar a licença/fonte de dados embutidos quando houver e incluir testes
unitários, renderização nas duas localidades e validação no browser.
