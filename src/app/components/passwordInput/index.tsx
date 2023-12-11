import Eye from '@assets/img/createPassword/Eye.svg';
import EyeSlash from '@assets/img/createPassword/EyeSlash.svg';
import PasswordIcon from '@assets/img/Graphic (1).png';
import ActionButton from '@components/button';
import { animated, useTransition } from '@react-spring/web';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';
import zxcvbn from 'zxcvbn';

interface PasswordInputProps {
  title: string;
  inputLabel: string;
  enteredPassword: string;
  setEnteredPassword: (enteredPassword: string) => void;
  handleContinue: () => void;
  handleBack: () => void;
  passwordError?: string;
  checkPasswordStrength?: boolean;
  stackButtonAlignment?: boolean;
  loading?: boolean;
  createPasswordFlow?: boolean;
  forUpdatePassword?: boolean;
}

interface StrengthBarProps {
  strengthColor: string;
  strengthWidth: string;
}

const Container = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  paddingLeft: props.theme.spacing(8),
  paddingRight: props.theme.spacing(8),
  marginBottom: props.theme.spacing(20),
}));

const HeaderText = styled.h1((props) => ({
  ...props.theme.mont_tile_text,
  color: props.theme.colors.action.classic,
  textAlign: 'left',
  fontSize: 24,
  marginTop: props.theme.spacing(15),
}));

const HeaderContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '120px',
});

interface PasswordInputContainerProps {
  hasError: boolean;
}

const PasswordInputContainer = styled.div<PasswordInputContainerProps>((props) => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  border: `1px solid ${
    props.hasError ? 'rgba(211, 60, 60, 0.3)' : props.theme.colors.background.elevation1
  }`,
  backgroundColor: props.theme.colors.background['elevation-1'],
  borderRadius: props.theme.radius(2),
  paddingLeft: props.theme.spacing(4),
  paddingRight: props.theme.spacing(4),
  marginTop: props.theme.spacing(8),
  marginBottom: props.theme.spacing(3),
  ':hover': {
    border: `1px solid ${props.theme.colors.action.classic}`,
  },
  ':focus': {
    border: `1px solid ${props.theme.colors.action.classic}`,
  },
}));

const PasswordInputLabel = styled.h2((props) => ({
  ...props.theme.body_medium_m,
  marginTop: props.theme.spacing(4),
  textAlign: 'left',
  fontSize: 18,
}));

const Input = styled.input((props) => ({
  ...props.theme.body_medium_m,
  height: 48,
  backgroundColor: props.theme.colors.background['elevation-1'],
  color: props.theme.colors.white['0'],
  caretColor: props.theme.colors.action.classic,
  width: '100%',
  border: 'none',
  paddingLeft: props.theme.spacing(6),
  paddingRight: props.theme.spacing(6),
  paddingTop: props.theme.spacing(4),
  paddingBottom: props.theme.spacing(4),
  fontSize: 18,
}));

interface ButtonContainerProps {
  stackButtonAlignment: boolean;
  ifError: boolean;
}
const Bottom = styled.div((props) => ({
  flex: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: props.theme.spacing(10),
  marginRight: props.theme.spacing(10),
  marginBottom: props.theme.spacing(20),
}));
const ButtonsContainer = styled.div<ButtonContainerProps>((props) => ({
  display: 'flex',
  flexDirection: props.stackButtonAlignment ? 'column-reverse' : 'row',
  alignItems: props.stackButtonAlignment ? 'center' : 'flex-end',
  flex: 1,
  marginTop: props.ifError ? 12 : props.theme.spacing(30),
  marginBottom: props.theme.spacing(8),
}));

const Button = styled.button((props) => ({
  background: 'none',
  display: 'flex',
  marginRight: props.theme.spacing(3),
}));

const ErrorMessage = styled.h2<{ forUpdatePassword?: boolean }>((props) => ({
  ...props.theme.body_xs,
  textAlign: 'left',
  color: props.theme.colors.feedback.error,
}));

const PasswordStrengthContainer = styled.div((props) => ({
  ...props.theme.body_medium_m,
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  marginTop: props.theme.spacing(8),
  span: {
    opacity: 0.6,
  },
  p: {
    justifySelf: 'flex-end',
  },
}));

const StrengthBar = styled(animated.div)<StrengthBarProps>((props) => ({
  display: 'flex',
  flex: '1 0',
  alignItems: 'center',
  backgroundColor: props.theme.colors.white_600,
  marginLeft: props.theme.spacing(6),
  marginRight: props.theme.spacing(9),
  borderRadius: props.theme.radius(1),
  width: '50%',
  div: {
    width: props.strengthWidth,
    height: 4,
    backgroundColor: props.strengthColor,
    borderRadius: props.theme.radius(1),
  },
}));

const REQUIRED_PASSWORD_LENGTH = 5;

export enum PasswordStrength {
  NoScore,
  PoorScore,
  WeakScore,
  AverageScore,
  StrongScore,
  MeetsAllRequirements,
}

interface TransparentButtonContainerProps {
  stackButtonAlignment: boolean;
}
const ButtonContainer = styled.div<TransparentButtonContainerProps>((props) => ({
  marginLeft: props.stackButtonAlignment ? 0 : 3,
  marginRight: props.stackButtonAlignment ? 0 : 3,
  marginTop: props.theme.spacing(4),
  width: '100%',
}));

