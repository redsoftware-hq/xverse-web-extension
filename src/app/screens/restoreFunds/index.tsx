
import TopRow from '@components/topRow';
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ActionButton from '@components/button';
import FundsRow from './fundsRow';

const RestoreFundTitle = styled.h1((props) => ({
  ...props.theme.body_l,
  marginBottom: 15,
  marginTop: 16,
  marginLeft: 16,
  marginRight: 16,
  color: props.theme.colors.white[200],
}));

const Container = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: 16,
  paddingRight: 16,
});
const ButtonContainer = styled.div({
  marginBottom: 40,
  marginLeft: 16,
  marginRight: 16,
});

type SelectedState = {
  btc: boolean;
  ordinals: boolean;
};
function RestoreFunds() {
  const { t } = useTranslation('translation', { keyPrefix: 'RESTORE_FUND_SCREEN' });
  const [isSelected, setIsSelected] = useState<SelectedState>({ btc: false, ordinals: false });
  const navigate = useNavigate();
  const location = useLocation();
  const { unspentUtxos } = location.state;

  const handleOnCancelClick = () => {
    navigate(-1);
  };

  const handleOnRestoreBtcClick = () => {
    navigate('/recover-btc', {
      state: {
        unspentUtxos,
      },
    });
  };

  const handleOnRestoreOridnalClick = () => {
    navigate('/recover-ordinals');
  };
  const onPress = () => {
    if (isSelected.btc) handleOnRestoreBtcClick();
    if (isSelected.ordinals) handleOnRestoreOridnalClick();
  };
  return (
    <>
      <TopRow title={t('TITLE')} onClick={handleOnCancelClick} />
      <RestoreFundTitle>{t('DESCRIPTION')}</RestoreFundTitle>
      <Container>
        <FundsRow
          selected={isSelected.btc}
          // image={IconBitcoin}
          title={t('RECOVER_BTC')}
          // description={t('RECOVER_BTC_DESC')}
          onClick={() => setIsSelected({ ...isSelected,btc: true, ordinals: false })}
        />
        <FundsRow
          selected={isSelected.ordinals}
          // image={OrdinalsIcon}
          title={t('RECOVER_ORDINALS')}
          // description={t('RECOVER_ORDINALS_DESC')}
          onClick={() => setIsSelected({ ...isSelected,btc: false, ordinals: true })}
        />
      </Container>
      <ButtonContainer>
        <ActionButton text="Restore Assets" onPress={onPress} />
      </ButtonContainer>
    </>
  );
}

export default RestoreFunds;
