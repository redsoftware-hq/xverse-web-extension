import styled, { CSSProperties } from 'styled-components';

const ParagraphDisplay = styled.p((props) => ({
  ...props.theme.body_l,
  fontFamily: 'MontRegular',
  color: props.theme.colors.white['200'],
  textAlign: 'left',
  marginTop: props.theme.spacing(8),
  marginBottom: props.theme.spacing(8),
  paddingLeft: props.theme.spacing(6),
  paddingRight: props.theme.spacing(6),
}));

function Paragraph({ content, style }: { content: string; style?: CSSProperties }) {
  return <ParagraphDisplay style={style}>{content}</ParagraphDisplay>;
}

export default Paragraph;