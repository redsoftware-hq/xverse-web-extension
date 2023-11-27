import useWalletSelector from '@hooks/useWalletSelector';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const RouteContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: 360,
  margin: 'auto',
  background: props.theme.colors.background.orangePillBg,
  border: '1px solid rgba(168, 185, 244, 0.10)',
  boxShadow: '0px 8px 28px rgba(0, 0, 0, 0.35)',
}));

const TestnetContainer = styled.div((props) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderTopLeftRadius: props.theme.radius(1),
  borderTopRightRadius: props.theme.radius(1),
  borderBottom: 0,
  background: props.theme.colors.action.classic,
  paddingTop: props.theme.spacing(3),
  paddingBottom: props.theme.spacing(3),
}));

const TestnetText = styled.h1((props) => ({
  ...props.theme.body_xs,
  textAlign: 'center',
  color: props.theme.colors.white_0,
}));

function ScreenContainer(): JSX.Element {
  const { network } = useWalletSelector();
  const { t } = useTranslation('translation');

  // We need to set the max height of the app container after the layout is rendered
  // to prevent the app from being too tall on smaller screens
  // If we set it directly in the css, it will lock the popup to a tiny height before it has a chance to render
  useEffect(() => {
    const container = document.getElementById('app');
    container!.style.maxHeight = '100vh';
  }, []);

  return (
    <RouteContainer className="optionsContainer">
      {network.type === 'Testnet' && (
        <TestnetContainer>
          <TestnetText>{t('SETTING_SCREEN.TESTNET')}</TestnetText>
        </TestnetContainer>
      )}
      <Outlet />
    </RouteContainer>
  );
}

export default ScreenContainer;
