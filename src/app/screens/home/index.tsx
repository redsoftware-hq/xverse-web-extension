/* eslint-disable no-await-in-loop */
import SIP10Icon from '@assets/img/dashboard/SIP10.svg';
import Send from '@assets/img/dashboard/send.svg';
import Receive from '@assets/img/dashboard/recieve.svg';
import IconBitcoin from '@assets/img/dashboard/bitcoin_icon.svg';
import BitcoinToken from '@assets/img/dashboard/bitcoin_token.svg';
import Buy from '@assets/img/dashboard/buy.svg';
import Wallet from '@assets/img/dashboard/Wallet.svg';
import AddCoin from '@assets/img/dashboard/AddCoin.svg';
import OrdinalsIcon from '@assets/img/dashboard/ordinalBRC20.svg';
import IconStacks from '@assets/img/dashboard/stack_icon.svg';
import AccountHeaderComponent from '@components/accountHeader';
import BottomModal from '@components/bottomModal';
import ActionButton from '@components/button';
import ReceiveCardComponent from '@components/receiveCardComponent';
import ShowBtcReceiveAlert from '@components/showBtcReceiveAlert';
import ShowOrdinalReceiveAlert from '@components/showOrdinalReceiveAlert';
import BottomBar from '@components/tabBar';
import TokenTile from '@components/tokenTile';
import UpdatedBottomModal from '@components/updatedBottomModal';
import useAppConfig from '@hooks/queries/useAppConfig';
import useBtcCoinBalance from '@hooks/queries/useBtcCoinsBalance';
import useBtcWalletData from '@hooks/queries/useBtcWalletData';
import useCoinsData from '@hooks/queries/useCoinData';
import useCoinRates from '@hooks/queries/useCoinRates';
import useFeeMultipliers from '@hooks/queries/useFeeMultipliers';
import useStxWalletData from '@hooks/queries/useStxWalletData';
import useWalletSelector from '@hooks/useWalletSelector';
import { ArrowDown, ArrowUp, Plus } from '@phosphor-icons/react';
import CoinSelectModal from '@screens/home/coinSelectModal';
import type { FungibleToken } from '@secretkeylabs/xverse-core';
import { changeShowDataCollectionAlertAction } from '@stores/wallet/actions/actionCreators';
import { CurrencyTypes } from '@utils/constants';
import { isInOptions, isLedgerAccount } from '@utils/helper';
import { optInMixPanel, optOutMixPanel } from '@utils/mixpanel';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled, { useTheme } from 'styled-components';
import Theme from 'theme';
import AlertMessage from '@components/alertMessage';
import { useDispatch } from 'react-redux';
import {
  ChangeShowBtcReceiveAlertAction,
  ChangeShowOrdinalReceiveAlertAction,
} from '@stores/wallet/actions/actionCreators';
import ShowBtcReceiveAlert from '@components/showBtcReceiveAlert';
import ShowOrdinalReceiveAlert from '@components/showOrdinalReceiveAlert';
import Steps from '@components/steps';
import { useStepperContext } from '@stores/stepper';
import StepperNavigator from '@components/stepperNavigator';
import BalanceCard from './balanceCard';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 20px;
  margin-right: 20px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Dashboard = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: props.theme.radius(2),
  background: props.theme.colors.action.classic,
  alignItems: 'space-between',
  justifyContent: 'space-between',
  paddingLeft: props.theme.spacing(12),
  paddingBottom: props.theme.spacing(8),
  paddingRight: props.theme.spacing(12),
}));
const ListContainer = styled.div((props) => ({
  display: 'flex',
  background: props.theme.colors.background.darkbg,
  flexDirection: 'column',
  alignItems: 'space-between',
  justifyContent: 'space-between',
  overflowY: 'auto',
  borderTopLeftRadius: '24px',
  borderTopRightRadius: '24px',
  marginTop: props.theme.spacing(8),
  padding: props.theme.spacing(10),
}));

const ColumnContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'space-between',
  justifyContent: 'space-between',
}));

const ReceiveContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  marginTop: props.theme.spacing(12),
  marginBottom: props.theme.spacing(16),
  paddingLeft: props.theme.spacing(8),
  paddingRight: props.theme.spacing(8),
  gap: props.theme.space.m,
}));

const CoinContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'space-between',
  justifyContent: 'space-between',
});

