"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Chat, Message } from "@/types/chat";
import {
  Send,
  User,
  Bot,
  Copy,
  Check,
  BookOpen,
  Lightbulb,
  GraduationCap,
  ImagePlus,
  X,
  Square,
  RotateCcw,
  Clock,
  Atom,
  type LucideIcon,
} from "lucide-react";
import { chatApi } from "@/utils/api";
import {
  prepareImageForUpload,
  parseDataUrlImage,
  type PreparedImage,
} from "@/utils/image-upload";
import { motion, AnimatePresence } from "framer-motion";
import { TypingMessage } from "@/components/typing-message";
import { MarkdownMessage } from "@/components/markdown-message";
import { AgentBadge } from "@/components/agent-badge";
import { LogoAvatar, LogoIcon } from "@/components/brand/logo";
interface ChatInterfaceProps {
  chat: Chat;
  onAddMessage: (chatId: string, message: Message) => void;
  onSetMessages: (chatId: string, messages: Message[]) => void;
  onUpdateTitle: (chatId: string, firstMessage: string) => void;
}

export function ChatInterface({
  chat,
  onAddMessage,
  onSetMessages,
  onUpdateTitle,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [skipTyping, setSkipTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<PreparedImage | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [typingMessage, setTypingMessage] = useState<{
    id: string;
    content: string;
    agent?: string;
  } | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const isBusy = isLoading || !!typingMessage;

  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  // Auto-scroll to bottom when new messages are added or during typing
  useEffect(() => {
    scrollToBottom();
  }, [chat.messages, typingMessage]);

  // Continuous scroll during typing animation
  useEffect(() => {
    if (typingMessage) {
      const interval = setInterval(scrollToBottom, 100);
      return () => clearInterval(interval);
    }
  }, [typingMessage]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [input]);

  const showAssistantReply = (responseContent: string, agent?: string) => {
    setSkipTyping(false);
    setTypingMessage({
      id: `assistant-${Date.now()}`,
      content: responseContent,
      agent,
    });
  };

  const toApiHistory = (messages: Message[]) =>
    messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

  const fetchAssistantReply = async (
    historyMessages: Message[],
    options?: { imagePayload?: PreparedImage; userNote?: string }
  ) => {
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsLoading(true);

    try {
      let response;
      if (options?.imagePayload) {
        response = await chatApi.sendImageMessage(
          {
            image: options.imagePayload.base64,
            mimeType: options.imagePayload.mimeType,
            text: options.userNote,
          },
          controller.signal
        );
      } else {
        response = await chatApi.sendMessage(
          toApiHistory(historyMessages),
          controller.signal
        );
      }

      const responseContent =
        response.message ||
        response.response ||
        "Sorry, I could not process your request.";

      showAssistantReply(responseContent, response.agent);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      console.error("Error sending message:", error);
      const errorContent =
        error instanceof Error
          ? error.message
          : "Sorry, there was an error processing your request. Please try again.";
      showAssistantReply(errorContent, "Unknown");
    } finally {
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    if (isLoading) {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
      return;
    }
    if (typingMessage) {
      setSkipTyping(true);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setImageError(null);
    try {
      const prepared = await prepareImageForUpload(file);
      setPendingImage(prepared);
    } catch (err) {
      setImageError(
        err instanceof Error ? err.message : "Could not load that image."
      );
      setPendingImage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if ((!text && !pendingImage) || isBusy) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text || "Question from uploaded image",
      timestamp: new Date(),
      ...(pendingImage ? { imageUrl: pendingImage.dataUrl } : {}),
    };

    const imagePayload = pendingImage;
    setInput("");
    setPendingImage(null);
    setImageError(null);

    onAddMessage(chat.id, userMessage);

    if (chat.messages.length === 0) {
      onUpdateTitle(
        chat.id,
        text || "Image question"
      );
    }

    await fetchAssistantReply([...chat.messages, userMessage], {
      imagePayload: imagePayload ?? undefined,
      userNote: text,
    });
  };

  const handleRegenerate = async () => {
    if (isBusy) return;

    const messages = chat.messages;
    let lastAssistantIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant") {
        lastAssistantIndex = i;
        break;
      }
    }
    if (lastAssistantIndex === -1) return;

    const trimmed = messages.slice(0, lastAssistantIndex);
    const lastUser = [...trimmed].reverse().find((m) => m.role === "user");
    if (!lastUser) return;

    onSetMessages(chat.id, trimmed);

    if (lastUser.imageUrl) {
      const parsed = parseDataUrlImage(lastUser.imageUrl);
      if (!parsed) return;
      const note =
        lastUser.content !== "Question from uploaded image"
          ? lastUser.content
          : "";
      await fetchAssistantReply(trimmed, {
        imagePayload: {
          base64: parsed.base64,
          mimeType: parsed.mimeType,
          dataUrl: lastUser.imageUrl,
        },
        userNote: note,
      });
    } else {
      await fetchAssistantReply(trimmed);
    }
  };

  const handleTypingComplete = () => {
    if (typingMessage) {
      const assistantMessage: Message = {
        id: typingMessage.id,
        role: "assistant",
        content: typingMessage.content,
        timestamp: new Date(),
        ...(typingMessage.agent ? { agent: typingMessage.agent } : {}),
      };

      onAddMessage(chat.id, assistantMessage);
      setTypingMessage(null);
      setSkipTyping(false);
    }
  };

  const lastAssistantId =
    [...chat.messages].reverse().find((m) => m.role === "assistant")?.id ??
    null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const formatTime = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);

    if (isNaN(dateObj.getTime())) {
      return "Unknown";
    }

    return dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const suggestedPrompts: { text: string; icon: LucideIcon }[] = [
    {
      text: "In special relativity, is time absolute or relative? Explain with a simple example.",
      icon: Clock,
    },
    {
      text: "Why do objects fall at the same rate in a vacuum regardless of their mass?",
      icon: BookOpen,
    },
    {
      text: "How do you find the derivative of f(x) = x² + 3x using the power rule?",
      icon: Lightbulb,
    },
    {
      text: "What happens when you mix a strong acid with a strong base?",
      icon: Atom,
    },
    {
      text: "What were the main long-term causes of World War I?",
      icon: GraduationCap,
    },
    {
      text: "How does time dilation work when something moves close to the speed of light?",
      icon: Bot,
    },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Custom CSS for fractions */}
      <style jsx>{`
        .fraction {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          font-size: 0.9em;
          margin: 0 2px;
          vertical-align: middle;
        }
        .numerator {
          border-bottom: 1px solid currentColor;
          padding-bottom: 1px;
          line-height: 1;
        }
        .denominator {
          padding-top: 1px;
          line-height: 1;
        }
      `}</style>

      {/* Messages */}
      <ScrollArea className="flex-1 px-3 py-4 sm:px-6" ref={scrollAreaRef}>
        <div className="mx-auto w-full max-w-5xl space-y-6">
          {chat.messages.length === 0 && !typingMessage ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto mb-6 flex justify-center"
              >
                <LogoIcon size="2xl" />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2"
              >
                Ready to learn something new?
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto"
              >
                Ask me anything! I'm here to help you understand complex topics,
                solve problems, and guide your learning journey.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto"
              >
                {suggestedPrompts.map(({ text, icon: Icon }, index) => (
                  <motion.button
                    key={text}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.08 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => setInput(text)}
                    className="p-4 text-left bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-cyan-300 dark:hover:border-cyan-700 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-100 to-indigo-100 dark:from-cyan-900/60 dark:to-indigo-900/60 rounded-lg flex items-center justify-center group-hover:from-cyan-200 group-hover:to-indigo-200 dark:group-hover:from-cyan-800/60 dark:group-hover:to-indigo-800/60 transition-colors shrink-0">
                        <Icon className="h-4 w-4 text-cyan-700 dark:text-cyan-300" />
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
                        {text}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <AnimatePresence>
              {chat.messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex gap-4 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <LogoAvatar size="md" />
                  )}

                  <div
                    className={`group max-w-[82%] sm:max-w-[75%] ${
                      message.role === "user" ? "order-1" : ""
                    }`}
                  >
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      whileHover={{ y: -1 }}
                      className={`rounded-2xl p-4 shadow-sm ring-1 ring-inset ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-cyan-600 via-cyan-600 to-indigo-600 text-white ring-white/20"
                          : "bg-white/90 dark:bg-slate-800/90 border border-slate-200/70 dark:border-slate-700/70 ring-white/70 dark:ring-slate-700/60 backdrop-blur-sm"
                      }`}
                    >
                      {message.role === "user" ? (
                        <div className="space-y-2">
                          {message.imageUrl && (
                            <img
                              src={message.imageUrl}
                              alt="Uploaded question"
                              className="max-h-48 w-full rounded-lg border border-white/20 object-contain"
                            />
                          )}
                          {message.content &&
                            message.content !== "Question from uploaded image" && (
                              <div className="whitespace-pre-wrap break-words leading-relaxed">
                                {message.content}
                              </div>
                            )}
                          {message.imageUrl &&
                            message.content === "Question from uploaded image" && (
                              <p className="text-sm text-white/80">
                                Image question
                              </p>
                            )}
                        </div>
                      ) : (
                        <>
                          {message.agent && (
                            <div className="mb-2">
                              <AgentBadge agent={message.agent} />
                            </div>
                          )}
                          <MarkdownMessage content={message.content} />
                        </>
                      )}
                    </motion.div>

                    <div
                      className={`flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400 ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <span>{formatTime(message.timestamp)}</span>
                      {message.role === "assistant" && (
                        <>
                          {message.id === lastAssistantId && !isBusy && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 gap-1 px-1.5 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-slate-700"
                              onClick={handleRegenerate}
                              title="Regenerate response"
                            >
                              <RotateCcw className="h-3 w-3" />
                              <span className="hidden sm:inline">Regenerate</span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                            onClick={() =>
                              copyToClipboard(message.content, message.id)
                            }
                          >
                            {copiedMessageId === message.id ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {message.role === "user" && (
                    <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-slate-500 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing Message */}
              {typingMessage && (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 justify-start"
                >
                  <LogoAvatar size="md" />
                  <div className="group max-w-[82%] sm:max-w-[75%]">
                    <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-800/90">
                      {typingMessage.agent && (
                        <div className="mb-2">
                          <AgentBadge agent={typingMessage.agent} />
                        </div>
                      )}
                      <TypingMessage
                        content={typingMessage.content}
                        onComplete={handleTypingComplete}
                        speed={20}
                        skip={skipTyping}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          <AnimatePresence>
            {isLoading && !typingMessage && (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex gap-4 justify-start"
              >
                <LogoAvatar size="md" />
                <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/70 dark:bg-slate-800/90">
                  <div className="flex space-x-2">
                    <motion.div
                      className="w-2 h-2 bg-cyan-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: 0,
                      }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-cyan-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: 0.2,
                      }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-cyan-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: 0.4,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Input Form */}
      <div className="border-t border-slate-200/70 bg-white/75 p-4 backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-900/80">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {pendingImage && (
            <div className="mb-3 flex items-start gap-3 rounded-xl border border-slate-200/70 bg-slate-50/80 p-2 dark:border-slate-700/70 dark:bg-slate-800/50">
              <img
                src={pendingImage.dataUrl}
                alt="Preview"
                className="h-20 w-20 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1 pt-1">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Image attached
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Max 4 MB
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 shrink-0 p-0"
                onClick={() => {
                  setPendingImage(null);
                  setImageError(null);
                }}
                disabled={isBusy}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          {isBusy && (
            <div className="mb-2 flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleStop}
                className="h-8 gap-2 rounded-full border-slate-300 bg-white/90 text-xs text-slate-700 shadow-sm hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-slate-600 dark:bg-slate-800/90 dark:text-slate-200 dark:hover:border-red-800 dark:hover:bg-red-950/40 dark:hover:text-red-400"
              >
                <Square className="h-3 w-3 fill-current" />
                {isLoading ? "Stop generating" : "Skip animation"}
              </Button>
            </div>
          )}
          <div className="flex items-end gap-2 rounded-2xl border border-slate-200/70 bg-white/80 p-2 shadow-lg shadow-slate-200/50 dark:border-slate-700/70 dark:bg-slate-900/80 dark:shadow-black/20">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageSelect}
              disabled={isBusy}
            />
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                pendingImage
                  ? "Optional note about the image..."
                  : "Ask me anything or upload an image..."
              }
              className="min-h-[56px] max-h-32 min-w-0 flex-1 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={isBusy}
            />
            <div className="flex shrink-0 items-center gap-1 self-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-10 w-10 rounded-xl p-0 text-slate-500 hover:bg-slate-100 hover:text-cyan-600 dark:hover:bg-slate-800 dark:hover:text-cyan-400"
                onClick={() => fileInputRef.current?.click()}
                disabled={isBusy}
                title="Upload image"
              >
                <ImagePlus className="h-5 w-5" />
              </Button>
              {isBusy ? (
                <Button
                  type="button"
                  onClick={handleStop}
                  className="h-10 w-10 rounded-xl border-0 bg-red-500 p-0 shadow-lg transition-all duration-200 hover:bg-red-600 hover:shadow-xl"
                  title="Stop"
                >
                  <Square className="h-4 w-4 fill-white text-white" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!input.trim() && !pendingImage}
                  className="h-10 w-10 rounded-xl border-0 bg-gradient-to-r from-cyan-600 to-indigo-600 p-0 shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-cyan-700 hover:to-indigo-700 hover:shadow-xl disabled:from-slate-300 disabled:to-slate-400"
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          {imageError && (
            <p className="mt-2 text-center text-xs text-red-500">{imageError}</p>
          )}
          <div className="mt-2 space-y-1 text-center text-xs text-slate-500 dark:text-slate-400">
            <p>
              Press{" "}
              <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">
                Enter
              </kbd>{" "}
              to send,{" "}
              <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-slate-800">
                Shift + Enter
              </kbd>{" "}
              for new line
            </p>
            <p>Image upload — Max 4 MB.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
