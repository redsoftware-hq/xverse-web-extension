/* eslint-disable no-inline-styles/no-inline-styles */
import BackButton from '@components/backButton';
import ActionButton from '@components/button';
import CustomSwitchSlider from '@components/customSwitch';
import Paragraph from '@components/paragraph';
import PasswordInput from '@components/passwordInput';
import TopRow from '@components/topRow';
import useWalletReducer from '@hooks/useWalletReducer';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ResetWalletContainer = styled.div((props) => ({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: props.theme.colors.background.orangePillBg,
  backdropFilter: 'blur(10px)',
}));

const ButtonContainer = styled.div((props) => ({
  flex: 'none',
  marginLeft: props.theme.spacing(10),
  marginRight: props.theme.spacing(10),
  marginBottom: props.theme.spacing(20),
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
  justifyContent: 'space-between',
  height: '100%',
}));
const SliderContainer = styled.div((props) => ({
  ...props.theme.body_medium_m,
  color: props.theme.colors.white_0,
  display: 'flex',
  alignItems: 'center',
  label: {
    marginLeft: props.theme.spacing(5),
  },
  '> input, > label': {
    cursor: 'pointer',
  },
  marginBottom: props.theme.spacing(5),
}));
function ResetWalletScreen() {
  const { t } = useTranslation('translation', { keyPrefix: 'SETTING_SCREEN' });
  const { unlockWallet, resetWallet } = useWalletReducer();
  const [showResetWalletDisplay, setShowResetWalletDisplay] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [hasBackedUp, setHasBackedUp] = useState(false);
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
  const handleToggleBackUp = () => {
    setHasBackedUp(!hasBackedUp);
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
    <Layout>
      {showResetWalletDisplay ? (
        <ResetWalletContainer>
          <Top>
            <BackButton
              style={{ width: '65px', marginLeft: 16 }}
              handleClick={() => setShowResetWalletDisplay(false)}
            />
          </Top>
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
      ) : (
        <Layout>
          <Top>
            <TopRow title={t('RESET_WALLET')} onClick={handleBackButtonClick} />
            <Paragraph content={t('RESET_WALLET_CONTENT')} />
          </Top>
          <ButtonContainer>
            <SliderContainer>
              <CustomSwitchSlider
                id="backup"
                toggleFunction={handleToggleBackUp}
                toggleValue={hasBackedUp}
              />
              <label htmlFor="backup">{t('BACKUP_CHECKBOX_LABEL')}</label>
            </SliderContainer>
            <ActionButton
              disabled={!hasBackedUp}
              text={t('RESET_WALLET')}
              style={{ textTransform: 'uppercase' }}
              onPress={openResetWalletScreen}
            />
          </ButtonContainer>
        </Layout>
      )}
    </Layout>
  );
}

export default ResetWalletScreen;
