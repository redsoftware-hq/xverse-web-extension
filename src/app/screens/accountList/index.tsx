import AccountRow from '@components/accountRow';
import TopRow from '@components/topRow';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Plus from '@assets/img/dashboard/plus.svg';
import { useDispatch } from 'react-redux';
import { selectAccount } from '@stores/wallet/actions/actionCreators';
import Seperator from '@components/seperator';
import { Account } from '@secretkeylabs/xverse-core/types';
import useWalletSelector from '@hooks/useWalletSelector';
import useWalletReducer from '@hooks/useWalletReducer';
import Paragraph from '@components/paragraph';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const RowContainer = styled.button((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent:'center',
  alignItems: 'center',
  background: 'transparent',
  marginTop: props.theme.spacing(8),
  paddingLeft: props.theme.spacing(4),
  paddingRight: props.theme.spacing(10),
}));

const AccountContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: props.theme.spacing(4),
  gap:'10px',
  paddingRight: props.theme.spacing(4),
}));


const Button = styled.button<{ disabled?: boolean }>((props) => ({
  ...props.theme.body_medium_m,
  color: props.theme.colors.action.classic,
  borderRadius: props.theme.radius(4),
  border: `1px solid ${props.theme.colors.action.classic}`,
  backgroundColor: props.theme.colors.background.lightOrange,
  height: 30,
  width: 150,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  img: {
    marginRight: props.theme.spacing(4),
  },
  ':hover': {
    backgroundColor: !props.disabled
      ? props.theme.colors.action.classic
      : props.theme.colors.background.lightOrange,
    border: `1px solid ${
      !props.disabled ? props.theme.colors.action.classic : props.theme.colors.action.classic
    }`,
    color: !props.disabled ? props.theme.colors.white[0] : props.theme.colors.action.classic,
  },
  ':focus': {
    backgroundColor: !props.disabled
      ? props.theme.colors.action.classic
      : props.theme.colors.background.lightOrange,
    border: `1px solid ${
      !props.disabled ? props.theme.colors.action.classic : props.theme.colors.action.classic
    }`,
    color: !props.disabled ? props.theme.colors.white[0] : props.theme.colors.action.classic,
  },
  ':disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
}));

const AddAccountText = styled.h1((props) => ({
  ...props.theme.body_m,
  opacity: 0.8,
  color: props.theme.colors.white['0'],
}));

function AccountList(): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'ACCOUNT_SCREEN' });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { network, accountsList, selectedAccount } = useWalletSelector();
  const { createAccount } = useWalletReducer();

  const handleAccountSelect = (account: Account) => {
    dispatch(
      selectAccount(
        account,
        account.stxAddress,
        account.btcAddress,
        account.ordinalsAddress,
        account.masterPubKey,
        account.stxPublicKey,
        account.btcPublicKey,
        account.ordinalsPublicKey,
        network,
      ),
    );
    navigate('/');
  };

  const isAccountSelected = (account: Account) => account.id === selectedAccount?.id;

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  async function onCreateAccount() {
    await createAccount();
  }

  return (
    <Container>
      <TopRow title={t('ADD_ACCOUNT')} onClick={handleBackButtonClick} />
      <AccountContainer>
        <Paragraph content={t('CONTENT')}/>
        {accountsList.map((account) => (
          <AccountRow
            forAccountManagement
            key={account.stxAddress}
            disableMenuOption
            account={account}
            isSelected={isAccountSelected(account)}
            onAccountSelected={handleAccountSelect}
          />
        ))}
        <RowContainer onClick={async () => onCreateAccount()}>
          <Button>
            <AddAccountText>{t('NEW_ACCOUNT')}</AddAccountText>
          </Button>
        </RowContainer>
      </AccountContainer>
    </Container>
  );
}

export default AccountList;
