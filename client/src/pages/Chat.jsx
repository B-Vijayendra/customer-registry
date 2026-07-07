import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import ChatBox from '../components/ChatBox.jsx';

export default function Chat() {
  const { complaintId } = useParams();
  const location = useLocation();
  const receiverId = location.state?.receiverId;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link to={`/complaints/${complaintId}`} className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-primary-600">
        <FiArrowLeft size={14} /> Back to complaint
      </Link>
      <ChatBox complaintId={complaintId} receiverId={receiverId} />
    </div>
  );
}
