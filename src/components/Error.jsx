import styles from './Error.module.scss';

const Error = () => {
    return (
        <div className={styles.wrapper}>
            <p className={styles.error}>При загрузке произошла ошибка 📛</p>
            <p className={styles.error}>Попробуйте повторить 🔁</p>
        </div>
    );
};

export default Error;
