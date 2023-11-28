/* eslint-disable @typescript-eslint/no-unused-expressions */
// import Eye from '@assets/img/createPassword/Eye.svg';
import { useMemo } from 'react';
import styled from 'styled-components';
import SeedPhraseWord from './word';

interface SeedPhraseViewProps {
  seedPhrase: string;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  copy?: boolean;
  setCopy?: (copy: boolean) => void;
}
interface SeedContainerProps {
  isVisible: boolean;
}

const Container = styled.div((props) => ({
  position: 'relative',
  paddingBottom: props.theme.spacing(45),
}));

const SeedContainer = styled.div<SeedContainerProps>((props) => ({
  display: 'grid',
  gridTemplateColumns: ' 100px 100px 100px',
  textAlign: 'center',
  margin: 0,
  columnGap: props.theme.spacing(3),
  paddingBottom: props.theme.spacing(12),
  paddingLeft: props.theme.spacing(2),
  paddingRight: props.theme.spacing(4),
  filter: `blur(${props.isVisible ? 0 : '3px'})`,
  userSelect: 'none',
}));

const OuterSeedContainer = styled.div((props) => ({
  backgroundColor: props.theme.colors.background.elevationDarkGradient,
  border: `1px solid ${props.theme.colors.background.elevation3}`,
  borderRadius: props.theme.radius(1),
}));

const ShowSeedButton = styled.button<{ position: 'mid' | 'bottom'; disabled?: boolean }>(
  (props) => ({
    ...props.theme.body_medium_m,
    color: props.theme.colors.action.classic,
    borderRadius: props.theme.radius(4),
    // border: `1px solid ${props.theme.colors.action.classic}`,
    backgroundColor: props.theme.colors.background.lightOrange,
    height: 30,
    width: 150,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: props.position === 'mid' ? '30%' : '80%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    img: {
      marginRight: props.theme.spacing(4),
    },
    ':hover': {
      backgroundColor: !props.disabled
        ? props.theme.colors.action.classic
        : props.theme.colors.background.lightOrange,
      border: `1px solid ${
        !props.disabled ? props.theme.colors.action.classic : props.theme.colors.action.classic
      }`,
      color: !props.disabled ? props.theme.colors.white[0] : props.theme.colors.action.classic,
    },
    ':focus': {
      backgroundColor: !props.disabled
        ? props.theme.colors.action.classic
        : props.theme.colors.background.lightOrange,
      border: `1px solid ${
        !props.disabled ? props.theme.colors.action.classic : props.theme.colors.action.classic
      }`,
      color: !props.disabled ? props.theme.colors.white[0] : props.theme.colors.action.classic,
    },
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  }),
);

export default function SeedphraseView(props: SeedPhraseViewProps) {
  const { seedPhrase, isVisible, setIsVisible, copy, setCopy } = props;
  const seedPhraseWords = useMemo(() => seedPhrase?.split(' '), [seedPhrase]);

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(seedPhrase);
    setCopy && setCopy(true);
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
      {setCopy && (
        <ShowSeedButton onClick={handleCopy} position="bottom" disabled={!isVisible}>
          {copy ? 'Copied' : 'Copy Seedphrase'}
        </ShowSeedButton>
      )}

      {!isVisible && (
        <ShowSeedButton onClick={handleToggleVisibility} position="mid">
          {/* <img src={Eye} alt="show-password" height={16} /> */}
          Show Seedphrase
        </ShowSeedButton>
      )}
    </Container>
  );
}
