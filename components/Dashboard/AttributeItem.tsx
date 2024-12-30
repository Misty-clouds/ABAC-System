interface AttributeItemProps {
    label: string;
    value: string;
  }
  
  const AttributeItem: React.FC<AttributeItemProps> = ({ label, value }) => (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
  
  export default AttributeItem;
  