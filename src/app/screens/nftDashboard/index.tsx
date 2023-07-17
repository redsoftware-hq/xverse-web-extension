import styled from 'styled-components';
import { MoonLoader } from 'react-spinners';
import useWalletSelector from '@hooks/useWalletSelector';
import BottomTabBar from '@components/tabBar';
import { useTranslation } from 'react-i18next';
import { StoreState } from '@stores/index';
import SquaresFour from '@assets/img/nftDashboard/squares_four.svg';
import icon from '@assets/img/nftDashboard/NFT_dash.svg';
import Receive from '@assets/img/nftDashboard/buy-crypto.svg';
import ActionButton from '@components/button';
import { useCallback, useEffect, useMemo, useState } from 'react';
import BarLoader from '@components/barLoader';
import { GAMMA_URL, LoaderSize } from '@utils/constants';
import ShareDialog from '@components/shareNft';
import AccountHeaderComponent from '@components/accountHeader';
import Ordinal from '@screens/ordinals';
import { ChangeActivateOrdinalsAction } from '@stores/wallet/actions/actionCreators';
import { useDispatch, useSelector } from 'react-redux';
import { InscriptionsList } from '@secretkeylabs/xverse-core/types';
import AlertMessage from '@components/alertMessage';
import useAddressInscriptions from '@hooks/queries/ordinals/useAddressInscriptions';
import useStacksCollectibles from '@hooks/queries/useStacksCollectibles';
import ShowOrdinalReceiveAlert from '@components/showOrdinalReceiveAlert';
import { NumericFormat } from 'react-number-format';
import Nft from './nft';
import ReceiveNftModal from './receiveNft';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 20px;
  margin-right: 20px;
  padding-bottom: 5%;
  &::-webkit-scrollbar {
    display: none;
  }
`;

interface GridContainerProps {
  isGalleryOpen: boolean;
}

const Dashboard = styled.div((props) => ({
  display: 'flex',
  gap: props.theme.spacing(2),
  flexDirection: 'column',
  borderRadius: props.theme.radius(2),
  background: props.theme.colors.action.classic,
  alignItems: 'space-between',
  justifyContent: 'space-between',
  paddingLeft: props.theme.spacing(12),
  // paddingBottom: props.theme.spacing(8),
  paddingRight: props.theme.spacing(12),
  // marginTop: props.theme.spacing(10),
}));

const GridContainer = styled.div<GridContainerProps>((props) => ({
  display: 'grid',
  background: props.theme.colors.background.darkbg,
  columnGap: props.theme.spacing(8),
  rowGap: props.theme.spacing(6),
  marginTop: props.theme.spacing(14),
  gridTemplateColumns: props.isGalleryOpen
    ? 'repeat(auto-fill,minmax(300px,1fr))'
    : 'repeat(auto-fill,minmax(150px,1fr))',
  gridTemplateRows: props.isGalleryOpen ? 'repeat(minmax(300px,1fr))' : 'minmax(150px,220px)',
}));

const ShareDialogeContainer = styled.div({
  position: 'absolute',
  top: 0,
  right: 0,
  zIndex: 2000,
});

const ReceiveNftContainer = styled.div((props) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  zIndex: 2000,
  background: props.theme.colors.background.elevation2,
  borderRadius: 16,
}));

const CollectibleContainer = styled.div((props) => ({
  marginTop: props.theme.spacing(11),
  marginBottom: props.theme.spacing(8),
}));

const LoaderContainer = styled.div((props) => ({
  display: 'flex',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: props.theme.spacing(12),
}));

const ButtonContainer = styled.div((props) => ({
  display: 'flex',
  position: 'relative',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  maxWidth: 400,
}));

// const ShareButtonContainer = styled.div((props) => ({
//   marginLeft: props.theme.spacing(3),
//   width: '100%',
// }));

const ReceiveButtonContainer = styled.div`
  button {
    border-radius: 8px;
    padding: 8px 20px;
  }
