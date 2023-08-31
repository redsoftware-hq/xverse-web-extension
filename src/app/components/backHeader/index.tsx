import styled from 'styled-components';
import BackButton from '@components/backButton';

const Container = styled.div(() => ({
  display: 'flex',
  height: 64,
  alignItems: 'center',
  justifyContent: 'center',
}));

const HeaderContent = styled.div({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: '12px',
});

const HeaderTitle = styled.h1((props) => ({
  fontFamily: 'MontBold',
  fontSize: '32px',
  color: props.theme.colors.action.classic,
  textAlign: 'center',
}));


interface BackHeaderProps {
  headerText: string;
  onPressBack: () => void;
}

function BackHeader(props: BackHeaderProps): JSX.Element {
  const { headerText, onPressBack } = props;
  return (
    <Container>
      <HeaderContent>
        <BackButton handleClick={onPressBack} />
        <HeaderTitle>{headerText}</HeaderTitle>
      </HeaderContent>
    </Container>
  );
}
export default BackHeader;
