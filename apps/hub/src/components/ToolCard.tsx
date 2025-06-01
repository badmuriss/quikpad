import React from 'react';
import { IconType } from 'react-icons';
import { BsArrowRight } from 'react-icons/bs';

interface ToolCardProps {
  title: string;
  description: string;
  icon: IconType; // Agora recebe um componente de ícone do React Icons
  imageSrc: string;
  url: string;
  color: string; // Classe Tailwind para cor
}

const ToolCard: React.FC<ToolCardProps> = ({
  title,
  description,
  icon: Icon, // Renomeado para usar maiúscula inicial (convenção de componentes)
  imageSrc,
  url,
  color
}) => {
  return (
    <a 
      href={url}
      className="block rounded-xl overflow-hidden bg-white shadow hover:shadow-lg transition-all duration-300 group dark:bg-gray-900"
    >
      <div className="relative">
        {/* Thumbnail/Imagem */}
        <img 
          src={imageSrc} 
          alt={`${title} thumbnail`} 
          className="w-full h-36 sm:h-40 md:h-48 object-cover transition duration-500 group-hover:scale-105"
        />
        
        {/* Overlay com gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
        
        {/* Ícone no canto superior direito - Agora com forma circular corrigida */}
        <div className={`absolute top-4 right-4 ${color} p-2 sm:p-3 rounded-full shadow-lg aspect-square flex items-center justify-center`}>
          <Icon className="text-white text-lg sm:text-xl" />
        </div>
      </div>
      
      <div className="p-4 sm:p-5">
        <h3 className="flex items-center mb-2 text-lg sm:text-xl font-bold text-gray-800 dark:text-white group-hover:text-[color:var(--color-primary)]">
          {title}
          <span className="inline-flex ml-2 transition-transform duration-300 group-hover:translate-x-1">
            <BsArrowRight className=" text-gray-800 dark:text-white" />
          </span>
        </h3>
        
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>
    </a>
  );
};

export default ToolCard;