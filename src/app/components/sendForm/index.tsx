import { CurrencyTypes } from '@utils/constant';
import { FungibleToken, getTicker } from '@utils/utils';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { SetStateAction, useState } from 'react';
import BigNumber from 'bignumber.js';
import IconBitcoin from '@assets/img/send/ic_sats_ticker.svg';
import IconStacks from '@assets/img/dashboard/stack_icon.svg';
import InfoIcon from '@assets/img/send/info.svg';
import {
  btcToSats,
  getBtcFiatEquivalent,
  getStxFiatEquivalent,
  stxToMicrostacks,
} from '@utils/walletUtils';

const OuterContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
}));

const RowContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}));

const InfoContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  marginTop: props.theme.spacing(11),
  marginLeft: props.theme.spacing(8),
  marginRight: props.theme.spacing(8),
  padding: props.theme.spacing(8),
  border: `1px solid ${props.theme.colors.background.elevation3}`,
  borderRadius: 8,
}));

const Container = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  marginTop: props.theme.spacing(11),
  marginLeft: props.theme.spacing(8),
  marginRight: props.theme.spacing(8),
}));

const ErrorContainer = styled.div((props) => ({
  marginTop: props.theme.spacing(8),
  marginLeft: props.theme.spacing(10),
  marginRight: props.theme.spacing(10),
}));

const ErrorText = styled.h1((props) => ({
  ...props.theme.body_xs,
  color: props.theme.colors.feedback.error,
}));

const TextContainer = styled.div((props) => ({
  marginLeft: props.theme.spacing(5),
}));

const InputFieldContainer = styled.div(() => ({
  flex: 1,
}));

const TickerContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row-reverse',
  alignItems: 'center',
}));

const TitleText = styled.h1((props) => ({
  ...props.theme.body_medium_m,
  flex: 1,
  display: 'flex',
}));

const Text = styled.h1((props) => ({
  ...props.theme.body_medium_m,
}));

const SubText = styled.h1((props) => ({
  ...props.theme.body_xs,
  color: props.theme.colors.white['400'],
}));

const BalanceText = styled.h1((props) => ({
  ...props.theme.body_medium_m,
  color: props.theme.colors.white['400'],
  marginRight: props.theme.spacing(4),
}));

const InputField = styled.input((props) => ({
  backgroundColor: props.theme.colors.background['elevation-1'],
  color: props.theme.colors.white['400'],
  font: props.theme.body_m,
  width: '100%',
  border: 'transparent',
}));

const AmountInputContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: props.theme.spacing(4),
  marginBottom: props.theme.spacing(4),
  border: `1px solid ${props.theme.colors.background.elevation3}`,
  backgroundColor: props.theme.colors.background['elevation-1'],
  borderRadius: 8,
  paddingLeft: props.theme.spacing(5),
  paddingRight: props.theme.spacing(5),
  paddingTop: props.theme.spacing(8),
  paddingBottom: props.theme.spacing(7),
}));

const TickerImage = styled.img((props) => ({
  marginRight: props.theme.spacing(3),
  alignSelf: 'center',
  height: 23,
  width: 26,
}));

const SendButton = styled.button((props) => ({
  width: 330,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: props.theme.spacing(8),
  marginRight: props.theme.spacing(8),
  backgroundColor: props.theme.colors.action.classic,
  padding: props.theme.spacing(7),
  borderRadius: props.theme.radius(1),
  marginTop: props.theme.spacing(11),
  marginBottom: props.theme.spacing(11),
}));

const ButtonText = styled.div((props) => ({
  ...props.theme.body_xs,
  fontWeight: 700,
  color: props.theme.colors.white['0'],
  textAlign: 'center',
}));

interface Props {
  onPressSend: (recipientID: string, amount: string, memo: string) => void;
  onFormFilled?: (recipientID: string, amount: string, memo: string) => void;
  currencyType: CurrencyTypes;
  recipientAddress?: string;
  error?: string;
  processing?: boolean;
  disabled?: boolean;
  fungibleToken?: FungibleToken;
  disableAmountInput?: boolean;
  balanceText?: React.ReactNode;
  balance?: number;
  showNetwork?: boolean;
  hideAddress?: boolean;
  hideMemo?: boolean;
  buttonText?: string;
}

