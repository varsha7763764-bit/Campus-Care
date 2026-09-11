import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  ArrowRight,
  Bot,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui';
import { doctors } from '@/data/doctors';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  actions?: { label: string; page: string; params?: Record<string, string> }[];
}

const quickPrompts = [
  'Find a doctor for skin issues',
  'How do I book an appointment?',
  'What medicines are in my routine?',
  'Tips for exam stress',
  'Where is the campus health centre?',
];

function getAssistantResponse(input: string, navigate: (page: string, params?: Record<string, string>) => void): ChatMessage {
  const lower = input.toLowerCase();
  const id = `msg-${Date.now()}`;

  // Find doctor
  if (lower.includes('find doctor') || lower.includes('skin') || lower.includes('dermatolog') || lower.includes('dental') || lower.includes('eye') || lower.includes('mental') || lower.includes('gynec')) {
    let matchedSpec = '';
    if (lower.includes('skin') || lower.includes('dermat')) matchedSpec = 'Dermatology';
    else if (lower.includes('dental') || lower.includes('teeth') || lower.includes('tooth')) matchedSpec = 'Dental';
    else if (lower.includes('eye') || lower.includes('vision')) matchedSpec = 'Eye Care';
    else if (lower.includes('mental') || lower.includes('stress') || lower.includes('anxiety')) matchedSpec = 'Mental Wellness';
    else if (lower.includes('gynec') || lower.includes('women')) matchedSpec = 'Gynecology';
    else if (lower.includes('general') || lower.includes('fever') || lower.includes('cold') || lower.includes('physician')) matchedSpec = 'General Physician';

    const matching = matchedSpec
      ? doctors.filter(d => d.specialization === matchedSpec)
      : doctors;

    const list = matching.slice(0, 3).map(d => `• ${d.name} — ${d.specialization} (${d.experience}y exp, ₹${d.fee})`).join('\n');

    return {
      id,
      role: 'assistant',
      text: matchedSpec
        ? `Here are some ${matchedSpec} doctors available on campus:\n\n${list}\n\nYou can view their full profile and book an appointment.`
        : `Here are some doctors available on campus:\n\n${list}\n\nYou can browse all doctors and filter by specialization.`,
      actions: [{ label: 'Browse All Doctors', page: 'find-doctor' }],
    };
  }

  // Book appointment
  if (lower.includes('book') || lower.includes('appointment') || lower.includes('schedule')) {
    return {
      id,
      role: 'assistant',
      text: 'To book an appointment:\n\n1. Go to Find Doctor\n2. Select a doctor and click "Book Appointment"\n3. Choose your preferred day, time slot, and consultation type (Online/Offline)\n4. Confirm your appointment\n\nYour appointment will appear in the Appointments page.',
      actions: [{ label: 'Find a Doctor', page: 'find-doctor' }, { label: 'View Appointments', page: 'appointments' }],
    };
  }

  // Medical routine
  if (lower.includes('routine') || lower.includes('medicine') || lower.includes('medication') || lower.includes('prescription')) {
    return {
      id,
      role: 'assistant',
      text: 'Your Medical Routine is a weekly timetable of your medicines, organized by Morning, Afternoon, Evening, and Night. You can:\n\n• View your full weekly schedule\n• Mark medicines as taken\n• Track your adherence progress\n\nWhen you complete an online consultation, you can add prescribed medicines directly to your routine from the Digital Prescription page.',
      actions: [{ label: 'View Medical Routine', page: 'medical-routine' }, { label: 'View Medicines', page: 'medicines' }],
    };
  }

  // Wellbeing / exam stress
  if (lower.includes('stress') || lower.includes('wellbeing') || lower.includes('mental') || lower.includes('mood') || lower.includes('anxiety') || lower.includes('sleep') || lower.includes('exam')) {
    return {
      id,
      role: 'assistant',
      text: 'Here are some wellbeing tips for exam stress:\n\n• Try the 4-7-8 breathing technique: inhale for 4s, hold for 7s, exhale for 8s\n• Use the Pomodoro technique: 25-minute study blocks with 5-minute breaks\n• Prioritize 7-8 hours of sleep for better memory retention\n• Do a daily mood check-in to track how you feel\n\nVisit the Wellbeing page for more resources and counselling support.',
      actions: [{ label: 'Open Wellbeing', page: 'wellbeing' }],
    };
  }

  // LPU healthcare / campus / map
  if (lower.includes('campus') || lower.includes('health centre') || lower.includes('hospital') || lower.includes('pharmacy') || lower.includes('map') || lower.includes('location') || lower.includes('lpu')) {
    return {
      id,
      role: 'assistant',
      text: 'LPU campus healthcare facilities include:\n\n• Uni-Health Centre (Block 1) — primary health facility\n• Campus Medical Store — 24/7 pharmacy\n• Counselling & Happiness Cell (Block 27) — mental health support\n• Apollo Hospitals Phagwara — ~3 km from campus\n\nCheck the LPU Healthcare page for an interactive map with directions.',
      actions: [{ label: 'View Campus Map', page: 'lpu-healthcare' }],
    };
  }

  // Emergency
  if (lower.includes('emergency') || lower.includes('urgent') || lower.includes('ambulance') || lower.includes('help')) {
    return {
      id,
      role: 'assistant',
      text: 'If this is a real emergency, please call 108 immediately.\n\nCampus emergency contacts:\n• Campus Health Centre: +91-98765-43210 (demo)\n• Campus Security: +91-98765-11111 (demo)\n• Emergency: 108\n\nVisit the Emergency page for all contacts and nearest facilities.',
      actions: [{ label: 'Open Emergency', page: 'emergency' }],
    };
  }

  // Daily plan
  if (lower.includes('daily plan') || lower.includes('health plan') || lower.includes('task') || lower.includes('water') || lower.includes('walk')) {
    return {
      id,
      role: 'assistant',
      text: 'Your Daily Health Plan includes personalized tasks for Morning, Afternoon, Evening, and Night — based on your medicines, mood check-in, and exam stress status.\n\nTasks include taking scheduled medicines, drinking water, walking, relaxation breaks, and sleep reminders.\n\nCompleting tasks earns you health points and increases your streak!',
      actions: [{ label: 'View Daily Plan', page: 'daily-plan' }, { label: 'View Rewards', page: 'rewards' }],
    };
  }

  // Rewards / gamification
  if (lower.includes('reward') || lower.includes('badge') || lower.includes('point') || lower.includes('streak') || lower.includes('gamif')) {
    return {
      id,
      role: 'assistant',
      text: 'You earn Health Points by:\n• Taking medicines on schedule (+10 pts)\n• Completing daily plan tasks (+5 pts)\n• Doing a mood check-in (+5 pts)\n\nMaintain your streak by being active daily. Unlock badges like Hydration Hero, Medicine Master, and 7-Day Streak!',
      actions: [{ label: 'View Rewards', page: 'rewards' }],
    };
  }

  // Greeting
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('help') || lower.length < 5) {
    return {
      id,
      role: 'assistant',
      text: "Hi! I'm your CampusCare Assistant. I can help you with:\n\n• Finding the right doctor\n• Booking appointments\n• Understanding your medical routine\n• Wellbeing and exam stress tips\n• Finding campus healthcare facilities\n• Your daily health plan and rewards\n\nWhat can I help you with today?",
    };
  }

  // Default
  return {
    id,
    role: 'assistant',
    text: "I can help you with finding doctors, booking appointments, your medical routine, wellbeing tips, campus healthcare locations, your daily health plan, and rewards. Try asking about any of these, or use one of the quick suggestions below.",
  };
}

