import LogoStatusHeader from '@components/logoStatusHeader';
import Paragraph from '@components/paragraph';
import useWalletSelector from '@hooks/useWalletSelector';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Header = styled.h1((props) => ({
  ...props.theme.mont_tile_text,
  color: props.theme.colors.action.classic,
  paddingLeft: 16,
  paddingRight: 16,
}));
export default function SendConfirmationHeader() {
  const { selectedAccount } = useWalletSelector();
  const { t } = useTranslation('translation');
  return (
    <>
      <LogoStatusHeader
        status={`Account ${
          selectedAccount?.id === 0 ? selectedAccount.id + 1 : selectedAccount?.id
        }`}
      />
      <Header>Send Confirmation</Header>
      <Paragraph
        content={t('CONFIRM_TRANSACTION.CONFIRM_DESCRIPTION')}
        // eslint-disable-next-line no-inline-styles/no-inline-styles
        style={{ paddingLeft: 16, paddingRight: 16, fontSize: 18 }}
      />
    </>
  );
}
