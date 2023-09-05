import { useStepperContext } from '@stores/stepper';
import { CurrencyTypes } from '@utils/constants';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useWalletSelector from '@hooks/useWalletSelector';
import styled from 'styled-components';
import Stepper from '@components/steps2';

const StepperContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: props.theme.spacing(8),
}));
type Token = {
  coin: CurrencyTypes | undefined;
  ft?: string | undefined;
  brc20Ft?: string | Boolean;
};
function StepperNavigator() {
  const {
    state: { currentActiveIndex },
    dispatchStep,
  } = useStepperContext();
  const navigate = useNavigate();
  const [stepsData, setStepsData] = useState(['HOME', 'BTC', 'STX']);
  const { coinsList, brcCoinsList } = useWalletSelector();

  useEffect(() => {
    const userSelectedCoins: any = coinsList?.filter((ft) => ft.visible).map((coin) => coin.ticker);
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

  const handleNextDashboard = (e: { preventDefault: () => void }) => {
    e.preventDefault();
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
          const fungibleToken = coinsList?.find(
            (item) => item.ticker === stepsData[currentActiveIndex + 1],
          );
          if (fungibleToken) {
            token.coin = 'FT';
            token.ft = fungibleToken.principal;
            token.brc20Ft = !fungibleToken?.principal && fungibleToken?.name;
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
  return (
    <StepperContainer>
      <Stepper
        data={stepsData}
        activeIndex={currentActiveIndex}
        width={80}
        onClick={handleNextDashboard}
      />
    </StepperContainer>
  );
}
export default StepperNavigator;
