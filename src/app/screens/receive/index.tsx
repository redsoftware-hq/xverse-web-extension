import Copy from '@assets/img/NewCopy.svg';
import ActionButton from '@components/button';
import InfoContainer from '@components/infoContainer';
import ShowBtcReceiveAlert from '@components/showBtcReceiveAlert';
import ShowOrdinalReceiveAlert from '@components/showOrdinalReceiveAlert';
import StyledTooltip from '@components/styledTooltip';
import TopRow from '@components/topRow';
import useWalletSelector from '@hooks/useWalletSelector';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const OuterContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TopTitleText = styled.h1((props) => ({
  ...props.theme.headline_s,
  textAlign: 'center',
}));

const ReceiveScreenText = styled.h1((props) => ({
  ...props.theme.body_m,
  textAlign: 'center',
  color: props.theme.colors.secondaryText,
  padding: props.theme.spacing(8),
  marginBottom: props.theme.spacing(6),
  marginTop: props.theme.spacing(20),
}));

const BnsNameText = styled.h1((props) => ({
  ...props.theme.body_bold_l,
  textAlign: 'center',
  marginBottom: 2,
}));

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: 1,
});

const AddressContainer = styled.div((props) => ({
  display: 'flex',
  marginLeft: props.theme.spacing(18),
  marginRight: props.theme.spacing(18),
}));

const WarningContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 328,
  justifyContent: 'center',
  marginTop: props.theme.spacing(11),
}));

const QRCodeContainer = styled.div((props) => ({
  display: 'flex',
  aspectRatio: 1,
  backgroundColor: props.theme.colors.white_0,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 8,
  padding: props.theme.spacing(5),
  marginBottom: props.theme.spacing(12),
}));

const AddressText = styled.h1((props) => ({
  ...props.theme.body_medium_2xl,
  textAlign: 'center',
  color: props.theme.colors.white_200,
  wordBreak: 'break-all',
}));

const InfoAlertContainer = styled.div({
  width: '100%',
});

const IconButton = styled.button<{ isSTX: boolean; isTestnet: boolean }>((props) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  background: 'transparent',
  marginLeft: 'auto',
  marginTop: '-25px',
  marginRight:
    props.isSTX && props.isTestnet
      ? '0px'
      : props.isTestnet
      ? '36px'
      : props.isSTX
      ? '-7px'
      : '49px',
}));

function Receive(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'RECEIVE' });
  const [addressCopied, setAddressCopied] = useState(false);
  const [isBtcReceiveAlertVisible, setIsBtcReceiveAlertVisible] = useState(false);
  const [isOrdinalReceiveAlertVisible, setIsOrdinalReceiveAlertVisible] = useState(false);
  const { network } = useWalletSelector();
  const navigate = useNavigate();
  const {
    stxAddress,
    btcAddress,
    ordinalsAddress,
    selectedAccount,
    showBtcReceiveAlert,
    showOrdinalReceiveAlert,
  } = useWalletSelector();

  const { currency } = useParams();

  const getAddress = () => {
    switch (currency) {
      case 'STX':
        return stxAddress;
      case 'BTC':
        return btcAddress;
      case 'FT':
        return stxAddress;
      case 'ORD':
        return ordinalsAddress;
      default:
        return '';
    }
  };
  const handleBackButtonClick = () => {
    navigate(-1);
  };

  // const renderHeading = () => {
  //   if (currency === 'BTC') {
  //     return <TopTitleText>{t('BTC_ADDRESS')}</TopTitleText>;
  //   }
  //   if (currency === 'ORD') {
  //     return <TopTitleText>{t('ORDINAL_ADDRESS')}</TopTitleText>;
  //   }
  //   return <TopTitleText>{t('STX_ADDRESS')}</TopTitleText>;
  // };

  const onReceiveAlertClose = () => {
    setIsBtcReceiveAlertVisible(false);
  };

  const onOrdinalReceiveAlertClose = () => {
    setIsOrdinalReceiveAlertVisible(false);
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleOnClick = () => {
    navigator.clipboard.writeText(getAddress());
    setAddressCopied(true);
    if (currency === 'BTC' && showBtcReceiveAlert) {
      setIsBtcReceiveAlertVisible(true);
    }
    if (currency === 'ORD' && showOrdinalReceiveAlert) {
      setIsOrdinalReceiveAlertVisible(true);
    }
  };

  return (
    <>
      <TopRow title={t('RECEIVE')} onClick={handleBackButtonClick} />
      <OuterContainer>
        <Container>
          {/* {renderHeading()} */}
          <QRCodeContainer>
            <QRCode value={getAddress()} size={150} />
          </QRCodeContainer>
          {currency !== 'BTC' && currency !== 'ORD' && !!selectedAccount?.bnsName && (
            <BnsNameText>{selectedAccount?.bnsName}</BnsNameText>
          )}
          <AddressContainer>
            <AddressText>
              {getAddress()}
              <IconButton
                onClick={handleOnClick}
                isSTX={currency !== 'BTC' && currency !== 'ORD'}
                isTestnet={network.type === 'Testnet'}
              >
                <img id="copy-address" src={Copy} alt="copy" />
              </IconButton>
            </AddressText>

            <StyledTooltip
              anchorSelect="copy-address"
              content={addressCopied ? 'Copied' : 'Copy'}
              noArrow
              place="bottom"
            />
          </AddressContainer>
          <WarningContainer>
            {currency === 'ORD' && (
              <InfoAlertContainer>
                <InfoContainer bodyText={t('ORDINALS_RECEIVE_MESSAGE')} showWarningText />
              </InfoAlertContainer>
            )}
            {currency === 'BTC' && (
              <InfoAlertContainer>
                <InfoContainer bodyText={t('BTC_RECEIVE_MESSAGE')} showWarningText />
              </InfoAlertContainer>
            )}
            {currency !== 'BTC' && currency !== 'ORD' && (
              <InfoAlertContainer>
                <ReceiveScreenText>{t('STX_ADDRESS_DESC')}</ReceiveScreenText>
              </InfoAlertContainer>
            )}
            <ActionButton text={t('CLOSE')} onPress={handleClose} />
          </WarningContainer>
        </Container>
      </OuterContainer>
      {isBtcReceiveAlertVisible && (
        <ShowBtcReceiveAlert onReceiveAlertClose={onReceiveAlertClose} />
      )}
      {isOrdinalReceiveAlertVisible && (
        <ShowOrdinalReceiveAlert onOrdinalReceiveAlertClose={onOrdinalReceiveAlertClose} />
      )}
    </>
  );
}

export default Receive;
