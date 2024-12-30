


interface AttributeDetailProps{
  label:string,
  value:string,
  description:string
}

export default function AttributeDetail ({label,value,description}:AttributeDetailProps){
  return(
    <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-lg font-medium text-gray-900">{value}</dd>
    <dd className="mt-1 text-sm text-gray-500">{description}</dd>
  </div>
  )
}