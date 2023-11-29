import Logo from '@assets/img/pill.png';
import styled, { CSSProperties } from 'styled-components';

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
const PillStatus = styled.div<{ isAccount: boolean }>((props) => ({
  ...props.theme.body_m,
  borderRadius: '15px',
  border: `1px solid ${props.isAccount ? '#42BF23' : props.theme.colors.caution_pill}`,
  background: props.isAccount ? 'rgba(66, 191, 35, 0.20)' : props.theme.colors.caution_bg,
  color: props.isAccount ? '#42BF23' : props.theme.colors.caution_pill,
  padding: '1px 14px 1px 14px',
  textAlign: 'center',
}));
export default function LogoStatusHeader({
  status,
  style,
}: {
  status: string;
  style?: CSSProperties;
}) {
  return (
    <LogoContainer style={style}>
      <Pill src={Logo} alt="orange-pill-logo" />
      <PillStatus isAccount={status.includes('Account')}>{status}</PillStatus>
    </LogoContainer>
  );
}
