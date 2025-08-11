import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Trophy, Sparkles } from 'lucide-react';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Confetti: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 6)]
            }}
          />
        </div>
      ))}
    </div>
  );
};

const WaveBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
            <stop offset="100%" stopColor="rgba(147, 51, 234, 0.1)" />
          </linearGradient>
          <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(147, 51, 234, 0.08)" />
            <stop offset="100%" stopColor="rgba(236, 72, 153, 0.08)" />
          </linearGradient>
          <linearGradient id="wave3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(236, 72, 153, 0.06)" />
            <stop offset="100%" stopColor="rgba(245, 158, 11, 0.06)" />
          </linearGradient>
        </defs>
        
        <path
          d="M0,400 C300,300 600,500 1200,400 L1200,800 L0,800 Z"
          fill="url(#wave1)"
          className="animate-wave-slow"
        />
        <path
          d="M0,500 C400,400 800,600 1200,500 L1200,800 L0,800 Z"
          fill="url(#wave2)"
          className="animate-wave-medium"
        />
        <path
          d="M0,600 C200,550 400,650 1200,600 L1200,800 L0,800 Z"
          fill="url(#wave3)"
          className="animate-wave-fast"
        />
      </svg>
      
      {/* Floating geometric shapes */}
      <div className="absolute inset-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-float-geometric"
            style={{
              left: `${10 + (i * 8)}%`,
              top: `${20 + Math.sin(i) * 30}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${15 + (i % 3) * 5}s`,
            }}
          >
            <div
              className={`${
                i % 3 === 0 ? 'w-4 h-4 rounded-full' : 
                i % 3 === 1 ? 'w-3 h-3 rotate-45' : 
                'w-2 h-6 rounded-full'
              } bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm`}
              style={{
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const AnimatedTitle: React.FC = () => {
  return (
    <div className="text-center mb-8 md:mb-12 lg:mb-16">
      <div className="flex justify-center items-center gap-3 mb-4">
        <Trophy className="w-8 h-8 md:w-10 md:h-10 text-yellow-400" />
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight text-white">
          Pensioen countdown
        </h1>
        <Trophy className="w-8 h-8 md:w-10 md:h-10 text-yellow-400" />
      </div>
      <p className="text-lg md:text-xl lg:text-2xl text-blue-100 font-light">
       Het avontuur begint op 1 Mei 2027
      </p>
    </div>
  );
};
const CountdownCard: React.FC<{ value: number; label: string; delay?: number }> = ({ value, label, delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (displayValue !== value) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsAnimating(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  return (
    <div 
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 lg:p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-2 transition-all duration-300 ${isAnimating ? 'scale-110 text-yellow-300' : 'scale-100'}`}>
        {displayValue.toString().padStart(2, '0')}
      </div>
      <div className="text-sm md:text-base lg:text-lg text-blue-100 font-medium uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
};

function App() {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isRetired, setIsRetired] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Retirement date: May 1st, 2027
  const retirementDate = new Date('2027-05-01T00:00:00');

  useEffect(() => {
    setMounted(true);
    
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const targetTime = retirementDate.getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setIsRetired(true);
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-800 relative overflow-hidden">
      {/* New wave background */}
      <WaveBackground />

      {/* Confetti when retired */}
      {isRetired && <Confetti />}

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 lg:py-16">
        {/* New animated title */}
        <AnimatedTitle />

        {isRetired ? (
          /* Retirement celebration */
          <div className="text-center animate-bounce">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20 max-w-2xl mx-auto mb-8">
              <Sparkles className="w-16 h-16 md:w-24 md:h-24 text-yellow-400 mx-auto mb-6 animate-spin" />
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-yellow-400 mb-4">
                🎉 RETIRED! 🎉
              </h2>
              <p className="text-xl md:text-2xl text-white mb-6">
                Congratulations on your well-deserved retirement!
              </p>
              <p className="text-lg text-blue-100">
                Time to enjoy the next chapter of your life!
              </p>
            </div>
          </div>
        ) : (
          /* Countdown display */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-12 md:mb-16">
            <CountdownCard value={timeRemaining.days} label="Dagen" delay={0} />
            <CountdownCard value={timeRemaining.hours} label="Uren" delay={100} />
            <CountdownCard value={timeRemaining.minutes} label="Minuten" delay={200} />
            <CountdownCard value={timeRemaining.seconds} label="Seconden" delay={300} />
          </div>
        )}

        {/* Retirement photo section */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-2000 group-hover:duration-500 animate-pulse-slow"></div>
            <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-2 md:p-3 lg:p-4 shadow-2xl border border-white/20">
              <img
                src="./padre.png"
                alt="Retirement celebration"
                className="w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 rounded-full object-cover shadow-xl transition-transform duration-700 group-hover:scale-125"
              />
            </div>
          </div>
        </div>

        {/* Celebration message */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Calendar className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
                De grote dag nadert
              </h3>
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <p className="text-base md:text-lg lg:text-xl text-blue-100 leading-relaxed">
              Na jaren lang te hebben gewerkt, is  het bijna tijd om te genieten van je pensioen.
              Dan heb je eindelijk tijd om te breien, te zwemmen, te wandelen, te reizen, te genieten van je kinderen en kleinkinderen, en om naar Australië te gaan.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 md:mt-12">
          <p className="text-sm md:text-base text-blue-200 opacity-75">
            Made with ❤️ 
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;