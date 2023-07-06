import { Eye, EyeSlash } from '@phosphor-icons/react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Label = styled.label`
  ${(props) => props.theme.body_medium_m};
  display: block;
  margin-bottom: ${(props) => props.theme.spacing(4)}px;
`;



interface ContainerProps {
  error: boolean;
}

const SeedphraseInput = styled.textarea<ContainerProps>((props) => ({
  ...props.theme.body_medium_m,
  backgroundColor: props.theme.colors.background.elevation0,
  color: props.theme.colors.white['0'],
  width: '100%',
  resize: 'none',
  minHeight: 140,
  padding: props.theme.spacing(8),
  border: props.error ? `1px solid ${props.theme.colors.feedback.error_700}` : `1px solid ${props.theme.colors.background.elevation3}`,
  outline: 'none',
  borderRadius: props.theme.radius(1),
  ':focus-within': {
    border: `1px solid ${props.theme.colors.background.elevation6}`,
  },
}));
const ErrorMessage = styled.h2((props) => ({
  ...props.theme.body_medium_m,
  textAlign: 'left',
  color: props.theme.colors.feedback.error,
  marginTop: props.theme.spacing(4),
}));

interface SeedPhraseInputProps {
  seed: string;
  onSeedChange: (seed: string) => void;
  seedError: string;
  setSeedError: (err: string) => void;
}) {
  const { t } = useTranslation('translation', { keyPrefix: 'RESTORE_WALLET_SCREEN' });
  const [seedInputValues, setSeedInputValues] = useState([...seedInit]);
  const [show24Words, setShow24Words] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleKeyDownInput = (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
    // disable common special characters
    // eslint-disable-next-line no-useless-escape
    if (event.key.match(/^[!-\/:-@[-`{-~]$/)) {
      event.preventDefault();
    }
    // focus next input on space key
    if (event.key === ' ') {
      inputsRef.current[index + 1]?.focus();
      event.preventDefault();
    }
  };

  const handleChangeInput = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (seedError) {
      setSeedError('');
    }

    setSeedInputValues((prevSeed) => {
      prevSeed[index] = event.target.value;
      return [...prevSeed];
    });
  };

  useEffect(() => {
    const seedPhrase = seedInputValues
      .slice(0, !show24Words ? 12 : 24)
      .filter(Boolean)
      .join(' ');
    onSeedChange(seedPhrase);
  }, [seedInputValues, onSeedChange, show24Words]);

  const handleClickShow24Words = () => {
    setShow24Words((prev) => !prev);
    setSeedInputValues((prev) => prev.slice(0, 12).concat(seedInit.slice(0, 12)));
  };

  return (
    <InputContainer>
      <SeedphraseInput
        error={seedError !== ''}
        value={seed}
        name="secretKey"
        placeholder={t('SEED_INPUT_PLACEHOLDER')}
        onChange={handleSeedChange}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
      />
      {seedError ? <ErrorMessage>{seedError}</ErrorMessage> : null}
    </InputContainer>
  );
}
