import LinkIcon from '@assets/img/links_icon.svg';
// import Seperator from '@components/seperator';
import { PRIVACY_POLICY_LINK, TERMS_LINK } from '@utils/constants';
import { saveIsTermsAccepted } from '@utils/localStorage';
import { optInMixPanel, optOutMixPanel } from '@utils/mixpanel';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';

const Container = styled.div((props) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: props.theme.spacing(8),
  paddingTop: props.theme.spacing(20),
  paddingBottom: props.theme.spacing(32),
  justifyContent: 'space-between',
}));

const Title = styled.h1((props) => ({
  ...props.theme.mont_tile_text,
  fontSize: 24,
  color: props.theme.colors.action.classic,
  marginTop: props.theme.spacing(20),
}));

const SubTitle = styled.h1((props) => ({
  ...props.theme.body_l,
  fontSize: 16,
  color: props.theme.colors.white['200'],
  marginTop: props.theme.spacing(8),
}));

const SpanHighlight = styled.span((props) => ({
  ...props.theme.body_bold_l,
  fontSize: 16,
  color: props.theme.colors.action.classic,
}));

const ActionButton = styled.a((props) => ({
  ...props.theme.body_m,
  fontSize: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: props.theme.spacing(8),
  color: props.theme.colors.white['0'],
  padding: props.theme.spacing(6),
  borderRadius: props.theme.radius(1),
}));

const CustomisedActionButton = styled(ActionButton)`
  background: radial-gradient(85.58% 229.24% at 89.79% 22.85%, rgba(56, 60, 78, 0.2) 0%, rgba(13, 14, 18, 0.2) 100%),
              linear-gradient(154.76deg, rgba(168, 185, 244, 0.12) 15.61%, rgba(168, 185, 244, 0.06) 62.02%);
  :hover {
    opacity: 0.8;
  }
  :active {
    opacity: 1;
  }
`;

const ActionButtonsContainer = styled.div((props) => ({
  marginTop: props.theme.spacing(20),
}));

const AcceptButton = styled.button((props) => ({
  ...props.theme.mont_tile_text,
  fontSize: 16,
  display: 'flex',
  color: props.theme.colors.white[0],
  alignItems: 'center',
  marginTop: props.theme.spacing(8),
  fontSize: '0.875rem',
}));

const DataCollectionDescription = styled.p((props) => ({
  ...props.theme.body_m,
  color: props.theme.colors.white_200,
  marginTop: props.theme.spacing(32),
}));

function LegalLinks() {
  const { t } = useTranslation('translation', { keyPrefix: 'LEGAL_SCREEN' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedAccount } = useWalletSelector();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const [isToggleEnabled, setIsToggleEnabled] = useState(true);

  const handleSwitchToggle = () => setIsToggleEnabled((prevEnabledState) => !prevEnabledState);

  const handleLegalAccept = () => {
    if (isToggleEnabled) {
      optInMixPanel(selectedAccount?.masterPubKey);
    } else {
      optOutMixPanel();
    }
    dispatch(changeShowDataCollectionAlertAction(false));
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
        <CustomisedActionButton href={TERMS_LINK} target="_blank">
          {t('TERMS_SERVICES_LINK_BUTTON')}
          <img src={LinkIcon} alt="terms" />
        </CustomisedActionButton>
        {/* <Seperator /> */}
        <CustomisedActionButton href={PRIVACY_POLICY_LINK} target="_blank">
          {t('PRIVACY_POLICY_LINK_BUTTON')}
          <img src={LinkIcon} alt="privacy" />
        </CustomisedActionButton>
      </ActionButtonsContainer>
      <AcceptButton onClick={handleLegalAccept}>{t('ACCEPT_LEGAL_BUTTON')}</AcceptButton>
    </Container>
  );
}

export default LegalLinks;
