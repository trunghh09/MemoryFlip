// * Node modules
import { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

// * Components
import { Card } from "./components";

// * Utils
import { animals } from "./constants";
import { createMemoryCards, type MemoryCard } from "./utils";

type PairsFound = {
    first: MemoryCard | null;
    second: MemoryCard | null;
};

const App = () => {
    // * Board matrix
    const [matrix, setMatrix] = useState({ rows: 4, columns: 4 });
    const [cards, setCards] = useState<MemoryCard[] | []>([]);

    const [pairsFound, setPairsFound] = useState<PairsFound>({
        first: null,
        second: null,
    });

    const boardWidth = useMemo(() => {
        return matrix.columns * 64 + 16 * (matrix.columns - 1) + 32;
    }, [matrix.columns]);

    const handleMatrixChange = (size: number) => {
        setMatrix({ rows: size, columns: size });
    };

    const handleCardClick = (cardId: string) => {
        if (pairsFound.first && pairsFound.second) return;

        // Update card flip state
        setCards((prev) =>
            prev.map((card) =>
                card.id === cardId && !card.isFlipped
                    ? { ...card, isFlipped: !card.isFlipped }
                    : card
            )
        );

        // Manage pairs found
        if (pairsFound.first === null) {
            setPairsFound((prev) => ({
                ...prev,
                first: cards.find((card) => card.id === cardId) || null,
            }));
        } else {
            setPairsFound((prev) => ({
                ...prev,
                second: cards.find((card) => card.id === cardId) || null,
            }));
        }
    };

    useEffect(() => {
        console.log("Matrix changed, generating new cards...");
        const memoryCards = createMemoryCards(
            animals,
            matrix.rows,
            matrix.columns
        );
        setCards(memoryCards);
    }, [matrix]);

    useEffect(() => {
        if (pairsFound.first && pairsFound.second) {
            // Update matched state
            if (
                pairsFound.first.pairId === pairsFound.second.pairId ||
                pairsFound.first.photo === pairsFound.second.photo
            ) {
                const delayTimeout = setTimeout(() => {
                    setCards((prev) =>
                        prev.map((card) =>
                            card.id === pairsFound.first?.id ||
                            card.id === pairsFound.second?.id
                                ? { ...card, isMatched: true }
                                : card
                        )
                    );

                    setPairsFound({ first: null, second: null });
                }, 1000);

                return () => clearTimeout(delayTimeout);
            } else {
                const delayTimeout = setTimeout(() => {
                    setCards((prev) =>
                        prev.map((card) =>
                            card.id === pairsFound.first?.id ||
                            card.id === pairsFound.second?.id
                                ? { ...card, isFlipped: false }
                                : card
                        )
                    );

                    setPairsFound({ first: null, second: null });
                }, 1000);

                return () => clearTimeout(delayTimeout);
            }
        }
    }, [pairsFound]);

    useEffect(() => {
        if (cards.length > 0 && cards.every((card) => card.isMatched)) {
            alert("Congratulations! You've matched all pairs!");

            // Reset game
            const memoryCards = createMemoryCards(
                animals,
                matrix.rows,
                matrix.columns
            );
            setCards(memoryCards);
        }
    }, [cards]);

    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center gap-6">
            <div className="text-4xl font-medium">Memory Flip Game</div>
            <div className="space-y-2">
                <label
                    htmlFor="matrix"
                    className="block mb-2.5 text-sm font-medium text-heading"
                >
                    Select Board Size (Rows x Columns):
                </label>
                <select
                    id="matrix"
                    className="block w-full px-3 py-2.5 bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand shadow-xs placeholder:text-body outline-none"
                    onChange={(e) => handleMatrixChange(Number(e.target.value))}
                >
                    <option value="4" defaultChecked>
                        4
                    </option>
                    <option value="6">6</option>
                    <option value="8">8</option>
                </select>
            </div>
            <div
                className={twMerge(
                    "bg-linear-to-br from-sky-600 via-blue-500 to-indigo-400",
                    "flex flex-wrap gap-4 p-4 rounded-2xl shadow-lg"
                )}
                style={{
                    width: boardWidth,
                }}
            >
                {cards.map((card) => (
                    <Card
                        key={card.id}
                        isFlipped={card.isFlipped}
                        frontImg={card.photo}
                        onClick={() => handleCardClick(card.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default App;
