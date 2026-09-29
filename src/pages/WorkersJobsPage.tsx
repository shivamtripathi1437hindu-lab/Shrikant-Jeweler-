import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { JobListing, WorkerProfile } from '../types';
import { 
  Hammer, 
  Briefcase, 
  MapPin, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  UserCheck, 
  Plus, 
  X, 
  Search, 
  Filter, 
  Phone, 
  Star,
  Award,
  ChevronRight
} from 'lucide-react';

export const WorkersJobsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { workers, jobs, applications, addJob, applyForJob, updateJobStatus, assignJobWorker, updateApplicationStatus } = useData();
  const { user, isWorkshopStaff, isArtisan } = useAuth();

  const [activeTab, setActiveTab] = useState<'directory' | 'jobs' | 'applications'>('directory');
  const [skillFilter, setSkillFilter] = useState<string>('all');
  const [searchWorker, setSearchWorker] = useState<string>('');

  // Modals
  const [createJobModalOpen, setCreateJobModalOpen] = useState(false);
  const [applyJobModalOpen, setApplyJobModalOpen] = useState<JobListing | null>(null);
  const [contactWorkerModal, setContactWorkerModal] = useState<WorkerProfile | null>(null);

  // New Job Form State
  const [newJobForm, setNewJobForm] = useState({
    title: '',
    jewelleryType: 'Bridal Necklace',
    requiredSkills: ['Goldsmithing', 'Polishing'],
    quantity: 1,
    proposedLabourRate: 200,
    rateType: 'per_gram' as 'per_gram' | 'per_piece' | 'fixed',
    estimatedGoldWeightGrams: 100,
    deadline: '2026-10-30',
    workshopName: user?.workshopName || 'Srikanth Ghorai Atelier Unit',
    workshopLocation: 'Near Anil Apartment, Mulund East, Mumbai',
    description: '',
  });

  // Application Form State
  const [applyForm, setApplyForm] = useState({
    workerName: user?.name || '',
    workerPhone: user?.phone || '',
    skills: user?.skills || ['Goldsmithing'],
    notes: '',
  });
  const [appSubmitted, setAppSubmitted] = useState(false);

  const allSkills = [
    'Goldsmithing',
    'Diamond Setting',
    'Stone Setting',
    'Polishing',
    'Casting',
    'Jewellery Finishing',
    'Jewellery Repair',
    'Custom Jewellery Making',
  ];

  const filteredWorkers = workers.filter(w => {
    const matchesSkill = skillFilter === 'all' || w.skills.includes(skillFilter as any);
    const matchesQuery = 
      w.fullName.toLowerCase().includes(searchWorker.toLowerCase()) ||
      w.serviceLocation.toLowerCase().includes(searchWorker.toLowerCase()) ||
      w.bio.toLowerCase().includes(searchWorker.toLowerCase());
    return matchesSkill && matchesQuery;
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobForm.title) return;

    addJob({
      ...newJobForm,
      estimatedGoldWeightGrams: Number(newJobForm.estimatedGoldWeightGrams),
      quantity: Number(newJobForm.quantity),
      proposedLabourRate: Number(newJobForm.proposedLabourRate),
    });

    setCreateJobModalOpen(false);
    setNewJobForm({
      title: '',
      jewelleryType: 'Bridal Necklace',
      requiredSkills: ['Goldsmithing', 'Polishing'],
      quantity: 1,
      proposedLabourRate: 200,
      rateType: 'per_gram',
      estimatedGoldWeightGrams: 100,
      deadline: '2026-10-30',
      workshopName: user?.workshopName || 'Srikanth Ghorai Atelier Unit',
      workshopLocation: 'Near Anil Apartment, Mulund East, Mumbai',
      description: '',
    });
    setActiveTab('jobs');
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyJobModalOpen || !applyForm.workerName || !applyForm.workerPhone) return;

    applyForJob(
      applyJobModalOpen.id,
      applyForm.workerName,
      applyForm.workerPhone,
      applyForm.skills,
      applyForm.notes
    );

    setAppSubmitted(true);
    setTimeout(() => {
      setAppSubmitted(false);
      setApplyJobModalOpen(null);
    }, 2000);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#2A261C] pb-6">
        <div>
          <div className="text-xs text-[#D4AF37] font-semibold tracking-widest uppercase mb-1">
            GUILD LABOUR &amp; ATELIER TALENT
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#FFFFFF]">
            {t('artisanGuild')}
          </h1>
          <p className="text-xs sm:text-sm text-[#B8B8B8] mt-1">
            Empowering traditional goldsmiths with transparent commissions and steady atelier projects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCreateJobModalOpen(true)}
            className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#F5E6B5] text-[#070707] text-xs font-semibold rounded transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('createJobListing')}</span>
          </button>
        </div>
      </div>

      {/* Segmented Control / Tabs */}
      <div className="flex items-center gap-2 border-b border-[#222] pb-3">
        <button
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'directory'
              ? 'bg-[#D4AF37] text-[#070707]'
              : 'text-[#B8B8B8] hover:text-[#FFFFFF] bg-[#141414]'
          }`}
        >
          {t('artisanDirectory')} ({workers.length})
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'jobs'
              ? 'bg-[#D4AF37] text-[#070707]'
              : 'text-[#B8B8B8] hover:text-[#FFFFFF] bg-[#141414]'
          }`}
        >
          {t('activeJobs')} ({jobs.length})
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeTab === 'applications'
              ? 'bg-[#D4AF37] text-[#070707]'
              : 'text-[#B8B8B8] hover:text-[#FFFFFF] bg-[#141414]'
          }`}
        >
          Applications Log ({applications.length})
        </button>
      </div>

      {/* ================= TAB 1: ARTISAN DIRECTORY ================= */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
              <button
                onClick={() => setSkillFilter('all')}
                className={`px-3 py-1.5 text-xs rounded transition-all shrink-0 ${
                  skillFilter === 'all'
                    ? 'bg-[#D4AF37] text-[#070707] font-semibold'
                    : 'bg-[#141414] text-[#8E8B82] hover:text-[#FFFFFF] border border-[#222]'
                }`}
              >
                All Specialisations
              </button>
              {allSkills.slice(0, 5).map((skill) => (
                <button
                  key={skill}
                  onClick={() => setSkillFilter(skill)}
                  className={`px-3 py-1.5 text-xs rounded transition-all shrink-0 ${
                    skillFilter === skill
                      ? 'bg-[#D4AF37] text-[#070707] font-semibold'
                      : 'bg-[#141414] text-[#8E8B82] hover:text-[#FFFFFF] border border-[#222]'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8B82]" />
              <input
                type="text"
                placeholder="Search karigar by name, city..."
                value={searchWorker}
                onChange={(e) => setSearchWorker(e.target.value)}
                className="w-full bg-[#121212] border border-[#2A261C] rounded-lg pl-9 pr-4 py-2 text-xs text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          {/* Karigar Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => (
              <div
                key={worker.id}
                className="bg-[#121212] rounded-xl border border-[#2A261C] p-6 space-y-4 hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Avatar & Header */}
                  <div className="flex items-center gap-4">
                    <img
                      src={worker.profilePhoto}
                      alt={worker.fullName}
                      className="w-14 h-14 rounded-full object-cover border border-[#D4AF37]/40 shrink-0"
                    />
                    <div>
                      <h3 className="font-serif-luxury text-xl text-[#F5E6B5]">
                        {worker.fullName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] mt-0.5">
                        <span className={`w-2 h-2 rounded-full ${worker.availability === 'Available' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        <span className={worker.availability === 'Available' ? 'text-emerald-400' : 'text-amber-400'}>
                          {worker.availability}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[#D4AF37] mt-1">
                        <Star className="w-3 h-3 fill-[#D4AF37]" />
                        <span>{worker.rating.toFixed(1)} rating</span>
                        <span className="text-[#8E8B82]">({worker.completedJobsCount} jobs completed)</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#B8B8B8] leading-relaxed line-clamp-3">
                    {worker.bio}
                  </p>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {worker.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] bg-[#1C1A14] text-[#D5C692] border border-[#332E22] px-2 py-0.5 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Specs row */}
                  <div className="bg-[#161616] p-3 rounded text-xs space-y-1 border border-[#222]">
                    <div className="flex justify-between text-[#8E8B82]">
                      <span>Experience:</span>
                      <strong className="text-[#E5E2E1]">{worker.experienceYears} Years Master Craft</strong>
                    </div>
                    <div className="flex justify-between text-[#8E8B82]">
                      <span>Hub / Location:</span>
                      <strong className="text-[#E5E2E1]">{worker.serviceLocation}</strong>
                    </div>
                    {worker.dailyRate && (
                      <div className="flex justify-between text-[#8E8B82]">
                        <span>Standard Rate:</span>
                        <strong className="text-[#F5E6B5]">₹{worker.dailyRate} / day</strong>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setContactWorkerModal(worker)}
                  className="w-full py-2.5 bg-[#181818] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#070707] border border-[#D4AF37]/50 rounded text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t('contactWorker')}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: ACTIVE JOB OPENINGS ================= */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-[#121212] rounded-xl border border-[#2A261C] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-[#D4AF37]/40 transition-all"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-serif-luxury text-xl text-[#F5E6B5]">
                    {job.title}
                  </h3>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded font-semibold ${
                    job.status === 'Open'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : job.status === 'In Progress'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {job.status}
                  </span>
                </div>

                <p className="text-xs text-[#B8B8B8] leading-relaxed">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-4 text-xs text-[#8E8B82] pt-2">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Type: <strong>{job.jewelleryType}</strong></span>
                  </span>

                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Location: <strong>{job.workshopLocation}</strong></span>
                  </span>

                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Deadline: <strong>{job.deadline}</strong></span>
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs pt-1">
                  <div className="text-[#F5E6B5]">
                    Proposed Rate: <strong className="font-cinzel text-sm text-[#D4AF37]">
                      ₹{job.proposedLabourRate}
                    </strong> {job.rateType === 'per_gram' ? '/ gram' : job.rateType === 'per_piece' ? '/ piece' : 'fixed charge'}
                  </div>
                  {job.estimatedGoldWeightGrams && (
                    <div className="text-[#8E8B82]">
                      Batch Metal Weight: <strong>{job.estimatedGoldWeightGrams}g Gold</strong>
                    </div>
                  )}
                </div>

                {job.assignedWorkerName && (
                  <div className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 px-3 py-1 rounded inline-block">
                    Assigned Karigar: <strong>{job.assignedWorkerName}</strong> ({job.progressPercent}% Completed)
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 w-full md:w-auto shrink-0">
                {job.status === 'Open' ? (
                  <button
                    onClick={() => setApplyJobModalOpen(job)}
                    className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#F5E6B5] text-[#070707] text-xs font-semibold rounded transition-all cursor-pointer"
                  >
                    {t('applyNow')}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (job.progressPercent < 100) {
                        updateJobStatus(job.id, 'In Progress', Math.min(100, job.progressPercent + 20));
                      } else {
                        updateJobStatus(job.id, 'Completed', 100);
                      }
                    }}
                    className="px-5 py-2.5 bg-[#1C1A14] hover:bg-[#2A261C] border border-[#D4AF37]/40 text-[#F5E6B5] text-xs font-semibold rounded transition-all"
                  >
                    Update Progress (+20%)
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= TAB 3: APPLICATIONS LOG ================= */}
      {activeTab === 'applications' && (
        <div className="bg-[#121212] rounded-xl border border-[#2A261C] overflow-hidden">
          <div className="p-4 border-b border-[#222] flex justify-between items-center">
            <h3 className="text-sm font-semibold text-[#F5E6B5]">Karigar Applications Ledger</h3>
            <span className="text-xs text-[#8E8B82]">{applications.length} submitted</span>
          </div>

          {applications.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#8E8B82]">
              No active job applications pending review.
            </div>
          ) : (
            <div className="divide-y divide-[#222] text-xs">
              {applications.map((app) => (
                <div key={app.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="font-semibold text-sm text-[#F5E6B5]">{app.workerName}</div>
                    <div className="text-[#8E8B82]">
                      Applied for: <strong className="text-[#E5E2E1]">{app.jobTitle}</strong> · Phone: {app.workerPhone}
                    </div>
                    <div className="flex gap-2 text-[10px] text-[#D5C692]">
                      Skills: {app.workerSkills.join(', ')}
                    </div>
                    {app.notes && <div className="text-[11px] text-[#B8B8B8] italic">"{app.notes}"</div>}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                      app.status === 'Accepted'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : app.status === 'Shortlisted'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {app.status}
                    </span>

                    <button
                      onClick={() => {
                        updateApplicationStatus(app.id, 'Shortlisted');
                      }}
                      className="px-3 py-1 bg-[#1C1A14] text-[#D4AF37] border border-[#332E22] rounded hover:border-[#D4AF37]"
                    >
                      Shortlist
                    </button>

                    <button
                      onClick={() => {
                        updateApplicationStatus(app.id, 'Accepted');
                        assignJobWorker(app.jobId, app.workerId, app.workerName);
                      }}
                      className="px-3 py-1 bg-[#D4AF37] text-[#070707] font-semibold rounded hover:bg-[#F5E6B5]"
                    >
                      Assign Job
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL: CREATE JOB ================= */}
      {createJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#D4AF37]/40 rounded-xl max-w-xl w-full p-6 md:p-8 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setCreateJobModalOpen(false)}
              className="absolute top-4 right-4 text-[#8E8B82] hover:text-[#FFFFFF] p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif-luxury text-2xl text-[#FFFFFF] mb-1">
              Create Atelier Job Listing
            </h3>
            <p className="text-xs text-[#B8B8B8] mb-5">
              Specify jewellery specifications, metal weights, and proposed labour rates for master artisans.
            </p>

            <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8E8B82] mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={newJobForm.title}
                  onChange={(e) => setNewJobForm({ ...newJobForm, title: e.target.value })}
                  placeholder="e.g. Master Polisher for 22K Kundan Choker"
                  className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8E8B82] mb-1">Jewellery Category</label>
                  <select
                    value={newJobForm.jewelleryType}
                    onChange={(e) => setNewJobForm({ ...newJobForm, jewelleryType: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option>Bridal Choker Suite</option>
                    <option>Diamond Solitaire Ring</option>
                    <option>Traditional Nakshi Bangle</option>
                    <option>Jhumka Earrings</option>
                    <option>Silver Utensil Engraving</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8E8B82] mb-1">Batch Gold Weight (Grams)</label>
                  <input
                    type="number"
                    min="1"
                    value={newJobForm.estimatedGoldWeightGrams}
                    onChange={(e) => setNewJobForm({ ...newJobForm, estimatedGoldWeightGrams: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8E8B82] mb-1">Rate Billing Structure</label>
                  <select
                    value={newJobForm.rateType}
                    onChange={(e) => setNewJobForm({ ...newJobForm, rateType: e.target.value as any })}
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="per_gram">Labour Per Gram (₹/g)</option>
                    <option value="per_piece">Labour Per Piece (₹/pc)</option>
                    <option value="fixed">Fixed Contract Charge (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8E8B82] mb-1">Proposed Labour Rate (₹)</label>
                  <input
                    type="number"
                    min="10"
                    value={newJobForm.proposedLabourRate}
                    onChange={(e) => setNewJobForm({ ...newJobForm, proposedLabourRate: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8E8B82] mb-1">Quantity of Units</label>
                  <input
                    type="number"
                    min="1"
                    value={newJobForm.quantity}
                    onChange={(e) => setNewJobForm({ ...newJobForm, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#8E8B82] mb-1">Delivery Deadline</label>
                  <input
                    type="date"
                    value={newJobForm.deadline}
                    onChange={(e) => setNewJobForm({ ...newJobForm, deadline: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8E8B82] mb-1">Workshop Name &amp; Address</label>
                <input
                  type="text"
                  value={newJobForm.workshopLocation}
                  onChange={(e) => setNewJobForm({ ...newJobForm, workshopLocation: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#8E8B82] mb-1">Work Description &amp; Precision Standards</label>
                <textarea
                  rows={3}
                  value={newJobForm.description}
                  onChange={(e) => setNewJobForm({ ...newJobForm, description: e.target.value })}
                  placeholder="Explain stone setting method, polishing grade, and allowed weight tolerance..."
                  className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#D4AF37] hover:bg-[#F5E6B5] text-[#070707] font-semibold rounded text-xs transition-all cursor-pointer"
              >
                Publish Job to Artisan Guild
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: APPLY TO JOB ================= */}
      {applyJobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#D4AF37]/40 rounded-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setApplyJobModalOpen(null)}
              className="absolute top-4 right-4 text-[#8E8B82] hover:text-[#FFFFFF] p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif-luxury text-xl text-[#FFFFFF] mb-1">
              Apply for Job
            </h3>
            <p className="text-xs text-[#D4AF37] mb-4">
              {applyJobModalOpen.title}
            </p>

            {appSubmitted ? (
              <div className="bg-emerald-950/40 border border-emerald-800/40 p-4 rounded text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Application submitted to workshop owner successfully!</span>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#8E8B82] mb-1">Artisan Full Name *</label>
                  <input
                    type="text"
                    required
                    value={applyForm.workerName}
                    onChange={(e) => setApplyForm({ ...applyForm, workerName: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#8E8B82] mb-1">Phone Number / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={applyForm.workerPhone}
                    onChange={(e) => setApplyForm({ ...applyForm, workerPhone: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#8E8B82] mb-1">Notes on Experience with this Jewellery</label>
                  <textarea
                    rows={3}
                    value={applyForm.notes}
                    onChange={(e) => setApplyForm({ ...applyForm, notes: e.target.value })}
                    placeholder="e.g. 15 years experience in microscopic pavé setting on 18K white gold..."
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#F5E6B5] text-[#070707] font-semibold rounded transition-all cursor-pointer"
                >
                  Submit Karigar Application
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: CONTACT WORKER ================= */}
      {contactWorkerModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#D4AF37]/40 rounded-xl max-w-md w-full p-6 relative space-y-4">
            <button
              onClick={() => setContactWorkerModal(null)}
              className="absolute top-4 right-4 text-[#8E8B82] hover:text-[#FFFFFF] p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <img
                src={contactWorkerModal.profilePhoto}
                alt={contactWorkerModal.fullName}
                className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]"
              />
              <div>
                <h4 className="font-serif-luxury text-lg text-[#F5E6B5]">{contactWorkerModal.fullName}</h4>
                <p className="text-xs text-[#8E8B82]">{contactWorkerModal.skills.join(', ')}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs bg-[#181818] p-3 rounded border border-[#222]">
              <div className="flex justify-between">
                <span className="text-[#8E8B82]">Direct Phone:</span>
                <a href={`tel:${contactWorkerModal.phone}`} className="text-[#F5E6B5] font-semibold hover:underline">
                  +91 {contactWorkerModal.phone}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8B82]">Service Area:</span>
                <span className="text-[#E5E2E1]">{contactWorkerModal.serviceLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8B82]">Guild Rating:</span>
                <span className="text-[#D4AF37] font-semibold">{contactWorkerModal.rating} / 5.0</span>
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href={`tel:${contactWorkerModal.phone}`}
                className="flex-1 py-2.5 bg-[#D4AF37] text-[#070707] font-semibold text-center rounded text-xs hover:bg-[#F5E6B5]"
              >
                Call Artisan Direct
              </a>
              <a
                href={`https://wa.me/91${contactWorkerModal.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 bg-emerald-600 text-white font-semibold text-center rounded text-xs hover:bg-emerald-500"
              >
                WhatsApp Message
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
