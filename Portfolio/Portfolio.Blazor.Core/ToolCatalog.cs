using System.Globalization;
using System.Text;

namespace Portfolio.Blazor.Core;

public readonly record struct ToolDefinition(
    string Slug,
    string Category,
    string Title,
    string PortugueseTitle,
    string Description,
    string PortugueseDescription,
    bool IsStub = false
);

public static class ToolCatalog
{
    public static string LocalizedTitle(ToolDefinition tool, CultureInfo culture) =>
        culture.Name.Equals("pt-BR", StringComparison.OrdinalIgnoreCase)
            ? tool.PortugueseTitle
            : tool.Title;

    public static string LocalizedDescription(ToolDefinition tool, CultureInfo culture) =>
        culture.Name.Equals("pt-BR", StringComparison.OrdinalIgnoreCase)
            ? tool.PortugueseDescription
            : tool.Description;

    private static readonly ToolDefinition[] Definitions =
    [
        new(
            "text-counter",
            "text",
            "text counter",
            "contador de texto",
            "count characters, words, sentences, lines, and paragraphs in your browser.",
            "conte caracteres, palavras, frases, linhas e parágrafos no navegador."
        ),
        new(
            "text-reverser",
            "text",
            "text reverser",
            "inversor de texto",
            "reverse text while preserving Unicode characters.",
            "inverta o texto preservando caracteres Unicode."
        ),
        new(
            "line-break-remover",
            "text",
            "line break remover",
            "removedor de quebras de linha",
            "join lines into a single readable paragraph.",
            "una linhas em um único parágrafo legível."
        ),
        new(
            "whitespace-trimmer",
            "text",
            "whitespace trimmer",
            "limpeza de espaços",
            "trim leading and trailing whitespace from every line.",
            "remova espaços no início e no fim de cada linha."
        ),
        new(
            "duplicate-line-remover",
            "text",
            "duplicate line remover",
            "removedor de linhas duplicadas",
            "remove repeated lines while keeping their first occurrence.",
            "remova linhas repetidas mantendo a primeira ocorrência."
        ),
        new(
            "accent-remover",
            "text",
            "accent remover",
            "removedor de acentos",
            "remove Unicode accent marks from text.",
            "remova marcas de acentuação Unicode do texto."
        ),
        new(
            "slugify",
            "text",
            "slug generator",
            "gerador de slug",
            "turn a title into a lowercase URL-safe slug.",
            "transforme um título em um slug minúsculo e seguro para URLs."
        ),
        new(
            "text-repeater",
            "text",
            "text repeater",
            "repetidor de texto",
            "repeat text locally with a bounded output size.",
            "repita texto localmente com um limite de saída."
        ),
        new(
            "text-case",
            "text",
            "text case converter",
            "conversor de caixa",
            "convert text to upper, lower, title, sentence, camel, snake, kebab, and dot case.",
            "converta texto para maiúsculas, minúsculas, title, sentence, camel, snake, kebab e dot case."
        ),
        new(
            "case-style-converter",
            "code",
            "case style converter",
            "conversor de estilo de case",
            "convert identifiers and phrases between common code naming styles.",
            "converta identificadores e frases entre estilos comuns de nomenclatura de código."
        ),
        new(
            "dot-case-converter",
            "code",
            "dot case converter",
            "conversor para dot.case",
            "convert text into dot.case and related naming styles.",
            "converta texto para dot.case e estilos relacionados."
        ),
        new(
            "duplicate-word-finder",
            "text",
            "duplicate word finder",
            "localizador de palavras duplicadas",
            "find repeated words and their frequencies in local text.",
            "encontre palavras repetidas e suas frequências no texto local."
        ),
        new(
            "palindrome-checker",
            "text",
            "palindrome checker",
            "verificador de palíndromo",
            "check whether text reads the same forwards and backwards.",
            "verifique se um texto é igual de trás para frente."
        ),
        new(
            "word-frequency-counter",
            "text",
            "word frequency counter",
            "contador de frequência de palavras",
            "count and rank the words in a text locally.",
            "conte e classifique as palavras de um texto localmente."
        ),
        new(
            "line-sorter",
            "text",
            "line sorter",
            "ordenador de linhas",
            "sort lines alphabetically or numerically in your browser.",
            "ordene linhas alfabeticamente ou numericamente no navegador."
        ),
        new(
            "reading-time-estimator",
            "text",
            "reading time estimator",
            "estimador de tempo de leitura",
            "estimate reading time from the number of words in a text.",
            "estime o tempo de leitura pela quantidade de palavras de um texto."
        ),
        new(
            "invisible-char-remover",
            "text",
            "invisible character remover",
            "removedor de caracteres invisíveis",
            "remove common zero-width and formatting characters locally.",
            "remova caracteres comuns de largura zero e formatação localmente."
        ),
        new(
            "lorem-ipsum-generator",
            "generators",
            "Lorem ipsum generator",
            "gerador de Lorem ipsum",
            "generate bounded placeholder paragraphs without a network request.",
            "gere parágrafos de preenchimento limitados sem requisição de rede."
        ),
        new(
            "pig-latin",
            "text",
            "Pig Latin converter",
            "conversor para Pig Latin",
            "transform words into the playful Pig Latin language locally.",
            "transforme palavras para a linguagem recreativa Pig Latin localmente."
        ),
        new(
            "leetspeak",
            "text",
            "leetspeak converter",
            "conversor para leetspeak",
            "replace selected letters with common leetspeak symbols.",
            "substitua letras selecionadas por símbolos comuns de leetspeak."
        ),
        new(
            "uwu-speak",
            "text",
            "UwU speak converter",
            "conversor de UwU speak",
            "transform text into a playful UwU-style variant locally.",
            "transforme texto para uma variante recreativa de UwU localmente."
        ),
        new(
            "quadratic-equation",
            "math",
            "quadratic equation",
            "equação de 2º grau",
            "solve a quadratic equation with the discriminant and complex roots.",
            "resolva uma equação de 2º grau com discriminante e raízes complexas."
        ),
        new(
            "statistics-analyzer",
            "statistics",
            "descriptive statistics",
            "estatística descritiva",
            "calculate descriptive statistics and inspect a simple histogram.",
            "calcule estatísticas descritivas e veja um histograma simples."
        ),
        new(
            "number-theory",
            "math",
            "number theory",
            "teoria dos números",
            "calculate GCD, LCM, factors, and primes.",
            "calcule MDC, MMC, fatores e números primos."
        ),
        new(
            "percentage-calculator",
            "math",
            "percentage calculator",
            "calculadora de porcentagem",
            "calculate a percentage of a value in your browser.",
            "calcule uma porcentagem de um valor no navegador."
        ),
        new(
            "gcd-lcm-calculator",
            "math",
            "GCD and LCM",
            "MDC e MMC",
            "calculate the greatest common divisor and least common multiple.",
            "calcule o máximo divisor comum e o mínimo múltiplo comum."
        ),
        new(
            "prime-factorization",
            "math",
            "prime factorization",
            "fatoração prima",
            "decompose an integer into its prime factors.",
            "decomponha um inteiro em seus fatores primos."
        ),
        new(
            "combinatorics",
            "math",
            "combinatorics",
            "combinatória",
            "calculate factorials, permutations, and combinations with bounded integers.",
            "calcule fatoriais, permutações e combinações com inteiros limitados."
        ),
        new(
            "sequences",
            "math",
            "arithmetic and geometric sequences",
            "progressões aritmética e geométrica",
            "calculate terms and sums of arithmetic and geometric sequences.",
            "calcule termos e somas de progressões aritméticas e geométricas."
        ),
        new(
            "base-converter",
            "math",
            "base converter",
            "conversor de bases",
            "convert integers between bases 2 and 36 locally.",
            "converta inteiros entre as bases 2 e 36 localmente."
        ),
        new(
            "fractions",
            "math",
            "fraction calculator",
            "calculadora de frações",
            "simplify and operate on exact fractions locally.",
            "simplifique e opere com frações exatas localmente."
        ),
        new(
            "linear-systems",
            "math",
            "linear systems",
            "sistemas lineares",
            "solve 2x2 and 3x3 linear systems with Gaussian elimination.",
            "resolva sistemas lineares 2x2 e 3x3 por eliminação de Gauss."
        ),
        new(
            "matrix-calculator",
            "math",
            "matrix calculator",
            "calculadora de matrizes",
            "calculate determinants, transposes, and inverses locally.",
            "calcule determinantes, transpostas e inversas localmente."
        ),
        new(
            "vector-calculator",
            "math",
            "vector calculator",
            "calculadora de vetores",
            "calculate dot products, cross products, norms, and angles.",
            "calcule produtos escalares, vetoriais, normas e ângulos."
        ),
        new(
            "function-plotter",
            "math",
            "function plotter",
            "plotador de funções",
            "plot common mathematical functions locally as an accessible SVG curve.",
            "plote funções matemáticas comuns localmente como uma curva SVG acessível."
        ),
        new(
            "correlation-calculator",
            "statistics",
            "correlation calculator",
            "calculadora de correlação",
            "analyze Pearson correlation and a regression line.",
            "analise a correlação de Pearson e uma reta de regressão."
        ),
        new(
            "normal-distribution",
            "statistics",
            "normal distribution",
            "distribuição normal",
            "calculate a normal density, cumulative probability, and curve locally.",
            "calcule densidade normal, probabilidade acumulada e curva localmente."
        ),
        new(
            "linear-regression",
            "statistics",
            "linear regression",
            "regressão linear",
            "fit and visualize a simple linear regression.",
            "calcule e visualize uma regressão linear simples."
        ),
        new(
            "kinematics",
            "physics",
            "kinematics",
            "cinemática",
            "calculate final velocity and displacement from constant acceleration.",
            "calcule velocidade final e deslocamento com aceleração constante."
        ),
        new(
            "newtons-second-law",
            "physics",
            "Newton's second law",
            "segunda lei de Newton",
            "calculate force from mass and acceleration.",
            "calcule força a partir de massa e aceleração."
        ),
        new(
            "ideal-gas",
            "physics",
            "ideal gas law",
            "lei dos gases ideais",
            "solve PV = nRT when any one variable is unknown.",
            "resolva PV = nRT quando uma variável for desconhecida."
        ),
        new(
            "wave-calculator",
            "physics",
            "wave calculator",
            "calculadora de ondas",
            "calculate speed, frequency, or wavelength from two values.",
            "calcule velocidade, frequência ou comprimento de onda a partir de dois valores."
        ),
        new(
            "projectile-motion",
            "physics",
            "projectile motion",
            "lançamento oblíquo",
            "calculate range, height, flight time, and a trajectory locally.",
            "calcule alcance, altura, tempo de voo e trajetória localmente."
        ),
        new(
            "circular-motion",
            "physics",
            "circular motion",
            "movimento circular",
            "calculate angular velocity, period, centripetal acceleration, and force.",
            "calcule velocidade angular, período, aceleração centrípeta e força."
        ),
        new(
            "dilution-calculator",
            "chemistry",
            "dilution calculator",
            "calculadora de diluição",
            "solve C₁V₁ = C₂V₂ when one value is unknown.",
            "resolva C₁V₁ = C₂V₂ quando um valor for desconhecido."
        ),
        new(
            "ph-calculator",
            "chemistry",
            "pH calculator",
            "calculadora de pH",
            "calculate pH and pOH from molar concentration.",
            "calcule pH e pOH a partir da concentração molar."
        ),
        new(
            "amortization-calculator",
            "finance",
            "amortization calculator",
            "calculadora de amortização",
            "compare Price and SAC loan amortization methods.",
            "compare os métodos de amortização Price e SAC."
        ),
        new(
            "table-editor",
            "statistics",
            "table editor",
            "editor de tabelas",
            "edit, inspect, and export bounded CSV data locally.",
            "edite, inspecione e exporte dados CSV localmente com limites."
        ),
        new(
            "json-formatter",
            "code",
            "JSON formatter",
            "formatador JSON",
            "format and validate JSON locally.",
            "formate e valide JSON localmente."
        ),
        new(
            "json-to-csv",
            "code",
            "JSON to CSV",
            "JSON para CSV",
            "convert an array of JSON objects to CSV.",
            "converta um array de objetos JSON para CSV."
        ),
        new(
            "csv-chart",
            "data",
            "CSV chart",
            "gráfico de CSV",
            "plot two numeric CSV columns as an accessible local SVG chart.",
            "plote duas colunas numéricas CSV em um gráfico SVG local e acessível."
        ),
        new(
            "data-cleaner",
            "data",
            "data cleaner",
            "limpador de dados",
            "trim cells, remove empty rows, and deduplicate bounded CSV data locally.",
            "limpe células, remova linhas vazias e elimine duplicatas de CSV localmente."
        ),
        new(
            "roi-calculator",
            "finance",
            "ROI calculator",
            "calculadora de ROI",
            "calculate profit and return on investment locally.",
            "calcule lucro e retorno sobre investimento localmente."
        ),
        new(
            "inflation-calculator",
            "finance",
            "inflation calculator",
            "calculadora de inflação",
            "estimate the future value of money after inflation.",
            "estime o valor futuro do dinheiro após a inflação."
        ),
        new(
            "break-even-calculator",
            "finance",
            "break-even calculator",
            "calculadora de ponto de equilíbrio",
            "find the sales volume needed to cover fixed and variable costs.",
            "encontre o volume de vendas necessário para cobrir custos fixos e variáveis."
        ),
        new(
            "moles-calculator",
            "chemistry",
            "moles and particles",
            "mols e partículas",
            "convert mass and molar mass into moles and particles.",
            "converta massa e massa molar em mols e partículas."
        ),
        new(
            "chemical-equation-balancer",
            "chemistry",
            "chemical equation balancer",
            "balanceador de equações químicas",
            "balance chemical equations and inspect atom counts locally.",
            "balanceie equações químicas e inspecione a contagem de átomos localmente."
        ),
        new(
            "compound-interest-calculator",
            "finance",
            "compound interest",
            "juros compostos",
            "project future value, contributions, and interest earned.",
            "projete valor futuro, aportes e juros acumulados."
        ),
        new(
            "ohms-law",
            "engineering",
            "ohm's law",
            "lei de Ohm",
            "calculate voltage, current, resistance, and power from any two values.",
            "calcule tensão, corrente, resistência e potência a partir de dois valores."
        ),
        new(
            "molar-mass",
            "chemistry",
            "molar mass",
            "massa molar",
            "calculate molar mass and elemental composition from a chemical formula.",
            "calcule a massa molar e a composição elementar de uma fórmula química."
        ),
        new(
            "age-calculator",
            "math",
            "age calculator",
            "calculadora de idade",
            "calculate exact age in years, months, and days between a birthdate and any reference date.",
            "calcula a idade exata em anos, meses e dias entre uma data de nascimento e qualquer data de referência."
        ),
        new(
            "arithmetic-progression",
            "math",
            "arithmetic progression",
            "progressão aritmética",
            "calculate the general term and sum of an arithmetic progression and plot its terms.",
            "calcula o termo geral e a soma de uma progressão aritmética e exibe seus termos em um gráfico."
        ),
        new(
            "base64-encoder",
            "code",
            "base64 encoder / decoder",
            "codificador / decodificador base64",
            "encode text to Base64 or decode it back, with correct UTF-8 handling for accents and emoji.",
            "codifica texto em Base64 ou decodifica de volta, com tratamento correto de UTF-8 para acentos e emoji."
        ),
        new(
            "binary-text-codec",
            "code",
            "binary / text converter",
            "conversor de binário / texto",
            "convert text to space-separated binary bytes or decode binary back to text, with correct UTF-8 handling.",
            "converte texto pra bytes binários separados por espaço ou decodifica binário de volta pra texto, com UTF-8 correto."
        ),
        new(
            "bmi-calculator",
            "math",
            "BMI calculator",
            "calculadora de IMC",
            "calculate your body mass index from height and weight, with the standard WHO weight category.",
            "calcula seu índice de massa corporal a partir de altura e peso, com a categoria padrão da OMS."
        ),
        new(
            "cipher-tool",
            "code",
            "caesar cipher / rot13",
            "cifra de césar / rot13",
            "shift letters by an adjustable amount to encode or decode text, including a one-click ROT13.",
            "desloca letras por uma quantidade ajustável pra codificar ou decodificar texto, com ROT13 em um clique."
        ),
        new(
            "color-converter",
            "design",
            "color converter",
            "conversor de cor",
            "convert a color between hex, rgb, and hsl, with a live swatch preview.",
            "converte uma cor entre hex, rgb e hsl, com preview de amostra ao vivo."
        ),
        new(
            "color-wheel",
            "design",
            "color wheel",
            "roda de cores",
            "build and edit a color palette on an interactive hue/saturation wheel, with 9 harmony rules, per-channel editing, contrast checks, and local save. entirely offline, nothing leaves your device.",
            "monte e edite uma paleta de cores numa roda interativa de matiz/saturação, com 9 regras de harmonia, edição por canal, checagem de contraste e salvamento local. totalmente offline, nada sai do seu dispositivo."
        ),
        new(
            "colorblindness-simulator",
            "design",
            "colorblindness simulator",
            "simulador de daltonismo",
            "upload an image and preview it under protanopia, deuteranopia, and tritanopia color vision simulations.",
            "sobe uma imagem e visualiza como ela ficaria sob protanopia, deuteranopia e tritanopia."
        ),
        new(
            "complex-number-calculator",
            "math",
            "complex number calculator",
            "calculadora de números complexos",
            "add, subtract, multiply, or divide complex numbers and calculate the modulus.",
            "soma, subtrai, multiplica ou divide números complexos e calcula o módulo."
        ),
        new(
            "composition-calculator",
            "chemistry",
            "percent composition",
            "composição percentual",
            "calculate molar mass and the mass percentage of each element in a compound.",
            "calcula massa molar e porcentagem em massa de cada elemento de um composto."
        ),
        new(
            "contrast-checker",
            "design",
            "contrast checker",
            "verificador de contraste",
            "check the WCAG contrast ratio between a foreground and background color, with AA and AAA pass/fail badges.",
            "verifica a razão de contraste WCAG entre uma cor de texto e de fundo, com selos de aprovação AA e AAA."
        ),
        new(
            "css-border-radius-generator",
            "generators",
            "css border-radius generator",
            "gerador de border-radius css",
            "build a CSS border-radius value with per-corner control and a live preview.",
            "monta um valor de border-radius CSS com controle por canto e preview ao vivo."
        ),
        new(
            "css-box-shadow-generator",
            "generators",
            "css box-shadow generator",
            "gerador de box-shadow css",
            "build a CSS box-shadow (with optional multiple layers) using offset, blur, spread, color, and inset controls.",
            "monta um box-shadow CSS (com múltiplas camadas opcionais) usando controles de offset, blur, spread, cor e inset."
        ),
        new(
            "css-clamp-calculator",
            "generators",
            "css clamp() calculator",
            "calculadora de clamp() css",
            "compute a responsive clamp() value from a minimum and maximum font size across a viewport width range.",
            "calcula um valor clamp() responsivo a partir de um tamanho de fonte mínimo e máximo ao longo de um intervalo de largura de viewport."
        ),
        new(
            "css-gradient-generator",
            "generators",
            "css gradient generator",
            "gerador de gradiente css",
            "build a linear or radial CSS gradient from color stops, with a live preview and copyable CSS.",
            "monta um gradiente CSS linear ou radial a partir de pontos de cor, com preview ao vivo e CSS copiável."
        ),
        new(
            "date-difference-calculator",
            "math",
            "date difference calculator",
            "calculadora de diferença entre datas",
            "calculate the difference between two dates in total days and in a years/months/days breakdown.",
            "calcula a diferença entre duas datas em total de dias e numa quebra de anos/meses/dias."
        ),
        new(
            "env-file-validator",
            "code",
            "env file validator",
            "validador de arquivo .env",
            "validate .env-style content line by line: duplicate keys, invalid characters, and malformed lines.",
            "valida conteúdo estilo .env linha por linha: chaves duplicadas, caracteres inválidos e linhas malformadas."
        ),
        new(
            "fake-name-generator",
            "generators",
            "fake name generator",
            "gerador de nomes fictícios",
            "generate fake full names, and optionally usernames and emails derived from them, entirely offline in your browser.",
            "gera nomes completos fictícios e, opcionalmente, usuários e emails derivados deles, totalmente offline no seu navegador."
        ),
        new(
            "find-and-replace",
            "text",
            "find and replace",
            "localizar e substituir",
            "find and replace text, with case-sensitive and regular expression modes.",
            "localiza e substitui texto, com modos sensível a maiúsculas e expressão regular."
        ),
        new(
            "flowchart-builder",
            "engineering",
            "flowchart builder",
            "construtor de fluxogramas",
            "turn text connections into an accessible, exportable SVG flowchart.",
            "transforma conexões em texto em um fluxograma SVG acessível e exportável."
        ),
        new(
            "fraction-calculator",
            "math",
            "fraction calculator",
            "calculadora de frações",
            "simplify and operate on fractions while keeping the exact result and showing its decimal form.",
            "simplifica e opera frações mantendo o resultado exato e mostrando a forma decimal."
        ),
        new(
            "geometric-progression",
            "math",
            "geometric progression",
            "progressão geométrica",
            "calculate the general term and sum of a geometric progression and plot its terms.",
            "calcula o termo geral e a soma de uma progressão geométrica e exibe seus termos em um gráfico."
        ),
        new(
            "gitignore-generator",
            "dev",
            "gitignore generator",
            "gerador de gitignore",
            "pick one or more curated .gitignore templates and combine them into a single file, copyable or downloadable.",
            "escolha um ou mais templates curados de .gitignore e combine-os em um único arquivo, copiável ou baixável."
        ),
        new(
            "hash-generator",
            "code",
            "hash generator",
            "gerador de hash",
            "compute SHA-1, SHA-256, SHA-384, and SHA-512 hashes of text, entirely in your browser.",
            "calcula hashes SHA-1, SHA-256, SHA-384 e SHA-512 de um texto, direto no navegador."
        ),
        new(
            "hex-text-codec",
            "code",
            "hex / text converter",
            "conversor de hex / texto",
            "convert text to a hex byte string or decode hex back to text, with correct UTF-8 handling.",
            "converte texto pra uma string de bytes hex ou decodifica hex de volta pra texto, com UTF-8 correto."
        ),
        new(
            "html-entity-codec",
            "code",
            "html entity encoder / decoder",
            "codificador / decodificador de entidades html",
            "encode text to HTML entities or decode HTML entities back to plain text.",
            "codifica texto em entidades HTML ou decodifica entidades HTML de volta pra texto puro."
        ),
        new(
            "http-status-reference",
            "dev",
            "http status reference",
            "referência de status http",
            "a searchable reference table of standard HTTP status codes, from 1xx to 5xx, with their name and a one-line description.",
            "uma tabela de referência pesquisável dos códigos de status HTTP padrão, de 1xx a 5xx, com nome e uma descrição resumida."
        ),
        new(
            "image-color-picker",
            "image",
            "image color picker",
            "seletor de cor de imagem",
            "upload an image and click anywhere on it to read the pixel color as hex and rgb.",
            "sobe uma imagem e clica em qualquer ponto pra ler a cor do pixel em hex e rgb."
        ),
        new(
            "image-compressor",
            "image",
            "image compressor",
            "compressor de imagem",
            "re-encode an image as jpg or webp with an adjustable quality level and compare the file size before and after.",
            "recodifica uma imagem como jpg ou webp com nível de qualidade ajustável e compara o tamanho do arquivo antes e depois."
        ),
        new(
            "image-dimension-calculator",
            "image",
            "image dimension calculator",
            "calculadora de dimensão de imagem",
            "compute a missing width or height from an original size while keeping the aspect ratio.",
            "calcula uma largura ou altura faltante a partir de um tamanho original, mantendo a proporção."
        ),
        new(
            "image-format-converter",
            "image",
            "image format converter",
            "conversor de formato de imagem",
            "convert an image between png, jpg, and webp, right in your browser, and download the result.",
            "converte uma imagem entre png, jpg e webp, direto no navegador, e baixa o resultado."
        ),
        new(
            "image-resizer",
            "image",
            "image resizer",
            "redimensionador de imagem",
            "resize an image to a specific width and height, right in the browser, and download the result.",
            "redimensiona uma imagem pra uma largura e altura específicas, direto no navegador, e baixa o resultado."
        ),
        new(
            "image-to-base64",
            "image",
            "image to base64",
            "imagem para base64",
            "convert an image into a base64 data url you can paste directly into css or html.",
            "converte uma imagem numa data url em base64 pra colar direto no css ou html."
        ),
        new(
            "jwt-decoder",
            "code",
            "JWT decoder",
            "decodificador de JWT",
            "decode a JWT's header and payload, right in the browser. no signature check, nothing sent anywhere.",
            "decodifica o header e o payload de um JWT, direto no navegador. sem checagem de assinatura, nada é enviado."
        ),
        new(
            "linear-system-2x2",
            "math",
            "2×2 linear system",
            "sistema linear 2×2",
            "solve a two-equation linear system with determinants and show the intersection of the lines.",
            "resolve um sistema linear de duas equações pelo método dos determinantes e mostra a interseção das retas."
        ),
        new(
            "linear-system-3x3",
            "math",
            "3×3 linear system",
            "sistema linear 3×3",
            "solve a three-equation system using Gauss-Jordan elimination.",
            "resolve um sistema de três equações usando eliminação de Gauss-Jordan."
        ),
        new(
            "loan-interest-calculator",
            "finance",
            "loan interest calculator",
            "calculadora de juros de empréstimo",
            "calculate the monthly payment, total paid, and total interest for a fixed-rate amortizing loan.",
            "calcula a parcela mensal, o total pago e o total de juros de um empréstimo com taxa fixa e amortização constante."
        ),
        new(
            "markdown-table-generator",
            "code",
            "markdown table generator",
            "gerador de tabela markdown",
            "turn tab- or comma-separated rows into a properly aligned Markdown table.",
            "transforma linhas separadas por tab ou vírgula em uma tabela Markdown alinhada."
        ),
        new(
            "markdown-to-html",
            "dev",
            "markdown to html",
            "markdown para html",
            "convert markdown to html, with a live preview and copyable HTML output. covers the common syntax: headings, bold/italic, code, links, and lists.",
            "converte markdown pra html, com preview ao vivo e saída html copiável. cobre a sintaxe comum: títulos, negrito/itálico, código, links e listas."
        ),
        new(
            "mechanical-energy",
            "physics",
            "mechanical energy",
            "energia mecânica",
            "calculate kinetic, gravitational, and elastic energy together with the system total.",
            "calcula as energias cinética, gravitacional e elástica e o total do sistema."
        ),
        new(
            "morse-code-translator",
            "code",
            "morse code translator",
            "tradutor de código morse",
            "translate text to international Morse code and back, right in your browser.",
            "traduz texto pro código morse internacional e de volta, direto no navegador."
        ),
        new(
            "nato-phonetic-alphabet",
            "text",
            "nato phonetic alphabet",
            "alfabeto fonético da otan",
            "spell out text using the NATO/ICAO phonetic alphabet or other real spelling alphabets, including an informal Brazilian Portuguese one, one word per letter.",
            "soletra um texto usando o alfabeto fonético da OTAN/ICAO ou outros alfabetos de soletração reais, incluindo um informal em português do Brasil, uma palavra por letra."
        ),
        new(
            "number-base-converter",
            "code",
            "number base converter",
            "conversor de base numérica",
            "convert a number between binary, octal, decimal, and hexadecimal at once.",
            "converte um número entre binário, octal, decimal e hexadecimal de uma vez."
        ),
        new(
            "password-generator",
            "generators",
            "password generator",
            "gerador de senha",
            "generate strong, random passwords using your browser's cryptographic random number generator.",
            "gera senhas fortes e aleatórias usando o gerador criptográfico de números aleatórios do navegador."
        ),
        new(
            "periodic-table",
            "chemistry",
            "periodic table",
            "tabela periódica",
            "explore all 118 elements by symbol, atomic number, name, and category.",
            "explore os 118 elementos por símbolo, número atômico, nome e categoria."
        ),
        new(
            "qr-code-generator",
            "generators",
            "qr code generator",
            "gerador de qr code",
            "generate a qr code from any text or url, right in your browser, and download it as a png.",
            "gera um qr code a partir de qualquer texto ou url, direto no navegador, e baixa como png."
        ),
        new(
            "query-string-parser",
            "code",
            "query string parser",
            "parser de query string",
            "parse a URL or raw query string into a key/value table, or build a query string from key/value pairs.",
            "transforma uma URL ou query string bruta em uma tabela de chave/valor, ou monta uma query string a partir de pares chave/valor."
        ),
        new(
            "random-color-palette",
            "generators",
            "random color palette generator",
            "gerador de paleta de cores aleatória",
            "generate a palette of random, harmonious colors using your browser's cryptographic random number generator.",
            "gera uma paleta de cores aleatórias e harmônicas usando o gerador de números aleatórios criptográfico do seu navegador."
        ),
        new(
            "random-date-generator",
            "generators",
            "random date generator",
            "gerador de datas aleatórias",
            "generate one or many random dates within a range using your browser's cryptographic random number generator.",
            "gera uma ou várias datas aleatórias dentro de um intervalo usando o gerador de números aleatórios criptográfico do seu navegador."
        ),
        new(
            "random-number-generator",
            "generators",
            "random number generator",
            "gerador de números aleatórios",
            "generate one or many random numbers within a range using your browser's cryptographic random number generator.",
            "gera um ou vários números aleatórios dentro de um intervalo usando o gerador de números aleatórios criptográfico do seu navegador."
        ),
        new(
            "random-string-generator",
            "generators",
            "random string generator",
            "gerador de strings aleatórias",
            "generate one or many random strings from a chosen character set using your browser's cryptographic random number generator.",
            "gera uma ou várias strings aleatórias a partir de um conjunto de caracteres escolhido, usando o gerador de números aleatórios criptográfico do seu navegador."
        ),
        new(
            "regex-tester",
            "dev",
            "regex tester",
            "testador de regex",
            "test a regular expression against a string, right in your browser, with live match highlighting and captured groups.",
            "testa uma expressão regular contra uma string, direto no navegador, com destaque ao vivo dos matches e grupos capturados."
        ),
        new(
            "resistor-network",
            "engineering",
            "equivalent resistance",
            "resistência equivalente",
            "calculate the equivalent resistance of multiple resistors in series or parallel.",
            "calcula a resistência equivalente de vários resistores em série ou em paralelo."
        ),
        new(
            "robots-txt-generator",
            "dev",
            "robots.txt generator",
            "gerador de robots.txt",
            "build a robots.txt file from repeatable user-agent rules, an optional sitemap URL, and crawl-delay, right in your browser.",
            "monte um arquivo robots.txt a partir de regras repetíveis por user-agent, uma URL de sitemap opcional e crawl-delay, direto no navegador."
        ),
        new(
            "roman-numeral-converter",
            "text",
            "roman numeral converter",
            "conversor de números romanos",
            "convert numbers to roman numerals and back, with validation for out-of-range numbers and malformed numerals.",
            "converte números para algarismos romanos e vice-versa, com validação de números fora do intervalo e numerais malformados."
        ),
        new(
            "sensible-heat",
            "physics",
            "sensible heat",
            "calor sensível",
            "calculate thermal energy using Q = mcΔT.",
            "calcula a energia térmica pela relação Q = mcΔT."
        ),
        new(
            "svg-to-png",
            "image",
            "svg to png",
            "svg para png",
            "paste or upload svg markup and render it as a downloadable png at any size.",
            "cola ou sobe um markup svg e renderiza como um png baixável em qualquer tamanho."
        ),
        new(
            "timestamp-converter",
            "dev",
            "timestamp converter",
            "conversor de timestamp",
            "convert between unix timestamps and human-readable dates, in both UTC and your local timezone.",
            "converte entre timestamps unix e datas legíveis, em UTC e no seu fuso horário local."
        ),
        new(
            "triangle-calculator",
            "math",
            "triangle calculator",
            "calculadora de triângulo",
            "calculate the perimeter, semiperimeter, and area of a triangle using Heron’s formula.",
            "calcula perímetro, semiperímetro e área de um triângulo usando a fórmula de Heron."
        ),
        new(
            "unit-converter",
            "math",
            "unit converter",
            "conversor de unidades",
            "convert between length, weight, and temperature units, live as you type.",
            "converte entre unidades de comprimento, peso e temperatura, ao vivo enquanto você digita."
        ),
        new(
            "url-encoder",
            "code",
            "url encoder / decoder",
            "codificador / decodificador de url",
            "encode text for use in a URL, or decode a percent-encoded string back to plain text.",
            "codifica texto pra uso em URL, ou decodifica uma string percent-encoded de volta pra texto puro."
        ),
        new(
            "user-agent-parser",
            "dev",
            "user agent parser",
            "analisador de user agent",
            "parse a user-agent string into browser, OS, and engine, with a best-effort, regex-based breakdown.",
            "decompõe uma string de user-agent em navegador, sistema operacional e engine, com uma análise heurística baseada em regex."
        ),
        new(
            "utf8-inspector",
            "code",
            "utf-8 inspector",
            "inspetor de utf-8",
            "inspect a string's UTF-8 byte representation, byte count, character count, and code point count.",
            "inspeciona a representação em bytes UTF-8 de um texto, a contagem de bytes, caracteres e code points."
        ),
        new(
            "uuid-generator",
            "generators",
            "UUID generator",
            "gerador de UUID",
            "generate one or many version 4 UUIDs using your browser's native crypto.randomUUID.",
            "gera um ou vários UUIDs versão 4 usando o crypto.randomUUID nativo do navegador."
        ),
        new(
            "viewport-info",
            "dev",
            "viewport info",
            "informações de viewport",
            "a live view of what your browser reports about your viewport, screen, pixel ratio, and language, updating as you resize.",
            "uma visão ao vivo do que o seu navegador informa sobre viewport, tela, pixel ratio e idioma, atualizando conforme você redimensiona."
        ),
        new(
            "vigenere-cipher",
            "text",
            "vigenère cipher",
            "cifra de vigenère",
            "encode or decode text with the Vigenère cipher using a keyword, preserving letter case and passing non-letters through unchanged.",
            "codifica ou decodifica texto com a cifra de Vigenère usando uma palavra-chave, preservando maiúsculas/minúsculas e mantendo caracteres não alfabéticos intactos."
        ),
    ];

