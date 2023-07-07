import { StoreState } from '@stores/index';
import { useSelector } from 'react-redux';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';
import { microstacksToStx, satsToBtc } from '@secretkeylabs/xverse-core/currency';
import { NumericFormat } from 'react-number-format';
import BarLoader from '@components/barLoader';
import { LoaderSize } from '@utils/constants';
import { currencySymbolMap } from '@secretkeylabs/xverse-core/types/currency';
import { useTranslation } from 'react-i18next';

const RowContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  marginTop: props.theme.spacing(11),
}));

const BalanceHeadingText = styled.h1((props) => ({
  ...props.theme.headline_category_s,
  fontFamily: 'MontRegular',
  color: props.theme.colors.dashboard.text,
  textTransform: 'uppercase',
}));

const CurrencyText = styled.h1((props) => ({
  ...props.theme.headline_category_s,
  color: props.theme.colors.white['0'],
  fontSize: 13,
}));

const BalanceAmountContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent:'space-between',
  alignItems: 'center',
}));

const BalanceAmountText = styled.h1((props) => ({
  ...props.theme.headline_xl,
  color: props.theme.colors.white['0'],
}));

const BarLoaderContainer = styled.div((props) => ({
  display: 'flex',
  maxWidth: 300,
  marginTop: props.theme.spacing(5),
}));

const CurrencyCard = styled.div((props) => ({
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: props.theme.colors.background.modalBackdrop,
  width: 45,
  borderRadius: 30,
  marginLeft: props.theme.spacing(4),
}));

interface BalanceCardProps {
  icon?: any;
  isLoading: boolean;
}

function BalanceCard(props: BalanceCardProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'DASHBOARD_SCREEN' });
  const { fiatCurrency, btcFiatRate, stxBtcRate, stxBalance, btcBalance } = useSelector(
    (state: StoreState) => state.walletState,
  );
  const { isLoading, icon } = props;

  function calculateTotalBalance() {
    const stxFiatEquiv = microstacksToStx(new BigNumber(stxBalance))
      .multipliedBy(new BigNumber(stxBtcRate))
      .multipliedBy(new BigNumber(btcFiatRate));
    const btcFiatEquiv = satsToBtc(new BigNumber(btcBalance)).multipliedBy(
      new BigNumber(btcFiatRate),
    );
    const totalBalance = stxFiatEquiv.plus(btcFiatEquiv);
    return totalBalance.toNumber().toFixed(2);
  }

  return (
    <>
      <RowContainer>
        <BalanceHeadingText>{t('TOTAL_BALANCE')}</BalanceHeadingText>
        <CurrencyCard>
          <CurrencyText>{fiatCurrency}</CurrencyText>
        </CurrencyCard>
      </RowContainer>
      {isLoading ? (
        <BarLoaderContainer>
          <BarLoader loaderSize={LoaderSize.LARGE} />
        </BarLoaderContainer>
      ) : (
        <BalanceAmountContainer>
          {icon && <img src={icon} alt="Balance-icon" />}
          <BalanceAmountText>
            <NumericFormat
              value={calculateTotalBalance()}
              displayType="text"
              prefix={`${currencySymbolMap[fiatCurrency]}`}
              thousandSeparator
              renderText={(value: string) => <BalanceAmountText>{value}</BalanceAmountText>}
            />
          </BalanceAmountText>
        </BalanceAmountContainer>
      )}
    </>
  );
}

export default BalanceCard;
