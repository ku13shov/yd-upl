import React, { useRef, useState } from 'react';
import styles from './YandexDiskUploader.module.scss';
import chooseImg from '../images/folder.png';
import Items from './Items';

const YandexDiskUploader = () => {
    const [files, setFiles] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadedFileLink, setUploadedFileLink] = useState([]);
    const [imageInfo, setImageInfo] = useState([]);

    const inputRef = useRef(null);

    const handleFileChange = (event) => {
        setImageInfo([]);
        setUploadedFileLink([]);

        const files = event.target.files;
        const selectedFiles = Array.from(files);
        setFiles(selectedFiles);

        selectedFiles.forEach((file, i) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const imageData = { src: e.target.result, index: i };
                setImageInfo((prev) => [...prev, imageData]);
            };

            reader.readAsDataURL(file);
        });

        selectedFiles.forEach(async (element) => {
            console.log(element);

            try {
                const response = await fetch(
                    `https://cloud-api.yandex.net/v1/disk/resources/upload?path=disk:/new/${element.name}&overwrite=true`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization:
                                'OAuth y0_AgAEA7qkNSbIAApAOgAAAADo0tVzy8CePjqlTGO7xKUlZNM3-hlSzDA',
                        },
                    },
                );

                if (response.ok) {
                    const result = await response.json();
                    console.log(response);
                    setUploadedFileLink((prev) => {
                        return [...prev, result.href];
                    });
                    // setUploadedFile(files);
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
        if (files) {
            const formData = new FormData();
            

            files.forEach(file => {
                formData.append('file', file);

                uploadedFileLink.forEach(async (link) => {
                    console.log(formData);
                    try {
                        const response = await fetch(link, {
                            method: 'PUT',
                            body: formData,
                        });
    
                        if (response.ok) {
                            const result = await response.json();
                            // setUploadedFile(files);
                        } else {
                            console.error('Failed to upload file to Yandex.Disk');
                        }
                    } catch (error) {
                        console.error('Error during file upload', error);
                    } finally {
                        setUploadedFileLink([]);
                        setFiles([]);
                    }
                });
            })

            // console.log(files);
            // setUploadedFile(files);


        }
    };

    return (
        <div>
            <a
                className={styles.link}
                href="https://disk.yandex.ru/d/D3xm1IddBDzSYQ"
                target="_blank"
                rel="noreferrer">
                Ссылка на папку на яндекс диске
            </a>
            <div>
                <label className={styles.choose} htmlFor="upload">
                    <img className={styles['choose-img']} src={chooseImg} alt="choose icon" />
                    Выбрать файлы
                </label>
                <input
                    className={styles.input}
                    ref={inputRef}
                    id="upload"
                    type="file"
                    onChange={handleFileChange}
                    multiple
                    accept=".jpg,.png,.webp"
                />
                <p>Выбрано файлов: {files ? files.length : 0}</p>
            </div>

            <button
                className={styles.upload}
                onClick={handleUpload}
                disabled={uploadedFileLink.length > 0 ? false : true}>
                Загрузить
            </button>

            {files && <Items files={files} imageInfo={imageInfo} />}
        </div>
    );
};

export default YandexDiskUploader;