`;

// const WebGalleryButton = styled.button((props) => ({
//   display: 'flex',
//   flexDirection: 'row',
//   justifyContent: 'center',
//   alignItems: 'center',
//   borderRadius: props.theme.radius(1),
//   backgroundColor: 'transparent',
//   width: '100%',
//   marginTop: props.theme.spacing(8),
//   opacity: 0.8,
//   ':hover': {
//     opacity: 1,
//   },
// }));

// const WebGalleryButtonText = styled.div((props) => ({
//   ...props.theme.body_xs,
//   fontWeight: 700,
//   color: props.theme.colors.white['0'],
//   textAlign: 'center',
// }));

// const ButtonImage = styled.img((props) => ({
//   marginRight: props.theme.spacing(3),
//   alignSelf: 'center',
//   transform: 'all',
// }));

const BottomBarContainer = styled.div((props) => ({
  background: props.theme.colors.background.darkbg,
}));

const FiatPill = styled.div((props) => ({
  ...props.theme.headline_category_s,
  color: props.theme.colors.white['0'],
  fontSize: 13,
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: props.theme.colors.background.modalBackdrop,
  width: 45,
  borderRadius: 30,
  marginLeft: props.theme.spacing(4),
}));

const CollectiblesValueTextContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
}));
const CollectibleType = styled.span((props) => ({
  ...props.theme.body_m,
  color: props.theme.colors.dashboard.text,
  fontSize: 20,
  fontWeight: 600,
  fontFamily: 'MontLight',
}));

const CollectiblesHeading = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
}));

const CollectibleRowContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: props.theme.spacing(5),
}));

const CollectiblesHeadingText = styled.h1((props) => ({
  ...props.theme.headline_category_s,
  color: props.theme.colors.dashboard.text,
  fontSize: 18,
  fontWeight: 700,
  fontFamily: 'MontRegular',
}));

const GalleryCollectiblesHeadingText = styled.h1((props) => ({
  ...props.theme.headline_category_m,
  color: props.theme.colors.dashboard.text,
  fontSize: 20,
  fontWeight: 700,
  fontFamily: 'MontRegular',
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
  opacity: 0.7,
}));

const CollectiblesValueText = styled.h1((props) => ({
  ...props.theme.mont_headline_normal,
  lineHeight: '32px',
  color: 'white',
}));

const LoadMoreButtonContainer = styled.div((props) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: props.theme.spacing(30),
}));

const LoadMoreButton = styled.button((props) => ({
  ...props.theme.body_medium_l,
  fontSize: 13,
  width: 98,
  height: 34,
  color: props.theme.colors.white['0'],
  border: `1px solid ${props.theme.colors.background.elevation3}`,
  background: props.theme.colors.background.elevation0,
  borderRadius: 24,
  padding: '8px, 16px, 8px, 16px',
  ':hover': {
    background: props.theme.colors.background.elevation9,
  },
  ':focus': {
    background: props.theme.colors.background.elevation10,
  },
}));

const NoCollectiblesText = styled.h1((props) => ({
  ...props.theme.body_bold_m,
  color: props.theme.colors.white['200'],
  marginTop: 'auto',
  marginBottom: 'auto',
  textAlign: 'center',
}));

const BarLoaderContainer = styled.div((props) => ({
  marginTop: props.theme.spacing(5),
  maxWidth: 300,
  display: 'flex',
}));

const NftListViewContainer = styled.div((props) => ({
  background: props.theme.colors.background.darkbg,
  borderTopLeftRadius: '24px',
  borderTopRightRadius: '24px',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
}));

const BalanceAmountContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent:'space-between',
  alignItems: 'center',
}));

const BalanceAmountText = styled.h1((props) => ({
  ...props.theme.headline_xl,
  color: props.theme.colors.white['0'],
}));


function NftDashboard() {
  const { t } = useTranslation('translation', { keyPrefix: 'NFT_DASHBOARD_SCREEN' });
  const dispatch = useDispatch();
  const { stxAddress, ordinalsAddress, hasActivatedOrdinalsKey } = useWalletSelector();
  const [showShareNftOptions, setShowNftOptions] = useState(false);
  const [openReceiveModal, setOpenReceiveModal] = useState(false);
  const [showActivateOrdinalsAlert, setShowActivateOrdinalsAlert] = useState(false);
  const [isOrdinalReceiveAlertVisible, setIsOrdinalReceiveAlertVisible] = useState(false);
  const { fiatCurrency } = useSelector((state: StoreState) => state.walletState);
  const {
    data: nftsList,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    fetchNextPage,
  } = useStacksCollectibles();
  const {
    data: ordinals,
    error: ordinalsError,
    hasNextPage: hasNextPageOrdinals,
    isFetchingNextPage: isFetchingNextPageOrdinals,
    isLoading: isLoadingOrdinals,
    fetchNextPage: fetchNextOrdinalsPage,
    refetch: refetchOrdinals,
  } = useAddressInscriptions();

  const refetchCollectibles = useCallback(async () => {
    await refetch();
    await refetchOrdinals();
  }, [refetch]);

  useEffect(() => {
    refetchCollectibles();
  }, [stxAddress, ordinalsAddress]);

  const nfts = nftsList?.pages.map((page) => page.nftsList).flat();

  const ordinalsLength = ordinals?.pages[0].total;

  const totalNfts = useMemo(() => {
    let totalCount = nftsList && nftsList.pages.length > 0 ? nftsList.pages[0].total : 0;
    if (hasActivatedOrdinalsKey && ordinalsLength) {
      totalCount = ordinalsLength + totalCount;
    }
    return totalCount;
  }, [ordinals, nftsList]);

  const isGalleryOpen: boolean = useMemo(() => document.documentElement.clientWidth > 360, []);

  useEffect(() => {
    if (hasActivatedOrdinalsKey === undefined && ordinals && ordinalsLength) {
      setShowActivateOrdinalsAlert(true);
    }
  }, [hasActivatedOrdinalsKey, ordinalsLength]);

  const onLoadMoreButtonClick = () => {
    if (hasNextPageOrdinals) {
      fetchNextOrdinalsPage();
    }
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  const openInGalleryView = async () => {
    await chrome.tabs.create({
      url: chrome.runtime.getURL('options.html#/nft-dashboard'),
    });
  };

  const onReceiveModalOpen = () => {
    setOpenReceiveModal(true);
  };

  const onReceiveModalClose = () => {
    setOpenReceiveModal(false);
  };

  const renderOrdinalsList = useCallback(
    (list: InscriptionsList) =>
      list.results.map((ordinal) => (
        <Ordinal asset={ordinal} key={ordinal.id} isGalleryOpen={isGalleryOpen} />
      )),
    [],
  );

  const onOrdinalReceiveAlertOpen = () => {
    setIsOrdinalReceiveAlertVisible(true);
  };

  const onOrdinalReceiveAlertClose = () => {
    setIsOrdinalReceiveAlertVisible(false);
  };

  const NftListView = useCallback(
    () =>
      totalNfts === 0 && ordinalsLength === 0 ? (
        <NoCollectiblesText>{t('NO_COLLECTIBLES')}</NoCollectiblesText>
      ) : (
        <>
          <GridContainer isGalleryOpen={isGalleryOpen}>
            {hasActivatedOrdinalsKey && !ordinalsError && ordinals?.pages?.map(renderOrdinalsList)}
            {nfts?.map((nft) => (
              <Nft asset={nft} key={nft.asset_identifier} isGalleryOpen={isGalleryOpen} />
            ))}
          </GridContainer>
          {(hasNextPage || hasNextPageOrdinals) && (
            <LoadMoreButtonContainer>
              {isFetchingNextPage || isFetchingNextPageOrdinals ? (
                <MoonLoader color="white" size={30} />
              ) : (
                <LoadMoreButton onClick={onLoadMoreButtonClick}>{t('LOAD_MORE')}</LoadMoreButton>
              )}
            </LoadMoreButtonContainer>
          )}
        </>
      ),
    [ordinals, nfts],
  );

  const onSharePress = () => {
    setShowNftOptions(true);
  };

  const onCrossPress = () => {
    setShowNftOptions(false);
  };

  const onActivateOrdinalsAlertCrossPress = () => {
    setShowActivateOrdinalsAlert(false);
  };

  const onActivateOrdinalsAlertDenyPress = () => {
    setShowActivateOrdinalsAlert(false);
    dispatch(ChangeActivateOrdinalsAction(false));
  };

  const onActivateOrdinalsAlertActivatePress = () => {
    setShowActivateOrdinalsAlert(false);
    dispatch(ChangeActivateOrdinalsAction(true));
  };

  return (
    <>
      {isOrdinalReceiveAlertVisible && (
        <ShowOrdinalReceiveAlert onOrdinalReceiveAlertClose={onOrdinalReceiveAlertClose} />
      )}
      {showActivateOrdinalsAlert && (
        <AlertMessage
          title={t('ACTIVATE_ORDINALS')}
          description={t('ACTIVATE_ORDINALS_INFO')}
          buttonText={t('DENY')}
          onClose={onActivateOrdinalsAlertCrossPress}
          secondButtonText={t('ACTIVATE')}
          onButtonClick={onActivateOrdinalsAlertDenyPress}
          onSecondButtonClick={onActivateOrdinalsAlertActivatePress}
        />
      )}
      <AccountHeaderComponent />
      <Container>
        <Dashboard>
          <CollectibleContainer>
            {/* {isGalleryOpen ? (
              <GalleryCollectiblesHeadingText>{t('COLLECTIBLES')}</GalleryCollectiblesHeadingText>
            ) : (
              <CollectiblesHeading>
                <CollectiblesHeadingText>{t('VALUE')}</CollectiblesHeadingText>
                <FiatPill>{fiatCurrency}</FiatPill>
              </CollectiblesHeading>
            )} */}
            <CollectiblesHeading>
              <CollectiblesHeadingText>{t('VALUE')}</CollectiblesHeadingText>
              <FiatPill>{fiatCurrency}</FiatPill>
            </CollectiblesHeading>
            {isLoading ? (
              <BarLoaderContainer>
                <BarLoader loaderSize={LoaderSize.LARGE} />
              </BarLoaderContainer>
            ) : (
              <BalanceAmountContainer>
                {icon && <img src={icon} alt="nft-dashboard" />}
                <BalanceAmountText>
                  <NumericFormat
                    value={0}
                    displayType="text"
                    prefix="$"
                    thousandSeparator
                    renderText={(value: string) => <BalanceAmountText>{value}</BalanceAmountText>}
                  />
                </BalanceAmountText>
              </BalanceAmountContainer>
            )}
            <CollectibleRowContainer>
              <CollectiblesValueTextContainer>
                <CollectiblesValueText>{`${totalNfts}`}</CollectiblesValueText>
                <CollectibleType>{t('ITEMS')}</CollectibleType>
              </CollectiblesValueTextContainer>
              <ButtonContainer>
                <ReceiveButtonContainer>
                  <ActionButton
                    inDashboard
                    src={Receive}
                    text={t('RECEIVE')}
                    onPress={onReceiveModalOpen}
                  />
                </ReceiveButtonContainer>
                {openReceiveModal && (
                  <ReceiveNftContainer>
                    <ReceiveNftModal
                      visible={openReceiveModal}
                      isGalleryOpen={isGalleryOpen}
                      onClose={onReceiveModalClose}
                      setOrdinalReceiveAlert={onOrdinalReceiveAlertOpen}
                    />
                  </ReceiveNftContainer>
                )}
                {/* <ShareButtonContainer>
            <ActionButton src={ShareNetwork} text={t('SHARE')} onPress={onSharePress} transparent />
          </ShareButtonContainer> */}
                <ShareDialogeContainer>
                  {showShareNftOptions && (
                    <ShareDialog url={`${GAMMA_URL}${stxAddress}`} onCrossClick={onCrossPress} />
                  )}
                </ShareDialogeContainer>
              </ButtonContainer>
            </CollectibleRowContainer>
          </CollectibleContainer>
        </Dashboard>
        {/* {!isGalleryOpen && (
          <WebGalleryButton onClick={openInGalleryView}>
            <>
              <ButtonImage src={SquaresFour} />
              <WebGalleryButtonText>{t('WEB_GALLERY')}</WebGalleryButtonText>
            </>
          </WebGalleryButton>
        )} */}
      </Container>
      <NftListViewContainer>
        {isLoading || isLoadingOrdinals ? (
          <LoaderContainer>
            <MoonLoader color="white" size={30} />
          </LoaderContainer>
        ) : (
          <NftListView />
        )}
      </NftListViewContainer>
      <BottomBarContainer>
        <BottomTabBar tab="nft" />
      </BottomBarContainer>
    </>
  );
}

export default NftDashboard;
