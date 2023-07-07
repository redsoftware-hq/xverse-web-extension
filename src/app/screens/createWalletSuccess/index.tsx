import Completed from '@assets/img/createWalletSuccess/completed.png';
import Followup from '@assets/img/createWalletSuccess/completedFollowup.png';
import Extension from '@assets/img/createWalletSuccess/extension.svg';
import Logo from '@assets/img/createWalletSuccess/logo.svg';
import Pin from '@assets/img/createWalletSuccess/pin.svg';
import ActionButton from '@components/button';
import Steps from '@components/steps';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const InstructionsContainer = styled.div((props) => ({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
  position: 'absolute',
  top: 20,
  right: 30,
  height: 127,
  width: 278,
  backgroundColor: 'rgba(39, 42, 68, 0.4)',
  border: `1px solid ${props.theme.colors.elevation3}`,
  borderRadius: 12,
  padding: `${props.theme.spacing(10.5)}px ${props.theme.spacing(10.5)}px ${props.theme.spacing(
    10.5,
  )}px ${props.theme.spacing(10.5)}px`,
  padding: `${props.theme.spacing(10.5)}px ${props.theme.spacing(10.5)}px ${props.theme.spacing(
    10.5,
  )}px ${props.theme.spacing(10.5)}px`,
}));

const RowContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
});

const InstructionsText = styled.h1((props) => ({
  ...props.theme.body_medium_l,
  color: 'rgba(255, 255, 255, 0.7)',
}));

const Image = styled.img((props) => ({
  marginLeft: props.theme.spacing(3.5),
  marginRight: props.theme.spacing(3.5),
}));

const ContentContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: props.theme.spacing(10),
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
}));

const Title = styled.h1((props) => ({
  ...props.theme.mont_tile_text,
  color: props.theme.colors.action.classic,
  fontSize: 24,
  textAlign: 'center',
}));

const Subtitle = styled.h2((props) => ({
  ...props.theme.bold_tile_text,
  color: props.theme.colors.white[0],
  marginTop: props.theme.spacing(8),
  textAlign: 'center',
}));

const ButtonContainer = styled.div((props) => ({
  marginLeft: props.theme.spacing(10),
  marginRight: props.theme.spacing(10),
  marginBottom: props.theme.spacing(20),
}));

function CreateWalletSuccess(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'WALLET_SUCCESS_SCREEN' });
  const { action } = useParams();
  const [activeIndex, setActiveIndex] = useState(0);

  const steps = [
    {
      img: Completed,
      title: t('SCREEN_TITLE'),
      subtitle: t('SCREEN_SUBTITLE'),
    },
    {
      img: Followup,
      title: t('SELF_CUSTODY'),
      subtitle: t('SELF_CUSTODY_DESC'),
    },
    {
      img: Followup,
      title: t('PRIVATE'),
      subtitle: t('PRIVATE_DESC'),
    },
    {
      img: Followup,
      title: t('ANONYMOUS'),
      subtitle: t('ANONYMOUS_DESC'),
    },
    {
      img: Followup,
      title: t('DECENTRALIZED'),
      subtitle: t('DECENTRALIZED_DESC'),
    },
  ];
  const handleOpenWallet = () => {
    if (action === 'restore') {
      window.close();
    }
    if (activeIndex < steps.length - 1) {
      setActiveIndex((cur) => cur + 1);
    } else {
      window.close();
    }
  };

  return (
    <>
      <ContentContainer>
        <img src={action === 'restore' ? Completed : steps[activeIndex].img} alt="success" />
        <Title>{action === 'restore' ? t('RESTORE_SCREEN_TITLE') : steps[activeIndex].title}</Title>
        <Subtitle>
          {action === 'restore' ? t('RESTORE_SCREEN_SUBTITLE') : steps[activeIndex].subtitle}
        </Subtitle>
        {action === 'restore' ? null : <Steps data={steps} activeIndex={activeIndex} />}
      </ContentContainer>
      <ButtonContainer>
        <ActionButton onPress={handleOpenWallet} text={t('CLOSE_TAB')} />
      </ButtonContainer>
      {action === 'restore' || activeIndex === steps.length - 1 ? (
        <InstructionsContainer>
          <RowContainer>
            <InstructionsText>{`1. ${t('CLICK')}`}</InstructionsText>
            <Image src={Extension} />
          </RowContainer>
          <RowContainer>
            <InstructionsText>{`2. ${t('SEARCH_XVERSE')}`}</InstructionsText>
            <Image src={Pin} />
          </RowContainer>
          <RowContainer>
            <InstructionsText>{`3. ${t('CLICK')}`}</InstructionsText>
            <Image src={Logo} />
            <InstructionsText>{t('OPEN_WALLET')}</InstructionsText>
          </RowContainer>
        </InstructionsContainer>
      ) : null}
    </>
  );
}

export default CreateWalletSuccess;
