/* eslint-disable import/no-extraneous-dependencies */
import BTC from '@assets/img/market/bitcoin.svg';
import WBTC from '@assets/img/market/wbitcoin.svg';
import AccountHeaderComponent from '@components/accountHeader';
import BottomBar from '@components/tabBar';
import useMarketData from '@hooks/useMarketData';
import useWalletSelector from '@hooks/useWalletSelector';
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BitcoinAssets from './BitcoinAssets';
import StepperBar from './StepperBar';

type CoinData = {
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d: number;
  price: number;
  volume_24h: number;
  market_cap: number;
  total_supply: number;
  circulating_supply: number;
  timestamp: string;
  name: string;
};

type ExtractedData = {
  [symbol: string]: CoinData;
};
type Quote = {
  coin: string;
  name: string;
  img: string; // Assuming img is a URL string
  change: string;
  price: string;
  handleClick?: () => void;
};

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

function MarketCapDetails({ isMarketCap, value, percentages, currency = 'USD' }: any) {
  const Currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  });
  return (
    <MarketCapDetailsContainer>
      <Title>{isMarketCap ? 'Market Cap' : 'Trading Volume'}</Title>
      <ItemTitle>{Currency.format(value)}</ItemTitle>
      <ItemTitle>{`${percentages}%`}</ItemTitle>
    </MarketCapDetailsContainer>
  );
}

const getIcon = (symbol) => {
  switch (symbol) {
    case 'BTC':
      return BTC;
    case 'WBTC':
      return WBTC;
    default:
      return '';
  }
};

function Market() {
  const { fiatCurrency } = useWalletSelector();
  const { data, loading } = useMarketData({
    symbol: 'BTC,WBTC,BCH,STX,BSV,ORDI,ALEX,OXBT,SATS,RATS',
    convert: fiatCurrency,
  });
  const [series, setSeries] = useState<any>(null);
  const [quotesData, setQuotesData] = useState<any>([]);
  const [headData, setHeadData] = useState<any[]>([]);
  const [currentActiveIndex, setCurentActiveIndex] = useState<any>(0);
  const [isSelected, setIsSelected] = useState('Bitcoin');
  const Currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: fiatCurrency,
  });

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
        offsetY: -20,
        offsetX: 9.7,
        hideOverlappingLabels: true,
        formatter: (val: any, timestamp: any) => convertTimestampTo12Hour(timestamp),
        style: {
          colors: '#fff',
          fontFamily: 'MontRegular',
          fontSize: 10,
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
        y: item.quote[fiatCurrency].price.toFixed(2),
      }));
      setSeries([{ data: mappedData, name: 'Bitcoin' }]);
      const symbolsToExtract = [
        'BTC',
        'WBTC',
        'BCH',
        'STX',
        'BSV',
        'ORDI',
        'ALEX',
        'OXBT',
        'SATS',
        'RATS',
      ]; // Add more symbols as needed

      const extractedData: ExtractedData = {};

      symbolsToExtract.forEach((symbol) => {
        const symbolData = data.data[symbol];
        if (symbolData && symbolData.length > 0) {
          const { length } = symbolData[0].quotes;
          const latestQuote = symbolData[0].quotes[length - 1].quote[fiatCurrency];
          extractedData[symbol.toLowerCase()] = latestQuote;
          extractedData[symbol.toLowerCase()].name = symbolData[0]?.name;
        }
      });

      const quotes: Quote[] = [];

      Object.entries(extractedData).forEach(([symbol, coinData]) => {
        const quoteMappedData = data.data[symbol.toUpperCase()][0].quotes.map((item: any) => ({
          x: +new Date(item.timestamp),
          y: item.quote[fiatCurrency].price.toFixed(2),
        }));
        const quote = {
          coin: symbol.toUpperCase(),
          name: coinData?.name, // Assuming your data structure includes a 'name' property
          // You can replace the following with actual image URLs for each coin
          img: getIcon(symbol.toUpperCase()),
          change: `${coinData?.percent_change_1h.toFixed(2)}%`,
          price: Currency.format(Number(coinData?.price.toFixed(1))),
          handleClick: () => {
            setIsSelected(coinData.name);
            setSeries([{ data: quoteMappedData, name: coinData.name }]);
            setHeadData([
              {
                value: extractedData[symbol].market_cap.toFixed(0),
                percentages: extractedData[symbol].percent_change_1h.toFixed(2),
              },
              {
                value: extractedData[symbol].volume_24h.toFixed(0),
                percentages: extractedData[symbol].percent_change_1h.toFixed(2),
              },
            ]);
          },
        };

        quotes.push(quote);
      });
      setQuotesData(quotes);
      setHeadData([
        {
          value: extractedData.btc.market_cap.toFixed(0),
          percentages: extractedData.btc.percent_change_1h.toFixed(2),
        },
        {
          value: extractedData.btc.volume_24h.toFixed(0),
          percentages: extractedData.btc.percent_change_1h.toFixed(2),
        },
      ]);
    }
  }, [loading, data]);
  const navigate = useNavigate();
  return (
    <>
      <AccountHeaderComponent onReceive={() => navigate('/receive-main-menu')} />
      {series && headData ? (
        <ChartContainer>
          <MaskContainer>
            <Mask />
          </MaskContainer>

          <MarketCapDetails
            isMarketCap={currentActiveIndex === 0}
            value={headData[currentActiveIndex]?.value}
            percentages={headData[currentActiveIndex]?.percentages}
            currency={fiatCurrency}
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
      <BitcoinAssets isLoading={loading} data={quotesData} isSelected={isSelected} />
      <BottomBar tab="market" />
    </>
  );
}

export default Market;
