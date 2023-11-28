import InfoIcon from '@assets/img/info.svg';
import WarningIcon from '@assets/img/Warning.svg';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface ContainerProps {
  type: 'Info' | 'Warning' | undefined;
  showWarningBackground?: boolean;
}
const Container = styled.div<ContainerProps>((props) => ({
  display: 'flex',
  flexDirection: 'row',
  borderRadius: 12,
  alignItems: 'flex-start',
  backgroundColor: props.showWarningBackground ? 'rgba(211, 60, 60, 0.15)' : 'transparent',
  padding: props.theme.spacing(8),
  marginBottom: props.theme.spacing(6),
}));

const TextContainer = styled.div((props) => ({
  marginLeft: props.theme.spacing(5),
  display: 'flex',
  flexDirection: 'column',
}));

const BoldText = styled.h1((props) => ({
  ...props.theme.body_bold_m,
  color: props.theme.colors.white_0,
}));

const RedirectText = styled.h1((props) => ({
  ...props.theme.body_medium_m,
  color: props.theme.colors.white_0,
}));

const SubText = styled.h1((props) => ({
  ...props.theme.body_xs,
  marginTop: props.theme.spacing(2),
  color: props.theme.colors.white_200,
}));

const Text = styled.h1((props) => ({
  ...props.theme.body_m,
  color: props.theme.colors.secondaryText,
  lineHeight: 1.4,
}));
const WarningText = styled.span((props) => ({
  ...props.theme.body_m,
  color: props.theme.colors.action.classic,
  lineHeight: 1.4,
  marginRight: props.theme.spacing(4),
}));
const RedirectButton = styled.button((props) => ({
  backgroundColor: 'transparent',
  color: props.theme.colors.white_0,
  display: 'flex',
  marginTop: 4,
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
}));

interface Props {
  titleText?: string;
  bodyText: string;
  type?: 'Info' | 'Warning';
  onClick?: () => void;
  redirectText?: string;
  showWarningBackground?: boolean;
  showWarningText?: boolean;
}

function InfoContainer({
  titleText,
  bodyText,
  type,
  redirectText,
  onClick,
  showWarningText,
  showWarningBackground,
}: Props) {
  const { t } = useTranslation();
  return showWarningText ? (
    <Container type={type}>
      <Text>
        <WarningText>{t('COMMON.WARNING')}</WarningText>
        {bodyText}
      </Text>
    </Container>
  ) : (
    <Container type={type} showWarningBackground={showWarningBackground}>
      <img src={type === 'Warning' ? WarningIcon : InfoIcon} alt="alert" />

      <TextContainer>
        {titleText ? (
          <>
            <BoldText>{titleText}</BoldText>
            <SubText>{bodyText}</SubText>
          </>
        ) : (
          <>
            <Text>{bodyText}</Text>
            {redirectText && (
              <RedirectButton onClick={onClick}>
                <RedirectText>{`${redirectText} →`}</RedirectText>
              </RedirectButton>
            )}
          </>
        )}
      </TextContainer>
    </Container>
  );
}

export default InfoContainer;
