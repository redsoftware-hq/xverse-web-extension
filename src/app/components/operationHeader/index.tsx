import WalletIcon from '@assets/img/dashboard/Wallet.svg';
import { currencySymbolMap } from '@secretkeylabs/xverse-core/types/currency';
import styled from 'styled-components';

interface Props {
  accountBalance: any;
  fiatCurrency: any;
  fiatBalance: any;
  currencyIcon: any;
  currency: string | undefined;
  operationTitle: string;
  operationIcon: any;
}

const Container = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
}));
const Icon = styled.img<{ width?: number; height?: number }>((props) => ({
  width: props?.width ? props.width : 36,
  height: props?.height ? props.height : 36,
}));
const AccountBalanceContainer = styled.div((props) => ({
  display: 'flex',
  gap: 4,
  alignItems: 'center',
}));
const Operation = styled.div((props) => ({
  display: 'flex',
  gap: 4,
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingLeft: props.theme.spacing(10),
  paddingRight: props.theme.spacing(10),
  paddingBottom: props.theme.spacing(6),
}));
const BalanceContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  alignItems: 'flex-start',
}));
const Balance = styled.div((props) => ({
  display: 'flex',
  background: props.theme.colors.action.classic,
  justifyContent: 'space-between',
  paddingTop: props.theme.spacing(6),
  paddingLeft: props.theme.spacing(10),
  paddingRight: props.theme.spacing(10),
  paddingBottom: props.theme.spacing(6),
  alignItems: 'center',
}));
const AccountBalance = styled.h2((props) => ({
  ...props.theme.headline_m,
  color: props.theme.colors.white_0,
  lineHeight: '24px',
}));
const OperationTitle = styled.h1((props) => ({
  ...props.theme.mont_tile_text,
  color: props.theme.colors.action.classic,
  lineHeight: '24px',
}));
const FiatBalance = styled.h3((props) => ({
  ...props.theme.body_m,
  color: props.theme.colors.white_0,
  lineHeight: '16px',
}));
const Pill = styled.div((props) => ({
  ...props.theme.body_xs,
  borderRadius: 15,
  padding: '1px 6px',
  background: 'rgba(0, 0, 0, 0.40)',
  textAlign: 'center',
}));
export default function OperationHeader({
  accountBalance,
  fiatCurrency,
  fiatBalance,
  currencyIcon,
  currency,
  operationIcon,
  operationTitle,
}: Props) {
  return (
    <Container>
      <Balance>
        <BalanceContainer>
          <AccountBalanceContainer>
            <AccountBalance>{accountBalance}</AccountBalance>
            {currency && <Pill>{currency}</Pill>}
          </AccountBalanceContainer>
          {!fiatBalance && <FiatBalance>--</FiatBalance>}
          {fiatBalance && (
            <FiatBalance>{`${currencySymbolMap[fiatCurrency]}${fiatBalance}`}</FiatBalance>
          )}
        </BalanceContainer>
        {currencyIcon && <Icon src={currencyIcon} />}
        {!currencyIcon && <Icon src={WalletIcon} />}
      </Balance>
      <Operation>
        <OperationTitle>{operationTitle}</OperationTitle>
        <Icon src={operationIcon} width={40} height={40} />
      </Operation>
    </Container>
  );
}
