export type UserRole = 
  | 'platform_admin'
  | 'workshop_owner'
  | 'workshop_manager'
  | 'jewellery_artisan'
  | 'customer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  language: 'en' | 'hi';
  workshopName?: string;
  workshopAddress?: string;
  skills?: string[];
  experienceYears?: number;
  serviceArea?: string;
  portfolioUrl?: string;
  bio?: string;
  createdAt: string;
}

export interface JewelleryDesign {
  id: string;
  title: string;
  titleHi: string;
  category: 'necklaces' | 'rings' | 'earrings' | 'bangles' | 'bridal' | 'traditional' | 'silver' | 'custom';
  description: string;
  descriptionHi: string;
  purity: '24K' | '22K' | '18K' | '925 Silver';
  metalWeightGrams: number;
  stoneWeightCarats?: number;
  gemstones?: string;
  priceEstimate: number;
  imageUrl: string;
  featured?: boolean;
  dimensions?: string;
  makingChargePercent: number;
  createdAt: string;
}

export interface WorkerProfile {
  id: string;
  userId?: string;
  fullName: string;
  phone: string;
  profilePhoto: string;
  skills: Array<
    | 'Goldsmithing'
    | 'Diamond Setting'
    | 'Stone Setting'
    | 'Polishing'
    | 'Casting'
    | 'Jewellery Finishing'
    | 'Jewellery Repair'
    | 'Custom Jewellery Making'
  >;
  experienceYears: number;
  serviceLocation: string;
  bio: string;
  availability: 'Available' | 'Assigned to Project' | 'On Leave';
  dailyRate?: number;
  portfolioImages?: string[];
  rating: number;
  completedJobsCount: number;
}

export type JobStatus = 
  | 'Open' 
  | 'Applied' 
  | 'Shortlisted' 
  | 'Assigned' 
  | 'In Progress' 
  | 'Completed' 
  | 'Cancelled';

export interface JobListing {
  id: string;
  title: string;
  jewelleryType: string;
  requiredSkills: string[];
  quantity: number;
  proposedLabourRate: number;
  rateType: 'per_gram' | 'per_piece' | 'fixed';
  estimatedGoldWeightGrams?: number;
  deadline: string;
  workshopName: string;
  workshopLocation: string;
  description: string;
  status: JobStatus;
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  progressPercent: number;
  createdAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  workerId: string;
  workerName: string;
  workerPhone: string;
  workerSkills: string[];
  appliedAt: string;
  status: 'Pending' | 'Shortlisted' | 'Accepted' | 'Declined';
  notes?: string;
}

export interface GoldLedgerEntry {
  id: string;
  jobId: string;
  orderReference: string;
  workerName: string;
  materialType: 'Yellow Gold' | 'White Gold' | 'Rose Gold' | 'Fine Silver';
  purity: '24K' | '22K' | '18K' | '14K' | '925 Silver';
  goldIssuedGrams: number;
  finishedGoldReturnedGrams: number;
  stoneWeightGrams: number;
  scrapReturnedGrams: number;
  recordedWasteGrams: number;
  adjustmentsGrams: number;
  // Formula: Net Balance = Issued - (FinishedReturned + ScrapReturned + RecordedWaste + Adjustments)
  netRemainingBalanceGrams: number;
  discrepancyStatus: 'Balanced' | 'Acceptable Loss' | 'Human Review Required';
  transactionDate: string;
  notes: string;
}

export interface LabourPayment {
  id: string;
  jobId: string;
  workerName: string;
  workerPhone: string;
  orderReference: string;
  rateType: 'per_gram' | 'per_piece' | 'fixed';
  ratePerUnit: number;
  quantityOrWeight: number;
  grossLabourAmount: number;
  approvedAdjustments: number;
  advancePaid: number;
  additionalPaid: number;
  totalPaid: number;
  remainingBalance: number;
  paymentStatus: 'Unpaid' | 'Partially Paid' | 'Paid';
  paymentDate: string;
  notes?: string;
}

export interface CustomerEnquiry {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  enquiryType: 
    | 'Jewellery Design'
    | 'Custom Jewellery Order'
    | 'Find a Karigar'
    | 'Workshop Registration'
    | 'Existing Order'
    | 'Technical Support'
    | 'Other';
  designReference?: string;
  message: string;
  referenceImage?: string;
  createdAt: string;
  status: 'New' | 'In Discussion' | 'Resolved';
}

export interface MarketRateItem {
  ratePerGram: number;
  ratePer10Gram: number;
  change24h: number;
}

export interface LiveMarketRates {
  gold24k: MarketRateItem;
  gold22k: MarketRateItem;
  gold18k: MarketRateItem;
  silverGram: number;
  silverKg: number;
  diamondPerCaratVVS1: number;
  diamondPerCaratVS1: number;
  diamondPerCaratSI1: number;
  lastUpdated: string;
  dataSource: string;
  isConnected: boolean;
  currency: string;
}

export interface BusinessSettings {
  brandName: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  email: string;
  taglineEn: string;
  taglineHi: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  details: string;
  timestamp: string;
}
