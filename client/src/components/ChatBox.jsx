import React, { useState, useEffect, useRef } from 'react';
import { FiSend } from 'react-icons/fi';
import { messageService } from '../services/messageService';
import { useAuth } from '../hooks/useAuth';
import { formatDateTime } from '../utils/constants';
import Loader from './Loader.jsx';

export default function ChatBox({ complaintId, receiverId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const load = async () => {
    try {
      const { data } = await messageService.getByComplaint(complaintId);
      setMessages(data.data.messages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 8000);
    return () => clearInterval(interval);
  }, [complaintId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !receiverId) return;
    setSending(true);
    try {
      await messageService.send({ complaintId, receiver: receiverId, message: text.trim() });
      setText('');
      await load();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="glass-card flex h-[480px] flex-col">
      <div className="border-b border-slate-100 px-5 py-3 dark:border-white/5">
        <h3 className="font-display text-sm font-semibold text-secondary-900 dark:text-white">Conversation</h3>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        {loading ? (
          <div className="flex h-full items-center justify-center"><Loader /></div>
        ) : messages.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">No messages yet. Say hello!</p>
        ) : (
          messages.map((m) => {
            const isMine = m.sender?._id === user._id;
            return (
              <div key={m._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  isMine
                    ? 'bg-gradient-to-r from-primary-600 to-accent-500 text-white'
                    : 'bg-slate-100 text-secondary-800 dark:bg-white/10 dark:text-slate-100'
                }`}>
                  <p>{m.message}</p>
                  <p className={`mt-1 text-[10px] ${isMine ? 'text-white/70' : 'text-slate-400'}`}>{formatDateTime(m.createdAt)}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-slate-100 p-3 dark:border-white/5">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={receiverId ? 'Type a message...' : 'Assign an agent to start chatting'}
          disabled={!receiverId}
          className="input-field"
        />
        <button type="submit" disabled={sending || !receiverId} className="btn-primary !px-3.5">
          <FiSend size={16} />
        </button>
      </form>
    </div>
  );
}
