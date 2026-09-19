'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../content/page-header';
import { LayoutStack as Stack } from '../primitives/layout-stack';

const characterSets = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
} as const;

type CharacterSet = keyof typeof characterSets;

function randomIndex(maximum: number) {
  const limit = 0x100000000 - (0x100000000 % maximum);
  const values = new Uint32Array(1);
  do {
    crypto.getRandomValues(values);
  } while (values[0] >= limit);
  return values[0] % maximum;
}

function createStrings(
  length: number,
  count: number,
  enabled: Record<CharacterSet, boolean>,
) {
  const alphabet = Object.entries(characterSets)
    .filter(([name]) => enabled[name as CharacterSet])
    .map(([, characters]) => characters)
    .join('');

  if (!alphabet) {
    return [];
  }

  return Array.from({ length: count }, () =>
    Array.from({ length }, () => alphabet[randomIndex(alphabet.length)]).join(''),
  );
}

export function RandomStringGenerator() {
  const t = useTranslations('Pages.toolsRandomStringGenerator');
  const [length, setLength] = useState(12);
  const [count, setCount] = useState(1);
  const [enabled, setEnabled] = useState<Record<CharacterSet, boolean>>({
    lowercase: true,
    uppercase: true,
    numbers: true,
    symbols: false,
  });
  const [results, setResults] = useState<string[]>([]);

  const enabledCount = useMemo(() => Object.values(enabled).filter(Boolean).length, [enabled]);

  const generate = () => {
    setResults(createStrings(length, count, enabled));
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const queryLength = Number(query.get('length'));
    const queryCount = Number(query.get('count'));
    const nextLength = Number.isFinite(queryLength) ? Math.min(64, Math.max(1, queryLength)) : 12;
    const nextCount = Number.isFinite(queryCount) ? Math.min(50, Math.max(1, queryCount)) : 1;
    const nextEnabled = { ...enabled };
    for (const name of Object.keys(characterSets) as CharacterSet[]) {
      const value = query.get(name);
      if (value !== null) {
        nextEnabled[name] = value === 'true';
      }
    }
    setLength(nextLength);
    setCount(nextCount);
    setEnabled(nextEnabled);
    setResults(createStrings(nextLength, nextCount, nextEnabled));
  }, []);

  return (
    <>
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />
      <Paper
        component="form"
        onSubmit={(event) => {
          event.preventDefault();
          generate();
        }}
        sx={{ p: { xs: 3, md: 4 }, maxWidth: '48rem' }}
      >
        <Stack spacing={3}>
          <Box>
            <Typography
              component="label"
              htmlFor="random-string-length"
              variant="body2"
              color="text.secondary"
            >
              {t('length')}: {length}
            </Typography>
            <Slider
              id="random-string-length"
              min={1}
              max={64}
              value={length}
              onChange={(_, value) => setLength(value as number)}
              aria-label={t('length')}
            />
          </Box>
          <TextField
            label={t('count')}
            type="number"
            value={count}
            onChange={(event) => setCount(Math.min(50, Math.max(1, Number(event.target.value))))}
            slotProps={{ htmlInput: { min: 1, max: 50 } }}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} flexWrap="wrap" gap={2}>
            {(Object.keys(characterSets) as CharacterSet[]).map((name) => (
              <FormControlLabel
                key={name}
                control={
                  <Checkbox
                    checked={enabled[name]}
                    onChange={(event) =>
                      setEnabled({ ...enabled, [name]: event.target.checked })
                    }
                  />
                }
                label={t(name)}
              />
            ))}
          </Stack>
          {!enabledCount && <Typography color="error">{t('noCharset')}</Typography>}
          <Button type="submit" variant="contained" disabled={!enabledCount}>
            {t('generate')}
          </Button>
          <Box component="section" aria-live="polite">
            <Typography variant="overline" color="text.secondary">
              {t('results')}
            </Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              {results.map((value, index) => (
                <Paper key={`${value}-${index}`} variant="outlined" sx={{ p: 1.5 }}>
                  <Typography
                    sx={{ fontFamily: 'var(--site-font-mono)', overflowWrap: 'anywhere' }}
                  >
                    {value}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </>
  );
}
