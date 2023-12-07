/* eslint-disable no-nested-ternary */
import BtcTransactionHistoryItem from '@components/transactions/btcTransaction';
import StxTransactionHistoryItem from '@components/transactions/stxTransaction';
import useTransactions from '@hooks/queries/useTransactions';
import useWalletSelector from '@hooks/useWalletSelector';
import { animated, config, useSpring } from '@react-spring/web';
import { FungibleToken } from '@secretkeylabs/xverse-core';
import { BtcTransactionData } from '@secretkeylabs/xverse-core/types';
import {
  AddressTransactionWithTransfers,
  MempoolTransaction,
} from '@stacks/stacks-blockchain-api-types';
import { CurrencyTypes } from '@utils/constants';
import { formatDate } from '@utils/date';
import {
  isAddressTransactionWithTransfers,
  isBrc20Transaction,
  isBrc20TransactionArr,
  isBtcTransaction,
  isBtcTransactionArr,
  Tx,
} from '@utils/transactions/transactions';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MoonLoader } from 'react-spinners';
import styled from 'styled-components';
import AllTransactionItem from './allTransactionItem';

const ListItemsContainer = styled.div((props) => ({
  marginTop: props.theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  borderTopLeftRadius: '24px',
  borderTopRightRadius: '24px',
  background: props.theme.colors.background.darkbg,
}));

const ListHeader = styled.h1((props) => ({
  margin: props.theme.spacing(10),
  color: props.theme.colors.action.classic,
  fontFamily: 'MontBold',
  fontSize: '20px',
}));

const LoadingContainer = styled.div({
  display: 'flex',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const NoTransactionsContainer = styled.div((props) => ({
  ...props.theme.body_m,
  fontFamily: 'MontRegular',
  display: 'flex',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  color: props.theme.colors.white[400],
}));

const GroupContainer = styled(animated.div)<{ txAll: boolean | undefined }>((props) => ({
  marginBottom: props.txAll ? props.theme.spacing(0) : props.theme.spacing(0),
}));

const Divider = styled.div({
  borderTop: '1px solid  #A8B9F433',
  width: '90%',
  marginLeft: 'auto',
  marginRight: 'auto',
});

interface TransactionsHistoryListProps {
  coin: CurrencyTypes;
  ft?: FungibleToken;
  txFilter: string | null;
  brc20Token: string | null;
}

const sortTransactionsByBlockHeight = (transactions: BtcTransactionData[]) =>
  transactions.sort((txA, txB) => {
    if (txB.blockHeight > txA.blockHeight) {
      return 1;
    }
    return -1;
  });

const groupBtcTxsByDate = (
  transactions: BtcTransactionData[],
): { [x: string]: BtcTransactionData[] } => {
  const pendingTransactions: BtcTransactionData[] = [];
  const processedTransactions: { [x: string]: BtcTransactionData[] } = {};

  transactions.forEach((transaction) => {
    const txDate = formatDate(new Date(transaction.seenTime));
    if (transaction.txStatus === 'pending') {
      pendingTransactions.push(transaction);
    } else {
      if (!processedTransactions[txDate]) processedTransactions[txDate] = [transaction];
      else processedTransactions[txDate].push(transaction);

      sortTransactionsByBlockHeight(processedTransactions[txDate]);
    }
  });
  sortTransactionsByBlockHeight(pendingTransactions);
  if (pendingTransactions.length > 0) {
    const result = { Pending: pendingTransactions, ...processedTransactions };
    return result;
  }
  return processedTransactions;
};

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

function mergeObjects(obj1, obj2) {
  if (obj1 === undefined) return obj2 || {};
  if (obj2 === undefined) return obj1 || {};
  return Object.keys({ ...obj1, ...obj2 }).reduce((merged, key) => {
    if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
      merged[key] = obj1[key].concat(obj2[key]);
    } else if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
      merged[key] = mergeObjects(obj1[key], obj2[key]);
    } else {
      merged[key] = obj2[key] !== undefined ? obj2[key] : obj1[key];
    }
    return merged;
  }, {});
}

