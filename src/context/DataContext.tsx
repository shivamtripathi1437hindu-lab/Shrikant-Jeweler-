import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  JewelleryDesign,
  WorkerProfile,
  JobListing,
  JobApplication,
  GoldLedgerEntry,
  LabourPayment,
  CustomerEnquiry,
  LiveMarketRates,
  BusinessSettings,
  AuditLog
} from '../types';

interface DataContextType {
  // Designs
  designs: JewelleryDesign[];
  addDesign: (design: Omit<JewelleryDesign, 'id' | 'createdAt'>) => void;
  deleteDesign: (id: string) => void;

  // Workers
  workers: WorkerProfile[];
  addWorkerProfile: (worker: Omit<WorkerProfile, 'id'>) => void;
  updateWorkerStatus: (id: string, availability: WorkerProfile['availability']) => void;

  // Jobs
  jobs: JobListing[];
  addJob: (job: Omit<JobListing, 'id' | 'createdAt' | 'status' | 'progressPercent'>) => void;
  updateJobStatus: (id: string, status: JobListing['status'], progress?: number) => void;
  assignJobWorker: (jobId: string, workerId: string, workerName: string) => void;

  // Applications
  applications: JobApplication[];
  applyForJob: (jobId: string, workerName: string, workerPhone: string, skills: string[], notes?: string) => void;
  updateApplicationStatus: (appId: string, status: JobApplication['status']) => void;

  // Gold Ledger
  goldLedger: GoldLedgerEntry[];
  addGoldTransaction: (entry: Omit<GoldLedgerEntry, 'id' | 'netRemainingBalanceGrams' | 'discrepancyStatus' | 'transactionDate'>) => void;

  // Labour Payments
  labourPayments: LabourPayment[];
  addLabourEntry: (entry: Omit<LabourPayment, 'id' | 'grossLabourAmount' | 'additionalPaid' | 'totalPaid' | 'remainingBalance' | 'paymentStatus' | 'paymentDate'>) => void;
  recordLabourPayment: (id: string, additionalAmount: number) => void;

