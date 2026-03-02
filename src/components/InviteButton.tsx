"use client";

import { useState } from 'react';

interface InviteButtonProps {
  groupId: number;
  groupName: string;
}

export function InviteButton({ groupId, groupName }: InviteButtonProps) {
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generateInviteLink = async () => {
    setGenerating(true);
    try {
      // Generate invite code (base64 encoded group ID)
      const inviteCode = btoa(groupId.toString());
      const inviteUrl = `${window.location.origin}/invite/${inviteCode}`;
      
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <button
      onClick={generateInviteLink}
      disabled={generating}
      className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors font-medium text-sm"
    >
      {copied ? (
        <>
          <span>✓</span>
          Link Copied!
        </>
      ) : generating ? (
        <>
          <span className="animate-spin">↻</span>
          Generating...
        </>
      ) : (
        <>
          <span>🔗</span>
          Invite
        </>
      )}
    </button>
  );
}
