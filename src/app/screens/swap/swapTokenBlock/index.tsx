import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Coin } from '@secretkeylabs/xverse-core/types/api/xverse/coins';
import ChevronIcon from '@assets/img/swap/chevron.svg';
import { FungibleToken } from '@secretkeylabs/xverse-core';
import { ftDecimals } from '@utils/helper';
import { microstacksToStx } from '@secretkeylabs/xverse-core/currency';
import BigNumber from 'bignumber.js';
import { SwapToken } from '@screens/swap/useSwap';

const Container = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  rowGap: props.theme.spacing(4),
}));

const RowContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const TitleText = styled.h1((props) => ({
  ...props.theme.body_medium_m,
  flex: 1,
  display: 'flex',
}));

const Text = styled.h1((props) => ({
  ...props.theme.body_medium_m,
}));

const BalanceText = styled.h1((props) => ({
  ...props.theme.body_medium_m,
  color: props.theme.colors.white['400'],
  marginRight: props.theme.spacing(2),
}));

const CardContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  rowGap: props.theme.spacing(3),
  background: props.theme.colors.background.elevation1,
  border: `1px solid ${props.theme.colors.background.elevation2}`,
  borderRadius: 8,
  padding: props.theme.spacing(8),
  ':focus-within': {
    border: `1px solid ${props.theme.colors.background.elevation6}`,
  },
}));

const CoinButtonContainer = styled.button((props) => ({
  display: 'flex',
  flexDirection: 'row',
  columnGap: props.theme.spacing(2),
  background: 'transparent',
  alignItems: 'center',
}));

const CoinButtonArrow = styled.img((props) => ({
  width: 12,
  height: 12,
}));

const AmountTex = styled.input<{ error?: boolean }>((props) => ({
  ...props.theme.body_bold_l,
  flex: 1,
  color: props.error ? props.theme.colors.feedback.error : props.theme.colors.white['0'],
  marginLeft: props.theme.spacing(2),
  textAlign: 'right',
  backgroundColor: 'transparent',
  border: 'transparent',
}));

const CoinText = styled.div((props) => ({
  ...props.theme.body_medium_m,
  color: props.theme.colors.white['0'],
}));

const EstimateUSDText = styled.h1((props) => ({
  ...props.theme.body_medium_m,
  color: props.theme.colors.white['400'],
  marginLeft: 'auto',
}));

type SwapTokenBlockProps = {
  title: string;
  selectedCoin?: SwapToken;
  amount?: string;
  onAmountChange?: (amount: string) => void;
  onSelectCoin?: () => void;
  error?: boolean;
};

function SwapTokenBlock(props: SwapTokenBlockProps) {
  const { t } = useTranslation('translation', { keyPrefix: 'SWAP_SCREEN' });

  return (
    <Container>
      <RowContainer>
        <TitleText>{props.title}</TitleText>
        <BalanceText>{t('BALANCE')}:</BalanceText>
        <Text>{props.selectedCoin?.balance ?? '--'}</Text>
      </RowContainer>
      <CardContainer>
        <RowContainer>
          <CoinButtonContainer onClick={props.onSelectCoin}>
            {props.selectedCoin?.image}
            <CoinText>{props.selectedCoin?.name ?? t('SELECT_COIN')}</CoinText>
            <CoinButtonArrow src={ChevronIcon} />
          </CoinButtonContainer>
          <AmountTex
            error={props.error}
            placeholder="0"
            disabled={props.onAmountChange == null}
            value={props.amount ?? props.selectedCoin?.amount.toString() ?? ''}
            onChange={(e) => props.onAmountChange?.(e.target.value)}
          />
        </RowContainer>
        <RowContainer>
          <EstimateUSDText>
            {props.selectedCoin ? `≈ $ ${props.selectedCoin.fiatAmount} USD` : '--'}
          </EstimateUSDText>
        </RowContainer>
      </CardContainer>
    </Container>
  );
}

export default SwapTokenBlock;
