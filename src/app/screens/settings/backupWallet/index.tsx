import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '@components/passwordInput';
import TopRow from '@components/topRow';
import BottomBar from '@components/tabBar';
import useWalletReducer from '@hooks/useWalletReducer';
import SeedCheck from '@screens/backupWalletSteps/seedCheck';
import useWalletSelector from '@hooks/useWalletSelector';
import styled from 'styled-components';
import BackButton from '@components/backButton';

const Container = styled.div<{ showSeed: boolean }>((props) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  overflowY: 'auto',
  marginTop: props.showSeed ? props.theme.spacing(4) : props.theme.spacing(20),
  paddingLeft: props.theme.spacing(8),
  paddingRight: props.theme.spacing(8),
  marginBottom: props.theme.spacing(20),
}));

function BackupWalletScreen() {
  const { t } = useTranslation('translation');
  const { seedPhrase } = useWalletSelector();
  const [password, setPassword] = useState<string>('');
  const [copy, setCopy] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showSeed, setShowSeed] = useState<boolean>(false);
  const navigate = useNavigate();
  const { unlockWallet } = useWalletReducer();

  const goToSettingScreen = () => {
    navigate('/settings');
  };

  const handlePasswordNextClick = async () => {
    try {
      setLoading(true);
      await unlockWallet(password);
      setPassword('');
      setError('');
      setShowSeed(true);
    } catch (e) {
      setError(t('CREATE_PASSWORD_SCREEN.INCORRECT_PASSWORD_ERROR'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopRow title={t('SETTING_SCREEN.BACKUP_WALLET_UNLOCK_SEED')} onClick={goToSettingScreen} />
      <Container showSeed={showSeed}>
        {!showSeed && (
          <PasswordInput
            title=""
            forUpdatePassword
            inputLabel={t('SETTING_SCREEN.PASSWORD')}
            enteredPassword={password}
            setEnteredPassword={setPassword}
            handleContinue={handlePasswordNextClick}
            handleBack={goToSettingScreen}
            passwordError={error}
            stackButtonAlignment
            loading={loading}
          />
        )}
        {showSeed && (
          <SeedCheck
            fromSetting
            showButton={false}
            seedPhrase={seedPhrase}
            onContinue={goToSettingScreen}
            copy={copy}
            setCopy={setCopy}
          />
        )}
      </Container>
    </>
  );
}

export default BackupWalletScreen;
