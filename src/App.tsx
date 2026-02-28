/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, Briefcase, MapPin, Clock, ExternalLink, RefreshCw, Database, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchDataEngineerJobs, Job } from './services/jobService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await fetchDataEngineerJobs();
      setJobs(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Header / Navigation */}
      <header className="border-b border-[#141414] px-6 py-4 flex justify-between items-center sticky top-0 bg-[#E4E3E0]/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6" />
          <h1 className="font-serif italic text-xl tracking-tight">DE Job Scout</h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-[11px] uppercase tracking-widest opacity-50 font-semibold">
            <Filter className="w-3 h-3" />
            <span>2-3 YRS EXP • LAST 24H</span>
          </div>
          <button 
            onClick={loadJobs}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-[#141414] rounded-full hover:bg-[#141414] hover:text-[#E4E3E0] transition-all text-xs font-medium disabled:opacity-50"
          >
            <RefreshCw className={cn("w-3 h-3", loading && "animate-spin")} />
            {loading ? "SCANNING..." : "REFRESH"}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl md:text-8xl font-serif italic leading-[0.9] mb-6"
              >
                Data Engineer <br />
                <span className="not-italic font-sans font-bold uppercase tracking-tighter">Opportunities</span>
              </motion.h2>
              <p className="text-lg opacity-70 max-w-md">
                Aggregated real-time listings for mid-level Data Engineering roles across major professional networks.
              </p>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-[10px] font-mono opacity-40 uppercase mb-1">Last Scan</div>
              <div className="font-mono text-sm">
                {lastUpdated ? lastUpdated.toLocaleTimeString() : "--:--:--"}
              </div>
            </div>
          </div>
        </section>

        {/* Job List Grid */}
        <div className="grid grid-cols-1 gap-px bg-[#141414] border border-[#141414]">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-[#E4E3E0] text-[11px] font-serif italic uppercase opacity-50 tracking-wider">
            <div className="col-span-5">Role & Company</div>
            <div className="col-span-3">Location</div>
            <div className="col-span-2">Experience</div>
            <div className="col-span-2 text-right">Source</div>
          </div>

          <AnimatePresence mode="popLayout">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="grid grid-cols-12 gap-4 p-8 bg-[#E4E3E0] animate-pulse">
                  <div className="col-span-5 h-6 bg-black/5 rounded" />
                  <div className="col-span-3 h-6 bg-black/5 rounded" />
                  <div className="col-span-2 h-6 bg-black/5 rounded" />
                  <div className="col-span-2 h-6 bg-black/5 rounded" />
                </div>
              ))
            ) : jobs.length > 0 ? (
              jobs.map((job, index) => (
                <motion.div
                  key={job.url + index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-12 gap-4 p-6 bg-[#E4E3E0] hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors group cursor-pointer border-b border-[#141414]/10"
                  onClick={() => window.open(job.url, '_blank')}
                >
                  <div className="col-span-5 flex flex-col gap-1">
                    <h3 className="font-bold text-lg leading-tight group-hover:underline decoration-1 underline-offset-4">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm opacity-60">
                      <Briefcase className="w-3 h-3" />
                      <span>{job.company}</span>
                    </div>
                  </div>
                  <div className="col-span-3 flex items-center gap-2 text-sm opacity-70">
                    <MapPin className="w-3 h-3" />
                    <span>{job.location}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 text-sm font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{job.experience}</span>
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-2 text-[10px] font-mono uppercase tracking-widest opacity-50 group-hover:opacity-100">
                    <span>{job.source}</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-20 bg-[#E4E3E0] text-center">
                <p className="font-serif italic text-xl opacity-40">No new roles found in the last 24h scan.</p>
                <button 
                  onClick={loadJobs}
                  className="mt-4 text-sm underline underline-offset-4 hover:opacity-100 opacity-60"
                >
                  Try scanning again
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Info */}
        <footer className="mt-12 pt-8 border-t border-[#141414]/10 flex flex-col md:flex-row justify-between gap-4 text-[10px] font-mono uppercase tracking-widest opacity-40">
          <div>© 2026 DE Job Scout • Real-time Data Engineering Intelligence</div>
          <div className="flex gap-6">
            <span>LinkedIn Grounded</span>
            <span>Naukri Scanned</span>
            <span>Wellfound Verified</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
