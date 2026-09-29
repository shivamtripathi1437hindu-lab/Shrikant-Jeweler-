import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { GoldLedgerEntry, LabourPayment } from '../types';
import { 
  Scale, 
  DollarSign, 
  Plus, 
  Printer, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Search, 
  FileText, 
  Layers,
  X,
  CreditCard,
  Building2,
  Calendar
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { goldLedger, labourPayments, addGoldTransaction, addLabourEntry, recordLabourPayment, settings } = useData();
  const { user, isWorkshopStaff } = useAuth();

  const [activeLedgerTab, setActiveLedgerTab] = useState<'gold' | 'labour'>('gold');

  // Search & Filter
  const [filterQuery, setFilterQuery] = useState('');
  const [discrepancyFilter, setDiscrepancyFilter] = useState<'all' | 'Balanced' | 'Human Review Required'>('all');

  // Modals
  const [goldModalOpen, setGoldModalOpen] = useState(false);
  const [labourModalOpen, setLabourModalOpen] = useState(false);
  const [paymentDisburseModal, setPaymentDisburseModal] = useState<LabourPayment | null>(null);
  const [receiptModal, setReceiptModal] = useState<LabourPayment | null>(null);

  // New Gold Entry State
  const [goldForm, setGoldForm] = useState({
    jobId: 'job-101',
    orderReference: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
    workerName: 'Subrata Ghorai',
    materialType: 'Yellow Gold' as GoldLedgerEntry['materialType'],
    purity: '22K' as GoldLedgerEntry['purity'],
    goldIssuedGrams: 100.0,
    finishedGoldReturnedGrams: 98.2,
    stoneWeightGrams: 0.0,
    scrapReturnedGrams: 1.1,
    recordedWasteGrams: 0.7,
    adjustmentsGrams: 0.0,
    notes: 'Initial weight dispatch for wedding set links.',
  });

  // New Labour Entry State
  const [labourForm, setLabourForm] = useState({
    jobId: 'job-101',
    workerName: 'Subrata Ghorai',
    workerPhone: '9830012345',
    orderReference: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
    rateType: 'per_gram' as LabourPayment['rateType'],
    ratePerUnit: 180,
    quantityOrWeight: 98.2,
    approvedAdjustments: 0,
    advancePaid: 5000,
    notes: 'Advance paid at job commencement.',
  });

  const [disburseAmount, setDisburseAmount] = useState<number>(0);

  // Filtered Gold Ledger
  const filteredGold = goldLedger.filter(item => {
    const matchesSearch = 
      item.workerName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.orderReference.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.jobId.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesDiscrepancy = 
      discrepancyFilter === 'all' || item.discrepancyStatus === discrepancyFilter;
    return matchesSearch && matchesDiscrepancy;
  });

  // Filtered Labour Ledger
  const filteredLabour = labourPayments.filter(item => {
    return (
      item.workerName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.orderReference.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.jobId.toLowerCase().includes(filterQuery.toLowerCase())
    );
  });

  // Totals for metrics
  const totalGoldIssued = goldLedger.reduce((sum, item) => sum + item.goldIssuedGrams, 0).toFixed(3);
  const totalGoldReturned = goldLedger.reduce((sum, item) => sum + item.finishedGoldReturnedGrams, 0).toFixed(3);
  const totalScrapReturned = goldLedger.reduce((sum, item) => sum + item.scrapReturnedGrams, 0).toFixed(3);
  const totalWasteRecorded = goldLedger.reduce((sum, item) => sum + item.recordedWasteGrams, 0).toFixed(3);

  const totalLabourGross = labourPayments.reduce((sum, item) => sum + item.grossLabourAmount, 0);
  const totalLabourPaid = labourPayments.reduce((sum, item) => sum + item.totalPaid, 0);
  const totalLabourRemaining = labourPayments.reduce((sum, item) => sum + item.remainingBalance, 0);

  const handleCreateGold = (e: React.FormEvent) => {
    e.preventDefault();
    addGoldTransaction({
      ...goldForm,
      goldIssuedGrams: Number(goldForm.goldIssuedGrams),
      finishedGoldReturnedGrams: Number(goldForm.finishedGoldReturnedGrams),
      stoneWeightGrams: Number(goldForm.stoneWeightGrams),
      scrapReturnedGrams: Number(goldForm.scrapReturnedGrams),
      recordedWasteGrams: Number(goldForm.recordedWasteGrams),
      adjustmentsGrams: Number(goldForm.adjustmentsGrams),
    });
    setGoldModalOpen(false);
  };

  const handleCreateLabour = (e: React.FormEvent) => {
    e.preventDefault();
    addLabourEntry({
      ...labourForm,
      ratePerUnit: Number(labourForm.ratePerUnit),
      quantityOrWeight: Number(labourForm.quantityOrWeight),
      approvedAdjustments: Number(labourForm.approvedAdjustments),
      advancePaid: Number(labourForm.advancePaid),
    });
    setLabourModalOpen(false);
  };

  const handleDisbursePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentDisburseModal || disburseAmount <= 0) return;
    recordLabourPayment(paymentDisburseModal.id, disburseAmount);
    setPaymentDisburseModal(null);
    setDisburseAmount(0);
  };

  const exportGoldCSV = () => {
    const headers = 'Job ID,Order Ref,Worker Name,Purity,Issued (g),Finished (g),Scrap (g),Waste (g),Net Balance (g),Status,Date\n';
    const rows = goldLedger.map(i => 
      `"${i.jobId}","${i.orderReference}","${i.workerName}","${i.purity}",${i.goldIssuedGrams},${i.finishedGoldReturnedGrams},${i.scrapReturnedGrams},${i.recordedWasteGrams},${i.netRemainingBalanceGrams},"${i.discrepancyStatus}","${i.transactionDate}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `srikanth-ghorai-gold-ledger-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const exportLabourCSV = () => {
    const headers = 'Job ID,Order Ref,Worker Name,Rate Type,Rate,Qty,Gross,Advance,Total Paid,Remaining,Status,Date\n';
    const rows = labourPayments.map(i => 
      `"${i.jobId}","${i.orderReference}","${i.workerName}","${i.rateType}",${i.ratePerUnit},${i.quantityOrWeight},${i.grossLabourAmount},${i.advancePaid},${i.totalPaid},${i.remainingBalance},"${i.paymentStatus}","${i.paymentDate}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `srikanth-ghorai-labour-ledger-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Top Header & Export Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#2A261C] pb-6">
        <div>
          <div className="text-xs text-[#D4AF37] font-semibold tracking-widest uppercase mb-1">
            WORKSHOP OPERATING SYSTEM
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#FFFFFF]">
            {t('workshopDashboard')}
          </h1>
          <p className="text-xs sm:text-sm text-[#B8B8B8] mt-1">
            Zero-variance bullion accounting, discrepancy audits, and karigar labour ledgers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-[#181818] hover:bg-[#252525] border border-[#332E22] text-[#E5E2E1] rounded text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{t('printLedger')}</span>
          </button>

          <button
            onClick={activeLedgerTab === 'gold' ? exportGoldCSV : exportLabourCSV}
            className="px-3.5 py-2 bg-[#181818] hover:bg-[#252525] border border-[#332E22] text-[#E5E2E1] rounded text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{t('exportCsv')}</span>
          </button>

          {activeLedgerTab === 'gold' ? (
            <button
              onClick={() => setGoldModalOpen(true)}
              className="px-4 py-2 bg-[#D4AF37] hover:bg-[#F5E6B5] text-[#070707] rounded text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('addTransaction')}</span>
            </button>
          ) : (
            <button
              onClick={() => setLabourModalOpen(true)}
              className="px-4 py-2 bg-[#D4AF37] hover:bg-[#F5E6B5] text-[#070707] rounded text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Labour Entry</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Tab Switcher */}
      <div className="flex border-b border-[#222]">
        <button
          onClick={() => setActiveLedgerTab('gold')}
          className={`px-6 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeLedgerTab === 'gold'
              ? 'border-[#D4AF37] text-[#D4AF37]'
              : 'border-transparent text-[#8E8B82] hover:text-[#FFFFFF]'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>{t('goldLedgerTitle')}</span>
        </button>

        <button
          onClick={() => setActiveLedgerTab('labour')}
          className={`px-6 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeLedgerTab === 'labour'
              ? 'border-[#D4AF37] text-[#D4AF37]'
              : 'border-transparent text-[#8E8B82] hover:text-[#FFFFFF]'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>{t('labourLedgerTitle')}</span>
        </button>
      </div>

      {/* ================= TAB 1: GOLD WEIGHT MANAGEMENT ================= */}
      {activeLedgerTab === 'gold' && (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#121212] p-4 rounded-xl border border-[#2A261C]">
              <span className="text-[11px] text-[#8E8B82] block">{t('goldIssued')}</span>
              <span className="font-cinzel text-xl font-bold text-[#F5E6B5] mt-1 block">
                {totalGoldIssued} g
              </span>
              <span className="text-[10px] text-[#8E8B82]">Documented Vault Out</span>
            </div>

            <div className="bg-[#121212] p-4 rounded-xl border border-[#2A261C]">
              <span className="text-[11px] text-[#8E8B82] block">{t('goldReturned')}</span>
              <span className="font-cinzel text-xl font-bold text-[#F5E6B5] mt-1 block">
                {totalGoldReturned} g
              </span>
              <span className="text-[10px] text-emerald-400">Finished Jewellery Wt</span>
            </div>

            <div className="bg-[#121212] p-4 rounded-xl border border-[#2A261C]">
              <span className="text-[11px] text-[#8E8B82] block">{t('scrapRecovered')}</span>
              <span className="font-cinzel text-xl font-bold text-[#F5E6B5] mt-1 block">
                {totalScrapReturned} g
              </span>
              <span className="text-[10px] text-[#D5C692]">Vacuum &amp; Sweep Scrap</span>
            </div>

            <div className="bg-[#121212] p-4 rounded-xl border border-[#2A261C]">
              <span className="text-[11px] text-[#8E8B82] block">Recorded Waste / Buffing</span>
              <span className="font-cinzel text-xl font-bold text-[#F5E6B5] mt-1 block">
                {totalWasteRecorded} g
              </span>
              <span className="text-[10px] text-[#8E8B82]">Allowable Guild Loss</span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDiscrepancyFilter('all')}
                className={`px-3 py-1.5 text-xs rounded transition-all ${
                  discrepancyFilter === 'all'
                    ? 'bg-[#D4AF37] text-[#070707] font-semibold'
                    : 'bg-[#141414] text-[#8E8B82] border border-[#222]'
                }`}
              >
                All Records
              </button>
              <button
                onClick={() => setDiscrepancyFilter('Balanced')}
                className={`px-3 py-1.5 text-xs rounded transition-all ${
                  discrepancyFilter === 'Balanced'
                    ? 'bg-[#D4AF37] text-[#070707] font-semibold'
                    : 'bg-[#141414] text-[#8E8B82] border border-[#222]'
                }`}
              >
                Balanced Only
              </button>
              <button
                onClick={() => setDiscrepancyFilter('Human Review Required')}
                className={`px-3 py-1.5 text-xs rounded transition-all ${
                  discrepancyFilter === 'Human Review Required'
                    ? 'bg-[#D4AF37] text-[#070707] font-semibold'
                    : 'bg-[#141414] text-[#8E8B82] border border-[#222]'
                }`}
              >
                Flagged for Review
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8B82]" />
              <input
                type="text"
                placeholder="Filter by Karigar or Order Ref..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full bg-[#121212] border border-[#2A261C] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#121212] rounded-xl border border-[#2A261C] overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-[#181818] text-[#8E8B82] uppercase tracking-wider text-[10px] border-b border-[#222]">
                <tr>
                  <th className="p-3.5">Order / Job Ref</th>
                  <th className="p-3.5">Karigar</th>
                  <th className="p-3.5">Metal &amp; Purity</th>
                  <th className="p-3.5 text-right">Issued (g)</th>
                  <th className="p-3.5 text-right">Finished (g)</th>
                  <th className="p-3.5 text-right">Scrap (g)</th>
                  <th className="p-3.5 text-right">Waste (g)</th>
                  <th className="p-3.5 text-right font-bold text-[#F5E6B5]">Net Balance (g)</th>
                  <th className="p-3.5">Audit Status</th>
                  <th className="p-3.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#201F1F] text-[#E5E2E1]">
                {filteredGold.map((item) => (
                  <tr key={item.id} className="hover:bg-[#181818]/60 transition-colors">
                    <td className="p-3.5 font-semibold text-[#F5E6B5]">
                      {item.orderReference}
                      <span className="text-[10px] text-[#8E8B82] block">{item.jobId}</span>
                    </td>
                    <td className="p-3.5">{item.workerName}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-[#1C1A14] text-[#D5C692] border border-[#332E22] text-[10px]">
                        {item.materialType} ({item.purity})
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono">{item.goldIssuedGrams.toFixed(2)}</td>
                    <td className="p-3.5 text-right font-mono text-emerald-400">{item.finishedGoldReturnedGrams.toFixed(2)}</td>
                    <td className="p-3.5 text-right font-mono text-amber-300">{item.scrapReturnedGrams.toFixed(2)}</td>
                    <td className="p-3.5 text-right font-mono text-[#8E8B82]">{item.recordedWasteGrams.toFixed(2)}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-[#D4AF37]">
                      {item.netRemainingBalanceGrams.toFixed(2)}
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                        item.discrepancyStatus === 'Balanced'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : item.discrepancyStatus === 'Acceptable Loss'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {item.discrepancyStatus === 'Balanced' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : item.discrepancyStatus === 'Acceptable Loss' ? (
                          <Clock className="w-3 h-3" />
                        ) : (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        <span>{item.discrepancyStatus}</span>
                      </span>
                    </td>
                    <td className="p-3.5 text-[#8E8B82]">{item.transactionDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: LABOUR AND PAYMENT MANAGEMENT ================= */}
      {activeLedgerTab === 'labour' && (
        <div className="space-y-6">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#121212] p-4 rounded-xl border border-[#2A261C]">
              <span className="text-[11px] text-[#8E8B82] block">Total Gross Labour Charges</span>
              <span className="font-cinzel text-xl font-bold text-[#F5E6B5] mt-1 block">
                ₹{totalLabourGross.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-[#8E8B82]">All active job contracts</span>
            </div>

            <div className="bg-[#121212] p-4 rounded-xl border border-[#2A261C]">
              <span className="text-[11px] text-[#8E8B82] block">Total Disbursed (Advance + Addl)</span>
              <span className="font-cinzel text-xl font-bold text-emerald-400 mt-1 block">
                ₹{totalLabourPaid.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-emerald-400">Paid to Karigars</span>
            </div>

            <div className="bg-[#121212] p-4 rounded-xl border border-[#2A261C]">
              <span className="text-[11px] text-[#8E8B82] block">Outstanding Payout Balance</span>
              <span className="font-cinzel text-xl font-bold text-amber-400 mt-1 block">
                ₹{totalLabourRemaining.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-amber-300">Pending final delivery &amp; assay</span>
            </div>
          </div>

          {/* Labour Entries Table */}
          <div className="bg-[#121212] rounded-xl border border-[#2A261C] overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-[#181818] text-[#8E8B82] uppercase tracking-wider text-[10px] border-b border-[#222]">
                <tr>
                  <th className="p-3.5">Order Ref</th>
                  <th className="p-3.5">Karigar &amp; Phone</th>
                  <th className="p-3.5">Rate Structure</th>
                  <th className="p-3.5 text-right">Gross Amount</th>
                  <th className="p-3.5 text-right">Advance Paid</th>
                  <th className="p-3.5 text-right">Total Disbursed</th>
                  <th className="p-3.5 text-right font-bold text-[#D4AF37]">Balance Due</th>
                  <th className="p-3.5">Payment Status</th>
                  <th className="p-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#201F1F] text-[#E5E2E1]">
                {filteredLabour.map((item) => (
                  <tr key={item.id} className="hover:bg-[#181818]/60 transition-colors">
                    <td className="p-3.5 font-semibold text-[#F5E6B5]">
                      {item.orderReference}
                      <span className="text-[10px] text-[#8E8B82] block">{item.jobId}</span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold">{item.workerName}</div>
                      <div className="text-[10px] text-[#8E8B82]">{item.workerPhone}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="capitalize">{item.rateType.replace('_', ' ')}</span>
                      <span className="text-[10px] text-[#D5C692] block">
                        ₹{item.ratePerUnit} × {item.quantityOrWeight}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-semibold">
                      ₹{item.grossLabourAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-right text-[#8E8B82]">
                      ₹{item.advancePaid.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-right font-semibold text-emerald-400">
                      ₹{item.totalPaid.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-right font-bold text-[#D4AF37]">
                      ₹{item.remainingBalance.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        item.paymentStatus === 'Paid'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : item.paymentStatus === 'Partially Paid'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {item.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {item.remainingBalance > 0 && (
                          <button
                            onClick={() => {
                              setPaymentDisburseModal(item);
                              setDisburseAmount(item.remainingBalance);
                            }}
                            className="px-2.5 py-1 bg-[#1C1A14] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#070707] border border-[#D4AF37]/50 rounded text-[10px] font-semibold transition-all cursor-pointer"
                          >
                            Add Payout
                          </button>
                        )}
                        <button
                          onClick={() => setReceiptModal(item)}
                          className="px-2.5 py-1 bg-[#181818] hover:bg-[#252525] border border-[#333] text-[#B8B8B8] hover:text-[#FFF] rounded text-[10px] transition-all cursor-pointer flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3 text-[#D4AF37]" />
                          <span>Receipt</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD GOLD TRANSACTION ================= */}
      {goldModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#D4AF37]/40 rounded-xl max-w-xl w-full p-6 md:p-8 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setGoldModalOpen(false)}
              className="absolute top-4 right-4 text-[#8E8B82] hover:text-[#FFFFFF] p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif-luxury text-2xl text-[#FFFFFF] mb-1">
              Record Gold Material Transaction
            </h3>
            <p className="text-xs text-[#B8B8B8] mb-5">
              Enter weight assay specifications. Balance and acceptable loss are verified automatically.
            </p>

            <form onSubmit={handleCreateGold} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8E8B82] mb-1">Order Reference *</label>
                  <input
                    type="text"
                    required
                    value={goldForm.orderReference}
                    onChange={(e) => setGoldForm({ ...goldForm, orderReference: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#8E8B82] mb-1">Assigned Karigar *</label>
                  <input
                    type="text"
                    required
                    value={goldForm.workerName}
                    onChange={(e) => setGoldForm({ ...goldForm, workerName: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8E8B82] mb-1">Material Metal</label>
                  <select
                    value={goldForm.materialType}
                    onChange={(e) => setGoldForm({ ...goldForm, materialType: e.target.value as any })}
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="Yellow Gold">Yellow Gold</option>
                    <option value="White Gold">White Gold</option>
                    <option value="Rose Gold">Rose Gold</option>
                    <option value="Fine Silver">Fine Silver</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8E8B82] mb-1">Purity Grade</label>
                  <select
                    value={goldForm.purity}
                    onChange={(e) => setGoldForm({ ...goldForm, purity: e.target.value as any })}
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="24K">24K (999 Pure)</option>
                    <option value="22K">22K (916 Hallmark)</option>
                    <option value="18K">18K (750 Diamond Wt)</option>
                    <option value="14K">14K (585)</option>
                    <option value="925 Silver">925 Sterling Silver</option>
                  </select>
                </div>
              </div>

              {/* Weight Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#181818] p-3.5 rounded-lg border border-[#2A261C]">
                <div>
                  <label className="block text-[#D4AF37] font-semibold mb-1">Gold Issued (g) *</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={goldForm.goldIssuedGrams}
                    onChange={(e) => setGoldForm({ ...goldForm, goldIssuedGrams: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#0E0E0E] border border-[#332E22] rounded px-2.5 py-1.5 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-emerald-400 font-semibold mb-1">Finished Returned (g) *</label>
                  <input
                    type="number"
                    step="0.001"
                    required
                    value={goldForm.finishedGoldReturnedGrams}
                    onChange={(e) => setGoldForm({ ...goldForm, finishedGoldReturnedGrams: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#0E0E0E] border border-[#332E22] rounded px-2.5 py-1.5 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-amber-300 font-semibold mb-1">Scrap Returned (g)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={goldForm.scrapReturnedGrams}
                    onChange={(e) => setGoldForm({ ...goldForm, scrapReturnedGrams: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#0E0E0E] border border-[#332E22] rounded px-2.5 py-1.5 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#8E8B82] mb-1">Buffing/Loss Waste (g)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={goldForm.recordedWasteGrams}
                    onChange={(e) => setGoldForm({ ...goldForm, recordedWasteGrams: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#0E0E0E] border border-[#332E22] rounded px-2.5 py-1.5 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#8E8B82] mb-1">Stone Wt (g)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={goldForm.stoneWeightGrams}
                    onChange={(e) => setGoldForm({ ...goldForm, stoneWeightGrams: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#0E0E0E] border border-[#332E22] rounded px-2.5 py-1.5 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#8E8B82] mb-1">Adjustments (g)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={goldForm.adjustmentsGrams}
                    onChange={(e) => setGoldForm({ ...goldForm, adjustmentsGrams: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#0E0E0E] border border-[#332E22] rounded px-2.5 py-1.5 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8E8B82] mb-1">Verification Notes &amp; Hallmark Details</label>
                <textarea
                  rows={2}
                  value={goldForm.notes}
                  onChange={(e) => setGoldForm({ ...goldForm, notes: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#D4AF37] hover:bg-[#F5E6B5] text-[#070707] font-semibold rounded text-xs transition-all cursor-pointer"
              >
                Save Gold Weight Entry to Vault Ledger
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD LABOUR ENTRY ================= */}
      {labourModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#D4AF37]/40 rounded-xl max-w-lg w-full p-6 md:p-8 relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setLabourModalOpen(false)}
              className="absolute top-4 right-4 text-[#8E8B82] hover:text-[#FFFFFF] p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif-luxury text-2xl text-[#FFFFFF] mb-1">
              Create Karigar Labour Entry
            </h3>
            <p className="text-xs text-[#B8B8B8] mb-5">
              Specify billing rate and calculate gross amount and advance disbursement.
            </p>

            <form onSubmit={handleCreateLabour} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8E8B82] mb-1">Order Reference *</label>
                  <input
                    type="text"
                    required
                    value={labourForm.orderReference}
                    onChange={(e) => setLabourForm({ ...labourForm, orderReference: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#8E8B82] mb-1">Karigar Name *</label>
                  <input
                    type="text"
                    required
                    value={labourForm.workerName}
                    onChange={(e) => setLabourForm({ ...labourForm, workerName: e.target.value })}
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8E8B82] mb-1">Rate Billing Structure</label>
                  <select
                    value={labourForm.rateType}
                    onChange={(e) => setLabourForm({ ...labourForm, rateType: e.target.value as any })}
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="per_gram">Labour Per Gram (₹/g)</option>
                    <option value="per_piece">Labour Per Piece (₹/pc)</option>
                    <option value="fixed">Fixed Job Charge (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8E8B82] mb-1">Rate Per Unit (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={labourForm.ratePerUnit}
                    onChange={(e) => setLabourForm({ ...labourForm, ratePerUnit: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8E8B82] mb-1">Weight (g) or Quantity</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={labourForm.quantityOrWeight}
                    onChange={(e) => setLabourForm({ ...labourForm, quantityOrWeight: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#8E8B82] mb-1">Advance Disbursed (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={labourForm.advancePaid}
                    onChange={(e) => setLabourForm({ ...labourForm, advancePaid: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#D4AF37] hover:bg-[#F5E6B5] text-[#070707] font-semibold rounded text-xs transition-all cursor-pointer"
              >
                Save Labour Entry &amp; Record Advance
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: RECORD ADDITIONAL PAYMENT ================= */}
      {paymentDisburseModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#D4AF37]/40 rounded-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setPaymentDisburseModal(null)}
              className="absolute top-4 right-4 text-[#8E8B82] hover:text-[#FFFFFF] p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif-luxury text-xl text-[#FFFFFF] mb-1">
              Disburse Karigar Labour Payment
            </h3>
            <p className="text-xs text-[#B8B8B8] mb-4">
              Order: <strong className="text-[#F5E6B5]">{paymentDisburseModal.orderReference}</strong> ({paymentDisburseModal.workerName})
            </p>

            <div className="bg-[#181818] p-3 rounded mb-4 text-xs space-y-1 border border-[#222]">
              <div className="flex justify-between text-[#8E8B82]">
                <span>Gross Labour Amount:</span>
                <span>₹{paymentDisburseModal.grossLabourAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#8E8B82]">
                <span>Already Disbursed:</span>
                <span className="text-emerald-400">₹{paymentDisburseModal.totalPaid.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold text-[#F5E6B5] pt-1 border-t border-[#2A261C]">
                <span>Current Remaining Due:</span>
                <span className="text-[#D4AF37]">₹{paymentDisburseModal.remainingBalance.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <form onSubmit={handleDisbursePayment} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8E8B82] mb-1">Additional Amount to Disburse (₹) *</label>
                <input
                  type="number"
                  min="1"
                  max={paymentDisburseModal.remainingBalance}
                  value={disburseAmount}
                  onChange={(e) => setDisburseAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#181818] border border-[#2A261C] rounded px-3 py-2 text-[#E5E2E1] focus:border-[#D4AF37] focus:outline-none font-mono text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#F5E6B5] text-[#070707] font-semibold rounded transition-all cursor-pointer"
              >
                Confirm Payout &amp; Generate Voucher
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: PRINTABLE RECEIPT ================= */}
      {receiptModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] text-[#070707] rounded-xl max-w-lg w-full p-8 relative shadow-2xl space-y-6">
            <button
              onClick={() => setReceiptModal(null)}
              className="absolute top-4 right-4 text-[#888] hover:text-[#000] p-1 print:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Header */}
            <div className="text-center border-b pb-4 space-y-1">
              <h2 className="font-cinzel text-xl font-bold tracking-widest text-[#070707]">
                SRIKANTH GHORAI
              </h2>
              <p className="text-[11px] text-[#555] uppercase tracking-wider">
                Master Atelier &amp; Goldsmith Karigar Guild
              </p>
              <p className="text-[10px] text-[#777]">
                Near Anil Apartment, Mulund East, Mumbai, Maharashtra 400081 · Tel: +91 9167671944
              </p>
              <div className="pt-2 text-xs font-bold uppercase tracking-widest text-[#997A15]">
                Official Labour Payment Voucher
              </div>
            </div>

            {/* Receipt Body */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b pb-2">
                <span className="text-[#666]">Voucher ID:</span>
                <span className="font-mono font-bold">{receiptModal.id}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-[#666]">Order Reference:</span>
                <span className="font-bold">{receiptModal.orderReference}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-[#666]">Karigar Artisan:</span>
                <span className="font-bold">{receiptModal.workerName} ({receiptModal.workerPhone})</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-[#666]">Rate Structure:</span>
                <span>{receiptModal.rateType.replace('_', ' ')} @ ₹{receiptModal.ratePerUnit}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-[#666]">Quantity / Metal Weight:</span>
                <span>{receiptModal.quantityOrWeight}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-[#666]">Gross Labour Amount:</span>
                <span className="font-bold">₹{receiptModal.grossLabourAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-[#666]">Advance Paid:</span>
                <span>₹{receiptModal.advancePaid.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-b pb-2 font-bold text-sm text-emerald-700">
                <span>Total Disbursed:</span>
                <span>₹{receiptModal.totalPaid.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-sm">
                <span>Remaining Due Balance:</span>
                <span className={receiptModal.remainingBalance > 0 ? 'text-amber-700' : 'text-emerald-700'}>
                  ₹{receiptModal.remainingBalance.toLocaleString('en-IN')} ({receiptModal.paymentStatus})
                </span>
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t text-[11px] text-[#666] text-center">
              <div>
                <div className="border-b border-[#aaa] pb-6 mb-1"></div>
                <span>Karigar Signature</span>
              </div>
              <div>
                <div className="border-b border-[#aaa] pb-6 mb-1"></div>
                <span>Srikanth Ghorai Atelier Authority</span>
              </div>
            </div>

            {/* Action */}
            <div className="pt-2 print:hidden flex justify-end">
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-[#070707] text-[#FFFFFF] rounded text-xs font-semibold flex items-center gap-2 hover:bg-[#333]"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Physical Voucher</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
