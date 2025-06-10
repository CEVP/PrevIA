"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

export function FileUploader() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState("");
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "UploadCNIS");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dfiwldzbq/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            if (e.total) {
              setUploadProgress(Math.round((e.loaded * 100) / e.total));
            }
          },
        }
      );

      const uploadedFileUrl = response.data.secure_url;
      setUploadedUrl(uploadedFileUrl);
      console.log("Upload concluído:", uploadedFileUrl);
    } catch (err) {
      console.error("Erro no upload:", err);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "text/html": [".html", ".htm"],
    },
  });

  return (
    <div {...getRootProps()} style={{ border: "2px dashed #aaa", padding: 20 }}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Solte o arquivo aqui...</p>
      ) : (
        <p>Arraste o extrato do CNIS (.pdf ou .html) ou clique para selecioná-lo</p>
      )}
      {uploadProgress > 0 && <p>Progresso: {uploadProgress}%</p>}
      {uploadedUrl && (
        <p>
          Arquivo enviado:{" "}
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
            {uploadedUrl}
          </a>
        </p>
      )}
    </div>
  );
}