import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useMutation } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getStxFiatEquivalent, microstacksToStx } from '@secretkeylabs/xverse-core/currency';
import { StacksTransaction, TokenTransferPayload } from '@secretkeylabs/xverse-core/types';
import { addressToString, broadcastSignedTransaction } from '@secretkeylabs/xverse-core/transactions';
import Seperator from '@components/seperator';
import { StoreState } from '@stores/index';
import BottomBar from '@components/tabBar';
import { fetchStxWalletDataRequestAction } from '@stores/wallet/actions/actionCreators';
import RecipientAddressView from '@components/recipinetAddressView';
import TransferAmountView from '@components/transferAmountView';
import TopRow from '@components/topRow';
import AccountHeaderComponent from '@components/accountHeader';
import finalizeTxSignature from '@components/transactionsRequests/utils';
import ConfirmStxTransationComponent from '../../components/confirmStxTransactionComponent';

const InfoContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  marginTop: props.theme.spacing(12),
  marginBottom: props.theme.spacing(4),
}));

const TitleText = styled.h1((props) => ({
  ...props.theme.headline_category_s,
  color: props.theme.colors.white['400'],
  textTransform: 'uppercase',
}));

const ValueText = styled.h1((props) => ({
  ...props.theme.body_m,
  marginTop: props.theme.spacing(2),
  wordBreak: 'break-all',
}));

function ConfirmStxTransaction() {
  const { t } = useTranslation('translation', { keyPrefix: 'CONFIRM_TRANSACTION' });
  const [fee, setStateFee] = useState(new BigNumber(0));
  const [amount, setAmount] = useState(new BigNumber(0));
  const [fiatAmount, setFiatAmount] = useState(new BigNumber(0));
  const [total, setTotal] = useState(new BigNumber(0));
  const [fiatTotal, setFiatTotal] = useState(new BigNumber(0));
  const [recipient, setRecipient] = useState('');
  const [txRaw, setTxRaw] = useState('');
  const [memo, setMemo] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    unsignedTx, sponsored, isBrowserTx, tabId, requestToken,
  } = location.state;

  const {
    stxBtcRate, btcFiatRate, network, stxAddress, fiatCurrency,
  } = useSelector(
    (state: StoreState) => state.walletState,
  );
  const {
    isLoading,
    error: txError,
    data: stxTxBroadcastData,
    mutate,
  } = useMutation<
  string,
  Error,
  { signedTx: StacksTransaction }>(async ({ signedTx }) => broadcastSignedTransaction(signedTx, network.type));

  useEffect(() => {
    if (stxTxBroadcastData) {
      if (isBrowserTx) {
        finalizeTxSignature({ requestPayload: requestToken, tabId: Number(tabId), data: { txId: stxTxBroadcastData, txRaw } });
      }
      navigate('/tx-status', {
        state: {
          txid: stxTxBroadcastData,
          currency: 'STX',
          error: '',
          browserTx: isBrowserTx,
        },
      });
      setTimeout(() => {
        dispatch(fetchStxWalletDataRequestAction(stxAddress, network, fiatCurrency, stxBtcRate));
      }, 1000);
    }
  }, [stxTxBroadcastData]);

  useEffect(() => {
    if (txError) {
      navigate('/tx-status', {
        state: {
          txid: '',
          currency: 'STX',
          error: txError.toString(),
          browserTx: isBrowserTx,
        },
      });
    }
  }, [txError]);

  function updateUI() {
    const txPayload = unsignedTx.payload as TokenTransferPayload;

    if (txPayload.recipient.address) {
      setRecipient(addressToString(txPayload.recipient.address));
    }

    const txAmount = new BigNumber(txPayload.amount.toString(10));
    const txFee = new BigNumber(unsignedTx.auth.spendingCondition.fee.toString());
    const txTotal = amount.plus(fee);
    const txFiatAmount = getStxFiatEquivalent(amount, stxBtcRate, btcFiatRate);
    const txFiatTotal = getStxFiatEquivalent(amount, stxBtcRate, btcFiatRate);
    const { memo: txMemo } = txPayload;

    setAmount(txAmount);
    setStateFee(txFee);
    setFiatAmount(txFiatAmount);
    setTotal(txTotal);
    setFiatTotal(txFiatTotal);
    setMemo(txMemo.content);
  }

  useEffect(() => {
    if (recipient === '' || !fee || !amount || !fiatAmount || !total || !fiatTotal) {
      updateUI();
    }
  });

  const networkInfoSection = (
    <InfoContainer>
      <TitleText>{t('NETWORK')}</TitleText>
      <ValueText>{network.type}</ValueText>
    </InfoContainer>
  );

  const memoInfoSection = !!memo && (
    <>
      <InfoContainer>
        <TitleText>{t('MEMO')}</TitleText>
        <ValueText>{memo}</ValueText>
      </InfoContainer>
      <Seperator />
    </>
  );

  const getAmount = () => {
    const txPayload = unsignedTx?.payload as TokenTransferPayload;
    const amountToTransfer = new BigNumber(txPayload?.amount?.toString(10));
    return microstacksToStx(amountToTransfer);
  };

  const handleOnConfirmClick = (txs: StacksTransaction[]) => {
    setTxRaw(txs[0].serialize().toString('hex'));
    mutate({ signedTx: txs[0] });
  };

  const handleOnCancelClick = () => {
    if (isBrowserTx) {
      finalizeTxSignature({ requestPayload: requestToken, tabId: Number(tabId), data: 'cancel' });
      window.close();
    } else {
      navigate('/send-stx', {
        state: {
          recipientAddress: recipient,
          amountToSend: getAmount().toString(),
          stxMemo: memo,
        },
      });
    }
  };
  return (
    <>
      {isBrowserTx ? <AccountHeaderComponent disableMenuOption disableAccountSwitch />
        : <TopRow title={t('CONFIRM_TX')} onClick={handleOnCancelClick} />}
      <ConfirmStxTransationComponent
        initialStxTransactions={[unsignedTx]}
        loading={isLoading}
        onConfirmClick={handleOnConfirmClick}
        onCancelClick={handleOnCancelClick}
        isSponsored={sponsored}
      >
        <TransferAmountView currency="STX" amount={getAmount()} />
        <RecipientAddressView recipient={recipient} />
        {networkInfoSection}
        <Seperator />
        {memoInfoSection}
      </ConfirmStxTransationComponent>
      {!isBrowserTx && <BottomBar tab="dashboard" />}
    </>
  );
}
export default ConfirmStxTransaction;