import CaretRight from '@assets/img/dashboard/caret_right.svg';
import styled from 'styled-components';

const Button = styled.button((props) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 12,
  background: props.theme.colors.background.orangePillBg,
  padding: '16px 24px',
  marginBottom: props.theme.spacing(8),
  maxHeight: 56,
  border: '1px solid rgba(168, 185, 244, 0.15)',
}));

const Text = styled.h1((props) => ({
  ...props.theme.body_medium_xl,
  color: props.theme.colors.white_0,
  textAlign: 'center',
}));

const RowContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flex: 1,
});

interface Props {
  src: string;
  text: string;
  onClick: () => void;
}

function RedirectButton({ src, text, onClick }: Props) {
  return (
    <Button onClick={onClick}>
      <RowContainer>
        <Text>{text}</Text>
      </RowContainer>
    </Button>
  );
}

export default RedirectButton;
