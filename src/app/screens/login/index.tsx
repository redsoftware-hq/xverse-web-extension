import Eye from '@assets/img/createPassword/Eye.svg';
import EyeSlash from '@assets/img/createPassword/EyeSlash.svg';
import logo from '@assets/img/orange_pill.png';
import ActionButton from '@components/button';
import useWalletReducer from '@hooks/useWalletReducer';
import { animated, useSpring } from '@react-spring/web';
import MigrationConfirmation from '@screens/migrationConfirmation';
import { addMinutes } from 'date-fns';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// declare const VERSION: string;

const Logo = styled.img({
  width: 250,
  height: 250,
});

const ScreenContainer = styled(animated.div)((props) => ({
  display: 'flex',
  flexDirection: 'column',
  background: props.theme.colors.background.orangePillBg,
  flex: 1,
  paddingLeft: 18,
  paddingRight: 18,
}));

const ContentContainer = styled(animated.div)({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
});

// const AppVersion = styled.div((props) => ({
//   ...props.theme.body_xs,
//   color: props.theme.colors.action.classic,
//   height: 30,
//   borderRadius: props.theme.radius(4),
//   border: `1px solid ${props.theme.colors.action.classic}`,
//   backgroundColor: props.theme.colors.background.lightOrange,
//   width: 58,
//   textAlign: 'center',
//   lineHeight: '30px',
// }));

const TopSectionContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: props.theme.spacing(15),
  marginBottom: props.theme.spacing(7.5),
}));

const PasswordInputLabel = styled.h2((props) => ({
  ...props.theme.mont_tile_text,
  fontSize: 24,
  color: props.theme.colors.action.classic,
  textAlign: 'left',
  marginTop: props.theme.spacing(15.5),
}));

const PasswordInputContainer = styled.div((props) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  border: `1px solid ${props.theme.colors.background.elevation3}`,
  borderRadius: props.theme.radius(2),
  paddingLeft: props.theme.spacing(8),
  paddingRight: props.theme.spacing(8),
  marginTop: props.theme.spacing(2),
  marginBottom: props.theme.spacing(3),
  ':hover': {
    border: `1px solid ${props.theme.colors.action.classic}`,
  },
  ':focus': {
    border: `1px solid ${props.theme.colors.action.classic}`,
  },
}));

const PasswordInput = styled.input((props) => ({
  ...props.theme.body_medium_m,
  height: 48,
  backgroundColor: props.theme.colors.background.elevation0,
  color: props.theme.colors.white['0'],
  caretColor: props.theme.colors.action.classic,
  width: '100%',
  border: 'none',
  fontSize: 18,
}));

// const LandingTitle = styled.h1((props) => ({
//   ...props.theme.tile_text,
//   paddingTop: props.theme.spacing(15),
//   paddingLeft: props.theme.spacing(34),
//   paddingRight: props.theme.spacing(34),
//   color: props.theme.colors.white['200'],
//   textAlign: 'center',
// }));

const ButtonContainer = styled.div((props) => ({
  marginTop: props.theme.spacing(8),
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'end',
  flex: 1,
  paddingBottom: props.theme.spacing(20),
}));

const ErrorMessage = styled.h2((props) => ({
  ...props.theme.body_medium_m,
  textAlign: 'left',
  color: props.theme.colors.feedback.error,
  marginTop: props.theme.spacing(4),
}));

const ForgotPasswordButton = styled.a((props) => ({
  ...props.theme.body_m,
  fontFamily: 'MontRegular',
  textAlign: 'center',
  marginTop: props.theme.spacing(6),
  color: props.theme.colors.white['0'],
  textDecoration: 'underline',
}));

const ViewPasswordButton = styled.button(() => ({
  background: 'none',
}));

function Login(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'LOGIN_SCREEN' });
  const navigate = useNavigate();
  const { unlockWallet } = useWalletReducer();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showMigration, setShowMigration] = useState(false);
  const styles = useSpring({
    from: {
      opacity: 0,
      y: 24,
    },
    to: {
      y: 0,
      opacity: 1,
    },
    delay: 100,
  });

  const handleMigrateCache = async () => {
    try {
      await unlockWallet(password);
      setIsVerifying(false);
      const skipTime = new Date().getTime();
      const migrationReminder = addMinutes(skipTime, 10).getTime();
      localStorage.setItem('migrationReminder', migrationReminder.toString());
      navigate(-1);
    } catch (err) {
      setIsVerifying(false);
      setShowMigration(false);
      setError(t('VERIFY_PASSWORD_ERROR'));
    }
  };

  const handleTogglePasswordView = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const handlePasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (error) {
      setError('');
    }
    setPassword(event.currentTarget.value);
  };

  const handleVerifyPassword = async () => {
    setIsVerifying(true);
    try {
      const hasMigrated = localStorage.getItem('migrated');
      const isReminderDue =
        Number(localStorage.getItem('migrationReminder') || 0) <= new Date().getTime();
      if (!hasMigrated && isReminderDue) {
        setShowMigration(true);
      } else {
        await unlockWallet(password);
        setIsVerifying(false);
        navigate(-1);
      }
    } catch (err) {
      setIsVerifying(false);
      setError(t('VERIFY_PASSWORD_ERROR'));
    }
  };

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleVerifyPassword();
      }
    };
    document.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [password]);

  const handleForgotPassword = () => {
    navigate('/forgotPassword');
  };

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {!showMigration ? (
        <ScreenContainer>
          {/* <AppVersion>Beta</AppVersion> */}
          <ContentContainer style={styles}>
            <TopSectionContainer>
              <Logo src={logo} />
              {/* <LandingTitle>{t('WELCOME_MESSAGE_FIRST_LOGIN')}</LandingTitle> */}
            </TopSectionContainer>
            <PasswordInputLabel>{t('PASSWORD_INPUT_LABEL')}</PasswordInputLabel>
            <PasswordInputContainer>
              <PasswordInput
                type={isPasswordVisible ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                placeholder={t('PASSWORD_INPUT_PLACEHOLDER')}
                autoFocus
              />
              <ViewPasswordButton type="button" onClick={handleTogglePasswordView}>
                <img src={isPasswordVisible ? Eye : EyeSlash} alt="show-password" height={24} />
              </ViewPasswordButton>
            </PasswordInputContainer>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <ForgotPasswordButton onClick={handleForgotPassword}>
              {t('FORGOT_PASSWORD_BUTTON')}
            </ForgotPasswordButton>
            <ButtonContainer>
              <ActionButton
                onPress={handleVerifyPassword}
                text={t('VERIFY_PASSWORD_BUTTON')}
                processing={isVerifying}
              />
            </ButtonContainer>
          </ContentContainer>
        </ScreenContainer>
      ) : (
        <MigrationConfirmation migrateCallback={handleMigrateCache} />
      )}
    </>
  );
}
export default Login;
