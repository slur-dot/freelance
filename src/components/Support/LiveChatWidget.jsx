import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Phone, Mail, Clock, Minimize2, Plus, Camera, Video, FileText, Image } from 'lucide-react';
import ChatService from '../../services/chatService';
import { useAuth } from '../../contexts/AuthContext';

export default function LiveChatWidget({ forceOpen = false, onClose: externalOnClose }) {
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: forceOpen ? "Hello! I'm Emily Lewis, your potential freelancer. How can I help you with your project?" : "Hello! Welcome to our support chat. How can I help you today?",
      sender: 'agent',
      timestamp: new Date(),
      agent: forceOpen ? 'Emily Lewis' : 'Sarah M.'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAttachmentMenu && !event.target.closest('.attachment-menu')) {
        setShowAttachmentMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAttachmentMenu]);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      messages.forEach(message => {
        if (message.file && message.file.url) {
          URL.revokeObjectURL(message.file.url);
        }
      });
    };
  }, []);

  /* 
   * FIREBASE INTEGRATION 
   */
  const { currentUser } = useAuth();
  const [sessionId, setSessionId] = useState(null);

  // Initialize Chat Session
  useEffect(() => {
    const initSession = async () => {
      if (isOpen && currentUser && !sessionId) {
        try {
          // Check for existing session or clean up logic would go here
          // For now, start new session or just use a single active one per user
          // To keep it simple, we'll creating a sessions collection based on userId
          // Ideally, we search for an existing 'active' session.
          // For this demo, let's just create one or get one.
          const sid = await ChatService.startChat(currentUser.uid, {
            email: currentUser.email,
            name: currentUser.displayName || 'User'
          });
          setSessionId(sid);
        } catch (error) {
          console.error("Failed to start chat session", error);
        }
      }
    };
    initSession();
  }, [isOpen, currentUser]);

  // Subscribe to Messages
  useEffect(() => {
    if (!sessionId) return;

    const unsubscribe = ChatService.subscribeToMessages(sessionId, (msgs) => {
      // Transform firestore messages to UI format if needed
      // Our UI expects { id, text, sender, timestamp }
      const formatted = msgs.map(m => ({
        id: m.id,
        text: m.text,
        sender: m.senderRole === 'user' ? 'user' : 'agent',
        timestamp: m.timestamp?.toDate() || new Date(),
        agent: m.senderRole === 'agent' ? 'Support Agent' : undefined,
        file: m.file
      }));
      setMessages(formatted);
    });

    return () => unsubscribe();
  }, [sessionId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      if (sessionId && currentUser) {
        await ChatService.sendMessage(sessionId, currentUser.uid, newMessage, 'user');

        // DEMO ONLY: Auto-reply from 'agent'
        setTimeout(async () => {
          const replies = [
            "Thank you for contacting us. An agent will be with you shortly.",
            "Could you provide more details?",
            "We have received your request."
          ];
          const randomReply = replies[Math.floor(Math.random() * replies.length)];
          await ChatService.sendMessage(sessionId, 'system-agent', randomReply, 'agent');
        }, 1500);
      } else {
        // Fallback or alert if no session
        alert("Please login to chat.");
      }
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const openWhatsApp = () => {
    const phoneNumber = '+224123456789';
    const message = 'Hello! I need support with my account.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const openEmail = () => {
    const email = 'support@freelanceproject.com';
    const subject = 'Support Request';
    const body = 'Hello, I need assistance with:';
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleAttachmentClick = (type) => {
    setShowAttachmentMenu(false);

    // Create file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';

    switch (type) {
      case 'camera':
        // For camera, we'll use the same file input but with camera capture
        input.accept = 'image/*';
        input.capture = 'environment'; // Use back camera if available
        break;
      case 'gallery':
        input.accept = 'image/*';
        break;
      case 'video':
        input.accept = 'video/*';
        break;
      case 'document':
        input.accept = '.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx';
        break;
      default:
        return;
    }

    // Handle file selection
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        handleFileUpload(file, type);
      }
    };

    // Trigger file input
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };

  const handleFileUpload = (file, type) => {
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File size too large. Please select a file smaller than 10MB.');
      return;
    }

    // Create a new message with the file
    const fileMessage = {
      id: messages.length + 1,
      text: `📎 ${file.name}`,
      sender: 'user',
      timestamp: new Date(),
      file: {
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      }
    };

    setMessages(prev => [...prev, fileMessage]);

    // Simulate file upload and agent response
    setTimeout(() => {
      const agentMessage = {
        id: messages.length + 2,
        text: forceOpen ? `Thank you for sharing the ${type}! This will help me better understand your project requirements. I'll review it and get back to you with my proposal.` : `Thank you for sharing the ${type}. I've received your file and will review it shortly.`,
        sender: 'agent',
        timestamp: new Date(),
        agent: forceOpen ? 'Emily Lewis' : 'Sarah M.'
      };
      setMessages(prev => [...prev, agentMessage]);
    }, 2000);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          data-chat-trigger
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-110"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
          1
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[28rem]'
      } w-[calc(100%-2rem)] sm:w-80 md:w-96 bg-white rounded-lg shadow-xl border`}>
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <div>
            <h3 className="font-semibold">{forceOpen ? 'Freelancer Chat' : 'Live Support'}</h3>
            <p className="text-xs opacity-90">{forceOpen ? 'Emily Lewis is online' : 'Sarah M. is online'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-blue-700 p-1 rounded"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setIsOpen(false);
              if (externalOnClose) {
                externalOnClose();
              }
            }}
            className="hover:bg-blue-700 p-1 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                    }`}
                >
                  {message.file ? (
                    <div className="space-y-2">
                      {message.file.type.startsWith('image/') ? (
                        <img
                          src={message.file.url}
                          alt={message.file.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ) : message.file.type.startsWith('video/') ? (
                        <video
                          src={message.file.url}
                          controls
                          className="w-full h-32 object-cover rounded-lg"
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <div className="bg-white/20 p-3 rounded-lg flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          <div>
                            <p className="text-sm font-medium">{message.file.name}</p>
                            <p className="text-xs opacity-70">
                              {(message.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      )}
                      <p className="text-sm">{message.text}</p>
                    </div>
                  ) : (
                    <p className="text-sm">{message.text}</p>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs opacity-70">
                      {formatTime(message.timestamp)}
                    </span>
                    {message.agent && (
                      <span className="text-xs opacity-70 ml-2">
                        {message.agent}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white relative">
            {/* Attachment Menu */}
            {showAttachmentMenu && (
              <div className="attachment-menu absolute bottom-full left-4 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAttachmentClick('camera')}
                    className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <Camera className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-xs text-gray-600">Camera</span>
                  </button>
                  <button
                    onClick={() => handleAttachmentClick('gallery')}
                    className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <Image className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-xs text-gray-600">Gallery</span>
                  </button>
                  <button
                    onClick={() => handleAttachmentClick('video')}
                    className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <Video className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-xs text-gray-600">Video</span>
                  </button>
                  <button
                    onClick={() => handleAttachmentClick('document')}
                    className="flex flex-col items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-xs text-gray-600">Document</span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-2 items-end">
              <button
                onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                className="attachment-menu p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Plus className="h-4 w-4" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <button
                onClick={handleSendMessage}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex gap-2">
              <button
                onClick={openWhatsApp}
                className="flex-1 bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-sm"
              >
                <Phone className="h-4 w-4" />
                WhatsApp
              </button>
              <button
                onClick={openEmail}
                className="flex-1 bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2 text-sm"
              >
                <Mail className="h-4 w-4" />
                Email
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
