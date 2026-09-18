'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Link, { type LinkProps } from '@mui/material/Link';
import type { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { ProtectedEmailChallenge } from '@portfolio/content/protected-email';
import { useTranslations } from 'next-intl';
import type { Ref } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '../primitives/icon';
import { normalizeSx } from '../primitives/sx';
import type { ProtectedEmailWorkerResponse } from './protected-email.worker';

type RevealState = 'idle' | 'working' | 'revealed' | 'error';
type RevealVariant = 'button' | 'inline';
type Translate = ReturnType<typeof useTranslations>;

function useMountedRef() {
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  return mounted;
}

type SettleReveal = (next: RevealState, address: string) => void;

function runReveal(challenge: ProtectedEmailChallenge, settle: SettleReveal) {
  const worker = new Worker(new URL('./protected-email.worker.ts', import.meta.url));

  worker.onmessage = (event: MessageEvent<ProtectedEmailWorkerResponse>) => {
    const response = event.data;
    settle(response.ok ? 'revealed' : 'error', response.ok ? response.email : '');
    worker.terminate();
  };

  worker.onerror = () => {
    settle('error', '');
    worker.terminate();
  };

  worker.postMessage(challenge);
}

function isStartable(challenge: ProtectedEmailChallenge | undefined, state: RevealState) {
  return challenge !== undefined && (state === 'idle' || state === 'error');
}

function useEmailReveal(challenge: ProtectedEmailChallenge | undefined) {
  const [state, setState] = useState<RevealState>('idle');
  const [email, setEmail] = useState('');
  const mounted = useMountedRef();

  const settle = useCallback<SettleReveal>(
    (next, address) => {
      if (mounted.current) {
        setEmail(address);
        setState(next);
      }
    },
    [mounted],
  );

  const startable = isStartable(challenge, state);

  const reveal = useCallback(() => {
    if (challenge && startable) {
      setState('working');
      runReveal(challenge, settle);
    }
  }, [challenge, startable, settle]);

  return { state, email, reveal };
}

function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback((value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
    });
  }, []);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timeout = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  return { copied, copy };
}

type ProtectedEmailProps = {
  challenge?: ProtectedEmailChallenge;
  label: string;
  variant?: RevealVariant;
  showAddress?: boolean;
  color?: LinkProps['color'];
  underline?: LinkProps['underline'];
  typographyVariant?: LinkProps['variant'];
  sx?: SxProps<Theme>;
};

export function ProtectedEmail(protectedEmailProps: ProtectedEmailProps) {
  const {
    challenge,
    label,
    variant = 'inline',
    showAddress = false,
    color,
    underline,
    typographyVariant,
    sx,
  } = protectedEmailProps;
  const t = useTranslations('Common');
  const { state, email, reveal } = useEmailReveal(challenge);
  const [open, setOpen] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (state === 'revealed' && !open) {
      linkRef.current?.focus();
    }
  }, [state, open]);

  const handleTrigger = useCallback(() => {
    setOpen(true);
    reveal();
  }, [reveal]);

  if (!challenge) {
    return null;
  }

  if (state === 'revealed' && !open) {
    return (
      <RevealedEmail
        ref={linkRef}
        email={email}
        label={label}
        variant={variant}
        showAddress={showAddress}
        color={color}
        underline={underline}
        typographyVariant={typographyVariant}
        sx={sx}
      />
    );
  }

  return (
    <>
      <RevealPanel
        state={state}
        variant={variant}
        color={color}
        underline={underline}
        typographyVariant={typographyVariant}
        sx={sx}
        onReveal={handleTrigger}
        t={t}
      />
      <RevealDialog
        open={open}
        onClose={() => setOpen(false)}
        state={state}
        email={email}
        onRetry={reveal}
        t={t}
      />
    </>
  );
}

type RevealPanelProps = {
  state: RevealState;
  variant: RevealVariant;
  color?: LinkProps['color'];
  underline?: LinkProps['underline'];
  typographyVariant?: LinkProps['variant'];
  sx?: SxProps<Theme>;
  onReveal: () => void;
  t: Translate;
};

function RevealPanel(revealPanelProps: RevealPanelProps) {
  const { state, variant, color, underline, typographyVariant, sx, onReveal, t } = revealPanelProps;
  const busy = state === 'working';

  return (
    <Box sx={{ display: 'inline-flex', flexDirection: 'column', gap: 0.5, alignItems: 'start' }}>
      <RevealTrigger
        busy={busy}
        variant={variant}
        color={color}
        underline={underline}
        typographyVariant={typographyVariant}
        sx={sx}
        label={t('reveal')}
        onReveal={onReveal}
      />
      <noscript>
        <Typography variant="body2" color="text.secondary">
          {t('revealNoScript')}
        </Typography>
      </noscript>
    </Box>
  );
}

type RevealTriggerProps = {
  busy: boolean;
  variant: RevealVariant;
  color?: LinkProps['color'];
  underline?: LinkProps['underline'];
  typographyVariant?: LinkProps['variant'];
  sx?: SxProps<Theme>;
  label: string;
  onReveal: () => void;
};

