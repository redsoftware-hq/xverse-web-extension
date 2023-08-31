import styled, { useTheme } from 'styled-components';
import Switch from 'react-switch';

const CustomSwitch = styled(Switch)`
  .react-switch-handle {
    background-color: ${({ checked }) =>
      checked ? '#E12828  ' : 'rgba(210, 52, 3, 0.20)'} !important;
    border: ${({ checked }) => (checked ? '' : '1px solid #D23403')} !important;
    border-radius: 15px;
  }
  .react-switch-bg {
    background-color: rgba(210, 52, 3, 0.2);
  }
`;

interface CustomSwitchSliderProps {
  id?:string;
  toggleValue?: boolean;
  toggleFunction: () => void;
}

function CustomSwitchSlider({ id,toggleValue, toggleFunction }: CustomSwitchSliderProps) {
  const theme = useTheme();

  return (
    <CustomSwitch
      id={id}
      onColor={theme.colors.background.sliderBg}
      offColor={theme.colors.background.sliderBg}
      onChange={toggleFunction}
      checked={toggleValue ?? false}
      uncheckedIcon={false}
      checkedIcon={false}
    />
  );
}

export default CustomSwitchSlider;
