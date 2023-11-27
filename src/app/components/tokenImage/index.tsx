import IconBitcoin from '@assets/img/dashboard/NewBitcoin_icon.svg';
import IconStacks from '@assets/img/dashboard/stack_icon.svg';
import IconUsdc from '@assets/img/dashboard/usdc.svg';
import IconUsdt from '@assets/img/dashboard/usdt.svg';
import Default from '@assets/img/dashboard/Wallet.svg';
import IconWbtc from '@assets/img/dashboard/wbtc.svg';
import BarLoader from '@components/barLoader';
import { FungibleToken } from '@secretkeylabs/xverse-core';
import { LoaderSize } from '@utils/constants';
import { getTicker } from '@utils/helper';
import { useCallback } from 'react';
import stc from 'string-to-color';
import styled from 'styled-components';

export interface TokenImageProps {
  token?: string;
  loading?: boolean;
  fungibleToken?: FungibleToken;
  size?: number;
  loaderSize?: LoaderSize;
  round?: boolean;
  isSmallSize?: boolean;
}

const TickerImage = styled.img<{ size?: number; round?: boolean; isSmallSize?: boolean }>(
  (props) => ({
    height: props.isSmallSize ? 32 : 56,
    width: props.isSmallSize ? 32 : 56,
    borderRadius: 30,
  }),
);

const LoaderImageContainer = styled.div({
  flex: 0.5,
});

const TickerIconContainer = styled.div<{ size?: number; round?: boolean }>((props) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: props.size ?? 44,
  width: props.size ?? 44,
  borderRadius: props.round ? '50%' : props.theme.radius(2),
  backgroundColor: props.color,
}));

const TickerIconText = styled.h1((props) => ({
  ...props.theme.body_bold_m,
  color: props.theme.colors.white_0,
  textAlign: 'center',
  wordBreak: 'break-all',
  fontSize: 13,
}));

export default function TokenImage(props: TokenImageProps) {
  const { token, loading, fungibleToken, isSmallSize, loaderSize, size, round } = props;
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
        <TickerIconContainer size={size} color={background} round={round}>
          <TickerIconText>{ticker}</TickerIconText>
        </TickerIconContainer>
      );
    }
    return (
      <LoaderImageContainer>
        <BarLoader loaderSize={loaderSize ?? LoaderSize.LARGE} />
      </LoaderImageContainer>
    );
  }

  return <TickerImage isSmallSize={isSmallSize} src={getCoinIcon()} />;
}
