import BackHeader from '@components/backHeader';
import ActionButton from '@components/button';
import CustomSwitchSlider from '@components/customSwitch';
import TopRow from '@components/topRow';
import useWalletReducer from '@hooks/useWalletReducer';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'space-between',
  padding: `0 ${props.theme.spacing(8)}px 0 ${props.theme.spacing(8)}px`,
}));

const Paragraph = styled.p((props) => ({
  ...props.theme.body_l,
  color: props.theme.colors.white_200,
  textAlign: 'left',
  marginTop: props.theme.spacing(12),
}));

const BottomContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  marginBottom: props.theme.spacing(20),
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
  textTransform: 'uppercase',
  fontFamily: 'MontSemiBold',
  width: '100%',
  height: 44,
  '&:disabled': {
    opacity: 0.6,
  },
}));
const SliderContainer = styled.div((props) => ({
  ...props.theme.body_medium_m,
  color: props.theme.colors.white_0,
  display: 'flex',
  alignItems: 'center',
  label: {
    marginLeft: props.theme.spacing(5),
  },
  '> input, > label': {
    cursor: 'pointer',
  },
  marginBottom: props.theme.spacing(5),
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
    <>
      <TopRow title={t('TITLE')} onClick={onBack} />
      <Container>
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
            <ActionButton
              text="Reset Wallet"
              disabled={!hasBackedUp}
              // eslint-disable-next-line no-inline-styles/no-inline-styles
              style={{ textTransform: 'uppercase' }}
              onPress={handleResetWallet}
            />
          </ButtonsContainer>
        </BottomContainer>
      </Container>
    </>
  );
}

export default ForgotPassword;
