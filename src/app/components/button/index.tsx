import { MoonLoader } from 'react-spinners';
import styled from 'styled-components';

interface ButtonProps {
  disabled?: boolean;
  warning?: boolean;
}

const Button = styled.button<ButtonProps>((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: props.theme.radius(2),
  backgroundColor: props.warning ? props.theme.colors.feedback.error : props.theme.colors.action.classic,
  width: '100%',
  height: 44,
  transition: 'all 0.1s ease',
  ':disabled': {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  ':hover:enabled': {
    opacity: 0.8,
  },
  ':active:enabled': {
    opacity: 0.6,
  },
}));

const TransparentButton = styled(Button)`
  background: transparent;
  border: 1px solid;
  border-color: ${(props)=>props.theme.colors.background.elevationZero};
`;

const AnimatedTransparentButton = styled(TransparentButton)`
:hover {
  background: radial-gradient(85.58% 229.24% at 89.79% 22.85%, rgba(56, 60, 78, 0.2) 0%, rgba(13, 14, 18, 0.2) 100%),
              linear-gradient(154.76deg, rgba(168, 185, 244, 0.12) 15.61%, rgba(168, 185, 244, 0.06) 62.02%);
}
`;

interface TextProps {
  warning?: boolean;
}

const ButtonText = styled.h1<TextProps>((props) => ({
  ...props.theme.body_l,
  fontWeight: 700,
  fontSize: 16,
  color: `${props.warning ?  props.theme.colors.background.elevationZero :  props.theme.colors.white[0]}`,
  textAlign: 'center',
}));

const AnimatedButtonText = styled.div((props) => ({
  ...props.theme.body_l,
  fontWeight: 700,
  fontSize: 16,
  color: props.theme.colors.white[0],
  textAlign: 'center',
}));

const ButtonImage = styled.img((props) => ({
  marginRight: props.theme.spacing(3),
  alignSelf: 'center',
  transform: 'all',
}));

const ButtonIconContainer = styled.div((props) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: props.theme.spacing(3),
}));

interface Props {
  className?: string;
  src?: string;
  icon?: JSX.Element;
  text: string;
  onPress: () => void;
  processing?: boolean;
  disabled?: boolean;
  transparent?: boolean;
  warning?: boolean;
  hoverDialogId?: string;
}

function ActionButton({
  className,
  src,
  icon,
  text,
  onPress,
  processing = false,
  disabled = false,
  transparent,
  warning,
  hoverDialogId,
}: Props) {
  const handleOnPress = () => {
    if (!disabled) {
      onPress();
    }
  };

  if (transparent) {
    return (
      <TransparentButton
        id={hoverDialogId}
        className={className}
        onClick={handleOnPress}
        disabled={disabled || processing}
      >
        {processing ? (
          <MoonLoader color="white" size={10} />
        ) : (
          <>
            {src && <ButtonImage src={src} />}
            {icon && <ButtonIconContainer>{icon}</ButtonIconContainer>}
            <AnimatedButtonText>{text}</AnimatedButtonText>
          </>
        )}
      </TransparentButton>
    );
  }

  return (
    <Button
      className={className}
      onClick={handleOnPress}
      disabled={disabled || processing}
      warning={warning}
    >
      {processing ? (
        <MoonLoader color="#12151E" size={12} />
      ) : (
        <>
          {src && <ButtonImage src={src} />}
          {icon && <ButtonIconContainer>{icon}</ButtonIconContainer>}
          <ButtonText warning={warning}>{text}</ButtonText>
        </>
      )}
    </Button>
  );
}
export default ActionButton;
