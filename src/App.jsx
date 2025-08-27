import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback, Dimensions, TouchableOpacity } from "react-native";
import Svg, { Circle } from "react-native-svg";

const { width, height } = Dimensions.get("window");

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
        // Si se escapa una burbuja => game over
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
    <View style={styles.container}>
      {gameOver ? (
        <View style={styles.center}>
          <Text style={styles.gameOver}>¡Juego Terminado!</Text>
          <Text style={styles.finalScore}>Puntaje: {score}</Text>
          <TouchableOpacity style={styles.button} onPress={restartGame}>
            <Text style={styles.buttonText}>Reiniciar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.score}>Puntos: {score}</Text>
          {bubbles.map((bubble) => (
            <TouchableWithoutFeedback
              key={bubble.id}
              onPress={() => popBubble(bubble.id)}
            >
              <Svg
                height="60"
                width="60"
                style={{
                  position: "absolute",
                  top: bubble.y,
                  left: bubble.x,
                }}
              >
                <Circle
                  cx="30"
                  cy="30"
                  r={bubble.r}
                  fill="rgba(0, 150, 255, 0.6)"
                  stroke="white"
                  strokeWidth="2"
                />
              </Svg>
            </TouchableWithoutFeedback>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  score: {
    fontSize: 24,
    color: "#fff",
    marginTop: 50,
    fontWeight: "bold",
  },
  gameOver: {
    fontSize: 32,
    color: "red",
    fontWeight: "bold",
    marginBottom: 20,
  },
  finalScore: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#0af",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});
