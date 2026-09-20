import { words } from './legacy-tool-words';
import { slugify } from './legacy-tool-slugify';

export function convertText(slug: string, input: string, second: string) {
  switch (slug) {
    case 'text-counter': {
      const lines = input ? input.split(/\r?\n/).length : 0;

      const paragraphs = input.trim() ? input.trim().split(/\n\s*\n/).length : 0;

      return `Characters: ${input.length}\nCharacters without spaces: ${input.replace(/\s/g, '').length}\nWords: ${words(input).length}\nLines: ${lines}\nParagraphs: ${paragraphs}`;
    }
    case 'text-reverser':
      return [...input].reverse().join('');
    case 'line-break-remover':
      return input.replace(/\s*\r?\n\s*/g, ' ');
    case 'whitespace-trimmer':
      return input.replace(/\s+/g, ' ').trim();
    case 'duplicate-line-remover':
      return [...new Set(input.split(/\r?\n/))].join('\n');
    case 'accent-remover':
      return input.normalize('NFD').replace(/\p{Diacritic}/gu, '');
    case 'slugify':
      return slugify(input);
    case 'text-repeater':
      return Array(Math.min(100, Math.max(1, Number(second) || 1)))
        .fill(input)
        .join('\n');
    case 'text-case':
      return input.toUpperCase();
    case 'case-style-converter':
      return input
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+(\p{L})/gu, (_, character) => character.toUpperCase());
    case 'dot-case-converter':
      return slugify(input).replaceAll('-', '.');
    case 'duplicate-word-finder': {
      const counts = new Map<string, number>();

      words(input).forEach((word) =>
        counts.set(word.toLowerCase(), (counts.get(word.toLowerCase()) ?? 0) + 1),
      );
      return [...counts]
        .filter(([, count]) => count > 1)
        .map(([word, count]) => `${word}: ${count}`)
        .join('\n');
    }
    case 'palindrome-checker': {
      const normalized = input.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

      return normalized === [...normalized].reverse().join('') ? 'true' : 'false';
    }
    case 'word-frequency-counter': {
      const counts = new Map<string, number>();

      words(input).forEach((word) =>
        counts.set(word.toLowerCase(), (counts.get(word.toLowerCase()) ?? 0) + 1),
      );
      return [...counts]
        .sort((a, b) => b[1] - a[1])
        .map(([word, count]) => `${word}: ${count}`)
        .join('\n');
    }
    case 'line-sorter':
      return input
        .split(/\r?\n/)
        .sort((a, b) => a.localeCompare(b))
        .join('\n');
    case 'reading-time-estimator':
      return `${words(input).length} words · ${Math.max(1, Math.ceil(words(input).length / 200))} min`;
    case 'invisible-char-remover':
      return input.replace(/[\u200B-\u200D\uFEFF]/g, '');
    case 'lorem-ipsum-generator':
      return Array.from(
        { length: Math.min(20, Math.max(1, Number(input) || 3)) },
        () => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      ).join('\n\n');
    case 'pig-latin':
      return input.replace(/\b([a-zA-Z])(\w*)\b/g, '$2$1ay');
    case 'leetspeak':
      return input.replace(
        /[aAeEiIlLoOsStT]/g,
        (character) =>
          ({ a: '4', e: '3', i: '1', l: '1', o: '0', s: '5', t: '7' })[character.toLowerCase()] ??
          character,
      );
    case 'uwu-speak':
      return input
        .replace(/r|l/g, 'w')
        .replace(/R|L/g, 'W')
        .replace(/n([aeiou])/gi, 'ny$1');
    case 'nato-phonetic-alphabet': {
      const alphabet: Record<string, string> = {
        a: 'Alpha',
        b: 'Bravo',
        c: 'Charlie',
        d: 'Delta',
        e: 'Echo',
        f: 'Foxtrot',
        g: 'Golf',
        h: 'Hotel',
        i: 'India',
        j: 'Juliett',
        k: 'Kilo',
        l: 'Lima',
        m: 'Mike',
        n: 'November',
        o: 'Oscar',
        p: 'Papa',
        q: 'Quebec',
        r: 'Romeo',
        s: 'Sierra',
        t: 'Tango',
        u: 'Uniform',
        v: 'Victor',
        w: 'Whiskey',
        x: 'X-ray',
        y: 'Yankee',
        z: 'Zulu',
      };

      return [...input.toLowerCase()]
        .map((character) => alphabet[character] ?? character)
        .join(' ');
    }
    case 'morse-code-translator': {
      const morse: Record<string, string> = {
        a: '.-',
        b: '-...',
        c: '-.-.',
        d: '-..',
        e: '.',
        f: '..-.',
        g: '--.',
        h: '....',
        i: '..',
        j: '.---',
        k: '-.-',
        l: '.-..',
        m: '--',
        n: '-.',
        o: '---',
        p: '.--.',
        q: '--.-',
        r: '.-.',
        s: '...',
        t: '-',
        u: '..-',
        v: '...-',
        w: '.--',
        x: '-..-',
        y: '-.--',
        z: '--..',
        ' ': '/',
      };

      return [...input.toLowerCase()].map((character) => morse[character] ?? character).join(' ');
    }
    case 'roman-numeral-converter': {
      let number = Math.max(1, Math.min(3999, Number(input) || 1));

      const values: [number, string][] = [
        [1000, 'M'],
        [900, 'CM'],
        [500, 'D'],
        [400, 'CD'],
        [100, 'C'],
        [90, 'XC'],
        [50, 'L'],
        [40, 'XL'],
        [10, 'X'],
        [9, 'IX'],
        [5, 'V'],
        [4, 'IV'],
        [1, 'I'],
      ];

      return values
        .map(([value, symbol]) => {
          const count = Math.floor(number / value);

          number %= value;
          return symbol.repeat(count);
        })
        .join('');
    }
    default:
      return input;
  }
}
