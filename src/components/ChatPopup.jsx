import React, { useState } from "react";
import { X, Send, Plus, Camera, Video, FileText, Image } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ChatPopup({ onClose }) {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Chat Section */}
        <section className="space-y-4 p-4">
          <h2 className="text-xl font-bold">John Doe</h2>
          <div className="bg-gray-100 flex flex-col rounded-lg shadow-md">
            {/* Chat Messages */}
            <div className="flex-1 p-4 space-y-4 max-h-96 overflow-y-auto">
              {/* Incoming Message */}
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-lg max-w-[70%] shadow-sm">
                  <p className="text-sm">Hey there! 👋</p>
                  <p className="text-xs text-gray-500 mt-1">10:10</p>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-lg max-w-[70%] shadow-sm">
                  <p className="text-sm">
                    This is your delivery driver from Speedy Chow. I'm just around the corner from your place. 😊
                  </p>
                  <p className="text-xs text-gray-500 mt-1">10:10</p>
                </div>
              </div>

              {/* Outgoing Message */}
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white p-3 rounded-lg max-w-[70%] shadow-sm">
                  <p className="text-sm">Hi</p>
                  <p className="text-xs text-blue-200 mt-1 text-right">10:10</p>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-blue-500 text-white p-3 rounded-lg max-w-[70%] shadow-sm">
                  <p className="text-sm">Awesome, thanks for letting me know! Can't wait for my delivery. 🎉</p>
                  <p className="text-xs text-blue-200 mt-1 text-right">10:11</p>
                </div>
              </div>
            </div>

            {/* Input Section */}
            <div className="relative p-4 border-t bg-white flex flex-row items-center gap-2 rounded-b-lg">
              {/* + Icon */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center"
                >
                  <Plus className="w-5 h-5" />
                </button>

                {/* Popup Menu */}
                {showMenu && (
                  <div className="absolute bottom-14 left-0 bg-white shadow-lg rounded-lg p-2 flex flex-col gap-2">
                    <button className="flex items-center gap-2 text-green-600 hover:text-green-800">
                      <Camera className="w-5 h-5" /> {t('chat.camera')}
                    </button>
                    <button className="flex items-center gap-2 text-green-600 hover:text-green-800">
                      <Video className="w-5 h-5" /> {t('chat.video')}
                    </button>
                    <button className="flex items-center gap-2 text-green-600 hover:text-green-800">
                      <FileText className="w-5 h-5" /> {t('chat.document')}
                    </button>
                    <button className="flex items-center gap-2 text-green-600 hover:text-green-800">
                      <Image className="w-5 h-5" /> {t('chat.gallery')}
                    </button>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <input
                type="text"
                placeholder={t('chat.type_message')}
                className="flex-1 p-2 border border-gray-300 rounded-md"
              />

              {/* Send Button */}
              <button
                type="button"
                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
                <span className="sr-only">{t('chat.send_sr')}</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
