import LinkIcon from '@assets/img/links_icon.svg';
// import Seperator from '@components/seperator';
import { PRIVACY_POLICY_LINK, TERMS_LINK } from '@utils/constants';
import { saveIsTermsAccepted } from '@utils/localStorage';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div((props) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: props.theme.spacing(10),
  paddingRight: props.theme.spacing(10),
  paddingTop: props.theme.spacing(10),
}));

const Title = styled.h1((props) => ({
  ...props.theme.mont_tile_text,
  color: props.theme.colors.action.classic,
  marginTop: props.theme.spacing(30),
}));

const SubTitle = styled.h1((props) => ({
  ...props.theme.bold_tile_text,
  color: props.theme.colors.white['0'],
  marginTop: props.theme.spacing(4),
}));

const SpanHighlight = styled.span((props) => ({
  ...props.theme.body_bold_l,
  fontSize: 16,
  color: props.theme.colors.action.classic,
}));

const ActionButton = styled.a((props) => ({
  ...props.theme.bold_tile_text,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: props.theme.spacing(8),
  color: props.theme.colors.white['0'],
  padding: props.theme.spacing(6),
  paddingLeft: props.theme.spacing(12),
  borderRadius: props.theme.radius(3),
  border: `0.5px solid ${props.theme.colors.background.elevation2}`,
  height: 56,
  backgroundColor: props.theme.colors.background.elevationZero,
  ':hover': {
    background: props.theme.colors.background.elevation6_800,
  },
  ':focus': {
    background: props.theme.colors.action.classic800,
  },
}));


const ActionButtonsContainer = styled.div((props) => ({
  marginTop: props.theme.spacing(16),
}));

const AcceptButton = styled.button((props) => ({
  ...props.theme.bold_tile_text,
  display: 'flex',
  color: props.theme.colors.white[0],
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 'auto',
  marginBottom: props.theme.spacing(20),
  backgroundColor: props.theme.colors.action.classic,
  borderRadius: props.theme.radius(3),
  height: 56,
  width: '100%',
  ':hover': {
    background: props.theme.colors.action.classicLight,
  },
  ':focus': {
    background: props.theme.colors.action.classicLight,
    opacity: 0.6,
  },
}));

function LegalLinks() {
  const { t } = useTranslation('translation', { keyPrefix: 'LEGAL_SCREEN' });
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleLegalAccept = () => {
    saveIsTermsAccepted(true);
    const isRestore = !!searchParams.get('restore');
    if (isRestore) {
      navigate('/restoreWallet', { replace: true });
    } else {
      navigate('/backup', { replace: true });
    }
  };
  return (
    <Container>
      <Title>{t('SCREEN_TITLE')}</Title>
      <SubTitle>
        Please review the<SpanHighlight> Orange Pill </SpanHighlight>Privacy Policy and our Terms of
        Service.
      </SubTitle>
      <ActionButtonsContainer>
        <ActionButton href={TERMS_LINK} target="_blank">
          {t('TERMS_SERVICES_LINK_BUTTON')}
          <img src={LinkIcon} alt="terms" />
        </ActionButton>
        {/* <Seperator /> */}
        <ActionButton href={PRIVACY_POLICY_LINK} target="_blank">
          {t('PRIVACY_POLICY_LINK_BUTTON')}
          <img src={LinkIcon} alt="privacy" />
        </ActionButton>
      </ActionButtonsContainer>
      <AcceptButton onClick={handleLegalAccept}>{t('ACCEPT_LEGAL_BUTTON')}</AcceptButton>
    </Container>
  );
}

export default LegalLinks;
