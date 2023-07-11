import Steps from '@components/steps';
import { useStepperContext } from '@stores/stepper';
import { CurrencyTypes } from '@utils/constants';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import NextIcon from '@assets/img/dashboard/caret-right-solid.svg';
import PrevIcon from '@assets/img/dashboard/caret-left-solid.svg';

const StepperContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: props.theme.spacing(6),
  marginBottom: props.theme.spacing(6),
}));

const Button = styled.button((props) => ({
  diisplay: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'none',
}));

function StepperNavigator() {
  const {
    state: { currentActiveIndex },
    dispatchStep,
  } = useStepperContext();
  const navigate = useNavigate();
  const stepsData = ['BTC', 'STX'];

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
  const goToPreviousStep = () => {
    dispatchStep({ type: 'PREV_STEP' });
  };

  const goToNextStep = () => {
    dispatchStep({ type: 'NEXT_STEP' });
  };

  const goToHome = () => {
    dispatchStep({ type: 'HOME' });
  };

  const handlePreviousDashboard = () => {
    goToPreviousStep();
    navigate(-1);
  };

  const handleNextDashboard = () => {
    goToNextStep();
    if (currentActiveIndex === 0) {
      handleTokenPressed({
        coin: stepsData[0] as CurrencyTypes,
      });
    }
    if (currentActiveIndex === 1) {
      handleTokenPressed({
        coin: stepsData[1] as CurrencyTypes,
      });
    }
    if (currentActiveIndex > 1) {
      goToHome();
      navigate('/');
    }
  };
  return (
    <StepperContainer>
      <Button type="button" onClick={handlePreviousDashboard}>
        <img src={PrevIcon} alt="previous-page" />
      </Button>
      <Steps data={stepsData} activeIndex={currentActiveIndex} />
      <Button type="button" onClick={handleNextDashboard}>
        <img src={NextIcon} alt="next-page" />
      </Button>
    </StepperContainer>
  );
}
export default StepperNavigator;
