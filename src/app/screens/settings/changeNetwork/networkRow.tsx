import TickIcon from '@assets/img/settings/tick.svg';
import type { SettingsNetwork } from '@secretkeylabs/xverse-core';
import styled, { useTheme } from 'styled-components';

interface TitleProps {
  color: string;
}

interface ButtonProps {
  border: string;
}

const Button = styled.button<ButtonProps>((props) => ({
  display: 'flex',
  flexDirection: 'row',
  padding: '16px 32px 16px 24px;',
  justifyContent: 'space-between',
  gap: props.theme.spacing(8),
  alignItems: 'center',
  borderRadius: props.theme.radius(1),
  border: '1px solid rgba(168, 185, 244, 0.20)',
  background:
    'radial-gradient(489.09% 91.61% at 89.79% 22.85%, rgba(56, 60, 78, 0.20) 0%, rgba(13, 14, 18, 0.20) 100%)',
  marginTop: props.theme.spacing(6),  
  marginBottom: props.theme.spacing(6),  
}));

const Text = styled.h1<TitleProps>((props) => ({
  ...props.theme.body_medium_m,
  color: props.color,
  flex: 1,
  textAlign: 'left',
}));

interface Props {
  network: SettingsNetwork;
  isSelected: boolean;
  onNetworkSelected: (network: SettingsNetwork) => void;
  showDivider: boolean;
}

function NetworkRow({ network, isSelected, onNetworkSelected, showDivider }: Props) {
  const theme = useTheme();
  const onClick = () => {
    onNetworkSelected(network);
  };

  return (
    <Button onClick={onClick} border={showDivider ? '1px solid rgb(76,81,135,0.3)' : 'transparent'}>
      <Text color={isSelected ? theme.colors.white_0 : theme.colors.white_200}>{network.type}</Text>
      {isSelected && <img src={TickIcon} alt="tick" />}
    </Button>
  );
}

export default NetworkRow;
