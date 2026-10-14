import { Language } from './types';

export const translations = {
  en: {
    brandName: 'JanSahayak AI',
    brandTagline: 'Your Government Benefits Assistant',
    brandSubtitle: 'Grounded in verified official guidelines. Discover benefits tailored to your family.',
    nav: {
      home: 'Home',
      schemes: 'Discover Schemes',
      dashboard: 'My Dashboard',
      assistant: 'AI Assistant',
      tracker: 'Application Tracker',
      saved: 'Saved Schemes',
      documents: 'Document Helper',
      profile: 'Profile & Privacy',
      admin: 'Admin Portal',
      login: 'Login',
      register: 'Register',
      logout: 'Sign Out'
    },
    hero: {
      title: 'Never Miss a Government Welfare Benefit You Are Entitled To',
      subtitle: 'Scholarships, farmer subsidies, healthcare cover, and pension schemes are scattered across hundreds of official portals. JanSahayak AI evaluates your eligibility in simple language and navigates you to verified official sources.',
      findSchemesCTA: 'Find Schemes for Me',
      browseCatalogCTA: 'Explore All Schemes',
      chatAssistantCTA: 'Ask AI Assistant',
      stats: {
        verifiedSchemes: 'Verified Schemes',
        categories: 'Welfare Categories',
        dbtAssistance: 'Direct Benefit Value',
        accuracyScore: 'Deterministic Matching'
      }
    },
    categories: {
      all: 'All Categories',
      Scholarships: 'Scholarships',
      Agriculture: 'Agriculture & Farmers',
      Education: 'Higher Education',
      Healthcare: 'Healthcare & Insurance',
      Housing: 'Housing Assistance',
      'Women & Child': 'Women & Child Welfare',
      Pensions: 'Senior Citizen Pensions',
      Employment: 'Employment & MSME Loans'
    },
    status: {
      likelyEligible: 'Likely Eligible',
      possiblyEligible: 'Possibly Eligible',
      notEligible: 'Not Eligible',
      insufficientInfo: 'More Info Needed',
      relevanceScore: 'Internal Relevance Score',
      verifiedOfficial: 'Official Verified Source',
      applyOfficial: 'Apply on Official Portal',
      saveScheme: 'Save Scheme',
      saved: 'Saved',
      trackApplication: 'Track Application'
    },
    tracker: {
      title: 'My Application Tracker',
      subtitle: 'Track your personal application milestones. Note: This records user-entered status and does not query internal government portals.',
      emptyState: 'You have not added any schemes to your tracker yet.',
      statuses: {
        INTERESTED: 'Interested',
        CHECKING_ELIGIBILITY: 'Checking Eligibility',
        DOCUMENTS_PREPARED: 'Documents Prepared',
        READY_TO_APPLY: 'Ready to Apply',
        APPLIED: 'Applied on Portal',
        APPROVED: 'Approved',
        REJECTED: 'Rejected',
        NEEDS_FOLLOW_UP: 'Needs Follow-up'
      },
      addNotes: 'Add notes or application reference numbers...',
      setDeadline: 'Target Deadline'
    },
    onboarding: {
      title: 'Citizen Profile Setup',
      subtitle: 'Provide basic demographic information to receive accurate, personalized benefit recommendations. Sensitive details are completely optional and kept strictly confidential.',
      step1: '1. Basic Demographics',
      step2: '2. Occupation & Education',
      step3: '3. Special Eligibility (Optional)',
      ageLabel: 'Age in Years',
      genderLabel: 'Gender',
      stateLabel: 'State of Residence',
      districtLabel: 'District',
      occupationLabel: 'Primary Occupation',
      educationLabel: 'Highest Education Completed',
      incomeLabel: 'Annual Household Income Range',
      socialCategoryLabel: 'Social Category (Optional)',
      farmerQuestion: 'Are you a practicing farmer / landholder?',
      studentQuestion: 'Are you currently an enrolled student?',
      pwdQuestion: 'Are you a Person with Disabilities (PwD)?',
      landQuestion: 'Do you hold registered cultivable agricultural land?',
      privacyNote: 'Why we ask this: Welfare schemes have strict criteria established by government ministries. We use your inputs only to filter eligibility rules.',
      skipOptional: 'Skip Optional Details',
      saveAndContinue: 'Save & View Matching Schemes'
    },
    assistant: {
      title: 'JanSahayak Conversational Assistant',
      subtitle: 'Ask questions in plain English or Telugu. Answers are grounded in verified government guidelines with official application links.',
      inputPlaceholder: 'Ask a question (e.g., Which scholarships can a low-income college student apply for?)...',
      send: 'Ask JanSahayak',
      disclaimer: 'Notice: JanSahayak AI provides preliminary guidance based on official portal documents. Final eligibility and benefit allocation are determined exclusively by the respective government authority.',
      suggestedPrompts: [
        'I am a college student from Andhra Pradesh with low income. Which scholarships can I explore?',
        'What subsidies and income support schemes are available for small farmers?',
        'What documents do I need for PM-KISAN?',
        'Which free health insurance schemes cover hospital treatments up to ₹5 Lakh?'
      ]
    },
    disclaimer: {
      footerNotice: 'JanSahayak AI is an independent citizen assistance utility built to simplify welfare access. It is not affiliated with or endorsed by any government entity. All applications must be submitted directly through official government portals (.gov.in / .nic.in).'
    }
  },
  te: {
    brandName: 'జనసహాయక్ AI',
    brandTagline: 'మీ ప్రభుత్వ సంక్షేమ పథకాల సహాయకుడు',
    brandSubtitle: 'అధికారిక మార్గదర్శకాలతో ధృవీకరించబడింది. మీ కుటుంబానికి సరిపోయే ప్రభుత్వ పథకాలను సులభంగా తెలుసుకోండి.',
    nav: {
      home: 'హోమ్',
      schemes: 'పథకాలు కనుగొనండి',
      dashboard: 'నా డ్యాష్‌బోర్డ్',
      assistant: 'AI సహాయకుడు',
      tracker: 'దరఖాస్తు ట్రాకర్',
      saved: 'భద్రపరిచిన పథకాలు',
      documents: 'పత్రాల సహాయం',
      profile: 'ప్రొఫైల్ & గోప్యత',
      admin: 'అడ్మిన్ పోర్టల్',
      login: 'లాగిన్',
      register: 'రిజిస్టర్',
      logout: 'లాగౌట్'
    },
    hero: {
      title: 'మీకు రావాల్సిన ప్రభుత్వ సంక్షేమ పథకాలను ఎప్పుడూ కోల్పోకండి',
      subtitle: 'స్కాలర్‌షిప్‌లు, రైతు రాయితీలు, ఉచిత ఆరోగ్య బీమా, మరియు పెన్షన్ పథకాల వివరాలు వందలాది పోర్టల్స్‌లో చెల్లాచెదురుగా ఉన్నాయి. జనసహాయక్ AI మీ అర్హతను సరళమైన భాషలో విశ్లేషించి అధికారిక పోర్టల్స్ వైపు నడిపిస్తుంది.',
      findSchemesCTA: 'నాకు సరిపోయే పథకాలు కనుగొనండి',
      browseCatalogCTA: 'అన్ని పథకాలను చూడండి',
      chatAssistantCTA: 'AI ని ప్రశ్నించండి',
      stats: {
        verifiedSchemes: 'ధృవీకరించిన పథకాలు',
        categories: 'సంక్షేమ రంగాలు',
        dbtAssistance: 'నేరుగా పొందే ప్రయోజనం',
        accuracyScore: 'ఖచ్చితమైన అర్హత నిబంధనలు'
      }
    },
    categories: {
      all: 'అన్ని రంగాలు',
      Scholarships: 'స్కాలర్‌షిప్‌లు',
      Agriculture: 'వ్యవసాయం & రైతులు',
      Education: 'ఉన్నత విద్య',
      Healthcare: 'ఆరోగ్యం & బీమా',
      Housing: 'గృహ నిర్మాణం',
      'Women & Child': 'మహిళా & శిశు సంక్షేమం',
      Pensions: 'వృద్ధాప్య పింఛన్లు',
      Employment: 'ఉపాధి & ముద్ర రుణాలు'
    },
    status: {
      likelyEligible: 'అర్హత ఉండే అవకాశం ఉంది',
      possiblyEligible: 'పరిశీలించాల్సిన అర్హత',
      notEligible: 'అర్హత లేదు',
      insufficientInfo: 'మరింత సమాచారం అవసరం',
      relevanceScore: 'అంతర్గత ఔచిత్య స్కోరు',
      verifiedOfficial: 'అధికారిక ధృవీకరించిన వనరు',
      applyOfficial: 'అధికారిక పోర్టల్ లో దరఖాస్తు చేయండి',
      saveScheme: 'సేవ్ చేయండి',
      saved: 'సేవ్ చేయబడింది',
      trackApplication: 'దరఖాస్తు ట్రాక్ చేయండి'
    },
    tracker: {
      title: 'నా దరఖాస్తు ట్రాకర్',
      subtitle: 'మీ దరఖాస్తు పురోగతిని నమోదు చేసుకోండి. గమనిక: ఇది మీ వ్యక్తిగత రికార్డు మాత్రమే, ప్రభుత్వ డేటాబేస్ నుండి నేరుగా సమాచారాన్ని తీసుకోదు.',
      emptyState: 'మీరు ఇంకా ఎటువంటి పథకాలను ట్రాకర్‌లో చేర్చలేదు.',
      statuses: {
        INTERESTED: 'ఆసక్తి ఉంది',
        CHECKING_ELIGIBILITY: 'అర్హత తనిఖీ చేస్తున్నాను',
        DOCUMENTS_PREPARED: 'పత్రాలు సిద్ధం చేశాను',
        READY_TO_APPLY: 'దరఖాస్తుకు సిద్ధంగా ఉంది',
        APPLIED: 'పోర్టల్ లో దరఖాస్తు చేశాను',
        APPROVED: 'మంజూరైంది',
        REJECTED: 'తిరస్కరించబడింది',
        NEEDS_FOLLOW_UP: 'ఫాలో-అప్ అవసరం'
      },
      addNotes: 'నోట్స్ లేదా దరఖాస్తు నంబర్ రాయండి...',
      setDeadline: 'చివరి గడువు'
    },
    onboarding: {
      title: 'పౌరుడి ప్రొఫైల్ వివరాలు',
      subtitle: 'మీకు సరిపోయే సరైన పథకాలను కనుగొనడానికి ప్రాథమిక వివరాలను నమోదు చేయండి. సున్నితమైన వివరాలు పూర్తిగా ఐచ్ఛికం.',
      step1: '1. ప్రాథమిక వివరాలు',
      step2: '2. వృత్తి & చదువు',
      step3: '3. ప్రత్యేక అర్హతలు (ఐచ్ఛికం)',
      ageLabel: 'వయస్సు (సంవత్సరాలు)',
      genderLabel: 'లింగం',
      stateLabel: 'రాష్ట్రం',
      districtLabel: 'జిల్లా',
      occupationLabel: 'ప్రధాన వృత్తి',
      educationLabel: 'విద్యార్హత',
      incomeLabel: 'వార్షిక కుటుంబ ఆదాయం',
      socialCategoryLabel: 'సామాజిక వర్గం (ఐచ్ఛికం)',
      farmerQuestion: 'మీరు రైతు లేదా భూయజమానినా?',
      studentQuestion: 'మీరు ప్రస్తుతం చదువుకుంటున్న విద్యార్థినా?',
      pwdQuestion: 'మీరు దివ్యాంగులా (దివ్యాంగ వర్గం)?',
      landQuestion: 'మీ పేరున నమోదైన సాగుభూమి ఉందా?',
      privacyNote: 'మేము ఎందుకు అడుగుతున్నాము: ప్రభుత్వ పథకాలకు నిర్దిష్ట మార్గదర్శకాలు ఉంటాయి. మీ సమాచారాన్ని కేవలం నిబంధనలను సరిపోల్చడానికే ఉపయోగిస్తాము.',
      skipOptional: 'ఐచ్ఛిక వివరాలను దాటవేయండి',
      saveAndContinue: 'సేవ్ చేసి సరిపోలే పథకాలను చూడండి'
    },
    assistant: {
      title: 'జనసహాయక్ AI సంభాషణ సహాయకుడు',
      subtitle: 'తెలుగు లేదా ఇంగ్లీషులో నేరుగా ప్రశ్నలు అడగండి. అధికారిక ప్రభుత్వ పత్రాల ఆధారంగా సమాధానాలు మరియు పోర్టల్ లింకులు అందించబడతాయి.',
      inputPlaceholder: 'ప్రశ్న అడగండి (ఉదా: తక్కువ ఆదాయం ఉన్న కాలేజీ విద్యార్థులకు ఏ స్కాలర్‌షిప్‌లు ఉన్నాయి?)...',
      send: 'సహాయకుడిని అడగండి',
      disclaimer: 'గమనిక: జనసహాయక్ AI అధికారిక మార్గదర్శకాల ఆధారంగా ప్రాథమిక సమాచారాన్ని మాత్రమే అందిస్తుంది. తుది అర్హత మరియు ప్రయోజనాల కేటాయింపు సంబంధిత ప్రభుత్వ శాఖ నిర్ణయంపై ఆధారపడి ఉంటుంది.',
      suggestedPrompts: [
        'నేను ఆంధ్రప్రదేశ్‌కు చెందిన తక్కువ ఆదాయం గల కాలేజీ విద్యార్థిని. నాకేమి స్కాలర్‌షిప్‌లు ఉన్నాయి?',
        'చిన్న మరియు సన్నకారు రైతులకు ఏయే సబ్సిడీ పథకాలు అందుబాటులో ఉన్నాయి?',
        'పీఎం-కిసాన్ పథకం కోసం ఏయే పత్రాలు అవసరం?',
        'ఆసుపత్రి ఖర్చుల కోసం ₹5 లక్షల వరకు ఉచిత బీమా ఇచ్చే పథకం ఏది?'
      ]
    },
    disclaimer: {
      footerNotice: 'జనసహాయక్ AI పౌరులకు సంక్షేమ పథకాలను సులభతరం చేసే స్వతంత్ర సాంకేతిక సహాయక సాధనం. ఇది ప్రభుత్వ విభాగాలతో నేరుగా అనుబంధించబడలేదు. అన్ని దరఖాస్తులను అధికారిక ప్రభుత్వ పోర్టల్స్ (.gov.in / .nic.in) లోనే సమర్పించాలి.'
    }
  }
};
