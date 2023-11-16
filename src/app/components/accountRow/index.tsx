import styled from 'styled-components';
// import { getAccountGradient } from '@utils/gradient';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import OrdinalsIcon from '@assets/img/nftDashboard/white_ordinals_icon.svg';
// import { useTranslation } from 'react-i18next';
import { getTruncatedAddress, getAddressDetail } from '@utils/helper';
import BarLoader from '@components/barLoader';
import Copy from '@assets/img/NewCopy.svg';
import Menu from '@assets/img/Menu.svg';
import QR from '@assets/img/QR.svg';
import { LoaderSize } from '@utils/constants';
import { Account } from '@secretkeylabs/xverse-core';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { ChangeShowBtcReceiveAlertAction } from '@stores/wallet/actions/actionCreators';
import useWalletSelector from '@hooks/useWalletSelector';

interface GradientCircleProps {
  firstGradient: string;
  secondGradient: string;
  thirdGradient: string;
}

const RowContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
});

const GradientCircle = styled.button<GradientCircleProps>((props) => ({
  height: 40,
  width: 40,
  borderRadius: 25,
  background: `linear-gradient(to bottom,${props.firstGradient}, ${props.secondGradient},${props.thirdGradient} )`,
}));

const TopSectionContainer = styled.button((props) => ({
  display: 'flex',
  flexDirection: 'row',
  flex: 1,
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'transparent',
  padding: props.theme.spacing(3),
}));

const CurrentAccountContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  paddingLeft: props.theme.spacing(6),
}));
const CurrentAccountContainerList = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: props.theme.spacing(6),
  paddingRight: props.theme.spacing(6),
  paddingBottom: props.theme.spacing(6),
}));
const CurrentSelectedAccountText = styled.h1((props) => ({
  ...props.theme.body_bold_m,
  color: props.theme.colors.white['0'],
  textAlign: 'start',
}));

const CurrentUnSelectedAccountText = styled.h1((props) => ({
  ...props.theme.body_m,
  fontFamily: 'MontRegular',
  fontWeight: 600,
  fontSize: 20,
  color: props.theme.colors.white['0'],
  textAlign: 'start',
}));

const CurrentAccountDetailText = styled.h1((props) => ({
  ...props.theme.body_m,
  color: props.theme.colors.white['400'],
  marginTop: props.theme.spacing(1),
}));
const GrayedOutText = styled.h1((props) => ({
  ...props.theme.body_m,
  fontFamily: 'MontRegular',
  fontWeight: 600,
  fontSize: 20,
  textAlign: 'start',
  color: props.theme.colors.white['400'],
  marginTop: props.theme.spacing(1),
}));

const AccountSection = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  gap: props.theme.spacing(32),
  alignItems: 'center',
  backgroundColor: 'transparent',
}));
const AccountSectionBar = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  padding: '8px 22px',
  justifyContent: 'center',
  gap: props.theme.spacing(8),
  alignItems: 'center',
  borderRadius: props.theme.radius(1),
  border: '1px solid rgba(168, 185, 244, 0.20)',
  background:
    'radial-gradient(489.09% 91.61% at 89.79% 22.85%, rgba(56, 60, 78, 0.20) 0%, rgba(13, 14, 18, 0.20) 100%)',
}));
const BarLoaderContainer = styled.div((props) => ({
  width: 200,
  paddingTop: props.theme.spacing(2),
  backgroundColor: 'transparent',
}));

const CopyImage = styled.img`
  margin-right: 4px;
`;

const StyledToolTip = styled(Tooltip)`
  background-color: #ffffff;
  color: #12151e;
  border-radius: 8px;
  padding: 7px;
`;

const AddressContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
});

const CopyButton = styled.button`
  color: #ffffff;
  margin-top: 3px;
  /* margin-right: 10px; */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: transparent;
  :hover {
    opacity: 1;
  }
  :focus {
    opacity: 1;
  }
`;

