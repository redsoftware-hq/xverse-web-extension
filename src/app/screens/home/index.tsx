import dashboardIcon from '@assets/img/dashboard-icon.svg';
import BitcoinToken from '@assets/img/dashboard/bitcoin_token.svg';
import ListDashes from '@assets/img/dashboard/list_dashes.svg';
import ordinalsIcon from '@assets/img/dashboard/ordinalBRC20.svg';
import stacksIcon from '@assets/img/dashboard/stx_icon.svg';
import ArrowSwap from '@assets/img/icons/ArrowSwap.svg';
import AccountHeaderComponent from '@components/accountHeader';
import BottomModal from '@components/bottomModal';
import ReceiveCardComponent from '@components/receiveCardComponent';
import ShowBtcReceiveAlert from '@components/showBtcReceiveAlert';
import ShowOrdinalReceiveAlert from '@components/showOrdinalReceiveAlert';
import BottomBar from '@components/tabBar';
import { useVisibleBrc20FungibleTokens } from '@hooks/queries/ordinals/useGetBrc20FungibleTokens';
import { useVisibleRuneFungibleTokens } from '@hooks/queries/runes/useGetRuneFungibleTokens';
import { useVisibleSip10FungibleTokens } from '@hooks/queries/stx/useGetSip10FungibleTokens';
import useAppConfig from '@hooks/queries/useAppConfig';
import useBtcWalletData from '@hooks/queries/useBtcWalletData';
import useFeeMultipliers from '@hooks/queries/useFeeMultipliers';
import useSpamTokens from '@hooks/queries/useSpamTokens';
import useStxWalletData from '@hooks/queries/useStxWalletData';
import useHasFeature from '@hooks/useHasFeature';
import useNotificationBanners from '@hooks/useNotificationBanners';
import useSanityCheck from '@hooks/useSanityCheck';
import useTrackMixPanelPageViewed from '@hooks/useTrackMixPanelPageViewed';
import useWalletSelector from '@hooks/useWalletSelector';
import { ArrowDown, ArrowUp, Plus } from '@phosphor-icons/react';
import CoinSelectModal from '@screens/home/coinSelectModal';
import { type FungibleToken } from '@secretkeylabs/xverse-core';
import {
  changeShowDataCollectionAlertAction,
  setBrc20ManageTokensAction,
  setRunesManageTokensAction,
  setSip10ManageTokensAction,
  setSpamTokenAction,
} from '@stores/wallet/actions/actionCreators';
import Button from '@ui-library/button';
import Sheet from '@ui-library/sheet';
import SnackBar from '@ui-library/snackBar';
import { CurrencyTypes } from '@utils/constants';
import { isInOptions, isLedgerAccount } from '@utils/helper';
import { optInMixPanel, optOutMixPanel } from '@utils/mixpanel';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import SquareButton from '../../components/squareButton';
import BalanceCard from './balanceCard';
import Banner from './banner';
import {
  ButtonImage,
  ButtonText,
  ColumnContainer,
  Container,
  Icon,
  IconBackground,
  MergedIcon,
  MergedOrdinalsIcon,
  ModalButtonContainer,
  ModalContent,
  ModalControlsContainer,
  ModalDescription,
  ModalIcon,
  ModalTitle,
  ReceiveContainer,
  RowButtonContainer,
  StacksIcon,
  StyledDivider,
  StyledTokenTile,
  TokenListButton,
  TokenListButtonContainer,
  VerifyButtonContainer,
  VerifyOrViewContainer,
} from './index.styled';

