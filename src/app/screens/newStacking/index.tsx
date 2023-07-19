/* eslint-disable no-await-in-loop */
import AccountHeaderComponent from '@components/accountHeader';
import BottomBar from '@components/tabBar';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import BarLoader from '@components/barLoader';
import { NumericFormat } from 'react-number-format';
import { LoaderSize } from '@utils/constants';
import icon from '@assets/img/stacking/stacking_icon.svg';
import SmallActionButton from '@components/smallActionButton';
import StackingI from '@assets/img/stacking/stacking_1.svg';
import Claim from '@assets/img/stacking/claim.svg';
import ClaimTransactionIcon from '@assets/img/stacking/claim_transaction.svg';
import GetTransactionIcon from '@assets/img/stacking/get_transaction.svg';
import TransactionsList from './TransactionsList';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
  margin-right: 20px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Dashboard = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: props.theme.radius(2),
  background: props.theme.colors.action.classic,
  alignItems: 'space-between',
  justifyContent: 'space-between',
  paddingLeft: props.theme.spacing(12),
  paddingBottom: props.theme.spacing(9),
  paddingRight: props.theme.spacing(12),
}));

const RowButtonContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: props.theme.spacing(10),
}));

const ButtonContainer = styled.div((props) => ({
  display: 'flex',
  gap: props.theme.spacing(8),
}));

const BalanceAmountContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const BalanceAmountText = styled.h1((props) => ({
  ...props.theme.headline_xl,
  fontSize: 40,
  color: props.theme.colors.white['0'],
}));

const BarLoaderContainer = styled.div((props) => ({
  marginTop: props.theme.spacing(5),
  maxWidth: 300,
  display: 'flex',
}));

const CollectiblesHeading = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginTop: props.theme.spacing(11),
}));

const FiatPill = styled.div((props) => ({
  ...props.theme.headline_category_s,
  color: props.theme.colors.white['0'],
  fontSize: 13,
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: props.theme.colors.background.modalBackdrop,
  width: 45,
  borderRadius: 30,
  marginLeft: props.theme.spacing(4),
}));

const CollectiblesHeadingText = styled.h1((props) => ({
  ...props.theme.headline_category_s,
  color: props.theme.colors.dashboard.text,
  fontSize: 18,
  fontWeight: 700,
  fontFamily: 'MontRegular',
}));

const Pill = styled.h1((props) => ({
  ...props.theme.headline_category_s,
  color: props.theme.colors.white['0'],
  border: '1px solid white',
  borderRadius: 30,
  padding: '4px 8px',
  fontSize: 14,
  fontWeight: 700,
  fontFamily: 'MontRegular',
  backgroundColor: '#FFFFFF33',
}));

function NewStacking() {
  const { t } = useTranslation('translation', {
    keyPrefix: 'STACKING_SCREEN',
  });

  const [isLoading, setIsLoading] = useState(false);

  const data = [
    {
      date: 'June 12th',
      name: 'Claimed Rewards',
      img: ClaimTransactionIcon,
      pills: '1,342 PILL',
      price: '4.23 APY',
    },
    {
      date: 'May 1',
      name: 'Ended Stake',
      img: GetTransactionIcon,
      pills: '43,900 PILL',
      price: '$63.82 USD',
    },
    {
      date: 'February 28',
      name: 'Started Stake',
      img: GetTransactionIcon,
      pills: '43,900 PILL',
      price: '$63.82 USD',
    },
  ];

  return (
    <>
      <AccountHeaderComponent />
      <Container>
        <Dashboard>
          <CollectiblesHeading>
            <CollectiblesHeadingText>{t('REWARDS')}</CollectiblesHeadingText>
            <FiatPill>{t('PILL')}</FiatPill>
          </CollectiblesHeading>
          {isLoading ? (
            <BarLoaderContainer>
              <BarLoader loaderSize={LoaderSize.LARGE} />
            </BarLoaderContainer>
          ) : (
            <BalanceAmountContainer>
              {icon && <img src={icon} alt="stacking" />}
              <BalanceAmountText>
                <NumericFormat
                  value={25000.45}
                  displayType="text"
                  prefix=""
                  thousandSeparator
                  renderText={(value: string) => <BalanceAmountText>{value}</BalanceAmountText>}
                />
              </BalanceAmountText>
            </BalanceAmountContainer>
          )}

          <RowButtonContainer>
            <ButtonContainer>
              <SmallActionButton
                isOpaque
                isRound
                src={StackingI}
                onPress={() => console.log('clicked')}
              />
              <SmallActionButton
                isOpaque
                isRound
                src={Claim}
                onPress={() => console.log('clicked')}
              />
            </ButtonContainer>
            <Pill>{t('NOT_STACKING')}</Pill>
          </RowButtonContainer>
        </Dashboard>
      </Container>
      <TransactionsList isLoading={false} data={data} />
      <BottomBar tab="stacking" />
    </>
  );
}

export default NewStacking;
