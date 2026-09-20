import { Language } from '../types';

export interface TranslationDictionary {
  appName: string;
  appSubtitle: string;
  landingHeadline: string;
  landingDesc: string;
  startSafely: string;
  howItWorks: string;
  privacyStatement: string;
  privacyBadge: string;
  quickExit: string;
  quickExitTip: string;
  
  // Navigation
  dashboard: string;
  deepdetect: string;
  shieldscan: string;
  safedoc: string;
  safevoice: string;
  casediary: string;
  trustcircle: string;
  privacyCenter: string;
  
  // Dashboard
  activeCasesCount: string;
  upcomingFollowUps: string;
  localStorageStatus: string;
  privacyStatusTitle: string;
  privacyStatusActive: string;
  
  // Privacy Intro
  privacyIntroTitle: string;
  onDeviceProcessingTitle: string;
  onDeviceProcessingDesc: string;
  noAutoUploadTitle: string;
  noAutoUploadDesc: string;
  userControlTitle: string;
  userControlDesc: string;
  screeningNoticeTitle: string;
  screeningNoticeDesc: string;
  noPerpTitle: string;
  noPerpDesc: string;
  
  // Privacy Center
  whatStaysOnDevice: string;
  whatSentToServer: string;
  userConsentStatus: string;
  storedDataSummary: string;
  deleteMyData: string;
  exportMyData: string;
  confirmDelete: string;
  deleteWarning: string;
  
  // Action Buttons
  save: string;
  cancel: string;
  delete: string;
  export: string;
  uploadMedia: string;
  checkMedia: string;
  generateComplaint: string;
  addFollowUp: string;
  addContact: string;
}

const enTranslations: TranslationDictionary = {
  appName: 'ShieldHer',
  appSubtitle: 'AI-Assisted Digital Safety Toolkit',
  landingHeadline: 'Private tools for detecting, documenting, and responding to image-based abuse.',
  landingDesc: 'Empowering survivors with on-device AI analysis, structured evidence preservation, trauma-informed guidance, and verified support resources.',
  startSafely: 'Start Safely',
  howItWorks: 'How ShieldHer Works',
  privacyStatement: 'Your media remains on your device. ShieldHer operates with strict zero-upload default privacy.',
  privacyBadge: '100% On-Device Mode',
  quickExit: 'Quick Exit',
  quickExitTip: 'Press ESC or click Quick Exit at any time to instantly hide this app.',
  
  dashboard: 'Dashboard',
  deepdetect: 'Check Suspicious Media',
  shieldscan: 'ShieldScan',
  safedoc: 'Document Evidence',
  safevoice: 'SafeVoice Guidance',
  casediary: 'Case Diary',
  trustcircle: 'TrustCircle Contacts',
  privacyCenter: 'Privacy Center',
  
  activeCasesCount: 'Active Cases',
  upcomingFollowUps: 'Upcoming Follow-ups',
  localStorageStatus: 'Local Storage Encrypted',
  privacyStatusTitle: 'Privacy Status',
  privacyStatusActive: 'On-Device Processing Active',
  
  privacyIntroTitle: 'Understanding Your Privacy on ShieldHer',
  onDeviceProcessingTitle: 'Processed On-Device By Default',
  onDeviceProcessingDesc: 'All image checks, hash generation, and case notes happen locally in your browser memory and IndexedDB.',
  noAutoUploadTitle: 'Zero Automatic Uploads',
  noAutoUploadDesc: 'ShieldHer will never send your photos, videos, or confidential documents to external servers without explicit consent.',
  userControlTitle: 'Total Data Ownership',
  userControlDesc: 'You hold full control over your stored case files and can export or wipe all local data with a single click.',
  screeningNoticeTitle: 'AI Screening Notice',
  screeningNoticeDesc: 'Detection results provide preliminary technical screening metrics, not definitive legal proof.',
  noPerpTitle: 'Focus on Safety & Legal Remedy',
  noPerpDesc: 'ShieldHer assists with evidence collection and reporting. It does not actively hunt or identify individual perpetrators.',
  
  whatStaysOnDevice: 'Stays On Your Device',
  whatSentToServer: 'Sent To Server (Only With Explicit Consent)',
  userConsentStatus: 'Consent Status',
  storedDataSummary: 'Stored Local Data Summary',
  deleteMyData: 'Delete All Local Data',
  exportMyData: 'Export Case Data (Encrypted)',
  confirmDelete: 'Are you sure you want to permanently delete all local cases and evidence?',
  deleteWarning: 'This action cannot be undone.',
  
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  export: 'Export',
  uploadMedia: 'Select File privately',
  checkMedia: 'Analyze Media On-Device',
  generateComplaint: 'Generate Cyber Cell Complaint',
  addFollowUp: 'Add Follow-Up Reminder',
  addContact: 'Add Trusted Contact'
};

