import { BtcTransactionData, StxTransactionData } from '@secretkeylabs/xverse-core';
import { CurrencyTypes } from '@utils/constants';
import ReceiveIcon from '@assets/img/transactions/received.svg';
import SendIcon from '@assets/img/transactions/sent.svg';
import PendingIcon from '@assets/img/transactions/pending.svg';
import ContractIcon from '@assets/img/transactions/contract.svg';
import FailedIcon from '@assets/img/transactions/failed.svg';
import OrdinalsIcon from '@assets/img/transactions/ordinal.svg';
import Send from '@assets/img/dashboard/send.svg';
import Receive from '@assets/img/dashboard/recieve.svg';

interface TransactionStatusIconPros {
  transaction: StxTransactionData | BtcTransactionData;
  currency: CurrencyTypes;
}

function TransactionStatusIcon(props: TransactionStatusIconPros) {
  const { currency, transaction } = props;
  if (currency === 'STX' || currency === 'FT') {
    const tx = transaction as StxTransactionData;
    if (tx.txStatus === 'abort_by_response' || tx.txStatus === 'abort_by_post_condition') {
      return <img width={32} src={FailedIcon} alt="pending" />;
    }
    if (tx.txType === 'token_transfer' || tx.tokenType === 'fungible') {
      if (tx.txStatus === 'pending') {
        return <img width={32} src={PendingIcon} alt="pending" />;
      }
      if (tx.incoming) {
        return <img width={32} src={Receive} alt="received" />;
      }
      return <img width={32} src={Send} alt="sent" />;
    }
    if (tx.txStatus === 'pending') {
      return <img width={32} src={PendingIcon} alt="pending" />;
    }
    return <img width={32} src={ContractIcon} alt="contract-call" />;
  }
  if (currency === 'BTC') {
    const tx = transaction as BtcTransactionData;
    if (tx.isOrdinal) {
      return <img width={32} src={OrdinalsIcon} alt="ordinals-transfer" />;
    }
    if (tx.txStatus === 'pending') {
      return <img width={32} src={PendingIcon} alt="pending" />;
    }
    if (tx.incoming) {
      return <img width={32} src={Receive} alt="received" />;
    }
    return <img width={32} src={Send} alt="sent" />;
  }
  return <img width={32} src={ContractIcon} alt="contract" />;
}
export default TransactionStatusIcon;
