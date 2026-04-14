interface PrescriptionsTabProps {
  userLanguage: string;
}

export default function PrescriptionsTab({ userLanguage }: PrescriptionsTabProps) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">
        {userLanguage === 'ur' ? 'نسخے' : 'Prescriptions'}
      </h3>
      <div className="text-gray-600">
        {userLanguage === 'ur' 
          ? 'آپ کے نسخے یہاں ظاہر ہوں گے' 
          : 'Your prescriptions will appear here'}
      </div>
    </div>
  );
}