const taTranslations: TranslationDictionary = {
  appName: 'ShieldHer',
  appSubtitle: 'டிஜிட்டல் பாதுகாப்பு கருவித் தொகுப்பு',
  landingHeadline: 'உருவப் படத்தை அடிப்படையாகக் கொண்ட துஷ்பிரயோகங்களை கண்டறிய, ஆவணப்படுத்த மற்றும் எதிர்கொள்ளும் தனிப்பட்ட கருவிகள்.',
  landingDesc: 'உங்களின் புகைப்படங்கள் சாதனத்திலேயே பாதுகாப்பாக பகுப்பாய்வு செய்யப்பட்டு, ஆதாரங்கள் சேகரிக்கப்படும்.',
  startSafely: 'பாதுகாப்பாக தொடங்குங்கள்',
  howItWorks: 'ShieldHer எவ்வாறு இயங்குகிறது',
  privacyStatement: 'உங்கள் ஊடகம் உங்கள் சாதனத்திலேயே இருக்கும். அனுமதி இன்றி எதுவும் பதிவேற்றப்படாது.',
  privacyBadge: '100% சாதனத்திலேயே இயங்கும் முறை',
  quickExit: 'உடனடி வெளியேற்றம் (Quick Exit)',
  quickExitTip: 'எந்த நேரத்திலும் ESC அல்லது Quick Exit ஐ அழுத்தி பக்கத்தை உடனடியாக மறைக்கவும்.',
  
  dashboard: 'டாஷ்போர்டு',
  deepdetect: 'சந்தேகத்திற்குரிய ஊடகத்தை சரிபார்க்கவும்',
  shieldscan: 'ShieldScan ஸ்கேனர்',
  safedoc: 'ஆதாரங்களை ஆவணப்படுத்தவும்',
  safevoice: 'SafeVoice வழிகாட்டல்',
  casediary: 'வழக்கு நாட்குறிப்பு',
  trustcircle: 'நம்பிக்கை வட்டம் (TrustCircle)',
  privacyCenter: 'தனியுரிமை மையம்',
  
  activeCasesCount: 'செயலில் உள்ள வழக்குகள்',
  upcomingFollowUps: 'அடுத்தகட்ட நடவடிக்கைகள்',
  localStorageStatus: 'உள்ளூர் சேமிப்பகம் குறியாக்கம் செய்யப்பட்டது',
  privacyStatusTitle: 'தனியுரிமை நிலை',
  privacyStatusActive: 'சாதன செயலாக்கம் செயல்படுகிறது',
  
  privacyIntroTitle: 'ShieldHer இல் உங்கள் தனியுரிமை',
  onDeviceProcessingTitle: 'சாதனத்திலேயே பகுப்பாய்வு',
  onDeviceProcessingDesc: 'அனைத்து பட ஆய்வுகளும் உங்கள் உலாவியிலேயே மேற்கொள்ளப்படும்.',
  noAutoUploadTitle: 'தானியங்கி பதிவேற்றம் இல்லை',
  noAutoUploadDesc: 'உங்கள் அனுமதி இன்றி எந்த புகைப்படமும் சேவையகத்திற்கு அனுப்பப்படாது.',
  userControlTitle: 'முழு கட்டுப்பாடு',
  userControlDesc: 'உங்கள் தரவை எந்த நேரத்திலும் ஏற்றுமதி செய்யவோ அல்லது அழிக்கவோ முடியும்.',
  screeningNoticeTitle: 'AI சோதனைக் குறிப்பு',
  screeningNoticeDesc: 'கண்டறிதல் முடிவுகள் முதன்மை தொழில்நுட்பக் குறிப்புகளே தவிர, சட்டப்பூர்வ சான்று அல்ல.',
  noPerpTitle: 'பாதுகாப்பு & சட்ட உதவி',
  noPerpDesc: 'ShieldHer ஆதாரங்களை சேகரிக்க உதவுகிறது; தனிநபர்களை பின் தொடரவோ அடையாளம் காணவோ செய்யாது.',
  
  whatStaysOnDevice: 'சாதனத்திலேயே இருக்கும் தரவு',
  whatSentToServer: 'சேவையகத்திற்கு அனுப்பப்படுவது (சம்மதத்துடன் மட்டுமே)',
  userConsentStatus: 'சம்மத நிலை',
  storedDataSummary: 'சேமிக்கப்பட்ட தரவு சுருக்கம்',
  deleteMyData: 'அனைத்து உள்ளூர் தரவையும் நீக்கு',
  exportMyData: 'வழக்கு தரவை ஏற்றுமதி செய்',
  confirmDelete: 'அனைத்து உள்ளூர் வழக்குகள் மற்றும் ஆதாரங்களை நிரந்தரமாக நீக்க வேண்டுமா?',
  deleteWarning: 'இந்த நடவடிக்கையை மீட்டெடுக்க முடியாது.',
  
  save: 'சேமி',
  cancel: 'ரத்து செய்',
  delete: 'நீக்கு',
  export: 'ஏற்றுமதி',
  uploadMedia: 'கோப்பைத் தேர்ந்தெடு',
  checkMedia: 'ஊடகத்தை ஆய்வு செய்',
  generateComplaint: 'புகார் மனுவை உருவாக்கு',
  addFollowUp: 'நினைவூட்டல் சேர்',
  addContact: 'நம்பிக்கைக்குரிய தொடர்பைச் சேர்'
};

