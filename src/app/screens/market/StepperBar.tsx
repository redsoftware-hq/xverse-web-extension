import styled from 'styled-components';
import NextIcon from '@assets/img/dashboard/caret-right-solid.svg';
import PrevIcon from '@assets/img/dashboard/caret-left-solid.svg';
import Stepper from '@components/steps2';

const StepperContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
}));

const Button = styled.button((props) => ({
  diisplay: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'none',
}));

function StepperBar({stepsData, currentActiveIndex, setCurentActiveIndex}: any) {

  const handlePreviousDashboard = (e) => {
    e.preventDefault();
    if(currentActiveIndex === 1) setCurentActiveIndex(0);
  };

  const handleNextDashboard = (e) => {
    e.preventDefault();
    setCurentActiveIndex(currentActiveIndex === 0 ? currentActiveIndex + 1 : 0);
  };
  return (
    <StepperContainer>
      <Button type="button" onClick={handlePreviousDashboard}>
        <img src={PrevIcon} alt="previous-page" />
      </Button>
      <Stepper data={stepsData} activeIndex={currentActiveIndex} width={40} />
      <Button type="button" onClick={handleNextDashboard}>
        <img src={NextIcon} alt="next-page" />
      </Button>
    </StepperContainer>
  );
}
export default StepperBar;