const AvailableCoins = styled.div((props) => ({
  ...props.theme.mont_light,
  display: 'flex',
  flexDirection: 'column',
  fontSize: '20px',
  color: 'rgba(255, 165, 137, 1)'
}));

const Coins = styled.div((props) => ({
  ...props.theme.mont_headline_normal,
  lineHeight: '32px',
  color: 'white',
}))

const Button = styled.button((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: props.theme.radius(1),
  backgroundColor: 'rgba(0, 0, 0, 0.40)',
  marginTop: props.theme.spacing(5),
  paddingTop: props.theme.spacing(3),
  paddingBottom: props.theme.spacing(3),
  paddingLeft: props.theme.spacing(7),
  paddingRight: props.theme.spacing(7),
  height: props.theme.spacing(20),
}));

const ButtonText = styled.div((props) => ({
  ...props.theme.body_xs,
  fontWeight: 700,
  fontFamily: 'MontRegular',
  fontSize: '14px',
  color: props.theme.colors.white['0'],
  textAlign: 'center',
}));

const ButtonImage = styled.img((props) => ({
  marginRight: props.theme.spacing(3),
  alignSelf: 'center',
  transform: 'all',
}));

// const RowButtonContainer = styled.div((props) => ({
//   display: 'flex',
//   flexDirection: 'row',
//   marginTop: props.theme.spacing(11),
// }));

// const ButtonContainer = styled.div((props) => ({
//   marginRight: props.theme.spacing(11),
// }));

const TokenListButtonContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: props.theme.spacing(6),
  // marginBottom: props.theme.spacing(22),
}));

const Icon = styled.img({
  width: 24,
  height: 24,
});

const MergedIcon = styled.img({
  width: 40,
  height: 40,
});

const VerifyOrViewContainer = styled.div((props) => ({
  margin: props.theme.spacing(8),
  marginTop: props.theme.spacing(16),
  marginBottom: props.theme.spacing(20),
}));

const VerifyButtonContainer = styled.div((props) => ({
  marginBottom: props.theme.spacing(6),
}));

