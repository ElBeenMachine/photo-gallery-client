import { Skeleton, Image } from "@chakra-ui/react";
import { useState } from "react";
import styles from "@/styles/ImageCard.module.css";

const ImageCard = ({ image, onclick, addFunction, removeFunction }) => {
    const [isLoaded, setLoaded] = useState(false);

    const [isSelected, setSelected] = useState(false);

    function finishLoad() {
        setLoaded(true);
    }

    function toggleSelect(e) {
        if(isSelected) {
            removeFunction(image);
            setSelected(false);
        } else {
            addFunction(image);
            setSelected(true);
        }
    }

    return (
        <Skeleton borderRadius={"5px"} className={ isSelected ? styles.imageSelected : null } position={"relative"} w={"100%"} isLoaded={isLoaded} transition={"box-shadow 0.1s ease-in-out"} _hover={!isSelected ? {"boxShadow": "0px 0px 5px 1px rgba(0, 0, 0, 0.5)"} : null } mb={"10px"}>
            <div onClick={toggleSelect} className={`${styles.check} ${isSelected ? styles.selected : null}`}><div className={styles.checkInside}></div></div>
            <Image borderRadius={"5px"} _hover={{ cursor: "pointer" }} loading="lazy" onLoad={finishLoad} onClick={onclick} key={image.url} w="100%" d="inline-block" src={image.url} alt="Alt" />
        </Skeleton>
    )
}

export default ImageCard;