import ArrowIcon from '@assets/img/settings/arrow.svg';
import useWalletSelector from '@hooks/useWalletSelector';
import { useStepperContext } from '@stores/stepper';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
// import { useDispatch } from 'react-redux';
// import { ChangeActivateOrdinalsAction } from '@stores/wallet/actions/actionCreators';
import Paragraph from '@components/paragraph';
import TopRow from '@components/topRow';
import useNonOrdinalUtxos from '@hooks/useNonOrdinalUtxo';
import useWalletReducer from '@hooks/useWalletReducer';
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

const Top = styled.div((props) => ({
  marginTop: props.theme.spacing(10),
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  marginBottom: 8,
}));
const Bottom = styled.div((props) => ({
  flex: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: props.theme.spacing(10),
  marginRight: props.theme.spacing(10),
  marginBottom: props.theme.spacing(20),
}));
const Layout = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));
function Setting() {
  const { t } = useTranslation('translation', { keyPrefix: 'SETTING_SCREEN' });
  // const { fiatCurrency, network, hasActivatedOrdinalsKey } = useWalletSelector();
  const { fiatCurrency, network } = useWalletSelector();
  const { lockWallet } = useWalletReducer();
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const { dispatchStep } = useStepperContext();
  const { unspentUtxos } = useNonOrdinalUtxos();

  const handleBackButtonClick = () => {
    navigate('/');
    dispatchStep({ type: 'HOME' });
  };
  const openFiatCurrencyScreen = () => {
    navigate('/fiat-currency');
  };

  const openPrivacyPreferencesScreen = () => {
    navigate('/privacy-preferences');
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
    dispatchStep({ type: 'HOME' });
    navigate('/');
  };
  return (
    <Layout>
      <Top>
        <TopRow title={t('MAIN_TILE')} onClick={handleBackButtonClick} />
        <Paragraph content={t('CONTENT')} />
      </Top>
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
        <SettingComponent text={t('RECOVER_ASSETS')} onClick={onRestoreFundClick} showDivider />
        <SettingComponent text={t('LOCK_WALLET')} onClick={handleLockWallet} showDivider />
        <Divider />
      </Container>
    </Layout>
  );
}

export default Setting;
