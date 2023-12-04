/* eslint-disable no-inline-styles/no-inline-styles */
import InfoContainer from '@components/infoContainer';
import LogoStatusHeader from '@components/logoStatusHeader';
import TopRow from '@components/topRow';
import useWalletSelector from '@hooks/useWalletSelector';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const NonceContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  // marginLeft: props.theme.spacing(8),
  // marginRight: props.theme.spacing(8),
}));

const DetailText = styled.h1((props) => ({
  ...props.theme.body_medium_xl,
  color: props.theme.colors.white_200,
  marginTop: props.theme.spacing(8),
  marginLeft: props.theme.spacing(8),
  marginRight: props.theme.spacing(8),
}));

const Text = styled.h1((props) => ({
  ...props.theme.body_medium_xl,
  marginTop: props.theme.spacing(8),
  marginLeft: props.theme.spacing(8),
  marginRight: props.theme.spacing(8),
}));

const InputContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: props.theme.spacing(4),
  marginBottom: props.theme.spacing(6),
  background: props.theme.colors.background.orangePillBg,
  border: '1px solid rgba(168, 185, 244, 0.15)',
  borderRadius: 8,
  paddingLeft: props.theme.spacing(5),
  paddingRight: props.theme.spacing(5),
  paddingTop: props.theme.spacing(5),
  paddingBottom: props.theme.spacing(5),
  marginLeft: props.theme.spacing(8),
  marginRight: props.theme.spacing(8),
}));

const InputField = styled.input((props) => ({
  ...props.theme.body_medium_xl,
  background: props.theme.colors.background.orangePillBg,
  border: 'transparent',
  color: props.theme.colors.white_400,
  width: '100%',
  '::placeholder': { color: props.theme.colors.secondaryText },
}));

const Header = styled.h1((props) => ({
  ...props.theme.mont_tile_text,
  color: props.theme.colors.action.classic,
  marginTop: props.theme.spacing(6),
}));
interface Props {
  nonce: string;
  setNonce: (nonce: string) => void;
  handleBack: () => void;
}
function EditNonce({ nonce, setNonce, handleBack }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'TRANSACTION_SETTING' });
  const [nonceInput, setNonceInput] = useState(nonce);
  const { selectedAccount } = useWalletSelector();
  const onInputEditNonceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNonceInput(e.target.value);
  };

  useEffect(() => {
    setNonce(nonceInput);
  }, [nonceInput]);

  return (
    <NonceContainer>
      <TopRow title={t('ADVANCED_SETTING_NONCE_OPTION')} onClick={handleBack} />
      {/* <LogoStatusHeader
        style={{
          paddingLeft: '0px',
          paddingBottom: '0px',
          paddingRight: '0px',
          paddingTop: '16px',
        }}
        status={`Account ${
          selectedAccount?.id === 0 ? selectedAccount.id + 1 : selectedAccount?.id
        }`}
      /> */}
      <DetailText>{t('NONCE_INFO')}</DetailText>
      <Text>{t('NONCE')}</Text>
      <InputContainer>
        <InputField value={nonceInput} onChange={onInputEditNonceChange} placeholder="0" />
      </InputContainer>
      {/* <InfoContainer bodyText={t('NONCE_WARNING')} /> */}
    </NonceContainer>
  );
}

export default EditNonce;
