import IconStacks from '@assets/img/dashboard/stack_icon.svg';
import IconUsdc from '@assets/img/dashboard/usdc.svg';
import IconUsdt from '@assets/img/dashboard/usdt.svg';
import IconWbtc from '@assets/img/dashboard/wbtc.svg';
import DownArrow from '@assets/img/swap/Downarrowswap.svg';
import SwapIcon from '@assets/img/swap/Swap.png';
import ActionButton from '@components/button';
import CoinSwitch from '@components/coinSwitch';
import InfoContainer from '@components/infoContainer';
import OperationHeader from '@components/operationHeader';
import useWalletSelector from '@hooks/useWalletSelector';
import { SwapInfoBlock } from '@screens/swap/swapInfoBlock';
import SwapTokenBlock from '@screens/swap/swapTokenBlock';
import { useSwap } from '@screens/swap/useSwap';
import { microstacksToStx, satsToBtc } from '@secretkeylabs/xverse-core';
import { useStepperContext } from '@stores/stepper';
import InputFeedback from '@ui-library/inputFeedback';
import { getFtBalance } from '@utils/tokens';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ScrollContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  row-gap: 16px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  margin-left: 5%;
  margin-right: 5%;
  padding-bottom: 16px;
`;

const Container = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  rowGap: props.theme.spacing(8),
  // marginTop: props.theme.spacing(16),
}));

const DownArrowButton = styled.button((props) => ({
  alignSelf: 'center',
  borderRadius: props.theme.radius(2),
  width: props.theme.spacing(18),
  height: props.theme.spacing(18),
  background: 'transparent',
  transition: 'all 0.2s ease',
  ':hover': {
    opacity: 0.8,
  },
  marginTop: props.theme.spacing(6),
  marginBottom: props.theme.spacing(6),
}));

const SendButtonContainer = styled.div((props) => ({
  display: 'flex',
  gap: 16,
  paddingBottom: props.theme.spacing(12),
  paddingTop: props.theme.spacing(4),
  marginLeft: '5%',
  marginRight: '5%',
}));

const StyledInputFeedback = styled(InputFeedback)((props) => ({
  ...props.theme.typography.body_s,
  width: 'fit-content',
}));
function SwapScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation('translation', { keyPrefix: 'SWAP_SCREEN' });
  const swap = useSwap();
  const location = useLocation();
  const [selecting, setSelecting] = useState<'from' | 'to'>();
  const [loading, setLoading] = useState(false);
  const { dispatchStep } = useStepperContext();
  const { btcBalance, btcFiatRate, fiatCurrency, coinsList, stxBtcRate, stxBalance } =
    useWalletSelector();
  const handleClickContinue = useCallback(async () => {
    if (swap.submitError || !swap.onSwap) {
      return;
    }
    try {
      setLoading(true);
      await swap.onSwap();
    } finally {
      setLoading(false);
    }
  }, [swap, setLoading]);

  useEffect(() => {
    if (location.state?.coin) {
      swap.onSelectToken(location.state.coin, 'from');
    }
  }, []);

  function getFtFiatEquivalent(coinTicker) {
    const fungibleToken = coinsList?.find((coin) => coin.ticker === coinTicker);
    if (fungibleToken?.tokenFiatRate) {
      const balance = new BigNumber(getFtBalance(fungibleToken));
      const rate = new BigNumber(fungibleToken.tokenFiatRate);
      return balance.multipliedBy(rate).toFixed(2).toString();
    }
    return '';
  }
  const getTokenCurrencyIcon = (token) => {
    switch (token?.name) {
      case 'STX':
        return IconStacks;
      case 'SUSDT':
        return IconUsdt;
      case 'XBTC':
        return IconWbtc;
      case 'XUSD':
        return IconUsdc;
      default:
        return token?.image?.fungibleToken?.image;
    }
  };
  function getFiatEquivalent(coin) {
    switch (coin) {
      case 'STX':
        return microstacksToStx(new BigNumber(stxBalance))
          .multipliedBy(new BigNumber(stxBtcRate))
          .multipliedBy(new BigNumber(btcFiatRate))
          .toFixed(2)
          .toString();
      case 'BTC':
        return satsToBtc(new BigNumber(btcBalance))
          .multipliedBy(new BigNumber(btcFiatRate))
          .toFixed(2)
          .toString();
      default:
        return getFtFiatEquivalent(swap.selectedFromToken?.image.fungibleToken?.ticker);
    }
  }
  const getAccountBalance = (token) => (token?.balance !== undefined ? token.balance : '--');
  const generateContent = () => {
    const contents = [
      {
        name: 'Stacks STX',
        key: 'STX',
        handler: () => {
          swap.onSelectToken('STX', selecting);
          setSelecting(undefined);
        },
      },
    ];
    const visibleCoinList = swap.coinsList.filter((item) => item.visible);
    visibleCoinList.forEach((coin) =>
      contents.push({
        name: `${coin.name} ${coin.ticker}`,
        key: coin.name,
        handler: () => {
          swap.onSelectToken(coin, selecting);
          setSelecting(undefined);
        },
      }),
    );
    return contents;
  };
  return (
    <>
      <OperationHeader
        currency={swap.selectedFromToken?.name}
        currencyIcon={getTokenCurrencyIcon(swap.selectedFromToken)}
        fiatBalance={getFiatEquivalent(swap.selectedFromToken?.name)}
        fiatCurrency={fiatCurrency}
        accountBalance={getAccountBalance(swap.selectedFromToken)}
        operationIcon={SwapIcon}
        operationTitle={t('SWAP')}
      />
      <ScrollContainer>
        <Container>
          <SwapTokenBlock
            title={t('CONVERT')}
            selectedCoin={swap?.selectedFromToken}
            amount={swap.inputAmount}
            error={swap.inputAmountInvalid}
            onAmountChange={swap.onInputAmountChanged}
            onSelectCoin={() => setSelecting('from')}
          />
          {!!swap.submitError && (
            <StyledInputFeedback message={swap.submitError} variant="danger" noIcon />
          )}
          <DownArrowButton onClick={swap.handleClickDownArrow}>
            <img src={DownArrow} alt="swap-token-icon" />
          </DownArrowButton>
          <SwapTokenBlock
            title={t('TO')}
            selectedCoin={swap.selectedToToken}
            onSelectCoin={() => setSelecting('to')}
          />
        </Container>
        <SwapInfoBlock swap={swap} />
      </ScrollContainer>
      {selecting != null && (
        <CoinSwitch
          visible={!!selecting}
          onClose={() => setSelecting(undefined)}
          contents={generateContent()}
        />
      )}
      {/* {selecting != null && (
        <CoinSelectModal
          onSelectStacks={() => {
            swap.onSelectToken('STX', selecting);
          }}
          onClose={() => setSelecting(undefined)}
          onSelectCoin={(coin) => {
            swap.onSelectToken(coin, selecting);
          }}
          visible={!!selecting}
          coins={
            swap.coinsList
            //   .filter((item) =>
            //   ['Wrapped Bitcoin', 'Wrapped USDC', 'Bridged USDT'].includes(item.name),
            // )}
          }
          title={selecting === 'from' ? t('ASSET_TO_CONVERT_FROM') : t('ASSET_TO_CONVERT_TO')}
          loadingWalletData={swap.isLoadingWalletData}
        />
      )} */}
      <SendButtonContainer>
        <ActionButton
          transparent
          text="Cancel"
          onPress={() => {
            navigate('/');
            dispatchStep({ type: 'HOME' });
          }}
        />
        <ActionButton
          disabled={!!swap.submitError || swap.onSwap == null}
          text={t('CONTINUE')}
          processing={loading}
          onPress={handleClickContinue}
        />
      </SendButtonContainer>
    </>
  );
}

export default SwapScreen;
