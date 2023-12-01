import IconBitcoin from '@assets/img/dashboard/NewBitcoin_icon.svg';
import IconStacks from '@assets/img/dashboard/stack_icon.svg';
import IconUsdc from '@assets/img/dashboard/usdc.svg';
import IconUsdt from '@assets/img/dashboard/usdt.svg';
import Default from '@assets/img/dashboard/Wallet.svg';
import IconWbtc from '@assets/img/dashboard/wbtc.svg';
import Send from '@assets/img/Send.svg';
import CoinSwitch from '@components/coinSwitch';
import OperationHeader from '@components/operationHeader';
import SendForm from '@components/sendForm';
import useStxPendingTxData from '@hooks/queries/useStxPendingTxData';
import useNetworkSelector from '@hooks/useNetwork';
import useWalletSelector from '@hooks/useWalletSelector';
import { microstacksToStx, satsToBtc } from '@secretkeylabs/xverse-core';
import { generateUnsignedTransaction } from '@secretkeylabs/xverse-core/transactions';
import { StacksTransaction, UnsignedStacksTransation } from '@secretkeylabs/xverse-core/types';
import { validateStxAddress } from '@secretkeylabs/xverse-core/wallet';
import { useMutation } from '@tanstack/react-query';
import { convertAmountToFtDecimalPlaces, ftDecimals, replaceCommaByDot } from '@utils/helper';
import { getFtBalance } from '@utils/tokens';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

