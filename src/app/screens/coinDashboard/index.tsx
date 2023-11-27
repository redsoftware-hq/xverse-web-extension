/* eslint-disable no-await-in-loop */
import BitcoinToken from '@assets/img/dashboard/bitcoin_token.svg';
import OrdinalsIcon from '@assets/img/dashboard/ordinalBRC20.svg';
import SIP10Icon from '@assets/img/dashboard/SIP10.svg';
import linkIcon from '@assets/img/linkIcon.svg';
import AccountHeaderComponent from '@components/accountHeader';
import BottomModal from '@components/bottomModal';
import CopyButton from '@components/copyButton';
import ReceiveCardComponent from '@components/receiveCardComponent';
import StepperNavigator from '@components/stepperNavigator';
import BottomBar from '@components/tabBar';
import useBtcWalletData from '@hooks/queries/useBtcWalletData';
import useWalletSelector from '@hooks/useWalletSelector';
import { FungibleToken } from '@secretkeylabs/xverse-core';
import { CurrencyTypes } from '@utils/constants';
import { getExplorerUrl } from '@utils/helper';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import CoinHeader from './coinHeader';
import TransactionsHistoryList from './transactionsHistoryList';

const Container = styled.div((props) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}));

const TokenContractContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: 20,
  paddingRight: 20,
  paddingTop: props.theme.spacing(16),
  paddingBottom: props.theme.spacing(42),
  background: props.theme.colors.background.darkbg,
  h1: {
    ...props.theme.body_medium_m,
    color: props.theme.colors.white[400],
  },
}));

const TransactionHistoryContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  paddingLeft: 16,
  paddingRight: 16,
  marginTop: props.theme.spacing(30),
  borderTop: `1px solid ${props.theme.colors.background.elevation2}`,
  h1: {
    ...props.theme.headline_s,
    color: props.theme.colors.white[0],
    marginTop: 32,
  },
  h2: {
    ...props.theme.body_m,
    fontStyle: 'italic',
    color: props.theme.colors.white[200],
    marginTop: 16,
  },
}));

const ContractAddressCopyButton = styled.button((props) => ({
  display: 'flex',
  marginTop: props.theme.spacing(2),
  background: 'transparent',
}));

const TokenContractAddress = styled.p((props) => ({
  ...props.theme.body_medium_l,
  color: props.theme.colors.white[0],
  textAlign: 'left',
  overflowWrap: 'break-word',
  width: 300,
}));

// const FtInfoContainer = styled.div((props) => ({
//   display: 'flex',
//   flexDirection: 'row',
//   background: props.contractSelected ? props.theme.colors.background.darkbg : 'transparent',
//   borderTopLeftRadius: '24px',
//   borderTopRightRadius: '24px',
//   paddingTop: props.theme.spacing(12),
//   marginTop: props.theme.spacing(16),
//   paddingLeft: props.theme.spacing(8),
//   paddingRight: props.theme.spacing(14),
// }));

const ShareIcon = styled.img({
  width: 18,
  height: 18,
});

const CopyButtonContainer = styled.div({
  marginRight: 4,
});

const ContractDeploymentButton = styled.button((props) => ({
  ...props.theme.body_m,
  display: 'flex',
  alignItems: 'center',
  marginTop: props.theme.spacing(12),
  background: 'none',
  color: props.theme.colors.white[400],
  span: {
    color: props.theme.colors.white[0],
    marginLeft: props.theme.spacing(3),
  },
  img: {
    marginLeft: props.theme.spacing(3),
  },
}));

const StepperContainer = styled.div({
  marginTop: 10,
});

// interface ButtonProps {
//   isSelected: boolean;
// }
// const Button = styled.button<ButtonProps>((props) => ({
//   ...props.theme.body_bold_l,
//   fontSize: 11,
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   height: 31,
//   paddingLeft: 12,
//   paddingRight: 12,
//   borderRadius: 44,
//   background: props.isSelected ? props.theme.colors.background.elevation2 : 'transparent',
//   color: props.theme.colors.white[0],
//   opacity: props.isSelected ? 1 : 0.6,
//   marginRight: 4,
// }));

const ReceiveContainer = styled.div((props) => ({
  display: 'flex',
  fontFamily: 'MontRegular',
  flexDirection: 'column',
  marginTop: props.theme.spacing(12),
  marginBottom: props.theme.spacing(16),
  paddingLeft: props.theme.spacing(8),
  paddingRight: props.theme.spacing(8),
}));
const Icon = styled.img({
  width: 24,
  height: 24,
});
const MergedIcon = styled.img({
  width: 40,
  height: 40,
});

