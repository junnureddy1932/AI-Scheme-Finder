import React from 'react';
import { CheckCircle2, AlertCircle, XCircle, HelpCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface EligibilityBadgeProps {
  status: 'Likely eligible' | 'Possibly eligible' | 'Not eligible' | 'Insufficient information' | string;
  score?: number;
  showScore?: boolean;
}

export const EligibilityBadge: React.FC<EligibilityBadgeProps> = ({
  status,
  score,
  showScore = true,
}) => {
  const { language } = useApp();
  const isTe = language === 'te';

  let config = {
    label: status,
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: <HelpCircle className="w-4 h-4 mr-1 text-blue-600" />,
  };

  if (status === 'Likely eligible') {
    config = {
      label: isTe ? 'అర్హత ఉండే అవకాశం ఉంది' : 'Likely Eligible',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />,
    };
  } else if (status === 'Possibly eligible') {
    config = {
      label: isTe ? 'పరిశీలించాల్సిన అర్హత' : 'Possibly Eligible',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <AlertCircle className="w-4 h-4 mr-1 text-amber-600" />,
    };
  } else if (status === 'Not eligible') {
    config = {
      label: isTe ? 'అర్హత లేదు' : 'Not Eligible',
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: <XCircle className="w-4 h-4 mr-1 text-rose-600" />,
    };
  } else if (status === 'Insufficient information') {
    config = {
      label: isTe ? 'మరింత సమాచారం అవసరం' : 'More Info Needed',
      bg: 'bg-slate-100 text-slate-800 border-slate-200',
      icon: <HelpCircle className="w-4 h-4 mr-1 text-slate-500" />,
    };
  }

  return (
    <div className="inline-flex items-center gap-1.5 flex-wrap">
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg}`}
      >
        {config.icon}
        {config.label}
      </span>
      {showScore && score !== undefined && (
        <span
          className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200"
          title={isTe ? "అంతర్గత ఔచిత్య స్కోరు (ప్రభుత్వ సంభావ్యత కాదు)" : "Internal Relevance Score (not an official government probability)"}
        >
          {isTe ? "ఔచిత్యం" : "Relevance"}: {Math.round(score)}%
        </span>
      )}
    </div>
  );
};
