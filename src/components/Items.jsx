import styles from './Items.module.scss';

const Items = ({ uploadInfo, imageInfo }) => {
    const displayName = (name) => {
        const MAX_NAME_LENGTH = 10;

        const displayName =
            name.length > MAX_NAME_LENGTH
                ? name.slice(0, MAX_NAME_LENGTH) + '...' + name.slice(-6)
                : name;

        return displayName;
    };

    uploadInfo.sort((a, b) => {
        return b.file.size - a.file.size;
    });

    const setSrc = (arr, index) => {
        if (arr.length > 0) {
            const filtredArr = arr.sort((a, b) => {
                return b.size - a.size;
            });
            return filtredArr[index].src;
        }
    };

    return (
        <div className={styles.items}>
            {uploadInfo.map((obj, i) => {
                return (
                    <div className={styles.item} key={i}>
                        <div className={styles.images}>
                            {<img className={styles.image} src={setSrc(imageInfo, i)} alt="preview" />}
                        </div>

                        <div className={styles.info}>
                            <div className={styles.name}>{displayName(obj.file.name)}</div>
                            <div className={styles.size}>
                                {Math.round(+obj.file.size / 1000)} Kb
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Items;