function sortData(inputData) {
  const customSortOrder = {
    Pending: 1,
    Today: 2,
    Yesterday: 3,
  };

  const sortedData = Object.fromEntries(
    Object.entries(inputData).sort(([keyA], [keyB]) => {
      const orderA = customSortOrder[keyA] || Infinity;
      const orderB = customSortOrder[keyB] || Infinity;

      if (orderA !== Infinity || orderB !== Infinity) {
        return orderA - orderB;
      }

      // If both are regular dates, sort them in descending order
      const dateA = new Date(keyA).getTime();
      const dateB = new Date(keyB).getTime();

      return dateB - dateA;
    }),
  );

  return sortedData;
}
export default function AllTransactionsHistoryList() {
  const {
    data: btcData,
    isLoading: loadingBTC,
    isFetching: fetchingBTC,
  } = useTransactions('BTC', null);
  const {
    data: stxData,
    isLoading: loadingSTX,
    isFetching: fetchingSTX,
  } = useTransactions('STX', null);
  const styles = useSpring({
    config: { ...config.stiff },
    from: { opacity: 0 },
    to: {
      opacity: 1,
    },
  });
  const { coinsList } = useWalletSelector();
  const { t } = useTranslation('translation', { keyPrefix: 'COIN_DASHBOARD_SCREEN' });
  const visibleCoins = useMemo(() => coinsList?.filter((coin) => coin.visible), [coinsList]);

  const groupedTxs = useMemo(() => {
    console.log('In groupedTxs');
    let btc;
    let stx;
    if (!stxData?.length && !btcData?.length) {
      return;
    }
    if (btcData?.length) {
      btc = groupBtcTxsByDate(btcData as BtcTransactionData[]);
    }
    if (stxData?.length) {
      stx = groupedTxsByDateMap(
        stxData as (AddressTransactionWithTransfers | MempoolTransaction)[],
      );
    }

    const collection = mergeObjects(btc, stx);
    const allTransactions = sortData(collection);
    console.log('ALL', allTransactions);
    return allTransactions;
  }, [stxData, btcData]);

  return (
    <ListItemsContainer>
      <ListHeader>All {t('TRANSACTIONS_TITLE')}</ListHeader>
      <Divider />
      {groupedTxs &&
        !loadingBTC &&
        !loadingSTX &&
        Object.keys(groupedTxs).map((group) => (
          <GroupContainer key={group} style={styles} txAll>
            {groupedTxs[group].map((transaction, index) => {
              if (isBtcTransaction(transaction) || isBrc20Transaction(transaction)) {
                return <BtcTransactionHistoryItem transaction={transaction} key={index} />;
              }
              return (
                <StxTransactionHistoryItem
                  transaction={transaction}
                  transactionCoin="STX"
                  key={transaction?.tx_id}
                  txFilter={null}
                />
              );
            })}
            {visibleCoins &&
              visibleCoins.map((coin) => (
                <AllTransactionItem
                  key={coin.ticker}
                  coin="FT"
                  ft={coin}
                  txFilter={`${coin?.principal}::${coin?.assetName}`}
                />
              ))}
          </GroupContainer>
        ))}

      {loadingBTC && (
        <LoadingContainer>
          <MoonLoader color="white" size={20} />
        </LoadingContainer>
      )}
      {loadingSTX && (
        <LoadingContainer>
          <MoonLoader color="white" size={20} />
        </LoadingContainer>
      )}
      {!loadingBTC && !loadingSTX && btcData?.length === 0 && stxData?.length === 0 && (
        <>
          <Divider />
          <NoTransactionsContainer>{t('TRANSACTIONS_LIST_EMPTY')}</NoTransactionsContainer>
        </>
      )}
    </ListItemsContainer>
  );
}
