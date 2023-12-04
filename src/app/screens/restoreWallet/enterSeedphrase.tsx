import ActionButton from '@components/button';
import SeedPhraseInput from '@components/seedPhraseInput';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
});

const Title = styled.h1((props) => ({
  ...props.theme.bold_tile_text,
  color: props.theme.colors.white[200],
  marginTop: props.theme.spacing(8),
  marginBottom: props.theme.spacing(16),
  textAlign: 'left',
}));

const ButtonContainer = styled.div((props) => ({
  width: '100%',
  marginTop: 'auto',
  marginBottom: props.theme.spacing(16),
}));

interface Props {
  isPasted?: boolean;
  seed: string[];
  setSeed: (seed: string[]) => void;
  onContinue: () => void;
  seedError: string;
  setSeedError: (err: string) => void;
  pasteFromClipboard?: () => void;
}
const Paste = styled.button<{ position: 'mid' | 'bottom'; disabled?: boolean; seedError: any }>(
  (props) => ({
    ...props.theme.body_medium_m,
    color: props.theme.colors.action.classic,
    borderRadius: props.theme.radius(4),
    backgroundColor: props.theme.colors.background.lightOrange,
    height: 30,
    width: 150,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: props.position === 'mid' ? (props.seedError ? '72%' : '70%') : '80%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    img: {
      marginRight: props.theme.spacing(4),
    },
    ':hover': {
      backgroundColor: !props.disabled
        ? props.theme.colors.action.classic
        : props.theme.colors.background.lightOrange,
      border: `1px solid ${
        !props.disabled ? props.theme.colors.action.classic : props.theme.colors.action.classic
      }`,
      color: !props.disabled ? props.theme.colors.white[0] : props.theme.colors.action.classic,
    },
    ':focus': {
      backgroundColor: !props.disabled
        ? props.theme.colors.action.classic
        : props.theme.colors.background.lightOrange,
      border: `1px solid ${
        !props.disabled ? props.theme.colors.action.classic : props.theme.colors.action.classic
      }`,
      color: !props.disabled ? props.theme.colors.white[0] : props.theme.colors.action.classic,
    },
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  }),
);
const Pasted = styled.button<{ position: 'mid' | 'bottom'; disabled?: boolean; seedError: any }>(
  (props) => ({
    ...props.theme.body_medium_m,
    color: '#42BF23',
    borderRadius: props.theme.radius(4),
    backgroundColor: 'rgba(66, 191, 35, 0.20)',
    height: 30,
    width: 150,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: props.position === 'mid' ? (props.seedError ? '72%' : '70%') : '80%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    img: {
      marginRight: props.theme.spacing(4),
    },
  }),
);
function EnterSeedPhrase(props: Props): JSX.Element {
  const { onContinue, seed, setSeed, seedError, setSeedError, pasteFromClipboard, isPasted } =
    props;

  const { t } = useTranslation('translation', { keyPrefix: 'RESTORE_WALLET_SCREEN' });

  return (
    <Container>
      <Title>{t('ENTER_SEED_HEADER')}</Title>
      <SeedPhraseInput
        seed={seed}
        onSeedChange={setSeed}
        seedError={seedError}
        setSeedError={setSeedError}
      />
      {isPasted ? (
        <Pasted position="mid" disabled seedError={seedError}>
          Pasted
        </Pasted>
      ) : (
        <Paste position="mid" onClick={pasteFromClipboard} seedError={seedError}>
          {t('PASTE')}
        </Paste>
      )}

      <ButtonContainer>
        <ActionButton
          onPress={onContinue}
          disabled={seed.map((e) => e.trim()).join(' ') === ''}
          text={t('CONTINUE_BUTTON')}
        />
      </ButtonContainer>
    </Container>
  );
}

export default EnterSeedPhrase;
