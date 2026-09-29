import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Taglines
    brandName: 'SRIKANTH GHORAI',
    tagline: 'Where Every Gram Tells a Story.',
    heroHeadline: 'Where Every Gram Tells a Story.',
    heroSubheadline: 'Discover exquisite jewellery, connect with skilled karigars, and manage atelier operations through one unified luxury platform.',
    artisanGuildPill: 'MASTER JEWELLERY ATELIER & ARTISAN GUILD',

    // Navigation
    home: 'Home',
    jewelleryDesigns: 'Jewellery Designs',
    workersAndJobs: 'Workers & Jobs',
    goldRates: 'Gold Rates',
    workshopDashboard: 'Workshop Dashboard',
    aboutUs: 'About Us',
    contactAndLocation: 'Contact & Location',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    profile: 'Profile',
    adminDashboard: 'Admin Panel',

    // Hero buttons
    exploreJewellery: 'Explore Jewellery',
    findKarigar: 'Find a Karigar',
    registerWorkshop: 'Register Your Workshop',
    contactUs: 'Contact Us',

    // Live Bullion Rates
    liveRatesTitle: 'LIVE BULLION & PRECIOUS METALS MARKET',
    gold24k: '24K Gold',
    gold22k: '22K Gold',
    gold18k: '18K Gold',
    silverRate: 'Fine Silver',
    diamondRate: 'Diamond (1 Carat)',
    perGram: 'per gram',
    per10g: 'per 10g',
    perKg: 'per kg',
    lastUpdated: 'Updated',
    refreshRates: 'Refresh Live Rates',
    ratesDisclaimer: 'Actual retail jewellery prices vary according to hallmark purity, artisan making charges, local taxes, and gemstone quality certification.',
    liveRatesConnected: 'Live Market Data Connected',
    liveRatesNotConnected: 'Live Rates Not Connected (Using Certified Reserve Benchmarks)',

    // Workshop preview stats
    activeWorkshops: 'Active Workshops',
    registeredKarigars: 'Registered Karigars',
    goldLedgerBalance: 'Gold Ledger Reserve',
    activeCustomOrders: 'Active Custom Orders',
    goldIssued: 'Gold Issued',
    goldReturned: 'Gold Returned',
    scrapRecovered: 'Scrap Recovered',
    netVaultBalance: 'Net Vault Balance',

    // Curated section
    curatedMasterpieces: 'Curated Masterpieces',
    curatedSub: 'Handcrafted in BIS hallmarked yellow gold, polki, uncut diamonds, and certified gems.',
    viewAllDesigns: 'View All Collections',
    inspectAndInquire: 'Inspect & Enquire',
    enquireNow: 'Enquire Now',
    requestCustomDesign: 'Request Custom Design',

    // Design categories
    allDesigns: 'All Designs',
    necklaces: 'Gold Necklaces',
    rings: 'Diamond Rings',
    earrings: 'Earrings',
    bangles: 'Bangles & Bracelets',
    bridal: 'Bridal Suites',
    traditional: 'Traditional & Nakshi',
    silver: 'Silver Artefacts',
    custom: 'Custom Commissions',

    // Workers & Jobs
    artisanGuild: 'Artisan Guild & Worker Marketplace',
    artisanDirectory: 'Artisan Directory',
    activeJobs: 'Active Job Openings',
    goldLedgerAndPayouts: 'Gold Weight Ledger & Labour',
    applyForJob: 'Apply for Artisan Job',
    createJobListing: 'Create Job Listing',
    experience: 'Experience',
    specialisation: 'Specialisation',
    location: 'Location',
    availability: 'Availability',
    contactWorker: 'Contact Karigar',
    proposedLabourRate: 'Proposed Labour Rate',
    quantity: 'Quantity',
    deadline: 'Deadline',
    status: 'Status',
    applyNow: 'Apply Now',

    // Gold Weight Ledger
    goldLedgerTitle: 'Atelier Gold Weight & Scrap Ledger',
    addTransaction: 'Add Material Transaction',
    jobId: 'Job ID',
    orderRef: 'Order Reference',
    workerName: 'Karigar Name',
    materialPurity: 'Material & Purity',
    issuedWeight: 'Gold Issued (g)',
    returnedWeight: 'Finished Returned (g)',
    stoneWeight: 'Stone Wt (g)',
    scrapWeight: 'Scrap Returned (g)',
    wasteWeight: 'Recorded Waste (g)',
    balanceWeight: 'Net Balance (g)',
    discrepancy: 'Audit Status',
    printLedger: 'Print Ledger',
    exportCsv: 'Export CSV',
    balanced: 'Balanced',
    acceptableLoss: 'Acceptable Waste',
    reviewRequired: 'Human Review Required',

    // Labour & Payments
    labourLedgerTitle: 'Karigar Labour Charges & Payment Ledger',
    rateType: 'Rate Type',
    perGramRate: 'Per Gram',
    perPieceRate: 'Per Piece',
    fixedRate: 'Fixed Charge',
    grossAmount: 'Gross Labour',
    advancePaid: 'Advance Paid',
    totalPaid: 'Total Paid',
    remainingBalance: 'Remaining Due',
    recordAdvance: 'Record Advance',
    addPayment: 'Add Payment',
    printReceipt: 'Print Receipt',
    paymentStatus: 'Payment Status',
    unpaid: 'Unpaid',
    partiallyPaid: 'Partially Paid',
    paid: 'Paid In Full',

    // About Us
    aboutHeading: 'Crafting Trust. Connecting Artisans.',
    aboutDesc: 'Founded by master jeweller Srikanth Ghorai, our atelier bridges generational Indian goldsmith heritage with strict modern transparency and ethical gold accounting.',
    missionTitle: 'Our Mission',
    craftsmanshipTitle: 'Living Craftsmanship',
    marketplaceTitle: 'Artisan Guild & Dignity',
    transparentAccounting: 'Gram-Level Transparency',

    // Contact
    contactHeading: 'Connect with Srikanth Ghorai',
    contactSub: 'Visit our atelier or connect with our master concierge for bespoke orders, workshop onboarding, or artisan queries.',
    addressLabel: 'Near Anil Apartment, Mulund East, Mumbai, Maharashtra, India',
    phoneLabel: '+91 9167671944',
    callDirect: 'Call +91 9167671944',
    whatsAppConcierge: 'WhatsApp Concierge',
    copyNumber: 'Copy Number',
    getDirections: 'Get Directions',
    useCurrentLocation: 'Use My Current Location',
    distanceToAtelier: 'Distance from your location to Mulund Atelier',
    calculatingLocation: 'Accessing GPS location...',
    locationDenied: 'Location permission was denied. You can still use the map or click Get Directions below.',
    sendMessage: 'Send an Atelier Message',
    fullName: 'Full Name',
    phone: 'Phone Number',
    email: 'Email (Optional)',
    enquiryType: 'Enquiry Type',
    message: 'Message & Specifications',
    submitEnquiry: 'Submit Enquiry',
    enquirySuccess: 'Thank you! Your enquiry has been received by Srikanth Ghorai. We will reach out within 2 hours.',

    // Auth
    welcomeBack: 'Welcome to Srikanth Ghorai',
    signInToAccount: 'Sign in to access your workshop dashboard, ledger, or artisan portfolio.',
    emailOrPhone: 'Email Address',
    password: 'Password',
    showPassword: 'Show Password',
    hidePassword: 'Hide Password',
    forgotPassword: 'Forgot Password?',
    signIn: 'Sign In',
    noAccount: "Don't have an account?",
    registerNow: 'Create an Account',
    registerTitle: 'Join the Atelier Guild',
    selectRole: 'Select Your Profile Type',
    workshopOwner: 'Workshop Owner',
    workshopManager: 'Workshop Manager / Accountant',
    jewelleryArtisan: 'Jewellery Artisan / Karigar',
    customer: 'Jewellery Customer',
    workshopName: 'Workshop Name',
    workshopAddress: 'Workshop Address',
    skills: 'Artisanal Skills',
    experienceYears: 'Years of Experience',
    serviceArea: 'Service Area / City',
    iAgreeTerms: 'I agree to the Atelier Terms of Service and Ethical Gold Standard Policy.',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    resetPassword: 'Reset Password',
    sendResetLink: 'Send Password Reset Link',

    // Admin
    adminTitle: 'Master Atelier Administration',
    overview: 'Overview',
    manageDesigns: 'Manage Designs',
    manageJobs: 'Job Moderation',
    manageEnquiries: 'Customer Enquiries',
    marketRateConfig: 'Market Rates Provider',
    businessSettings: 'Business & Map Settings',
    auditLogs: 'Security Audit Logs'
  },
  hi: {
    // Brand & Taglines
    brandName: 'श्रीकांत घोरई',
    tagline: 'हर ग्राम में हुनर, हर कारीगर की पहचान।',
    heroHeadline: 'हर ग्राम में हुनर, हर कारीगर की पहचान।',
    heroSubheadline: 'उत्कृष्ट आभूषण खोजें, कुशल कारीगरों से जुड़ें और एक ही पेशेवर मंच से अपनी आभूषण कार्यशाला का संचालन करें।',
    artisanGuildPill: 'मास्टर ज्वैलरी कार्यशाला एवं कारीगर गिल्ड',

    // Navigation
    home: 'होम',
    jewelleryDesigns: 'आभूषण डिज़ाइन',
    workersAndJobs: 'कारीगर व कार्य',
    goldRates: 'सोने का भाव',
    workshopDashboard: 'कार्यशाला डैशबोर्ड',
    aboutUs: 'हमारे बारे में',
    contactAndLocation: 'संपर्क व पता',
    login: 'लॉग इन',
    register: 'रजिस्टर करें',
    logout: 'लॉग आउट',
    profile: 'प्रोफ़ाइल',
    adminDashboard: 'एडमिन पैनल',

    // Hero buttons
    exploreJewellery: 'आभूषण देखें',
    findKarigar: 'कारीगर खोजें',
    registerWorkshop: 'अपनी कार्यशाला जोड़ें',
    contactUs: 'संपर्क करें',

    // Live Bullion Rates
    liveRatesTitle: 'लाइव सोने और चांदी का बाजार भाव',
    gold24k: '24K सोना',
    gold22k: '22K सोना',
    gold18k: '18K सोना',
    silverRate: 'शुद्ध चांदी',
    diamondRate: 'हीरा (1 कैरेट)',
    perGram: 'प्रति ग्राम',
    per10g: 'प्रति 10 ग्राम',
    perKg: 'प्रति किलोग्राम',
    lastUpdated: 'अपडेटेड',
    refreshRates: 'भाव रीफ़्रेश करें',
    ratesDisclaimer: 'वास्तविक आभूषण मूल्य हॉलमार्क शुद्धता, मेकिंग चार्ज, स्थानीय कर व रत्नों की गुणवत्ता के अनुसार भिन्न हो सकते हैं।',
    liveRatesConnected: 'लाइव मार्केट डेटा जुड़ा हुआ है',
    liveRatesNotConnected: 'लाइव रेट्स कनेक्टेड नहीं हैं (प्रमाणित मानक दरें प्रदर्शित)',

    // Workshop preview stats
    activeWorkshops: 'सक्रिय कार्यशालाएं',
    registeredKarigars: 'पंजीकृत कारीगर',
    goldLedgerBalance: 'गोल्ड लेज़र रिज़र्व',
    activeCustomOrders: 'सक्रिय कस्टम ऑर्डर्स',
    goldIssued: 'जारी किया सोना',
    goldReturned: 'प्राप्त निर्मित सोना',
    scrapRecovered: 'वापस स्क्रैप',
    netVaultBalance: 'तिजोरी शुद्ध शेष',

    // Curated section
    curatedMasterpieces: 'विशेष संग्रह',
    curatedSub: '22K हॉलमार्क पीले सोने, पोलकी, अनकट हीरे और प्राकृतिक रत्नों से हस्तनिर्मित।',
    viewAllDesigns: 'सभी डिज़ाइन देखें',
    inspectAndInquire: 'विवरण व पूछताछ',
    enquireNow: 'पूछताछ करें',
    requestCustomDesign: 'कस्टम डिज़ाइन का अनुरोध करें',

    // Design categories
    allDesigns: 'सभी डिज़ाइन',
    necklaces: 'सोने के हार (नेकलेस)',
    rings: 'हीरे की अंगूठियां',
    earrings: 'झुमके व बालियां',
    bangles: 'कंगन व चूड़ियां',
    bridal: 'दुल्हन आभूषण सेट',
    traditional: 'पारंपरिक व नक्शी',
    silver: 'चांदी की वस्तुएं',
    custom: 'कस्टम आभूषण',

    // Workers & Jobs
    artisanGuild: 'कारीगर गिल्ड एवं जॉब मार्केटप्लेस',
    artisanDirectory: 'कारीगर निर्देशिका',
    activeJobs: 'सक्रिय जॉब्स / रिक्तियां',
    goldLedgerAndPayouts: 'सोने का वजन लेज़र व मजदूरी',
    applyForJob: 'कारीगर काम के लिए आवेदन करें',
    createJobListing: 'नया जॉब लिस्ट करें',
    experience: 'अनुभव',
    specialisation: 'विशेषज्ञता',
    location: 'स्थान',
    availability: 'उपलब्धता',
    contactWorker: 'कारीगर से संपर्क करें',
    proposedLabourRate: 'प्रस्तावित मजदूरी दर',
    quantity: 'मात्रा',
    deadline: 'अंतिम तिथि',
    status: 'स्थिति',
    applyNow: 'आवेदन करें',

    // Gold Weight Ledger
    goldLedgerTitle: 'कार्यशाला सोना व स्क्रैप वजन खाता (लेज़र)',
    addTransaction: 'सोना लेन-देन दर्ज करें',
    jobId: 'जॉब आईडी',
    orderRef: 'ऑर्डर संदर्भ',
    workerName: 'कारीगर का नाम',
    materialPurity: 'धातु व शुद्धता',
    issuedWeight: 'जारी सोना (ग्राम)',
    returnedWeight: 'निर्मित प्राप्त (ग्राम)',
    stoneWeight: 'रत्न वजन (ग्राम)',
    scrapWeight: 'स्क्रैप वापस (ग्राम)',
    wasteWeight: 'दर्ज घट/वेस्टेज (ग्राम)',
    balanceWeight: 'शेष बकाया (ग्राम)',
    discrepancy: 'ऑडिट स्थिति',
    printLedger: 'लेज़र प्रिंट करें',
    exportCsv: 'CSV निर्यात करें',
    balanced: 'संतुलित (शून्य अंतर)',
    acceptableLoss: 'मान्य सामान्य वेस्टेज',
    reviewRequired: 'मानवीय समीक्षा आवश्यक',

    // Labour & Payments
    labourLedgerTitle: 'कारीगर मजदूरी शुल्क व भुगतान खाता',
    rateType: 'दर का प्रकार',
    perGramRate: 'प्रति ग्राम',
    perPieceRate: 'प्रति पीस',
    fixedRate: 'निश्चित चार्ज',
    grossAmount: 'कुल मजदूरी',
    advancePaid: 'अग्रिम भुगतान',
    totalPaid: 'कुल चुकाया गया',
    remainingBalance: 'शेष बकाया मजदूरी',
    recordAdvance: 'अग्रिम दर्ज करें',
    addPayment: 'भुगतान जोड़ें',
    printReceipt: 'रसीद प्रिंट करें',
    paymentStatus: 'भुगतान स्थिति',
    unpaid: 'अदत्त (बाकी)',
    partiallyPaid: 'आंशिक भुगतान',
    paid: 'पूर्ण भुगतान',

    // About Us
    aboutHeading: 'विश्वास का निर्माण। कारीगरों का सम्मान।',
    aboutDesc: 'मास्टर ज्वैलर श्रीकांत घोरई द्वारा स्थापित, हमारा प्रतिष्ठान पारंपरिक भारतीय स्वर्णकारी विरासत को पारदर्शी लेखा-जोखा और आधुनिक कारीगर सशक्तिकरण के साथ जोड़ता है।',
    missionTitle: 'हमारा ध्येय',
    craftsmanshipTitle: 'जीवंत कारीगरी',
    marketplaceTitle: 'कारीगर गिल्ड व स्वाभिमान',
    transparentAccounting: 'ग्राम स्तर की पूर्ण पारदर्शिता',

    // Contact
    contactHeading: 'श्रीकांत घोरई से संपर्क करें',
    contactSub: 'हमारी कार्यशाला पधारें या कस्टम आभूषण, कार्यशाला पंजीकरण अथवा कारीगर से जुड़ी जानकारी हेतु संपर्क करें।',
    addressLabel: 'अनिल अपार्टमेंट के पास, मुलुंड पूर्व, मुंबई, महाराष्ट्र, भारत',
    phoneLabel: '+91 9167671944',
    callDirect: 'सीधे कॉल करें (+91 9167671944)',
    whatsAppConcierge: 'व्हाट्सएप पर बात करें',
    copyNumber: 'नंबर कॉपी करें',
    getDirections: 'रास्ता देखें',
    useCurrentLocation: 'मेरा वर्तमान स्थान उपयोग करें',
    distanceToAtelier: 'आपके स्थान से मुलुंड कार्यशाला की दूरी',
    calculatingLocation: 'जीपीएस स्थान प्राप्त किया जा रहा है...',
    locationDenied: 'स्थान अनुमति अस्वीकृत हुई। आप अभी भी नीचे दिए गए नक्शे और रास्ते का उपयोग कर सकते हैं।',
    sendMessage: 'संदेश भेजें',
    fullName: 'पूरा नाम',
    phone: 'फ़ोन नंबर',
    email: 'ईमेल (वैकल्पिक)',
    enquiryType: 'पूछताछ का प्रकार',
    message: 'संदेश व आभूषण का विवरण',
    submitEnquiry: 'पूछताछ सबमिट करें',
    enquirySuccess: 'धन्यवाद! आपकी पूछताछ श्रीकांत घोरई को प्राप्त हो गई है। हमारी टीम 2 घंटे के भीतर संपर्क करेगी।',

    // Auth
    welcomeBack: 'श्रीकांत घोरई पोर्टल में आपका स्वागत है',
    signInToAccount: 'अपने कार्यशाला डैशबोर्ड, लेज़र या कारीगर प्रोफ़ाइल के लिए साइन इन करें।',
    emailOrPhone: 'ईमेल पता',
    password: 'पासवर्ड',
    showPassword: 'पासवर्ड देखें',
    hidePassword: 'पासवर्ड छिपाएं',
    forgotPassword: 'पासवर्ड भूल गए?',
    signIn: 'साइन इन करें',
    noAccount: 'खाता नहीं है?',
    registerNow: 'नया खाता बनाएं',
    registerTitle: 'कारीगर गिल्ड से जुड़ें',
    selectRole: 'प्रोफ़ाइल प्रकार चुनें',
    workshopOwner: 'कार्यशाला स्वामी (ओनर)',
    workshopManager: 'कार्यशाला प्रबंधक / मुनीम',
    jewelleryArtisan: 'आभूषण कारीगर / स्वर्णकार',
    customer: 'आभूषण ग्राहक',
    workshopName: 'कार्यशाला का नाम',
    workshopAddress: 'कार्यशाला का पता',
    skills: 'कारीगरी कौशल',
    experienceYears: 'अनुभव (वर्ष)',
    serviceArea: 'सेवा क्षेत्र / शहर',
    iAgreeTerms: 'मैं कार्यशाला की सेवा शर्तों और नैतिक स्वर्ण नीति से सहमत हूं।',
    createAccount: 'खाता बनाएं',
    alreadyHaveAccount: 'पहले से खाता है?',
    resetPassword: 'पासवर्ड रीसेट करें',
    sendResetLink: 'पासवर्ड रीसेट लिंक भेजें',

    // Admin
    adminTitle: 'मास्टर प्रतिष्ठान एडमिनिस्ट्रेशन',
    overview: 'सारांश',
    manageDesigns: 'डिज़ाइन प्रबंधन',
    manageJobs: 'जॉब मॉडरेशन',
    manageEnquiries: 'ग्राहक पूछताछ',
    marketRateConfig: 'मार्केट रेट्स प्रोवाइडर',
    businessSettings: 'व्यवसाय व नक्शा सेटिंग',
    auditLogs: 'सुरक्षा ऑडिट लॉग'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('sg_language');
    return (saved === 'hi' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sg_language', lang);
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'hi' : 'en';
    setLanguage(nextLang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
