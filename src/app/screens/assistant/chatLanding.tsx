import styled from 'styled-components';

const OptionsContainer = styled.div({
  flex: 1,
  display: 'flex',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: 65,
  alignItems: 'center',
  flexDirection: 'column',
  gap: 20,
});
const ChatOption = styled.button((props) => ({
  ...props.theme.body_m,
  display: 'flex',
  padding: '7px 12px',
  justifyContent: 'center',
  alignItems: 'center',
  width: 'fit-content',
  maxHeight: 32,
  borderRadius: 16,
  background: 'rgba(210, 52, 3, 0.20)',
  color: props.theme.colors.action.classic,
  gap: 10,
}));
export default function ChatLanding() {
  const chat = [
    'Are crypto earnings taxable',
    'What’s the current price of ETH',
    'What’s the 24 hr volume for Binance',
    'Tell me my last 5 transactions',
    'What’s an NFT',
    'Help me exchange my Bitcoin',
  ];
  return (
    <OptionsContainer>
      {chat.map((option) => (
        <ChatOption key={option} onClick={() => console.log(option)}>
          {option}
        </ChatOption>
      ))}
    </OptionsContainer>
  );
}
