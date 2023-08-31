import ArrowLeft from '@assets/img/dashboard/arrow_left.svg';
import BackButton from '@components/backButton';

const TopSectionContainer = styled.div((props) => ({
  display: 'flex',
  minHeight: 18,
  marginTop: props.theme.spacing(12),
  marginBottom: props.theme.spacing(9),
  marginLeft: props.theme.spacing(8),
  flexDirection: 'column',
  justifyContent: 'center',
  gap:'10px',
  alignItems: 'flex-start',
  position: 'relative',
}));

const HeaderText = styled.h1((props) => ({
  fontFamily: 'MontBold',
  fontSize: '32px',
  color: props.theme.colors.action.classic,
  textAlign: 'center',
  paddingRight: props.theme.spacing(10),
}));


interface Props {
  title: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  showBackButton?: boolean;
  className?: string;
}

function TopRow({ title, onClick, showBackButton = true, className }: Props) {
  return (
    <TopSectionContainer>
      <BackButton handleClick={onClick}/>
      <HeaderText>{title}</HeaderText>
    </TopSectionContainer>
  );
}

export default TopRow;
