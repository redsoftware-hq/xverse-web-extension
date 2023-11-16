import styled, { useTheme } from 'styled-components';
import TickIcon from '@assets/img/settings/tick.svg';
import { SupportedCurrency } from '@secretkeylabs/xverse-core/types';
import { Currency } from '../../../utils/currency';

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
  paddingBottom: props.theme.spacing(10),
  paddingTop: props.theme.spacing(10),
}));

const Text = styled.h1<TitleProps>((props) => ({
  ...props.theme.body_medium_m,
  color: props.color,
  fontFamily:'MontRegular',
  flex: 1,
  textAlign: 'left',
  marginLeft: props.theme.spacing(6),
}));

interface Props {
  currency: Currency;
  isSelected: boolean;
  onCurrencySelected: (abbr: SupportedCurrency) => void;
  showDivider: boolean;
}

function CurrencyRow({ currency, isSelected, onCurrencySelected, showDivider }: Props) {
  const onClick = () => {
    onCurrencySelected(currency.name);
  };
  return (
    <Button onClick={onClick} border={showDivider ? '1px solid rgb(76,81,135,0.3)' : 'transparent'}>
      {/* <img src={currency.flag} alt="flag" /> */}
      <Text color={isSelected ? '#E12828' : 'white'}>
        {currency.name}
      </Text>
    </Button>
  );
}

export default CurrencyRow;
