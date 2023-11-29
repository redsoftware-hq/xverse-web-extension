import DropDownIcon from '@assets/img/transactions/dropDownIcon.svg';
import AccountRow from '@components/accountRow';
import ActionButton from '@components/button';
import LogoStatusHeader from '@components/logoStatusHeader';
import Separator from '@components/separator';
import useBtcAddressRequest from '@hooks/useBtcAddressRequest';
import useWalletReducer from '@hooks/useWalletReducer';
import useWalletSelector from '@hooks/useWalletSelector';
import { animated, useSpring } from '@react-spring/web';
import CollapsableContainer from '@screens/signatureRequest/collapsableContainer';
import { Account } from '@secretkeylabs/xverse-core';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
// import { AddressPurpose } from 'sats-connect';
import styled from 'styled-components';
import AccountView from './accountView';

const TitleContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'left',
  justifyContent: 'center',
});

const DropDownContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flex: 1,
  height: '100%',
  alignItems: 'center',
  justifyContent: 'flex-end',
});

const Container = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  paddingBottom: props.theme.radius(16),
  ...props.theme.scrollbar,
}));

const AddressContainer = styled.div((props) => ({
  background: props.theme.colors.elevation2,
  borderRadius: 40,
  height: 24,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3px 10px 3px 6px',
  marginTop: props.theme.spacing(4),
  marginRight: props.theme.spacing(2),
}));

const AccountListContainer = styled(animated.div)((props) => ({
  paddingBottom: 20,
  width: '100%',
  borderRadius: 12,
  height: 214,
  marginTop: props.theme.spacing(9.5),
  boxShadow: '0px 8px 104px rgba(0, 0, 0, 0.5)',
  background:
    'radial-gradient(489.09% 91.61% at 89.79% 22.85%, rgba(56, 60, 78, 0.20) 0%, rgba(13, 14, 18, 0.20) 100%)',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  overflowY: 'auto',
}));

const TopImage = styled.img({
  aspectRatio: 1,
  height: 88,
  borderWidth: 10,
  borderColor: 'white',
});

const FunctionTitle = styled.h1((props) => ({
  ...props.theme.body_bold_l,
  color: '#D23403',
  fontFamily: 'MontBold',
  fontSize: '32px',
  fontStyle: 'normal',
  fontWeight: 800,
  lineHeight: 'normal',
}));

const AccountContainer = styled.button((props) => ({
  background:
    'radial-gradient(489.09% 91.61% at 89.79% 22.85%, rgba(56, 60, 78, 0.20) 0%, rgba(13, 14, 18, 0.20) 100%)',
  border: '1px solid rgba(168, 185, 244, 0.15)',
  borderRadius: 8,
  width: '100%',
  padding: '16px 20px 16px 20px;',
  display: 'flex',
  flexDirection: 'row',
  marginTop: props.theme.spacing(4),
}));

const AccountText = styled.h1((props) => ({
  ...props.theme.body_medium_m,
  fontFamily: 'MontRegular',
  fontSize: 18,
  color: props.theme.colors.white[0],
  marginLeft: 8,
  marginTop: 16,
  marginBottom: 16,
}));

// const DappTitle = styled.h2((props) => ({
//   ...props.theme.body_m,
//   color: props.theme.colors.white['200'],
//   marginTop: 12,
//   textAlign: 'center',
// }));

// const AddressTextTitle = styled.h1((props) => ({
//   ...props.theme.body_medium_l,
//   color: props.theme.colors.white['0'],
//   fontSize: 10,
//   textAlign: 'center',
// }));

const OuterContainer = styled(animated.div)({
  display: 'flex',
  flexDirection: 'column',
  marginLeft: 16,
  marginRight: 16,
  overflow: 'auto',
});
const InnerContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
  gap: 8,
  overflow: 'hidden',
  flex: 1,
}));
const ButtonsContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: 8,
  alignItems: 'flex-end',
  background: 'transparent',
  paddingBottom: props.theme.radius(8),
}));

// const BitcoinDot = styled.div((props) => ({
//   borderRadius: 20,
//   background: props.theme.colors.feedback.caution,
//   width: 6,
//   marginRight: props.theme.spacing(3),
//   height: 6,
// }));

const AccountListRow = styled.div((props) => ({
  paddingTop: props.theme.spacing(8),
  paddingLeft: 16,
  paddingRight: 16,
  ':hover': {
    background: props.theme.colors.elevation3,
  },
}));

const TransparentButtonContainer = styled.div((props) => ({
  background: 'transparent',
  marginLeft: props.theme.spacing(2),
  marginRight: props.theme.spacing(2),
  width: '100%',
}));

