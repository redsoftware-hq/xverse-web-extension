import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import NftTab from '@assets/img/bottomTabBar/Selected_nft.svg';
import SettingsTab from '@assets/img/bottomTabBar/setting_tab.svg';
import StackingTab from '@assets/img/bottomTabBar/Selected_stake.svg';
import WalletTab from '@assets/img/bottomTabBar/Selected_wallet.svg';
import UnselectedNftTab from '@assets/img/bottomTabBar/NFT.svg';
import UnselectedSettingsTab from '@assets/img/bottomTabBar/unselected_setting_tab.svg';
import UnselectedStackingTab from '@assets/img/bottomTabBar/Stake.svg';
import UnselectedWalletTab from '@assets/img/bottomTabBar/Wallet.svg';

const Container = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  height: 64,
  background: props.theme.colors.background.darkbg,
  justifyContent: 'space-between',
  paddingLeft: props.theme.spacing(10),
  paddingBottom: props.theme.spacing(15),
  paddingRight: props.theme.spacing(10),
}));
const RowContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  height: 64,
  background: `linear-gradient(rgba(0, 0, 0, 0.9))`,
  justifyContent: 'space-between',
  paddingLeft: props.theme.spacing(20),
  borderRadius: props.theme.radius(2),
  paddingRight: props.theme.spacing(20),
  border: `1px solid #A8B9F433`,
  ":hover": {
    background: 'linear-gradient(90deg, #A8B9F4 20%, #FFFFFF 90%);'
  }
}));

const Button = styled.button({
  backgroundColor: 'transparent',
});

type Tab = 'dashboard' | 'nft' | 'stacking' | 'settings';

interface Props {
  tab: Tab
}
function BottomTabBar({ tab }:Props) {
  const navigate = useNavigate();

  const handleDashboardButtonClick = () => {
    if (tab !== 'dashboard') { navigate('/'); }
  };

  const handleNftButtonClick = () => {
    if (tab !== 'nft') { navigate('/nft-dashboard'); }
  };

  const handleStackingButtonClick = () => {
    if (tab !== 'stacking') { navigate('/stacking'); }
  };

  const handleSettingButtonClick = () => {
    if (tab !== 'settings') { navigate('/settings'); }
  };

  return (
    <Container>
    <RowContainer>
      <Button onClick={handleDashboardButtonClick}>
        <img src={tab === 'dashboard' ? WalletTab : UnselectedWalletTab} alt="dashboard" />
      </Button>
      <Button onClick={handleStackingButtonClick}>
        <img src={tab === 'stacking' ? StackingTab : UnselectedStackingTab} alt="stacking" />
      </Button>
      <Button onClick={handleNftButtonClick}>
        <img src={tab === 'nft' ? NftTab : UnselectedNftTab} alt="nft" />
      </Button>
      <Button onClick={handleSettingButtonClick}>
        <img src={tab === 'settings' ? SettingsTab : UnselectedSettingsTab} alt="settings" />
      </Button>
    </RowContainer>
    </Container>
  );
}

export default BottomTabBar;
