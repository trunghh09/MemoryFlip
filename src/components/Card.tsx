// * Node modules
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

// * Types
type CardProps = {
    isFlipped?: boolean;
};

// * Component
const Card = ({ isFlipped = false }: CardProps) => {
    const [flipped, setFlipped] = useState<boolean>(isFlipped);

    // * Handle card click to toggle flip state
    const handleCardClick = () => {
        setFlipped((prev) => !prev);
    };

    // * Change the state using the `flip` state variable from the parent component.
    useEffect(() => {
        setFlipped(isFlipped);
    }, [isFlipped]);

    return (
        <div
            className={twMerge("w-32 h-32 perspective-[1000px] cursor-pointer")}
            onClick={handleCardClick}
        >
            <div
                className={twMerge(
                    "w-full h-full relative transform-3d transition-transform duration-700",
                    flipped ? "-rotate-y-180" : ""
                )}
                data-flipped={flipped}
            >
                {/* Card front */}
                <div
                    className={twMerge(
                        "absolute w-full h-full backface-hidden"
                    )}
                >
                    Front
                </div>
                {/* Card back */}
                <div
                    className={twMerge(
                        "absolute w-full h-full backface-hidden",
                        "bg-linear-60 from-[#0a74da] to-[#053f7d] color-white",
                        "-rotate-y-180"
                    )}
                >
                    Back
                </div>
            </div>
        </div>
    );
};

export default Card;
