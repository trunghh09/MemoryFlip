import { shuffle } from "./shuffle";

import { animals } from "../constants";

type animalsType = typeof animals;

export type MemoryCard = {
    id: string;
    name: string;
    photo: string;
    pairId: string;
    isFlipped: boolean;
    isMatched: boolean;
};

export const createMemoryCards = (
    animals: animalsType,
    rows: number,
    columns: number
) => {
    const totalCards = rows * columns;

    if (totalCards % 2 !== 0) {
        throw new Error("Total number of cards must be even.");
    }

    const neededPairs = totalCards / 2;

    // Shuffle trước để tránh lặp có quy luật
    const shuffledAnimals = shuffle(animals);

    // Reuse animals nếu thiếu
    const selectedAnimals: animalsType = [];
    let i = 0;

    while (selectedAnimals.length < neededPairs) {
        selectedAnimals.push(shuffledAnimals[i % shuffledAnimals.length]);
        i++;
    }

    // Nhân đôi + shuffle lần cuối
    return shuffle(
        selectedAnimals.flatMap((animal) => {
            const pairId = crypto.randomUUID();
            return [
                {
                    id: crypto.randomUUID(),
                    pairId,
                    name: animal.name,
                    photo: animal.photo,
                    isFlipped: false,
                    isMatched: false,
                },
                {
                    id: crypto.randomUUID(),
                    pairId,
                    name: animal.name,
                    photo: animal.photo,
                    isFlipped: false,
                    isMatched: false,
                },
            ];
        })
    );
};
