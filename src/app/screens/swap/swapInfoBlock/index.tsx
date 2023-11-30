import ChevronIcon from '@assets/img/swap/chevron.svg';
import SlippageEditIcon from '@assets/img/swap/slippageEdit.svg';
import Tick from '@assets/img/swap/Tick.svg';
import BottomModal from '@components/bottomModal';
import CustomSwitchSlider from '@components/customSwitch';
import { SlippageModalContent } from '@screens/swap/slippageModal';
import { SUPPORT_URL_TAB_TARGET, SWAP_SPONSOR_DISABLED_SUPPORT_URL } from '@utils/constants';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Switch from 'react-switch';
import styled, { useTheme } from 'styled-components';
import { UseSwap } from '../types';

const CustomSwitch = styled(Switch)`
  .react-switch-handle {
    background-color: ${({ checked }) =>
      checked ? '#E12828  ' : 'rgba(210, 52, 3, 0.20)'} !important;
    border: ${({ checked }) => (checked ? '' : '1px solid #D23403')} !important;
    border-radius: 15px;
    height: 16px !important;
    width: 16px !important;
  }
  .react-switch-bg {
    background-color: rgba(210, 52, 3, 0.2);
  }
`;

const PoweredByAlexText = styled.span((props) => ({
  ...props.theme.body_xs,
  color: props.theme.colors.white_400,
}));

const DetailButton = styled.button((props) => ({
  display: 'flex',
  flexDirection: 'row',
  columnGap: props.theme.spacing(2),
  marginLeft: 'auto',
  borderRadius: '15px',
  maxWidth: '75px',
  padding: '6px 12px',
  background: 'rgba(210, 52, 3, 0.20)',
  alignItems: 'center',
  ...props.theme.body_medium_m,
  color: props.theme.colors.action.classic,
}));

const Container = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: '16px',
}));
const DL = styled.dl((props) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  rowGap: props.theme.spacing(8),
}));

const DT = styled.dt((props) => ({
  ...props.theme.body_medium_m,
  color: props.theme.colors.secondaryText,
  flex: '50%',
}));

const DD = styled.dd((props) => ({
  ...props.theme.body_medium_m,
  color: props.theme.colors.white_0,
  flex: '50%',
  display: 'flex',
  alignContent: 'center',
  justifyContent: 'flex-end',
  textAlign: 'right',
}));

const ChevronImage = styled.img<{ rotated: boolean }>(({ rotated }) => ({
  transform: `rotate(${rotated ? 180 : 0}deg)`,
  transition: 'transform 0.1s ease-in-out',
}));

const SlippageImg = styled.img(() => ({
  width: 16,
  height: 16,
}));
const SlippageEditContainer = styled.div({
  display: 'flex',
  gap: 8,
  alignItems: 'center',
});
const CannotBeSponsored = styled.p((props) => ({
  ...props.theme.body_medium_m,
  color: props.theme.colors.white_200,
}));

const SponsorTransactionSwitchLabel = styled(DT)<{ disabled: boolean }>((props) => ({
  color: props.disabled ? props.theme.colors.secondaryText : props.theme.colors.secondaryText,
}));

const ToggleContainer = styled(DD)({
  flex: 0,
});

const LearnMoreAnchor = styled.a((props) => ({
  ...props.theme.body_bold_m,
  color: props.theme.colors.white_0,
  marginTop: props.theme.spacing(2),
  display: 'block',
}));
const DetailsHeader = styled.div((props) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
}));
const DetailsText = styled.div((props) => ({
  ...props.theme.body_medium_xl,
  color: props.theme.colors.action.classic,
}));
export function SwapInfoBlock({ swap }: { swap: UseSwap }) {
  const [expandDetail, setExpandDetail] = useState(false);
  const { t } = useTranslation('translation', { keyPrefix: 'SWAP_SCREEN' });
  const [showSlippageModal, setShowSlippageModal] = useState(false);
  const theme = useTheme();

  return (
    <>
      <DetailButton onClick={() => setExpandDetail(!expandDetail)}>{t('DETAILS')}</DetailButton>
      <BottomModal
        header={
          <DetailsHeader>
            <img src={Tick} alt="tick" />
            <DetailsText>Details</DetailsText>
          </DetailsHeader>
        }
        visible={expandDetail}
        noTextHeader
        onClose={() => setExpandDetail(false)}
        overlayStylesOverriding={{
          background: 'rgba(0, 0, 0, 0.80)',
          backdropFilter: 'blur(10px)',
        }}
        contentStylesOverriding={{
          borderRadius: '12px',
          border: '1px solid #1F232D',
          maxWidth: '350px',
          maxHeight: '305px',
          top: 0,
          bottom: 0,
          width: 'unset',
          marginTop: 'auto',
          marginBottom: 'auto',
          marginLeft: '10px',
          marginRight: '10px',
        }}
      >
        <Container>
          <DL>
            <DT>{t('MIN_RECEIVE')}</DT>
            <DD>{swap.minReceived ?? '--'}</DD>
            <DT>{t('SLIPPAGE')}</DT>
            <DD>
              <SlippageEditContainer>
                {swap.slippage * 100}%
                <DetailButton onClick={() => setShowSlippageModal(true)}>Edit</DetailButton>
              </SlippageEditContainer>
            </DD>
            <DT>{t('LP_FEE')}</DT>
            <DD>{swap.swapInfo?.lpFee ?? '--'}</DD>
            <DT>{t('ROUTE')}</DT>
            <DD>{swap.swapInfo?.route ?? '--'}</DD>
            {swap.isServiceRunning && (
              <>
                <>
                  <SponsorTransactionSwitchLabel disabled={swap.isSponsorDisabled}>
                    {t('SPONSOR_TRANSACTION')}
                  </SponsorTransactionSwitchLabel>
                  <ToggleContainer>
                    <CustomSwitch
                      onColor={theme.colors.background.sliderBg}
                      offColor={theme.colors.background.sliderBg}
                      onChange={swap.handleChangeUserOverrideSponsorValue}
                      checked={swap.isSponsored}
                      disabled={swap.isSponsorDisabled}
                      uncheckedIcon={false}
                      checkedIcon={false}
                      height={19}
                      width={36}
                    />
                  </ToggleContainer>
                </>
                {swap.isSponsorDisabled && (
                  <div>
                    <CannotBeSponsored>
                      {t('SWAP_TRANSACTION_CANNOT_BE_SPONSORED')}
                    </CannotBeSponsored>
                    <LearnMoreAnchor
                      href={SWAP_SPONSOR_DISABLED_SUPPORT_URL}
                      target={SUPPORT_URL_TAB_TARGET}
                      rel="noopener noreferrer"
                    >
                      {t('LEARN_MORE')}
                      {' →'}
                    </LearnMoreAnchor>
                  </div>
                )}
              </>
            )}
          </DL>
        </Container>
      </BottomModal>
      <BottomModal
        header={t('SLIPPAGE_TITLE')}
        visible={showSlippageModal}
        onClose={() => setShowSlippageModal(false)}
      >
        <SlippageModalContent
          slippage={swap.slippage}
          onChange={(slippage) => {
            swap.onSlippageChanged(slippage);
            setShowSlippageModal(false);
          }}
        />
      </BottomModal>
    </>
  );
}
export default SwapInfoBlock;
