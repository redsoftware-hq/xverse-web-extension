/* eslint-disable import/no-extraneous-dependencies */
import styled from 'styled-components';
import BottomBar from '@components/tabBar';
import AccountHeaderComponent from '@components/accountHeader';
import useMarketData from '@hooks/useMarketData';
import Chart from 'react-apexcharts';
import { useEffect, useState } from 'react';
import BTC from '@assets/img/market/bitcoin.svg';
import WBTC from '@assets/img/market/wbitcoin.svg';
import SIP10Icon from '@assets/img/dashboard/SIP10.svg';
import BitcoinToken from '@assets/img/dashboard/bitcoin_token.svg';
import OrdinalsIcon from '@assets/img/dashboard/ordinalBRC20.svg';
import { useNavigate } from 'react-router-dom';
import useWalletSelector from '@hooks/useWalletSelector';
import { useTranslation } from 'react-i18next';
import BottomModal from '@components/bottomModal';
import ReceiveCardComponent from '@components/receiveCardComponent';
import BitcoinAssets from './BitcoinAssets';
import StepperBar from './StepperBar';

const USDollar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const MaskContainer = styled.div((props) => ({
  position: 'absolute',
  height: '100%',
  width: '100%',
  paddingRight: props.theme.spacing(10),
  paddingLeft: '29px',
  paddingTop: props.theme.spacing(15),
  zIndex: 10,
}));

const Mask = styled.div((props) => ({
  position: 'relative',
  height: '100%',
  width: '100%',
  borderRadius: '12px',
  border: '1px solid #1f212b',
  boxShadow: '#040405 0px 1px 4px, #040405 -8px 0px 0px 12px',
  zIndex: 11,
}));

const ChartContainer = styled.div`
  position: relative;
  overflow: hidden;
  margin-left: -8px;
  margin-top: -30px;
  padding-right: 10px;
  margin-bottom: 10px;
  .graph-tooltip {
    color: black;
  }
`;

const MarketCapDetailsContainer = styled.div((props) => ({
  position: 'absolute',
  zIndex: 2,
  top: 40,
  left: 40,
}));

const Title = styled.div((props) => ({
  ...props.theme.mont_tile_text,
  fontSize: 16,
  color: '#D23403',
  fontWeight: 600,
}));

const ItemTitle = styled.p((props) => ({
  ...props.theme.bold_tile_text,
  fontSize: '20px',
  color: props.theme.colors.white[0],
  paddingRight: props.theme.spacing(7),
}));

function convertTimestampTo12HourWithMinutes(timestamp) {
  const date = new Date(timestamp);
  let hours: any = date.getHours();
  let minutes: any = date.getMinutes();
  let period = 'am';

  if (hours >= 12) {
    period = 'pm';
    if (hours > 12) {
      hours -= 12;
    }
  }

  if (hours === 0) {
    hours = 12;
  }

  hours = hours.toString();
  minutes = minutes.toString().padStart(2, '0');

  return `${hours}:${minutes} ${period}`;
}

function convertTimestampTo12Hour(timestamp) {
  const date = new Date(timestamp);
  let hours: any = date.getHours();
  let period = 'am';

  if (hours >= 12) {
    period = 'pm';
    if (hours > 12) {
      hours -= 12;
    }
  }

  if (hours === 0) {
    hours = 12;
  }

  hours = hours.toString();

  return `${hours}${period}`;
}

function MarketCapDetails({ isMarketCap, value, percentages }: any) {
  return (
    <MarketCapDetailsContainer>
      <Title>{isMarketCap ? 'Market Cap' : 'Trading Volume'}</Title>
      <ItemTitle>{USDollar.format(value)}</ItemTitle>
      <ItemTitle>{`${percentages}%`}</ItemTitle>
    </MarketCapDetailsContainer>
  );
}
const ReceiveContainer = styled.div((props) => ({
  display: 'flex',
  fontFamily: 'MontRegular',
  flexDirection: 'column',
  marginTop: props.theme.spacing(12),
  marginBottom: props.theme.spacing(16),
  paddingLeft: props.theme.spacing(8),
  paddingRight: props.theme.spacing(8),
}));
const Icon = styled.img({
  width: 24,
  height: 24,
});
const MergedIcon = styled.img({
  width: 40,
  height: 40,
});

