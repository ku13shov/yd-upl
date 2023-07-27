import React, { useRef, useState } from 'react';
import styles from './YandexDiskUploader.module.scss';
import chooseImg from '../images/folder.png';

const YandexDiskUploader = () => {
    const [files, setFiles] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadedFileLink, setUploadedFileLink] = useState([]);
    const [imageInfo, setImageInfo] = useState([]);

    const inputRef = useRef(null);

    const handleFileChange = (event) => {
        setImageInfo([]);

        const files = event.target.files;
        const selectedFiles = Array.from(files);
        setFiles(selectedFiles);

        selectedFiles.forEach((file) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const imageData = e.target.result;
                setImageInfo((prev) => [...prev, imageData]);
            };

            reader.readAsDataURL(file);
        });

        // selectedFiles.forEach(async (element) => {
        //     console.log(element);

        //     try {
        //         const response = await fetch(
        //             `https://cloud-api.yandex.net/v1/disk/resources/upload?path=disk:/new/${element.name}`,
        //             {
        //                 method: 'GET',
        //                 headers: {
        //                     Authorization:
        //                         'OAuth y0_AgAEA7qkNSbIAADLWwAAAADoxlHILceEXJlDTuKYZC0ydPybgDfIAGE',
        //                 },
        //             },
        //         );

        //         if (response.ok) {
        //             const result = await response.json();
        //             console.log(response);
        //             setUploadedFileLink((prev) => {
        //                 return [...prev, result.href];
        //             });
        //             setUploadedFile(files);
        //         } else {
        //             console.error('Failed to upload file to Yandex.Disk');
        //         }
        //     } catch (error) {
        //         console.error('Error during file upload', error);
        //     } finally {
        //         console.log('finally');
        //     }
        // });
    };

    const handleUpload = async () => {
        if (files) {
            console.log(uploadedFileLink);

            setUploadedFile(files);

            uploadedFileLink.forEach(async (link) => {
                try {
                    const response = await fetch(link, {
                        method: 'PUT',
                    });

                    if (response.ok) {
                        const result = await response.json();
                        setUploadedFile(files);
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
            </div>

            <button
                className={styles.upload}
                onClick={handleUpload}
                disabled={files ? false : true}>
                Загрузить
            </button>

            <div className={styles.items}>
                {files?.map((file, i) => {
                    return (
                        <div className={styles.item} key={file.lastModified}>
                            <div className={styles.images}>
                                {<img className={styles.image} src={imageInfo[i]} alt="" />}
                            </div>

                            <div>
                                <div>{file.name}</div>
                                <div>{Math.round(+file.size / 1000)} Kb</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default YandexDiskUploader;
