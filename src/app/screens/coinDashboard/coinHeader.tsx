/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
import { useSwipeable } from 'react-swipeable';
import TokenImage from '@components/tokenImage';
import Receive from '@assets/img/dashboard/recieve.svg';
import Send from '@assets/img/dashboard/send.svg';
import Lock from '@assets/img/transactions/Lock.svg';
import Buy from '@assets/img/dashboard/buy.svg';
import SwapCoin from '@assets/img/dashboard/convert_coin.svg';
import { useStepperContext } from '@stores/stepper';
import { useState, useEffect } from 'react';
import useWalletSelector from '@hooks/useWalletSelector';
import { FungibleToken, microstacksToStx, satsToBtc } from '@secretkeylabs/xverse-core';
import { currencySymbolMap } from '@secretkeylabs/xverse-core/types/currency';
import BigNumber from 'bignumber.js';
import { NumericFormat } from 'react-number-format';
import styled from 'styled-components';
import { CurrencyTypes } from '@utils/constants';
import { getFtBalance, getFtTicker } from '@utils/tokens';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SmallActionButton from '@components/smallActionButton';
import { animated, useSpring, useSprings, useTransition } from '@react-spring/web';

interface CoinBalanceProps {
  coin: CurrencyTypes;
  fungibleToken?: FungibleToken;
}

const Container = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: props.theme.spacing(10),
  paddingRight: props.theme.spacing(10),
}));

const RowContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'right',
  alignItems: 'center',
  marginTop: props.theme.spacing(11),
  ...props.theme.headline_category_s,
  fontSize: 18,
  fontWeight: 700,
  fontFamily: 'MontRegular',
  color: props.theme.colors.dashboard.text,
}));

const ProtocolText = styled.p((props) => ({
  ...props.theme.headline_category_s,
  fontWeight: '700',
  height: 15,
  marginTop: 6,
  textTransform: 'uppercase',
  marginLeft: props.theme.spacing(2),
  backgroundColor: props.theme.colors.white['400'],
  padding: '1px 6px 1px',
  color: props.theme.colors.background.elevation0,
  borderRadius: props.theme.radius(2),
}));

const BalanceInfoContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: props.theme.radius(2),
  background: props.theme.colors.action.classic,
  justifyContent: 'space-between',
  paddingLeft: props.theme.spacing(12),
  paddingBottom: props.theme.spacing(9),
  paddingRight: props.theme.spacing(12),
}));

const BalanceValuesContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const CoinBalanceText = styled.h1((props) => ({
  ...props.theme.headline_l,
  ...props.theme.headline_xl,
  color: props.theme.colors.white['0'],
  textAlign: 'center',
}));

const FiatAmountText = styled.h1((props) => ({
  ...props.theme.headline_category_s,
  color: props.theme.colors.white['200'],
  fontSize: 14,
  marginTop: props.theme.spacing(2),
  textAlign: 'center',
}));

const BalanceTitleText = styled.h1((props) => ({
  ...props.theme.body_medium_m,
  fontSize: 18,
  color: props.theme.colors.dashboard.text,
  textAlign: 'center',
  // marginTop: props.theme.spacing(4),
}));

const RowButtonContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: props.theme.spacing(10),
}));

const ButtonContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  marginRight: props.theme.spacing(10),
}));

const RecieveButtonContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const HeaderSeparator = styled.div((props) => ({
  border: `0.5px solid ${props.theme.colors.white[400]}`,
  width: '50%',
  alignSelf: 'center',
  marginTop: props.theme.spacing(8),
  marginBottom: props.theme.spacing(8),
}));

const StxLockedText = styled.p((props) => ({
  ...props.theme.body_medium_m,
}));

const LockedStxContainer = styled.div((props) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  span: {
    color: props.theme.colors.white[400],
    marginRight: props.theme.spacing(3),
  },
  img: {
    marginRight: props.theme.spacing(3),
  },
}));

const AvailableStxContainer = styled.div((props) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: props.theme.spacing(4),
  span: {
    color: props.theme.colors.white[400],
    marginRight: props.theme.spacing(3),
  },
}));

const StacksLockedInfoText = styled.span((props) => ({
  ...props.theme.body_medium_m,
  color: props.theme.colors.white[400],
  textAlign: 'left',
}));
const CurrencyCard = styled.div((props) => ({
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: props.theme.colors.background.modalBackdrop,
  width: 45,
  borderRadius: 30,
  marginLeft: props.theme.spacing(4),
}));
const CurrencyText = styled.h1((props) => ({
  ...props.theme.headline_category_s,
  color: props.theme.colors.white['0'],
  fontSize: 13,
}));

