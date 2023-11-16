import styled from 'styled-components';

const Button = styled.button((props) => ({
  borderRadius: '8px',
  display: 'inline-flex',
  padding: '11px 16px',
  justifyContent: 'center',
  color:'white',
  fontFamily:'MontRegular',
  alignItems: 'center',
  background: 'rgba(168, 185, 244, 0.10)',
}));

interface Props {
  handleClick: () => void;
}
function BackButton({ handleClick }: Props) {
  return (
    <Button type="button" onClick={handleClick}>
      Back
    </Button>
  );
}
export default BackButton;