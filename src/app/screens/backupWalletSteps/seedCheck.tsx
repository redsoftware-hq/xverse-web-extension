import ActionButton from '@components/button';
import SeedphraseView from '@components/seedPhraseView';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Container = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  paddingLeft: props.theme.spacing(8),
  paddingRight: props.theme.spacing(8),
  marginBottom: props.theme.spacing(20),
  flex: 1,
}));

const Description = styled.p((props) => ({
  ...props.theme.bold_tile_text,
  color: props.theme.colors.white[0],
  marginBottom: props.theme.spacing(10),
}));

const Heading = styled.p((props) => ({
  ...props.theme.mont_tile_text,
  color: props.theme.colors.action.classic,
  marginBottom: props.theme.spacing(4),
  fontSize: 24,
}));

interface SeedCheckPros {
  onContinue: () => void;
  seedPhrase: string;
  showButton?: boolean;
  copy?: boolean;
  setCopy?: (copy: boolean) => void;
  fromSetting: boolean;
}

export default function SeedCheck(props: SeedCheckPros): JSX.Element {
  const { t } = useTranslation('translation', { keyPrefix: 'BACKUP_WALLET_SCREEN' });
  const { onContinue, seedPhrase, showButton = true, copy, setCopy, fromSetting = false } = props;
  const [isVisible, setIsVisible] = useState<boolean>(false);
  return (
    <Container>
      <Heading>{t('SEED_PHRASE_VIEW_LABEL')}</Heading>
      <Description>
        {fromSetting ? t('SEED_PHRASE_DEC_SETTINGS') : t('SEED_PHRASE_VIEW_HEADING')}
      </Description>
      <SeedphraseView
        seedPhrase={seedPhrase}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        copy={copy}
        setCopy={setCopy}
      />
      {showButton && (
        <ActionButton
          disabled={!isVisible}
          onPress={onContinue}
          text={t('SEED_PHRASE_VIEW_CONTINUE')}
        />
      )}
    </Container>
  );
}
