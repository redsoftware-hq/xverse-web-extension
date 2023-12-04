import ActionButton from '@components/button';
import InfoContainer from '@components/infoContainer';
import ReceiveCardComponent from '@components/receiveCardComponent';
import ShowBtcReceiveAlert from '@components/showBtcReceiveAlert';
import ShowOrdinalReceiveAlert from '@components/showOrdinalReceiveAlert';
import TopRow from '@components/topRow';
import useWalletSelector from '@hooks/useWalletSelector';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ReceiveContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: 16,
  marginBottom: props.theme.spacing(24),
  paddingLeft: props.theme.spacing(8),
  paddingRight: props.theme.spacing(8),
}));

const ButtonContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));
const Paragraph = styled.p((props) => ({
  ...props.theme.body_l,
  color: props.theme.colors.white_0,
  textAlign: 'left',
  marginBottom: props.theme.spacing(8),
  paddingLeft: props.theme.spacing(9),
  paddingRight: props.theme.spacing(9),
}));

const WarningContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));
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
  gap: 13,
  marginLeft: props.theme.spacing(10),
  marginRight: props.theme.spacing(10),
  marginBottom: props.theme.spacing(20),
}));
const Layout = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));
export default function ReceiveNftMainMenu() {
  const [isOrdinalReceiveAlertVisible, setIsOrdinalReceiveAlertVisible] = useState(false);
  const { stxAddress, ordinalsAddress, showOrdinalReceiveAlert } = useWalletSelector();
  const navigate = useNavigate();
  const { t } = useTranslation('translation', {
    keyPrefix: 'DASHBOARD_SCREEN',
  });

  const onSTXReceiveSelect = () => {
    navigate('/receive/STX', { state: { header: 'Receive Stacks' } });
  };
  const onOrdinalsReceivePress = () => {
    navigate('/receive/ORD', { state: { header: 'Recieve Ordinal and BRC20' } });
  };
  const onOrdinalReceiveAlertOpen = () => {
    if (showOrdinalReceiveAlert) setIsOrdinalReceiveAlertVisible(true);
  };
  const handleBack = () => {
    navigate(-1);
  };
  const onOrdinalReceiveAlertClose = () => {
    setIsOrdinalReceiveAlertVisible(false);
  };

  return (
    <Layout>
      <Top>
        <TopRow title={t('RECEIVE')} onClick={handleBack} />
        <Paragraph>
          Below are the addresses for all of the NFT protocols supported by the Orange Pill wallet.
        </Paragraph>
      </Top>

      {isOrdinalReceiveAlertVisible && (
        <ShowOrdinalReceiveAlert onOrdinalReceiveAlertClose={onOrdinalReceiveAlertClose} />
      )}
      <ReceiveContainer>
        <ReceiveCardComponent
          title={t('ORDINALS')}
          address={ordinalsAddress}
          onQrAddressClick={onOrdinalsReceivePress}
          onCopyAddressClick={onOrdinalReceiveAlertOpen}
          fromMainMenu
        />
        <ReceiveCardComponent
          title={t('STACKS_AND_TOKEN')}
          address={stxAddress}
          onQrAddressClick={onSTXReceiveSelect}
          fromMainMenu
        />
      </ReceiveContainer>

      <Bottom>
        <WarningContainer>
          <InfoContainer
            styleContainer={{ padding: '0 12px 0 12px' }}
            showWarningText
            bodyText="Do not send Bitcoin to these addresses. Only send the correct protocol to the addresses above."
          />
        </WarningContainer>
        <ButtonContainer>
          <ActionButton text="Close" onPress={() => navigate('/')} />
        </ButtonContainer>
      </Bottom>
    </Layout>
  );
}
