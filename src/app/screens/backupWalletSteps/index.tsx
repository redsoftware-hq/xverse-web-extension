import { useWalletExistsContext } from '@components/guards/onboarding';
import PasswordInput from '@components/passwordInput';
import Steps from '@components/steps';
import useSeedVault from '@hooks/useSeedVault';
import useWalletReducer from '@hooks/useWalletReducer';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SeedCheck from './seedCheck';
import VerifySeed from './verifySeed';

const Container = styled.div((props) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
}));

const SeedContainer = styled.div((props) => ({
  paddingTop: props.theme.spacing(10),
}));
const PasswordContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
}));
const StepperContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: props.theme.colors.background.orangePillBg,
  padding: `${props.theme.spacing(10)}px 20px 0 20px`,
}));
const Top = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
}));
const Layout = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));
export default function BackupWalletSteps(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'CREATE_PASSWORD_SCREEN' });
  const [currentActiveIndex, setCurrentActiveIndex] = useState<number>(0);
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copy, setCopy] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const navigate = useNavigate();
  const [seedPhrase, setSeedPhrase] = useState<string>('');
  const { getSeed, changePassword } = useSeedVault();
  const { createWallet } = useWalletReducer();
  const { disableWalletExistsGuard } = useWalletExistsContext();

  useEffect(() => {
    (async () => {
      try {
        const seed = await getSeed();
        setSeedPhrase(seed);
      } catch (e) {
        navigate('/backup');
      }
    })();
  }, []);

  const handleSeedCheckContinue = () => {
    setCurrentActiveIndex(1);
  };

  const handleVerifySeedBack = () => {
    setCurrentActiveIndex(0);
  };

  const handleVerifySeedSuccess = () => {
    setCurrentActiveIndex(2);
  };

  const handleNewPasswordBack = () => {
    setCurrentActiveIndex(1);
  };

  const handleConfirmPasswordBack = () => {
    setCurrentActiveIndex(2);
  };

  const handleNewPasswordContinue = () => {
    setCurrentActiveIndex(3);
  };

  const handleConfirmPasswordContinue = async () => {
    if (confirmPassword === password) {
      disableWalletExistsGuard?.();
      await createWallet(seedPhrase);
      await changePassword('', password);
      navigate('/wallet-success/create', { replace: true });
    } else {
      setError(t('CONFIRM_PASSWORD_MATCH_ERROR'));
    }
  };

  const backupSteps = [
    <SeedContainer key={0}>
      <SeedCheck
        seedPhrase={seedPhrase}
        onContinue={handleSeedCheckContinue}
        copy={copy}
        setCopy={setCopy}
        fromSetting={false}
      />
    </SeedContainer>,
    <VerifySeed
      key={1}
      onBack={handleVerifySeedBack}
      onVerifySuccess={handleVerifySeedSuccess}
      seedPhrase={seedPhrase}
      copy={copy}
    />,
    <PasswordContainer key={2}>
      <PasswordInput
        title={t('CREATE_PASSWORD_TITLE')}
        inputLabel={t('TEXT_INPUT_NEW_PASSWORD_LABEL')}
        enteredPassword={password}
        setEnteredPassword={setPassword}
        handleContinue={handleNewPasswordContinue}
        handleBack={handleNewPasswordBack}
        checkPasswordStrength
      />
    </PasswordContainer>,
    <PasswordContainer key={3}>
      <PasswordInput
        title={t('CONFIRM_PASSWORD_TITLE')}
        inputLabel={t('TEXT_INPUT_NEW_PASSWORD_LABEL')}
        enteredPassword={confirmPassword}
        setEnteredPassword={setConfirmPassword}
        handleContinue={handleConfirmPasswordContinue}
        handleBack={handleConfirmPasswordBack}
        passwordError={error}
      />
    </PasswordContainer>,
  ];

  return (
    <Layout>
      <Top>
        <StepperContainer>
          <Steps data={backupSteps} withLabel activeIndex={currentActiveIndex} />
        </StepperContainer>
      </Top>
      <Container>{backupSteps[currentActiveIndex]}</Container>
    </Layout>
  );
}
