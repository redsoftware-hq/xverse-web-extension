import Arrows from '@assets/img/send/Arrows.svg';
import { currencySymbolMap } from '@secretkeylabs/xverse-core/types/currency';
import { useTranslation } from 'react-i18next';
import { NumericFormat } from 'react-number-format';
import styled from 'styled-components';

const RowContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
});

const SubText = styled.h1((props) => ({
  ...props.theme.body_xs,
  display: 'flex',
  flex: 1,
  color: props.theme.colors.white_400,
}));

const SwitchToFiatButton = styled.button((props) => ({
  background: props.theme.colors.background.orangePillBg,
  border: '1px solid rgba(168, 185, 244, 0.15)',
  borderRadius: 8,
  display: 'flex',
  gap: 8,
  padding: '8px 12px',
  alignItems: 'center',
  color: props.theme.colors.white_0,
}));

const SwitchToFiatText = styled.h1((props) => ({
  ...props.theme.body_m,
  color: props.theme.colors.white_0,
}));

export function FiatRow({
  onClick,
  showFiat,
  tokenCurrency,
  tokenAmount,
  fiatCurrency,
  fiatAmount,
  forSwap = false,
}: {
  forSwap?: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  showFiat?: boolean;
  tokenCurrency?: string | undefined;
  tokenAmount?: string | undefined;
  fiatCurrency: string;
  fiatAmount: string | number | undefined;
}) {
  const { t } = useTranslation('translation', { keyPrefix: 'SEND' });
  const renderText = (value: string) => `~ ${value} ${tokenCurrency}`;
  return (
    <RowContainer>
      {/* <SubText>
        {showFiat ? (
          <NumericFormat
            value={tokenAmount}
            displayType="text"
            thousandSeparator
            renderText={renderText}
          />
        ) : (
          `~ $ ${fiatAmount} ${fiatCurrency}`
        )}
      </SubText> */}
      {forSwap ? (
        <SwitchToFiatButton onClick={onClick}>
          <NumericFormat
            value={fiatAmount}
            displayType="text"
            thousandSeparator
            prefix={`${currencySymbolMap[fiatCurrency]} `}
            renderText={(value) => <SwitchToFiatText>{value}</SwitchToFiatText>}
          />
          <img src={Arrows} width={22} height={22} alt="switch-arrows" />
        </SwitchToFiatButton>
      ) : (
        <SwitchToFiatButton onClick={onClick}>
          <SwitchToFiatText>
            {showFiat ? `${tokenAmount}` : `${fiatAmount} ${fiatCurrency}`}
          </SwitchToFiatText>
          {/* <img src={Arrows} width={22} height={22} alt="switch-arrows" /> */}
        </SwitchToFiatButton>
      )}
    </RowContainer>
  );
}
export default FiatRow;
