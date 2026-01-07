// * Node modules
import { twMerge } from "tailwind-merge";

// * Types
type CardProps = {
    isFlipped: boolean;
    frontImg: string;
    onClick: () => void;
};

// * Component
const Card = ({ isFlipped, frontImg, onClick }: CardProps) => {
    // * Handle card click to toggle flip state
    const handleCardClick = () => {
        onClick();
    };

    return (
        <div
            className={twMerge(
                "w-16 h-16 perspective-[1000px] cursor-pointer rounded-2xl overflow-hidden"
            )}
            onClick={handleCardClick}
        >
            <div
                className={twMerge(
                    "w-full h-full relative transform-3d transition-transform duration-500",
                    !isFlipped ? "-rotate-y-180" : ""
                )}
                data-flipped={isFlipped}
            >
                {/* Card front */}
                <div
                    className={twMerge(
                        "absolute w-full h-full backface-hidden"
                    )}
                >
                    <img
                        className="w-full h-full object-cover"
                        src={frontImg}
                    />
                </div>
                {/* Card back */}
                <div
                    className={twMerge(
                        "absolute w-full h-full backface-hidden",
                        "bg-gray-100",
                        "-rotate-y-180"
                    )}
                ></div>
            </div>
        </div>
    );
};

export default Card;
