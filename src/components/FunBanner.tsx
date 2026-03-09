import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";

const funMessages = [
  { text: "🎉 You're the 1,000th visitor! Just kidding… but you're still special.", emoji: "🥳" },
  { text: "🍪 This site uses no cookies. You're welcome.", emoji: "😇" },
  { text: "⚡ Fun fact: This page loaded faster than you can say 'microservices'.", emoji: "🚀" },
  { text: "👀 Psst… you look like someone who appreciates clean code.", emoji: "✨" },
  { text: "🎯 Achievement unlocked: Found Athira's portfolio!", emoji: "🏆" },
  { text: "☕ Grab a coffee and stay a while — there's cool stuff here.", emoji: "🫶" },
  { text: "🧑‍💻 No AI was mass-harmed in the making of this site. Just a little.", emoji: "🤖" },
  { text: "🌟 You have excellent taste in portfolios. Scientifically proven.", emoji: "🔬" },
];

export default function FunBanner() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState(funMessages[0]);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("fun-banner-dismissed");
    if (dismissed) return;

    const msg = funMessages[Math.floor(Math.random() * funMessages.length)];
    setMessage(msg);

    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem("fun-banner-dismissed", "true");
  };

  if (!visible) return null;

  return (
    <div className="animate-fade-in mb-6 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 flex items-center gap-3">
      <Sparkles size={16} className="text-primary shrink-0" />
      <p className="text-sm text-foreground flex-1">
        {message.text} <span className="ml-1">{message.emoji}</span>
      </p>
      <button
        onClick={dismiss}
        className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
