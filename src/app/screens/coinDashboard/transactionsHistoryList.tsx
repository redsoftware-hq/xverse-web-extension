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
  isBtcTransaction,
  isBtcTransactionArr,
  Tx,
} from '@utils/transactions/transactions';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MoonLoader } from 'react-spinners';
import styled from 'styled-components';

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

const SectionHeader = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: props.theme.spacing(7),
  paddingLeft: props.theme.spacing(8),
  paddingRight: props.theme.spacing(8),
}));

const SectionSeparator = styled.div({
  border: '0.5px solid  rgba(255, 255, 255, 0.6)',
  opacity: 0.2,
  flexGrow: 1,
});
const Divider = styled.div({
  borderTop: '1px solid  #A8B9F433',
  width: '90%',
  margin: 'auto',
});
const SectionTitle = styled.p((props) => ({
  ...props.theme.body_xs,
  color: props.theme.colors.white[200],
  marginRight: props.theme.spacing(4),
}));

interface TransactionsHistoryListProps {
  coin: CurrencyTypes;
  ft?: FungibleToken;
  txFilter: string | null;
  txAll?: boolean;
}

const groupBtcTxsByDate = (
  transactions: BtcTransactionData[],
): { [x: string]: BtcTransactionData[] } =>
  transactions.reduce(
    (all: { [x: string]: BtcTransactionData[] }, transaction: BtcTransactionData) => {
      const txDate = formatDate(new Date(transaction.seenTime));
      if (!all[txDate]) {
        if (transaction.txStatus === 'pending') {
          all.Pending = [transaction];
        } else {
          all[txDate] = [transaction];
        }
      } else {
        all[txDate].push(transaction);
        all[txDate].sort((txA, txB) => {
          if (txB.blockHeight > txA.blockHeight) {
            return 1;
          }
          return -1;
        });
      }
      return all;
    },
    {},
  );

const groupedTxsByDateMap = (txs: (AddressTransactionWithTransfers | MempoolTransaction)[]) =>
  txs.reduce(
    (
      all: { [x: string]: (AddressTransactionWithTransfers | Tx)[] },
      transaction: AddressTransactionWithTransfers | Tx,
    ) => {
      const date = formatDate(
        new Date(
          transaction.tx?.burn_block_time_iso ? transaction.tx.burn_block_time_iso : Date.now(),
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
    return (
      acceptedTypes &&
      ((atx?.ft_transfers || []).filter((transfer) => transfer.asset_identifier.includes(filter))
        .length > 0 ||
        (atx?.nft_transfers || []).filter((transfer) => transfer.asset_identifier.includes(filter))
          .length > 0 ||
        tx?.contract_call?.contract_id === filter)
    );
  });

export default function TransactionsHistoryList(props: TransactionsHistoryListProps) {
  const { coin, txFilter, ft, txAll } = props;
  const { coinsList } = useWalletSelector();
  const { data, isLoading, isFetching } = useTransactions((coin as CurrencyTypes) || 'STX');
  const {
    data: bitcoinData,
    isLoading: loadingBtc,
    isFetching: fetchingBtc,
  } = useTransactions('BTC');
  const { data: stxData, isLoading: loadingStx, isFetching: fetchingStx } = useTransactions('STX');
  const styles = useSpring({
    config: { ...config.stiff },
    from: { opacity: 0 },
    to: {
      opacity: 1,
    },
  });
  const { t } = useTranslation('translation', { keyPrefix: 'COIN_DASHBOARD_SCREEN' });
  // const visibleCoins = useMemo(() => {
  //   coinsList?.filter((item) => item.visible);
  // }, [coinsList]);
  const groupedTxs = useMemo(() => {
    if (txAll) {
      if (!loadingStx && !loadingBtc) {
        const groupedBTC = groupBtcTxsByDate(bitcoinData as BtcTransactionData[]);
        const groupedSTX = groupedTxsByDateMap(stxData as AddressTransactionWithTransfers[]);
        const all = { ...groupedBTC, ...groupedSTX };
        return all;
      }
    }
    if (data && data.length > 0) {
      if (isBtcTransactionArr(data)) {
        return groupBtcTxsByDate(data);
      }
      if (txFilter && coin === 'FT') {
        const filteredTxs = filterTxs(data, txFilter);
        return groupedTxsByDateMap(filteredTxs);
      }
      return groupedTxsByDateMap(data);
    }
  }, [data, isLoading, isFetching]);

  const getListHeader = () => {
    if (coin) {
      switch (coin) {
        case 'BTC':
          return `Bitcoin ${t('TRANSACTIONS_TITLE')}`;
        case 'STX':
          return `STX ${t('TRANSACTIONS_TITLE')}`;
        default:
          return `${ft?.name ? ft.name : 'All'} ${t('TRANSACTIONS_TITLE')}`;
      }
    }
  };
  return (
    <ListItemsContainer>
      <ListHeader>{getListHeader()}</ListHeader>
      {groupedTxs &&
        !isLoading &&
        Object.keys(groupedTxs).map((group) => (
          <GroupContainer key={group} style={styles} txAll={txAll}>
            <SectionSeparator />
            {groupedTxs[group].map((transaction) => {
              if (isBtcTransaction(transaction)) {
                return (
                  <>
                    <BtcTransactionHistoryItem transaction={transaction} key={transaction.txid} />
                    <SectionSeparator />
                  </>
                );
              }
              return (
                <>
                  <StxTransactionHistoryItem
                    transaction={transaction}
                    transactionCoin={coin}
                    key={transaction.tx_id}
                    txFilter={txFilter}
                  />
                  <SectionSeparator />
                </>
              );
            })}
          </GroupContainer>
        ))}
      {isLoading && (
        <LoadingContainer>
          <MoonLoader color="white" size={20} />
        </LoadingContainer>
      )}
      {!isLoading && data?.length === 0 && (
        <>
          <Divider />
          <NoTransactionsContainer>{t('TRANSACTIONS_LIST_EMPTY')}</NoTransactionsContainer>
        </>
      )}
    </ListItemsContainer>
  );
}
