import React, { useState, useEffect } from "react";

const { innerWidth: width, innerHeight: height } = window;

export default function App() {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(5); // velocidad inicial
  const [gameOver, setGameOver] = useState(false);

  // Crear burbujas
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      const newBubble = {
        id: Date.now(),
        x: Math.random() * (width - 60) + 30,
        y: height - 100,
        r: 25,
      };
      setBubbles((prev) => [...prev, newBubble]);
    }, 1500);

    return () => clearInterval(interval);
  }, [gameOver]);

  // Animación movimiento
  useEffect(() => {
    if (gameOver) return;

    const move = setInterval(() => {
      setBubbles((prev) => {
        const updated = prev.map((b) => ({ ...b, y: b.y - speed }));
        const escaped = updated.some((b) => b.y <= -50);
        if (escaped) {
          setGameOver(true);
          return [];
        }
        return updated;
      });
    }, 50);

    return () => clearInterval(move);
  }, [speed, gameOver]);

  // Atrapar burbuja
  const popBubble = (id) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    setScore((s) => {
      const newScore = s + 1;
      if (newScore % 5 === 0) {
        setSpeed((sp) => sp + 2); // aumenta velocidad cada 5 puntos
      }
      return newScore;
    });
  };

  // Reiniciar juego
  const restartGame = () => {
    setScore(0);
    setSpeed(5);
    setBubbles([]);
    setGameOver(false);
  };

  return (
    <div style={styles.container}>
      {gameOver ? (
        <div style={styles.center}>
          <h1 style={styles.gameOver}>¡Juego Terminado!</h1>
          <h2 style={styles.finalScore}>Puntaje: {score}</h2>
          <button style={styles.button} onClick={restartGame}>
            Reiniciar
          </button>
        </div>
      ) : (
        <>
          <h2 style={styles.score}>Puntos: {score}</h2>
          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              onClick={() => popBubble(bubble.id)}
              style={{
                ...styles.bubble,
                top: bubble.y,
                left: bubble.x,
                width: bubble.r * 2,
                height: bubble.r * 2,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    backgroundColor: "#222",
    overflow: "hidden",
  },
  center: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  score: {
    fontSize: "24px",
    color: "#fff",
    margin: "20px",
    fontWeight: "bold",
  },
  gameOver: {
    fontSize: "32px",
    color: "red",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  finalScore: {
    fontSize: "24px",
    color: "#fff",
    marginBottom: "30px",
  },
  button: {
    backgroundColor: "#0af",
    padding: "12px 30px",
    borderRadius: "12px",
    border: "none",
    color: "#fff",
    fontSize: "20px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  bubble: {
    position: "absolute",
    borderRadius: "50%",
    backgroundColor: "rgba(0, 150, 255, 0.6)",
    border: "2px solid white",
    cursor: "pointer",
  },
};
