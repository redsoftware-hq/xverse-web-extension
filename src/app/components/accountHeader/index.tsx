import AccountRow from '@components/accountRow';
import useWalletSelector from '@hooks/useWalletSelector';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const SelectedAccountContainer = styled.div((props) => ({
  padding: '20px',
  paddingBottom: '16px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
}));
const TopBar = styled.div((props) => ({
  padding: '1.5%',
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: props.theme.spacing(1),
  backgroundColor: props.theme.colors.background.darkbg,
  borderRadius: props.theme.radius(1),
  border: '1px solid rgba(168, 185, 244, 0.20)',
}));
interface AccountHeaderComponentProps {
  disableMenuOption?: boolean;
  disableAccountSwitch?: boolean;
  disableCopy?: boolean;
  onReceive?: () => void;
  addressFor?: 'BTC' | 'ORD' | 'STX';
}

function AccountHeaderComponent({
  disableMenuOption,
  disableAccountSwitch = false,
  onReceive,
  disableCopy = false,
  addressFor = 'BTC',
}: AccountHeaderComponentProps) {
  const navigate = useNavigate();
  const { selectedAccount } = useWalletSelector();
  const handleAccountSelect = () => {
    if (!disableAccountSwitch) {
      navigate('/account-list');
    }
  };

  const handleSettingsSelect = () => {
    navigate('/settings');
  };

  return (
    <SelectedAccountContainer>
      <TopBar>
        <AccountRow
          account={selectedAccount!}
          isSelected
          allowCopyAddress={!disableCopy}
          disableMenuOption={disableMenuOption}
          handleSettingsSelect={handleSettingsSelect}
          onAccountSelected={handleAccountSelect}
          addressFor={addressFor}
          onReceive={onReceive}
        />
      </TopBar>
    </SelectedAccountContainer>
  );
}

export default AccountHeaderComponent;
