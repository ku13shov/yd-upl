import React, { useRef, useState } from 'react';

import styles from './YandexDiskUploader.module.scss';
import chooseImg from '../images/folder.png';
import Items from './Items';
import Loading from './Loading';
import Error from './Error';
import loader from '../images/loader.png';

const YandexDiskUploader = () => {
    const [files, setFiles] = useState([]);
    const [imageInfo, setImageInfo] = useState([]);
    const [uploadInfo, setUploadInfo] = useState([]);
    const [count, setCount] = useState(0);
    const [error, setError] = useState(false);

    const inputRef = useRef(null);

    const handleFileChange = (event) => {
        setUploadInfo([]);
        setImageInfo([]);
        setCount(0);
        setError(false);

        const files = event.target.files;
        const selectedFiles = Array.from(files);
        setFiles(selectedFiles);

        selectedFiles.forEach((file, i) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const imageData = { src: e.target.result, size: e.total };
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
                setError(true);
                setImageInfo([]);
                setUploadInfo([]);
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
                        setCount((prev) => prev + 1);
                    } else {
                        console.error('Failed to upload file to Yandex.Disk');
                    }
                } catch (error) {
                    console.error('Error during file upload', error);
                    setError(true);
                    setImageInfo([]);
                    setUploadInfo([]);
                } finally {
                    setImageInfo([]);
                    setUploadInfo([]);
                }
            });
        }
    };

    const renderLoaderImg = () => {
        if (uploadInfo.length === files.length) {
            return;
        } else if (count !== 0) {
            return;
        } else {
            return <img className={styles.loader_image} src={loader} alt="loader" />;
        }
    };

    const renderLoadingOrDone = () => {
        if (count === files.length && count !== 0) {
            return <p className={styles.done}>Загрузка завершена</p>;
        } else if (count !== 0) {
            return <Loading count={count} files={files} />;
        } else {
            return;
        }
    };

    return (
        <div className={styles.loader}>
            <a
                className={styles.link}
                href="https://disk.yandex.ru/d/v_e6fQbtyP8iqg"
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
                <div className={styles.counter}>
                    <p>Выбрано файлов: {uploadInfo ? uploadInfo.length : 0} </p>
                    {renderLoaderImg()}
                </div>
            </div>

            <button
                className={styles.upload}
                onClick={handleUpload}
                disabled={
                    uploadInfo.length === files.length && uploadInfo.length !== 0 ? false : true
                }>
                {uploadInfo.length === files.length ? 'Загрузить' : 'Загрузка'}
            </button>

            {error && <Error />}

            {uploadInfo.length > 0 && <Items uploadInfo={uploadInfo} imageInfo={imageInfo} />}

            {renderLoadingOrDone()}
        </div>
    );
};

export default YandexDiskUploader;
