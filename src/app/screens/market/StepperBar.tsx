import styled from 'styled-components';
import Stepper from '@components/steps2';

const StepperContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: props.theme.spacing(8),
}));

function StepperBar({stepsData, currentActiveIndex, setCurentActiveIndex}: any) {

  const handleNextDashboard = (e) => {
    e.preventDefault();
    setCurentActiveIndex(currentActiveIndex === 0 ? currentActiveIndex + 1 : 0);
  };
  return (
    <StepperContainer>
      <Stepper data={stepsData} activeIndex={currentActiveIndex} width={60} onClick={handleNextDashboard}/>
    </StepperContainer>
  );
}
export default StepperBar;
