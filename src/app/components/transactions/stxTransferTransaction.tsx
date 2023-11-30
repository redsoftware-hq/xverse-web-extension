import TransactionAmount from '@components/transactions/transactionAmount';
import TransactionRecipient from '@components/transactions/transactionRecipient';
import TransactionStatusIcon from '@components/transactions/transactionStatusIcon';
import TransactionTitle from '@components/transactions/transactionTitle';
import useWalletSelector from '@hooks/useWalletSelector';
import { microstacksToStx, satsToBtc, StxTransactionData } from '@secretkeylabs/xverse-core';
import { CurrencyTypes } from '@utils/constants';
import { getStxTxStatusUrl } from '@utils/helper';
import BigNumber from 'bignumber.js';
import styled from 'styled-components';

const TransactionContainer = styled.button((props) => ({
  display: 'flex',
  width: '100%',
  paddingTop: props.theme.spacing(5),
  paddingBottom: props.theme.spacing(5),
  paddingLeft: props.theme.spacing(8),
  paddingRight: props.theme.spacing(8),
  background: 'none',
  ':hover': {
    background: props.theme.colors.white_900,
  },
  ':focus': {
    background: props.theme.colors.white_850,
  },
}));

const TransactionInfoContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: props.theme.spacing(6),
  flex: 1,
}));

const TransactionAmountContainer = styled.div({
  display: 'flex',
  flex: 1,
  width: '100%',
  justifyContent: 'flex-end',
});

const TransactionRow = styled.div((props) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  ...props.theme.body_bold_m,
}));

const TitleContainer = styled.div((props) => ({
  display: 'flex',
  flex: 1,
  alignItems: 'center',
  gap: props.theme.spacing(3),
}));

const PriceConatiner = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const HeaderTitle = styled.p((props) => ({
  ...props.theme.body_medium_m,
  color: props.theme.colors.grey1,
  paddingRight: props.theme.spacing(25),
  textAlign: 'left',
  padding: 0,
}));

const HeaderTitleAmount = styled.p((props) => ({
  ...props.theme.body_medium_m,
  color: props.theme.colors.grey1,
  paddingRight: props.theme.spacing(25),
  textAlign: 'right',
  padding: 0,
}));
interface StxTransferTransactionProps {
  transaction: StxTransactionData;
  transactionCoin: CurrencyTypes;
}

export default function StxTransferTransaction(props: StxTransferTransactionProps) {
  const { transaction, transactionCoin } = props;
  const { network } = useWalletSelector();
  const { stxBtcRate, btcFiatRate } = useWalletSelector();
  const openTxStatusUrl = () => {
    window.open(getStxTxStatusUrl(transaction.txid, network), '_blank', 'noopener,noreferrer');
  };
  const currentDate = new Date(transaction.seenTime);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const currentMonth = months[currentDate.getMonth()];
  const currentDateValue = currentDate.getDate();
  return (
    <TransactionContainer onClick={openTxStatusUrl}>
      <TitleContainer>
        <TransactionStatusIcon transaction={transaction} currency="STX" />
        <div>
          <TransactionRecipient transaction={transaction} />
          <HeaderTitle>{`${currentMonth} ${currentDateValue}`}</HeaderTitle>
        </div>
      </TitleContainer>
      <PriceConatiner>
        <div>
          <TransactionRow>
            <TransactionAmountContainer>
              <TransactionAmount transaction={transaction} coin="STX" />
            </TransactionAmountContainer>
          </TransactionRow>
          <HeaderTitleAmount>
            {microstacksToStx(new BigNumber(transaction.amount))
              .multipliedBy(new BigNumber(stxBtcRate))
              .multipliedBy(new BigNumber(btcFiatRate))
              .toFixed(2)
              .toString()}
            USD
          </HeaderTitleAmount>
        </div>
      </PriceConatiner>
      {/* <TransactionInfoContainer>
        <TransactionRow>
          <TransactionTitle transaction={transaction} />
          <TransactionAmountContainer>
            <TransactionAmount transaction={transaction} coin={transactionCoin} />
          </TransactionAmountContainer>
        </TransactionRow>
        <TransactionRecipient transaction={transaction} />
      </TransactionInfoContainer> */}
    </TransactionContainer>
  );
}
