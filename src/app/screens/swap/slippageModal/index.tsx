import ActionButton from '@components/button';
import TopRow from '@components/topRow';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  row-gap: 16px;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
`;
const ResetButton = styled.button((props) => ({
  display: 'inline',
  background: 'rgba(98, 106, 130, 0.20)',
  padding: '6px 12px',
  borderRadius: '15px',
  justifyContent: 'center',
  alignItems: 'center',
  color: props.theme.colors.secondaryText,
  ...props.theme.body_medium_m,
  ':hover': {
    opacity: 0.8,
  },
  marginRight: 'auto',
}));

const Title = styled.div((props) => ({
  ...props.theme.body_medium_xl,
  color: props.theme.colors.white_0,
}));

const Input = styled.input<{ error: boolean }>((props) => ({
  ...props.theme.body_medium_xl,
  height: 48,
  background: props.theme.colors.background.orangePillBg,
  borderStyle: 'solid',
  borderWidth: 1,
  borderRadius: 8,
  color: props.theme.colors.white_0,
  padding: '14px 16px',
  outline: 'none',
  borderColor: props.error
    ? props.theme.colors.feedback.error_700
    : ' 1px solid rgba(168, 185, 244, 0.15)',
  ':focus-within': {
    border: '1px solid',
    'border-color': props.error
      ? props.theme.colors.feedback.error_700
      : props.theme.colors.elevation6,
  },
}));

const InputFeedback = styled.span((props) => ({
  ...props.theme.body_xs,
  color: props.theme.colors.feedback.error,
}));

const InputRow = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: props.theme.spacing(4),
}));

const Description = styled.p((props) => ({
  ...props.theme.body_medium_xl,
  color: props.theme.colors.white_0,
  padding: '0px 16px',
}));
const Top = styled.div((props) => ({
  marginTop: props.theme.spacing(10),
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  marginBottom: 8,
}));
const Bottom = styled.div((props) => ({
  flex: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: props.theme.spacing(10),
  marginRight: props.theme.spacing(10),
  marginBottom: props.theme.spacing(20),
}));
const Layout = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

const DEFAULT_SLIPPAGE = '4%';

export function SlippageModalContent({
  slippage,
  onChange,
  handleBack,
  title,
}: {
  slippage: number;
  onChange: (slippage: number) => void;
  handleBack: () => void;
  title: string;
}) {
  const { t } = useTranslation('translation', { keyPrefix: 'SWAP_SCREEN' });
  const [percentage, setPercentage] = useState(`${(slippage * 100).toString()}%`);
  const result = Number(percentage.replace('%', ''));
  const invalid = Number.isNaN(result) || result >= 100 || result <= 0;

  const handleClickResetSlippage = () => setPercentage(DEFAULT_SLIPPAGE);

  return (
    <Layout>
      <Top>
        <TopRow title={title} onClick={handleBack} />
        <Description>{t('SLIPPAGE_DESC')}</Description>
      </Top>
      <Container>
        <TitleRow>
          <Title>{t('SLIPPAGE')}</Title>
        </TitleRow>
        <InputRow>
          <Input
            error={invalid}
            placeholder={DEFAULT_SLIPPAGE}
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            onFocus={(e) => {
              const current = e.target.value.replace('%', '');
              e.target.setSelectionRange(0, current.length);
            }}
          />
          {invalid && <InputFeedback>{t('ERRORS.SLIPPAGE_TOLERANCE_CANNOT_EXCEED')}</InputFeedback>}
        </InputRow>
        <ResetButton onClick={handleClickResetSlippage}>{t('RESET_TO_DEFAULT')}</ResetButton>
      </Container>
      <Bottom>
        <ActionButton
          disabled={invalid}
          warning={invalid}
          text={t('APPLY')}
          onPress={() => onChange(result / 100)}
        />
      </Bottom>
    </Layout>
  );
}
export default SlippageModalContent;