const OrdinalImage = styled.img({
  width: 12,
  height: 12,
  marginRight: 4,
});

const AddressText = styled.h1((props) => ({
  ...props.theme.body_m,
  marginTop: props.theme.spacing(1),
  color: props.theme.colors.white['400'],
}));

const BitcoinDot = styled.div((props) => ({
  borderRadius: 20,
  background: props.theme.colors.feedback.caution,
  width: 10,
  marginRight: 4,
  marginLeft: 4,
  height: 10,
}));

const ButtonSection = styled.div((props) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: props.theme.spacing(6),
  background: 'transparent',
  paddingRight: props.theme.spacing(6),
}));

const IconButton = styled.button((props) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  background: 'transparent',
}));

interface Props {
  account: Account | null;
  isSelected: boolean;
  allowCopyAddress?: boolean;
  showOrdinalAddress?: boolean;
  disableMenuOption?: boolean;
  onAccountSelected: (account: Account) => void;
  handleSettingsSelect?: () => void;
  onReceiveModalOpen?: () => void;
  forAccountManagement: boolean;
}
interface DisplayAddressProps {
  account: Account | null;
  allowCopyAddress?: boolean;
  showOrdinalAddress?: boolean;
  onBtcCopied?: any;
  showOrdinalBtcAddress?: any;
  handleOnBtcAddressClick?: any;
}
function DisplayAddress({
  account,
  allowCopyAddress,
  handleOnBtcAddressClick,
  showOrdinalAddress,
  showOrdinalBtcAddress,
  onBtcCopied,
}: DisplayAddressProps) {
  if (allowCopyAddress)
    return (
      <RowContainer>
        <CopyButton id="bitcoin-address" onClick={handleOnBtcAddressClick}>
          <CopyImage src={Copy} alt="copy" />
        </CopyButton>
        <StyledToolTip
          anchorId="bitcoin-address"
          variant="light"
          content={onBtcCopied ? 'Copied' : ''}
          events={['hover']}
          place="bottom"
        />

        {/* <CopyButton id="stacks-address" onClick={handleOnStxAddressClick}>
        <CopyImage src={Copy} alt="copy" />
        <CurrentUnSelectedAccountText>
          {getTruncatedAddress(account?.stxAddress!)}
        </CurrentUnSelectedAccountText>
      </CopyButton>
      <StyledToolTip
        anchorId="stacks-address"
        variant="light"
        content={onStxCopied ? 'Copied' : 'Stacks address'}
        events={['hover']}
        place="bottom"
      /> */}
      </RowContainer>
    );
  return (
    <CurrentAccountDetailText>
      {showOrdinalAddress ? showOrdinalBtcAddress : getAddressDetail(account!)}
    </CurrentAccountDetailText>
  );
}
function AccountRow({
  account,
  isSelected,
  disableMenuOption,
  handleSettingsSelect,
  onAccountSelected,
  allowCopyAddress,
  onReceiveModalOpen,
  showOrdinalAddress,
  forAccountManagement = false,
}: Props) {
  // const { t } = useTranslation('translation', { keyPrefix: 'DASHBOARD_SCREEN' });
  const { showBtcReceiveAlert } = useWalletSelector();
  // const gradient = getAccountGradient(account?.stxAddress!);
  // const [onStxCopied, setOnStxCopied] = useState(false);
  const [onBtcCopied, setOnBtcCopied] = useState(false);
  const dispatch = useDispatch();
  const btcCopiedTooltipTimeoutRef = useRef<NodeJS.Timeout | undefined>();
  const stxCopiedTooltipTimeoutRef = useRef<NodeJS.Timeout | undefined>();

  useEffect(
    () => () => {
      clearTimeout(btcCopiedTooltipTimeoutRef.current);
      clearTimeout(stxCopiedTooltipTimeoutRef.current);
    },
    [],
  );

  // function getName() {
  //   return account?.bnsName ?? `${t('ACCOUNT_NAME')} ${`${(account?.id ?? 0) + 1}`}`;
  // }

  const handleOnBtcAddressClick = () => {
    navigator.clipboard.writeText(account?.btcAddress!);
    setOnBtcCopied(true);
    // setOnStxCopied(false);
    // set 'Copied' text back to 'Bitcoin address' after 3 seconds
    btcCopiedTooltipTimeoutRef.current = setTimeout(() => setOnBtcCopied(false), 3000);
    if (showBtcReceiveAlert !== null) {
      dispatch(ChangeShowBtcReceiveAlertAction(true));
    }
  };

  // const handleOnStxAddressClick = () => {
  //   navigator.clipboard.writeText(account?.stxAddress!);
  //   setOnStxCopied(true);
  //   setOnBtcCopied(false);
  //   // set 'Copied' text back to 'Stacks address' after 3 seconds
  //   stxCopiedTooltipTimeoutRef.current = setTimeout(() => setOnStxCopied(false), 3000);
  // };

  const onRowClick = () => {
    if (!allowCopyAddress) {
      onAccountSelected(account!);
    }
  };

  const onClick = () => {
    onAccountSelected(account!);
  };

  const showOrdinalBtcAddress = (
    <RowContainer>
      <AddressContainer>
        <OrdinalImage src={OrdinalsIcon} />
        <AddressText>{`${getTruncatedAddress(account?.ordinalsAddress!)} / `}</AddressText>
      </AddressContainer>
      <AddressContainer>
        <BitcoinDot />
        <AddressText>{`${getTruncatedAddress(account?.btcAddress!)}`}</AddressText>
      </AddressContainer>
    </RowContainer>
  );
  const getAccountDetails = (grayedOut) => {
    const input = getAddressDetail(account!);
    const accountDetails = input.split('/');
    return grayedOut ? accountDetails[1] : accountDetails[0];
  };

  return forAccountManagement ? (
    <CurrentAccountContainerList>
      {!account ? (
        <BarLoaderContainer>
          <BarLoader loaderSize={LoaderSize.LARGE} />
          <BarLoader loaderSize={LoaderSize.MEDIUM} />
        </BarLoaderContainer>
      ) : (
        <AccountSectionBar onClick={onClick}>
          <CurrentUnSelectedAccountText>{getAccountDetails(false)}</CurrentUnSelectedAccountText>
          <GrayedOutText>/</GrayedOutText>
          <GrayedOutText>{getAccountDetails(true)}</GrayedOutText>
        </AccountSectionBar>
      )}
    </CurrentAccountContainerList>
  ) : (
    <TopSectionContainer>
      <CurrentAccountContainer>
        {!account ? (
          <BarLoaderContainer>
            <BarLoader loaderSize={LoaderSize.LARGE} />
            <BarLoader loaderSize={LoaderSize.MEDIUM} />
          </BarLoaderContainer>
        ) : (
          <AccountSection>
            <CurrentUnSelectedAccountText onClick={onClick}>
              {getTruncatedAddress(account?.btcAddress!)}
              {/* {getAddressDetail(account!)} */}
            </CurrentUnSelectedAccountText>
          </AccountSection>
        )}
      </CurrentAccountContainer>
      <ButtonSection>
        <DisplayAddress
          account={account}
          allowCopyAddress={allowCopyAddress}
          showOrdinalAddress={showOrdinalAddress}
          onBtcCopied={onBtcCopied}
          handleOnBtcAddressClick={handleOnBtcAddressClick}
          showOrdinalBtcAddress={showOrdinalBtcAddress}
        />
        {!disableMenuOption && (
          <IconButton onClick={onReceiveModalOpen}>
            <img src={QR} alt="Receive" />
          </IconButton>
        )}
        {!disableMenuOption && (
          <IconButton onClick={handleSettingsSelect}>
            <img src={Menu} alt="Settings" />
          </IconButton>
        )}
      </ButtonSection>
    </TopSectionContainer>
  );
}

export default AccountRow;
