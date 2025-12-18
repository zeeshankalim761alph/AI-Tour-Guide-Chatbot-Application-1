import React from 'react';
import { GroundingChunk } from '../types';

interface GroundingChipProps {
  chunk: GroundingChunk;
}

export const GroundingChip: React.FC<GroundingChipProps> = ({ chunk }) => {
  if (chunk.maps) {
    const { title, uri } = chunk.maps;
    return (
      <a
        href={uri}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-white border border-travel-200 shadow-sm rounded-lg px-3 py-2 mr-2 mb-2 hover:bg-travel-50 transition-colors text-sm text-travel-700 no-underline"
      >
        <i className="fa-solid fa-map-location-dot text-red-500"></i>
        <span className="font-medium">{title}</span>
        <i className="fa-solid fa-external-link-alt text-xs text-gray-400"></i>
      </a>
    );
  }
  
  if (chunk.web) {
    const { title, uri } = chunk.web;
     return (
      <a
        href={uri}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-lg px-3 py-2 mr-2 mb-2 hover:bg-gray-50 transition-colors text-sm text-gray-700 no-underline"
      >
        <i className="fa-solid fa-globe text-blue-500"></i>
        <span className="font-medium truncate max-w-[150px]">{title}</span>
      </a>
    );
  }

  return null;
};