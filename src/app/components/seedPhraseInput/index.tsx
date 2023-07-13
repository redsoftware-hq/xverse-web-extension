/* eslint-disable react/no-array-index-key */
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const InputContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

interface ContainerProps {
  error: boolean;
}

const SeedphraseInputContainer = styled.div((props) => ({
  display: 'flex',
  gap: props.theme.spacing(2),
  marginTop: props.theme.spacing(4),
}));

const SeedphraseInput = styled.input<ContainerProps>((props) => ({
  ...props.theme.body_medium_m,
  backgroundColor: props.theme.colors.background.elevation0,
  color: props.theme.colors.white['0'],
  width: '33%',
  resize: 'none',
  height: 35,
  padding: props.theme.spacing(4),
  border: props.error
    ? `1px solid ${props.theme.colors.feedback.error_700}`
    : `1px solid ${props.theme.colors.background.elevation1}`,
  outline: 'none',
  borderRadius: props.theme.radius(1),
  ':focus-within': {
    border: `1px solid ${props.theme.colors.action.classic}`,
  },
}));
const ErrorMessage = styled.h2((props) => ({
  ...props.theme.body_medium_m,
  textAlign: 'left',
  color: props.theme.colors.feedback.error,
  marginTop: props.theme.spacing(4),
}));

interface SeedPhraseInputProps {
  seed: string[];
  onSeedChange: (seed: string[]) => void;
  seedError: string;
  setSeedError: (err: string) => void;
}) {
  const { t } = useTranslation('translation', { keyPrefix: 'RESTORE_WALLET_SCREEN' });
  const { onSeedChange, seed, seedError, setSeedError } = props;

  const handleSeedChange = (event: React.FormEvent<HTMLInputElement>, ind: number) => {
    if (seedError) {
      setSeedError('');
    }
    onSeedChange([...seed.slice(0, ind), event.currentTarget.value, ...seed.slice(ind + 1)]);
  };

  return (
    <InputContainer>
      {[0, 3, 6, 9].map((i) => (
        <SeedphraseInputContainer key={i}>
          {[0, 1, 2].map((j) => (
            <SeedphraseInput
              error={seedError !== ''}
              key={i + j}
              value={seed[i + j]}
              name={`secretKey${i + j}`}
              onChange={(e) => handleSeedChange(e, i + j)}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
            />
          ))}
        </SeedphraseInputContainer>
      ))}
      {seedError ? <ErrorMessage>{seedError}</ErrorMessage> : null}
    </InputContainer>
  );
}
