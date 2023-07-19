/* eslint-disable no-nested-ternary */
import styled from 'styled-components';
import { MoonLoader } from 'react-spinners';
import { useTranslation } from 'react-i18next';
import { animated } from '@react-spring/web';

const ListItemsContainer = styled.div((props) => ({
  marginTop: props.theme.spacing(15),
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  borderTopLeftRadius: '24px',
  borderTopRightRadius: '24px',
  background: props.theme.colors.background.darkbg,
}));

const ListHeader = styled.h1((props) => ({
  margin: props.theme.spacing(10),
  color: props.theme.colors.action.classic,
  fontFamily: 'MontBold',
  fontSize: '20px',
}));

const LoadingContainer = styled.div({
  display: 'flex',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const NoTransactionsContainer = styled.div((props) => ({
  ...props.theme.body_m,
  display: 'flex',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  color: props.theme.colors.white[400],
}));

const GroupContainer = styled(animated.div)((props) => ({
  marginBottom: props.theme.spacing(8),
  overflow: 'auto',
}));

const SectionSeparator = styled.div((props) => ({
  border: '0.5px solid  rgba(255, 255, 255, 0.6)',
  opacity: 0.2,
  flexGrow: 1,
  marginRight: props.theme.spacing(10),
  marginLeft: props.theme.spacing(10),
}));

const PriceConatiner = styled.div({
  display: 'flex',
  alignItems: 'end',
  textAlign: 'right',
});

const ItemTitle = styled.p((props) => ({
  ...props.theme.body_medium_m,
  fontSize: '16px',
  color: props.theme.colors.white[0],
}));

const DetailRowContainer = styled.div((props) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: props.theme.spacing(6),
  paddingBottom: props.theme.spacing(6),
  paddingRight: props.theme.spacing(10),
  paddingLeft: props.theme.spacing(10),
}));

const TitleContainer = styled.div((props) => ({
  display: 'flex',
  flex: 1,
  alignItems: 'center',
  gap: props.theme.spacing(3),
}));

const HeaderTitle = styled.p((props) => ({
  ...props.theme.body_medium_m,
  color: props.theme.colors.grey1,
}));

type DetailRowProps = {
  date: string;
  name: string;
  img: string;
  pills: string;
  price: string;
};

function DetailRow({ date, name, img, pills, price }: DetailRowProps) {
  return (
    <DetailRowContainer>
      <TitleContainer>
        <img src={img} alt="icon" />
        <div>
          <ItemTitle>{name}</ItemTitle>
          <HeaderTitle>{date}</HeaderTitle>
        </div>
      </TitleContainer>
      <PriceConatiner>
        <ItemTitle>
          {pills}
          <HeaderTitle>{price}</HeaderTitle>
        </ItemTitle>
      </PriceConatiner>
    </DetailRowContainer>
  );
}

export default function TransactionsList({ data, isLoading }: any) {
  const { t } = useTranslation('translation', { keyPrefix: 'STACKING_SCREEN' });

  return (
    <ListItemsContainer>
      <ListHeader>{t('TRANSACTIONS')}</ListHeader>
      {isLoading ? (
        <LoadingContainer>
          <MoonLoader color="white" size={20} />
        </LoadingContainer>
      ) : (
        <GroupContainer>
          <SectionSeparator />
          {data.map((item) => (
            <>
              <DetailRow
                key={item.coin}
                date={item.date}
                name={item.name}
                img={item.img}
                pills={item.pills}
                price={item.price}
              />
              <SectionSeparator />
            </>
          ))}
        </GroupContainer>
      )}
      {!isLoading && data?.length === 0 && (
        <NoTransactionsContainer>{t('TRANSACTIONS_LIST_EMPTY')}</NoTransactionsContainer>
      )}
    </ListItemsContainer>
  );
}
