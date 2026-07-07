import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiZap, FiMessageCircle, FiBarChart2, FiCheckCircle } from 'react-icons/fi';

const features = [
  { icon: FiZap, title: 'Raise & Track Instantly', desc: 'Submit a complaint in seconds and watch it move through every stage in real time.' },
  { icon: FiMessageCircle, title: 'Direct Agent Chat', desc: 'Talk to the agent assigned to your case without leaving the ticket.' },
  { icon: FiBarChart2, title: 'Live Admin Analytics', desc: 'Category trends, resolution rates, and workload — all on one dashboard.' },
  { icon: FiShield, title: 'Role-Based Access', desc: 'Customers, agents, and admins each see exactly what they need, nothing more.' },
];

const steps = [
  { n: '01', title: 'Raise a complaint', desc: 'Describe the issue, set a priority, attach evidence.' },
  { n: '02', title: 'Get assigned', desc: 'An admin routes it to the right support agent.' },
  { n: '03', title: 'Resolve together', desc: 'Chat, track the timeline, and close it out with feedback.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-secondary-900 text-white">
      {/* Nav */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 font-display font-bold">CR</div>
          <span className="font-display text-lg font-bold">Registry</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 hover:text-white">Log in</Link>
          <Link to="/register" className="btn-primary !px-4 !py-2 text-sm">Get started</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-6 pt-16 pb-24 text-center">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-500/30 via-accent-500/20 to-success-500/20 blur-3xl" />

        <motion.span
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-accent-300"
        >
          <FiCheckCircle size={14} /> Every complaint, tracked end to end
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="relative z-10 mx-auto max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl"
        >
          Customer support that
          <span className="gradient-text"> never loses the thread</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="relative z-10 mx-auto mt-5 max-w-xl text-base text-slate-300 sm:text-lg"
        >
          One registry for every complaint, every conversation, and every agent — from the moment
          it's raised to the moment it's resolved.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="relative z-10 mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="/register" className="btn-primary">
            Create free account <FiArrowRight />
          </Link>
          <Link to="/login" className="btn-secondary !border-white/15 !bg-white/5 !text-white hover:!bg-white/10">
            I already have an account
          </Link>
        </motion.div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl2 border border-white/10 bg-white/5 p-6 backdrop-blur-glass"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500">
                <Icon size={20} />
              </div>
              <h3 className="font-display text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-slate-400">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <h2 className="text-center font-display text-3xl font-bold">How it flows</h2>
        <p className="mx-auto mt-2 max-w-md text-center text-slate-400">
          A complaint's path through the registry is always the same three stops.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map(({ n, title, desc }) => (
            <div key={n} className="relative pl-2">
              <span className="font-display text-4xl font-bold text-white/10">{n}</span>
              <h3 className="mt-2 font-display text-lg font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Customer Registry Management System
      </footer>
    </div>
  );
}
