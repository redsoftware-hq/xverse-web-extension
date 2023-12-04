import styled, { CSSProperties } from 'styled-components';

const ParagraphDisplay = styled.p((props) => ({
  textAlign: 'left',
  ...props.theme.body_medium_xl,
  color: props.theme.colors.white_0,
  padding: '0px 16px',
  marginBottom: props.theme.spacing(8),
}));

function Paragraph({ content, style }: { content: string; style?: CSSProperties }) {
  return <ParagraphDisplay style={style}>{content}</ParagraphDisplay>;
}

export default Paragraph;
