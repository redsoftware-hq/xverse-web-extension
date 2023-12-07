import styled from 'styled-components';

const ChatResponse = styled.div((props) => ({
  ...props.theme.body_m,
  display: 'inline-flex',
  padding: '7px 12px',
  justifyContent: 'flex-start',
  alignItems: 'center',
  background: 'rgba(98, 106, 130, 0.20)',
  borderRadius: 16,
  color: props.theme.colors.secondaryText,
  width: '75%',
  gap: '10px',
  alignSelf: 'flex-start',
}));
const ChatContainer = styled.div({
  flex: 1,
  display: 'flex',
  marginTop: 35,
  flexDirection: 'column',
  gap: 14,
  padding: 20,
  overflow: 'auto',
});
const ChatInput = styled.div((props) => ({
  ...props.theme.body_m,
  display: 'flex',
  padding: '7px 12px',
  justifyContent: 'flex-end',
  alignItems: 'center',
  width: 'fit-content',
  maxHeight: 32,
  borderRadius: 16,
  background: 'rgba(210, 52, 3, 0.20)',
  color: props.theme.colors.action.classic,
  alignSelf: 'flex-end',
  gap: 10,
}));
export default function ChatBox() {
  return (
    <ChatContainer>
      <ChatInput>What’s an NFT</ChatInput>
      <ChatResponse>
        NFT stands for Non-Fungible Token, which is a unique digital asset verified using blockchain
        technology. Unlike cryptocurrencies such as Bitcoin or Ethereum, NFTs are indivisible and
        represent ownership of specific items, often digital art, music, videos, or other digital
        content. Each NFT has a distinct value and cannot be exchanged on a one-to-one basis with
        other tokens, making them one-of-a-kind and irreplaceable.
      </ChatResponse>
    </ChatContainer>
  );
}
