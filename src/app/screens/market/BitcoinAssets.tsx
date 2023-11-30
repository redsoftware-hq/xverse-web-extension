/* eslint-disable no-nested-ternary */
import Scroll from '@assets/img/market/scroll.svg';
import { animated } from '@react-spring/web';
import { useTranslation } from 'react-i18next';
import { MoonLoader } from 'react-spinners';
import styled from 'styled-components';

const ListItemsContainer = styled.div((props) => ({
  marginTop: props.theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  borderTopLeftRadius: '24px',
  borderTopRightRadius: '24px',
  background: props.theme.colors.background.darkbg,
}));

const ListHeader = styled.h1((props) => ({
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

const GroupContainer = styled(animated.div)((props) => ({
  marginLeft: props.theme.spacing(10),
  marginRight: props.theme.spacing(10),
  height: '155px',
  overflow: 'auto',
}));

const HeaderContainer = styled.div((props) => ({
  display: 'flex',
  flex: 1,
  border: '1px solid rgba(168, 185, 244, 0.1)',
  justifyContent: 'space-between',
  backgroundColor: props.theme.colors.background.elevation0,
  padding: props.theme.spacing(4),
  paddingLeft: props.theme.spacing(6),
  paddingRight: props.theme.spacing(6),
  borderRadius: '8px',
}));

const ListHeaderRow = styled.div((props) => ({
  display: 'flex',
  justifyContent: 'space-between',
  margin: props.theme.spacing(10),
  marginBottom: props.theme.spacing(6),
}));

const SectionSeparator = styled.div((props) => ({
  border: '0.5px solid  rgba(255, 255, 255, 0.6)',
  opacity: 0.2,
  flexGrow: 1,
  marginLeft: props.theme.spacing(4),
  marginRight: props.theme.spacing(4),
}));

const HeaderTitle = styled.p((props) => ({
  ...props.theme.body_medium_m,
  color: props.theme.colors.grey1,
  paddingRight: props.theme.spacing(25),
}));

const HeaderTitle2 = styled.p((props) => ({
  ...props.theme.body_medium_m,
  color: props.theme.colors.grey1,
}));

const PriceConatiner = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const ItemTitle = styled.p((props) => ({
  ...props.theme.body_medium_m,
  fontSize: '16px',
  color: props.theme.colors.white[0],
  paddingRight: props.theme.spacing(7),
}));

const DetailRowContainer = styled.div((props) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingTop: props.theme.spacing(6),
  paddingBottom: props.theme.spacing(6),
}));

const TitleContainer = styled.div((props) => ({
  display: 'flex',
  flex: 1,
  alignItems: 'center',
  gap: props.theme.spacing(3),
}));

function Header() {
  return (
    <HeaderContainer>
      <HeaderTitle>Name</HeaderTitle>
      <PriceConatiner>
        <HeaderTitle>Price</HeaderTitle>
        <HeaderTitle2>1h</HeaderTitle2>
      </PriceConatiner>
    </HeaderContainer>
  );
}

type DetailRowProps = {
  coin: string;
  name: string;
  img: string;
  change: string;
  price: string;
  onClick: () => void;
};

function DetailRow({ coin, name, img, change, price, onClick }: DetailRowProps) {
  return (
    <DetailRowContainer onClick={onClick}>
      <TitleContainer>
        <img src={img} alt={coin} />
        <div>
          <ItemTitle>{name}</ItemTitle>
          <HeaderTitle>{coin}</HeaderTitle>
        </div>
      </TitleContainer>
      <PriceConatiner>
        <ItemTitle>{price}</ItemTitle>
        <ItemTitle>{change}</ItemTitle>
      </PriceConatiner>
    </DetailRowContainer>
  );
}

export default function BitcoinAssets({ isLoading, data, onClick }: any) {
  const { t } = useTranslation('translation', { keyPrefix: 'MARKET_SCREEN' });

  return (
    <ListItemsContainer>
      <ListHeaderRow>
        <ListHeader>{t('BITCOIN_ASSETS')}</ListHeader>
        <img src={Scroll} alt="scroll" />
      </ListHeaderRow>
      {isLoading ? (
        <LoadingContainer>
          <MoonLoader color="white" size={20} />
        </LoadingContainer>
      ) : (
        <GroupContainer>
          <Header />
          {data.map((item) => (
            <>
              <DetailRow
                key={item.coin}
                coin={item.coin}
                name={item.name}
                img={item.img}
                change={item.change}
                price={item.price}
                onClick={onClick}
              />
              <SectionSeparator />
            </>
          ))}
        </GroupContainer>
      )}
    </ListItemsContainer>
  );
}
