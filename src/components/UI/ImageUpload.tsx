import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  currentImage?: string;
  onImageRemove?: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  currentImage,
  onImageRemove
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageSelect(acceptedFiles[0]);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  if (currentImage) {
    return (
      <div className="relative">
        <img
          src={currentImage}
          alt="Preview"
          className="w-full h-48 object-cover rounded-lg"
        />
        {onImageRemove && (
          <button
            onClick={onImageRemove}
            className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-purple-500 bg-purple-500/10' : 'border-gray-600 hover:border-purple-500'}`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto mb-2 text-gray-400" size={24} />
      <p className="text-gray-400">
        {isDragActive
          ? 'Solte a imagem aqui...'
          : 'Arraste uma imagem ou clique para selecionar'}
      </p>
      <p className="text-sm text-gray-500 mt-1">
        PNG, JPG ou WEBP (max. 5MB)
      </p>
    </div>
  );
};