export default function CoinDashboard() {
  const { t } = useTranslation('translation', { keyPrefix: 'COIN_DASHBOARD_SCREEN' });
  const [showFtContractDetails, setShowFtContractDetails] = useState(false);
  const { coin } = useParams();
  const [searchParams] = useSearchParams();
  const {
    coinsList,
    stxAddress,
    btcAddress,
    ordinalsAddress,
    brcCoinsList,
    showBtcReceiveAlert,
    showOrdinalReceiveAlert,
  } = useWalletSelector();
  const ftAddress = searchParams.get('ft');
  const brc20FtName = searchParams.get('brc20ft');
  useBtcWalletData();
  const ft = coinsList?.find((ftCoin) => ftCoin.principal === ftAddress);
  let brc20Ft: FungibleToken | undefined;
  if (brc20FtName) {
    brc20Ft = brcCoinsList?.find((brc20FtCoin) => brc20FtCoin.name === brc20FtName);
  }

  const openContractDeployment = () => {
    window.open(getExplorerUrl(ft?.principal as string), '_blank');
  };

  const onContractClick = () => {
    setShowFtContractDetails(true);
  };
  const handleCopyContractAddress = () => {
    navigator.clipboard.writeText(ft?.principal as string);
  };

  const onTransactionsClick = () => {
    setShowFtContractDetails(false);
  };

  function formatAddress(addr: string): string {
    return addr
      ? `${addr.substring(0, 20)}...${addr.substring(addr.length - 20, addr.length)}`
      : '';
  }
  const showContent = () => {
    if (ft) {
      if (showFtContractDetails) {
        return (
          <TokenContractContainer>
            <h1>{t('FT_CONTRACT_PREFIX')}</h1>
            <ContractAddressCopyButton onClick={handleCopyContractAddress}>
              <TokenContractAddress>{formatAddress(ft?.principal as string)}</TokenContractAddress>
              <CopyButtonContainer>
                <CopyButton text={ft?.principal as string} />
              </CopyButtonContainer>
            </ContractAddressCopyButton>
            <ContractDeploymentButton onClick={openContractDeployment}>
              {t('OPEN_FT_CONTRACT_DEPLOYMENT')}
              <span>{t('STACKS_EXPLORER')}</span>
              <ShareIcon src={linkIcon} alt="link" />
            </ContractDeploymentButton>
          </TokenContractContainer>
        );
      }
    } else if (brc20FtName) {
      return (
        <TransactionHistoryContainer>
          <h1>{t('TRANSACTION_HISTORY_TITLE')}</h1>
          <h2>{`${t('COMING_SOON')}!`}</h2>
        </TransactionHistoryContainer>
      );
    }
    return (
      <TransactionsHistoryList
        coin={coin as CurrencyTypes}
        ft={ft}
        txFilter={`${ft?.principal}::${ft?.assetName}`}
      />
    );
  };

  const navigate = useNavigate();
  const [openReceiveModal, setOpenReceiveModal] = useState(false);
  const { t: t1 } = useTranslation('translation', { keyPrefix: 'DASHBOARD_SCREEN' });
  const [isBtcReceiveAlertVisible, setIsBtcReceiveAlertVisible] = useState(false);
  const [isOrdinalReceiveAlertVisible, setIsOrdinalReceiveAlertVisible] = useState(false);
  const onReceiveModalOpen = () => {
    setOpenReceiveModal(true);
  };
  const onReceiveModalClose = () => {
    setOpenReceiveModal(false);
  };
  const onBTCReceiveSelect = () => {
    navigate('/receive/BTC');
  };
  const onSTXReceiveSelect = () => {
    navigate('/receive/STX');
  };
  const onOrdinalReceiveAlertOpen = () => {
    if (showOrdinalReceiveAlert) setIsOrdinalReceiveAlertVisible(true);
  };
  const onReceiveAlertOpen = () => {
    if (showBtcReceiveAlert) setIsBtcReceiveAlertVisible(true);
  };
  const onOrdinalsReceivePress = () => {
    navigate('/receive/ORD');
  };
  const receiveContent = (
    <ReceiveContainer>
      <ReceiveCardComponent
        title={t1('BITCOIN')}
        address={btcAddress}
        onQrAddressClick={onBTCReceiveSelect}
        onCopyAddressClick={onReceiveAlertOpen}
      >
        <Icon src={BitcoinToken} />
      </ReceiveCardComponent>

      <ReceiveCardComponent
        title={t1('ORDINALS')}
        address={ordinalsAddress}
        onQrAddressClick={onOrdinalsReceivePress}
        onCopyAddressClick={onOrdinalReceiveAlertOpen}
      >
        <MergedIcon src={OrdinalsIcon} />
      </ReceiveCardComponent>

      <ReceiveCardComponent
        title={t1('STACKS_AND_TOKEN')}
        address={stxAddress}
        onQrAddressClick={onSTXReceiveSelect}
      >
        <MergedIcon src={SIP10Icon} />
      </ReceiveCardComponent>
    </ReceiveContainer>
  );
  return (
    <>
      <AccountHeaderComponent onReceiveModalOpen={onReceiveModalOpen} />
      <Container>
        <CoinHeader coin={coin as CurrencyTypes} fungibleToken={ft || brc20Ft} />
        <StepperContainer>
          <StepperNavigator />
        </StepperContainer>
        {/* {ft && (
          <FtInfoContainer contractSelected={showFtContractDetails}>
            <Button isSelected={!showFtContractDetails} onClick={onTransactionsClick}>
              {t('TRANSACTIONS')}
            </Button>
            <Button onClick={onContractClick} isSelected={showFtContractDetails}>
              {t('CONTRACT')}
            </Button>
          </FtInfoContainer>
        )} */}
        {showContent()}
        <BottomModal visible={openReceiveModal} header="Recieve" onClose={onReceiveModalClose}>
          {receiveContent}
        </BottomModal>
      </Container>
      <BottomBar tab="dashboard" />
    </>
  );
}
