import { useWalletExistsContext } from '@components/guards/onboarding';
import PasswordInput from '@components/passwordInput';
import Steps from '@components/steps';
import useWalletReducer from '@hooks/useWalletReducer';
import * as bip39 from 'bip39';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import EnterSeedPhrase from './enterSeedphrase';

const Container = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: 'auto',
  marginRight: 'auto',
  height: 600,
  width: 360,
  backgroundColor: props.theme.colors.background.elevation0,
  padding: `${props.theme.spacing(12)}px ${props.theme.spacing(8)}px 0 ${props.theme.spacing(8)}px`,
}));

const PasswordContainer = styled.div((props) => ({
  display: 'flex',
  height: '100%',
  marginBottom: props.theme.spacing(16),
}));
const Heading = styled.p((props) => ({
  ...props.theme.mont_tile_text,
  color: props.theme.colors.action.classic,
  fontSize: 24,
}));
const SeedPhraseContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  marginTop: props.theme.spacing(10),
}));

function RestoreWallet(): JSX.Element {
  const { t } = useTranslation('translation');
  const { restoreWallet } = useWalletReducer();
  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const [isPasted, setIsPasted] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [seedPhrase, setSeedPhrase] = useState<string[]>(new Array(12).fill(''));
  const [seedError, setSeedError] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { disableWalletExistsGuard } = useWalletExistsContext();

  const cleanMnemonic = (rawSeed: string): string =>
    rawSeed.replace(/\s\s+/g, ' ').replace(/\n/g, ' ').trim();

  const handleNewPasswordBack = () => {
    setCurrentStepIndex(0);
  };

  const handleConfirmPasswordBack = () => {
    setCurrentStepIndex(1);
  };

  function validateMnemonic(seed: string) {
    if (bip39.validateMnemonic(seed)) {
      return true;
    }
    return false;
  }

  const onSeedPhraseContinue = () => {
    const seed = seedPhrase.map((e) => e.trim()).join(' ');
    if (validateMnemonic(seed)) {
      setSeedError('');
      setCurrentStepIndex(1);
    } else {
      setSeedError(t('RESTORE_WALLET_SCREEN.SEED_INPUT_ERROR'));
    }
  };

  const handleContinuePasswordCreation = () => {
    setCurrentStepIndex(2);
  };

  const handleConfirmPassword = async () => {
    setIsRestoring(true);
    if (confirmPassword === password) {
      setError('');

      disableWalletExistsGuard?.();

      const seed = seedPhrase.map((e) => e.trim()).join(' ');
      await restoreWallet(seed, password);
      setIsRestoring(false);

      navigate('/wallet-success/restore', { replace: true });
    } else {
      setIsRestoring(false);
      setError(t('CREATE_PASSWORD_SCREEN.CONFIRM_PASSWORD_MATCH_ERROR'));
    }
  };
  const pasteFromClipboard = async () => {
    const fromClipboard = await navigator.clipboard.readText();
    const seedWords = fromClipboard.split(' ');
    setSeedPhrase(seedWords);
    setIsPasted(true);
    setTimeout(() => {
      setIsPasted(false);
    }, 3000);
  };
  const restoreSteps = [
    <SeedPhraseContainer key={0}>
      <Heading>SeedPhrase Verification</Heading>
      <EnterSeedPhrase
        isPasted={isPasted}
        seed={seedPhrase}
        setSeed={setSeedPhrase}
        onContinue={onSeedPhraseContinue}
        seedError={seedError}
        setSeedError={setSeedError}
        pasteFromClipboard={pasteFromClipboard}
      />
    </SeedPhraseContainer>,
    <PasswordContainer key={1}>
      <PasswordInput
        title={t('CREATE_PASSWORD_SCREEN.CREATE_PASSWORD_TITLE')}
        inputLabel={t('CREATE_PASSWORD_SCREEN.TEXT_INPUT_NEW_PASSWORD_LABEL')}
        enteredPassword={password}
        setEnteredPassword={setPassword}
        handleContinue={handleContinuePasswordCreation}
        handleBack={handleNewPasswordBack}
        checkPasswordStrength
        createPasswordFlow
      />
    </PasswordContainer>,
    <PasswordContainer key={2}>
      <PasswordInput
        title={t('CREATE_PASSWORD_SCREEN.CONFIRM_PASSWORD_TITLE')}
        inputLabel={t('CREATE_PASSWORD_SCREEN.TEXT_INPUT_CONFIRM_PASSWORD_LABEL')}
        enteredPassword={confirmPassword}
        setEnteredPassword={setConfirmPassword}
        handleContinue={handleConfirmPassword}
        handleBack={handleConfirmPasswordBack}
        passwordError={error}
        loading={isRestoring}
      />
    </PasswordContainer>,
  ];
  return (
    <Container>
      <Steps data={restoreSteps} withLabel activeIndex={currentStepIndex} />
      {restoreSteps[currentStepIndex]}
    </Container>
  );
}

export default RestoreWallet;
