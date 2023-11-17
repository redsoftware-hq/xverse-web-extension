import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '@components/passwordInput';
import TopRow from '@components/topRow';
import BottomBar from '@components/tabBar';
import SeedCheck from '@screens/backupWalletSteps/seedCheck';
import styled from 'styled-components';
import BackButton from '@components/backButton';

const Container = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  overflowY: 'auto',
}));
const PasswordContainer = styled.div((props) => ({
  marginTop: props.theme.spacing(8),
  paddingLeft: props.theme.spacing(8),
  paddingRight: props.theme.spacing(8),
  marginBottom: props.theme.spacing(20),
}));
const SeedphraseContainer = styled.div((props) => ({
  marginTop: props.theme.spacing(8),
  paddingLeft: props.theme.spacing(8),
  paddingRight: props.theme.spacing(8),
  marginBottom: props.theme.spacing(20),
}));

function BackupWalletScreen() {
  const { t } = useTranslation('translation');
  const [password, setPassword] = useState<string>('');
  const [copy, setCopy] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showSeed, setShowSeed] = useState<boolean>(false);
  const [seed, setSeed] = useState('');
  const navigate = useNavigate();
  const { getSeed, unlockVault } = useSeedVault();

  useEffect(() => {
    (async () => {
      const seedPhrase = await getSeed();
      setSeed(seedPhrase);
    })();

    return () => {
      setSeed('');
    };
  }, []);

  const goToSettingScreen = () => {
    navigate('/settings');
  };

  const handlePasswordNextClick = async () => {
    try {
      setLoading(true);
      await unlockVault(password);
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
      <Container>
        {!showSeed && (
          <PasswordContainer>

          <PasswordInput
            title=""
            inputLabel={t('SETTING_SCREEN.PASSWORD')}
            enteredPassword={password}
            setEnteredPassword={setPassword}
            handleContinue={handlePasswordNextClick}
            handleBack={goToSettingScreen}
            passwordError={error}
            stackButtonAlignment
            loading={loading}
          />
          </PasswordContainer>
        )}
        {showSeed && (
          <SeedphraseContainer>
            <SeedCheck
              showButton={false}
              seedPhrase={seedPhrase}
              onContinue={goToSettingScreen}
              copy={copy}
              setCopy={setCopy}
            />
          </SeedphraseContainer>
        )}
      </Container>
    </>
  );
}

export default BackupWalletScreen;
