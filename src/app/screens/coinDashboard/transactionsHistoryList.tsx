/* eslint-disable no-nested-ternary */
import styled from 'styled-components';
import { BtcTransactionData } from '@secretkeylabs/xverse-core/types';
import {
  AddressTransactionWithTransfers,
  MempoolTransaction,
  PostConditionFungible,
} from '@stacks/stacks-blockchain-api-types';
import { useMemo } from 'react';
import { animated, config, useSpring } from '@react-spring/web';
import {
  isAddressTransactionWithTransfers,
  isBrc20Transaction,
  isBrc20TransactionArr,
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
  display: 'flex',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  color: props.theme.colors.white_400,
}));

const GroupContainer = styled(animated.div)((props) => ({
  marginBottom: props.theme.spacing(8),
}));

const SectionHeader = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: props.theme.spacing(7),
  paddingLeft: props.theme.spacing(8),
  paddingRight: props.theme.spacing(8),
}));

const SectionSeparator = styled.div((props) => ({
  border: `0.5px solid ${props.theme.colors.white_400}`,
  opacity: 0.2,
  flexGrow: 1,
}));

const SectionTitle = styled.p((props) => ({
  ...props.theme.body_xs,
  color: props.theme.colors.white_200,
  marginRight: props.theme.spacing(4),
}));

interface TransactionsHistoryListProps {
  coin: CurrencyTypes;
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
  const { coin, txFilter, brc20Token } = props;
  const { data, isLoading, isFetching, error } = useTransactions(
    (coin as CurrencyTypes) || 'STX',
    brc20Token,
  );
  const styles = useSpring({
    config: { ...config.stiff },
    from: { opacity: 0 },
    to: {
      opacity: 1,
    },
  });

  const { t } = useTranslation('translation', { keyPrefix: 'COIN_DASHBOARD_SCREEN' });

  const groupedTxs = useMemo(() => {
    if (!data?.length) {
      return;
    }

    if (isBtcTransactionArr(data) || isBrc20TransactionArr(data)) {
      return groupBtcTxsByDate(data);
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
    <ListItemsContainer>
      <ListHeader>
        {coin === 'BTC'
          ? `Bitcoin ${t('TRANSACTIONS_TITLE')}`
          : coin === 'STX'
          ? `STX ${t('TRANSACTIONS_TITLE')}`
          : `All ${t('TRANSACTIONS_TITLE')}`}
      </ListHeader>
      {groupedTxs &&
        !isLoading &&
        Object.keys(groupedTxs).map((group) => (
          <GroupContainer style={styles}>
            {/* <SectionHeader> */}
            {/* <SectionTitle>{group}</SectionTitle> */}
            <SectionSeparator />
            {/* </SectionHeader> */}
            {groupedTxs[group].map((transaction) => {
              if (isBtcTransaction(transaction) || isBrc20Transaction(transaction)) {
                return (
                  <>
                    <BtcTransactionHistoryItem transaction={transaction} key={transaction.txid} />
                    <SectionSeparator />
                  </>
                );
              }
              return (
                <StxTransactionHistoryItem
                  transaction={transaction}
                  transactionCoin={coin}
                  key={transaction.tx_id}
                  txFilter={txFilter}
                />
              );
            })}
          </GroupContainer>
        ))}
      {isLoading && (
        <LoadingContainer>
          <MoonLoader color="white" size={20} />
        </LoadingContainer>
      )}
      {!isLoading && error && (
        <NoTransactionsContainer>{t('TRANSACTIONS_LIST_ERROR')}</NoTransactionsContainer>
      )}
      {!isLoading && data?.length === 0 && !error && (
        <NoTransactionsContainer>{t('TRANSACTIONS_LIST_EMPTY')}</NoTransactionsContainer>
      )}
    </ListItemsContainer>
  );
}