function SendForm({
  onPressSend,
  currencyType,
  error,
  processing,
  disabled = true,
  fungibleToken,
  disableAmountInput,
  balanceText,
  balance,
  showNetwork = true,
  hideAddress = false,
  hideMemo = false,
  buttonText,
}: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'SEND' });
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [fiatAmount, setFiatAmount] = useState('0');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);

  /*const {stxBtcRate, btcFiatRate, fiatCurrency} = useSelector(
    (state: StoreState) => state.walletState,
  );*/
  const stxBtcRate = 0.00001686;
  const btcFiatRate = 18935.735;
  const fiatCurrency = 'USD';

  function getFiatEquivalent(amount: number) {
    if ((currencyType === 'FT' && !fungibleToken?.tokenFiatRate) || currencyType === 'NFT')
      return '';
    if (!amount) return '0';
    switch (currencyType) {
      case 'STX':
        return getStxFiatEquivalent(
          stxToMicrostacks(new BigNumber(amount)),
          new BigNumber(stxBtcRate),
          new BigNumber(btcFiatRate)
        )
          .toFixed(2)
          .toString();
      case 'BTC':
        return getBtcFiatEquivalent(btcToSats(new BigNumber(amount)), new BigNumber(btcFiatRate))
          .toFixed(2)
          .toString();
      case 'FT':
        if (fungibleToken?.tokenFiatRate) {
          return new BigNumber(amount)
            .multipliedBy(fungibleToken.tokenFiatRate)
            .toFixed(2)
            .toString();
        }
        return '';
    }
  }

  function getTokenIcon() {
    if (currencyType == 'STX') {
      return <TickerImage src={IconStacks} />;
    } else if (currencyType == 'BTC') {
      return <TickerImage src={IconBitcoin} />;
    } else {
      return null;
    }
  }

  function getTokenCurrency() {
    if (fungibleToken) {
      if (fungibleToken?.ticker) {
        return fungibleToken.ticker.toUpperCase();
      } else if (fungibleToken?.name) {
        return getTicker(fungibleToken.name).toUpperCase();
      }
    } else {
      return currencyType;
    }
  }

  function onInputChange(e: React.FormEvent<HTMLInputElement>) {
    const newValue = e.currentTarget.value;

    const resultRegex = /[^0-9.]/g;
    let formattedValue = parseFloat(newValue.replace(resultRegex, ''));
    if (isNaN(formattedValue)) {
      formattedValue = 0;
      setAmount('');
    } else if (formattedValue > 1000000000) {
      formattedValue = formattedValue - 1;
    } else {
      setAmount(formattedValue.toString());
    }

    const amountInCurrency: string = getFiatEquivalent(formattedValue);
    setFiatAmount(amountInCurrency);
  }

  function renderEnterAmountSection() {
    return (
      <Container>
        <RowContainer>
          <TitleText>{t('AMOUNT')}</TitleText>
          <BalanceText>{t('BALANCE')}:</BalanceText>
          <Text>{balance}</Text>
        </RowContainer>
        <AmountInputContainer>
          <InputFieldContainer>
            <InputField value={amount} placeholder="0" onChange={onInputChange} />
          </InputFieldContainer>
          <TickerContainer>
            <Text>{getTokenCurrency()}</Text>
            {getTokenIcon()}
          </TickerContainer>
        </AmountInputContainer>
        <SubText>{`~ $ ${fiatAmount} ${fiatCurrency}`}</SubText>
      </Container>
    );
  }

  function renderEnterRecepientSection() {
    return (
      <Container>
        <TitleText>{t('RECEPIENT')}</TitleText>
        <AmountInputContainer>
          <InputFieldContainer>
            <InputField
              placeholder={t('RECEPIENT_PLACEHOLDER')}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setRecipientAddress(e.target.value)
              }
            />
          </InputFieldContainer>
        </AmountInputContainer>
      </Container>
    );
  }

  function renderEnterMemoSection() {
    return (
      <Container>
        <TitleText>{t('MEMO')}</TitleText>
        <AmountInputContainer>
          <InputFieldContainer>
            <InputField
              placeholder={t('MEMO_PLACEHOLDER')}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setMemo(e.target.value)
              }
            />
          </InputFieldContainer>
        </AmountInputContainer>
      </Container>
    );
  }

  function renderMemoInfoSection() {
    return (
      <InfoContainer>
        <TickerImage src={InfoIcon} />
        <TextContainer>
          <SubText>{t('MEMO_INFO')}</SubText>
        </TextContainer>
      </InfoContainer>
    );
  }

  return (
    <>
      <OuterContainer>
        {!disableAmountInput && renderEnterAmountSection()}
        {renderEnterRecepientSection()}
        {currencyType !== 'BTC' && currencyType !== 'NFT' && !hideMemo && renderEnterMemoSection()}
        {currencyType !== 'BTC' && currencyType !== 'NFT' && !hideMemo && renderMemoInfoSection()}
      </OuterContainer>
      <ErrorContainer>
        <ErrorText>{error}</ErrorText>
      </ErrorContainer>
      <SendButton onClick={() => onPressSend(recipientAddress, amount, memo)}>
        <ButtonText>{buttonText ?? t('NEXT')}</ButtonText>
      </SendButton>
    </>
  );
}

export default SendForm;
