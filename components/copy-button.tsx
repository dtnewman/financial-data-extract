'use client';

import { useState } from 'react';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute right-2 top-2 rounded bg-[#DAAC95] px-2 py-1 text-xs text-black hover:bg-zinc-200"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
