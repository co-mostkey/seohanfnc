'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useSWR, { mutate } from 'swr';
import {
  Search, Send, Plus, MoreVertical, ChevronLeft, ChevronRight, Star, Clock, Paperclip, Smile, Users, UserPlus, Trash2, MessageCircle, ArrowRight, Menu, LogOut, Phone, Video, Info, Filter, X, User, Check, CheckCheck
} from 'lucide-react';
import { ChatUser, ChatMessage, EnrichedConversation } from '@/types/intranet-chat';
import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { ko } from 'date-fns/locale';

// 임시 현재 사용자 ID (실제로는 인증 또는 세션에서 가져와야 함)
const TEMP_CURRENT_USER_ID = 'user1';

const fetcher = (url: string) => fetch(url).then(res => res.json());

// --- Helper Functions ---
const formatMessageTimestamp = (timestamp: string) => {
  const date = parseISO(timestamp);
  if (isToday(date)) return format(date, 'HH:mm');
  if (isYesterday(date)) return `어제 ${format(date, 'HH:mm')}`;
  return format(date, 'yyyy.MM.dd HH:mm');
};

const ConversationListItem: React.FC<{
  conversation: EnrichedConversation;
  isSelected: boolean;
  currentUserId: string;
  onSelect: () => void;
}> = ({ conversation, isSelected, currentUserId, onSelect }) => {
  const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
  const unreadCount = conversation.unreadCounts?.[currentUserId] || 0;

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ${isSelected ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Image
            src={otherParticipant?.avatar || '/images/avatars/default-avatar.png'}
            alt={otherParticipant?.name || 'Unknown User'}
            width={48} height={48} className="rounded-full object-cover"
          />
          {otherParticipant?.isOnline && (
            <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <p className="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">
              {otherParticipant?.name || '알 수 없는 사용자'}
            </p>
            {conversation.lastMessageTimestamp && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatMessageTimestamp(conversation.lastMessageTimestamp)}
              </p>
            )}
          </div>
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
              {conversation.lastMessageContent || '아직 메시지가 없습니다.'}
            </p>
            {unreadCount > 0 && (
              <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};

const MessageBubble: React.FC<{ message: ChatMessage; isOwnMessage: boolean; sender?: ChatUser }> = ({ message, isOwnMessage, sender }) => {
  return (
    <div className={`flex mb-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      {!isOwnMessage && sender && (
        <Image src={sender.avatar || '/images/avatars/default-avatar.png'} alt={sender.name} width={32} height={32} className="rounded-full mr-2 self-end object-cover" />
      )}
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl shadow ${isOwnMessage
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'
          }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        <div className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-400 dark:text-gray-500'} flex items-center ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
          {formatMessageTimestamp(message.timestamp)}
          {isOwnMessage && message.isRead && <CheckCheck size={16} className="ml-1 text-blue-200" />}
          {isOwnMessage && !message.isRead && <Check size={16} className="ml-1 text-blue-200" />}
        </div>
      </div>
      {isOwnMessage && (
        <div className="w-8 ml-2"> {/* Avatar placeholder for own messages to align bubbles if needed, or remove */} </div>
      )}
    </div>
  );
};


export default function MessagesPage() {
  const [currentUserId, setCurrentUserId] = useState<string>(TEMP_CURRENT_USER_ID); // 실제로는 인증 통해 설정
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isMobileConversationListVisible, setIsMobileConversationListVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // SWR hooks for data fetching
  const { data: users, error: usersError } = useSWR<ChatUser[]>('/api/intranet/chat/users', fetcher);
  const { data: conversations, error: conversationsError, mutate: mutateConversations } =
    useSWR<EnrichedConversation[]>(`/api/intranet/chat/conversations`, fetcher, { refreshInterval: 5000 }); // 5초마다 폴링

  const { data: messages, error: messagesError, mutate: mutateMessages } =
    useSWR<ChatMessage[]>(selectedConversationId ? `/api/intranet/chat/messages/${selectedConversationId}` : null, fetcher, { refreshInterval: 2000 }); // 2초마다 폴링


  const selectedConversation = conversations?.find(c => c.id === selectedConversationId);
  const otherParticipant = selectedConversation?.participants.find(p => p.id !== currentUserId);

  useEffect(() => {
    // 메시지 목록 맨 아래로 스크롤
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // 대화 선택 시, 해당 대화의 안 읽은 메시지 읽음 처리
    if (selectedConversationId && conversations) {
      const conversation = conversations.find(c => c.id === selectedConversationId);
      if (conversation && (conversation.unreadCounts?.[currentUserId] || 0) > 0) {
        fetch(`/api/intranet/chat/conversations`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId: selectedConversationId }),
        }).then(res => {
          if (res.ok) {
            mutateConversations(); // 대화 목록 갱신 (안 읽은 수 반영)
            //mutateMessages(); // 현재 메시지 목록도 갱신 (isRead 반영) - 필요시
          }
        });
      }
    }
  }, [selectedConversationId, conversations, currentUserId, mutateConversations]);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    if (window.innerWidth < 768) { // md breakpoint
      setIsMobileConversationListVisible(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversationId) return;

    const tempMessageId = `temp-${Date.now()}`;
    const newMessageOptimistic: ChatMessage = {
      id: tempMessageId,
      conversationId: selectedConversationId,
      senderId: currentUserId,
      content: messageInput,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    // Optimistic update
    if (messages) {
      mutateMessages([...messages, newMessageOptimistic], false);
    } else {
      mutateMessages([newMessageOptimistic], false);
    }
    mutateConversations(prev => prev?.map(c =>
      c.id === selectedConversationId ? { ...c, lastMessageContent: messageInput, lastMessageTimestamp: new Date().toISOString(), lastMessageSenderId: currentUserId } : c
    ), false);


    setMessageInput('');

    try {
      const res = await fetch(`/api/intranet/chat/messages/${selectedConversationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messageInput.trim() }),
      });
      const actualNewMessage = await res.json();
      if (!res.ok) throw new Error(actualNewMessage.error || '메시지 전송 실패');

      // Replace optimistic update with actual data
      mutateMessages(currentMsgs => currentMsgs?.map(m => m.id === tempMessageId ? actualNewMessage : m), false); // revalidate는 SWR이 자동으로 할 수 있음
      mutateConversations(); // 서버에서 업데이트된 대화 정보 다시 가져오기

    } catch (error) {
      console.error("메시지 전송 오류:", error);
      // Rollback optimistic update if needed or show error
      if (messages) {
        mutateMessages(messages.filter(m => m.id !== tempMessageId), false);
      }
      mutateConversations(); // 에러 시 원래 대화 정보로
    }
  };

  const handleStartNewConversation = async (targetUserId: string) => {
    try {
      const res = await fetch('/api/intranet/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId }),
      });
      const newConversation = await res.json();
      if (!res.ok) throw new Error(newConversation.error || '대화 시작 실패');

      mutateConversations(); // 대화 목록 갱신
      setSelectedConversationId(newConversation.id);
      if (window.innerWidth < 768) {
        setIsMobileConversationListVisible(false);
      }
      // 모달 닫기 등 추가 UI 처리
    } catch (error) {
      console.error("새 대화 시작 오류:", error);
    }
  };

  const filteredConversations = conversations?.filter(conv => {
    const otherParticipant = conv.participants.find(p => p.id !== currentUserId);
    return otherParticipant?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // 로딩 및 에러 상태 처리 (간단하게)
  if (usersError || conversationsError) return <div className="p-4">데이터 로딩 중 오류가 발생했습니다.</div>;
  // if (!users || !conversations) return <div className="p-4">데이터를 불러오는 중입니다...</div>;


  // UI 구성
  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Header (simplified) */}
      <header className="bg-white dark:bg-gray-800 shadow-sm p-3 flex items-center justify-between md:hidden">
        <button onClick={() => setIsMobileConversationListVisible(true)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
          <Menu size={24} className="text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {selectedConversationId && otherParticipant ? otherParticipant.name : "메시지"}
        </h1>
        <div className="w-10"> {/* Spacer */} </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Conversation List Panel (Sidebar) */}
        <aside
          className={`
            ${isMobileConversationListVisible ? 'block' : 'hidden'} md:block 
            w-full md:w-80 lg:w-96 
            bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
            flex flex-col
          `}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">대화</h2>
              <button
                onClick={() => {/* TODO: 새 대화 모달 열기. users 목록 사용 */ alert('새 대화 시작 기능 구현 필요 (사용자 목록 표시)'); }}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <UserPlus size={20} className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="대화 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 dark:text-gray-200"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            </div>
          </div>

          {/* Conversation List */}
          <nav className="flex-1 overflow-y-auto p-2 space-y-1">
            {!conversations && !conversationsError && <p className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">대화 목록을 불러오는 중...</p>}
            {conversationsError && <p className="p-4 text-center text-sm text-red-500">대화 목록 로딩 실패</p>}
            {filteredConversations && filteredConversations.length === 0 && <p className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">진행중인 대화가 없습니다.</p>}
            {filteredConversations?.map(conv => (
              <ConversationListItem
                key={conv.id}
                conversation={conv}
                isSelected={selectedConversationId === conv.id}
                currentUserId={currentUserId}
                onSelect={() => handleSelectConversation(conv.id)}
              />
            ))}
          </nav>
        </aside>

        {/* Message Panel (Main Content) */}
        <main
          className={`
            ${isMobileConversationListVisible && selectedConversationId === null ? 'hidden' : 'flex'} md:flex 
            flex-1 flex-col bg-gray-100 dark:bg-gray-900
          `}
        >
          {!selectedConversationId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <MessageCircle size={64} className="text-gray-400 dark:text-gray-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">대화를 선택해주세요.</h2>
              <p className="text-gray-500 dark:text-gray-400">왼쪽 목록에서 대화를 선택하거나 새 대화를 시작하세요.</p>
            </div>
          ) : (
            <>
              {/* Message Header */}
              <header className="bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-3">
                <button
                  onClick={() => { setSelectedConversationId(null); setIsMobileConversationListVisible(true); }}
                  className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
                >
                  <ChevronLeft size={24} className="text-gray-600 dark:text-gray-300" />
                </button>
                {otherParticipant && (
                  <>
                    <Image
                      src={otherParticipant.avatar || '/images/avatars/default-avatar.png'}
                      alt={otherParticipant.name} width={40} height={40} className="rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100">{otherParticipant.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {otherParticipant.isOnline ? '온라인' : '오프라인'}
                        {otherParticipant.position && ` | ${otherParticipant.position}`}
                      </p>
                    </div>
                  </>
                )}
                <div className="flex-1"></div> {/* Spacer */}
                {/* TODO: Action buttons (call, video, info) */}
                {/* <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><Phone size={20} /></button> */}
                {/* <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><MoreVertical size={20} /></button> */}
              </header>

              {/* Message Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messagesError && <p className="text-center text-red-500">메시지 로딩 실패</p>}
                {!messages && !messagesError && selectedConversationId && <p className="text-center text-gray-500 dark:text-gray-400">메시지를 불러오는 중...</p>}
                {messages?.map(msg => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isOwnMessage={msg.senderId === currentUserId}
                    sender={selectedConversation?.participants.find(p => p.id === msg.senderId)}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Area */}
              <footer className="bg-white dark:bg-gray-800 p-3 border-t border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  {/* TODO: Attachment button */}
                  {/* <button type="button" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><Paperclip size={20} /></button> */}
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                    className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-700 dark:text-gray-200"
                  />
                  <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300 dark:disabled:bg-gray-600"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </footer>
            </>
          )}
        </main>
      </div>
    </div>
  );
} 