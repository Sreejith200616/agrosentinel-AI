import { Mic, MicOff, Volume2, VolumeX, Globe, AlertCircle, Keyboard, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { clsx } from '../utils';
import { useApp } from '../context/AppContext';

const COMMANDS = [
  { phrase: '"What is the weather today?"', action: 'Opens weather page with current conditions' },
  { phrase: '"Check market price for paddy"', action: 'Navigates to market prices, filters paddy' },
  { phrase: '"How much fertilizer for banana?"', action: 'Opens fertilizer advisor for banana crop' },
  { phrase: '"Show soil health"', action: 'Opens soil health dashboard' },
  { phrase: '"Ask AgroBot [your question]"', action: 'Sends your question to the AI chatbot' },
];

export default function VoicePage() {
  const { user } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(true);

  function toggleListen() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }

    if (isListening) { setIsListening(false); return; }

    const rec = new SR();
    rec.lang = user.language === 'ta' ? 'ta-IN' : 'en-IN';
    rec.continuous = false;
    rec.interimResults = true;
    rec.onresult = (e: any) => {
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join('');
      setTranscript(t);
    };
    rec.onend = () => setIsListening(false);
    rec.onerror = () => { setIsListening(false); setSupported(false); };
    rec.start();
    setIsListening(true);
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div>
        <h1 className="section-title">Voice Assistant</h1>
        <p className="section-subtitle">Speak to AgroSentinel — supported in English and Tamil</p>
      </div>

      {!supported && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <strong>Voice input not supported</strong> in this browser. Please use Google Chrome or Microsoft Edge.
            <br /><span className="text-sm">You can still use <Link to="/chatbot" className="underline">AgroBot text chat</Link>.</span>
          </div>
        </div>
      )}

      {/* Main mic button */}
      <div className="card text-center py-12">
        <div className="relative inline-block mb-6">
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full bg-red-400/30 animate-ping scale-125" />
              <div className="absolute inset-0 rounded-full bg-red-400/20 animate-ping scale-150 animation-delay-150" />
            </>
          )}
          <button
            onClick={toggleListen}
            className={clsx(
              'w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-xl',
              isListening
                ? 'bg-red-500 hover:bg-red-600 scale-110'
                : 'bg-gradient-to-br from-forest to-emerald hover:scale-110'
            )}
          >
            {isListening ? <MicOff className="w-10 h-10 text-white" /> : <Mic className="w-10 h-10 text-white" />}
          </button>
        </div>
        
        <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {isListening ? '🎙 Listening...' : 'Tap to speak'}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {isListening ? 'Speak now in English or Tamil' : 'Press the microphone and speak your farming question'}
        </div>

        {transcript && (
          <div className="max-w-md mx-auto mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-400 mb-2">You said:</div>
            <div className="text-gray-900 dark:text-white font-medium">"{transcript}"</div>
            <Link to={`/chatbot`} state={{ initialMessage: transcript }}
              className="btn-primary mt-3 w-full justify-center text-sm">
              <MessageCircle className="w-4 h-4" /> Send to AgroBot
            </Link>
          </div>
        )}
      </div>

      {/* Language selector */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5 text-forest dark:text-lime" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Supported Languages</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { lang: 'English', code: 'en-IN', flag: '🇬🇧', status: 'Supported' },
            { lang: 'Tamil', code: 'ta-IN', flag: '🇮🇳', status: 'Supported' },
            { lang: 'Hindi', code: 'hi-IN', flag: '🇮🇳', status: 'Coming Soon' },
            { lang: 'Telugu', code: 'te-IN', flag: '🇮🇳', status: 'Coming Soon' },
            { lang: 'Kannada', code: 'kn-IN', flag: '🇮🇳', status: 'Coming Soon' },
            { lang: 'Malayalam', code: 'ml-IN', flag: '🇮🇳', status: 'Coming Soon' },
          ].map(l => (
            <div key={l.lang} className={clsx('p-3 rounded-xl border text-sm',
              l.status === 'Supported' ? 'border-forest/30 bg-mint dark:bg-brand-900/20' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50')}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{l.flag}</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{l.lang}</div>
                  <div className={clsx('text-xs', l.status === 'Supported' ? 'text-forest dark:text-lime' : 'text-gray-400')}>{l.status}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sample commands */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <Keyboard className="w-5 h-5 text-forest dark:text-lime" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Sample Voice Commands</h3>
        </div>
        <div className="space-y-2">
          {COMMANDS.map((c, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <Volume2 className="w-4 h-4 text-forest dark:text-lime flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{c.phrase}</div>
                <div className="text-xs text-gray-400 mt-0.5">→ {c.action}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-xs text-blue-700 dark:text-blue-300">
          💡 Voice interface requires browser microphone permission. Works best in Chrome with a quiet environment.
        </div>
      </div>
    </div>
  );
}
