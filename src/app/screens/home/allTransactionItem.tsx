import StxTransactionHistoryItem from '@components/transactions/stxTransaction';
import useTransactions from '@hooks/queries/useTransactions';
import { animated, config, useSpring } from '@react-spring/web';
import { FungibleToken } from '@secretkeylabs/xverse-core';
import {
  AddressTransactionWithTransfers,
  MempoolTransaction,
  PostConditionFungible,
} from '@stacks/stacks-blockchain-api-types';
import { CurrencyTypes } from '@utils/constants';
import { formatDate } from '@utils/date';
import { isAddressTransactionWithTransfers, Tx } from '@utils/transactions/transactions';
import { useMemo } from 'react';
import styled from 'styled-components';

const GroupContainer = styled(animated.div)<{ txAll: boolean | undefined }>((props) => ({
  marginBottom: props.txAll ? props.theme.spacing(0) : props.theme.spacing(0),
}));
const groupedTxsByDateMap = (txs: (AddressTransactionWithTransfers | MempoolTransaction)[]) =>
  txs.reduce(
    (
      all: { [x: string]: (AddressTransactionWithTransfers | Tx)[] },
      transaction: AddressTransactionWithTransfers | Tx,
    ) => {
      const date = formatDate(
        new Date(
          isAddressTransactionWithTransfers(transaction) && transaction.tx?.burn_block_time_iso
            ? transaction.tx.burn_block_time_iso
            : Date.now(),
        ),
      );
      if (!all[date]) {
        all[date] = [transaction];
      } else {
        all[date].push(transaction);
      }
      return all;
    },
    {},
  );

const filterTxs = (
  txs: (AddressTransactionWithTransfers | MempoolTransaction)[],
  filter: string,
): (AddressTransactionWithTransfers | MempoolTransaction)[] =>
  txs.filter((atx) => {
    const tx = isAddressTransactionWithTransfers(atx) ? atx.tx : atx;
    const acceptedTypes = tx.tx_type === 'contract_call';
    const ftTransfers = atx && isAddressTransactionWithTransfers(atx) ? atx.ft_transfers || [] : [];
    const nftTransfers =
      atx && isAddressTransactionWithTransfers(atx) ? atx.nft_transfers || [] : [];
    const fungibleTokenPostCondition = tx?.post_conditions[0] as PostConditionFungible;
    const contractFromPostCondition = `${fungibleTokenPostCondition?.asset?.contract_address}.${fungibleTokenPostCondition?.asset?.contract_name}::${fungibleTokenPostCondition?.asset?.asset_name}`;
    return (
      acceptedTypes &&
      (ftTransfers.filter((transfer) => transfer.asset_identifier.includes(filter)).length > 0 ||
        nftTransfers.filter((transfer) => transfer.asset_identifier.includes(filter)).length > 0 ||
        tx?.contract_call?.contract_id === filter ||
        (contractFromPostCondition && contractFromPostCondition === filter))
    );
  });

interface Props {
  coin: CurrencyTypes;
  ft?: FungibleToken;
  txFilter: string | null;
}
export default function AllTransactionItem(props: Props) {
  const { coin, txFilter, ft } = props;
  const { data, isLoading, isFetching, error } = useTransactions(coin as CurrencyTypes, null);
  const groupedTxsSTX = useMemo(() => {
    if (!data?.length) {
      return;
    }

    if (txFilter && coin === 'FT') {
      const filteredTxs = filterTxs(
        data as (AddressTransactionWithTransfers | MempoolTransaction)[],
        txFilter,
      );
      return groupedTxsByDateMap(filteredTxs);
    }

    return groupedTxsByDateMap(data as (AddressTransactionWithTransfers | MempoolTransaction)[]);
  }, [data, isLoading, isFetching]);
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {groupedTxsSTX &&
        !isLoading &&
        Object.keys(groupedTxsSTX).map((group) =>
          groupedTxsSTX[group].map((transaction) => (
            <StxTransactionHistoryItem
              transaction={transaction}
              transactionCoin={coin}
              key={transaction?.tx_id}
              txFilter={txFilter}
            />
          )),
        )}
    </>
  );
}