const ModalContent = styled.div((props) => ({
  padding: props.theme.spacing(8),
  paddingTop: 0,
  paddingBottom: props.theme.spacing(16),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const ModalIcon = styled.img((props) => ({
  marginBottom: props.theme.spacing(10),
}));

const ModalTitle = styled.div((props) => ({
  ...props.theme.typography.body_bold_l,
  marginBottom: props.theme.spacing(4),
  textAlign: 'center',
}));

const ModalDescription = styled.div((props) => ({
  ...props.theme.typography.body_m,
  color: props.theme.colors.white['200'],
  marginBottom: props.theme.spacing(16),
  textAlign: 'center',
}));

const ModalControlsContainer = styled.div({
  display: 'flex',
  width: '100%',
});

const ModalButtonContainer = styled.div((props) => ({
  width: '100%',
  '&:first-child': {
    marginRight: props.theme.spacing(6),
  },
}));

function Home() {
  const { t } = useTranslation('translation', {
    keyPrefix: 'DASHBOARD_SCREEN',
  });
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [openReceiveModal, setOpenReceiveModal] = useState(false);
  const [openSendModal, setOpenSendModal] = useState(false);
  const [openBuyModal, setOpenBuyModal] = useState(false);
  const [isBtcReceiveAlertVisible, setIsBtcReceiveAlertVisible] = useState(false);
  const [isOrdinalReceiveAlertVisible, setIsOrdinalReceiveAlertVisible] = useState(false);
  const {
    coinsList,
    stxAddress,
    btcAddress,
    ordinalsAddress,
    brcCoinsList,
    showBtcReceiveAlert,
    showOrdinalReceiveAlert,
  } = useWalletSelector();
  const { isLoading: loadingStxWalletData, isRefetching: refetchingStxWalletData } =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    stxAddress ? useStxWalletData() : { isLoading: false, isRefetching: false };
  const { isLoading: loadingBtcWalletData, isRefetching: refetchingBtcWalletData } =
    useBtcWalletData();
  const { isLoading: loadingCoinData, isRefetching: refetchingCoinData } = useCoinsData();
  const { isLoading: loadingBtcCoinData, isRefetching: refetchingBtcCoinData } =
    useBtcCoinBalance();
  useFeeMultipliers();
  useCoinRates();
  useAppConfig();

  const onReceiveModalOpen = () => {
    setOpenReceiveModal(true);
  };

  const onReceiveModalClose = () => {
    setOpenReceiveModal(false);

    if (isLedgerAccount(selectedAccount)) {
      setAreReceivingAddressesVisible(false);
      setChoseToVerifyAddresses(false);
    }
  };

  const onSendModalOpen = () => {
    setOpenSendModal(true);
  };

  const onSendModalClose = () => {
    setOpenSendModal(false);
  };

  const onBuyModalOpen = () => {
    setOpenBuyModal(true);
  };

  const onBuyModalClose = () => {
    setOpenBuyModal(false);
  };

  function getCoinsList() {
    const list = coinsList ? coinsList?.filter((ft) => ft.visible) : [];
    return brcCoinsList ? list.concat(brcCoinsList) : list;
  }

  const handleManageTokenListOnClick = () => {
    navigate('/manage-tokens');
  };

  const onStxSendClick = async () => {
    if (isLedgerAccount(selectedAccount) && !isInOptions()) {
      await chrome.tabs.create({
        url: chrome.runtime.getURL('options.html#/send-stx'),
      });
      return;
    }
    navigate('/send-stx');
  };

  const onBtcSendClick = async () => {
    if (isLedgerAccount(selectedAccount) && !isInOptions()) {
      await chrome.tabs.create({
        url: chrome.runtime.getURL('options.html#/send-btc'),
      });
      return;
    }
    navigate('/send-btc');
  };

  const onBTCReceiveSelect = () => {
    navigate('/receive/BTC');
  };

  const onSTXReceiveSelect = () => {
    navigate('/receive/STX');
  };

  const onSendFtSelect = async (coin: FungibleToken) => {
    if (coin.protocol === 'brc-20') {
      if (isLedgerAccount(selectedAccount)) {
        if (!isInOptions()) {
          await chrome.tabs.create({
            // TODO replace with send-brc20-one-step route, when ledger support is ready
            url: chrome.runtime.getURL(`options.html#/send-brc20?coinName=${coin.name}`),
          });
          return;
        }
        navigate(`send-brc20?coinName=${coin.name}`);
        return;
      }
      navigate('send-brc20-one-step', {
        state: {
          fungibleToken: coin,
        },
      });
      return;
    }
    if (isLedgerAccount(selectedAccount) && !isInOptions()) {
      await chrome.tabs.create({
        url: chrome.runtime.getURL(`options.html#/send-ft?coinTicker=${coin.ticker}`),
      });
      return;
    }
    navigate('send-ft', {
      state: {
        fungibleToken: coin,
      },
    });
  };

  const onBuyStxClick = () => {
    navigate('/buy/STX');
  };

  const onBuyBtcClick = () => {
    navigate('/buy/BTC');
  };

  const onOrdinalReceiveAlertOpen = () => {
    if (showOrdinalReceiveAlert) setIsOrdinalReceiveAlertVisible(true);
  };

  const onOrdinalReceiveAlertClose = () => {
    setIsOrdinalReceiveAlertVisible(false);
  };

  const onReceiveAlertClose = () => {
    setIsBtcReceiveAlertVisible(false);
  };

  const onReceiveAlertOpen = () => {
    if (showBtcReceiveAlert) setIsBtcReceiveAlertVisible(true);
  };

  const handleTokenPressed = (token: {
    coin: CurrencyTypes;
    ft?: string | undefined;
    brc20Ft?: string;
  }) => {
    if (token.brc20Ft) {
      navigate(`/coinDashboard/${token.coin}?brc20ft=${token.brc20Ft}`);
    } else {
      navigate(`/coinDashboard/${token.coin}?ft=${token.ft}`);
    }
  };

  

  const onOrdinalsReceivePress = () => {
    navigate('/receive/ORD');
  };

  const onSwapPressed = () => {
    navigate('/swap');
  };

  const receiveContent = (
    <ReceiveContainer>
      <ReceiveCardComponent
        title={t('BITCOIN')}
        address={btcAddress}
        onQrAddressClick={onBTCReceiveSelect}
        onCopyAddressClick={onReceiveAlertOpen}
        showVerifyButton={choseToVerifyAddresses}
        currency="BTC"
      >
        <Icon src={BitcoinToken} />
      </ReceiveCardComponent>

      <ReceiveCardComponent
        title={t('ORDINALS')}
        address={ordinalsAddress}
        onQrAddressClick={onOrdinalsReceivePress}
        onCopyAddressClick={onOrdinalReceiveAlertOpen}
        showVerifyButton={choseToVerifyAddresses}
        currency="ORD"
      >
        <MergedIcon src={ordinalsIcon} />
      </ReceiveCardComponent>

      {stxAddress && (
        <ReceiveCardComponent
          title={t('STACKS_AND_TOKEN')}
          address={stxAddress}
          onQrAddressClick={onSTXReceiveSelect}
          showVerifyButton={choseToVerifyAddresses}
          currency="STX"
        >
          <MergedIcon src={SIP10Icon} />
        </ReceiveCardComponent>
      )}

      {isLedgerAccount(selectedAccount) && !stxAddress && (
        <ActionButton
          transparent
          icon={<Plus color="white" size={20} />}
          text={t('ADD_STACKS_ADDRESS')}
          onPress={async () => {
            if (!isInOptions()) {
              await chrome.tabs.create({
                url: chrome.runtime.getURL(`options.html#/add-stx-address-ledger`),
              });
            } else {
              navigate('/add-stx-address-ledger');
            }
          }}
        />
      )}
    </ReceiveContainer>
  );

  const verifyOrViewAddresses = (
    <VerifyOrViewContainer>
      <VerifyButtonContainer>
        <ActionButton
          text={t('VERIFY_ADDRESSES_ON_LEDGER')}
          onPress={() => {
            setChoseToVerifyAddresses(true);
            setAreReceivingAddressesVisible(true);
          }}
        />
      </VerifyButtonContainer>
      <ActionButton
        transparent
        text={t('VIEW_ADDRESSES')}
        onPress={() => {
          if (choseToVerifyAddresses) {
            setChoseToVerifyAddresses(false);
          }
          setAreReceivingAddressesVisible(true);
        }}
      />
    </VerifyOrViewContainer>
  );

  const handleDataCollectionDeny = () => {
    optOutMixPanel();
    dispatch(changeShowDataCollectionAlertAction(false));
  };

  const handleDataCollectionAllow = () => {
    optInMixPanel(selectedAccount?.masterPubKey);
    dispatch(changeShowDataCollectionAlertAction(false));
  };

  const showSwaps = !isLedgerAccount(selectedAccount) && network.type !== 'Testnet';

  return (
    <>
      <AccountHeaderComponent onReceiveModalOpen={onReceiveModalOpen} />
      {isBtcReceiveAlertVisible && (
        <ShowBtcReceiveAlert onReceiveAlertClose={onReceiveAlertClose} />
      )}
      {isOrdinalReceiveAlertVisible && (
        <ShowOrdinalReceiveAlert onOrdinalReceiveAlertClose={onOrdinalReceiveAlertClose} />
      )}
      <Container>
        <Dashboard>
          <BalanceCard
            icon={Wallet}
            isLoading={
              loadingStxWalletData ||
              loadingBtcWalletData ||
              refetchingStxWalletData ||
              refetchingBtcWalletData
            }
          />

          {/* <RowButtonContainer>
            <ButtonContainer>
              <SmallActionButton isOpaque isRound src={Send} onPress={onSendModalOpen} />
            </ButtonContainer>
            <ButtonContainer>
              <SmallActionButton isOpaque isRound src={Receive} onPress={onReceiveModalOpen} />
            </ButtonContainer>
            <ButtonContainer>
              <SmallActionButton isOpaque isRound src={Buy} onPress={onBuyModalOpen} />
            </ButtonContainer>
          </RowButtonContainer> */}

          <TokenListButtonContainer>
            <AvailableCoins><Coins>2</Coins> coins</AvailableCoins>
            <Button onClick={handleManageTokenListOnClick}>
              <ButtonImage src={AddCoin} />
              <ButtonText>{t('ADD_COIN')}</ButtonText>
            </Button>
          </TokenListButtonContainer>
        </Dashboard>

        <BottomModal visible={openReceiveModal} header={t('RECEIVE')} onClose={onReceiveModalClose}>
          {receiveContent}
        </BottomModal>

        <CoinSelectModal
          onSelectBitcoin={onBtcSendClick}
          onSelectStacks={onStxSendClick}
          onClose={onSendModalClose}
          onSelectCoin={onSendFtSelect}
          visible={openSendModal}
          coins={getCoinsList()}
          title={t('SEND')}
          loadingWalletData={loadingStxWalletData || loadingBtcWalletData}
        />

        <CoinSelectModal
          onSelectBitcoin={onBuyBtcClick}
          onSelectStacks={onBuyStxClick}
          onClose={onBuyModalClose}
          onSelectCoin={onBuyModalClose}
          visible={openBuyModal}
          coins={[]}
          title={t('BUY')}
          loadingWalletData={loadingStxWalletData || loadingBtcWalletData}
        />
      </Container>
      <StepperNavigator/>
      <ListContainer>
        <ColumnContainer>
          <TokenTile
            title={t('BITCOIN')}
            currency="BTC"
            icon={IconBitcoin}
            loading={loadingBtcWalletData || refetchingBtcWalletData}
            underlayColor={Theme.colors.background.elevation1}
            onPress={handleTokenPressed}
          />
          <TokenTile
            title={t('STACKS')}
            currency="STX"
            icon={IconStacks}
            loading={loadingStxWalletData || refetchingStxWalletData}
            underlayColor={Theme.colors.background.elevation1}
            onPress={handleTokenPressed}
          />
        </ColumnContainer>

        <CoinContainer>
          {coinsList
            ?.filter((ft) => ft.visible)
            .map((coin) => (
              <TokenTile
                title={coin.name}
                currency="FT"
                loading={loadingCoinData || refetchingCoinData}
                underlayColor={Theme.colors.background.elevation1}
                fungibleToken={coin}
                onPress={handleTokenPressed}
              />
            ))}
          {brcCoinsList?.map((coin) => (
            <TokenTile
              title={coin.name}
              currency="brc20"
              loading={loadingBtcCoinData || refetchingBtcCoinData}
              underlayColor={Theme.colors.background.elevation1}
              fungibleToken={coin}
              onPress={handleTokenPressed}
            />
          ))}
        </CoinContainer>

        <BottomModal visible={openReceiveModal} header={t('RECEIVE')} onClose={onReceiveModalClose}>
          {receiveContent}
        </BottomModal>

        <CoinSelectModal
          onSelectBitcoin={onBtcSendClick}
          onSelectStacks={onStxSendClick}
          onClose={onSendModalClose}
          onSelectCoin={onSendFtSelect}
          visible={openSendModal}
          coins={getCoinsList()}
          title={t('SEND')}
          loadingWalletData={loadingStxWalletData || loadingBtcWalletData}
        />

        <CoinSelectModal
          onSelectBitcoin={onBuyBtcClick}
          onSelectStacks={onBuyStxClick}
          onClose={onBuyModalClose}
          onSelectCoin={onBuyModalClose}
          visible={openBuyModal}
          coins={[]}
          title={t('BUY')}
          loadingWalletData={loadingStxWalletData || loadingBtcWalletData}
        />
      </Container>
      <BottomBar tab="dashboard" />

      <BottomModal
        visible={!!showDataCollectionAlert}
        header=""
        onClose={handleDataCollectionDeny}
        overlayStylesOverriding={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        contentStylesOverriding={{
          width: 'auto',
          bottom: 'initial',
          borderRadius: theme.radius(3),
          margin: `0 ${theme.spacing(8)}px`,
        }}
      >
        <ModalContent>
          <ModalIcon src={dashboardIcon} alt="analytics" />
          <ModalTitle>{t('DATA_COLLECTION_POPUP.TITLE')}</ModalTitle>
          <ModalDescription>{t('DATA_COLLECTION_POPUP.DESCRIPTION')}</ModalDescription>
          <ModalControlsContainer>
            <ModalButtonContainer>
              <ActionButton
                transparent
                text={t('DATA_COLLECTION_POPUP.DENY')}
                onPress={handleDataCollectionDeny}
              />
            </ModalButtonContainer>
            <ModalButtonContainer>
              <ActionButton
                text={t('DATA_COLLECTION_POPUP.ALLOW')}
                onPress={handleDataCollectionAllow}
              />
            </ModalButtonContainer>
          </ModalControlsContainer>
        </ModalContent>
      </BottomModal>
    </>
  );
}

export default Home;
