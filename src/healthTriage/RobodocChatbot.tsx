import React from "react";
import { useChatbot } from "./types/UseChatbot";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatTopBar } from "./components/ChatTopbar";
import { ChatMessage } from "./components/ChatMessage";
import { TypingIndicator } from "./components/TypingIndicator";
import { ChatInput } from "./components/ChatInput";
import { AnalysisModal } from "./components/AnalysisModal";

interface RoboDocChatbotProps {
  onNavigateToDoctor?: () => void;
}

const RoboDocChatbot: React.FC<RoboDocChatbotProps> = ({
  onNavigateToDoctor,
}) => {
  const {
    messages,
    inputValue,
    setInputValue,
    isTyping,
    diagnosis,
    userData,
    symptoms,
    sidebarOpen,
    setSidebarOpen,
    backendConnected,
    showAnalysis,
    setShowAnalysis,
    chatContainerRef,
    textareaRef,
    messagesEndRef,
    handleSubmit,
    resetChat,
    generatePDF,
  } = useChatbot();

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        sidebarOpen={sidebarOpen}
        backendConnected={backendConnected}
        onNewChat={resetChat}
        onNavigateToDoctor={onNavigateToDoctor}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <ChatTopBar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          diagnosis={diagnosis}
          onViewReport={() => setShowAnalysis(true)}
          onNavigateToDoctor={onNavigateToDoctor}
        />

        {/* Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto bg-white"
        >
          <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {isTyping && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <ChatInput
          inputValue={inputValue}
          isTyping={isTyping}
          textareaRef={textareaRef}
          onInputChange={setInputValue}
          onSubmit={handleSubmit}
        />
      </div>

      {/* Analysis Modal */}
      {showAnalysis && diagnosis && (
        <AnalysisModal
          diagnosis={diagnosis}
          userData={userData}
          symptoms={symptoms}
          onClose={() => setShowAnalysis(false)}
          onNavigateToDoctor={onNavigateToDoctor}
          onDownload={() => generatePDF(userData, symptoms, diagnosis)}
        />
      )}
    </div>
  );
};

export default RoboDocChatbot;