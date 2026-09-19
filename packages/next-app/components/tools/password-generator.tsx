'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../content/page-header';
import { Icon } from '../primitives/icon';
import { LayoutStack as Stack } from '../primitives/layout-stack';

const characterSets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
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

function createPassword(length: number, enabled: Record<CharacterSet, boolean>) {
  const alphabet = Object.entries(characterSets)
    .filter(([name]) => enabled[name as CharacterSet])
    .map(([, characters]) => characters)
    .join('');

  if (!alphabet) {
    return { value: '', bits: 0 };
  }

  const value = Array.from({ length }, () => alphabet[randomIndex(alphabet.length)]).join('');
  return { value, bits: Math.round(length * Math.log2(alphabet.length)) };
}

export function PasswordGenerator() {
  const t = useTranslations('Pages.toolsPasswordGenerator');
  const [length, setLength] = useState(16);
  const [enabled, setEnabled] = useState<Record<CharacterSet, boolean>>({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [result, setResult] = useState({ value: '', bits: 0 });
  const [copied, setCopied] = useState(false);

  const enabledCount = useMemo(() => Object.values(enabled).filter(Boolean).length, [enabled]);

  const generate = () => {
    setResult(createPassword(length, enabled));
    setCopied(false);
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const queryLength = Number(query.get('length'));
    const nextLength = Number.isFinite(queryLength)
      ? Math.min(64, Math.max(8, queryLength))
      : 16;
    const nextEnabled = { ...enabled };
    for (const name of Object.keys(characterSets) as CharacterSet[]) {
      const value = query.get(name);
      if (value !== null) {
        nextEnabled[name] = value === 'true';
      }
    }
    setLength(nextLength);
    setEnabled(nextEnabled);
    setResult(createPassword(nextLength, nextEnabled));
  }, []);

  const copy = async () => {
    if (!result.value) {
      return;
    }
    await navigator.clipboard.writeText(result.value);
    setCopied(true);
  };

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
              htmlFor="password-length"
              variant="body2"
              color="text.secondary"
            >
              {t('length')}: {length}
            </Typography>
            <Slider
              id="password-length"
              min={8}
              max={64}
              value={length}
              onChange={(_, value) => setLength(value as number)}
              aria-label={t('length')}
            />
          </Box>
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
            <TextField
              fullWidth
              label={t('password')}
              value={result.value}
              slotProps={{ input: { readOnly: true } }}
              sx={{ '& input': { fontFamily: 'var(--site-font-mono)' } }}
            />
            <Stack spacing={1.5} sx={{ mt: 2 }}>
              <LinearProgress
                variant="determinate"
                value={Math.min(100, (result.bits / 128) * 100)}
                aria-label={t('estimatedEntropy')}
              />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                gap={2}
              >
                <Typography variant="body2" color="text.secondary">
                  {result.bits} {t('estimatedEntropy')}
                </Typography>
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<Icon name="copy" size={16} />}
                  onClick={copy}
                  disabled={!result.value}
                >
                  {copied ? t('copied') : t('copy')}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </>
  );
}