type Token = {
  coin: CurrencyTypes | undefined;
  ft?: string | undefined;
  brc20Ft?: string | Boolean;
};

export default function CoinHeader(props: CoinBalanceProps) {
  const { coin, fungibleToken } = props;
  const {
    btcBalance,
    stxBalance,
    fiatCurrency,
    stxBtcRate,
    btcFiatRate,
    stxLockedBalance,
    stxAvailableBalance,
    coinsList,
    brcCoinsList,
  } = useWalletSelector();
  const navigate = useNavigate();
  const { t } = useTranslation('translation', { keyPrefix: 'COIN_DASHBOARD_SCREEN' });
  const {
    state: { currentActiveIndex },
    dispatchStep,
  } = useStepperContext();

  const [stepsData, setStepsData] = useState(['HOME', 'BTC', 'STX']);
  useEffect(() => {
    const userSelectedCoins: any = coinsList
      ?.filter((ft) => ft.visible)
      .map((coinname) => coinname.ticker);
    if (userSelectedCoins?.length !== 0) {
      setStepsData(['HOME', 'BTC', 'STX'].concat(userSelectedCoins));
    }
  }, []);

  const handleTokenPressed = (token: Token) => {
    if (token.brc20Ft) {
      navigate(`/coinDashboard/${token.coin}?brc20ft=${token.brc20Ft}`);
    } else {
      navigate(`/coinDashboard/${token.coin}?ft=${token.ft}`);
    }
  };
  const goToNextStep = () => {
    dispatchStep({ type: 'NEXT_STEP' });
  };

  const goToHome = () => {
    dispatchStep({ type: 'HOME' });
  };

  const handleNextDashboard = () => {
    const token: Token = {
      coin: undefined,
      ft: undefined,
      brc20Ft: false,
    };
    if (currentActiveIndex < stepsData.length - 1) {
      switch (stepsData[currentActiveIndex + 1]) {
        case 'BTC':
          token.coin = 'BTC' as CurrencyTypes;
          token.ft = undefined;
          token.brc20Ft = false;
          break;
        case 'STX':
          token.coin = 'STX' as CurrencyTypes;
          token.ft = undefined;
          token.brc20Ft = false;
          break;
        default: {
          const ft = coinsList?.find((item) => item.ticker === stepsData[currentActiveIndex + 1]);
          if (ft) {
            token.coin = 'FT';
            token.ft = ft.principal;
            token.brc20Ft = !ft?.principal && ft?.name;
          }
          break;
        }
      }
      handleTokenPressed(token);
      goToNextStep();
    } else {
      goToHome();
      navigate('/');
    }
  };

  const transitions = useTransition(currentActiveIndex, {
    from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
    enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    leave: { opacity: 0, transform: 'translate3d(-50%,0,0)' },
    exitBeforeEnter: true,
  });

  const handlers = useSwipeable({
    onSwiped: ({ event }) => {
      event.stopPropagation();
      handleNextDashboard();
    },
    trackMouse: true,
  });

  function getBalanceAmount() {
    switch (coin) {
      case 'STX':
        return microstacksToStx(new BigNumber(stxBalance)).toString();
      case 'BTC':
        return satsToBtc(new BigNumber(btcBalance)).toString();
      default:
        return fungibleToken ? getFtBalance(fungibleToken) : '';
    }
  }

  function getFtFiatEquivalent() {
    if (fungibleToken?.tokenFiatRate) {
      const balance = new BigNumber(getFtBalance(fungibleToken));
      const rate = new BigNumber(fungibleToken.tokenFiatRate);
      return balance.multipliedBy(rate).toFixed(2).toString();
    }
    return '';
  }

  const getTokenTicker = () => {
    if (coin === 'STX' || coin === 'BTC') {
      return coin;
    }
    if (coin === 'FT' && fungibleToken) {
      return getFtTicker(fungibleToken);
    }
    return '';
  };

  function getFiatEquivalent() {
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
      case 'FT':
        return getFtFiatEquivalent();
      default:
        return '';
    }
  }

  const renderStackingBalances = () => {
    if (stxLockedBalance && !new BigNumber(stxLockedBalance).eq(0, 10) && coin === 'STX') {
      return (
        <>
          <HeaderSeparator />
          <Container>
            <LockedStxContainer>
              <img src={Lock} alt="locked" />
              <StacksLockedInfoText>{t('STX_LOCKED_BALANCE_PREFIX')}</StacksLockedInfoText>
              <NumericFormat
                value={microstacksToStx(new BigNumber(stxLockedBalance)).toString()}
                displayType="text"
                thousandSeparator
                renderText={(value: string) => <StxLockedText>{`${value} STX`}</StxLockedText>}
              />
            </LockedStxContainer>
            <AvailableStxContainer>
              <StacksLockedInfoText>{t('STX_AVAILABLE_BALANCE_PREFIX')}</StacksLockedInfoText>
              <NumericFormat
                value={microstacksToStx(new BigNumber(stxAvailableBalance)).toString()}
                displayType="text"
                thousandSeparator
                renderText={(value: string) => <StxLockedText>{`${value} STX`}</StxLockedText>}
              />
            </AvailableStxContainer>
          </Container>
        </>
      );
    }
  };

  const goToSendScreen = () => {
    if (coin === 'STX' || coin === 'BTC') {
      navigate(`/send-${coin}`);
    } else if (coin === 'FT') {
      navigate('/send-ft', {
        state: {
          fungibleToken,
        },
      });
    } else if (coin === 'brc20') {
      navigate('/send-brc20', {
        state: {
          fungibleToken,
        },
      });
    }
  };

  const getDashboardTitle = () => {
    if (fungibleToken) {
      return `${t('BALANCE')} ${getFtTicker(fungibleToken)}`;
    }
    if (coin) {
      return `${t('BALANCE')}`;
    }
    return '';
  };

  return transitions((style, i) => (
    <animated.div {...handlers} style={style}>
      <Container>
        <BalanceInfoContainer>
          <RowContainer>
            <BalanceTitleText>{getDashboardTitle()}</BalanceTitleText>
            {coin !== 'brc20' && (
              <CurrencyCard>
                <CurrencyText>{coin}</CurrencyText>
              </CurrencyCard>
            )}
            {coin === 'brc20' && <ProtocolText>BRC-20</ProtocolText>}
          </RowContainer>
          <BalanceValuesContainer>
            <TokenImage
              token={coin || undefined}
              loading={false}
              fungibleToken={fungibleToken || undefined}
            />
            <NumericFormat
              value={getBalanceAmount()}
              displayType="text"
              thousandSeparator
              renderText={(value: string) => (
                <CoinBalanceText>{`${Number(value).toFixed(4)}`}</CoinBalanceText>
              )}
            />
            {/* <NumericFormat
            value={getFiatEquivalent()}
            displayType="text"
            thousandSeparator
            prefix={`${currencySymbolMap[fiatCurrency]} `}
            suffix={` ${fiatCurrency}`}
            renderText={(value) => <FiatAmountText>{value}</FiatAmountText>}
          /> */}
          </BalanceValuesContainer>
          <RowButtonContainer>
            <ButtonContainer>
              <SmallActionButton isOpaque isRound src={Send} onPress={() => goToSendScreen()} />
            </ButtonContainer>

            {!fungibleToken ? (
              <>
                <ButtonContainer>
                  <SmallActionButton
                    isOpaque
                    isRound
                    src={Receive}
                    onPress={() => navigate(`/receive/${coin}`)}
                  />
                </ButtonContainer>
                <ButtonContainer>
                  <SmallActionButton
                    isOpaque
                    isRound
                    src={Buy}
                    onPress={() => navigate(`/buy/${coin}`)}
                  />
                </ButtonContainer>
              </>
            ) : (
              <>
                <ButtonContainer>
                  <SmallActionButton
                    isOpaque
                    isRound
                    src={Receive}
                    onPress={() => navigate(coin === 'brc20' ? '/receive/ORD' : `/receive/${coin}`)}
                  />
                </ButtonContainer>
                <ButtonContainer>
                  <SmallActionButton
                    isOpaque
                    isRound
                    src={Buy}
                    onPress={() => navigate(`/buy/${stepsData[currentActiveIndex]}`)}
                  />
                </ButtonContainer>
              </>
            )}

            <ButtonContainer>
              <SmallActionButton
                isOpaque
                isRound
                src={SwapCoin}
                onPress={() => console.log('transfer')}
              />
            </ButtonContainer>
          </RowButtonContainer>
        </BalanceInfoContainer>
        {renderStackingBalances()}
      </Container>
    </animated.div>
  ));
}
