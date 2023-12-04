/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
import BarLoader from '@components/barLoader';
import { animated, useSpring } from '@react-spring/web';
import { microstacksToStx, satsToBtc } from '@secretkeylabs/xverse-core';
import { currencySymbolMap } from '@secretkeylabs/xverse-core/types/currency';
import { StoreState } from '@stores/index';
import { useStepperContext } from '@stores/stepper';
import { CurrencyTypes, LoaderSize } from '@utils/constants';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NumericFormat } from 'react-number-format';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import styled from 'styled-components';

const RowContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginTop: props.theme.spacing(11),
}));

const BalanceHeadingText = styled.h1((props) => ({
  ...props.theme.headline_category_s,
  fontSize: 18,
  fontWeight: 700,
  fontFamily: 'MontRegular',
  color: props.theme.colors.dashboard.text,
}));

const CurrencyText = styled.h1((props) => ({
  ...props.theme.headline_category_s,
  color: props.theme.colors.white['0'],
  marginTop: '1px',
  fontSize: 12,
}));

const BalanceAmountContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const BalanceAmountText = styled.h1((props) => ({
  ...props.theme.headline_xl,
  fontSize: 40,
  color: props.theme.colors.white['0'],
}));

const BarLoaderContainer = styled.div((props) => ({
  display: 'flex',
  maxWidth: 300,
  height: 56,
}));

const CurrencyCard = styled.div((props) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: props.theme.colors.background.modalBackdrop,
  width: 45,
  borderRadius: 30,
  marginLeft: props.theme.spacing(4),
}));

interface BalanceCardProps {
  icon?: any;
  isLoading: boolean;
}
type Token = {
  coin: CurrencyTypes | undefined;
  ft?: string | undefined;
  brc20Ft?: string | Boolean;
};

function BalanceCard(props: BalanceCardProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'DASHBOARD_SCREEN' });
  const { fiatCurrency, btcFiatRate, stxBtcRate, stxBalance, btcBalance, coinsList, brcCoinsList } =
    useSelector((state: StoreState) => state.walletState);
  const { isLoading, icon } = props;
  const [style, api] = useSpring(
    () => ({
      from: { opacity: 0, transform: 'translate3d(100%,0,0)' },
      to: { opacity: 1, transform: 'translate3d(0%,0,0)' },
    }),
    [],
  );
  function calculateTotalBalance() {
    const stxFiatEquiv = microstacksToStx(new BigNumber(stxBalance))
      .multipliedBy(new BigNumber(stxBtcRate))
      .multipliedBy(new BigNumber(btcFiatRate));
    const btcFiatEquiv = satsToBtc(new BigNumber(btcBalance)).multipliedBy(
      new BigNumber(btcFiatRate),
    );
    const totalBalance = stxFiatEquiv.plus(btcFiatEquiv);
    return totalBalance.toNumber().toFixed(2);
  }
  const {
    state: { currentActiveIndex },
    dispatchStep,
  } = useStepperContext();
  const [stepsData, setStepsData] = useState(['HOME', 'BTC', 'STX']);
  const navigate = useNavigate();

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

  const handlers = useSwipeable({
    onSwiped: ({ event }) => {
      event.stopPropagation();
      handleNextDashboard();
    },
    trackMouse: true,
  });
  return (
    <animated.div {...handlers} style={style}>
      <RowContainer>
        <BalanceHeadingText>{t('TOTAL_BALANCE')}</BalanceHeadingText>
        <CurrencyCard>
          <CurrencyText>{fiatCurrency}</CurrencyText>
        </CurrencyCard>
      </RowContainer>
      {isLoading ? (
        <BarLoaderContainer>
          <BarLoader loaderSize={LoaderSize.LARGE} forDashboard />
        </BarLoaderContainer>
      ) : (
        <BalanceAmountContainer>
          {icon && <img src={icon} alt="Balance-icon" />}
          <BalanceAmountText>
            <NumericFormat
              value={calculateTotalBalance()}
              displayType="text"
              prefix={`${currencySymbolMap[fiatCurrency]}`}
              thousandSeparator
              renderText={(value: string) => <BalanceAmountText>{value}</BalanceAmountText>}
            />
          </BalanceAmountText>
        </BalanceAmountContainer>
      )}
    </animated.div>
  );
}

export default BalanceCard;
