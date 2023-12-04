import Check from '@assets/img/settings/success_check.svg';
import Close from '@assets/img/settings/x.svg';
import PasswordInput from '@components/passwordInput';
import TopRow from '@components/topRow';
import useSeedVault from '@hooks/useSeedVault';
import { duration } from 'moment';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PasswordContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  marginTop: props.theme.spacing(20),
}));

const ToastContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: props.theme.colors.success_gradient,
  border: props.theme.colors.toast.successBorder,
  borderRadius: props.theme.radius(3),
  height: 60,
  padding: '12px 20px 12px 16px',
  margin: '0px 16px 16px 16px',
  width: 306,
  flex: 1,
}));

const ToastMessage = styled.h1((props) => ({
  ...props.theme.body_medium_xl,
  color: props.theme.colors.success_pill,
}));

const ToastDismissButton = styled.button(() => ({
  background: 'transparent',
}));
const Backdrop = styled.div((props) => ({
  display: 'flex',
  alignItems: 'flex-end',
  background: 'transparent',
  backdropFilter: props.theme.backdrop.hover,
  height: '100vh',
  width: '100vw',
  margin: '-15px -20px',
}));
const Top = styled.div((props) => ({
  marginTop: props.theme.spacing(10),
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  marginBottom: 8,
}));
const Layout = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));
function ChangePasswordScreen() {
  const { t } = useTranslation('translation');
  const { unlockVault, changePassword } = useSeedVault();
  const [password, setPassword] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate('/settings');
  };

  const dismissToast = () => {
    toast.dismiss();
  };

  const handleConfirmCurrentPasswordNextClick = async () => {
    try {
      setLoading(true);
      await unlockVault(oldPassword);
      setPassword('');
      setError('');
      setCurrentStepIndex(1);
    } catch (e) {
      setError(t('CREATE_PASSWORD_SCREEN.INCORRECT_PASSWORD_ERROR'));
    } finally {
      setLoading(false);
    }
  };

  const ToastContent = (
    <Backdrop>
      <ToastContainer>
        <img src={Check} alt="Check" />
        <ToastMessage>{t('SETTING_SCREEN.UPDATE_PASSWORD_SUCCESS')}</ToastMessage>
        <ToastDismissButton onClick={dismissToast}>
          <img src={Close} alt="X" />
        </ToastDismissButton>
      </ToastContainer>
    </Backdrop>
  );

  const handleEnterNewPasswordNextClick = () => {
    setCurrentStepIndex(2);
  };

  const handleConfirmNewPasswordNextClick = async () => {
    if (confirmPassword === password) {
      setError('');
      await changePassword(oldPassword, confirmPassword);
      toast.custom(ToastContent);
      navigate('/settings');
    } else {
      setError(t('CREATE_PASSWORD_SCREEN.CONFIRM_PASSWORD_MATCH_ERROR'));
    }
  };

  const handleConfirmNewPasswordBackClick = () => {
    setCurrentStepIndex(1);
  };

  return (
    <Layout>
      <Top>
        <TopRow
          forUpdatePassword
          title={t('SETTING_SCREEN.UPDATE_PASSWORD')}
          onClick={handleBackButtonClick}
        />
      </Top>
      <PasswordContainer>
        {currentStepIndex === 0 && (
          <PasswordInput
            title=""
            forUpdatePassword
            inputLabel={t('CREATE_PASSWORD_SCREEN.TEXT_INPUT_ENTER_PASSWORD_LABEL')}
            enteredPassword={oldPassword}
            setEnteredPassword={setOldPassword}
            handleContinue={handleConfirmCurrentPasswordNextClick}
            handleBack={handleBackButtonClick}
            passwordError={error}
            stackButtonAlignment
            loading={loading}
          />
        )}
        {currentStepIndex === 1 && (
          <PasswordInput
            title=""
            forUpdatePassword
            inputLabel={t('CREATE_PASSWORD_SCREEN.TEXT_INPUT_NEW_PASSWORD_LABEL')}
            enteredPassword={password}
            setEnteredPassword={setPassword}
            handleContinue={handleEnterNewPasswordNextClick}
            handleBack={handleBackButtonClick}
            checkPasswordStrength
            stackButtonAlignment
            createPasswordFlow
          />
        )}
        {currentStepIndex === 2 && (
          <PasswordInput
            forUpdatePassword
            title={t('CREATE_PASSWORD_SCREEN.CONFIRM_PASSWORD_TITLE')}
            inputLabel={t('CREATE_PASSWORD_SCREEN.TEXT_INPUT_CONFIRM_PASSWORD_LABEL')}
            enteredPassword={confirmPassword}
            setEnteredPassword={setConfirmPassword}
            handleContinue={handleConfirmNewPasswordNextClick}
            handleBack={handleConfirmNewPasswordBackClick}
            passwordError={error}
            stackButtonAlignment
          />
        )}
      </PasswordContainer>
    </Layout>
  );
}

export default ChangePasswordScreen;
