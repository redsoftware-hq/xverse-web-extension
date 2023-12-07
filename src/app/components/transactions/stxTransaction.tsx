import useWalletSelector from '@hooks/useWalletSelector';
import { parseStxTransactionData } from '@secretkeylabs/xverse-core/api/helper';
import { AddressTransactionWithTransfers } from '@stacks/stacks-blockchain-api-types';
import { CurrencyTypes } from '@utils/constants';
import { isAddressTransactionWithTransfers, Tx } from '@utils/transactions/transactions';
import styled from 'styled-components';
import StxTransferTransaction from './stxTransferTransaction';
import TxTransfers from './txTransfers';

const TransactionContainer = styled.div({
  margin: 'auto',
  width: '90%',
  borderBottom: '1px solid  #A8B9F433',
});

interface TransactionHistoryItemProps {
  transaction: AddressTransactionWithTransfers | Tx;
  transactionCoin: CurrencyTypes;
  txFilter: string | null;
}

export default function StxTransactionHistoryItem(props: TransactionHistoryItemProps) {
  const { transaction, transactionCoin, txFilter } = props;
  const { selectedAccount } = useWalletSelector();
  // const { t } = useTranslation('translation', { keyPrefix: 'COIN_DASHBOARD_SCREEN' });
  if (!isAddressTransactionWithTransfers(transaction)) {
    return (
      <TransactionContainer>
        <StxTransferTransaction
          transaction={parseStxTransactionData({
            responseTx: transaction,
            stxAddress: selectedAccount?.stxAddress as string,
          })}
          transactionCoin={transactionCoin}
        />
      </TransactionContainer>
    );
  } // This is a normal Transaction or MempoolTransaction

  // Show transfer only for contract calls
  if (transaction.tx.tx_type !== 'contract_call') {
    return (
      <TransactionContainer>
        <StxTransferTransaction
          transaction={parseStxTransactionData({
            responseTx: transaction.tx,
            stxAddress: selectedAccount?.stxAddress as string,
          })}
          transactionCoin={transactionCoin}
        />
      </TransactionContainer>
    );
  }
  return (
    <TransactionContainer>
      <TxTransfers transaction={transaction} coin={transactionCoin} txFilter={txFilter} />
      <StxTransferTransaction
        transaction={parseStxTransactionData({
          responseTx: transaction.tx,
          stxAddress: selectedAccount?.stxAddress as string,
        })}
        transactionCoin={transactionCoin}
      />
    </TransactionContainer>
  );
}
