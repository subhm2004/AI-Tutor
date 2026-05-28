"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import type { Chat } from "@/types/chat";
import type { AuthUser } from "@/types/auth";
import {
  Plus,
  Trash2,
  MoreHorizontal,
  Sparkles,
  Clock,
  Edit2,
  Check,
  X,
  Star,
  Pin,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function getUserInitials(user: AuthUser): string {
  const name = user.name?.trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  return user.email.slice(0, 2).toUpperCase();
}

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: string | null;
  user: AuthUser | null;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
  onTogglePin: (chatId: string) => void;
  onNewChat: () => void;
  onLogout: () => void;
  width: number;
  onWidthChange: (width: number) => void;
}

export function ChatSidebar({
  chats,
  activeChat,
  user,
  onSelectChat,
  onDeleteChat,
  onRenameChat,
  onTogglePin,
  onNewChat,
  onLogout,
  width,
  onWidthChange,
}: ChatSidebarProps) {
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [editingChat, setEditingChat] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Handle resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = Math.max(240, Math.min(480, e.clientX));
      onWidthChange(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, onWidthChange]);

  // Focus edit input when editing starts
  useEffect(() => {
    if (editingChat && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingChat]);

  const formatDate = (date: Date | string) => {
    const now = new Date();
    const dateObj = date instanceof Date ? date : new Date(date);

    if (isNaN(dateObj.getTime())) {
      return "Unknown";
    }

    const diffInHours = (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return dateObj.toLocaleDateString();
    }
  };

  const sortByUpdated = (a: Chat, b: Chat) => {
    const aTime = new Date(a.updatedAt).getTime();
    const bTime = new Date(b.updatedAt).getTime();
    return bTime - aTime;
  };

  const groupChatsByDate = (allChats: Chat[]) => {
    const groups: { [key: string]: Chat[] } = {};
    const pinned = allChats.filter((c) => c.pinned).sort(sortByUpdated);
    const unpinned = allChats.filter((c) => !c.pinned);

    if (pinned.length > 0) {
      groups["Pinned"] = pinned;
    }

    unpinned.forEach((chat) => {
      const now = new Date();
      const dateObj =
        chat.updatedAt instanceof Date
          ? chat.updatedAt
          : new Date(chat.updatedAt);

      if (isNaN(dateObj.getTime())) {
        if (!groups["Unknown"]) groups["Unknown"] = [];
        groups["Unknown"].push(chat);
        return;
      }

      const diffInHours =
        (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60);

      let group = "";
      if (diffInHours < 24) {
        group = "Today";
      } else if (diffInHours < 48) {
        group = "Yesterday";
      } else if (diffInHours < 168) {
        group = "This Week";
      } else {
        group = "Older";
      }

      if (!groups[group]) groups[group] = [];
      groups[group].push(chat);
    });

    Object.keys(groups).forEach((key) => {
      if (key !== "Pinned") {
        groups[key].sort(sortByUpdated);
      }
    });

    return groups;
  };

  const groupOrder = ["Pinned", "Today", "Yesterday", "This Week", "Older", "Unknown"];
  const chatGroups = groupChatsByDate(chats);
  const orderedGroups = groupOrder.filter((g) => chatGroups[g]?.length);

  const handleChatMouseEnter = (chatId: string) => {
    setHoveredChat(chatId);
  };

  const handleChatMouseLeave = (chatId: string) => {
    if (openDropdown !== chatId && editingChat !== chatId) {
      setHoveredChat(null);
    }
  };

  const handleDropdownOpenChange = (open: boolean, chatId: string) => {
    if (open) {
      setOpenDropdown(chatId);
      setHoveredChat(chatId);
    } else {
      setOpenDropdown(null);
      setHoveredChat(null);
    }
  };

  const startEditing = (chat: Chat) => {
    setEditingChat(chat.id);
    setEditTitle(chat.title);
    setOpenDropdown(null);
  };

  const saveEdit = () => {
    if (editingChat && editTitle.trim()) {
      onRenameChat(editingChat, editTitle.trim());
    }
    setEditingChat(null);
    setEditTitle("");
    setHoveredChat(null);
  };

  const cancelEdit = () => {
    setEditingChat(null);
    setEditTitle("");
    setHoveredChat(null);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  return (
    <div
      ref={sidebarRef}
      className="relative flex h-full border-r border-slate-200/70 bg-white/80 backdrop-blur-2xl dark:border-slate-800/80 dark:bg-slate-900/80"
      style={{ width }}
    >
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="border-b border-slate-200/70 p-3 dark:border-slate-800/80">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-r from-cyan-600 to-indigo-600 rounded-md flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                AI Tutor
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Learning companion
              </p>
            </div>
            <ThemeToggle />
          </div>
          <Button
            onClick={onNewChat}
            className="h-8 w-full border-0 bg-gradient-to-r from-cyan-600 to-indigo-600 text-sm text-white shadow-md transition-all duration-200 hover:from-cyan-700 hover:to-indigo-700 hover:shadow-lg"
          >
            <Plus className="h-3 w-3 mr-1" />
            New Chat
          </Button>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {orderedGroups.map((group) => {
              const groupChats = chatGroups[group];
              return (
              <div key={group} className="mb-4">
                <div className="flex items-center gap-1 px-2 py-1 mb-1">
                  {group === "Pinned" ? (
                    <Pin className="h-2.5 w-2.5 text-amber-500" />
                  ) : (
                    <Clock className="h-2.5 w-2.5 text-slate-400" />
                  )}
                  <span
                    className={`text-xs font-medium uppercase tracking-wider ${
                      group === "Pinned"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {group}
                  </span>
                </div>
                <AnimatePresence>
                  {groupChats.map((chat, index) => (
                    <motion.div
                      key={chat.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.02 }}
                      className={`group relative mb-1 cursor-pointer rounded-lg transition-all duration-200 ${
                        activeChat === chat.id
                          ? "border border-cyan-200 bg-gradient-to-r from-cyan-50 to-slate-50 shadow-sm shadow-cyan-100/70 dark:border-cyan-900 dark:from-cyan-950/30 dark:to-slate-900 dark:shadow-none"
                          : chat.pinned
                            ? "border border-amber-200/60 bg-amber-50/50 hover:bg-amber-50/80 dark:border-amber-900/50 dark:bg-amber-950/20 dark:hover:bg-amber-950/30"
                            : "hover:bg-slate-50/90 dark:hover:bg-slate-800/50"
                      }`}
                      onMouseEnter={() => handleChatMouseEnter(chat.id)}
                      onMouseLeave={() => handleChatMouseLeave(chat.id)}
                      onClick={() => !editingChat && onSelectChat(chat.id)}
                    >
                      <div className="flex items-center p-2 gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
                            activeChat === chat.id
                              ? "bg-gradient-to-r from-cyan-500 to-indigo-500"
                              : "bg-slate-300 dark:bg-slate-600"
                          }`}
                        />

                        <div className="flex-1 min-w-0">
                          {editingChat === chat.id ? (
                            <div className="flex items-center gap-1">
                              <Input
                                ref={editInputRef}
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyDown={handleEditKeyDown}
                                onBlur={saveEdit}
                                className="h-6 text-xs px-1 py-0 border-sky-300 dark:border-sky-600"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0 text-green-600 hover:text-green-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  saveEdit();
                                }}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0 text-red-600 hover:text-red-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  cancelEdit();
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div
                                className={`text-xs font-medium truncate transition-colors ${
                                  activeChat === chat.id
                                    ? "text-cyan-700 dark:text-cyan-300"
                                    : "text-slate-700 dark:text-slate-300"
                                }`}
                              >
                                {chat.title}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {formatDate(chat.updatedAt)}
                              </div>
                            </>
                          )}
                        </div>

                        <div className="flex shrink-0 items-center gap-0.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-5 w-5 p-0 transition-opacity ${
                              chat.pinned
                                ? "text-amber-500 opacity-100"
                                : "text-slate-400 opacity-0 group-hover:opacity-100 hover:text-amber-500"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onTogglePin(chat.id);
                            }}
                            title={chat.pinned ? "Unpin chat" : "Pin chat"}
                          >
                            <Star
                              className={`h-3 w-3 ${chat.pinned ? "fill-current" : ""}`}
                            />
                          </Button>

                        <AnimatePresence>
                          {(hoveredChat === chat.id ||
                            activeChat === chat.id ||
                            openDropdown === chat.id) &&
                            !editingChat && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.15 }}
                              >
                                <DropdownMenu
                                  onOpenChange={(open) =>
                                    handleDropdownOpenChange(open, chat.id)
                                  }
                                  open={openDropdown === chat.id}
                                >
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-5 w-5 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-32"
                                  >
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onTogglePin(chat.id);
                                        setOpenDropdown(null);
                                      }}
                                      className="text-slate-600 focus:text-slate-600 dark:text-slate-400 focus:bg-slate-50 dark:focus:bg-slate-800"
                                    >
                                      <Star
                                        className={`h-3 w-3 mr-2 ${chat.pinned ? "fill-amber-500 text-amber-500" : ""}`}
                                      />
                                      {chat.pinned ? "Unpin" : "Pin"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        startEditing(chat);
                                      }}
                                      className="text-slate-600 focus:text-slate-600 dark:text-slate-400 focus:bg-slate-50 dark:focus:bg-slate-800"
                                    >
                                      <Edit2 className="h-3 w-3 mr-2" />
                                      Rename
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteChat(chat.id);
                                        setOpenDropdown(null);
                                        setHoveredChat(null);
                                      }}
                                      className="text-red-600 focus:text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/20"
                                    >
                                      <Trash2 className="h-3 w-3 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </motion.div>
                            )}
                        </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            );
            })}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-slate-200/70 p-3 dark:border-slate-800/80">
          {user && (
            <div className="mb-3 overflow-hidden rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-cyan-50/40 shadow-sm dark:border-slate-700/80 dark:from-slate-800/80 dark:to-cyan-950/20">
              <div className="flex items-center gap-2.5 p-2.5">
                <Avatar className="h-9 w-9 ring-2 ring-white/80 dark:ring-slate-700/80">
                  <AvatarFallback className="bg-gradient-to-br from-cyan-600 to-indigo-600 text-xs font-semibold text-white">
                    {getUserInitials(user)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                    {user.name || "Student"}
                  </p>
                  <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="flex w-full items-center justify-center gap-2 border-t border-slate-200/70 px-2.5 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-white/50 hover:text-red-600 dark:border-slate-700/70 dark:text-slate-400 dark:hover:bg-slate-900/40 dark:hover:text-red-400"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          )}
          <p className="text-center text-[10px] font-medium tracking-wide text-slate-400 dark:text-slate-500">
            AI Tutor <span className="text-slate-300 dark:text-slate-600">·</span> v1.0
          </p>
        </div>
      </div>

      {/* Resize Handle */}
      <div
        className="w-1 bg-transparent hover:bg-cyan-300 dark:hover:bg-cyan-700 cursor-col-resize transition-colors flex items-center justify-center group"
        onMouseDown={() => setIsResizing(true)}
      >
        <div className="w-0.5 h-8 bg-slate-300 dark:bg-slate-600 group-hover:bg-cyan-500 dark:group-hover:bg-cyan-500 transition-colors rounded-full opacity-0 group-hover:opacity-100" />
      </div>
    </div>
  );
}
