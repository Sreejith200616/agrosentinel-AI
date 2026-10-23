import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { sendChatMessage, createUserMessage, createAssistantMessage, QUICK_PROMPTS } from '../services/ai';
import { clsx, generateId } from '../utils';
import type { ChatMessage } from '../types';
import { Send, Mic, Trash2, Leaf, MessageCircle, Loader2, AlertTriangle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const WELCOME_MSG: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `Hello! I'm **AgroBot** 🌾, your AI farming assistant.\n\nI can help you with:\n- Crop cultivation advice (Paddy, Banana, Groundnut...)\n- Fertilizer and nutrient recommendations\n- Pest and disease management\n- Weather-based farming decisions\n- Market prices and selling guidance\n- Integrated farming system advice\n\nAsk me anything about farming!${!GEMINI_KEY ? '\n\n*⚠ Demo mode active — configure VITE_GEMINI_API_KEY in .env for live AI responses.*' : ''}`,
  timestamp: new Date().toISOString(),
};

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>')
    .replace(/^• /gm, '• ')
    .replace(/^\d\. /gm, (m) => m);
}

export default function ChatbotPage() {
  const { activeFarm, user } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || isLoading) return;
    const userMsg = createUserMessage(text);
    const loadingMsg: ChatMessage = { id: generateId(), role: 'assistant', content: '', timestamp: new Date().toISOString(), isTyping: true };

    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const farmCtx = activeFarm
        ? `Farm: ${activeFarm.name}, Location: ${activeFarm.location}, Crops: ${activeFarm.crops.join(', ')}, Soil: ${activeFarm.soilType}`
        : 'No farm selected';
      const response = await sendChatMessage(text, messages, farmCtx);
      const assistantMsg = createAssistantMessage(response);
      setMessages(prev => prev.filter(m => !m.isTyping).concat(assistantMsg));
    } catch {
      // API key invalid or network error — show helpful fallback in chat
      const fallback = createAssistantMessage(
        `**Demo Mode Active** — The Gemini API key is not valid yet.\n\nTo enable live AI:\n1. Visit **https://aistudio.google.com/app/apikey**\n2. Sign in with Google and click **Create API Key**\n3. Copy the key (it starts with \`AIzaSy...\`)\n4. Open the file **\`.env\`** in your project folder\n5. Replace the current key with the new one\n6. Save and restart the server\n\nMeanwhile I am running in demo mode. Try asking me about:\n- Paddy or banana cultivation\n- Fertilizer recommendations\n- Pest and disease management\n- Soil health tips`
      );
      setMessages(prev => prev.filter(m => !m.isTyping).concat(fallback));
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  }

  function toggleListening() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { toast.error('Speech recognition not supported in this browser.'); return; }
    if (isListening) { setIsListening(false); return; }
    const rec = new SpeechRecognition();
    rec.lang = user.language === 'ta' ? 'ta-IN' : 'en-IN';
    rec.onresult = (e: any) => { setInput(e.results[0][0].transcript); setIsListening(false); };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    rec.start(); setIsListening(true);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800 mb-4">
        <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center">
          <Leaf className="w-5 h-5 text-lime" />
        </div>
        <div>
          <h1 className="font-bold text-gray-900 dark:text-white">AgroBot</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">AI Farming Assistant · {activeFarm?.name ?? 'No farm selected'}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {!GEMINI_KEY && <span className="badge badge-yellow text-xs">Demo Mode</span>}
          <button
            onClick={() => setMessages([WELCOME_MSG])}
            className="btn-ghost text-xs py-1.5 px-3"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        </div>
      </div>

      {/* Demo notice */}
      {!GEMINI_KEY && (
        <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl text-xs text-yellow-700 dark:text-yellow-400 mb-3">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          Demo mode: Set <code className="font-mono bg-yellow-100 dark:bg-yellow-900/40 px-1 rounded">VITE_GEMINI_API_KEY</code> in .env for live AI responses.
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
        {messages.map(msg => (
          <div key={msg.id} className={clsx('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
            <div className={clsx('w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1',
              msg.role === 'user' ? 'bg-forest' : 'bg-gradient-brand')}>
              {msg.role === 'user'
                ? <span className="text-white text-xs font-bold">{user.name[0]}</span>
                : <Leaf className="w-4 h-4 text-lime" />}
            </div>
            <div className={clsx('max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed',
              msg.role === 'user'
                ? 'bg-forest text-white rounded-tr-sm'
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-card border border-gray-100 dark:border-gray-700 rounded-tl-sm'
            )}>
              {msg.isTyping ? (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      <div className="py-3 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2" style={{ minWidth: 'max-content' }}>
          <Sparkles className="w-4 h-4 text-forest dark:text-lime flex-shrink-0 mt-1.5" />
          {QUICK_PROMPTS.slice(0, 5).map(p => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              className="px-3 py-1.5 bg-mint dark:bg-brand-900/30 text-forest dark:text-lime text-xs font-medium rounded-full whitespace-nowrap hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors border border-brand-200 dark:border-brand-800"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex items-end gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-3 shadow-card">
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask AgroBot about farming..."
          rows={1}
          className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none resize-none min-h-[24px] max-h-32"
          style={{ height: 'auto' }}
        />
        <button
          onClick={toggleListening}
          className={clsx('p-2 rounded-xl transition-colors flex-shrink-0',
            isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700')}
          title="Voice input"
        >
          <Mic className="w-4 h-4" />
        </button>
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || isLoading}
          className={clsx('p-2 rounded-xl flex-shrink-0 transition-all',
            input.trim() && !isLoading ? 'bg-forest text-white hover:bg-emerald shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed')}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
        AgroBot provides general guidance. Consult agricultural officers for field decisions.
      </p>
    </div>
  );
}
