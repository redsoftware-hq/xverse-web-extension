/* eslint-disable no-inline-styles/no-inline-styles */
import AssistantIconSrc from '@assets/img/assistant/icon.png';
import Send from '@assets/img/assistant/send_assistant.svg';
import Speech from '@assets/img/assistant/speech_assistant.svg';
import BackButton from '@components/backButton';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ChatBox from './chatBox';
import ChatLanding from './chatLanding';

const Top = styled.div((props) => ({
  marginTop: props.theme.spacing(10),
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  paddingLeft: 20,
  paddingRight: 20,
  marginBottom: 8,
}));
const Layout = styled.div((props) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
}));
const Bottom = styled.div((props) => ({
  flex: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: props.theme.spacing(10),
  marginRight: props.theme.spacing(10),
  marginBottom: props.theme.spacing(10),
}));
const AssistantHeader = styled.div(() => ({
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 20,
  display: 'flex',
}));
const AssistantIcon = styled.img({
  justifySelf: 'center',
  width: 48,
  height: 48,
});
const Spacer = styled.div({
  width: '20%',
});

const ChatInput = styled.input((props) => ({
  ...props.theme.body_m,
  flex: 1,
  width: '90  %',
  fontSize: 15,
  background: 'rgba(31, 35, 45, 0.0)',
  border: 'none',
  gap: 16,
  color: props.theme.colors.white_0,
  '::placeholder': {
    color: props.theme.colors.secondaryText,
  },
  caretColor: props.theme.colors.action.classic,
}));
const ChatInputContainer = styled.div((props) => ({
  display: 'flex',
  alignItems: 'center',
  maxHeight: 54,
  gap: 8,
  background: 'rgba(31, 35, 45, 0.40)',
  width: '100%',
  borderRadius: 16,
  padding: 16,
  transition: 'border-color 0.3s,  box-shadow 0.3s',
  ':focus-within': {
    border: `0.5px solid ${props.theme.colors.action.classic}`,
    boxShadow: ' 0px 0px 40px 3px rgba(210, 52, 3, 0.30)',
  },
}));
const IconButton = styled.button((props) => ({
  background: 'rgba(0, 0, 0, 0.60)',
  display: 'inline-flex',
  padding: 7,
  flexDirection: 'column',
  alignItems: 'flex-start',
  borderRadius: 16,
  gap: 10,
}));
const IconButtonContainer = styled.button((props) => ({
  display: 'inline-flex',
  background: 'transparent',
  gap: 8,
}));

export default function Assistant() {
  const navigate = useNavigate();
  const [chatInput, setChatInput] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);

  return (
    <Layout>
      <Top>
        <AssistantHeader>
          <BackButton
            handleClick={() => navigate(-1)}
            style={{
              display: 'flex',
              height: '40px',
              padding: '11px 16px',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
          <AssistantIcon src={AssistantIconSrc} />
          <Spacer />
        </AssistantHeader>
      </Top>
      {isSent ? <ChatBox /> : <ChatLanding />}
      <Bottom>
        <ChatInputContainer>
          <ChatInput
            placeholder="Message here..."
            onChange={(e) => {
              setChatInput(e.target.value);
            }}
          />
          <IconButtonContainer>
            <IconButton>
              <img src={Speech} alt="speech" />
            </IconButton>
            <IconButton onClick={() => setIsSent(true)}>
              <img src={Send} alt="Send" />
            </IconButton>
          </IconButtonContainer>
        </ChatInputContainer>
      </Bottom>
    </Layout>
  );
}
