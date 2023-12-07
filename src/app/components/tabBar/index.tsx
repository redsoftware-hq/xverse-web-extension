import AssistantTab from '@assets/img/assistant/AI_filled.svg';
import UnselectedAssistantTab from '@assets/img/assistant/AI_white.svg';
import UnselectedNftTab from '@assets/img/bottomTabBar/NFT.svg';
import MarketTab from '@assets/img/bottomTabBar/Selected_market.svg';

import NftTab from '@assets/img/bottomTabBar/Selected_nft.svg';
import StackingTab from '@assets/img/bottomTabBar/Selected_stake.svg';
import WalletTab from '@assets/img/bottomTabBar/Selected_wallet.svg';
import SettingsTab from '@assets/img/bottomTabBar/setting_tab.svg';
import UnselectedStackingTab from '@assets/img/bottomTabBar/Stake.svg';
import UnselectedMarketTab from '@assets/img/bottomTabBar/unselected_market_tab.svg';
import UnselectedSettingsTab from '@assets/img/bottomTabBar/unselected_setting_tab.svg';
import UnselectedWalletTab from '@assets/img/bottomTabBar/Wallet.svg';
import StyledTooltip from '@components/styledTooltip';
import { ChartLineUp, Gear, SketchLogo, Wallet } from '@phosphor-icons/react';
import { animated, easings, useSpring } from '@react-spring/web';
import { useStepperContext } from '@stores/stepper';
import { isInOptions } from '@utils/helper';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  height: 76,
  background: props.theme.colors.background.darkbg,
  justifyContent: 'space-between',
  paddingLeft: props.theme.spacing(10),
  paddingBottom: props.theme.spacing(10),
  paddingRight: props.theme.spacing(10),
}));
const RowContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  height: 56,
  background: props.theme.colors.background.navigation,
  justifyContent: 'space-between',
  paddingLeft: props.theme.spacing(20),
  borderRadius: props.theme.radius(1),
  paddingRight: props.theme.spacing(20),
  border: `1px solid #A8B9F433`,
  ':hover': {
    background: 'rgba(255, 255, 255, 0.9)',
  },
}));

const Button = styled.button({
  backgroundColor: 'transparent',
  zIndex: 2,
});

export type Tab = 'dashboard' | 'nft' | 'market' | 'stacking' | 'assistant';

interface Props {
  tab: Tab;
}
function BottomTabBar({ tab }: Props) {
  const navigate = useNavigate();
  const { dispatchStep } = useStepperContext();
  const handleDashboardButtonClick = () => {
    if (tab !== 'dashboard') {
      navigate('/');
      dispatchStep({ type: 'HOME' });
    }
  };

  const handleNftButtonClick = () => {
    if (tab !== 'nft') {
      navigate('/nft-dashboard');
    }
  };

  const handleMarketButtonClick = () => {
    if (tab !== 'market') {
      navigate('/market');
    }
  };

  // const handleStackingButtonClick = () => {
  //   if (tab !== 'stacking') {
  //     navigate('/stacking');
  //   }

  const handleAssistant = () => {
    if (tab !== 'assistant') {
      navigate('/assistant');
    }
  };
  return (
    <Container>
      <RowContainer>
        <Button onClick={handleDashboardButtonClick}>
          <img
            id="dashboard"
            src={tab === 'dashboard' ? WalletTab : UnselectedWalletTab}
            alt="dashboard"
          />
          <StyledTooltip anchorSelect="dashboard" content="Wallet" place="bottom" noArrow />
        </Button>
        <Button onClick={handleMarketButtonClick}>
          <img id="market" src={tab === 'market' ? MarketTab : UnselectedMarketTab} alt="market" />
          <StyledTooltip anchorSelect="market" content="Market" place="bottom" noArrow />
        </Button>
        <Button onClick={handleNftButtonClick}>
          <img id="nft" src={tab === 'nft' ? NftTab : UnselectedNftTab} alt="nft" />
          <StyledTooltip anchorSelect="nft" content="NFTs" place="bottom" noArrow />
        </Button>
        <Button onClick={handleAssistant}>
          <img
            id="ai"
            src={tab === 'stacking' ? AssistantTab : UnselectedAssistantTab}
            alt="stacking"
          />
          <StyledTooltip anchorSelect="ai" content="Assistant" place="bottom" noArrow />
        </Button>
      </RowContainer>
    </Container>
  );
}

export default BottomTabBar;
