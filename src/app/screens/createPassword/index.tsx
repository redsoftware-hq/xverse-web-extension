import { useWalletExistsContext } from '@components/guards/onboarding';
import PasswordInput from '@components/passwordInput';
import Steps from '@components/steps';
import useSeedVault from '@hooks/useSeedVault';
import useWalletReducer from '@hooks/useWalletReducer';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface StepDotProps {
  active: boolean;
}
const Container = styled.div((props) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
}));

const StepsContainer = styled.div((props) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: props.theme.spacing(10),
  justifyContent: 'center',
}));

const PasswordContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
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
const StepperContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: props.theme.colors.background.orangePillBg,
  padding: `${props.theme.spacing(10)}px 20px 0 20px`,
}));
function CreatePassword(): JSX.Element {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const navigate = useNavigate();
  const { t } = useTranslation('translation', { keyPrefix: 'CREATE_PASSWORD_SCREEN' });
  const { createWallet } = useWalletReducer();
  const { disableWalletExistsGuard } = useWalletExistsContext();
  const { getSeed, changePassword } = useSeedVault();

  const handleContinuePasswordCreation = () => {
    setCurrentStepIndex(1);
  };

  const handleConfirmPassword = async () => {
    if (confirmPassword === password) {
      disableWalletExistsGuard?.();
      const seedPhrase = await getSeed();
      await createWallet(seedPhrase);
      await changePassword('', password);
      navigate('/wallet-success/create', { replace: true });
    } else {
      setError(t('CONFIRM_PASSWORD_MATCH_ERROR'));
    }
  };

  const handleNewPasswordBack = () => {
    navigate('/backup');
  };

  const handleConfirmPasswordBack = () => {
    setCurrentStepIndex(0);
  };

  return (
    <Layout>
      <Top>
        <StepperContainer>
          <Steps data={[0, 1]} withLabel activeIndex={currentStepIndex} />
        </StepperContainer>
      </Top>
      <Container>
        <PasswordContainer>
          {currentStepIndex === 0 ? (
            <PasswordInput
              title={t('CREATE_PASSWORD_TITLE')}
              inputLabel={t('TEXT_INPUT_NEW_PASSWORD_LABEL')}
              enteredPassword={password}
              setEnteredPassword={setPassword}
              handleContinue={handleContinuePasswordCreation}
              handleBack={handleNewPasswordBack}
              checkPasswordStrength
              createPasswordFlow
            />
          ) : (
            <PasswordInput
              title={t('CONFIRM_PASSWORD_TITLE')}
              inputLabel={t('TEXT_INPUT_CONFIRM_PASSWORD_LABEL')}
              enteredPassword={confirmPassword}
              setEnteredPassword={setConfirmPassword}
              handleContinue={handleConfirmPassword}
              handleBack={handleConfirmPasswordBack}
              passwordError={error}
            />
          )}
        </PasswordContainer>
      </Container>
    </Layout>
  );
}

export default CreatePassword;
