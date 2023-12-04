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
  textAlign: 'left',
  color: props.theme.colors.white_0,
  padding: '0px 16px',
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

const Top = styled.div((props) => ({
  marginTop: props.theme.spacing(10),
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  marginBottom: 8,
}));
const Bottom = styled.div((props) => ({
  flex: 'none',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  gap: 2,
  marginLeft: props.theme.spacing(10),
  marginRight: props.theme.spacing(10),
  marginBottom: props.theme.spacing(20),
}));
const Layout = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
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
    <Layout>
      <Top>
        <TopRow title={t('TITLE')} onClick={onBack} />
        <Paragraph>{t('PARAGRAPH')}</Paragraph>
      </Top>
      <Bottom>
        <SliderContainer>
          <CustomSwitchSlider
            id="backup"
            toggleFunction={handleToggleBackUp}
            toggleValue={hasBackedUp}
          />
          <label htmlFor="backup">{t('BACKUP_CHECKBOX_LABEL')}</label>
        </SliderContainer>
        <ActionButton
          text="Reset Wallet"
          disabled={!hasBackedUp}
          // eslint-disable-next-line no-inline-styles/no-inline-styles
          style={{ textTransform: 'uppercase' }}
          onPress={handleResetWallet}
        />
      </Bottom>
    </Layout>
  );
}

export default ForgotPassword;
