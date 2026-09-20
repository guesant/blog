'use client';

import { Box } from '../../ui';
import { Button } from '../../ui';
import { Checkbox } from '../../ui';
import { FormControlLabel } from '../../ui';
import { OptionSelect } from '../../ui';
import { Paper } from '../../ui';
import { TextField } from '../../ui';
import { Typography } from '../../ui';
import { HiddenInput } from '../../ui';
import { LegacyRunButton } from './legacy-run-button';
import { useLocale, useTranslations } from '@/i18n/compat';
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from 'react';
import { PageHeader } from '../../content/page-header';
import { Stack } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import { toolCategoryLabel, toolCatalog, toolLabel } from '@portfolio/data/config/tool-catalog';
import {
  type ToolWorkbenchProps,
  imageTools,
  defaultInput,
  defaultSecond,
  defaultThird,
  numericFieldLabels,
  noPrimaryInputTools,
} from './legacy-tool-support';
import { runTool } from './legacy-tool-run-tool';
import { isMultiline } from './legacy-tool-is-multiline';

type LegacyToolWorkbenchProps = ToolWorkbenchProps;

export function LegacyToolWorkbench(props: LegacyToolWorkbenchProps) {
  const { slug } = props;

  const locale = useLocale();

  const tNav = useTranslations('Nav');

  const t = useTranslations('Pages.toolsWorkbench');

  const definition = useMemo(() => toolCatalog.find((item) => item.slug === slug), [slug]);

  const initialInput = defaultInput[slug] ?? '';

  const initialSecond = defaultSecond[slug] ?? '';

  const initialThird = defaultThird[slug] ?? '';

  const [input, setInput] = useState(initialInput);

  const [second, setSecond] = useState(initialSecond);

  const [third, setThird] = useState(initialThird);

  const [mode, setMode] = useState('encode');

  const [file, setFile] = useState<File | null>(null);

  const [resizerDimensions, setResizerDimensions] = useState({
    width: '',
    height: '',
    naturalWidth: 0,
    naturalHeight: 0,
  });

  const [keepRatio, setKeepRatio] = useState(true);

  const [result, setResult] = useState('');

  const [error, setError] = useState('');

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setInput(initialInput);
    setSecond(initialSecond);
    setThird(initialThird);
    setMode('encode');
    setFile(null);
    setResizerDimensions({ width: '', height: '', naturalWidth: 0, naturalHeight: 0 });
    setKeepRatio(true);
    setError('');
    setCopied(false);
    let active = true;
    void runTool(slug, initialInput, initialSecond, initialThird, 'encode', null)
      .then((value) => {
        if (active) setResult(String(value ?? ''));
      })
      .catch(() => {
        if (active) setResult('');
      });
    return () => {
      active = false;
    };
  }, [initialInput, initialSecond, initialThird, slug]);

  const run = async () => {
    setError('');
    setCopied(false);
    try {
      setResult(await runTool(slug, input, second, third, mode, file));
    } catch {
      setResult('');
      setError(t('invalidInput'));
    }
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
  };

  const readResizerImage = (nextFile: File | null) => {
    if (slug !== 'image-resizer' || !nextFile) {
      return;
    }

    const url = URL.createObjectURL(nextFile);

    const image = new Image();

    image.onload = () => {
      setResizerDimensions({
        width: String(image.naturalWidth),
        height: String(image.naturalHeight),
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
      });
      URL.revokeObjectURL(url);
    };
    image.onerror = () => {
      setError(t('invalidInput'));
      URL.revokeObjectURL(url);
    };
    image.src = url;
  };

  const downloadResizedImage = async () => {
    if (!file || slug !== 'image-resizer') {
      return;
    }

    const width = Number(resizerDimensions.width);

    const height = Number(resizerDimensions.height);

    if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) {
      setError(t('invalidInput'));
      return;
    }

    const sourceUrl = URL.createObjectURL(file);

    let image: HTMLImageElement;
    try {
      image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const nextImage = new Image();

        nextImage.onload = () => resolve(nextImage);
        nextImage.onerror = () => reject(new Error('image-load-failed'));
        nextImage.src = sourceUrl;
      });
    } catch {
      setError(t('invalidInput'));
      URL.revokeObjectURL(sourceUrl);
      return;
    }
    URL.revokeObjectURL(sourceUrl);

    const canvas = document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d')?.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, file.type || 'image/png', 0.92),
    );

    if (!blob) {
      setError(t('invalidInput'));
      return;
    }

    const downloadUrl = URL.createObjectURL(blob);

    const anchor = document.createElement('a');

    anchor.href = downloadUrl;
    anchor.download = `${file.name.replace(/\.[^.]+$/, '')}-resized.${file.name.split('.').pop() || 'png'}`;
    anchor.click();
    URL.revokeObjectURL(downloadUrl);
  };

  const inputParts = input.split(',');

  const setInputPart = (index: number, value: string) => {
    const next = [...inputParts];

    while (next.length <= index) next.push('');
    next[index] = value;
    setInput(next.join(','));
  };

  const numericFields = numericFieldLabels[slug];

  const showPrimaryInput = !noPrimaryInputTools.has(slug) && !imageTools.has(slug);

  const isImageResizer = slug === 'image-resizer';

  const description =
    locale === 'pt-BR'
      ? `${toolLabel(slug, locale)} para ${toolCategoryLabel(definition?.category ?? 'tools', locale).toLocaleLowerCase()}.`
      : `${toolLabel(slug, locale)} utility for ${toolCategoryLabel(definition?.category ?? 'tools', locale).toLocaleLowerCase()}.`;

  let primaryInputType = 'text';
  if (slug === 'age-calculator' || slug === 'date-difference-calculator') {
    primaryInputType = 'date';
  } else if (slug === 'lorem-ipsum-generator') {
    primaryInputType = 'number';
  }

  const primaryInputMultiline = isMultiline(slug) && slug !== 'lorem-ipsum-generator';

  const numericInput = (
    <Box
      visualVariant="legacyToolWorkbench"
      children={numericFields?.map((label, index) => (
        <TextField
          key={label}
          fullWidth
          label={label}
          value={inputParts[index] ?? ''}
          onChange={(event) => setInputPart(index, event.target.value)}
          type={label === 'expression' || label === 'values' ? 'text' : 'number'}
        />
      ))}
    />
  );

  const primaryInput = (
    <TextField
      fullWidth
      multiline={primaryInputMultiline}
      minRows={primaryInputMultiline ? 8 : undefined}
      type={primaryInputType}
      label={t('input')}
      value={input}
      onChange={(event) => setInput(event.target.value)}
    />
  );

  const inputFields: ReactNode = [
    <ConditionalContent
      key="numeric-input"
      condition={Boolean(numericFields)}
      content={numericInput}
    />,
    <ConditionalContent
      key="primary-input"
      condition={!numericFields && showPrimaryInput}
      content={primaryInput}
    />,
  ];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void run();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;

    setFile(nextFile);
    readResizerImage(nextFile);
  };

  const handleWidthChange = (event: ChangeEvent<HTMLInputElement>) => {
    const width = event.target.value;

    setResizerDimensions((current) => ({
      ...current,
      width,
      height:
        keepRatio && current.naturalWidth > 0 && width
          ? String(
              Math.max(
                1,
                Math.round((Number(width) * current.naturalHeight) / current.naturalWidth),
              ),
            )
          : current.height,
    }));
  };

  const handleHeightChange = (event: ChangeEvent<HTMLInputElement>) => {
    const height = event.target.value;

    setResizerDimensions((current) => ({
      ...current,
      height,
      width:
        keepRatio && current.naturalHeight > 0 && height
          ? String(
              Math.max(
                1,
                Math.round((Number(height) * current.naturalWidth) / current.naturalHeight),
              ),
            )
          : current.width,
    }));
  };

  return (
    <>
      <PageHeader
        eyebrow={`${toolCategoryLabel(definition?.category ?? 'tools', locale)} · ${t('eyebrow')}`}
        title={toolLabel(slug, locale)}
        description={description}
        breadcrumbs={[{ label: tNav('tools'), href: '/tools' }]}
      />
      <Paper component="form" onSubmit={handleSubmit} visualVariant="legacyToolWorkbench">
        {inputFields}
        <ConditionalContent
          condition={imageTools.has(slug)}
          content={
            <Button
              component="label"
              variant="outlined"
              children={
                <>
                  {file ? file.name : t('selectFile')}
                  <HiddenInput
                    type="file"
                    accept={slug === 'svg-to-png' ? 'image/svg+xml' : 'image/*'}
                    onChange={handleFileChange}
                  />
                </>
              }
            />
          }
        />
        <ConditionalContent
          condition={isImageResizer}
          content={
            <Box
              visualVariant="legacyToolWorkbench2"
              children={
                <>
                  <TextField
                    label={t('width')}
                    type="number"
                    slotProps={{ htmlInput: { min: 1 } }}
                    value={resizerDimensions.width}
                    onChange={handleWidthChange}
                  />
                  <TextField
                    label={t('height')}
                    type="number"
                    slotProps={{ htmlInput: { min: 1 } }}
                    value={resizerDimensions.height}
                    onChange={handleHeightChange}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={keepRatio}
                        onChange={(event) => setKeepRatio(event.target.checked)}
                      />
                    }
                    label={t('keepRatio')}
                  />
                  <Button
                    type="button"
                    variant="contained"
                    disabled={!file || !resizerDimensions.width || !resizerDimensions.height}
                    onClick={() => void downloadResizedImage()}
                    children={t('download')}
                  />
                </>
              }
            />
          }
        />
        <ConditionalContent
          condition={[
            'text-repeater',
            'find-and-replace',
            'regex-tester',
            'vigenere-cipher',
            'random-number-generator',
            'date-difference-calculator',
          ].includes(slug)}
          content={
            <TextField
              label={t('secondaryInput')}
              value={second}
              onChange={(event) => setSecond(event.target.value)}
            />
          }
        />
        <ConditionalContent
          condition={['find-and-replace', 'date-difference-calculator'].includes(slug)}
          content={
            <TextField
              label={t('tertiaryInput')}
              value={third}
              onChange={(event) => setThird(event.target.value)}
            />
          }
        />
        <ConditionalContent
          condition={[
            'base64-encoder',
            'binary-text-codec',
            'hex-text-codec',
            'html-entity-codec',
            'url-encoder',
          ].includes(slug)}
          content={
            <OptionSelect
              value={mode}
              onChange={(event) => setMode(event.target.value)}
              aria-label={t('mode')}
              options={[
                { value: 'encode', label: t('encode') },
                { value: 'decode', label: t('decode') },
              ]}
            />
          }
        />
        <LegacyRunButton label={t('run')} />
        <ConditionalContent
          condition={Boolean(error)}
          content={<Typography color="error">{error}</Typography>}
        />
        <ConditionalContent
          condition={Boolean(result)}
          content={
            <Box
              component="section"
              aria-live="polite"
              children={
                <>
                  <TextField
                    fullWidth
                    multiline
                    minRows={5}
                    label={t('output')}
                    value={result}
                    slotProps={{ input: { readOnly: true } }}
                  />
                  <Stack
                    direction="row"
                    justifyContent="flex-end"
                    visualVariant="legacyToolWorkbench"
                    children={
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={() => void copy()}
                        children={copied ? t('copied') : t('copy')}
                      />
                    }
                  />
                </>
              }
            />
          }
        />
      </Paper>
    </>
  );
}
