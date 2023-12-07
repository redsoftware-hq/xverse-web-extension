import Swap from '@assets/img/swap/Swap_confirm.svg';
import TokenImage from '@components/tokenImage';
import { animated, config, useSpring } from '@react-spring/web';
import {
  Container,
  FoldButton,
  TitleContainer,
  TitleText,
} from '@screens/swap/swapConfirmation/stxInfoBlock';
import { SwapConfirmationOutput } from '@screens/swap/swapConfirmation/useConfirmSwap';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const RouteProgress = styled.div((props) => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flex: 1,
  background: '#14161C',
  marginTop: props.theme.spacing(8),
}));

const ProgressItem = styled.div((props) => ({
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  position: 'relative',
  paddingRight: props.theme.spacing(3.5),
  paddingLeft: props.theme.spacing(3.5),
  background: '#14161C',
}));

const ProgressItemText = styled.p((props) => ({
  ...props.theme.body_m,
  fontWeight: 400,
  color: props.theme.colors.white_0,
  marginTop: props.theme.spacing(4),
}));
const ExpandedContainer = styled(animated.div)<{ isExpanded: boolean }>((props) => ({
  display: 'flex',
  background: '#14161C',
  flexDirection: 'column',
  padding: props.isExpanded ? '10px 18px' : '0px',
  borderTop: '1px solid #1F232D',
  borderRadius: '0px 0px 11px 11px',
}));
const SwapIcon = styled.img((props) => ({
  width: 18,
  height: 18,
  left: 0,
  right: 0,
  margin: 'auto',
  position: 'absolute',
}));
export default function RouteBlock({ swap }: { swap: SwapConfirmationOutput }) {
  const { t } = useTranslation('translation', { keyPrefix: 'SWAP_CONFIRM_SCREEN' });
  const [isFold, setIsFold] = useState(false);
  const slideInStyles = useSpring({
    config: { ...config.gentle, duration: 400 },
    from: { opacity: 0, height: 0 },
    to: {
      opacity: !isFold ? 1 : 0,
      height: !isFold ? 'auto' : 0,
    },
  });
  return (
    <Container isExpanded={!isFold}>
      <TitleContainer>
        <TitleText>{t('ROUTE')}</TitleText>
        <FoldButton isFold={isFold} onSwitch={() => setIsFold((prev) => !prev)} />
      </TitleContainer>
      {isFold ? null : (
        <ExpandedContainer isExpanded={!isFold} style={slideInStyles}>
          <RouteProgress>
            <SwapIcon src={Swap} />
            {swap.routers.map(({ name, image }) => (
              <ProgressItem key={name}>
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <TokenImage {...image} size={36} />
                <ProgressItemText>{name}</ProgressItemText>
              </ProgressItem>
            ))}
          </RouteProgress>
        </ExpandedContainer>
      )}
    </Container>
  );
}