function Home() {
  const { t } = useTranslation('translation', {
    keyPrefix: 'DASHBOARD_SCREEN',
  });
  const {
    stxAddress,
    btcAddress,
    ordinalsAddress,
    selectedAccount,
    showBtcReceiveAlert,
    showOrdinalReceiveAlert,
    showDataCollectionAlert,
    network,
    hideStx,
    spamToken,
    notificationBanners,
  } = useWalletSelector();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openReceiveModal, setOpenReceiveModal] = useState(false);
  const [openSendModal, setOpenSendModal] = useState(false);
  const [openBuyModal, setOpenBuyModal] = useState(false);
  const [isBtcReceiveAlertVisible, setIsBtcReceiveAlertVisible] = useState(false);
  const [isOrdinalReceiveAlertVisible, setIsOrdinalReceiveAlertVisible] = useState(false);
  const [areReceivingAddressesVisible, setAreReceivingAddressesVisible] = useState(
    !isLedgerAccount(selectedAccount),
  );
  const [choseToVerifyAddresses, setChoseToVerifyAddresses] = useState(false);
  const { isInitialLoading: loadingStxWalletData, isRefetching: refetchingStxWalletData } =
    useStxWalletData();
  const { isLoading: loadingBtcWalletData, isRefetching: refetchingBtcWalletData } =
    useBtcWalletData();
  const { data: notificationBannersArr } = useNotificationBanners();
  const {
    unfilteredData: fullSip10CoinsList,
    visible: sip10CoinsList,
    isLoading: loadingStxCoinData,
    isRefetching: refetchingStxCoinData,
  } = useVisibleSip10FungibleTokens();
  const {
    unfilteredData: fullBrc20CoinsList,
    visible: brc20CoinsList,
    isLoading: loadingBtcCoinData,
    isRefetching: refetchingBtcCoinData,
  } = useVisibleBrc20FungibleTokens();
  const {
    unfilteredData: fullRunesCoinsList,
    visible: runesCoinsList,
    isLoading: loadingRunesData,
    isRefetching: refetchingRunesData,
  } = useVisibleRuneFungibleTokens();
  const { getSanityCheck } = useSanityCheck();

  useFeeMultipliers();
  useAppConfig();
  useTrackMixPanelPageViewed();
  const { removeFromSpamTokens } = useSpamTokens();

  useEffect(
    () => () => {
      toast.dismiss();
    },
    [],
  );

  useEffect(() => {
    if (spamToken) {
      const toastId = toast.custom(
        <SnackBar
          text={t('TOKEN_HIDDEN')}
          type="neutral"
          actionButtonText={t('UNDO')}
          actionButtonCallback={() => {
            toast.remove(toastId);

            // set the visibility back to true
            const payload = {
              principal: spamToken.principal,
              isEnabled: true,
            };

            if (fullRunesCoinsList?.find((ft) => ft.principal === spamToken.principal)) {
              dispatch(setRunesManageTokensAction(payload));
            } else if (fullSip10CoinsList?.find((ft) => ft.principal === spamToken.principal)) {
              dispatch(setSip10ManageTokensAction(payload));
            } else if (fullBrc20CoinsList?.find((ft) => ft.principal === spamToken.principal)) {
              dispatch(setBrc20ManageTokensAction(payload));
            }

            removeFromSpamTokens(spamToken.principal);
            dispatch(setSpamTokenAction(null));
          }}
        />,
      );
      dispatch(setSpamTokenAction(null));
    }
  }, [spamToken]);

  useEffect(() => {
    (async () => {
      await getSanityCheck('X-Current-Version');
    })();
  }, [getSanityCheck]);

  const showNotificationBanner =
    notificationBannersArr?.length &&
    notificationBannersArr.length > 0 &&
    !notificationBanners[notificationBannersArr[0].id];

  const onReceiveModalOpen = () => {
    setOpenReceiveModal(true);
  };

  const onReceiveModalClose = () => {
    setOpenReceiveModal(false);

    if (isLedgerAccount(selectedAccount)) {
      setAreReceivingAddressesVisible(false);
      setChoseToVerifyAddresses(false);
    }
  };

  const onSendModalOpen = () => {
    setOpenSendModal(true);
  };

  const onSendModalClose = () => {
    setOpenSendModal(false);
  };

  const onBuyModalOpen = () => {
    setOpenBuyModal(true);
  };

  const onBuyModalClose = () => {
    setOpenBuyModal(false);
  };

  const sendSheetCoinsList = (stxAddress ? sip10CoinsList : [])
    .concat(brc20CoinsList)
    .concat(runesCoinsList)
    .filter((ft) => new BigNumber(ft.balance).gt(0));

  const handleManageTokenListOnClick = () => {
    navigate('/manage-tokens');
  };

  const onStxSendClick = async () => {
    if (isLedgerAccount(selectedAccount) && !isInOptions()) {
      await chrome.tabs.create({
        url: chrome.runtime.getURL('options.html#/send-stx'),
      });
      return;
    }
    navigate('/send-stx');
  };

  const onBtcSendClick = async () => {
    if (isLedgerAccount(selectedAccount) && !isInOptions()) {
      await chrome.tabs.create({
        url: chrome.runtime.getURL('options.html#/send-btc'),
      });
      return;
    }
    navigate('/send-btc');
  };

  const onBTCReceiveSelect = () => {
    navigate('/receive/BTC');
  };

  const onSTXReceiveSelect = () => {
    navigate('/receive/STX');
  };

  const onSendFtSelect = async (fungibleToken: FungibleToken) => {
    if (fungibleToken.protocol === 'brc-20') {
      if (isLedgerAccount(selectedAccount) && !isInOptions()) {
        await chrome.tabs.create({
          url: chrome.runtime.getURL(
            `options.html#/send-brc20-one-step?coinName=${fungibleToken.ticker}`,
          ),
        });
        return;
      }
      navigate('/send-brc20-one-step', {
        state: {
          fungibleToken,
        },
      });
      return;
    }
    if (fungibleToken.protocol === 'stacks') {
      if (isLedgerAccount(selectedAccount) && !isInOptions()) {
        await chrome.tabs.create({
          // TODO - check why use coin ticker when its kinda risky? shouldnt fungibalToken.principal be the main identifier?
          url: chrome.runtime.getURL(`options.html#/send-sip10?coinTicker=${fungibleToken.ticker}`),
        });
        return;
      }
      navigate('/send-sip10', {
        state: {
          fungibleToken,
        },
      });
    }
    if (fungibleToken.protocol === 'runes') {
      if (isLedgerAccount(selectedAccount) && !isInOptions()) {
        await chrome.tabs.create({
          url: chrome.runtime.getURL(`options.html#/send-rune?coinTicker=${fungibleToken.name}`),
        });
        return;
      }
      navigate('/send-rune', {
        state: {
          fungibleToken,
        },
      });
    }
  };

  const onBuyStxClick = () => {
    navigate('/buy/STX');
  };

  const onBuyBtcClick = () => {
    navigate('/buy/BTC');
  };

  const onOrdinalReceiveAlertOpen = () => {
    if (showOrdinalReceiveAlert) setIsOrdinalReceiveAlertVisible(true);
  };

  const onOrdinalReceiveAlertClose = () => {
    setIsOrdinalReceiveAlertVisible(false);
  };

  const onReceiveAlertClose = () => {
    setIsBtcReceiveAlertVisible(false);
  };

  const onReceiveAlertOpen = () => {
    if (showBtcReceiveAlert) setIsBtcReceiveAlertVisible(true);
  };

  const handleTokenPressed = (currency: CurrencyTypes, ftKey?: string) => {
    if (ftKey) {
      navigate(`/coinDashboard/${currency}?ftKey=${ftKey}`);
    } else {
      navigate(`/coinDashboard/${currency}`);
    }
  };

  const onOrdinalsReceivePress = () => {
    navigate('/receive/ORD');
  };

  const onSwapPressed = () => {
    navigate('/swap');
  };

  const receiveContent = (
    <ReceiveContainer>
      <ReceiveCardComponent
        title={t('BITCOIN')}
        address={btcAddress}
        onQrAddressClick={onBTCReceiveSelect}
        onCopyAddressClick={onReceiveAlertOpen}
        showVerifyButton={choseToVerifyAddresses}
        currency="BTC"
      >
        <Icon src={BitcoinToken} />
      </ReceiveCardComponent>

      <ReceiveCardComponent
        title={t('ORDINALS_AND_BRC20')}
        address={ordinalsAddress}
        onQrAddressClick={onOrdinalsReceivePress}
        onCopyAddressClick={onOrdinalReceiveAlertOpen}
        showVerifyButton={choseToVerifyAddresses}
        currency="ORD"
      >
        <MergedOrdinalsIcon src={ordinalsIcon} />
      </ReceiveCardComponent>

      {stxAddress && (
        <ReceiveCardComponent
          title={t('STACKS_AND_TOKEN')}
          address={stxAddress}
          onQrAddressClick={onSTXReceiveSelect}
          showVerifyButton={choseToVerifyAddresses}
          currency="STX"
        >
          <MergedIcon>
            <StacksIcon src={stacksIcon} />
            <IconBackground>
              <Plus weight="bold" size={12} />
            </IconBackground>
          </MergedIcon>
        </ReceiveCardComponent>
      )}

      {isLedgerAccount(selectedAccount) && !stxAddress && (
        <Button
          variant="secondary"
          icon={<Plus color="white" size={16} />}
          title={t('ADD_STACKS_ADDRESS')}
          onClick={async () => {
            if (!isInOptions()) {
              await chrome.tabs.create({
                url: chrome.runtime.getURL(`options.html#/add-stx-address-ledger`),
              });
            } else {
              navigate('/add-stx-address-ledger');
            }
          }}
        />
      )}
    </ReceiveContainer>
  );

  const verifyOrViewAddresses = (
    <VerifyOrViewContainer>
      <VerifyButtonContainer>
        <Button
          title={t('VERIFY_ADDRESSES_ON_LEDGER')}
          onClick={() => {
            setChoseToVerifyAddresses(true);
            setAreReceivingAddressesVisible(true);
          }}
        />
      </VerifyButtonContainer>
      <Button
        variant="secondary"
        title={t('VIEW_ADDRESSES')}
        onClick={() => {
          if (choseToVerifyAddresses) {
            setChoseToVerifyAddresses(false);
          }
          setAreReceivingAddressesVisible(true);
        }}
      />
    </VerifyOrViewContainer>
  );

  const handleDataCollectionDeny = () => {
    optOutMixPanel();
    dispatch(changeShowDataCollectionAlertAction(false));
  };

  const handleDataCollectionAllow = () => {
    optInMixPanel(selectedAccount?.masterPubKey);
    dispatch(changeShowDataCollectionAlertAction(false));
  };

  const showSwaps = !isLedgerAccount(selectedAccount) && network.type !== 'Testnet';
  const showRunes = useHasFeature('RUNES_SUPPORT');

  return (
    <>
      <AccountHeaderComponent />
      {isBtcReceiveAlertVisible && (
        <ShowBtcReceiveAlert onReceiveAlertClose={onReceiveAlertClose} />
      )}
      {isOrdinalReceiveAlertVisible && (
        <ShowOrdinalReceiveAlert onOrdinalReceiveAlertClose={onOrdinalReceiveAlertClose} />
      )}
      <Container>
        <BalanceCard
          isLoading={loadingStxWalletData || loadingBtcWalletData}
          isRefetching={
            refetchingBtcCoinData ||
            refetchingBtcWalletData ||
            refetchingStxCoinData ||
            refetchingStxWalletData ||
            refetchingRunesData
          }
        />
        <RowButtonContainer data-testid="transaction-buttons-row">
          <SquareButton
            icon={<ArrowUp weight="regular" size="20" />}
            text={t('SEND')}
            onPress={onSendModalOpen}
          />
          <SquareButton
            icon={<ArrowDown weight="regular" size="20" />}
            text={t('RECEIVE')}
            onPress={onReceiveModalOpen}
          />
          {showSwaps && <SquareButton src={ArrowSwap} text={t('SWAP')} onPress={onSwapPressed} />}
          <SquareButton
            icon={<Plus weight="regular" size="20" />}
            text={t('BUY')}
            onPress={onBuyModalOpen}
          />
        </RowButtonContainer>

        {showNotificationBanner && (
          <>
            <br />
            <StyledDivider color="white_850" verticalMargin="m" />
            <Banner {...notificationBannersArr[0]} />
            <StyledDivider color="white_850" verticalMargin="xxs" />
          </>
        )}

        <ColumnContainer>
          {btcAddress && (
            <StyledTokenTile
              title={t('BITCOIN')}
              currency="BTC"
              loading={loadingBtcWalletData}
              onPress={handleTokenPressed}
            />
          )}
          {stxAddress && !hideStx && (
            <StyledTokenTile
              title={t('STACKS')}
              currency="STX"
              loading={loadingStxWalletData}
              onPress={handleTokenPressed}
            />
          )}
          {!!stxAddress &&
            sip10CoinsList.map((coin) => (
              <StyledTokenTile
                key={coin.name}
                title={coin.name}
                currency="FT"
                loading={loadingStxCoinData}
                fungibleToken={coin}
                onPress={handleTokenPressed}
              />
            ))}
          {brc20CoinsList.map((coin) => (
            <StyledTokenTile
              key={coin.name}
              title={coin.name}
              currency="FT"
              loading={loadingBtcCoinData}
              fungibleToken={coin}
              onPress={handleTokenPressed}
            />
          ))}
          {showRunes &&
            runesCoinsList.map((coin) => (
              <StyledTokenTile
                key={coin.name}
                title={coin.name}
                currency="FT"
                loading={loadingRunesData}
                fungibleToken={coin}
                onPress={handleTokenPressed}
              />
            ))}
        </ColumnContainer>
        <Sheet visible={openReceiveModal} title={t('RECEIVE')} onClose={onReceiveModalClose}>
          {areReceivingAddressesVisible ? receiveContent : verifyOrViewAddresses}
        </Sheet>

        <TokenListButtonContainer>
          <TokenListButton onClick={handleManageTokenListOnClick}>
            <>
              <ButtonImage src={ListDashes} />
              <ButtonText>{t('MANAGE_TOKEN')}</ButtonText>
            </>
          </TokenListButton>
        </TokenListButtonContainer>

        <CoinSelectModal
          onSelectBitcoin={onBtcSendClick}
          onSelectStacks={onStxSendClick}
          onClose={onSendModalClose}
          onSelectCoin={onSendFtSelect}
          visible={openSendModal}
          coins={sendSheetCoinsList}
          title={t('SEND')}
          loadingWalletData={loadingStxWalletData || loadingBtcWalletData}
        />
        <CoinSelectModal
          onSelectBitcoin={onBuyBtcClick}
          onSelectStacks={onBuyStxClick}
          onClose={onBuyModalClose}
          onSelectCoin={onBuyModalClose}
          visible={openBuyModal}
          coins={[]}
          title={t('BUY')}
          loadingWalletData={loadingStxWalletData || loadingBtcWalletData}
        />
      </Container>
      <BottomBar tab="dashboard" />

      <BottomModal
        visible={!!showDataCollectionAlert}
        header=""
        onClose={handleDataCollectionDeny}
        overlayStylesOverriding={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        contentStylesOverriding={{
          width: 'auto',
          bottom: 'initial',
          borderRadius: theme.radius(3),
          margin: `0 ${theme.spacing(8)}px`,
        }}
      >
        <ModalContent>
          <ModalIcon src={dashboardIcon} alt="analytics" />
          <ModalTitle>{t('DATA_COLLECTION_POPUP.TITLE')}</ModalTitle>
          <ModalDescription>{t('DATA_COLLECTION_POPUP.DESCRIPTION')}</ModalDescription>
          <ModalControlsContainer>
            <ModalButtonContainer>
              <Button
                variant="secondary"
                title={t('DATA_COLLECTION_POPUP.DENY')}
                onClick={handleDataCollectionDeny}
              />
            </ModalButtonContainer>
            <ModalButtonContainer>
              <Button
                title={t('DATA_COLLECTION_POPUP.ALLOW')}
                onClick={handleDataCollectionAllow}
              />
            </ModalButtonContainer>
          </ModalControlsContainer>
        </ModalContent>
      </BottomModal>
    </>
  );
}

export default Home;
