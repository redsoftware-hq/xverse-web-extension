import BarLoader from '@components/barLoader';
import useWalletSelector from '@hooks/useWalletSelector';
import { microstacksToStx, satsToBtc } from '@secretkeylabs/xverse-core/currency';
import { currencySymbolMap } from '@secretkeylabs/xverse-core/types/currency';
import { LoaderSize } from '@utils/constants';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { NumericFormat } from 'react-number-format';
import { MoonLoader } from 'react-spinners';
import styled from 'styled-components';

const RowContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginTop: props.theme.spacing(11),
}));

const BalanceHeadingText = styled.h3((props) => ({
  ...props.theme.headline_category_s,
   fontSize: 18,
  fontWeight: 700,
  fontFamily: 'MontRegular',
  color: props.theme.colors.dashboard.text,
}));

const CurrencyText = styled.label((props) => ({
  ...props.theme.headline_category_s,
  color: props.theme.colors.white_0,
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
  fontSize: 40,
  color: props.theme.colors.white['0'],
}));

const BarLoaderContainer = styled.div((props) => ({
  display: 'flex',
  maxWidth: 300,
  height: 56,
}));

const CurrencyCard = styled.div((props) => ({
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: props.theme.colors.background.modalBackdrop,
  width: 45,
  borderRadius: 30,
  marginLeft: props.theme.spacing(4),
}));

const BalanceContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'flex-end',
  gap: props.theme.spacing(5),
}));

const ReloadContainer = styled.div({
  marginBottom: 11,
});

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
    let totalBalance = new BigNumber(0);
    if (stxAddress) {
      const stxFiatEquiv = microstacksToStx(new BigNumber(stxBalance))
        .multipliedBy(new BigNumber(stxBtcRate))
        .multipliedBy(new BigNumber(btcFiatRate));
      totalBalance = totalBalance.plus(stxFiatEquiv);
    }
    if (btcAddress) {
      const btcFiatEquiv = satsToBtc(new BigNumber(btcBalance)).multipliedBy(
        new BigNumber(btcFiatRate),
      );
      totalBalance = totalBalance.plus(btcFiatEquiv);
    }
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
          <BarLoader loaderSize={LoaderSize.LARGE} forDashboard/>
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
