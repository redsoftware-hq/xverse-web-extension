import styled from 'styled-components';

const Icon = styled.img((props) => ({
  marginRight: props.theme.spacing(8),
  width: 32,
  height: 32,
  borderRadius: 30,
}));

const TitleText = styled.h1<{ selected: boolean }>((props) => ({
  ...props.theme.body_bold_l,
  color: props.selected ? '#E12828' : props.theme.colors.white[0],
}));

const ValueText = styled.h1((props) => ({
  ...props.theme.body_m,
  textAlign: 'left',
  color: props.theme.colors.white_400,
}));

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
});

const RowContainer = styled.button((props) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: 8,
  padding: '16px 24px 16px 24px',
  border: '1px solid rgba(168, 185, 244, 0.15)',
  background:
    'radial-gradient(489.09% 91.61% at 89.79% 22.85%, rgba(56, 60, 78, 0.20) 0%, rgba(13, 14, 18, 0.20) 100%)',
  width: '100%',
  marginBottom: 12,
}));

interface Props {
  image?: string;
  title: string;
  description?: string;
  onClick: () => void;
  selected: boolean;
}

function FundsRow({ image, title, description, onClick, selected }: Props) {
  return (
    <RowContainer onClick={onClick}>
      {/* <Icon src={image} /> */}
      <Container>
        <TitleText selected={selected}>{title}</TitleText>
        {/* <ValueText>{description}</ValueText> */}
      </Container>
    </RowContainer>
  );
}

export default FundsRow;