function SendFtScreen() {
  const { t } = useTranslation('translation', { keyPrefix: 'SEND' });
  const navigate = useNavigate();
  const { stxAddress, stxPublicKey, network, feeMultipliers, coinsList, fiatCurrency } =
    useWalletSelector();
  const [amountError, setAmountError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [memoError, setMemoError] = useState('');
  const [amountToSend, setAmountToSend] = useState('');
  const [recepientAddress, setRecepientAddress] = useState('');
  const [txMemo, setTxMemo] = useState<string | undefined>(undefined);
  const { data: stxPendingTxData } = useStxPendingTxData();
  const location = useLocation();
  const selectedNetwork = useNetworkSelector();

  const coinTicker = location.search ? location.search.split('coinTicker=')[1] : undefined;
  const fungibleToken =
    location.state?.fungibleToken || coinsList?.find((coin) => coin.ticker === coinTicker);

  let recipientAddress: string | undefined;
  let ftAmountToSend: string | undefined;
  let stxMemo: string | undefined;

  if (location.state) {
    recipientAddress = location.state.recipientAddress;
    ftAmountToSend = location.state.amountToSend;
    stxMemo = location.state.stxMemo;
  }
  const { isLoading, data, mutate } = useMutation<
    StacksTransaction,
    Error,
    { associatedAddress: string; amount: string; memo?: string }
  >({
    mutationFn: async ({ associatedAddress, amount, memo }) => {
      let convertedAmount = amount;
      if (fungibleToken?.decimals) {
        convertedAmount = convertAmountToFtDecimalPlaces(amount, fungibleToken.decimals).toString();
      }
      setAmountToSend(amount);
      setTxMemo(memo);
      setRecepientAddress(associatedAddress);
      const { principal } = fungibleToken;
      const contractInfo: string[] = principal.split('.');
      const unsginedTx: UnsignedStacksTransation = {
        amount: convertedAmount,
        senderAddress: stxAddress,
        recipientAddress: associatedAddress,
        contractAddress: contractInfo[0],
        contractName: contractInfo[1],
        assetName: fungibleToken?.assetName ?? '',
        publicKey: stxPublicKey,
        network: selectedNetwork,
        pendingTxs: stxPendingTxData?.pendingTransactions ?? [],
        memo,
      };
      const unsignedTx: StacksTransaction = await generateUnsignedTransaction(unsginedTx);

      const fee: bigint = BigInt(unsignedTx.auth.spendingCondition.fee.toString()) ?? BigInt(0);
      if (feeMultipliers?.stxSendTxMultiplier) {
        unsignedTx.setFee(fee * BigInt(feeMultipliers.stxSendTxMultiplier));
      }

      return unsignedTx;
    },
  });

  useEffect(() => {
    if (data) {
      navigate('/confirm-ft-tx', {
        state: {
          unsignedTx: data.serialize().toString('hex'),
          amount: amountToSend.toString(),
          fungibleToken,
          memo: txMemo,
          recepientAddress,
        },
      });
    }
  }, [data]);

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  const getBalance = () => {
    if (fungibleToken?.decimals) {
      return ftDecimals(fungibleToken.balance, fungibleToken.decimals);
    }
    return fungibleToken?.balance;
  };

  const [show, setShow] = useState(false);
  function validateFields(associatedAddress: string, amount: string, memo: string): boolean {
    if (!associatedAddress) {
      setAddressError(t('ERRORS.ADDRESS_REQUIRED'));
      return false;
    }

    if (!amount) {
      setAmountError(t('ERRORS.AMOUNT_REQUIRED'));
      return false;
    }
    if (!validateStxAddress({ stxAddress: associatedAddress, network: network.type })) {
      setAddressError(t('ERRORS.ADDRESS_INVALID'));
      return false;
    }

    if (associatedAddress === stxAddress) {
      setAddressError(t('ERRORS.SEND_TO_SELF'));
      return false;
    }

    if (Number(amount) <= 0) {
      setAmountError(t('ERRORS.INVALID_AMOUNT'));
      return false;
    }

    if (fungibleToken?.decimals && amount.split('.')[1]?.length > fungibleToken.decimals) {
      setAmountError(t('ERRORS.INVALID_AMOUNT'));
      return false;
    }

    if (fungibleToken?.decimals === 0 && amount.indexOf('.') !== -1) {
      setAmountError(t('ERRORS.INVALID_AMOUNT'));
      return false;
    }

    const ftBalance = fungibleToken?.decimals
      ? ftDecimals(fungibleToken.balance, fungibleToken.decimals)
      : fungibleToken?.balance;

    try {
      if (Number.isNaN(Number(amount))) {
        setAmountError(t('ERRORS.INVALID_AMOUNT'));
        return false;
      }
      if (Number(amount) > Number(ftBalance)) {
        setAmountError(t('ERRORS.INSUFFICIENT_BALANCE'));
        return false;
      }
    } catch (e) {
      setAmountError(t('ERRORS.INVALID_AMOUNT'));
      return false;
    }

    if (memo) {
      if (Buffer.from(memo).byteLength >= 34) {
        setMemoError(t('ERRORS.MEMO_LENGTH'));
        return false;
      }
    }

    return true;
  }

  const onPressSendSTX = async (associatedAddress: string, amount: string, memo?: string) => {
    const modifyAmount = replaceCommaByDot(amount);
    const addMemo = memo ?? '';
    if (validateFields(associatedAddress.trim(), modifyAmount, memo!)) {
      setAddressError('');
      setMemoError('');
      setAmountError('');
      mutate({ amount, associatedAddress, memo: addMemo });
    }
  };

  function getFtFiatEquivalent() {
    if (fungibleToken?.tokenFiatRate) {
      const balance = new BigNumber(getFtBalance(fungibleToken));
      const rate = new BigNumber(fungibleToken.tokenFiatRate);
      return balance.multipliedBy(rate).toFixed(2).toString();
    }
    return undefined;
  }
  const getImageSourceForFt = () => {
    switch (fungibleToken?.ticker) {
      case 'sUSDT':
        return IconUsdt;
      case 'xBTC':
        return IconWbtc;
      case 'xUSD':
        return IconUsdc;
      default:
        return fungibleToken?.image;
    }
  };
  const getContents = () => {
    const contents = [
      {
        name: 'Bitcoin BTC',
        key: 'BTC',
        handler: () => {
          navigate('/send-btc');
        },
      },
      {
        name: 'Stacks STX',
        key: 'STX',
        handler: () => {
          navigate('/send-stx');
        },
      },
    ];
    const visibleCoins = coinsList?.filter((coin) => coin.visible);
    visibleCoins?.forEach((coin) =>
      contents.push({
        name: `${coin.name} ${coin.ticker}`,
        key: `${coin.ticker}`,
        handler: () => {
          setShow(false);
          navigate(`/send-ft?coinTicker=${coin.ticker}`);
        },
      }),
    );
    return contents;
  };

  return (
    <>
      <OperationHeader
        currency={fungibleToken?.ticker}
        accountBalance={getBalance()}
        fiatCurrency={fiatCurrency}
        fiatBalance={getFtFiatEquivalent()}
        operationTitle="Send"
        currencyIcon={getImageSourceForFt()}
        operationIcon={Send}
      />
      {show && (
        <CoinSwitch visible={show} onClose={() => setShow(false)} contents={getContents()} />
      )}
      <SendForm
        processing={isLoading}
        currencyType="FT"
        amountError={amountError}
        recepientError={addressError}
        memoError={memoError}
        fungibleToken={fungibleToken}
        balance={getBalance()}
        onPressSend={onPressSendSTX}
        recipient={recipientAddress!}
        amountToSend={ftAmountToSend!}
        stxMemo={stxMemo!}
        toggleCoinSwitch={() => setShow(true)}
      />
    </>
  );
}

export default SendFtScreen;
