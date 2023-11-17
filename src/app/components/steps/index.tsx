import styled from 'styled-components';

const StepsContainer = styled.div<{withLabel?:boolean}>((props) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: props.withLabel ? props.theme.colors.background.elevation0_5: "transparent",
  height: 40,
  borderRadius: props.theme.spacing(4),
  paddingLeft: props.theme.spacing(8),
  paddingRight: props.theme.spacing(8),
}));

const StepsLine = styled.div<StepLineProps>((props) => ({
  width: props.steps * 20,
  borderRadius: 2,
  background: `linear-gradient(to right, ${props.theme.colors.action.classic} ${props.fill}%, ${ props.withLabel ? props.theme.colors.background.elevation0 : props.theme.colors.background.elevation2} ${props.fill}%)`,
  display: 'flex',
  height: 4,
}));

const Label = styled.div((props) => ({
  ...props.theme.bold_tile_text,
  fontSize: 14,
  color: props.theme.colors.white[0],
  width: 100,
}));

interface StepsProps {
  data?: any[];
  activeIndex: number;
  withLabel?: boolean;
}

interface StepLineProps {
  active: number;
  steps: number;
  fill: number;
  withLabel?: boolean;
}

export default function Steps(props: StepsProps): JSX.Element {
  const { data, activeIndex, withLabel } = props;
  return (
    <StepsContainer withLabel={withLabel}>
      {withLabel && <Label>{`Step ${activeIndex + 1}`}</Label>}
      {data && data.length ? <StepsLine active={activeIndex + 1} steps={data.length} fill={(activeIndex + 1 ) * 100 / data.length } withLabel={withLabel}/> : null}
    </StepsContainer>
  );
}