const AccountSelect = styled.button((props) => ({
  background: 'transparent',
}));
// const OrdinalImage = styled.img({
//   width: 12,
//   height: 12,
//   marginRight: 8,
// });

const Paragraph = styled.p((props) => ({
  ...props.theme.body_l,
  fontFamily: 'MontRegular',
  color: props.theme.colors.white['200'],
  textAlign: 'left',
  fontSize: 18,
  marginTop: props.theme.spacing(8),
  marginBottom: props.theme.spacing(8),
  paddingLeft: props.theme.spacing(3),
  paddingRight: props.theme.spacing(3),
}));
function BtcSelectAddressScreen() {
  const [loading, setLoading] = useState(false);
  const [showAccountList, setShowAccountList] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation('translation', { keyPrefix: 'SELECT_BTC_ADDRESS_SCREEN' });
  const { selectedAccount, accountsList, network } = useWalletSelector();
  const { switchAccount } = useWalletReducer();
  const { payload, approveBtcAddressRequest, cancelAddressRequest } = useBtcAddressRequest();
  const { isExpanded, setIsExpanded } = useState(false);
  const springProps = useSpring({
    transform: showAccountList ? 'translateY(0%)' : 'translateY(100%)',
    opacity: showAccountList ? 1 : 0,
    config: {
      tension: 160,
      friction: 25,
    },
  });
  const styles = useSpring({
    from: {
      opacity: 0,
      y: 24,
    },
    to: {
      y: 0,
      opacity: 1,
    },
  });

  const confirmCallback = async () => {
    setLoading(true);
    approveBtcAddressRequest();
    window.close();
  };

  const cancelCallback = () => {
    cancelAddressRequest();
    window.close();
  };

  const onChangeAccount = () => {
    setShowAccountList(true);
  };

  const isAccountSelected = (account: Account) =>
    account.id === selectedAccount?.id && account.accountType === selectedAccount?.accountType;

  const handleAccountSelect = async (account: Account) => {
    await switchAccount(account);
    setShowAccountList(false);
  };

  const switchAccountBasedOnRequest = () => {
    if (payload.network.type !== network.type) {
      navigate('/tx-status', {
        state: {
          txid: '',
          currency: 'BTC',
          errorTitle: t('NETWORK_MISMATCH_ERROR_TITLE'),
          error: t('NETWORK_MISMATCH_ERROR_DESCRIPTION'),
          browserTx: true,
        },
      });
    }
  };

  useEffect(() => {
    switchAccountBasedOnRequest();
    window.resizeTo(374.6, 600);
  }, []);

  function getName() {
    return selectedAccount!?.bnsName ?? `Account ${`${(selectedAccount!?.id ?? 0) + 1}`}`;
  }
  return (
    <>
      <LogoStatusHeader status="Caution" />
      <OuterContainer style={styles}>
        <InnerContainer>
          <TitleContainer>
            <FunctionTitle>{t('TITLE')}</FunctionTitle>
            <Paragraph>
              This site is requesting to connect to your Orange Pill wallet. Please ensure that this
              site is authorized to access your wallet before proceeding.
            </Paragraph>
            {/* <div style={{ display: 'flex', alignItems: 'center' }}>
            {payload.purposes.map((purpose) => (purpose === AddressPurposes.PAYMENT ? (
              <AddressContainer>
                <BitcoinDot />
                <AddressTextTitle>{t('BITCOIN_ADDRESS')}</AddressTextTitle>
              </AddressContainer>
            ) : (
              <AddressContainer>
                <OrdinalImage src={OrdinalsIcon} />
                <AddressTextTitle>{t('ORDINAL_ADDRESS')}</AddressTextTitle>
              </AddressContainer>
            )))}
          </div> */}
            {/* <DappTitle>{payload.message}</DappTitle> */}
          </TitleContainer>
          <Container>
            {[...accountsList].map((account) => (
              <CollapsableContainer
                key={account.id}
                title={account!?.bnsName ?? `Account ${`${(account!?.id ?? 0) + 1}`}`}
              >
                <AccountSelect onClick={() => handleAccountSelect(account!)}>
                  <AccountView account={account} isBitcoinTx />
                </AccountSelect>
              </CollapsableContainer>
            ))}
          </Container>
        </InnerContainer>
        <ButtonsContainer>
          <TransparentButtonContainer>
            <ActionButton text={t('CANCEL_BUTTON')} transparent onPress={cancelCallback} />
          </TransparentButtonContainer>
          <ActionButton text={t('CONNECT_BUTTON')} processing={loading} onPress={confirmCallback} />
        </ButtonsContainer>
      </OuterContainer>
    </>
  );
}

export default BtcSelectAddressScreen;
