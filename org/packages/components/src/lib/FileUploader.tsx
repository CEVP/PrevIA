"use client";

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

export function FileUploader() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);
    try {
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
            if (e.total) {
          setUploadProgress(Math.round((e.loaded * 100) / e.total));
          }
        }
      });
      console.log('Upload concluído:', res.data);
    } catch (err) {
      console.error('Erro no upload:', err);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, 
    accept: {
        'application/pdf': ['.pdf'],
        'text/html': ['.html', '.htm']
    }
   });

  return (
    <div {...getRootProps()} style={{ border: '2px dashed #aaa', padding: 20 }}>
      <input {...getInputProps()} />
      {isDragActive
        ? <p>Solte o arquivo aqui...</p>
        : <p>Arraste um PDF/HTML ou clique para selecionar</p>}
      {uploadProgress > 0 && <p>Progresso: {uploadProgress}%</p>}
    </div>
  );
}