export function Assistant() {
  const { navigate } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Hi! I'm your CampusCare Assistant. I can help you navigate your healthcare journey at LPU. Ask me about finding doctors, booking appointments, your medicine routine, wellbeing tips, or campus facilities.",
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: `user-${Date.now()}`, role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const response = getAssistantResponse(text, (page) => navigate(page as never));
      setMessages(prev => [...prev, response]);
      setTyping(false);
    }, 800);
  };

  const handleAction = (page: string, params?: Record<string, string>) => {
    navigate(page as never, params);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="CampusCare Assistant" subtitle="Your AI-powered campus health guide" />

      <div className="card overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : ''}`}>
                <div className={`rounded-2xl px-4 py-3 text-sm whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-primary-600 text-white rounded-tr-sm'
                    : 'bg-slate-100 text-slate-700 rounded-tl-sm'
                }`}>
                  {msg.text}
                </div>
                {msg.actions && msg.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.actions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleAction(action.page, action.params)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-50 text-primary-700 text-xs font-medium hover:bg-primary-100 transition-all active:scale-95"
                      >
                        {action.label}
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Quick prompts */}
        {messages.length <= 2 && (
          <div className="px-4 sm:px-6 pb-2 flex flex-wrap gap-2">
            {quickPrompts.map(prompt => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200 transition-all"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-slate-100 p-4 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(input); }}
            placeholder="Ask me anything about your health..."
            className="input-field flex-1"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim()}
            className="btn-primary px-4"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-start gap-2 text-xs text-slate-400 px-2">
        <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>The CampusCare Assistant is a demo helper. It cannot diagnose conditions or prescribe medicines. Always consult a healthcare professional for medical advice.</p>
      </div>
    </div>
  );
}


