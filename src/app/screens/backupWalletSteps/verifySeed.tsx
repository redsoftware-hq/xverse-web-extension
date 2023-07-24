import ActionButton from '@components/button';
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

const Heading = styled.h3((props) => ({
  ...props.theme.body_l,
  color: props.theme.colors.white_200,
  marginBottom: props.theme.spacing(16),
}));

const WordGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${(props) => props.theme.spacing(5)}px;
  margin-bottom: ${(props) => props.theme.spacing(12)}px;
`;

const WordButton = styled.button`
  ${(props) => props.theme.body_medium_m};
  color: ${(props) => props.theme.colors.white_0};
  background-color: ${(props) => props.theme.colors.elevation3};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${(props) => props.theme.spacing(6)}px;
  border-radius: ${(props) => props.theme.radius(1)}px;
  transition: all 0.1s ease;
  :hover:enabled {
    opacity: 0.8;
  }
  :active:enabled {
    opacity: 0.6;
  }
`;

const NthSpan = styled.span`
  ${(props) => props.theme.body_bold_l};
  color: ${(props) => props.theme.colors.white_0};
`;

const ErrorMessage = styled.p<{ visible: boolean }>`
  ${(props) => props.theme.body_s};
  color: ${(props) => props.theme.colors.feedback.error};
  visibility: ${(props) => (props.visible ? 'initial' : 'hidden')};
`;

const getOrdinal = (num: number): string => {
  switch (num) {
    case 1:
      return '1st';
    case 2:
      return '2nd';
    case 3:
      return '3rd';
    default:
      return `${num}th`;
  }
};

export default function VerifySeed({
  onBack,
  onVerifySuccess,
  seedPhrase,
}: {
  onBack: () => void;
  onVerifySuccess: () => void;
  seedPhrase: string;
}

export default function VerifySeed(props: VerifySeedProps): JSX.Element {
  const [seedInput, setSeedInput] = useState<string[]>(new Array(12).fill(''));
  const [err, setErr] = useState('');
  const { t } = useTranslation('translation', { keyPrefix: 'BACKUP_WALLET_SCREEN' });
  const { onBack, onVerifySuccess, seedPhrase } = props;

  const cleanMnemonic = (rawSeed: string): string => rawSeed.replace(/\s\s+/g, ' ').replace(/\n/g, ' ').trim();

  const handleVerify = () => {
    if (seedPhrase === seedInput.map(e => e.trim()).join(' ')) {
      onVerifySuccess();
    } else {
      setErr('Seedphrase does not match');
    }
    setErr(t('SEED_PHRASE_INCORRECT'));
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
