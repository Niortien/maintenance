import Image from "next/image";

export default function EmptyState({ 
  image, 
  text = "Aucune intervention enregistrée" 
}:{
  image?: string ;
  text?: string;
}) {
  return (
    <div className="flex items-center justify-center h-48 bg-white">
      <div className="border-2 border-yellow-100 rounded-lg p-12 text-center max-w-7xl">
        <div className="flex justify-center mb-6">
          {image && (
            typeof image === 'string' ? (
              <Image
                src={image} 
                alt="empty state" 
                className="w-16 h-16"
                width={64}
                height={64}
              />
            ) : (
              image
            )
          )}
        </div>
        <h2 className="text-gray-400 text-lg font-medium">
          {text}
        </h2>
      </div>
    </div>
  );
}