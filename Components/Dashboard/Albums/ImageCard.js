import { Skeleton, Image } from "@chakra-ui/react";
import { useState } from "react";

const ImageCard = ({ image, onclick }) => {
    const [isLoaded, setLoaded] = useState(false);
    let state = false;

    function finishLoad() {
        state = true;
        setLoaded(true);
    }

    return (
        <Skeleton w={"100%"} isLoaded={isLoaded} borderRadius={"xl"}>
            <Image _hover={{ cursor: "pointer" }} loading="lazy" onLoad={finishLoad} onClick={onclick} key={image.url} w="100%" d="inline-block" src={image.url} mb={"8px"} borderRadius={"xl"} alt="Alt" />
        </Skeleton>
    )
}

export default ImageCard;