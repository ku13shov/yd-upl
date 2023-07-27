import React, { useState } from 'react';
import { useRef } from 'react';
import './YandexDiskUploader.css';

const YandexDiskUploader = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadedFileLink, setUploadedFileLink] = useState([]);

    const handleFileChange = (event) => {
        const files = event.target.files;
        const selectedFiles = Array.from(files);
        setSelectedFile(selectedFiles);

        selectedFiles.forEach(async (element) => {
            console.log(element);

            try {
                const response = await fetch(
                    `https://cloud-api.yandex.net/v1/disk/resources/upload?path=disk:/new/${element.name}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization:
                                'OAuth y0_AgAEA7qkNSbIAADLWwAAAADoxlHILceEXJlDTuKYZC0ydPybgDfIAGE',
                        },
                    },
                );

                if (response.ok) {
                    const result = await response.json();
                    console.log(result.href);
                    setUploadedFileLink((prev) => {
                        return [...prev, result.href];
                    });
                    setUploadedFile(selectedFile);
                } else {
                    console.error('Failed to upload file to Yandex.Disk');
                }
            } catch (error) {
                console.error('Error during file upload', error);
            } finally {
                console.log('finally');
            }
        });
    };

    const handleUpload = () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            setUploadedFile(selectedFile);

            selectedFile.forEach(async (element) => {
                console.log(element);

                try {
                    const response = await fetch(
                        `https://cloud-api.yandex.net/v1/disk/resources/upload?path=disk:/new/${element.name}`,
                        {
                            method: 'GET',
                            headers: {
                                Authorization:
                                    'OAuth y0_AgAEA7qkNSbIAADLWwAAAADoxlHILceEXJlDTuKYZC0ydPybgDfIAGE',
                            },
                        },
                    );

                    if (response.ok) {
                        const result = await response.json();
                        console.log(result.href);
                        setUploadedFileLink((prev) => {
                            return [...prev, result.href];
                        });
                        setUploadedFile(selectedFile);
                    } else {
                        console.error('Failed to upload file to Yandex.Disk');
                    }
                } catch (error) {
                    console.error('Error during file upload', error);
                }
            });
        }
    };

    const handleUpload1 = async () => {
        if (selectedFile) {
            console.log(uploadedFileLink);

            uploadedFileLink.forEach(async (link) => {
                try {
                    const response = await fetch(link, {
                        method: 'PUT',
                    });

                    if (response.ok) {
                        const result = await response.json();
                        setUploadedFile(selectedFile);
                    } else {
                        console.error('Failed to upload file to Yandex.Disk');
                    }
                } catch (error) {
                    console.error('Error during file upload', error);
                }
            });
        }
    };

    return (
        <div className="container">
            <div className="file-input-wrapper">
                <input type="file" onChange={handleFileChange} multiple />
            </div>

            <button className="upload-button" onClick={handleUpload}>
                Сформировать ссылки для загрузки
            </button>
            <button className="upload-button" onClick={handleUpload1}>
                Загрузить
            </button>

            {uploadedFile && (
                <div>
                    <p>Uploaded file: {uploadedFile.name}</p>
                    <p>File size: {uploadedFile.size} bytes</p>
                    <p>File type: {uploadedFile.type}</p>
                </div>
            )}
        </div>
    );
};

export default YandexDiskUploader;
