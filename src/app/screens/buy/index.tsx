import MoonPay from '@assets/img/dashboard/moonpay.svg';
import Transak from '@assets/img/dashboard/transak.svg';
import InfoContainer from '@components/infoContainer';
import TopRow from '@components/topRow';
import useWalletSelector from '@hooks/useWalletSelector';
import { getMoonPaySignedUrl } from '@secretkeylabs/xverse-core/api';
import { MOON_PAY_API_KEY, MOON_PAY_URL, TRANSAC_API_KEY, TRANSAC_URL } from '@utils/constants';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MoonLoader } from 'react-spinners';
import styled from 'styled-components';
import RedirectButton from './redirectButton';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-left: 16px;
  padding-right: 16px;
  overflow-y: auto;
  height: 85vh;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Text = styled.h1((props) => ({
  textAlign: 'left',
  ...props.theme.body_medium_xl,
  color: props.theme.colors.white_0,
  padding: '0px 16px',
  marginBottom: props.theme.spacing(8),
}));

const LoaderContainer = styled.div({
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  position: 'fixed',
  zIndex: 10,
  background: 'rgba(25, 25, 48, 0.5)',
  backdropFilter: 'blur(2px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const Top = styled.div((props) => ({
  marginTop: props.theme.spacing(10),
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  marginBottom: 8,
}));
const Layout = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
}));
const Bottom = styled.div((props) => ({
  flex: 'none',
  display: 'flex',
  flexDirection: 'column',
  marginLeft: props.theme.spacing(8),
  marginRight: props.theme.spacing(8),
  marginBottom: props.theme.spacing(40),
}));
function Buy() {
  const { t } = useTranslation('translation', { keyPrefix: 'BUY_SCREEN' });
  const navigate = useNavigate();
  const { currency } = useParams();
  const { stxAddress, btcAddress, network } = useWalletSelector();
  const address = currency === 'STX' ? stxAddress : btcAddress;
  const [url, setUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (url !== '') {
      window.open(url);
    }
  }, [url]);

  // const getMoonPayUrl = async () => {
  //   setLoading(true);
  //   try {
  //     const moonPayUrl = new URL(MOON_PAY_URL);
  //     moonPayUrl.searchParams.append('apiKey', MOON_PAY_API_KEY!);
  //     moonPayUrl.searchParams.append('currencyCode', currency!);
  //     moonPayUrl.searchParams.append('walletAddress', address);
  //     moonPayUrl.searchParams.append('colorCode', '#5546FF');
  //     const signedUrl = await getMoonPaySignedUrl(network.type, moonPayUrl.href);
  //     setUrl(signedUrl?.signedUrl ?? '');
  //   } catch (e) {
  //     setLoading(false);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getTransacUrl = () => {
    setLoading(true);
    try {
      const transacUrl = new URL(TRANSAC_URL);
      transacUrl.searchParams.append('apiKey', TRANSAC_API_KEY as string);
      transacUrl.searchParams.append('cryptoCurrencyList', currency!);
      transacUrl.searchParams.append('defaultCryptoCurrency', currency!);
      transacUrl.searchParams.append('walletAddress', address);
      transacUrl.searchParams.append('disableWalletAddressForm', 'true');
      transacUrl.searchParams.append('exchangeScreenTitle', `Buy ${currency}`);
      setUrl(transacUrl.href);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Top>
        <TopRow title={`${t('BUY')} ${currency}`} onClick={handleBackButtonClick} />
        <Text>{t('PURCHASE_CRYPTO')}</Text>
      </Top>
      <Container>
        {loading && (
          <LoaderContainer>
            <MoonLoader color="white" size={20} />
          </LoaderContainer>
        )}
        {/* <RedirectButton text={t('MOONPAY')} src={MoonPay} onClick={getMoonPayUrl} />
        <RedirectButton text={t('BINANCE')} src={Binance} onClick={getBinanceUrl} /> */}
        <RedirectButton text={t('TRANSAK')} src={Transak} onClick={getTransacUrl} />
      </Container>
      <Bottom>
        <InfoContainer bodyText={t('THIRD_PARTY_WARNING')} showWarningText />
      </Bottom>
    </Layout>
  );
}

export default Buy;
