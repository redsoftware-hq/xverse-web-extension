import Switch from 'react-switch';
import styled, { useTheme } from 'styled-components';

interface ButtonProps {
  border: string;
}
interface TitleProps {
  textColor: string;
}

const CustomSwitch = styled(Switch)`
  .react-switch-handle {
    background-color: ${({ checked }) =>
      checked ? '#E12828  ' : 'rgba(210, 52, 3, 0.20)'} !important;
    border: ${({ checked }) => (checked ? '' : '1px solid #D23403')} !important;
    border-radius: 15px;
  }
  .react-switch-bg {
    background-color: rgba(210, 52, 3, 0.2);
  }
`;

const Button = styled.button<ButtonProps>((props) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  background: 'transparent',
  justifyContent: 'flex-start',
  marginTop: props.theme.spacing(6),
  paddingBottom: props.theme.spacing(8),
  borderBottom: props.border,
}));

const ColumnContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: props.theme.spacing(8),
  paddingRight: props.theme.spacing(8),
}));

const TitleText = styled.h1((props) => ({
  ...props.theme.body_bold_l,
  fontSize: 18,
  paddingBottom: props.theme.spacing(6),
  paddingTop: props.theme.spacing(16),
}));

const ComponentText = styled.h1<TitleProps>((props) => ({
  ...props.theme.body_m,
  paddingTop: props.theme.spacing(8),
  color: props.textColor,
  flex: 1,
  textAlign: 'left',
}));

const ComponentDescriptionText = styled.h1((props) => ({
  ...props.theme.body_bold_m,
  paddingTop: props.theme.spacing(8),
  color: props.theme.colors.white_0,
}));

const DescriptionText = styled.p((props) => ({
  ...props.theme.body_m,
  marginTop: props.theme.spacing(2),
  color: props.theme.colors.white_400,
  textAlign: 'left',
  paddingRight: props.theme.spacing(8),
}));

const Column = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
}));

const DisabledOverlay = styled.div((props) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  backgroundColor: props.theme.colors.elevation0,
  opacity: 0.5,
}));

const Wrapper = styled.div({
  position: 'relative',
  display: 'inline-block', // This makes sure the wrapper size fits the content
});

interface SettingComponentProps {
  title?: string;
  text: string;
  textDetail?: string;
  onClick?: () => void;
  icon?: string;
  showDivider?: boolean;
  showWarningTitle?: boolean;
  toggle?: boolean;
  toggleValue?: boolean;
  toggleFunction?: () => void;
}

function SettingComponent({
  title,
  text,
  textDetail,
  onClick,
  icon,
  showDivider,
  showWarningTitle,
  toggle,
  toggleValue,
  description,
  disabled,
  toggleFunction,
}: SettingComponentProps) {
  const theme = useTheme();

  return (
    <ColumnContainer>
      {title && <TitleText>{title}</TitleText>}
      <Button
        onClick={onClick}
        border={showDivider ? '1px solid rgb(76,81,135,0.3)' : 'transparent'}
      >
        <ComponentText
          textColor={showWarningTitle ? theme.colors.feedback.error : theme.colors.white['200']}
        >
          {text}
        </ComponentText>
        {textDetail && <ComponentDescriptionText>{textDetail}</ComponentDescriptionText>}
        {icon && <img src={icon} alt="arrow icon" />}
        {toggle && toggleFunction && (
          <CustomSwitch
            onColor={theme.colors.background.sliderBg}
            offColor={theme.colors.background.sliderBg}
            onChange={toggleFunction}
            checked={toggleValue ?? false}
            uncheckedIcon={false}
            checkedIcon={false}
          />
        )}
      </Button>
    </ColumnContainer>
  );
}

export default SettingComponent;
