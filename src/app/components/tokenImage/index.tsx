import styled from 'styled-components';
import IconBitcoin from '@assets/img/dashboard/NewBitcoin_icon.svg';
import IconStacks from '@assets/img/dashboard/stack_icon.svg';
import IconUsdc from '@assets/img/dashboard/usdc.svg';
import IconUsdt from '@assets/img/dashboard/usdt.svg';
import IconWbtc from '@assets/img/dashboard/wbtc.svg';
import Default from '@assets/img/dashboard/Wallet.svg';
import { useCallback } from 'react';
import BarLoader from '@components/barLoader';
import stc from 'string-to-color';
import { LoaderSize } from '@utils/constants';
import { getTicker } from '@utils/helper';
import { FungibleToken } from '@secretkeylabs/xverse-core';

interface TokenImageProps {
  token?: string;
  loading?: boolean;
  fungibleToken?: FungibleToken;
  isSmallSize?: boolean;
}

interface ImageProps {
  isSmallSize?: boolean;
}
interface TextProps {
  isSmallSize?: boolean;
}

const TickerImage = styled.img<ImageProps>((props) => ({
  height: props.isSmallSize ? 32 : 56,
  width: props.isSmallSize ? 32 : 56,
  borderRadius: 30,
}));

const LoaderImageContainer = styled.div({
  flex: 0.5,
});

const TickerIconContainer = styled.div<ImageProps>((props) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: props.isSmallSize ? 32 : 40,
  width: props.isSmallSize ? 32 : 40,
  marginRight: props.theme.spacing(3),
  borderRadius: 30,
  backgroundColor: props.color,
}));

const TickerIconText = styled.h1<TextProps>((props) => ({
  ...props.theme.body_bold_m,
  color: props.theme.colors.white['0'],
  textAlign: 'center',
  wordBreak: 'break-all',
  fontSize: props.isSmallSize ? 10 : 13,
}));

export default function TokenImage(props: TokenImageProps) {
  const { token, loading, fungibleToken, isSmallSize } = props;
  const getImageSourceForFt = () => {
    switch (fungibleToken?.ticker) {
      case 'sUSDT':
        return IconUsdt;
      case 'xBTC':
        return IconWbtc;
      case 'xUSD':
        return IconUsdc;
      default:
        return fungibleToken?.image;
    }
  };
  const getCoinIcon = useCallback(() => {
    if (token === 'STX') {
      return IconStacks;
    }
    if (token === 'BTC') {
      return IconBitcoin;
    }
    return Default;
  }, [token]);

  if (fungibleToken) {
    if (!loading) {
      if (fungibleToken?.image) {
        const Imgsrc = getImageSourceForFt();
        return <TickerImage isSmallSize={isSmallSize} src={Imgsrc} />;
      }
      let ticker = fungibleToken?.ticker;
      if (!ticker && fungibleToken?.name) {
        ticker = getTicker(fungibleToken?.name);
      }
      const background = stc(ticker);
      ticker = ticker && ticker.substring(0, 4);
      return (
        <TickerIconContainer isSmallSize={isSmallSize} color={background}>
          <TickerIconText isSmallSize={isSmallSize}>{ticker}</TickerIconText>
        </TickerIconContainer>
      );
    }
    return (
      <LoaderImageContainer>
        <BarLoader loaderSize={LoaderSize.LARGE} />
      </LoaderImageContainer>
    );
  }

  return <TickerImage isSmallSize={isSmallSize} src={getCoinIcon()} />;
}