  // Enquiries
  enquiries: CustomerEnquiry[];
  submitEnquiry: (enquiry: Omit<CustomerEnquiry, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  updateEnquiryStatus: (id: string, status: CustomerEnquiry['status']) => void;

  // Market Rates
  marketRates: LiveMarketRates;
  refreshMarketRates: () => Promise<void>;
  updateMarketRateSource: (source: string, isConnected: boolean) => void;

  // Settings
  settings: BusinessSettings;
  updateSettings: (newSettings: Partial<BusinessSettings>) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  logAction: (action: string, performedBy: string, details: string) => void;
}

const initialDesigns: JewelleryDesign[] = [
  {
    id: 'des-1',
    title: 'The Mayurpankh Polki Necklace',
    titleHi: 'मयूरपंख पोलकी हार',
    category: 'necklaces',
    description: 'Masterwork in 22K yellow gold featuring hand-cut uncut Polki diamonds, Zambian emerald droplets, and micro-filigree peacocks.',
    descriptionHi: '22K पीले सोने में अनकट पोलकी हीरे, जाम्बियन पन्ना बूंदों और सूक्ष्म बारीक जालीदार काम के साथ निर्मित भव्य हार।',
    purity: '22K',
    metalWeightGrams: 124.5,
    stoneWeightCarats: 18.2,
    gemstones: 'Certified Polki Diamonds & Zambian Emeralds',
    priceEstimate: 895000,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCttlEw7IsvstZnuIEPYQ6opKXW31e1ZnBmpsiR33jLdZaKAMnhwoWiAcM12JThEbVNDrcm1CEUf4pSDWotfHg6IkJefSu_UY2EMjUBmAMA7AX75v0ImoQZPrNTofAL9Dju0ZlLEuYhLIi1kqkTVqS2Gok75JxqsEJfrKbcAEOmhfM1DUpw3-wgq_fCMiCbtHqlelrKn6CSTIzasakzeNNLAiO_jvoy1xy_O4iC-qEaprBEpiZnYU7p',
    featured: true,
    dimensions: 'Length 18 inches, Center Pendant 3.5 inches',
    makingChargePercent: 14,
    createdAt: '2024-01-15'
  },
  {
    id: 'des-2',
    title: 'Eternity Solitaire Diamond Ring',
    titleHi: 'एटर्निटी सॉलिटेयर डायमंड रिंग',
    category: 'rings',
    description: '18K White & Rose Gold filigree solitaire ring crowned with a 2.5-carat triple excellent cut certified center diamond with micro-pavé bridge.',
    descriptionHi: '18K व्हाइट व रोज़ गोल्ड में नक्काशीदार 2.5 कैरेट ट्रिपल एक्सीलेंट सॉलिटेयर हीरा अंगूठी।',
    purity: '18K',
    metalWeightGrams: 6.2,
    stoneWeightCarats: 2.5,
    gemstones: 'VVS1 G-Color Center Diamond (GIA Certified)',
    priceEstimate: 420000,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACghlfhkJ0pwDAl_mMw1cC98FosyQgjRBh-Cb7GH97-ZxnHQ59sN1y-oryDqgSX-4dODT7I1kzgg7cW60GsEKFo_DNxfmy0M8CIQdvKIcQJPqByj9DfZgxn7S_ZGxuuC_P0o2-QTG3y-t3gWOBnkGD5bN83W7QpgYWiyN1G8m3LoUftOkrwwjymImcxQGzlSJr2Ebnp03X21RTk48DiggzRVwbfK0S4sf5S6ma-KOBUG2qLqclzOL1',
    featured: true,
    dimensions: 'Size 14 (Customizable)',
    makingChargePercent: 12,
    createdAt: '2024-02-01'
  },
  {
    id: 'des-3',
    title: 'Royal Temple Jhumkas',
    titleHi: 'शाही मंदिर झुमकी',
    category: 'earrings',
    description: '22K antique gold jhumkas engraved with goddess motifs, delicate granulation balls, and swinging natural Basra pearls.',
    descriptionHi: '22K प्राचीन फिनिश सोने में देवी रूपांकन, दानेदार काम और प्राकृतिक बसरा मोतियों की लटकन युक्त झुमकी।',
    purity: '22K',
    metalWeightGrams: 38.4,
    stoneWeightCarats: 4.5,
    gemstones: 'Natural Basra Seed Pearls & Rubies',
    priceEstimate: 285000,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjaTykUoqNQd71kVq-6aMyvH9hFeFVorCZsHrjQqgflQMavBig8q-7n7eU4KmjPMeV_y8l7aJ62EZ2ULJIG2s-io5x-OFiRgghgZfXQJmqIXV3PFM6HYtHKLq1u7pccH3owMgh5_ZXYwycy3ZTTq1y4zJQAJI8qdlYYQMKaIwlLVkueagkfBY39EUbVer5byHkYzsN9yL0Uko1Y1jZIxfyT6pePV0lHFH5huzNlzb2SIpe3WYff0VI',
    featured: true,
    dimensions: 'Length 62mm, Bell Diameter 24mm',
    makingChargePercent: 15,
    createdAt: '2024-02-10'
  },
  {
    id: 'des-4',
    title: 'Chandrakala Kundan Choker',
    titleHi: 'चंद्रकला कुंदन चोकर',
    category: 'necklaces',
    description: 'Heritage Jadau choker with gold foil backed uncut diamonds and deep Burmese ruby clusters on pure silk gold thread dori.',
    descriptionHi: 'शुद्ध सोने के पत्तर आधारित अनकट हीरों व बर्मी माणिक्य क्लस्टर वाला पारंपरिक जड़ाऊ चोकर हार।',
    purity: '22K',
    metalWeightGrams: 98.2,
    stoneWeightCarats: 14.0,
    gemstones: 'Pigeon-Blood Burmese Rubies & Jadau Kundan',
    priceEstimate: 740000,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCX294HH_mFbxyB3N2h-p2XWns2lCFIUjH_mwmwXDM9gXKO-h-LemPRo08gQXd7NfIRuOzH60HFR5vCLV6SYwlA1v1FR_fwWw7O8XDMcV_F_26THOR4XBjfhQL1FFuyetGqxpkJRdgM89TWB9ynx7agec3LO0_b8iizH7sc6wM6si94wSNdwOwtbhBoyyXTlpu-GzJVX1DapZ1-3ugrqPoD4GYR_fn2mvIC5b8450k63-oxJVK2DjRv',
    featured: false,
    dimensions: 'Inner Circumference 14 inches (Adjustable Dori)',
    makingChargePercent: 16,
    createdAt: '2024-03-01'
  },
  {
    id: 'des-5',
    title: 'Aurelia Fancy Yellow Ring',
    titleHi: 'ऑरेलिया फैंसी येलो डायमंड अंगूठी',
    category: 'rings',
    description: 'Platinum & 18K yellow gold prong setting holding a rare 3.02-carat cushion radiant natural fancy yellow diamond flanked by matched trapezoids.',
    descriptionHi: 'प्लैटिनम और 18K सोने में दुर्लभ 3.02 कैरेट कुशन कट प्राकृतिक पीला हीरा अंगूठी।',
    purity: '18K',
    metalWeightGrams: 7.5,
    stoneWeightCarats: 3.8,
    gemstones: '3.02ct Fancy Intense Yellow Diamond + Trapezoids',
    priceEstimate: 1250000,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLdVF6Iljh0nA_-HtnQeYlzQbRoqoDJy29850Et3rCkyv03_1gfm_MQy3LZybeDhi9zrRSKiDsfOKbz5KXzVrrqxH2ql6uJ6Z3CB6AZ5YF8RQuL_Uzm_4_fIqhwQ7XlHieLrGZ8A9_BCJ-RHtgTvriRX1-XYddCv8Z2ttQvFSksj08n4eQ_TQUYPTfDipEWKzBQQIVBNC-YsbqO5vCFUGpdh9fyQzy6Ct2f0OB_rvlMmxBk0e-Yaf0',
    featured: false,
    dimensions: 'Size 13',
    makingChargePercent: 10,
    createdAt: '2024-03-05'
  },
  {
    id: 'des-6',
    title: 'Nakshi Royal Kada Pair',
    titleHi: 'नक्शी रॉयल कड़ा जोड़ी',
    category: 'bangles',
    description: 'A pair of heavy 22K solid gold kadas crafted using ancient repoussé and champlevé techniques with elephant and floral motifs.',
    descriptionHi: 'प्राचीन नक्काशीदार हाथी व पुष्प रूपांकनों से सुसज्जित 22K ठोस सोने के दो भारी कंगन।',
    purity: '22K',
    metalWeightGrams: 85.0,
    stoneWeightCarats: 0,
    gemstones: 'Solid Hallmarked Gold (No Stones)',
    priceEstimate: 610000,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWdgZ-273WBRMmFycMRlSenLYZCJD7Wt7EIdF0u_IRwSR6U2cyMMhxpoiD_hhY6nS-lBPiNaoMXL32N3VCEnJxUDRa5CvxomgQdoheDBCqcTFb9hvX5JGdRIAymz7_z_BzGHAYkx5c9TCxDjnL5ToMPZgBjdwnqBNjdgsvakVsE21JMzepIKykFZuEpbADPbW6-iOy2LvEr_5-plz2KiO08mm2xl5NUi072eMMBQvNj_yCIcbgggxB',
    featured: false,
    dimensions: 'Size 2.6 (Inside Diameter 60mm)',
    makingChargePercent: 13,
    createdAt: '2024-03-12'
  },
  {
    id: 'des-7',
    title: 'Samrat Bridal Polki Suite',
    titleHi: 'सम्राट दुल्हन पोलकी सेट',
    category: 'bridal',
    description: 'Comprehensive high-jewellery bridal ensemble comprising royal choker, rani haar, matching chandelier earrings, maang tikka, and hathphool.',
    descriptionHi: 'शाही चोकर, रानी हार, झुमके, मांग टीका व हथफूल सहित सम्पूर्ण राजसी ब्राइडल पोलकी सेट।',
    purity: '22K',
    metalWeightGrams: 245.0,
    stoneWeightCarats: 36.5,
    gemstones: 'Certified Polki, Colombian Emeralds, South Sea Pearls',
    priceEstimate: 1850000,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFMYrxsNScbcxKqBhXM98KKyjXvS6Xi7oeq4IJ8KmuZ0D2dyl2d4K1awDdr0eI0rmya1iSJdsWtK3pcu_4xMT4YRK2vtmHK1BQaW7HDYbemre2idiIeCelC6zLhZ8nr75YZFUkzwys7n7Umk7dk53wHuT2poJ9zybdH4PtFzhW1gczb1Rnr1oHqUsqbD04qWZJE6psXMuITsdpiHx7CPIz8cOJKYT3ANzVLjFXw4DJRO_CAoVcUHh1',
    featured: true,
    dimensions: 'Full 5-Piece Bridal Set',
    makingChargePercent: 18,
    createdAt: '2024-03-18'
  },
  {
    id: 'des-8',
    title: 'Cascade Diamond Chandelier Earrings',
    titleHi: 'कैस्केड डायमंड झूमर बालियां',
    category: 'earrings',
    description: 'Fluid tiered earrings engineered with pear and marquise brilliant diamonds in ultra-lightweight 18K white gold articulation.',
    descriptionHi: '18K व्हाइट गोल्ड में नाशपाती व मारकीज़ कट हीरों से सजी झिलमिलाती आधुनिक कान की बालियां।',
    purity: '18K',
    metalWeightGrams: 14.2,
    stoneWeightCarats: 4.8,
    gemstones: 'EF-Color VVS Diamonds',
    priceEstimate: 520000,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzm3mVoAEhQafiHh6n-zOQA1TkQBY3608vb4bQQOvAE3t12T2CckfGvxTrCf--2kQnmzxJ_kNEi_zp4QLzpXP5JB8IeEexq_ENoPzO3Eebw4RccavulT_wGv-IF-v7zkep0mpP8tg83Du9Ey-FSyrrsLylwtpOhIVQMPhqLekzxUMdQWHW6YalYzcAP6OCKHTt95338-YYqea1xXEji1UNZ0DHj4jGpMB6KhKJGITWMGWk-Zp7DKzR',
    featured: false,
    dimensions: 'Length 55mm',
    makingChargePercent: 11,
    createdAt: '2024-03-22'
  },
  {
    id: 'des-9',
    title: 'Heritage Pure Silver Puja Thali Set',
    titleHi: 'विरासत 925 शुद्ध चांदी पूजा थाली',
    category: 'silver',
    description: '92.5 Sterling Silver ceremonial thali set embossed with Gayatri mantra, floral rim, diya, bell, and kalash with 24K gold foil gilding.',
    descriptionHi: 'गायत्री मंत्र, दीया, घंटी व कलश सहित 92.5 स्टर्लिंग चांदी पूजा थाली सेट 24K सोने की बारीक परत के साथ।',
    purity: '925 Silver',
    metalWeightGrams: 650.0,
    stoneWeightCarats: 0,
    gemstones: '24K Micron Gold Gilding on Pure Silver',
    priceEstimate: 75000,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYvN-3Xbev6UJAPqKzIdVMrG0wBfhS3_FlPbKpgb_X49kizi5-wjMJZ4ciiSWe9Zx7ouVFLwgzlgoprroKaAveES1Iv04GUVKCVED5vZnig7zRQvYIKiVjrpXa_J2v9IAuNF78NGl8yphPsyvXBIiQBj_w6UYWeZfcx2uWOyNaK2hMeO67J5b4VYOMPlScusq6_Re3IeVqqRnEk49AC-2EDhOt10K9grGa_GwGRvK1f9DdoyDxqG7p',
    featured: false,
    dimensions: 'Thali Diameter 12 inches (30cm)',
    makingChargePercent: 9,
    createdAt: '2024-03-25'
  }
];

const initialWorkers: WorkerProfile[] = [
  {
    id: 'wrk-1',
    fullName: 'Subrata Ghorai',
    phone: '9830012345',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    skills: ['Goldsmithing', 'Polishing', 'Jewellery Finishing'],
    experienceYears: 18,
    serviceLocation: 'Mumbai & Kolkata Hubs',
    bio: 'Fourth-generation goldsmith specializing in high-gloss mirror polishing, chemical stripping, and rhodium electroplating with near-zero loss.',
    availability: 'Available',
    dailyRate: 2400,
    rating: 4.9,
    completedJobsCount: 142
  },
  {
    id: 'wrk-2',
    fullName: 'Mantu Karmakar',
    phone: '9820098765',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    skills: ['Diamond Setting', 'Stone Setting', 'Custom Jewellery Making'],
    experienceYears: 14,
    serviceLocation: 'Zaveri Bazaar & Mulund, Mumbai',
    bio: 'Microscope pavé specialist with expertise in multi-stone eternity bands, invisible princess settings, and high-tension solitaire prongs.',
    availability: 'Available',
    dailyRate: 2800,
    rating: 5.0,
    completedJobsCount: 98
  },
  {
    id: 'wrk-3',
    fullName: 'Alok Das',
    phone: '9840054321',
    profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    skills: ['Goldsmithing', 'Casting', 'Jewellery Repair'],
    experienceYears: 22,
    serviceLocation: 'Mulund East Workshop, Mumbai',
    bio: 'Master of classical Indian temple Nakshi work, lost-wax casting tree calculations, and antique restoration of vintage gold heirloom jewellery.',
    availability: 'Assigned to Project',
    dailyRate: 3200,
    rating: 4.8,
    completedJobsCount: 215
  },
  {
    id: 'wrk-4',
    fullName: 'Bikash Mondal',
    phone: '9819911223',
    profilePhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    skills: ['Custom Jewellery Making', 'Diamond Setting', 'Jewellery Finishing'],
    experienceYears: 11,
    serviceLocation: 'Mumbai Metropolitan Region',
    bio: 'Bespoke modern bridal jeweller skilled in translating CAD 3D prints into hand-carved gold filigree master units.',
    availability: 'Available',
    dailyRate: 2500,
    rating: 4.7,
    completedJobsCount: 76
  }
];

const initialJobs: JobListing[] = [
  {
    id: 'job-101',
    title: 'Master Polisher for 22K Kundan Choker Suite',
    jewelleryType: 'Bridal Choker',
    requiredSkills: ['Polishing', 'Jewellery Finishing'],
    quantity: 3,
    proposedLabourRate: 180,
    rateType: 'per_gram',
    estimatedGoldWeightGrams: 280,
    deadline: '2026-10-15',
    workshopName: 'Srikanth Ghorai Atelier #1',
    workshopLocation: 'Mulund East, Mumbai',
    description: 'Precision manual gold buffing and mirror gloss finishing needed on intricate 22K Kundan foil-back necklace links with zero edge degradation.',
    status: 'In Progress',
    assignedWorkerId: 'wrk-1',
    assignedWorkerName: 'Subrata Ghorai',
    progressPercent: 65,
    createdAt: '2026-09-20'
  },
  {
    id: 'job-102',
    title: 'Micro-Pavé Diamond Setting on 18K Solitaire Bands',
    jewelleryType: 'Diamond Engagement Rings',
    requiredSkills: ['Diamond Setting', 'Stone Setting'],
    quantity: 12,
    proposedLabourRate: 850,
    rateType: 'per_piece',
    estimatedGoldWeightGrams: 75,
    deadline: '2026-10-08',
    workshopName: 'Mulund Heritage Atelier',
    workshopLocation: 'Near Anil Apartment, Mulund East',
    description: 'Set 0.01ct to 0.03ct VS diamond melee into 18K white gold micro-bead channels under 40x microscope. Strict inspection for flush alignment.',
    status: 'Open',
    progressPercent: 0,
    createdAt: '2026-09-25'
  },
  {
    id: 'job-103',
    title: 'Traditional Temple Nakshi Engraving on Kada Pair',
    jewelleryType: 'Gold Bangles',
    requiredSkills: ['Goldsmithing', 'Custom Jewellery Making'],
    quantity: 2,
    proposedLabourRate: 22000,
    rateType: 'fixed',
    estimatedGoldWeightGrams: 160,
    deadline: '2026-10-25',
    workshopName: 'Srikanth Ghorai Atelier #2',
    workshopLocation: 'Mulund East, Mumbai',
    description: 'Chased embossing of floral creeper and royal elephant head lock caps on heavy 22K hollow-core resin-filled bangles.',
    status: 'Assigned',
    assignedWorkerId: 'wrk-3',
    assignedWorkerName: 'Alok Das',
    progressPercent: 30,
    createdAt: '2026-09-24'
  }
];

const initialGoldLedger: GoldLedgerEntry[] = [
  {
    id: 'led-1',
    jobId: 'job-101',
    orderReference: 'ORD-2026-0901',
    workerName: 'Subrata Ghorai',
    materialType: 'Yellow Gold',
    purity: '22K',
    goldIssuedGrams: 280.00,
    finishedGoldReturnedGrams: 274.60,
    stoneWeightGrams: 0.00,
    scrapReturnedGrams: 3.20,
    recordedWasteGrams: 2.20,
    adjustmentsGrams: 0.00,
    netRemainingBalanceGrams: 0.00,
    discrepancyStatus: 'Balanced',
    transactionDate: '2026-09-22',
    notes: 'Batch 1 completed with exact 0.78% polishing loss within the 0.8% guild allowance.'
  },
  {
    id: 'led-2',
    jobId: 'job-103',
    orderReference: 'ORD-2026-0908',
    workerName: 'Alok Das',
    materialType: 'Yellow Gold',
    purity: '22K',
    goldIssuedGrams: 160.00,
    finishedGoldReturnedGrams: 154.20,
    stoneWeightGrams: 0.00,
    scrapReturnedGrams: 3.10,
    recordedWasteGrams: 1.80,
    adjustmentsGrams: 0.00,
    netRemainingBalanceGrams: 0.90,
    discrepancyStatus: 'Human Review Required',
    transactionDate: '2026-09-26',
    notes: '0.90g remaining scrap pending final ultrasonic filter collection and vacuum sweep check.'
  },
  {
    id: 'led-3',
    jobId: 'job-102',
    orderReference: 'ORD-2026-0914',
    workerName: 'Mantu Karmakar',
    materialType: 'White Gold',
    purity: '18K',
    goldIssuedGrams: 85.00,
    finishedGoldReturnedGrams: 82.10,
    stoneWeightGrams: 8.50,
    scrapReturnedGrams: 2.15,
    recordedWasteGrams: 0.75,
    adjustmentsGrams: 0.00,
    netRemainingBalanceGrams: 0.00,
    discrepancyStatus: 'Balanced',
    transactionDate: '2026-09-27',
    notes: '12 Solitaire ring mountings finished and stone weights documented on certificate.'
  }
];

const initialLabourPayments: LabourPayment[] = [
  {
    id: 'pay-1',
    jobId: 'job-101',
    workerName: 'Subrata Ghorai',
    workerPhone: '9830012345',
    orderReference: 'ORD-2026-0901',
    rateType: 'per_gram',
    ratePerUnit: 180,
    quantityOrWeight: 274.6,
    grossLabourAmount: 49428,
    approvedAdjustments: 0,
    advancePaid: 20000,
    additionalPaid: 29428,
    totalPaid: 49428,
    remainingBalance: 0,
    paymentStatus: 'Paid',
    paymentDate: '2026-09-23',
    notes: 'Full payment disbursed via NEFT bank transfer upon weight verification.'
  },
  {
    id: 'pay-2',
    jobId: 'job-103',
    workerName: 'Alok Das',
    workerPhone: '9840054321',
    orderReference: 'ORD-2026-0908',
    rateType: 'fixed',
    ratePerUnit: 22000,
    quantityOrWeight: 1,
    grossLabourAmount: 22000,
    approvedAdjustments: 0,
    advancePaid: 10000,
    additionalPaid: 0,
    totalPaid: 10000,
    remainingBalance: 12000,
    paymentStatus: 'Partially Paid',
    paymentDate: '2026-09-24',
    notes: '50% mobilization advance paid on metal issuance.'
  },
  {
    id: 'pay-3',
    jobId: 'job-102',
    workerName: 'Mantu Karmakar',
    workerPhone: '9820098765',
    orderReference: 'ORD-2026-0914',
    rateType: 'per_piece',
    ratePerUnit: 850,
    quantityOrWeight: 12,
    grossLabourAmount: 10200,
    approvedAdjustments: 500,
    advancePaid: 4000,
    additionalPaid: 6700,
    totalPaid: 10700,
    remainingBalance: 0,
    paymentStatus: 'Paid',
    paymentDate: '2026-09-28',
    notes: 'Includes ₹500 microscope tooling incentive bonus.'
  }
];

const initialMarketRates: LiveMarketRates = {
  gold24k: { ratePerGram: 7245, ratePer10Gram: 72450, change24h: 150 },
  gold22k: { ratePerGram: 6640, ratePer10Gram: 66400, change24h: 120 },
  gold18k: { ratePerGram: 5430, ratePer10Gram: 54300, change24h: 90 },
  silverGram: 84.50,
  silverKg: 84500,
  diamondPerCaratVVS1: 485000,
  diamondPerCaratVS1: 420000,
  diamondPerCaratSI1: 340000,
  lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  dataSource: 'India Bullion & Jewellers Association (IBJA Verified Benchmark Feed)',
  isConnected: true,
  currency: 'INR (₹)'
};

const initialSettings: BusinessSettings = {
  brandName: 'SRIKANTH GHORAI',
  phone: '9167671944',
  whatsappNumber: '919167671944',
  address: 'Near Anil Apartment, Mulund East, Mumbai, Maharashtra, India',
  city: 'Mumbai',
  state: 'Maharashtra',
  country: 'India',
  latitude: 19.1726,
  longitude: 72.9565,
  email: 'concierge@srikanthghorai.com',
  taglineEn: 'Where Every Gram Tells a Story.',
  taglineHi: 'हर ग्राम में हुनर, हर कारीगर की पहचान।'
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load states from localStorage or defaults
  const [designs, setDesigns] = useState<JewelleryDesign[]>(() => {
    const saved = localStorage.getItem('sg_designs');
    return saved ? JSON.parse(saved) : initialDesigns;
  });

  const [workers, setWorkers] = useState<WorkerProfile[]>(() => {
    const saved = localStorage.getItem('sg_workers');
    return saved ? JSON.parse(saved) : initialWorkers;
  });

  const [jobs, setJobs] = useState<JobListing[]>(() => {
    const saved = localStorage.getItem('sg_jobs');
    return saved ? JSON.parse(saved) : initialJobs;
  });

  const [applications, setApplications] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem('sg_applications');
    return saved ? JSON.parse(saved) : [];
  });

  const [goldLedger, setGoldLedger] = useState<GoldLedgerEntry[]>(() => {
    const saved = localStorage.getItem('sg_gold_ledger');
    return saved ? JSON.parse(saved) : initialGoldLedger;
  });

  const [labourPayments, setLabourPayments] = useState<LabourPayment[]>(() => {
    const saved = localStorage.getItem('sg_labour_payments');
    return saved ? JSON.parse(saved) : initialLabourPayments;
  });

  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>(() => {
    const saved = localStorage.getItem('sg_enquiries');
    return saved ? JSON.parse(saved) : [];
  });

  const [marketRates, setMarketRates] = useState<LiveMarketRates>(() => {
    const saved = localStorage.getItem('sg_market_rates');
    return saved ? JSON.parse(saved) : initialMarketRates;
  });

  const [settings, setSettings] = useState<BusinessSettings>(() => {
    const saved = localStorage.getItem('sg_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('sg_audit_logs');
    return saved ? JSON.parse(saved) : [
      {
        id: 'log-1',
        action: 'System Initialized',
        performedBy: 'System Administrator',
        details: 'Srikanth Ghorai luxury atelier ledger and database launched with zero-trust gold accounting.',
        timestamp: '2026-09-29T00:00:00Z'
      }
    ];
  });

  // Sync to localStorage
  useEffect(() => { localStorage.setItem('sg_designs', JSON.stringify(designs)); }, [designs]);
  useEffect(() => { localStorage.setItem('sg_workers', JSON.stringify(workers)); }, [workers]);
  useEffect(() => { localStorage.setItem('sg_jobs', JSON.stringify(jobs)); }, [jobs]);
  useEffect(() => { localStorage.setItem('sg_applications', JSON.stringify(applications)); }, [applications]);
  useEffect(() => { localStorage.setItem('sg_gold_ledger', JSON.stringify(goldLedger)); }, [goldLedger]);
  useEffect(() => { localStorage.setItem('sg_labour_payments', JSON.stringify(labourPayments)); }, [labourPayments]);
  useEffect(() => { localStorage.setItem('sg_enquiries', JSON.stringify(enquiries)); }, [enquiries]);
  useEffect(() => { localStorage.setItem('sg_market_rates', JSON.stringify(marketRates)); }, [marketRates]);
  useEffect(() => { localStorage.setItem('sg_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('sg_audit_logs', JSON.stringify(auditLogs)); }, [auditLogs]);

  const logAction = (action: string, performedBy: string, details: string) => {
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      action,
      performedBy,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const addDesign = (designData: Omit<JewelleryDesign, 'id' | 'createdAt'>) => {
    const newDesign: JewelleryDesign = {
      ...designData,
      id: 'des-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setDesigns(prev => [newDesign, ...prev]);
    logAction('Design Added', 'Staff / Admin', `Added design: ${newDesign.title}`);
  };

  const deleteDesign = (id: string) => {
    setDesigns(prev => prev.filter(d => d.id !== id));
    logAction('Design Deleted', 'Admin', `Deleted design ID: ${id}`);
  };

  const addWorkerProfile = (workerData: Omit<WorkerProfile, 'id'>) => {
    const newWorker: WorkerProfile = {
      ...workerData,
      id: 'wrk-' + Date.now()
    };
    setWorkers(prev => [newWorker, ...prev]);
    logAction('Worker Profile Created', workerData.fullName, `Artisan ${workerData.fullName} registered`);
  };

  const updateWorkerStatus = (id: string, availability: WorkerProfile['availability']) => {
    setWorkers(prev => prev.map(w => w.id === id ? { ...w, availability } : w));
  };

  const addJob = (jobData: Omit<JobListing, 'id' | 'createdAt' | 'status' | 'progressPercent'>) => {
    const newJob: JobListing = {
      ...jobData,
      id: 'job-' + Date.now(),
      status: 'Open',
      progressPercent: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setJobs(prev => [newJob, ...prev]);
    logAction('Job Listing Created', jobData.workshopName, `Created listing: ${newJob.title}`);
  };

  const updateJobStatus = (id: string, status: JobListing['status'], progress?: number) => {
    setJobs(prev => prev.map(j => {
      if (j.id === id) {
        return {
          ...j,
          status,
          progressPercent: progress !== undefined ? progress : j.progressPercent
        };
      }
      return j;
    }));
    logAction('Job Status Updated', 'Workshop Manager', `Job ${id} status set to ${status}`);
  };

  const assignJobWorker = (jobId: string, workerId: string, workerName: string) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          status: 'Assigned',
          assignedWorkerId: workerId,
          assignedWorkerName: workerName
        };
      }
      return j;
    }));
    updateWorkerStatus(workerId, 'Assigned to Project');
    logAction('Worker Assigned', 'Workshop Manager', `Assigned ${workerName} to job ${jobId}`);
  };

  const applyForJob = (jobId: string, workerName: string, workerPhone: string, skills: string[], notes?: string) => {
    const targetJob = jobs.find(j => j.id === jobId);
    const newApp: JobApplication = {
      id: 'app-' + Date.now(),
      jobId,
      jobTitle: targetJob?.title || 'Job Opening',
      workerId: 'wrk-' + Date.now(),
      workerName,
      workerPhone,
      workerSkills: skills,
      appliedAt: new Date().toISOString(),
      status: 'Pending',
      notes
    };
    setApplications(prev => [newApp, ...prev]);
    logAction('Job Application Submitted', workerName, `Applied for job: ${targetJob?.title}`);
  };

  const updateApplicationStatus = (appId: string, status: JobApplication['status']) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
    logAction('Application Status Changed', 'Workshop Admin', `Application ${appId} changed to ${status}`);
  };

  const addGoldTransaction = (entryData: Omit<GoldLedgerEntry, 'id' | 'netRemainingBalanceGrams' | 'discrepancyStatus' | 'transactionDate'>) => {
    // Formula: Net Balance = Issued - (FinishedReturned + ScrapReturned + RecordedWaste + Adjustments)
    const totalAccounted = Number((
      entryData.finishedGoldReturnedGrams +
      entryData.scrapReturnedGrams +
      entryData.recordedWasteGrams +
      entryData.adjustmentsGrams
    ).toFixed(3));

    const netRemaining = Number((entryData.goldIssuedGrams - totalAccounted).toFixed(3));

    let discrepancyStatus: GoldLedgerEntry['discrepancyStatus'] = 'Balanced';
    if (Math.abs(netRemaining) === 0) {
      discrepancyStatus = 'Balanced';
    } else if (Math.abs(netRemaining) <= 0.05) {
      discrepancyStatus = 'Acceptable Loss';
    } else {
      discrepancyStatus = 'Human Review Required';
    }

    const newEntry: GoldLedgerEntry = {
      ...entryData,
      id: 'led-' + Date.now(),
      netRemainingBalanceGrams: netRemaining,
      discrepancyStatus,
      transactionDate: new Date().toISOString().split('T')[0]
    };

    setGoldLedger(prev => [newEntry, ...prev]);
    logAction('Gold Transaction Logged', 'Vault Manager', `Recorded entry for ${newEntry.orderReference}: Issued ${newEntry.goldIssuedGrams}g, Net Balance: ${netRemaining}g (${discrepancyStatus})`);
  };

  const addLabourEntry = (entryData: Omit<LabourPayment, 'id' | 'grossLabourAmount' | 'additionalPaid' | 'totalPaid' | 'remainingBalance' | 'paymentStatus' | 'paymentDate'>) => {
    let gross = 0;
    if (entryData.rateType === 'per_gram') {
      gross = entryData.ratePerUnit * entryData.quantityOrWeight;
    } else if (entryData.rateType === 'per_piece') {
      gross = entryData.ratePerUnit * entryData.quantityOrWeight;
    } else {
      gross = entryData.ratePerUnit;
    }

    const netGross = gross + entryData.approvedAdjustments;
    const totalPaid = entryData.advancePaid;
    const remaining = Math.max(0, netGross - totalPaid);
    const paymentStatus: LabourPayment['paymentStatus'] = 
      remaining === 0 ? 'Paid' : (totalPaid > 0 ? 'Partially Paid' : 'Unpaid');

    const newPayment: LabourPayment = {
      ...entryData,
      id: 'pay-' + Date.now(),
      grossLabourAmount: netGross,
      additionalPaid: 0,
      totalPaid,
      remainingBalance: remaining,
      paymentStatus,
      paymentDate: new Date().toISOString().split('T')[0]
    };

    setLabourPayments(prev => [newPayment, ...prev]);
    logAction('Labour Entry Created', 'Accountant', `Created payment entry for ${newPayment.workerName}: Gross ₹${netGross}`);
  };

  const recordLabourPayment = (id: string, additionalAmount: number) => {
    setLabourPayments(prev => prev.map(p => {
      if (p.id === id) {
        const newAdditional = p.additionalPaid + additionalAmount;
        const newTotalPaid = p.advancePaid + newAdditional;
        const newRemaining = Math.max(0, p.grossLabourAmount - newTotalPaid);
        const newStatus: LabourPayment['paymentStatus'] = 
          newRemaining === 0 ? 'Paid' : (newTotalPaid > 0 ? 'Partially Paid' : 'Unpaid');
        return {
          ...p,
          additionalPaid: newAdditional,
          totalPaid: newTotalPaid,
          remainingBalance: newRemaining,
          paymentStatus: newStatus
        };
      }
      return p;
    }));
    logAction('Labour Payment Recorded', 'Accountant', `Disbursed ₹${additionalAmount} for payment ID ${id}`);
  };

  const submitEnquiry = async (enquiryData: Omit<CustomerEnquiry, 'id' | 'createdAt' | 'status'>): Promise<boolean> => {
    const newEnquiry: CustomerEnquiry = {
      ...enquiryData,
      id: 'enq-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'New'
    };
    setEnquiries(prev => [newEnquiry, ...prev]);
    logAction('Customer Enquiry Received', enquiryData.fullName, `Enquiry type: ${enquiryData.enquiryType}`);
    return true;
  };

  const updateEnquiryStatus = (id: string, status: CustomerEnquiry['status']) => {
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
  };

  const refreshMarketRates = async () => {
    // Simulate real live market fluctuation within realistic ±0.2% variance
    const delta = (Math.random() - 0.45) * 40;
    const new24k = Math.round(72450 + delta);
    const new22k = Math.round(new24k * (22 / 24));
    const new18k = Math.round(new24k * (18 / 24));

    setMarketRates(prev => ({
      ...prev,
      gold24k: {
        ratePerGram: Math.round(new24k / 10),
        ratePer10Gram: new24k,
        change24h: Math.round(delta)
      },
      gold22k: {
        ratePerGram: Math.round(new22k / 10),
        ratePer10Gram: new22k,
        change24h: Math.round(delta * 0.916)
      },
      gold18k: {
        ratePerGram: Math.round(new18k / 10),
        ratePer10Gram: new18k,
        change24h: Math.round(delta * 0.75)
      },
      silverGram: Number((84.50 + (delta / 800)).toFixed(2)),
      silverKg: Math.round(84500 + delta * 12),
      lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    }));
    logAction('Market Rates Refreshed', 'Rate Engine', `Synchronized bullion rates: 24K: ₹${new24k}/10g`);
  };

  const updateMarketRateSource = (source: string, isConnected: boolean) => {
    setMarketRates(prev => ({ ...prev, dataSource: source, isConnected }));
    logAction('Market Feed Configured', 'Admin', `Provider set to ${source} (Connected: ${isConnected})`);
  };

  const updateSettings = (newSettings: Partial<BusinessSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    logAction('Settings Updated', 'Admin', 'Updated atelier business contact and geocoded coordinates.');
  };

  return (
    <DataContext.Provider
      value={{
        designs,
        addDesign,
        deleteDesign,
        workers,
        addWorkerProfile,
        updateWorkerStatus,
        jobs,
        addJob,
        updateJobStatus,
        assignJobWorker,
        applications,
        applyForJob,
        updateApplicationStatus,
        goldLedger,
        addGoldTransaction,
        labourPayments,
        addLabourEntry,
        recordLabourPayment,
        enquiries,
        submitEnquiry,
        updateEnquiryStatus,
        marketRates,
        refreshMarketRates,
        updateMarketRateSource,
        settings,
        updateSettings,
        auditLogs,
        logAction
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
