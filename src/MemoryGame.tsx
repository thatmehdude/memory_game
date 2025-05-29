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
    const [isGameComplete, setIsGameCOmplete] = useState(false);
    const [moves, setMoves] = useState(0);

    useEffect(() => {
        initializeGame()
    }, [images])

    // this checks for matches when there are two cards flipped
    useEffect(() => {
        if (flippedCards.length === 2) {
            checkMatch();
        }
    }, [flippedCards]);

    // this checks if the game is complete
    useEffect(() => {
        if (cards.length > 0 && cards.every(card => card.isMatched)) {
            setIsGameCOmplete(true)
        }
    }, [cards])

    const initializeGame = () => {
        const cardPairs: CardProps[] = [];
        images.forEach((imageUrl, index) => {

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
        setMoves(0)
        setIsGameCOmplete(false);
    }

    const handleCardClick = (cardId: string) => {
        const card = cards.find(c => c.id === cardId);
        if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) {
            return;
        }

        // this flips the card
        setCards(prevCards => 
            prevCards.map(c =>
                c.id === cardId ? {...c, isFlipped: true} : c
            )
        );

        // adds to the flipped cards array
        setFlippedCards(prev => [...prev, cardId]);
    }

    const checkMatch = () => {
        const [firstCardId, secondCardId] = flippedCards;
        const firstCard = cards.find(c => c.id === firstCardId);
        const secondCard = cards.find(c => c.id === secondCardId);

        if (firstCard && secondCard) {
            if (firstCard.imageUrl === secondCard.imageUrl) {

                setCards(prevCards =>
                    prevCards.map(c =>
                        c.id === firstCardId || c.id === secondCardId
                        ? {...c, isMatched: true}
                        : c
                    )
                );
                setFlippedCards([]);
            } else {
                setTimeout(() => {
                    setCards(prevCards =>
                        prevCards.map(c =>
                            c.id === firstCardId || c.id === secondCardId
                            ? {...c, isFlipped: false}
                            : c
                        )
                    );
                    setFlippedCards([]);
                }, 1000);
            }
            setMoves(prev => prev + 1)
        }
    };

    const resetGame = () => {
        initializeGame();
    }
    return (
        <div className="memory-game-container">
            <div className="memory-game-header">
                <h1 className="memory-game-title">Memory Game</h1>
                <div className="memory-game-stats">
                    <span className="memory-game-moves">Moves: {moves}</span>
                    {isGameComplete && (
                        <span className="memory-game-congrats">Congratulations! You win</span>
                    )}
                </div>
                <button onClick={resetGame} className="memory-game-reset-button">
                    New Game
                </button>
            </div>

            <div className="memory-game-grid">
                {cards.map((card) => (
                    <div 
                      key={card.id}
                      onClick={() => handleCardClick(card.id)}
                      className={`memory-game-card ${
                        card.isFlipped || card.isMatched
                        ? 'memory-game-card-revealed'
                        : 'memory-game-card-hidden'
                      }`}
                    >
                        {card.isFlipped || card.isMatched ? (
                            <img src={card.imageUrl} alt="flower image" className="memory-game-card-image"/>
                        ) : (
                            <div className="memory-game-card-placeholder">
                                ?
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {isGameComplete && (
                <div className="memory-game-completion">
                    <p className="memory-game-completion-text">
                        You completed the game in <span className="memory-game-moves">{moves}</span> moves!
                    </p>
                </div>
            )}
        </div>
    )
}

export default MemoryGame