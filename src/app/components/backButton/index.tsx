import styled, { CSSProperties } from 'styled-components';

const Button = styled.button<{ style?: CSSProperties }>((props) => ({
  borderRadius: '8px',
  display: 'inline-flex',
  padding: '11px 16px',
  justifyContent: 'center',
  color: 'white',
  fontFamily: 'MontRegular',
  alignItems: 'center',
  background: 'rgba(168, 185, 244, 0.10)',
  ...props.style,
}));

interface Props {
  style?: CSSProperties;
  handleClick: () => void;
}
function BackButton({ handleClick, style }: Props) {
  return (
    <Button type="button" onClick={handleClick} style={style}>
      Back
    </Button>
  );
}
export default BackButton;
