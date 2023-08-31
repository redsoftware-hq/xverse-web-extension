import Separator from '@components/separator';
import { Coin } from '@secretkeylabs/xverse-core/types';
import { getTicker } from '@utils/helper';
import { useState } from 'react';
import Switch from 'react-switch';
import stc from 'string-to-color';
import styled from 'styled-components';
import Theme from 'theme';

const RowContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '13px 22px 13px 24px;',
  gap: props.theme.spacing(8),
  borderRadius: props.theme.radius(1),
  border: '1px solid rgba(168, 185, 244, 0.20)',
  background:
    'radial-gradient(489.09% 91.61% at 89.79% 22.85%, rgba(56, 60, 78, 0.20) 0%, rgba(13, 14, 18, 0.20) 100%)',
  marginTop: props.theme.spacing(11),
}));

const CoinContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const BottomContainer = styled.div({
  marginBottom: 30,
});

const CoinIcon = styled.img((props) => ({
  marginRight: props.theme.spacing(7),
  width: 32,
  height: 32,
  resizeMode: 'stretch',
}));

const CustomSwitch = styled(Switch)`
  .react-switch-handle {
    background-color: ${({ checked }) =>
      checked ? '#E12828  ' : 'rgba(210, 52, 3, 0.20)'} !important;
    border: ${({ checked }) => (checked ? '' : '1px solid #D23403')} !important;
    border-radius: 15px;
  }
  .react-switch-bg {
    background-color: rgba(210, 52, 3, 0.2);
  }
`;

const TickerIconContainer = styled.div((props) => ({
  display: 'flex',
  marginRight: props.theme.spacing(7),
  height: 30,
  width: 30,
  borderRadius: props.theme.radius(3),
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: props.color,
}));

const TickerText = styled.h1((props) => ({
  ...props.theme.body_xs,
  color: props.theme.colors.white_0,
  textAlign: 'center',
  wordBreak: 'break-all',
  fontSize: 10,
}));

const SelectedCoinTitleText = styled.h1((props) => ({
  ...props.theme.body_bold_m,
  color: props.theme.colors.white_0,
  textAlign: 'center',
}));

const UnSelectedCoinTitleText = styled.h1((props) => ({
  ...props.theme.body_m,
  color: props.theme.colors.white_400,
  textAlign: 'center',
}));

interface Props {
  coin: Coin;
  disabled: boolean;
  toggled(enabled: boolean, coin: Coin): void;
  enabled?: boolean;
  showDivider: boolean;
}

function CoinItem({ coin, disabled, toggled, enabled, showDivider }: Props) {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    toggled(!isEnabled, coin);
  };

  function getFtTicker() {
    const { ticker } = coin;
    return !ticker && coin.name ? getTicker(coin.name) : ticker;
  }
  const background = stc(getFtTicker());

  return (
    <>
      <RowContainer>
        <CoinContainer>
          {/* {coin.image ? (
            <CoinIcon src={coin.image} />
          ) : (
            <TickerIconContainer color={background}>
              <TickerText>{getFtTicker()}</TickerText>
            </TickerIconContainer>
          )} */}
          {isEnabled ? (
            <SelectedCoinTitleText>{coin.name}</SelectedCoinTitleText>
          ) : (
            <UnSelectedCoinTitleText>{coin.name}</UnSelectedCoinTitleText>
          )}
        </CoinContainer>
        <CustomSwitch
          onColor={Theme.colors.background.sliderBg}
          offColor={Theme.colors.background.sliderBg}
          onChange={toggleSwitch}
          checked={isEnabled!}
          uncheckedIcon={false}
          checkedIcon={false}
          disabled={disabled}
        />
      </RowContainer>
      {!showDivider && <BottomContainer />}
    </>
  );
}

export default CoinItem;
