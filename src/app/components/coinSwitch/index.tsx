import Modal from 'react-modal';
import styled from 'styled-components';

const CustomisedModal = styled(Modal)`
  /* overflow-y: auto; */
  &::-webkit-scrollbar {
    display: none;
  }
  position: absolute;
`;
const Container = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  maxWidth: 230,
  margin: '24px 24px 20px 24px',
  background: props.theme.colors.background.orangePillBg,
  backdropFilter: props.theme.backdrop.hover,
  borderRadius: '8px',
  border: '1px solid rgba(168, 185, 244, 0.15)',
}));
const Option = styled.div((props) => ({
  ...props.theme.body_m,
  textWrap: 'nowrap',
  borderRadius: '1px',
  borderBottom: '1px solid rgba(168, 185, 244, 0.15)',
  padding: '12px 90px 11px 12px',
}));
interface Props {
  visible: boolean;
  onClose: () => void;
  overlayStylesOverriding?: {};
  contentStylesOverriding?: {};
  contents: { name: string; handler?: () => void; key: string }[];
}
export default function CoinSwitch({
  visible,
  onClose,
  overlayStylesOverriding,
  contentStylesOverriding,
  contents,
}: Props) {
  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.80)',
      height: '100%',
      width: 360,
      margin: 'auto',
      zIndex: 15000,
      ...overlayStylesOverriding,
    },
    content: {
      inset: '240px 0px 0px 90px',
      width: '100%',
      maxWidth: 360,
      maxHeight: '90%',
      border: 'transparent',
      background: 'transparent',
      margin: 0,
      padding: 0,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      borderBottomRightRadius: 12,
      borderBottomLeftRadius: 12,
      ...contentStylesOverriding,
    },
  };
  return (
    <CustomisedModal
      isOpen={visible}
      parentSelector={() => document.getElementById('app') as HTMLElement}
      ariaHideApp={false}
      style={customStyles}
      onRequestClose={onClose}
      contentLabel="Send & Swap Navigation"
    >
      {contents && (
        <Container>
          {contents.map((content) => (
            <Option key={content.key} onClick={content.handler}>
              {content.name}
            </Option>
          ))}
        </Container>
      )}
    </CustomisedModal>
  );
}
