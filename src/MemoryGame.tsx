import { useState, useEffect } from "react"
import _ from "lodash"

type CardProps = {
    id: string;
    imageUrl: string;
    isFlipped: boolean;
    isMatched: boolean;
}

type MemoryGameProps = {
    images: string[];
}
const MemoryGame = ({images}: MemoryGameProps) => {
    const [flippedCards, setFlippedCards] = useState<string[]>([]);
    const [cards, setCards] = useState<CardProps[]>([]);
    const [isGameComplete, setIsGameCOmplete] = useState(false)

    useEffect(() => {
        initializeGame()
    }, [images])

    useEffect(() => {
        if (flippedCards.length === 2) {
            checkMatch();
        }
    }, [flippedCards]);

    const initializeGame = () => {
        const cardPairs: CardProps[] = [];
        images.forEach((image, index) => {

            cardPairs.push({
                id: `${index}a`,
                imageUrl,
                isFlipped: false,
                isMatched: false,
            });
            cardPairs.push({
                id: `${index}b`,
                imageUrl,
                isFlipped: false,
                isMatched: false,
            });
        });
        const shuffledCards = _.shuffle(cardPairs);
        setCards(shuffledCards);
        setFlippedCards([]);
        setIsGameCOmplete(false);
    }

    const handleCardClick = (cardId: string) => {
        const card = cards.find(c => c.id === cardId);
        if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) {
            return;
        }

        setCards(prevCards => 
            prevCards.map(c =>
                c.id === cardId ? {...c, isFlipped: true} : c
            )
        );
    }
    return (
        <div></div>
    )
}

export default MemoryGame