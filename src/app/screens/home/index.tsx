/* eslint-disable no-await-in-loop */
import AddCoin from '@assets/img/dashboard/AddCoin.svg';
import Wallet from '@assets/img/dashboard/Wallet.svg';
import AccountHeaderComponent from '@components/accountHeader';
import StepperNavigator from '@components/stepperNavigator';
import BottomBar from '@components/tabBar';
import useAppConfig from '@hooks/queries/useAppConfig';
import useBtcCoinBalance from '@hooks/queries/useBtcCoinsBalance';
import useBtcWalletData from '@hooks/queries/useBtcWalletData';
import useCoinsData from '@hooks/queries/useCoinData';
import useCoinRates from '@hooks/queries/useCoinRates';
import useFeeMultipliers from '@hooks/queries/useFeeMultipliers';
import useStxWalletData from '@hooks/queries/useStxWalletData';
import useWalletSelector from '@hooks/useWalletSelector';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AllTransactionsHistoryList from './allTransactions';
import BalanceCard from './balanceCard';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  margin-right: 20px;
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

const TokenListButtonContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: props.theme.spacing(6),
}));

const MainContainer = styled.div((props) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}));

function Home() {
  const { t } = useTranslation('translation', {
    keyPrefix: 'DASHBOARD_SCREEN',
  });
  const navigate = useNavigate();
  const { coinsList, brcCoinsList } = useWalletSelector();
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

  function getCoinsList() {
    const list = coinsList ? coinsList?.filter((ft) => ft.visible) : [];
    return brcCoinsList ? list.concat(brcCoinsList) : list;
  }

  const handleManageTokenListOnClick = () => {
    navigate('/manage-tokens');
  };

  const onReceive = () => {
    navigate('receive-main-menu');
  };

  return (
    <>
      <AccountHeaderComponent onReceive={onReceive} />
      <MainContainer>
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
        </Container>
        <StepperContainer>
          <StepperNavigator />
        </StepperContainer>
        <AllTransactionsHistoryList />
      </MainContainer>
      <BottomBar tab="dashboard" />
    </>
  );
}

export default Home;
