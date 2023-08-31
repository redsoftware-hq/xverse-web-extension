import BackHeader from '@components/backHeader';
import CustomSwitchSlider from '@components/customSwitch';
import useWalletReducer from '@hooks/useWalletReducer';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: props.theme.colors.elevation0,
  padding: `0 ${props.theme.spacing(8)}px 0 ${props.theme.spacing(8)}px`,
}));

const Paragraph = styled.p((props) => ({
  ...props.theme.body_l,
  color: props.theme.colors.white_200,
  textAlign: 'left',
  marginTop: props.theme.spacing(12),
}));

const BottomContainer = styled.div((props) => ({
  marginTop: props.theme.spacing(78),
}));

const ButtonsContainer = styled.div((props) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ResetButton = styled.button((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: props.theme.radius(1),
  backgroundColor: props.theme.colors.action.classic,
  color: props.theme.colors.white['0'],
  textTransform:'uppercase',
  width: '100%',
  height: 44,
  '&:disabled': {
    opacity: 0.6,
  },
}));
const SliderContainer = styled.div((props) => ({
  ...props.theme.body_medium_m,
  color: props.theme.colors.white['0'],
  display: 'flex',
  alignItems: 'center',
  label: {
    marginLeft: props.theme.spacing(5),
  },
  '> input, > label': {
    cursor: 'pointer',
  },
}));


function ForgotPassword(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'FORGOT_PASSWORD_SCREEN' });
  const [hasBackedUp, setHasBackedUp] = useState(false);
  const navigate = useNavigate();
  const { resetWallet } = useWalletReducer();

  const onBack = () => {
    navigate('/');
  };

  const handleToggleBackUp = () => {
    setHasBackedUp(!hasBackedUp);
  };

  const handleResetWallet = async () => {
    await resetWallet();
    navigate('/');
  };

  return (
    <Container>
      <BackHeader headerText={t('TITLE')} onPressBack={onBack} />
      <Paragraph>{t('PARAGRAPH')}</Paragraph>
      <BottomContainer>
        <SliderContainer>
          <CustomSwitchSlider
            id="backup"
            toggleFunction={handleToggleBackUp}
            toggleValue={hasBackedUp}
          />
          <label htmlFor="backup">{t('BACKUP_CHECKBOX_LABEL')}</label>
        </SliderContainer>
        <ButtonsContainer>
          <ResetButton disabled={!hasBackedUp} onClick={handleResetWallet}>
            Reset Wallet
          </ResetButton>
        </ButtonsContainer>
      </BottomContainer>
    </Container>
  );
}

export default ForgotPassword;
