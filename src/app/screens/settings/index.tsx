import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import useWalletSelector from '@hooks/useWalletSelector';
import ArrowIcon from '@assets/img/settings/arrow.svg';
import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { ChangeActivateOrdinalsAction } from '@stores/wallet/actions/actionCreators';
import useNonOrdinalUtxos from '@hooks/useNonOrdinalUtxo';
import useWalletReducer from '@hooks/useWalletReducer';
import TopRow from '@components/topRow';
import Paragraph from '@components/paragraph';
import SettingComponent from './settingComponent';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Divider = styled.div((props) => ({
  padding: props.theme.spacing(11),
}));

function Setting() {
  const { t } = useTranslation('translation', { keyPrefix: 'SETTING_SCREEN' });
  // const { fiatCurrency, network, hasActivatedOrdinalsKey } = useWalletSelector();
  const { fiatCurrency, network } = useWalletSelector();
  const { lockWallet } = useWalletReducer();
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const { unspentUtxos } = useNonOrdinalUtxos();

  const handleBackButtonClick = () => {
    navigate('/');
  };
  const openFiatCurrencyScreen = () => {
    navigate('/fiat-currency');
  };

  const openChangeNetworkScreen = () => {
    navigate('/change-network');
  };

  const openBackUpWalletScreen = () => {
    navigate('/backup-wallet');
  };

  // const switchActivateOrdinalState = () => {
  //   dispatch(ChangeActivateOrdinalsAction(!hasActivatedOrdinalsKey));
  // };

  const openUpdatePasswordScreen = () => {
    navigate('/change-password');
  };

  const openResetWalletPage = () => {
    navigate('/reset-wallet');
  };

  const openLockCountdownScreen = () => {
    navigate('/lockCountdown');
  };

  const onRestoreFundClick = () => {
    navigate('/restore-funds', {
      state: {
        unspentUtxos,
      },
    });
  };
  const handleLockWallet = () => {
    lockWallet();
    navigate('/');
  };
  return (
    <>
      <TopRow title={t('MAIN_TILE')} onClick={handleBackButtonClick} />
      <Paragraph content={t('CONTENT')} />
      <Container>
        <SettingComponent
          text={t('NETWORK')}
          onClick={openChangeNetworkScreen}
          textDetail={network.type}
        />
        <SettingComponent
          text={t('CURRENCY')}
          onClick={openFiatCurrencyScreen}
          textDetail={fiatCurrency}
          showDivider
        />
        <SettingComponent
          text={t('UPDATE_PASSWORD')}
          onClick={openUpdatePasswordScreen}
          showDivider
        />
        <SettingComponent text={t('BACKUP_WALLET')} onClick={openBackUpWalletScreen} showDivider />
        {/* <SettingComponent
          text={t('LOCK_COUNTDOWN')}
          onClick={openLockCountdownScreen} 
          showDivider
        /> */}
        {/* <SettingComponent
          text={t('RESET_WALLET')}
          onClick={openResetWalletPage}
          // showWarningTitle
        /> */}
        {/* <SettingComponent
          text={t('ACTIVATE_ORDINAL_NFTS')}
          toggle
          toggleFunction={switchActivateOrdinalState}
          toggleValue={hasActivatedOrdinalsKey}
          showDivider
        /> */}
        <SettingComponent text={t('RECOVER_ASSETS')} onClick={onRestoreFundClick} showDivider />
        <SettingComponent text={t('LOCK_WALLET')} onClick={handleLockWallet} showDivider />
        <Divider />
        {/* <ResetWalletPrompt
          showResetWalletPrompt={showResetWalletPrompt}
          onResetWalletPromptClose={onResetWalletPromptClose}
          openResetWalletScreen={openResetWalletScreen}
        /> */}
      </Container>
    </>
  );
}

export default Setting;