function PasswordInput(props: PasswordInputProps): JSX.Element {
  const {
    title,
    inputLabel,
    enteredPassword,
    passwordError,
    setEnteredPassword,
    handleContinue,
    handleBack,
    checkPasswordStrength,
    stackButtonAlignment = false,
    loading,
    createPasswordFlow,
    forUpdatePassword = false,
  } = props;

  const { t } = useTranslation('translation', { keyPrefix: 'CREATE_PASSWORD_SCREEN' });
  const theme = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>(
    PasswordStrength.NoScore,
  );
  const { score } = zxcvbn(enteredPassword);
  const enteredPasswordLength = enteredPassword.length;
  const [error, setError] = useState<string>(passwordError ?? '');
  const transition = useTransition(passwordStrength, {
    from: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
    },
  });

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (
        event.key === 'Enter' &&
        !!enteredPassword &&
        enteredPasswordLength >= REQUIRED_PASSWORD_LENGTH &&
        (checkPasswordStrength ? score >= PasswordStrength.AverageScore : true)
      ) {
        event.preventDefault();
        handleContinue();
      }
    };
    document.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [enteredPassword]);

  useEffect(() => {
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (enteredPassword && !!createPasswordFlow && score <= PasswordStrength.WeakScore) {
      setError(t('PASSWORD_STRENGTH_ERROR'));
      return;
    }
    setError('');
  }, [passwordError, enteredPassword]);

  useEffect(() => {
    if (enteredPassword !== '') {
      setPasswordStrength(score);
    }

    return () => {
      setPasswordStrength(PasswordStrength.NoScore);
    };
  }, [enteredPassword, setPasswordStrength]);

  const handleTogglePasswordView = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handlePasswordChange = (event: React.FormEvent<HTMLInputElement>) => {
    setEnteredPassword(event.currentTarget.value);
  };

  const renderStrengthBar = () => {
    if (enteredPassword !== '') {
      if (
        enteredPasswordLength <= REQUIRED_PASSWORD_LENGTH ||
        score <= PasswordStrength.WeakScore
      ) {
        return (
          <PasswordStrengthContainer>
            <span>{t('PASSWORD_STRENGTH_LABEL')}</span>
            <StrengthBar strengthColor={theme.colors.feedback.error} strengthWidth="20%">
              {transition((style) => (
                <animated.div style={style} />
              ))}
            </StrengthBar>
            <p style={{ color: theme.colors.feedback.error }}>{t('PASSWORD_STRENGTH_WEAK')}</p>
          </PasswordStrengthContainer>
        );
      }

      if (score <= PasswordStrength.AverageScore) {
        return (
          <PasswordStrengthContainer>
            <span>{t('PASSWORD_STRENGTH_LABEL')}</span>
            {transition((style) => (
              <StrengthBar strengthColor={theme.colors.feedback.caution} strengthWidth="50%">
                <animated.div style={style} />
              </StrengthBar>
            ))}
            <p>{t('PASSWORD_STRENGTH_MEDIUM')}</p>
          </PasswordStrengthContainer>
        );
      }

      return (
        <PasswordStrengthContainer>
          <span>{t('PASSWORD_STRENGTH_LABEL')}</span>
          {transition((style) => (
            <StrengthBar strengthColor={theme.colors.feedback.success} strengthWidth="100%">
              <animated.div style={style} />
            </StrengthBar>
          ))}
          <p>{t('PASSWORD_STRENGTH_STRONG')}</p>
        </PasswordStrengthContainer>
      );
    }
    return (
      <PasswordStrengthContainer>
        <span>{t('PASSWORD_STRENGTH_LABEL')}</span>
        <StrengthBar strengthColor={theme.colors.white[0]} strengthWidth="0">
          {transition((style) => (
            <animated.div style={style} />
          ))}
        </StrengthBar>
      </PasswordStrengthContainer>
    );
  };

  return (
    <>
      <Container>
        <HeaderContainer>
          <img src={PasswordIcon} alt="password" />
        </HeaderContainer>
        {!forUpdatePassword && <HeaderText>{title}</HeaderText>}
        <PasswordInputLabel>{inputLabel}</PasswordInputLabel>
        <PasswordInputContainer
          hasError={
            !!error ||
            (!!createPasswordFlow &&
              enteredPassword !== '' &&
              enteredPasswordLength <= REQUIRED_PASSWORD_LENGTH)
          }
        >
          <Input
            type={isPasswordVisible ? 'text' : 'password'}
            value={enteredPassword}
            autoFocus
            onChange={handlePasswordChange}
          />
          <Button onClick={handleTogglePasswordView}>
            <img src={isPasswordVisible ? Eye : EyeSlash} alt="show-password" height={24} />
          </Button>
        </PasswordInputContainer>
        {error && <ErrorMessage forUpdatePassword={forUpdatePassword}>{error}</ErrorMessage>}
        {/* <ButtonsContainer stackButtonAlignment={stackButtonAlignment} ifError={error !== ''}>
        <ActionButton
          processing={loading}
          disabled={
            !enteredPassword || (!!checkPasswordStrength && score <= PasswordStrength.WeakScore)
          }
          text={t('CONTINUE_BUTTON')}
          onPress={handleContinue}
        />
      </ButtonsContainer> */}
      </Container>
      <Bottom>
        <ActionButton
          processing={loading}
          disabled={
            !enteredPassword || (!!checkPasswordStrength && score <= PasswordStrength.WeakScore)
          }
          text={t('CONTINUE_BUTTON')}
          onPress={handleContinue}
        />
      </Bottom>
    </>
  );
}

export default PasswordInput;
