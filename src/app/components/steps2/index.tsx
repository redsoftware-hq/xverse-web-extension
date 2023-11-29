/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
import styled from 'styled-components';

interface StepperProps {
  data: any[];
  activeIndex: number;
  width: number;
  onClick: (e: any, i: number) => void;
}

const Step = styled.div<{ isCurrentStep: boolean; length: number; index: number }>`
  width: ${(props) => `${100 / props.length}%`};
  height: 4px;
  background-color: ${(props) => (props.isCurrentStep ? '#D23403' : '#272A44')};
  border-radius: ${(props) =>
    props.isCurrentStep
      ? '20px'
      : props.index === 0
      ? '20px 0 0 20px'
      : props.index === props.length - 1
      ? '0 20px 20px 0'
      : '0'};
`;

const StepperLine = styled.div<{ width: number }>`
  display: flex;
  width: ${(props) => props.width}px;
  border-radius: 20px;
  align-items: center;
  padding: 0 8px;
  cursor: pointer;
`;

function Stepper({ data, activeIndex, width, onClick }: StepperProps) {
  return (
    <StepperLine width={width}>
      {data.map((_, i) => (
        <Step
          key={i}
          isCurrentStep={i === activeIndex}
          index={i}
          length={data.length}
          onClick={(e) => onClick(e, i)}
        />
      ))}
    </StepperLine>
  );
}

export default Stepper;