const hiTranslations: TranslationDictionary = {
  appName: 'ShieldHer',
  appSubtitle: 'एआई-सहायता प्राप्त डिजिटल सुरक्षा टूलकिट',
  landingHeadline: 'छवि-आधारित दुरुपयोग का पता लगाने, दस्तावेजीकरण करने और प्रतिक्रिया देने के लिए निजी उपकरण।',
  landingDesc: 'पीड़ितों को ऑन-डिवाइस एआई विश्लेषण, संरचित साक्ष्य संरक्षण और सत्यापित सहायता संसाधनों के साथ सशक्त बनाना।',
  startSafely: 'सुरक्षित रूप से शुरू करें',
  howItWorks: 'ShieldHer कैसे काम करता है',
  privacyStatement: 'आपका मीडिया आपके डिवाइस पर ही रहता है। बिना सहमति के कोई स्वचालित अपलोड नहीं होता।',
  privacyBadge: '100% ऑन-डिवाइस मोड',
  quickExit: 'त्वरित निकास (Quick Exit)',
  quickExitTip: 'इस ऐप को तुरंत छिपाने के लिए किसी भी समय ESC या क्विक एग्जिट दबाएं।',
  
  dashboard: 'डैशबोर्ड',
  deepdetect: 'संदिग्ध मीडिया की जाँच करें',
  shieldscan: 'शील्डस्कैन',
  safedoc: 'साक्ष्य का दस्तावेजीकरण करें',
  safevoice: 'सेफवॉइस मार्गदर्शन',
  casediary: 'मामला डायरी',
  trustcircle: 'ट्रस्टसर्कल संपर्क',
  privacyCenter: 'गोपनीयता केंद्र',
  
  activeCasesCount: 'सक्रिय मामले',
  upcomingFollowUps: 'आगामी फॉलो-अप',
  localStorageStatus: 'स्थानीय संग्रहण एन्क्रिप्टेड',
  privacyStatusTitle: 'गोपनीयता स्थिति',
  privacyStatusActive: 'ऑन-डिवाइस प्रोसेसिंग सक्रिय',
  
  privacyIntroTitle: 'ShieldHer पर आपकी गोपनीयता',
  onDeviceProcessingTitle: 'डिफ़ॉल्ट रूप से ऑन-डिवाइस प्रोसेसिंग',
  onDeviceProcessingDesc: 'सभी चित्र जांच आपके ब्राउज़र मेमोरी में स्थानीय रूप से होती हैं।',
  noAutoUploadTitle: 'शून्य स्वचालित अपलोड',
  noAutoUploadDesc: 'स्पष्ट सहमति के बिना आपकी तस्वीरें कभी भी बाहरी सर्वर पर नहीं भेजी जाती हैं।',
  userControlTitle: 'पूर्ण डेटा नियंत्रण',
  userControlDesc: 'आप अपने संग्रहित मामले की फाइलों पर पूर्ण नियंत्रण रखते हैं।',
  screeningNoticeTitle: 'एआई स्क्रीनिंग नोटिस',
  screeningNoticeDesc: 'परिणाम प्रारंभिक तकनीकी निष्कर्ष हैं, कानूनी प्रमाण नहीं।',
  noPerpTitle: 'सुरक्षा और कानूनी उपाय',
  noPerpDesc: 'ShieldHer साक्ष्य संग्रह और रिपोर्टिंग में सहायता करता है।',
  
  whatStaysOnDevice: 'आपके डिवाइस पर क्या रहता है',
  whatSentToServer: 'सर्वर पर क्या भेजा जाता है (केवल सहमति से)',
  userConsentStatus: 'सहमति स्थिति',
  storedDataSummary: 'संग्रहीत स्थानीय डेटा का सारांश',
  deleteMyData: 'सभी स्थानीय डेटा हटाएं',
  exportMyData: 'केस डेटा निर्यात करें',
  confirmDelete: 'क्या आप निश्चित रूप से सभी स्थानीय मामलों को हमेशा के लिए हटाना चाहते हैं?',
  deleteWarning: 'यह कार्रवाई पूर्ववत नहीं की जा सकती।',
  
  save: 'सहेजें',
  cancel: 'रद्द करें',
  delete: 'हटाएं',
  export: 'निर्यात',
  uploadMedia: 'फ़ाइल चुनें',
  checkMedia: 'मी़डिया विश्लेषण करें',
  generateComplaint: 'शिकायत दस्तावेज़ बनाएँ',
  addFollowUp: 'रिमाइंडर जोड़ें',
  addContact: 'विश्वसनीय संपर्क जोड़ें'
};

export const translations: Record<Language, TranslationDictionary> = {
  en: enTranslations,
  ta: taTranslations,
  hi: hiTranslations,
  te: enTranslations,
  kn: enTranslations,
  ml: enTranslations
};
