import { textTools, calculationTools, imageTools } from './legacy-tool-support';
import { jsonToCsv } from './legacy-tool-json-to-csv';
import { base64Encode } from './legacy-tool-base64-encode';
import { base64Decode } from './legacy-tool-base64-decode';
import { inspectImage } from './legacy-tool-inspect-image';
import { convertText } from './legacy-tool-convert-text';
import { calculateTool } from './legacy-tool-calculate-tool';

export async function runTool(
  slug: string,
  input: string,
  second: string,
  third: string,
  mode: string,
  file: File | null,
) {
  if (file && imageTools.has(slug)) return inspectImage(file, slug);
  if (textTools.has(slug)) return convertText(slug, input, second);
  if (calculationTools.has(slug)) return calculateTool(slug, input, second, third);
  switch (slug) {
    case 'json-formatter':
      return JSON.stringify(JSON.parse(input), null, 2);
    case 'json-to-csv':
      return jsonToCsv(input);
    case 'csv-chart': {
      const rows = input
        .trim()
        .split(/\r?\n/)
        .map((line) => line.split(','));

      return rows.map((row) => `| ${row.join(' | ')} |`).join('\n');
    }
    case 'data-cleaner':
      return [
        ...new Set(
          input
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean),
        ),
      ].join('\n');
    case 'chemical-equation-balancer':
      return input.replace(/(^|\+|>)\s*([A-Z][a-z]?)/g, '$1$2');
    case 'periodic-table': {
      const elements: Record<string, string> = {
        H: 'Hydrogen · 1',
        He: 'Helium · 2',
        C: 'Carbon · 6',
        N: 'Nitrogen · 7',
        O: 'Oxygen · 8',
        Na: 'Sodium · 11',
        Cl: 'Chlorine · 17',
        Fe: 'Iron · 26',
        Cu: 'Copper · 29',
        Au: 'Gold · 79',
      };

      return elements[input.trim()] ?? 'Enter an element symbol, such as Fe or Au.';
    }
    case 'table-editor':
      return input
        .split(/\r?\n/)
        .map((line) => line.split(/[\t,]/).join(' | '))
        .join('\n');
    case 'flowchart-builder':
      return `flowchart TD\n${input
        .split(/\r?\n/)
        .filter(Boolean)
        .map((line, index) => `  N${index}[${line}] --> N${index + 1}[ ]`)
        .join('\n')}`;
    case 'colorblindness-simulator':
      return `filter: ${input || 'grayscale(1)'};`;
    case 'base64-encoder':
      return mode === 'decode' ? base64Decode(input) : base64Encode(input);
    case 'binary-text-codec':
      return mode === 'decode'
        ? input
            .trim()
            .split(/\s+/)
            .map((value) => String.fromCharCode(parseInt(value, 2)))
            .join('')
        : [...input].map((value) => value.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
    case 'utf8-inspector': {
      const bytes = [...new TextEncoder().encode(input)];

      return `Bytes: ${bytes.length}\nUTF-8: ${bytes.map((value) => value.toString(16).padStart(2, '0')).join(' ')}`;
    }
    case 'hex-text-codec':
      return mode === 'decode'
        ? input
            .trim()
            .split(/\s+/)
            .map((value) => String.fromCharCode(parseInt(value, 16)))
            .join('')
        : [...input].map((value) => value.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
    case 'url-encoder':
      return mode === 'decode' ? decodeURIComponent(input) : encodeURIComponent(input);
    case 'html-entity-codec': {
      const element = document.createElement('textarea');

      if (mode === 'decode') {
        element.innerHTML = input;
        return element.value;
      }
      element.textContent = input;
      return element.innerHTML;
    }
    case 'markdown-to-html':
      return input
        .replace(/^### (.*)$/gm, '<h3>$1</h3>')
        .replace(/^## (.*)$/gm, '<h2>$1</h2>')
        .replace(/^# (.*)$/gm, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    case 'markdown-table-generator':
      return input
        .split(/\r?\n/)
        .map((line) => `| ${line.split('\t').join(' | ')} |`)
        .join('\n');
    case 'find-and-replace':
      return input.replaceAll(second, third);
    case 'regex-tester': {
      // nosemgrep: javascript.lang.security.audit.detect-non-literal-regexp.detect-non-literal-regexp
      const expression = new RegExp(second || input, mode.includes('i') ? 'gi' : 'g');

      return [...(input.matchAll(expression) ?? [])].map((match) => match[0]).join('\n');
    }
    case 'jwt-decoder':
      return JSON.stringify(JSON.parse(base64Decode(input.split('.')[1] ?? '')), null, 2);
    case 'query-string-parser':
      return [...new URLSearchParams(input.replace(/^\?/, ''))]
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    case 'env-file-validator':
      return (
        input
          .split(/\r?\n/)
          .map((line, index) =>
            line.trim() && !/^[A-Z_][A-Z0-9_]*=.*/.test(line) ? `Line ${index + 1}: invalid` : null,
          )
          .filter(Boolean)
          .join('\n') || 'Valid'
      );
    case 'hash-generator': {
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));

      return [...new Uint8Array(digest)]
        .map((value) => value.toString(16).padStart(2, '0'))
        .join('');
    }
    case 'cipher-tool':
      return [...input]
        .map((character) => String.fromCharCode(character.charCodeAt(0) + (Number(second) || 13)))
        .join('');
    case 'vigenere-cipher': {
      const key = second.toLowerCase().replace(/[^a-z]/g, '') || 'key';

      let index = 0;
      return [...input]
        .map((character) => {
          if (!/[a-z]/i.test(character)) return character;

          const base = character.toLowerCase() === character ? 97 : 65;

          const value =
            (character.charCodeAt(0) - base + key.charCodeAt(index++ % key.length) - 97) % 26;

          return String.fromCharCode(base + ((value + 26) % 26));
        })
        .join('');
    }
    case 'color-converter': {
      const hex = input.trim().replace('#', '');

      const value = parseInt(hex, 16);

      return `RGB: ${value >> 16}, ${(value >> 8) & 255}, ${value & 255}`;
    }
    case 'contrast-checker':
      return 'Contrast ratio requires two colors separated by a comma.';
    case 'css-border-radius-generator':
      return `border-radius: ${input || '1rem'};`;
    case 'css-box-shadow-generator':
      return `box-shadow: ${input || '0 0.5rem 1rem rgba(0, 0, 0, 0.2)'};`;
    case 'css-clamp-calculator':
      return `clamp(${input || '1rem'}, 2vw, 2rem)`;
    case 'css-gradient-generator':
      return `background: linear-gradient(135deg, ${input || '#111, #777'});`;
    case 'color-wheel':
    case 'random-color-palette':
      return Array.from(
        { length: 5 },
        () =>
          `#${Math.floor(Math.random() * 0xffffff)
            .toString(16)
            .padStart(6, '0')}`,
      ).join('\n');
    case 'fake-name-generator':
      return ['Alex Morgan', 'Jordan Silva', 'Taylor Martins', 'Sam Oliveira'][
        Math.floor(Math.random() * 4)
      ];
    case 'random-number-generator':
      return String(
        Math.floor(Math.random() * ((Number(second) || 100) - (Number(input) || 0) + 1)) +
          (Number(input) || 0),
      );
    case 'random-date-generator':
      return new Date(Date.now() - Math.random() * 31536000000).toISOString().slice(0, 10);
    case 'uuid-generator':
      return crypto.randomUUID();
    case 'timestamp-converter':
      return Number.isNaN(Number(input))
        ? String(new Date(input).getTime())
        : new Date(Number(input)).toISOString();
    case 'http-status-reference':
      return (
        (
          {
            200: 'OK',
            201: 'Created',
            301: 'Moved Permanently',
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Not Found',
            500: 'Internal Server Error',
          } as Record<string, string>
        )[input] ?? 'Status not found'
      );
    case 'user-agent-parser':
      return typeof navigator === 'undefined' ? input : navigator.userAgent;
    case 'viewport-info':
      return `${window.innerWidth} × ${window.innerHeight}`;
    case 'robots-txt-generator':
      return `User-agent: *\nDisallow: ${input || '/admin'}`;
    case 'gitignore-generator':
      return `node_modules/\ndist/\n.env\n${input || '.DS_Store'}`;
    case 'qr-code-generator':
      return `https://quickchart.io/qr?text=${encodeURIComponent(input)}`;
    case 'image-to-base64':
      return 'Select an image file to encode it as base64.';
    default:
      return input;
  }
}
