/* eslint-disable @typescript-eslint/no-unused-expressions */
import ActionButton from '@components/button';
import SeedPhraseInput from '@components/seedPhraseInput';
import { generateMnemonic } from 'bip39';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Container = styled.div((props) => ({
  display: 'flex',
  paddingTop: props.theme.spacing(21),
  flexDirection: 'column',
  flex: 1,
}));

const Heading = styled.p((props) => ({
  ...props.theme.mont_tile_text,
  fontSize: 24,
  color: props.theme.colors.action.classic,
  textAlign: 'left',
  marginBottom: props.theme.spacing(4),
}));

const Description = styled.p((props) => ({
  ...props.theme.bold_tile_text,
  color: props.theme.colors.white[0],
  marginBottom: props.theme.spacing(15),
}));

const ButtonsContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  flex: 1,
  alignItems: 'flex-end',
  marginBottom: props.theme.spacing(20),
  width: '100%',
}));

const TransparentButtonContainer = styled.div((props) => ({
  marginRight: props.theme.spacing(2),
  width: '100%',
}));

const ButtonContainer = styled.div((props) => ({
  marginLeft: props.theme.spacing(2),
  width: '100%',
}));

const PasteSeedButton = styled.button<{ position: 'mid' | 'bottom'; disabled?: boolean }>(
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
    top: props.position === 'mid' ? '71%' : '80%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    img: {
      marginRight: props.theme.spacing(4),
    },
    ':hover': {
      backgroundColor: props.theme.colors.action.classic,
      border: `1px solid ${props.theme.colors.action.classic}`,
      color: props.theme.colors.white[0],
    },
    ':focus': {
      backgroundColor: props.theme.colors.action.classic,
      border: `1px solid ${props.theme.colors.action.classic}`,
      color: props.theme.colors.white[0],
    },
  }),
);
const Pasted = styled.button<{ position: 'mid' | 'bottom'; disabled?: boolean }>((props) => ({
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
  top: props.position === 'mid' ? '71%' : '80%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  img: {
    marginRight: props.theme.spacing(4),
  },
}));
interface VerifySeedProps {
  onVerifySuccess: () => void;
  seedPhrase: string;
  copy: boolean;
  onBack?: () => void;
}

function textToMapValues(inputText: string, arrayLength: number): string[] {
  // Step 1: Split the input text into individual words
  const words: string[] = inputText.split(' ');

  // Step 2: Create a list of size `arrayLength`
  const resultArray: string[] = new Array(arrayLength).fill('');

  // Step 3: Fill the resultArray with words from the input text
  for (let i = 0; i < words.length && i < arrayLength; i + 1) {
    resultArray[i] = words[i];
  }

  return resultArray;
}

export default function VerifySeed(props: VerifySeedProps): JSX.Element {
  const [seedInput, setSeedInput] = useState<string[]>(new Array(12).fill(''));
  const [isPasted, setIsPasted] = useState(false);
  const [err, setErr] = useState('');
  const { t } = useTranslation('translation', { keyPrefix: 'BACKUP_WALLET_SCREEN' });
  const { onBack, onVerifySuccess, seedPhrase, copy } = props;

  const cleanMnemonic = (rawSeed: string): string =>
    rawSeed.replace(/\s\s+/g, ' ').replace(/\n/g, ' ').trim();

  const handleVerify = () => {
    if (seedPhrase === seedInput.map((e) => e.trim()).join(' ')) {
      onVerifySuccess();
    } else {
      setErr('Seedphrase does not match');
    }
    setErr(t('SEED_PHRASE_INCORRECT'));
  };

  const handlePaste = async () => {
    setSeedInput(seedPhrase.split(' '));
    setIsPasted(true);
    setTimeout(() => {
      setIsPasted(false);
    }, 3000);
  };

  return (
    <Container>
      <Heading>{t('SEED_INPUT_LABEL')}</Heading>
      <Description>{t('SEED_PHRASE_VERIFY_HEADING')}</Description>
      <SeedPhraseInput
        seed={seedInput}
        onSeedChange={setSeedInput}
        seedError={err}
        setSeedError={setErr}
      />
      {copy &&
        (isPasted ? (
          <Pasted position="mid" disabled>
            Pasted
          </Pasted>
        ) : (
          <PasteSeedButton position="mid" onClick={handlePaste}>
            Paste Seedphrase
          </PasteSeedButton>
        ))}
      <ButtonsContainer>
        <ButtonContainer>
          <ActionButton
            text={t('SEED_PHRASE_VIEW_CONTINUE')}
            onPress={handleVerify}
            disabled={seedInput.map((e) => e.trim()).join(' ') === ''}
          />
        </ButtonContainer>
      </ButtonsContainer>
    </Container>
  );
}
