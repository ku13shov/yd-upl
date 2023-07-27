import styles from './Items.module.scss';

const Items = ({ files, imageInfo }) => {
    const displayName = (name) => {
        const MAX_NAME_LENGTH = 10;

        const displayName =
            name.length > MAX_NAME_LENGTH
                ? name.slice(0, MAX_NAME_LENGTH) + '...' + name.slice(-6)
                : name;

        return displayName;
    };

    const setSrc = (arr, i) => {
        if (arr?.length > 0) {
            const filtredArr = arr.filter((obj) => obj.index === i);
            return filtredArr[0]?.src;
        }
    };

    return (
        <div className={styles.items}>
            {files?.map((file, i) => {
                return (
                    <div className={styles.item} key={i}>
                        <div className={styles.images}>
                            {<img className={styles.image} src={setSrc(imageInfo, i)} alt="" />}
                        </div>

                        <div className={styles.info}>
                            <div className={styles.name}>{displayName(file.name)}</div>
                            <div className={styles.size}>{Math.round(+file.size / 1000)} Kb</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Items;