    private static readonly ToolDefinition[] PlannedDefinitions = [];

    public static IReadOnlyList<ToolDefinition> All =>
        Definitions.Concat(PlannedDefinitions).ToArray();

    public static IReadOnlyList<string> Categories =>
        All.Select(tool => tool.Category)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .Order(StringComparer.OrdinalIgnoreCase)
            .ToArray();

    public static IReadOnlyList<ToolDefinition> Filter(string? query, string? category)
    {
        var normalizedQuery = SearchKey(query?.Trim() ?? string.Empty);
        var normalizedCategory = category?.Trim() ?? string.Empty;

        return All.Where(tool =>
                normalizedCategory.Length == 0
                || tool.Category.Equals(normalizedCategory, StringComparison.OrdinalIgnoreCase)
            )
            .Where(tool =>
                normalizedQuery.Length == 0
                || SearchKey(tool.Slug).Contains(normalizedQuery, StringComparison.Ordinal)
                || SearchKey(tool.Category).Contains(normalizedQuery, StringComparison.Ordinal)
                || SearchKey(tool.Title).Contains(normalizedQuery, StringComparison.Ordinal)
                || SearchKey(tool.PortugueseTitle)
                    .Contains(normalizedQuery, StringComparison.Ordinal)
                || SearchKey(tool.Description).Contains(normalizedQuery, StringComparison.Ordinal)
                || SearchKey(tool.PortugueseDescription)
                    .Contains(normalizedQuery, StringComparison.Ordinal)
            )
            .ToArray();
    }

    private static ToolDefinition Planned(
        string slug,
        string category,
        string title,
        string portugueseTitle
    ) =>
        new(
            slug,
            category,
            title,
            portugueseTitle,
            "planned local tool surface; implementation will remain client-only.",
            "superfície local planejada; a implementação permanecerá client-only.",
            true
        );

    private static string SearchKey(string value)
    {
        var normalized = value.Normalize(NormalizationForm.FormD);
        var withoutDiacritics = normalized.Where(character =>
            CharUnicodeInfo.GetUnicodeCategory(character) != UnicodeCategory.NonSpacingMark
        );

        return string.Concat(withoutDiacritics)
            .Normalize(NormalizationForm.FormC)
            .ToLowerInvariant();
    }
}
