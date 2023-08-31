import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import useWalletSelector from '@hooks/useWalletSelector';
import XverseLogo from '@assets/img/settings/logo.svg';
import ArrowIcon from '@assets/img/settings/arrow.svg';
import ArrowSquareOut from '@assets/img/arrow_square_out.svg';
import BottomBar from '@components/tabBar';
import { PRIVACY_POLICY_LINK, TERMS_LINK, SUPPORT_LINK } from '@utils/constants';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PasswordInput from '@components/passwordInput';
import useWalletReducer from '@hooks/useWalletReducer';
import { useDispatch } from 'react-redux';
import { ChangeActivateOrdinalsAction } from '@stores/wallet/actions/actionCreators';
import useNonOrdinalUtxos from '@hooks/useNonOrdinalUtxo';
import ResetWalletPrompt from '../../components/resetWallet';
import SettingComponent from './settingComponent';
import TopRow from '@components/topRow';
import Paragraph from '@components/paragraph';

declare const VERSION: string;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ResetWalletContainer = styled.div((props) => ({
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  position: 'fixed',
  zIndex: 10,
  background: 'rgba(25, 25, 48, 0.5)',
  backdropFilter: 'blur(10px)',
  paddingLeft: 16,
  paddingRight: 16,
  paddingTop: props.theme.spacing(50),
}));

const Divider = styled.div((props) => ({
  padding: props.theme.spacing(11),
}));

function Setting() {
  const { t } = useTranslation('translation', { keyPrefix: 'SETTING_SCREEN' });
  const [showResetWalletPrompt, setShowResetWalletPrompt] = useState<boolean>(false);
  const [showResetWalletDisplay, setShowResetWalletDisplay] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { fiatCurrency, network, hasActivatedOrdinalsKey } = useWalletSelector();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { unlockWallet, resetWallet } = useWalletReducer();
  const { unspentUtxos } = useNonOrdinalUtxos();

  const openTermsOfService = () => {
    window.open(TERMS_LINK);
  };

  const openPrivacyPolicy = () => {
    window.open(PRIVACY_POLICY_LINK);
  };

  const openSupport = () => {
    window.open(SUPPORT_LINK);
  };

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

  const switchActivateOrdinalState = () => {
    dispatch(ChangeActivateOrdinalsAction(!hasActivatedOrdinalsKey));
  };

  const openUpdatePasswordScreen = () => {
    navigate('/change-password');
  };

  const openResetWalletScreen = () => {
    setShowResetWalletPrompt(false);
    setShowResetWalletDisplay(true);
  };

  const openResetWalletPrompt = () => {
    setShowResetWalletPrompt(true);
  };

  const onResetWalletPromptClose = () => {
    setShowResetWalletPrompt(false);
  };

  const goToSettingScreen = () => {
    setShowResetWalletDisplay(false);
  };

  const handleResetWallet = () => {
    resetWallet();
    navigate('/');
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
  const handlePasswordNextClick = async () => {
    try {
      setLoading(true);
      await unlockWallet(password);
      setPassword('');
      setError('');
      handleResetWallet();
    } catch (e) {
      setError(t('INCORRECT_PASSWORD_ERROR'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showResetWalletDisplay && (
        <ResetWalletContainer>
          <PasswordInput
            title={t('ENTER_PASSWORD')}
            inputLabel={t('PASSWORD')}
            enteredPassword={password}
            setEnteredPassword={setPassword}
            handleContinue={handlePasswordNextClick}
            handleBack={goToSettingScreen}
            passwordError={error}
            stackButtonAlignment
            loading={loading}
          />
        </ResetWalletContainer>
      )}
      <TopRow title={t('MAIN_TILE')} onClick={handleBackButtonClick} />
      <Paragraph content={t('CONTENT')}/>
      <Container>
        <SettingComponent
          text={t('CURRENCY')}
          onClick={openFiatCurrencyScreen}
          textDetail={fiatCurrency}
          showDivider
        />
        <SettingComponent
          text={t('NETWORK')}
          onClick={openChangeNetworkScreen}
          textDetail={network.type}
        />
        <SettingComponent
          text={t('UPDATE_PASSWORD')}
          onClick={openUpdatePasswordScreen}
          icon={ArrowIcon}
          showDivider
        />
        <SettingComponent
          text={t('BACKUP_WALLET')}
          onClick={openBackUpWalletScreen}
          icon={ArrowIcon}
          showDivider
        />
        <SettingComponent
          text={t('LOCK_COUNTDOWN')}
          onClick={openLockCountdownScreen}
          icon={ArrowIcon}
          showDivider
        />
        <SettingComponent
          text={t('RESET_WALLET')}
          onClick={openResetWalletPrompt}
          showWarningTitle
        />
        <SettingComponent
          text={t('ACTIVATE_ORDINAL_NFTS')}
          toggle
          toggleFunction={switchActivateOrdinalState}
          toggleValue={hasActivatedOrdinalsKey}
          showDivider
        />
        <SettingComponent
          text={t('RECOVER_ASSETS')}
          onClick={onRestoreFundClick}
          icon={ArrowIcon}
          showDivider
        />
        <Divider/>
        <ResetWalletPrompt
          showResetWalletPrompt={showResetWalletPrompt}
          onResetWalletPromptClose={onResetWalletPromptClose}
          openResetWalletScreen={openResetWalletScreen}
        />
      </Container>
    </>
  );
}

export default Setting;
