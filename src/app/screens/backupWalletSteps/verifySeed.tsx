import ActionButton from '@components/button';
import SeedPhraseInput from '@components/seedPhraseInput';
import { useState } from 'react';
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

interface VerifySeedProps {
  onVerifySuccess: () => void;
  onBack: () => void;
  seedPhrase: string;
}

export default function VerifySeed(props: VerifySeedProps): JSX.Element {
  const [seedInput, setSeedInput] = useState<string[]>(new Array(12).fill(''));
  const [err, setErr] = useState('');
  const { t } = useTranslation('translation', { keyPrefix: 'BACKUP_WALLET_SCREEN' });
  const { onBack, onVerifySuccess, seedPhrase } = props;

  const cleanMnemonic = (rawSeed: string): string => rawSeed.replace(/\s\s+/g, ' ').replace(/\n/g, ' ').trim();

  console.log(seedPhrase);

  const handleVerify = () => {
    if (seedPhrase === seedInput.map(e => e.trim()).join(' ')) {
      onVerifySuccess();
    } else {
      setErr('Seedphrase does not match');
    }
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
      <ButtonsContainer>
        <ButtonContainer>
          <ActionButton
            text={t('SEED_PHRASE_VIEW_CONTINUE')}
            onPress={handleVerify}
            disabled={seedInput.map(e => e.trim()).join(' ') === ''}
          />
        </ButtonContainer>
      </ButtonsContainer>
    </Container>
  );
}
