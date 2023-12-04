/* eslint-disable no-inline-styles/no-inline-styles */
import LogoStatusHeader from '@components/logoStatusHeader';
import TopRow from '@components/topRow';
import useDebounce from '@hooks/useDebounce';
import useOrdinalsByAddress from '@hooks/useOrdinalsByAddress';
import useWalletSelector from '@hooks/useWalletSelector';
import {
  ErrorCodes,
  getBtcFiatEquivalent,
  getStxFiatEquivalent,
  stxToMicrostacks,
  UTXO,
} from '@secretkeylabs/xverse-core';
import {
  getBtcFees,
  getBtcFeesForNonOrdinalBtcSend,
  getBtcFeesForOrdinalSend,
  Recipient,
} from '@secretkeylabs/xverse-core/transactions/btc';
import { currencySymbolMap } from '@secretkeylabs/xverse-core/types/currency';
import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NumericFormat } from 'react-number-format';
import styled from 'styled-components';

const Container = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: props.theme.spacing(2),
}));

const FiatAmountText = styled.h1((props) => ({
  ...props.theme.body_xs,
  color: props.theme.colors.white_400,
}));

const DetailText = styled.h1((props) => ({
  ...props.theme.body_medium_xl,
  color: props.theme.colors.white_200,
  marginTop: props.theme.spacing(8),
  marginLeft: props.theme.spacing(8),
  marginRight: props.theme.spacing(8),
}));

const Text = styled.h1((props) => ({
  ...props.theme.body_medium_xl,
  marginTop: props.theme.spacing(8),
  marginLeft: props.theme.spacing(8),
  marginRight: props.theme.spacing(8),
}));

interface InputContainerProps {
  withError?: boolean;
}
const InputContainer = styled.div<InputContainerProps>((props) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: props.theme.spacing(4),
  marginBottom: props.theme.spacing(6),
  marginLeft: props.theme.spacing(8),
  marginRight: props.theme.spacing(8),
  border: `1px solid ${
    props.withError ? props.theme.colors.feedback.error : props.theme.colors.elevation6
  }`,
  background: props.theme.colors.background.orangePillBg,
  borderRadius: props.theme.radius(1),
  paddingLeft: props.theme.spacing(5),
  paddingRight: props.theme.spacing(5),
  paddingTop: props.theme.spacing(5),
  paddingBottom: props.theme.spacing(5),
}));

const InputField = styled.input((props) => ({
  ...props.theme.body_medium_xl,
  backgroundColor: 'transparent',
  color: props.theme.colors.white_0,
  border: 'transparent',
  width: '50%',
  '::placeholder': {
    color: props.theme.colors.secondaryText,
  },
  '&::-webkit-outer-spin-button': {
    '-webkit-appearance': 'none',
    margin: 0,
  },
  '&::-webkit-inner-spin-button': {
    '-webkit-appearance': 'none',
    margin: 0,
  },
  '&[type=number]': {
    '-moz-appearance': 'textfield',
  },
}));

const FeeText = styled.h1((props) => ({
  ...props.theme.body_m,
  color: props.theme.colors.white_0,
}));

const SubText = styled.h1((props) => ({
  ...props.theme.body_xs,
  color: props.theme.colors.white_400,
}));

interface ButtonProps {
  isSelected: boolean;
  isLastInRow?: boolean;
  isBtc?: boolean;
}
const FeeButton = styled.button<ButtonProps>((props) => ({
  ...props.theme.body_medium_m,
  color: `${props.isSelected ? props.theme.colors.action.classic : props.theme.colors.white_400}`,
  background: `${props.isSelected ? 'rgba(210, 52, 3, 0.20)' : 'rgba(98, 106, 130, 0.20)'}`,
  border: `1px solid ${props.isSelected ? 'transparent' : 'unset'}`,
  borderRadius: 40,
  width: props.isBtc ? 104 : 82,
  maxWidth: 79,
  height: 40,
  display: 'flex',
  maxHeight: 30,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: props.isLastInRow ? 0 : 8,
}));

const ButtonContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  marginTop: 4,
  marginLeft: props.theme.spacing(8),
  marginRight: props.theme.spacing(8),
}));

const FeeContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const TickerContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  flex: 1,
});

const Header = styled.h1((props) => ({
  ...props.theme.mont_tile_text,
  color: props.theme.colors.action.classic,
  marginTop: props.theme.spacing(6),
}));
const ErrorText = styled.h1((props) => ({
  ...props.theme.body_xs,
  color: props.theme.colors.feedback.error,
  marginBottom: props.theme.spacing(2),
}));

// TODO tim: this component needs refactoring. separate business logic from presentation
interface Props {
  type?: string;
  fee: string;
  feeRate?: BigNumber | string;
  btcRecipients?: Recipient[];
  ordinalTxUtxo?: UTXO;
  isRestoreFlow?: boolean;
  nonOrdinalUtxos?: UTXO[];
  feeMode: string;
  error: string;
  setIsLoading: () => void;
  setIsNotLoading: () => void;
  setFee: (fee: string) => void;
  setFeeRate: (feeRate: string) => void;
  setFeeMode: (feeMode: string) => void;
  setError: (error: string) => void;
  handleBack: () => void;
}
function EditFee({
  type,
  fee,
  feeRate,
  btcRecipients,
  ordinalTxUtxo,
  isRestoreFlow,
  nonOrdinalUtxos,
  feeMode,
  error,
  setIsLoading,
  setIsNotLoading,
  setFee,
  setFeeRate,
  setError,
  setFeeMode,
  handleBack,
}: Props) {
  const { t } = useTranslation('translation');
  const {
    network,
    btcAddress,
    stxBtcRate,
    btcFiatRate,
    fiatCurrency,
    selectedAccount,
    ordinalsAddress,
  } = useWalletSelector();
  const [totalFee, setTotalFee] = useState(fee);
  const [feeRateInput, setFeeRateInput] = useState(feeRate?.toString() ?? '');
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedFeeRateInput = useDebounce(feeRateInput, 500);
  const isBtcOrOrdinals = type === 'BTC' || type === 'Ordinals';
  const isStx = type === 'STX';
  const { ordinals } = useOrdinalsByAddress(btcAddress);
  const ordinalsUtxos = useMemo(() => ordinals?.map((ord) => ord.utxo), [ordinals]);

  const modifyStxFees = (mode: string) => {
    const currentFee = new BigNumber(fee);
    setFeeMode(mode);
    setError('');
    switch (mode) {
      case 'low':
        setFeeRateInput(currentFee.dividedBy(2).toString());
        setTotalFee(currentFee.dividedBy(2).toString());
        break;
      case 'standard':
        setFeeRateInput(currentFee.toString());
        setTotalFee(currentFee.toString());
        break;
      case 'high':
        setFeeRateInput(currentFee.multipliedBy(2).toString());
        setTotalFee(currentFee.multipliedBy(2).toString());
        break;
      case 'custom':
        inputRef.current?.focus();
        break;
      default:
        break;
    }
  };

  const modifyFees = async (mode: string) => {
    try {
      setFeeMode(mode);
      setIsLoading();
      setError('');
      if (mode === 'custom') inputRef?.current?.focus();
      else if (type === 'BTC') {
        if (isRestoreFlow) {
          const { fee: modifiedFee, selectedFeeRate } = await getBtcFeesForNonOrdinalBtcSend(
            btcAddress,
            nonOrdinalUtxos!,
            ordinalsAddress,
            network.type,
            mode,
          );
          setFeeRateInput(selectedFeeRate?.toString() || '');
          setTotalFee(modifiedFee.toString());
        } else if (btcRecipients && selectedAccount) {
          const { fee: modifiedFee, selectedFeeRate } = await getBtcFees(
            btcRecipients,
            btcAddress,
            network.type,
            mode,
          );
          setFeeRateInput(selectedFeeRate?.toString() || '');
          setTotalFee(modifiedFee.toString());
        }
      } else if (type === 'Ordinals' && btcRecipients && ordinalTxUtxo) {
        const { fee: modifiedFee, selectedFeeRate } = await getBtcFeesForOrdinalSend(
          btcRecipients[0].address,
          ordinalTxUtxo,
          btcAddress,
          network.type,
          ordinalsUtxos || [],
          mode,
        );
        setFeeRateInput(selectedFeeRate?.toString() || '');
        setTotalFee(modifiedFee.toString());
      }
    } catch (err: any) {
      if (Number(err) === ErrorCodes.InSufficientBalance) {
        setError(t('TX_ERRORS.INSUFFICIENT_BALANCE'));
      } else if (Number(err) === ErrorCodes.InSufficientBalanceWithTxFee) {
        setError(t('TX_ERRORS.INSUFFICIENT_BALANCE_FEES'));
      } else setError(err.toString());
    } finally {
      setIsNotLoading();
    }
  };

  useEffect(() => {
    if (isStx && feeMode !== 'custom') {
      modifyStxFees(feeMode);
    }
  }, [feeMode]);

  useEffect(() => {
    setFee(totalFee);
  }, [totalFee]);

  const recalculateFees = async () => {
    if (type === 'BTC') {
      try {
        setIsLoading();
        setError('');

        if (isRestoreFlow) {
          const { fee: modifiedFee, selectedFeeRate } = await getBtcFeesForNonOrdinalBtcSend(
            btcAddress,
            nonOrdinalUtxos!,
            ordinalsAddress,
            network.type,
            feeMode,
            feeRateInput,
          );
          setFeeRateInput(selectedFeeRate!.toString());
          setTotalFee(modifiedFee.toString());
        } else if (btcRecipients && selectedAccount) {
          const { fee: modifiedFee, selectedFeeRate } = await getBtcFees(
            btcRecipients,
            btcAddress,
            network.type,
            feeMode,
            feeRateInput,
          );
          setFeeRateInput(selectedFeeRate!.toString());
          setTotalFee(modifiedFee.toString());
        }
      } catch (err: any) {
        if (Number(err) === ErrorCodes.InSufficientBalance) {
          setError(t('TX_ERRORS.INSUFFICIENT_BALANCE'));
        } else if (Number(err) === ErrorCodes.InSufficientBalanceWithTxFee) {
          setError(t('TX_ERRORS.INSUFFICIENT_BALANCE_FEES'));
        } else setError(err.toString());
      } finally {
        setIsNotLoading();
      }
    } else if (type === 'Ordinals' && btcRecipients && ordinalTxUtxo) {
      try {
        setIsLoading();
        setError('');

        const { fee: modifiedFee, selectedFeeRate } = await getBtcFeesForOrdinalSend(
          btcRecipients[0].address,
          ordinalTxUtxo,
          btcAddress,
          network.type,
          ordinalsUtxos || [],
          feeMode,
          feeRateInput,
        );
        setFeeRateInput(selectedFeeRate!.toString());
        setTotalFee(modifiedFee.toString());
      } catch (err: any) {
        if (Number(err) === ErrorCodes.InSufficientBalance) {
          setError(t('TX_ERRORS.INSUFFICIENT_BALANCE'));
        } else if (Number(err) === ErrorCodes.InSufficientBalanceWithTxFee) {
          setError(t('TX_ERRORS.INSUFFICIENT_BALANCE_FEES'));
        } else setError(err.toString());
      } finally {
        setIsNotLoading();
      }
    }
  };

  useEffect(() => {
    if (feeRateInput) {
      setFeeRate(feeRateInput);
    }
  }, [feeRateInput]);

  useEffect(() => {
    if (debouncedFeeRateInput) {
      recalculateFees();
    }
  }, [debouncedFeeRateInput]);

  function getFiatEquivalent() {
    return isStx
      ? getStxFiatEquivalent(
          stxToMicrostacks(new BigNumber(totalFee)),
          BigNumber(stxBtcRate),
          BigNumber(btcFiatRate),
        )
      : getBtcFiatEquivalent(new BigNumber(totalFee), BigNumber(btcFiatRate));
  }

  const getFiatAmountString = (fiatAmount: BigNumber) => {
    if (fiatAmount) {
      if (fiatAmount.isLessThan(0.01)) {
        return `<${currencySymbolMap[fiatCurrency]}0.01 ${fiatCurrency}`;
      }
      return (
        <NumericFormat
          value={fiatAmount.toFixed(2).toString()}
          displayType="text"
          thousandSeparator
          prefix={`~ ${currencySymbolMap[fiatCurrency]} `}
          suffix={` ${fiatCurrency}`}
          renderText={(value: string) => <FiatAmountText>{value}</FiatAmountText>}
        />
      );
    }
    return '';
  };

  const onInputEditFeesChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError('');
    }

    if (feeMode !== 'custom') {
      setFeeMode('custom');
    }

    setFeeRateInput(value);

    if (type !== 'BTC' && type !== 'Ordinals') {
      setFeeRateInput(value);
      setTotalFee(value);
    }
  };

  return (
    <Container>
      <TopRow title={t('TRANSACTION_SETTING.EDIT_FEE')} onClick={handleBack} />
      {/* <LogoStatusHeader
        style={{
          paddingLeft: '0px',
          paddingBottom: '0px',
          paddingRight: '0px',
          paddingTop: '16px',
        }}
        status={`Account ${
          selectedAccount?.id === 0 ? selectedAccount.id + 1 : selectedAccount?.id
        }`}
      /> */}
      {/* <Header>{t('TRANSACTION_SETTING.EDIT_FEE')}</Header> */}
      <DetailText>{t('TRANSACTION_SETTING.FEE_INFO')}</DetailText>
      <FeeContainer>
        <Text>{t('TRANSACTION_SETTING.FEE')}</Text>
        <InputContainer withError={!!error}>
          <InputField
            type="number"
            ref={inputRef}
            value={feeRateInput?.toString()}
            placeholder="0"
            onChange={onInputEditFeesChange}
          />
          {/* {isBtcOrOrdinals && <FeeText>sats /vB</FeeText>} */}
          <TickerContainer>
            {isBtcOrOrdinals && (
              <NumericFormat
                value={totalFee}
                displayType="text"
                thousandSeparator
                suffix=" sats"
                renderText={(value: string) => <FeeText>{value}</FeeText>}
              />
            )}
            <SubText>{getFiatAmountString(getFiatEquivalent())}</SubText>
          </TickerContainer>
        </InputContainer>
        {error && <ErrorText>{error}</ErrorText>}
      </FeeContainer>
      <ButtonContainer>
        {isStx && (
          <FeeButton isSelected={feeMode === 'low'} onClick={() => modifyStxFees('low')}>
            {t('TRANSACTION_SETTING.LOW')}
          </FeeButton>
        )}
        <FeeButton
          isSelected={feeMode === 'standard'}
          isBtc={isBtcOrOrdinals}
          onClick={() => (isStx ? modifyStxFees('standard') : modifyFees('standard'))}
        >
          {t('TRANSACTION_SETTING.STANDARD')}
        </FeeButton>
        <FeeButton
          isSelected={feeMode === 'high'}
          isBtc={isBtcOrOrdinals}
          onClick={() => (isStx ? modifyStxFees('high') : modifyFees('high'))}
        >
          {t('TRANSACTION_SETTING.HIGH')}
        </FeeButton>
        <FeeButton
          isSelected={feeMode === 'custom'}
          isLastInRow
          isBtc={isBtcOrOrdinals}
          onClick={() => (isStx ? modifyStxFees('custom') : modifyFees('custom'))}
        >
          {t('TRANSACTION_SETTING.CUSTOM')}
        </FeeButton>
      </ButtonContainer>
    </Container>
  );
}

export default EditFee;
