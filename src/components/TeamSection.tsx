import { Code2, Cpu, Database, FlaskConical, Layout, TestTube2 } from 'lucide-react';

const TEAM = [
  {
    name: 'Sreejith',
    role: 'Project Leader & UI/UX Designer',
    tagline: 'Turning ideas into intelligent experiences.',
    icon: Layout,
    gradient: 'from-lime-300 to-green-400',
    ring: 'ring-lime-300/60',
    glow: 'group-hover:shadow-lime-400/30',
    badge: 'bg-lime-400/20 text-lime-200 border-lime-400/40',
  },
  {
    name: 'Mahavikram',
    role: 'Frontend Developer',
    tagline: 'Designing interfaces that bring ideas to life.',
    icon: Code2,
    gradient: 'from-cyan-400 to-blue-600',
    ring: 'ring-cyan-400/40',
    glow: 'group-hover:shadow-cyan-500/20',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  },
  {
    name: 'Kamaleshwaran',
    role: 'Backend Developer',
    tagline: 'Building the engine behind every innovation.',
    icon: Cpu,
    gradient: 'from-violet-400 to-purple-600',
    ring: 'ring-violet-400/40',
    glow: 'group-hover:shadow-violet-500/20',
    badge: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  },
  {
    name: 'Sarveshvaran',
    role: 'AI & Data Analyst',
    tagline: 'Transforming agricultural data into smarter decisions.',
    icon: FlaskConical,
    gradient: 'from-amber-400 to-orange-600',
    ring: 'ring-amber-400/40',
    glow: 'group-hover:shadow-amber-500/20',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  {
    name: 'Sukant',
    role: 'Database & Integration Engineer',
    tagline: 'Connecting data, technology, and agriculture.',
    icon: Database,
    gradient: 'from-rose-400 to-pink-600',
    ring: 'ring-rose-400/40',
    glow: 'group-hover:shadow-rose-500/20',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  },
  {
    name: 'Thamarai Selvan',
    role: 'Testing & Quality Assurance',
    tagline: 'Every detail tested, every solution trusted.',
    icon: TestTube2,
    gradient: 'from-teal-400 to-green-500',
    ring: 'ring-teal-400/40',
    glow: 'group-hover:shadow-teal-500/20',
    badge: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  },
];

export default function TeamSection() {
  return (
    <section
      id="team"
      className="relative overflow-hidden px-6 py-20"
      style={{
        background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 40%, #0a1e2e 70%, #071a14 100%)',
      }}
    >
      {/* Decorative background blobs */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #176B45, transparent)' }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full opacity-5 blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'radial-gradient(circle, #A3D977, transparent)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-14">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-5">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-300 text-sm font-semibold tracking-wider uppercase">Our Team</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Meet{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #A3D977, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Our Team
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Six talents working together for a smarter agricultural future.
          </p>
        </div>

        {/* Team cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {TEAM.map((member, idx) => {
            const Icon = member.icon;
            return (
              <div
                key={member.name}
                className={`group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm
                  p-7 flex flex-col items-center text-center cursor-default
                  transition-all duration-500 hover:-translate-y-2 hover:border-white/20
                  hover:bg-white/10 shadow-lg ${member.glow} hover:shadow-2xl`}
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {/* Subtle top gradient line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r ${member.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Avatar circle */}
                <div className={`relative mb-5`}>
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center
                      bg-gradient-to-br ${member.gradient} shadow-xl ring-2 ${member.ring}
                      group-hover:scale-110 transition-transform duration-500`}
                  >
                    <Icon className="w-9 h-9 text-white drop-shadow" strokeWidth={1.8} />
                  </div>
                  {/* Glow dot */}
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br ${member.gradient} border-2 border-slate-900`}
                  />
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-white mb-1.5 group-hover:text-white transition-colors">
                  {member.name}
                </h3>

                {/* Role badge */}
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border mb-3 ${member.badge}`}
                >
                  {member.role}
                </span>

                {/* Tagline */}
                <p className="text-slate-400 text-sm leading-relaxed italic group-hover:text-slate-300 transition-colors">
                  "{member.tagline}"
                </p>

                {/* Bottom shimmer on hover */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-t ${member.gradient} opacity-0
                    group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}
                />
              </div>
            );
          })}
        </div>

        {/* Team slogan */}
        <div className="text-center space-y-4">
          {/* Divider */}
          <div className="flex items-center gap-4 max-w-md mx-auto mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
            <span className="text-emerald-400 text-xl">🌿</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
          </div>

          <p
            className="text-xl md:text-2xl font-bold text-white/90 leading-snug max-w-2xl mx-auto"
            style={{
              textShadow: '0 0 40px rgba(163,217,119,0.15)',
            }}
          >
            One Team.{' '}
            <span
              style={{
                background: 'linear-gradient(90deg, #A3D977, #06b6d4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Six Talents.
            </span>{' '}
            One Smarter Future for Agriculture.
          </p>

          <p className="text-slate-500 text-sm mt-4 tracking-wide">
            © 2026 AgroSentinel AI. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}
