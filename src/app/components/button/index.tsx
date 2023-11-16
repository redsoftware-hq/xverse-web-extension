/* eslint-disable no-nested-ternary */
import styled from 'styled-components';
import { MoonLoader } from 'react-spinners';
import styled from 'styled-components';

interface ButtonProps {
  disabled?: boolean;
  warning?: boolean;
  inDashboard?: boolean;
}

const Button = styled.button<ButtonProps>((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: props.theme.radius(3),
  backgroundColor: props.warning
    ? props.theme.colors.feedback.error
    : props.theme.colors.action.classic,
  width: '100%',
  height: 56,
  opacity: props.disabled ? 0.6 : 1,
  transition: 'all 0.2s ease',
}));

const AnimatedButton = styled(Button)`
  :hover {
    background: ${(props) =>
      props.warning
        ? props.theme.colors.feedback.error
        : props.disabled
        ? props.theme.colors.action.classic
        : props.theme.colors.action.classicLight};
    opacity: ${(props) => (props.disabled ? 0.6 : 1)};
  }
`;

const TransparentButton = styled(Button)`
  background: transparent;
  border: 1px solid;
  border-color: ${(props) => props.theme.colors.background.elevation6_800};
`;

const AnimatedTransparentButton = styled(TransparentButton)`
  :hover {
    background: radial-gradient(
        85.58% 229.24% at 89.79% 22.85%,
        rgba(56, 60, 78, 0.2) 0%,
        rgba(13, 14, 18, 0.2) 100%
      ),
      linear-gradient(154.76deg, rgba(168, 185, 244, 0.12) 15.61%, rgba(168, 185, 244, 0.06) 62.02%);
  }
`;

interface TextProps {
  warning?: boolean;
}

const ButtonText = styled.span<TextProps>((props) => ({
  ...props.theme.bold_tile_text,
  color: `${props.theme.colors.white[0]}`,
  textAlign: 'center',
}));

const AnimatedButtonText = styled.div((props) => ({
  ...props.theme.bold_tile_text,
  color: props.theme.colors.white[0],
  textAlign: 'center',
}));

const ButtonImage = styled.img((props) => ({
  marginRight: props.theme.spacing(3),
  alignSelf: 'center',
  transform: 'all',
}));

const AnimatedDashboardButtonText = styled.h1((props) => ({
  ...props.theme.bold_tile_text,
  fontFamily: 'MontRegular',
  fontSize: 14,
  color: props.theme.colors.white[0],
  textAlign: 'center',
}));

const AnimatedDashboardButton = styled.button((props) => ({
  background: props.theme.colors.background.modalBackdrop,
  display: 'inline-flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  paddingLeft: props.theme.spacing(8),
  paddingRight: props.theme.spacing(8),
  paddingBottom: props.theme.spacing(4),
  paddingTop: props.theme.spacing(4),
  borderRadius: props.theme.radius(2),
  transition: 'all 0.2s ease',
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
  inDashboard?: boolean;
  style?: any;
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
  inDashboard,
  style = undefined,
}: Props) {
  const handleOnPress = () => {
    if (!disabled) {
      onPress();
    }
  };

  if (inDashboard) {
    return (
      <AnimatedDashboardButton
        onClick={handleOnPress}
        disabled={disabled}
        style={!style ? {} : style}
      >
        {processing ? (
          <MoonLoader color="white" size={10} />
        ) : (
          <>
            {src && <ButtonImage src={src} />}
            <AnimatedDashboardButtonText>{text}</AnimatedDashboardButtonText>
          </>
        )}
      </AnimatedDashboardButton>
    );
  }

  if (transparent) {
    return (
      <AnimatedTransparentButton
        onClick={handleOnPress}
        disabled={disabled}
        style={!style ? {} : style}
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
    <AnimatedButton
      onClick={handleOnPress}
      disabled={disabled}
      warning={warning}
      style={!style ? {} : style}
    >
      {processing ? (
        <MoonLoader color="#12151E" size={12} />
      ) : (
        <>
          {src && <ButtonImage src={src} />}
          <ButtonText warning={warning}>{text}</ButtonText>
        </>
      )}
    </Button>
  );
}
export default ActionButton;
