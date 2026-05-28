"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChatSidebar } from "@/components/chat-sidebar";
import { ChatInterface } from "@/components/chat-interface";
import { AuthGuard } from "@/components/auth-guard";
import { Button } from "@/components/ui/button";
import { Menu, Plus, Sparkles } from "lucide-react";
import type { Chat, Message } from "@/types/chat";
import type { AuthUser } from "@/types/auth";
import { chatsStorageKey, getStoredUser } from "@/lib/auth";
import { authApi } from "@/utils/auth-api";
import { motion, AnimatePresence } from "framer-motion";

function ChatAppContent() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isInitialized, setIsInitialized] = useState(false);

  const createEmptyChat = (): Chat => ({
    id: Date.now().toString(),
    title: "New conversation",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  useEffect(() => {
    const currentUser = getStoredUser();
    setUser(currentUser);

    const storageKey = chatsStorageKey(currentUser?.id);
    const savedChats = localStorage.getItem(storageKey);
    const savedSidebarWidth = localStorage.getItem("ai-tutor-sidebar-width");

    if (savedSidebarWidth) {
      setSidebarWidth(Number.parseInt(savedSidebarWidth));
    }

    if (savedChats) {
      const parsedChats = JSON.parse(savedChats).map((chat: Chat) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        updatedAt: new Date(chat.updatedAt),
        messages: chat.messages.map((message: Message) => ({
          ...message,
          timestamp: new Date(message.timestamp),
        })),
      }));

      const nonEmptyChats = parsedChats.filter(
        (chat: Chat) => chat.messages.length > 0
      );

      if (nonEmptyChats.length > 0) {
        setChats(nonEmptyChats);
        setActiveChat(nonEmptyChats[0].id);
      } else {
        const newChat = createEmptyChat();
        setChats([newChat]);
        setActiveChat(newChat.id);
      }
    } else {
      const newChat = createEmptyChat();
      setChats([newChat]);
      setActiveChat(newChat.id);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized && chats.length > 0 && user) {
      localStorage.setItem(chatsStorageKey(user.id), JSON.stringify(chats));
    }
  }, [chats, isInitialized, user]);

  useEffect(() => {
    localStorage.setItem("ai-tutor-sidebar-width", sidebarWidth.toString());
  }, [sidebarWidth]);

  const handleLogout = () => {
    authApi.logout();
    router.replace("/login");
  };

  const createNewChat = () => {
    const newChat = createEmptyChat();
    setChats((prev) => [newChat, ...prev]);
    setActiveChat(newChat.id);
  };

  const updateChat = (chatId: string, updates: Partial<Chat>) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, ...updates, updatedAt: new Date() }
          : chat
      )
    );
  };

  const deleteChat = (chatId: string) => {
    setChats((prev) => {
      const filtered = prev.filter((chat) => chat.id !== chatId);
      if (activeChat === chatId && filtered.length > 0) {
        setActiveChat(filtered[0].id);
      } else if (filtered.length === 0) {
        const newChat = createEmptyChat();
        setActiveChat(newChat.id);
        return [newChat];
      }
      return filtered;
    });
  };

  const renameChat = (chatId: string, newTitle: string) => {
    updateChat(chatId, { title: newTitle });
  };

  const togglePinChat = (chatId: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, pinned: !chat.pinned } : chat
      )
    );
  };

  const addMessage = (chatId: string, message: Message) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, message],
            updatedAt: new Date(),
          };
        }
        return chat;
      })
    );
  };

  const setChatMessages = (chatId: string, messages: Message[]) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages, updatedAt: new Date() }
          : chat
      )
    );
  };

  const updateChatTitle = (chatId: string, firstMessage: string) => {
    const title =
      firstMessage.length > 30
        ? firstMessage.substring(0, 30) + "..."
        : firstMessage;
    updateChat(chatId, { title });
  };

  const currentChat = chats.find((chat) => chat.id === activeChat);

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 animate-pulse items-center justify-center rounded-lg bg-gradient-to-r from-cyan-600 to-indigo-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-slate-600 dark:text-slate-400">
            Loading AI Tutor...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <motion.div
        className="pointer-events-none absolute -top-28 -left-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/10"
        animate={{ x: [0, 18, 0], y: [0, -12, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-600/10"
        animate={{ x: [0, -16, 0], y: [0, 12, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: sidebarWidth, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-r border-white/30 dark:border-slate-800/70"
          >
            <ChatSidebar
              chats={chats}
              activeChat={activeChat}
              user={user}
              onSelectChat={setActiveChat}
              onDeleteChat={deleteChat}
              onRenameChat={renameChat}
              onTogglePin={togglePinChat}
              onNewChat={createNewChat}
              onLogout={handleLogout}
              width={sidebarWidth}
              onWidthChange={setSidebarWidth}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between border-b border-slate-200/70 bg-white/70 p-4 backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-900/80"
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-lg font-semibold text-transparent dark:from-slate-100 dark:to-slate-400">
                  {currentChat?.title || "AI Tutor"}
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user?.name || user?.email || "Signed in"}
                  </p>
                  <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-medium text-cyan-700 dark:border-cyan-900 dark:bg-cyan-950/30 dark:text-cyan-300">
                    {chats.length} chats
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Button
            onClick={createNewChat}
            className="border-0 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:from-cyan-700 hover:to-indigo-700 hover:shadow-xl"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </motion.div>

        <div className="min-h-0 flex-1">
          {currentChat ? (
            <ChatInterface
              key={currentChat.id}
              chat={currentChat}
              onAddMessage={addMessage}
              onSetMessages={setChatMessages}
              onUpdateTitle={updateChatTitle}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <AuthGuard>
      <ChatAppContent />
    </AuthGuard>
  );
}
