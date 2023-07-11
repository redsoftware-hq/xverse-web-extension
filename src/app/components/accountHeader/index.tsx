import { useNavigate } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
// import { useState } from 'react';
// import ResetWalletPrompt from '@components/resetWallet';
// import PasswordInput from '@components/passwordInput';
// import useWalletReducer from '@hooks/useWalletReducer';
import AccountRow from '@components/accountRow';

import OptionsDialog, { OPTIONS_DIALOG_WIDTH } from '@components/optionsDialog/optionsDialog';
import useSeedVault from '@hooks/useSeedVault';
import useWalletSelector from '@hooks/useWalletSelector';
// import OptionsDialog from './optionsDialog';

const SelectedAccountContainer = styled.div((props) => ({
  padding: '20px',
  paddingBottom: '16px',
  // paddingRight: '3%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  // paddingTop: props.theme.spacing(5),
  // paddingBottom: props.theme.spacing(5),
  // borderBottom: `0.5px solid ${props.theme.colors.background.elevation3}`,
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
// const ResetWalletContainer = styled.div((props) => ({
//   width: '100%',
//   height: '100%',
//   top: 0,
//   left: 0,
//   bottom: 0,
//   right: 0,
//   position: 'fixed',
//   zIndex: 10,
//   background: 'rgba(25, 25, 48, 0.5)',
//   backdropFilter: 'blur(16px)',
//   padding: 16,
//   paddingTop: props.theme.spacing(30),
// }));

interface AccountHeaderComponentProps {
  disableMenuOption?: boolean;
  disableAccountSwitch?: boolean;
  disableCopy?: boolean;
  onReceiveModalOpen?: () => void;
}

function AccountHeaderComponent({
  disableMenuOption,
  disableAccountSwitch = false,
  onReceiveModalOpen,
  disableCopy = false,
}: AccountHeaderComponentProps) {
  const navigate = useNavigate();
  const { selectedAccount } = useWalletSelector();

  // const { t } = useTranslation('translation', { keyPrefix: 'SETTING_SCREEN' });
  // const [showOptionsDialog, setShowOptionsDialog] = useState<boolean>(false);
  // const [showResetWalletPrompt, setShowResetWalletPrompt] = useState<boolean>(false);
  // const [showResetWalletDisplay, setShowResetWalletDisplay] = useState<boolean>(false);
  // const [password, setPassword] = useState<string>('');
  // const { unlockWallet, resetWallet } = useWalletReducer();
  // const [error, setError] = useState<string>('');

  // const handleResetWallet = () => {
  //   resetWallet();
  //   navigate('/');
  // };

  // const handlePasswordNextClick = async () => {
  //   try {
  //     await unlockWallet(password);
  //     setPassword('');
  //     setError('');
  //     handleResetWallet();
  //   } catch (e) {
  //     setError(t('INCORRECT_PASSWORD_ERROR'));
  //   }
  // };

  // const onGoBack = () => {
  //   navigate(0);
  // };

  // const onResetWalletPromptClose = () => {
  //   setShowResetWalletPrompt(false);
  // };

  // const onResetWalletPromptOpen = () => {
  //   setShowResetWalletPrompt(true);
  // };

  // const openResetWalletScreen = () => {
  //   setShowResetWalletPrompt(false);
  //   setShowResetWalletDisplay(true);
  // };

  const handleAccountSelect = () => {
    if (!disableAccountSwitch) {
      navigate('/account-list');
    }
  };

  const handleSettingsSelect = () => {
    navigate('/settings');
    // setShowOptionsDialog(true);
  };

  // const closeDialog = () => {
  //   setShowOptionsDialog(false);
  // };

  return (
    <>
      {/* {showResetWalletDisplay && (
        <ResetWalletContainer>
          <PasswordInput
            title={t('ENTER_PASSWORD')}
            inputLabel={t('PASSWORD')}
            enteredPassword={password}
            setEnteredPassword={setPassword}
            handleContinue={handlePasswordNextClick}
            handleBack={onGoBack}
            passwordError={error}
            stackButtonAlignment
          />
        </ResetWalletContainer>
      )} */}
      <SelectedAccountContainer>
        <TopBar>
          <AccountRow
            account={selectedAccount!}
            isSelected
            allowCopyAddress={!disableCopy}
            disableMenuOption={disableMenuOption}
            handleSettingsSelect={handleSettingsSelect}
            onAccountSelected={handleAccountSelect}
            onReceiveModalOpen={onReceiveModalOpen}
          />
        </TopBar>
        {/* {!disableMenuOption && (
            <SettingsButton onClick={handleOptionsSelect}>
              <img src={Menu} alt="Settings" />
            </SettingsButton>
          )} */}
        {/* {showOptionsDialog && (
          <OptionsDialog
            closeDialog={closeDialog}
            showResetWalletPrompt={onResetWalletPromptOpen}
          />
        )} */}
      </SelectedAccountContainer>
      {/* <ResetWalletPrompt
        showResetWalletPrompt={showResetWalletPrompt}
        onResetWalletPromptClose={onResetWalletPromptClose}
        openResetWalletScreen={openResetWalletScreen}
      /> */}
    </>
  );
}

export default AccountHeaderComponent;
