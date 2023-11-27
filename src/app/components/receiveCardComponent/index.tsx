import Copy from '@assets/img/nftDashboard/Copy.svg';
import QrCode from '@assets/img/nftDashboard/QrCode.svg';
import ActionButton from '@components/button';
import StyledTooltip from '@components/styledTooltip';
import { getShortTruncatedAddress } from '@utils/helper';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import 'react-tooltip/dist/react-tooltip.css';
import styled from 'styled-components';

const ReceiveCard = styled.div((props) => ({
  background: props.theme.colors.background.orangePillBg,
  borderRadius: 12,
  border: '1px solid rgba(168, 185, 244, 0.15)',
  width: '320px',
  height: '60px',
  padding: props.theme.spacing(8),
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}));

const Button = styled.button((props) => ({
  background: 'transparent',
  borderRadius: props.theme.radius(7),
  width: 40,
  height: 40,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: props.theme.spacing(2),
  padding: props.theme.spacing(4),
}));

const ColumnContainer = styled.div({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
});
const RowContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
});

const ButtonIcon = styled.img({
  width: 22,
  height: 22,
});

const TitleText = styled.h1((props) => ({
  ...props.theme.body_bold_m,
  marginTop: props.theme.spacing(3),
  color: props.theme.colors.white_0,
}));

const AddressText = styled.h1((props) => ({
  ...props.theme.body_medium_m,
  marginTop: props.theme.spacing(1),
  color: props.theme.colors.white_400,
}));

const VerifyButtonContainer = styled.div({
  width: 68,
});

interface Props {
  className?: string;
  title: string;
  address: string;
  onQrAddressClick: () => void;
  children?: ReactNode;
  onCopyAddressClick?: () => void;
  showVerifyButton?: boolean;
  currency?: string;
  fromMainMenu?: boolean;
}

function ReceiveCardComponent({
  className,
  children,
  title,
  address,
  onQrAddressClick,
  onCopyAddressClick,
  showVerifyButton,
  currency,
  fromMainMenu = false,
}: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'NFT_DASHBOARD_SCREEN' });
  let addressText = 'Receive Ordinals & BRC20 tokens';

  if (currency === 'BTC') addressText = 'Receive payments in BTC';
  if (currency === 'STX') addressText = 'Receive STX, Stacks NFTs & SIP-10';

  const onCopyClick = () => {
    navigator.clipboard.writeText(address);
    if (onCopyAddressClick) onCopyAddressClick();
  };

  const getCopyId = () => {
    switch (title) {
      case 'Bitcon':
        return 'copy-address-bitcoin';
      case 'Stacks and SIP-10':
        return 'copy-address-stx';
      default:
        return 'copy-address-ordinals';
    }
  };
  return (
    <ReceiveCard className={className}>
      <ColumnContainer>
        {children}
        <TitleText>{title}</TitleText>
        {!fromMainMenu && (
          <AddressText>
            {showVerifyButton ? addressText : getShortTruncatedAddress(address)}
          </AddressText>
        )}
      </ColumnContainer>
      {showVerifyButton ? (
        <VerifyButtonContainer>
          <ActionButton
            transparent
            text="Verify"
            onPress={async () => {
              await chrome.tabs.create({
                url: chrome.runtime.getURL(`options.html#/verify-ledger?currency=${currency}`),
              });
            }}
          />
        </VerifyButtonContainer>
      ) : (
        <RowContainer>
          <Button id={getCopyId()} onClick={onCopyClick}>
            <ButtonIcon src={Copy} />
          </Button>
          <StyledTooltip
            anchorSelect={getCopyId()}
            content={t('COPIED')}
            place="top"
            noArrow
            openOnClick
          />
          <Button onClick={onQrAddressClick}>
            <ButtonIcon src={QrCode} />
          </Button>
        </RowContainer>
      )}
    </ReceiveCard>
  );
}

export default ReceiveCardComponent;
