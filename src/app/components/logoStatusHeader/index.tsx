import Logo from '@assets/img/pill.png';
import styled from 'styled-components';

const LogoContainer = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: props.theme.spacing(7),
}));
const Pill = styled.img({
  width: 60,
  height: 34,
});
const PillStatus = styled.div((props) => ({
  ...props.theme.body_m,
  borderRadius: '15px',
  border: `1px solid ${props.theme.colors.caution_pill}`,
  background: props.theme.colors.caution_bg,
  color: props.theme.colors.caution_pill,
  padding: '1px 14px 1px 14px',
  textAlign: 'center',
}));
export default function LogoStatusHeader({ status }: { status: string }) {
  return (
    <LogoContainer>
      <Pill src={Logo} alt="orange-pill-logo" />
      <PillStatus>{status}</PillStatus>
    </LogoContainer>
  );
}
