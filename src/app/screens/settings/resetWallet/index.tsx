import styled from 'styled-components';
import TopRow from '@components/topRow';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Paragraph from '@components/paragraph';
import PasswordInput from '@components/passwordInput';
import useWalletReducer from '@hooks/useWalletReducer';
import { useState } from 'react';
import BackButton from '@components/backButton';
import ActionButton from '@components/button';

const ResetWalletContainer = styled.div((props) => ({
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  position: 'fixed',
  zIndex: 10,
  background: 'rgba(25, 25, 48, 0.5)',
  backdropFilter: 'blur(10px)',
  paddingLeft: 16,
  paddingRight: 16,
  paddingTop: props.theme.spacing(16),
}));

const ButtonContainer = styled.div((props) => ({
  marginLeft: props.theme.spacing(8),
  marginRight: props.theme.spacing(8),
  marginBottom: props.theme.spacing(16),
  marginTop: props.theme.spacing(72),
}));

function ResetWalletScreen() {
  const { t } = useTranslation('translation', { keyPrefix: 'SETTING_SCREEN' });
  const { unlockWallet, resetWallet } = useWalletReducer();
  const [showResetWalletDisplay, setShowResetWalletDisplay] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const openResetWalletScreen = () => {
    setShowResetWalletDisplay(true);
  };

  const goToSettingScreen = () => {
    setShowResetWalletDisplay(false);
  };

  const handleResetWallet = () => {
    resetWallet();
    navigate('/');
  };

  const handlePasswordNextClick = async () => {
    try {
      setLoading(true);
      await unlockWallet(password);
      setPassword('');
      setError('');
      handleResetWallet();
    } catch (e) {
      setError(t('INCORRECT_PASSWORD_ERROR'));
    } finally {
      setLoading(false);
    }
  };
  const handleBackButtonClick = () => {
    navigate('/settings');
  };

  return (
    <>
      {showResetWalletDisplay && (
        <ResetWalletContainer>
          <BackButton handleClick={() => setShowResetWalletDisplay(false)} />
          <PasswordInput
            title={t('ENTER_PASSWORD')}
            inputLabel={t('PASSWORD')}
            enteredPassword={password}
            setEnteredPassword={setPassword}
            handleContinue={handlePasswordNextClick}
            handleBack={goToSettingScreen}
            passwordError={error}
            stackButtonAlignment
            loading={loading}
          />
        </ResetWalletContainer>
      )}
      <TopRow title={t('RESET_WALLET')} onClick={handleBackButtonClick} />
      <Paragraph content={t('RESET_WALLET_CONTENT')} />
       <ButtonContainer>
        <ActionButton
          text={t('RESET_WALLET')}
          onPress={openResetWalletScreen}
        />
      </ButtonContainer>
    </>
  );
}

export default ResetWalletScreen;
