import useWalletSelector from '@hooks/useWalletSelector';
import { Brc20HistoryTransactionData, BtcTransactionData } from '@secretkeylabs/xverse-core';
import { satsToBtc } from '@secretkeylabs/xverse-core/currency';
import { StoreState } from '@stores/index';
import { getBtcTxStatusUrl } from '@utils/helper';
import { isBtcTransaction } from '@utils/transactions/transactions';
import BigNumber from 'bignumber.js';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import TransactionAmount from './transactionAmount';
import TransactionRecipient from './transactionRecipient';
import TransactionStatusIcon from './transactionStatusIcon';

interface TransactionHistoryItemProps {
  transaction: BtcTransactionData | Brc20HistoryTransactionData;
}

const TransactionContainer = styled.button((props) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
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

const TransactionAmountContainer = styled.div({
  display: 'flex',
  flex: 1,
  width: '100%',
  justifyContent: 'flex-end',
});

const TransactionInfoContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: props.theme.spacing(6),
  flex: 1,
}));

const TransactionRow = styled.div((props) => ({
  display: 'flex',
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

const TxId = styled.p((props) => ({
  ...props.theme.body_medium_m,
  color: props.theme.colors.white_0,
  paddingRight: props.theme.spacing(25),
  textAlign: 'left',
  padding: 0,
}));
export default function BtcTransactionHistoryItem(props: TransactionHistoryItemProps) {
  const { transaction } = props;
  const { network } = useWalletSelector();
  const { btcFiatRate } = useSelector((state: StoreState) => state.walletState);

  const openBtcTxStatusLink = useCallback(() => {
    window.open(getBtcTxStatusUrl(transaction.txid, network), '_blank', 'noopener,noreferrer');
  }, []);

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
  function formatAddress(addr: string): string {
    return addr ? `${addr.substring(0, 4)}...${addr.substring(addr.length - 4, addr.length)}` : '';
  }
  return (
    <TransactionContainer onClick={openBtcTxStatusLink}>
      <TitleContainer>
        <TransactionStatusIcon transaction={transaction} currency="BTC" />
        <div>
          {transaction.txStatus.includes('abort') && (
            <TransactionAmountContainer>
              <TxId>{formatAddress(transaction.txid)}</TxId>
            </TransactionAmountContainer>
          )}
          <TransactionRecipient transaction={transaction} />
          <HeaderTitle>{`${currentMonth} ${currentDateValue}`}</HeaderTitle>
        </div>
      </TitleContainer>
      <PriceConatiner>
        <div>
          <TransactionRow>
            <TransactionAmountContainer>
              <TransactionAmount transaction={transaction} coin="BTC" />
            </TransactionAmountContainer>
          </TransactionRow>
          <HeaderTitleAmount>
            {btcFiatRate &&
              (btcFiatRate * satsToBtc(BigNumber(transaction.amount)).toNumber()).toFixed(2)}{' '}
            USD
          </HeaderTitleAmount>
        </div>
      </PriceConatiner>
    </TransactionContainer>
  );
}
