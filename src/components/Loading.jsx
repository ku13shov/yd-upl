import styles from './Loading.module.scss';

const Loading = ({ files, count }) => {
    return (
        <div className={styles.loading}>
            <div className={styles.wrapper} style={{width: `${count * (100 / files.length)}%`}}></div>
        </div>
    );
};

export default Loading;
