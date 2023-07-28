import React, { useRef, useState } from 'react';
import styles from './YandexDiskUploader.module.scss';
import chooseImg from '../images/folder.png';
import Items from './Items';

const YandexDiskUploader = () => {
    const [imageInfo, setImageInfo] = useState([]);
    const [uploadInfo, setUploadInfo] = useState([]);

    const inputRef = useRef(null);

    const handleFileChange = (event) => {
        setUploadInfo([]);

        const files = event.target.files;
        const selectedFiles = Array.from(files);

        selectedFiles.forEach((file, i) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const imageData = { src: e.target.result, index: i };
                setImageInfo((prev) => [...prev, imageData]);
            };

            reader.readAsDataURL(file);
        });

        selectedFiles.forEach(async (element) => {
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

                    setUploadInfo((prev) => {
                        return [...prev, { file: element, href: result.href }];
                    });
                } else {
                    console.error('Failed to upload file to Yandex.Disk');
                }
            } catch (error) {
                console.error('Error during file upload', error);
            }
        });
    };

    const handleUpload = () => {
        if (uploadInfo.length > 0) {
            uploadInfo.forEach(async (obj) => {
                const formData = new FormData();
                formData.append('file', obj.file);

                try {
                    const response = await fetch(obj.href, {
                        method: 'PUT',
                        body: formData,
                    });

                    if (response.ok) {
                        console.log('файлы загружены');
                    } else {
                        console.error('Failed to upload file to Yandex.Disk');
                    }
                } catch (error) {
                    console.error('Error during file upload', error);
                } finally {
                    setImageInfo([]);
                    setUploadInfo([]);
                }
            });
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
                <p>Выбрано файлов: {uploadInfo ? uploadInfo.length : 0}</p>
            </div>

            <button
                className={styles.upload}
                onClick={handleUpload}
                disabled={uploadInfo.length > 0 ? false : true}>
                Загрузить
            </button>

            {uploadInfo.length > 0 && <Items uploadInfo={uploadInfo} imageInfo={imageInfo} />}
        </div>
    );
};

export default YandexDiskUploader;
