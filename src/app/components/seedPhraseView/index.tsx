// import Eye from '@assets/img/createPassword/Eye.svg';
import { useMemo } from 'react';
import styled from 'styled-components';
import SeedPhraseWord from './word';

interface SeedPhraseViewProps {
  seedPhrase: string;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}
interface SeedContainerProps {
  isVisible: boolean;
}

const Container = styled.div((props) => ({
  position: 'relative',
  paddingBottom: props.theme.spacing(20),
}));

const SeedContainer = styled.div<SeedContainerProps>((props) => ({
  display: 'grid',
  gridTemplateColumns: ' 100px 100px 100px',
  textAlign: 'center',
  margin: 0,
  columnGap: props.theme.spacing(3),
  paddingBottom: props.theme.spacing(17),
  paddingLeft: props.theme.spacing(5),
  filter: `blur(${props.isVisible ? 0 : '3px'})`,
}));

const OuterSeedContainer = styled.div((props) => ({
  backgroundColor: props.theme.colors.background.elevationDarkGradient,
  border: `1px solid ${props.theme.colors.background.elevation3}`,
  borderRadius: props.theme.radius(1),
}));

const ShowSeedButton = styled.button((props) => ({
  ...props.theme.body_xs,
  color: props.theme.colors.action.classic,
  borderRadius: props.theme.radius(4),
  border: `1px solid ${props.theme.colors.action.classic}`,
  backgroundColor: props.theme.colors.background.lightOrange,
  height: 36,
  width: 110,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  img: {
    marginRight: props.theme.spacing(4),
  },
  ':hover': {
    backgroundColor: props.theme.colors.action.classic,
    border: `1px solid ${props.theme.colors.action.classic}`,
    color: props.theme.colors.white[0],
  },
  ':focus': {
    backgroundColor: props.theme.colors.action.classic,
    border: `1px solid ${props.theme.colors.action.classic}`,
    color: props.theme.colors.white[0],
  },
}));

export default function SeedphraseView(props: SeedPhraseViewProps) {
  const { seedPhrase, isVisible, setIsVisible } = props;
  const seedPhraseWords = useMemo(() => seedPhrase?.split(' '), [seedPhrase]);

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Container>
      <OuterSeedContainer>
        <SeedContainer isVisible={isVisible}>
          {seedPhraseWords.map((word, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <SeedPhraseWord key={index} index={index} word={word} />
          ))}
        </SeedContainer>
      </OuterSeedContainer>

      {!isVisible && (
        <ShowSeedButton onClick={handleToggleVisibility}>
          {/* <img src={Eye} alt="show-password" height={16} /> */}
          Show seedphrase
        </ShowSeedButton>
      )}
    </Container>
  );
}
