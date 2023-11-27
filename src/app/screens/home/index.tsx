/* eslint-disable no-await-in-loop */
import AddCoin from '@assets/img/dashboard/AddCoin.svg';
import IconBitcoin from '@assets/img/dashboard/bitcoin_icon.svg';
import BitcoinToken from '@assets/img/dashboard/bitcoin_token.svg';
import Buy from '@assets/img/dashboard/buy.svg';
import OrdinalsIcon from '@assets/img/dashboard/ordinalBRC20.svg';
import Receive from '@assets/img/dashboard/recieve.svg';
import Send from '@assets/img/dashboard/send.svg';
import SIP10Icon from '@assets/img/dashboard/SIP10.svg';
import IconStacks from '@assets/img/dashboard/stack_icon.svg';
import Wallet from '@assets/img/dashboard/Wallet.svg';
import AccountHeaderComponent from '@components/accountHeader';
import AlertMessage from '@components/alertMessage';
import BottomModal from '@components/bottomModal';
import ReceiveCardComponent from '@components/receiveCardComponent';
import ShowBtcReceiveAlert from '@components/showBtcReceiveAlert';
import ShowOrdinalReceiveAlert from '@components/showOrdinalReceiveAlert';
import SmallActionButton from '@components/smallActionButton';
import StepperNavigator from '@components/stepperNavigator';
import Steps from '@components/steps';
import BottomBar from '@components/tabBar';
import TokenTile from '@components/tokenTile';
import useAppConfig from '@hooks/queries/useAppConfig';
import useBtcCoinBalance from '@hooks/queries/useBtcCoinsBalance';
import useBtcWalletData from '@hooks/queries/useBtcWalletData';
import useCoinsData from '@hooks/queries/useCoinData';
import useCoinRates from '@hooks/queries/useCoinRates';
import useFeeMultipliers from '@hooks/queries/useFeeMultipliers';
import useStxWalletData from '@hooks/queries/useStxWalletData';
import useWalletSelector from '@hooks/useWalletSelector';
import TransactionsHistoryList from '@screens/coinDashboard/transactionsHistoryList';
import CoinSelectModal from '@screens/home/coinSelectModal';
import { FungibleToken } from '@secretkeylabs/xverse-core/types';
import { useStepperContext } from '@stores/stepper';
import {
  ChangeShowBtcReceiveAlertAction,
  ChangeShowOrdinalReceiveAlertAction,
} from '@stores/wallet/actions/actionCreators';
import { CurrencyTypes } from '@utils/constants';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Theme from 'theme';
import BalanceCard from './balanceCard';

const Container = styled.div`
  display: flex;
  flex-direction: column;
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
}));

const CoinContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'space-between',
  justifyContent: 'space-between',
});

const StepperContainer = styled.div({
  marginTop: 10,
});

const AvailableCoins = styled.div((props) => ({
  ...props.theme.mont_light,
  display: 'flex',
  flexDirection: 'column',
  fontSize: '20px',
  color: 'rgba(255, 165, 137, 1)',
}));

const Coins = styled.div((props) => ({
  ...props.theme.mont_headline_normal,
  lineHeight: '32px',
  color: 'white',
}));

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

function Home() {
  const { t } = useTranslation('translation', {
    keyPrefix: 'DASHBOARD_SCREEN',
  });
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
    useStxWalletData();
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

  const onStxSendClick = () => {
    navigate('/send-stx');
  };

  const onBtcSendClick = () => {
    navigate('/send-btc');
  };

  const onBTCReceiveSelect = () => {
    navigate('/receive/BTC');
  };

  const onSTXReceiveSelect = () => {
    navigate('/receive/STX');
  };

  const onSendFtSelect = (coin: FungibleToken) => {
    if (coin.protocol === 'brc-20') {
      navigate('send-brc20', {
        state: {
          fungibleToken: coin,
        },
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
  const onReceive = () => {
    navigate('receive-main-menu');
  };
  const handleTokenPressed = (token: {
    coin: CurrencyTypes;
    ft?: string | undefined;
    brc20Ft?: string;
  }) => {
    console.log(token);
    if (token.brc20Ft) {
      navigate(`/coinDashboard/${token.coin}?brc20ft=${token.brc20Ft}`);
    } else {
      navigate(`/coinDashboard/${token.coin}?ft=${token.ft}`);
    }
  };

  const onOrdinalsReceivePress = () => {
    navigate('/receive/ORD');
  };

  const receiveContent = (
    <ReceiveContainer>
      <ReceiveCardComponent
        title={t('BITCOIN')}
        address={btcAddress}
        onQrAddressClick={onBTCReceiveSelect}
        onCopyAddressClick={onReceiveAlertOpen}
      >
        <Icon src={BitcoinToken} />
      </ReceiveCardComponent>

      <ReceiveCardComponent
        title={t('ORDINALS')}
        address={ordinalsAddress}
        onQrAddressClick={onOrdinalsReceivePress}
        onCopyAddressClick={onOrdinalReceiveAlertOpen}
      >
        <MergedIcon src={OrdinalsIcon} />
      </ReceiveCardComponent>

      <ReceiveCardComponent
        title={t('STACKS_AND_TOKEN')}
        address={stxAddress}
        onQrAddressClick={onSTXReceiveSelect}
      >
        <MergedIcon src={SIP10Icon} />
      </ReceiveCardComponent>
    </ReceiveContainer>
  );
  return (
    <>
      <AccountHeaderComponent onReceive={onReceive} />
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
            <AvailableCoins>
              <Coins>{2 + getCoinsList().length}</Coins> Coins
            </AvailableCoins>
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
      <StepperContainer>
        <StepperNavigator />
      </StepperContainer>
      <TransactionsHistoryList coin="FT" txFilter={null} />
      {/* <ListContainer>
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
      </ListContainer> */}
      <BottomBar tab="dashboard" />
    </>
  );
}

export default Home;
