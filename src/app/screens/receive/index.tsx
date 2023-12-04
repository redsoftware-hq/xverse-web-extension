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
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const BnsNameText = styled.h1((props) => ({
  ...props.theme.body_bold_l,
  textAlign: 'center',
  marginBottom: 2,
}));

const Container = styled.div<{ isORD: boolean; isTestnet: boolean }>((props) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: 1,
  marginBottom: props.isTestnet ? 0 : props.isORD ? 24 : 26,
}));

const AddressContainer = styled.div((props) => ({
  display: 'flex',
  marginLeft: props.theme.spacing(18),
  marginRight: props.theme.spacing(18),
}));

const WarningContainer = styled.div<{ isOrd: boolean }>((props) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 328,
  justifyContent: 'center',
  marginTop: props.isOrd ? 15 : props.theme.spacing(11),
  marginBottom: 6,
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

const AddressText = styled.h1<{ isOrdinal: boolean }>((props) => ({
  ...props.theme.body_medium_2xl,
  textAlign: 'center',
  color: props.theme.colors.white_0,
  wordBreak: 'break-all',
  fontSize: props.isOrdinal ? props.theme.body_m.fontSize : props.theme.body_medium_2xl.fontSize,
}));

const InfoAlertContainer = styled.div({
  width: '100%',
});

const ButtonContainer = styled.div((props) => ({
  paddingBottom: 16,
  width: '100%',
}));

const IconButton = styled.button<{ isSTX: boolean; isTestnet: boolean; isOrd: boolean }>(
  (props) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    background: 'transparent',
    marginLeft: 'auto',
    marginTop: props.isOrd ? '-18px' : '-25px',
    marginRight:
      props.isSTX && props.isTestnet
        ? '0px'
        : props.isTestnet
        ? '8px'
        : props.isSTX
        ? '-7px'
        : props.isOrd
        ? '10px'
        : '49px',
  }),
);

const Top = styled.div((props) => ({
  marginTop: props.theme.spacing(10),
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  marginBottom: 8,
}));
const Bottom = styled.div((props) => ({
  flex: 'none',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: props.theme.spacing(10),
  marginRight: props.theme.spacing(10),
  marginBottom: props.theme.spacing(20),
}));
const Layout = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
}));
function Receive(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'RECEIVE' });
  const [addressCopied, setAddressCopied] = useState(false);
  const [isBtcReceiveAlertVisible, setIsBtcReceiveAlertVisible] = useState(false);
  const [isOrdinalReceiveAlertVisible, setIsOrdinalReceiveAlertVisible] = useState(false);
  const { network } = useWalletSelector();
  const location = useLocation();
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
    <Layout>
      <Top>
        <TopRow title={location.state.header} onClick={handleBackButtonClick} />
      </Top>
      <Container isORD={currency === 'ORD'} isTestnet={network.type === 'Testnet'}>
        <QRCodeContainer>
          <QRCode value={getAddress()} size={currency === 'ORD' ? 124 : 150} />
        </QRCodeContainer>
        {currency !== 'BTC' && currency !== 'ORD' && !!selectedAccount?.bnsName && (
          <BnsNameText>{selectedAccount?.bnsName}</BnsNameText>
        )}
        <AddressContainer>
          <AddressText isOrdinal={currency === 'ORD'}>
            {getAddress()}
            <IconButton
              onClick={handleOnClick}
              isOrd={currency === 'ORD'}
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
      </Container>
      {isBtcReceiveAlertVisible && (
        <ShowBtcReceiveAlert onReceiveAlertClose={onReceiveAlertClose} />
      )}
      {isOrdinalReceiveAlertVisible && (
        <ShowOrdinalReceiveAlert onOrdinalReceiveAlertClose={onOrdinalReceiveAlertClose} />
      )}
      <Bottom>
        <WarningContainer isOrd={currency === 'ORD'}>
          {currency === 'ORD' && (
            <InfoAlertContainer>
              <InfoContainer
                bodyText={t('ORDINALS_RECEIVE_MESSAGE')}
                showWarningText
                styleContainer={network.type === 'Testnet' ? { paddingTop: 18 } : {}}
              />
            </InfoAlertContainer>
          )}
          {currency === 'BTC' && (
            <InfoAlertContainer>
              <InfoContainer
                bodyText={t('BTC_RECEIVE_MESSAGE')}
                showWarningText
                styleContainer={network.type === 'Testnet' ? { paddingTop: 20 } : {}}
              />
            </InfoAlertContainer>
          )}
          {currency !== 'BTC' && currency !== 'ORD' && (
            <InfoAlertContainer>
              <InfoContainer
                bodyText={t('STX_RECEIVE_MESSAGE')}
                showWarningText
                styleContainer={network.type === 'Testnet' ? { paddingTop: 18 } : {}}
              />
            </InfoAlertContainer>
          )}
        </WarningContainer>
        <ButtonContainer>
          <ActionButton text={t('CLOSE')} onPress={handleClose} />
        </ButtonContainer>
      </Bottom>
    </Layout>
  );
}

export default Receive;
