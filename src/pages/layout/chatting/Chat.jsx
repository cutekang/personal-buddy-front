import { useContext, useEffect, useRef } from 'react';
import S from './style';
import { ChatContext } from '../../../context/ChatContext';
import { HeaderContext } from '../../../context/HeaderContext';
import DisplayDate from '../../../utils/DisplayDate/DisplayDate';

const Chat = ({ memberId, chatRoomId, userNickName, onCancel }) => {
  
  // 채팅 콘텍스트
  const { chatList, getChatList, inputChat, handleChatChange, sendMessage } = useContext(ChatContext)
  // 외부 요소 스크롤을 막는 함수
  const { lockScroll, unlockScroll } = useContext(HeaderContext);

  // 컴포넌트 내부
  const scrollRef = useRef();

  // chatList가 바뀔 때마다 맨 아래로
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatList]);

  useEffect(() => {
    getChatList(memberId, chatRoomId)
  },[chatRoomId, memberId])
  
  useEffect(() => {
    console.log("최신 chatList:", chatList);
  }, [chatList]);

  useEffect(() => {
      if (chatRoomId) lockScroll();
      return () => unlockScroll();
  }, [chatRoomId]);

  return (
    <S.Backdrop onClick={onCancel}>
      <S.ChatRoomContainer onClick={e => e.stopPropagation()}>
        {/* 채팅 타이틀 / 닫기 버튼 */}
        <S.TitleContainer>
          <S.Title>{userNickName}</S.Title>
          <S.CloseButton src='/assets/images/modal/close-button.png' alt='x버튼' onClick={onCancel}/>
        </S.TitleContainer>
        <S.ChatLogContainer ref={scrollRef}>
          {chatList.map((item, i) => 
            item.chatWriterMemberId !== memberId ? (
              <S.LeftChat key={i}>
                <S.LeftMemberImg 
                  src={`http://localhost:10000/images/profile/${item.memberImgName}`}
                  onError={e => {
                    e.target.src = "/assets/images/header/default-member-img.png";
                  }}
                />
                <S.LeftTextContainer>
                  <S.LeftNickName>{item.memberNickname}</S.LeftNickName>
                  <S.LeftContent>{item.chatContent}</S.LeftContent>
                </S.LeftTextContainer>
                <S.LeftChatInfoContainer>
                  {DisplayDate(item.chatSendTime)}
                </S.LeftChatInfoContainer>
              </S.LeftChat>
            ) : (
              <S.RightChat key={i}>
                <S.RightChatInfoContainer>
                  <S.ChatReadingInfo>
                    {item.chatReading === 0 ? '1' : ''}
                  </S.ChatReadingInfo>
                  {DisplayDate(item.chatSendTime)}
                </S.RightChatInfoContainer>
                <S.RightContent>{item.chatContent}</S.RightContent>
              </S.RightChat>
            )
          )}
        </S.ChatLogContainer>
        <S.ChatInputBox>
          <S.ChatInput
            maxLength={200}
            placeholder="메세지 입력"
            onChange={handleChatChange}
            value={inputChat}
            spellCheck={false}
            onDrop={e => e.preventDefault()}
            onDragOver={e => e.preventDefault()}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(chatRoomId, memberId, inputChat);
              }
            }}
          >
          </S.ChatInput>
          <S.SendButton onClick={() => sendMessage(chatRoomId, memberId, inputChat)}>
            전송
          </S.SendButton>
        </S.ChatInputBox>
      </S.ChatRoomContainer>
    </S.Backdrop>
  );
};

export default Chat;