function Market() {
  const { data, loading } = useMarketData();
  const [series, setSeries] = useState<any>(null);
  const [quotesData, setQuotesData] = useState<any>([]);
  const [headData, setHeadData] = useState<any[]>([]);
  const [currentActiveIndex, setCurentActiveIndex] = useState<any>(0);
  const {
    stxAddress,
    btcAddress,
    ordinalsAddress,
    showBtcReceiveAlert,
    showOrdinalReceiveAlert,
  } = useWalletSelector();

  // const mappedData = data?.data.BTC?.map((item: any) => ({ x: item.time, y: item.value }));

  // const series = [{ data: mappedData }];

  const options = {
    chart: {
      id: 'basic-area-chart',
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      show: true,
      curve: 'smooth',
      colors: ['#D23403'],
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      tickAmount: 8,
      type: 'datetime',
      labels: {
        datetimeUTC: false,
        offsetY: -17,
        hideOverlappingLabels: true,
        formatter: (val: any, timestamp: any) => convertTimestampTo12Hour(timestamp),
        style: {
          colors: '#fff',
          fontFamily: 'MontRegular',
        },
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      tooltip: {
        offsetY: -30,
        style: {
          fontSize: '11px',
          fontFamily: 'MontRegular',
        },
      },
    },
    colors: ['#D23403'],
    yaxis: {
      show: false,
    },
    fill: {
      type: 'solid',
      colors: ['#D23403'],
      opacity: 0.31,
    },
    grid: {
      borderColor: '#1f212b',
      position: 'back',
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      row: {
        colors: ['#101116'],
      },
    },
    tooltip: {
      cssClass: 'graph-tooltip',
      x: {
        formatter: (timestamp: any) => convertTimestampTo12HourWithMinutes(timestamp),
        show: false,
      },
      style: {
        fontSize: '14px',
        fontFamily: 'MontLight',
      },
      marker: {
        show: false,
      },
    },
  };

  useEffect(() => {
    if (!loading && data && data?.data?.BTC) {
      const mappedData = data.data.BTC[0].quotes.map((item: any) => ({
        x: +new Date(item.timestamp),
        y: item.quote.USD.price.toFixed(2),
      }));
      setSeries([{ data: mappedData, name: 'BTC' }]);
      const { length } = data.data.BTC[0].quotes;
      const btc = data.data.BTC[0].quotes[length - 1].quote.USD;
      const wbtc = data.data.WBTC[0].quotes[length - 1].quote.USD;

      const quotes = [
        {
          coin: 'BTC',
          name: 'Bitcoin',
          img: BTC,
          change: `${btc.percent_change_1h.toFixed(2)}%`,
          price: `$${btc.price.toFixed(1)}`,
        },
        {
          coin: 'WBTC',
          name: 'Wrapped BTC',
          img: WBTC,
          change: `${wbtc.percent_change_1h.toFixed(2)}%`,
          price: `$${wbtc.price.toFixed(1)}`,
        },
      ];

      setQuotesData(quotes);

      setHeadData([
        {
          value: btc.market_cap.toFixed(0),
          percentages: btc.percent_change_1h.toFixed(2),
        },
        {
          value: btc.volume_24h.toFixed(0),
          percentages: btc.percent_change_1h.toFixed(2),
        },
      ]);
    }
  }, [loading, data]);
  const navigate = useNavigate();
  const [openReceiveModal, setOpenReceiveModal] = useState(false);
  const { t: t1 } = useTranslation('translation', { keyPrefix: 'DASHBOARD_SCREEN' });
  const [isBtcReceiveAlertVisible, setIsBtcReceiveAlertVisible] = useState(false);
  const [isOrdinalReceiveAlertVisible, setIsOrdinalReceiveAlertVisible] = useState(false);
  const onReceiveModalOpen = () => {
    setOpenReceiveModal(true);
  };
  const onReceiveModalClose = () => {
    setOpenReceiveModal(false);
  };
  const onBTCReceiveSelect = () => {
    navigate('/receive/BTC');
  };
  const onSTXReceiveSelect = () => {
    navigate('/receive/STX');
  };
  const onOrdinalReceiveAlertOpen = () => {
    if (showOrdinalReceiveAlert) setIsOrdinalReceiveAlertVisible(true);
  };
  const onReceiveAlertOpen = () => {
    if (showBtcReceiveAlert) setIsBtcReceiveAlertVisible(true);
  };
  const onOrdinalsReceivePress = () => {
    navigate('/receive/ORD');
  };
  const receiveContent = (
    <ReceiveContainer>
      <ReceiveCardComponent
        title={t1('BITCOIN')}
        address={btcAddress}
        onQrAddressClick={onBTCReceiveSelect}
        onCopyAddressClick={onReceiveAlertOpen}
      >
        <Icon src={BitcoinToken} />
      </ReceiveCardComponent>

      <ReceiveCardComponent
        title={t1('ORDINALS')}
        address={ordinalsAddress}
        onQrAddressClick={onOrdinalsReceivePress}
        onCopyAddressClick={onOrdinalReceiveAlertOpen}
      >
        <MergedIcon src={OrdinalsIcon} />
      </ReceiveCardComponent>

      <ReceiveCardComponent
        title={t1('STACKS_AND_TOKEN')}
        address={stxAddress}
        onQrAddressClick={onSTXReceiveSelect}
      >
        <MergedIcon src={SIP10Icon} />
      </ReceiveCardComponent>
    </ReceiveContainer>
  );
  return (
    <>
      <AccountHeaderComponent  onReceiveModalOpen={onReceiveModalOpen}/>
      {series && headData ? (
        <ChartContainer>
          <MaskContainer>
            <Mask />
          </MaskContainer>

          <MarketCapDetails
            isMarketCap={currentActiveIndex === 0}
            value={headData[currentActiveIndex]?.value}
            percentages={headData[currentActiveIndex]?.percentages}
          />
          <Chart options={options as any} series={series} type="area" height={240} />
        </ChartContainer>
      ) : null}
      {headData && (
        <StepperBar
          stepsData={headData}
          currentActiveIndex={currentActiveIndex}
          setCurentActiveIndex={setCurentActiveIndex}
        />
      )}
      <BitcoinAssets isLoading={loading} data={quotesData} />
      <BottomModal visible={openReceiveModal} header="Recieve" onClose={onReceiveModalClose}>
          {receiveContent}
        </BottomModal>
      <BottomBar tab="market" />
    </>
  );
}

export default Market;