function RevealTrigger(revealTriggerProps: RevealTriggerProps) {
  const { busy, variant, color, underline, typographyVariant, sx, label, onReveal } =
    revealTriggerProps;
  const icon = <Icon name="mail" size={variant === 'button' ? 18 : 16} />;

  if (variant === 'button') {
    return (
      <Button
        type="button"
        onClick={onReveal}
        disabled={busy}
        variant="contained"
        size="medium"
        startIcon={icon}
        sx={{ minHeight: 44, px: 2.25, whiteSpace: 'nowrap' }}
      >
        {label}
      </Button>
    );
  }

  const styles: SxProps<Theme> = [
    {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 0.75,
      border: 0,
      background: 'none',
      cursor: busy ? 'progress' : 'pointer',
      font: 'inherit',
      fontWeight: 600,
      p: 0,
    },
    ...normalizeSx(sx),
  ];

  return (
    <Link
      component="button"
      type="button"
      onClick={onReveal}
      disabled={busy}
      color={color}
      underline={underline}
      variant={typographyVariant}
      sx={styles}
    >
      {icon}
      {label}
    </Link>
  );
}

type RevealedEmailProps = {
  email: string;
  label: string;
  variant: RevealVariant;
  showAddress: boolean;
  color?: LinkProps['color'];
  underline?: LinkProps['underline'];
  typographyVariant?: LinkProps['variant'];
  sx?: SxProps<Theme>;
  ref?: Ref<HTMLAnchorElement>;
};

function RevealedEmail(revealedEmailProps: RevealedEmailProps) {
  const { email, label, variant, showAddress, color, underline, typographyVariant, sx, ref } =
    revealedEmailProps;
  const text = showAddress ? email : label;

  if (variant === 'button') {
    return (
      <Button
        ref={ref}
        component="a"
        href={`mailto:${email}`}
        variant="contained"
        size="medium"
        startIcon={<Icon name="mail" size={18} />}
        sx={{ minHeight: 44, px: 2.25, whiteSpace: 'nowrap' }}
      >
        {text}
      </Button>
    );
  }

  const styles: SxProps<Theme> = [
    { display: 'inline-flex', alignItems: 'center', gap: 0.75, fontWeight: 600 },
    ...normalizeSx(sx),
  ];

  return (
    <Link
      ref={ref}
      href={`mailto:${email}`}
      color={color}
      underline={underline}
      variant={typographyVariant}
      sx={styles}
    >
      <Icon name="mail" size={16} />
      {text}
    </Link>
  );
}

type RevealDialogProps = {
  open: boolean;
  onClose: () => void;
  state: RevealState;
  email: string;
  onRetry: () => void;
  t: Translate;
};

type RevealDialogWorkingProps = {
  t: Translate;
};

function RevealDialogWorking(revealDialogWorkingProps: RevealDialogWorkingProps) {
  const { t } = revealDialogWorkingProps;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <CircularProgress size={20} />
      <Typography variant="body2">{t('revealing')}</Typography>
    </Box>
  );
}

type RevealDialogRevealedProps = {
  email: string;
  t: Translate;
};

function RevealDialogRevealed(revealDialogRevealedProps: RevealDialogRevealedProps) {
  const { email, t } = revealDialogRevealedProps;
  const { copied, copy } = useCopyToClipboard();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        {t('revealedIntro')}
      </Typography>
      <Link
        href={`mailto:${email}`}
        underline="none"
        sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, fontWeight: 600 }}
      >
        <Icon name="mail" size={16} />
        {email}
      </Link>
      <Button
        type="button"
        size="small"
        variant="outlined"
        startIcon={<Icon name={copied ? 'check' : 'copy'} size={16} />}
        onClick={() => copy(email)}
      >
        {copied ? t('emailCopied') : t('copyEmail')}
      </Button>
    </Box>
  );
}

type RevealDialogErrorProps = {
  onRetry: () => void;
  t: Translate;
};

function RevealDialogError(revealDialogErrorProps: RevealDialogErrorProps) {
  const { onRetry, t } = revealDialogErrorProps;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center' }}>
      <Typography variant="body2" color="error">
        {t('revealError')}
      </Typography>
      <Button type="button" size="small" variant="outlined" onClick={onRetry}>
        {t('reveal')}
      </Button>
    </Box>
  );
}

type RevealDialogBodyProps = {
  state: RevealState;
  email: string;
  onRetry: () => void;
  t: Translate;
};

function RevealDialogBody(revealDialogBodyProps: RevealDialogBodyProps) {
  const { state, email, onRetry, t } = revealDialogBodyProps;

  if (state === 'working') {
    return <RevealDialogWorking t={t} />;
  }
  if (state === 'revealed') {
    return <RevealDialogRevealed email={email} t={t} />;
  }
  if (state === 'error') {
    return <RevealDialogError onRetry={onRetry} t={t} />;
  }
  return null;
}

function RevealDialog(revealDialogProps: RevealDialogProps) {
  const { open, onClose, state, email, onRetry, t } = revealDialogProps;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="protected-email-title"
    >
      <DialogTitle
        id="protected-email-title"
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          textAlign: 'center',
          pr: 6,
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            animation:
              state === 'working' ? 'protected-email-pulse 1.6s ease-in-out infinite' : undefined,
            '@keyframes protected-email-pulse': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.4 },
            },
          }}
        >
          <Icon name="mail" size={20} />
        </Box>
        {t('protectedEmailTitle')}
        <IconButton
          onClick={onClose}
          size="small"
          aria-label={t('close')}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <Icon name="close" size={18} />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          pb: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          {t('revealHint')}
        </Typography>

        <Box aria-live="polite" sx={{ display: 'flex', justifyContent: 'center' }}>
          <RevealDialogBody state={state} email={email} onRetry={onRetry} t={t} />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
