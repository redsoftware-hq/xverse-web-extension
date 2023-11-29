import OrdinalsIcon from '@assets/img/nftDashboard/white_ordinals_icon.svg';
import { Account } from '@secretkeylabs/xverse-core';
import { getAccountGradient } from '@utils/gradient';
import { getTruncatedAddress } from '@utils/helper';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface GradientCircleProps {
  firstGradient: string;
  secondGradient: string;
  thirdGradient: string;
}
const GradientCircle = styled.div<GradientCircleProps>((props) => ({
  height: 40,
  width: 40,
  borderRadius: 25,
  marginRight: 9,
  background: `linear-gradient(to bottom,${props.firstGradient}, ${props.secondGradient},${props.thirdGradient} )`,
}));

const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const ColumnContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const AddressContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
});

const RowContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  justifyContent: 'center',
});

const CurrentSelectedAccountText = styled.h1((props) => ({
  ...props.theme.body_bold_m,
  color: props.theme.colors.white_0,
  textAlign: 'start',
}));

const AddressText = styled.h1<{ isOrdinal: boolean }>((props) => ({
  ...props.theme.body_m,
  fontFamily: 'MontRegular',
  fontSize: 18,
  marginTop: props.theme.spacing(1),
  color: props.isOrdinal ? '#626A82' : props.theme.colors.white[0],
}));

const BitcoinDot = styled.div((props) => ({
  borderRadius: 20,
  background: props.theme.colors.feedback.caution,
  width: 10,
  marginRight: 4,
  marginLeft: 4,
  height: 10,
}));

const OrdinalImage = styled.img({
  width: 12,
  height: 12,
  marginRight: 4,
});

interface Props {
  account: Account;
  isBitcoinTx: boolean;
}
function AccountView({ account, isBitcoinTx }: Props) {
  // const gradient = getAccountGradient(account?.stxAddress!);
  // const { t } = useTranslation('translation', { keyPrefix: 'DASHBOARD_SCREEN' });

  return (
    <Container>
      {/* <GradientCircle
        firstGradient={gradient[0]}
        secondGradient={gradient[1]}
        thirdGradient={gradient[2]}
      /> */}

      <ColumnContainer>
        <RowContainer>
          <AddressContainer>
            <AddressText isOrdinal={false}>{getTruncatedAddress(account?.btcAddress)}</AddressText>
          </AddressContainer>
          <AddressContainer>
            <AddressText isOrdinal>/</AddressText>
          </AddressContainer>
          <AddressContainer>
            <AddressText isOrdinal>{getTruncatedAddress(account?.ordinalsAddress)}</AddressText>
          </AddressContainer>
        </RowContainer>
      </ColumnContainer>
    </Container>
  );
}

export default AccountView;
