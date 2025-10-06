import React, { useState } from "react";

export default function M2SelectPlace() {
  // State to track which cakes are available at the bottom
  const [availableCakes, setAvailableCakes] = useState([1, 2, 3, 4, 5]);
  
  // State to track selected cake
  const [selectedCake, setSelectedCake] = useState(null);
  
  // State to track placed cakes on plates (plate position -> cake number)
  const [placedCakes, setPlacedCakes] = useState({});
  
  // State to track game status
  const [gameStatus, setGameStatus] = useState(null); // null, 'success', or 'incorrect'
  
  // Correct order: plate1->2, plate2->1, plate3->4, plate4->3, plate5->5
  const correctOrder = {
    plate1: 2,
    plate2: 5,
    plate3: 3,
    plate4: 1,
    plate5: 4
  };

  // Define plate positions based on the image (5 positions matching the empty plates)
  const plates = [
    { id: 'plate1', top: '33%', left: '32%' },
    { id: 'plate2', top: '33%', left: '46.5555%' },
    { id: 'plate3', top: '33%', left: '62%' },
    { id: 'plate4', top: '52%', left: '36.5%' },
    { id: 'plate5', top: '52%', left: '56%' },
  ];

  const containerStyle = {
    position: "relative",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    backgroundColor: "#f8f4e9",
  };

  const backgroundStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url('/images/cake-game-bg.png')`,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    zIndex: 1,
  };

  const cakeContainerStyle = {
    position: "absolute",
    bottom: "12%",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: "25px",
    zIndex: 2,
  };

  const cakeStyle = (isSelected) => ({
    width: "90px",
    height: "90px",
    objectFit: "contain",
    cursor: "pointer",
    transition: "transform 0.2s",
    border: isSelected ? "3px solid #ffd700" : "none",
    borderRadius: "10px",
    transform: isSelected ? "scale(1.1)" : "scale(1)",
  });

  const plateStyle = (plateId) => ({
    position: "absolute",
    width: "90px",
    height: "90px",
    cursor: selectedCake && !placedCakes[plateId] ? "pointer" : "default",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    transition: "transform 0.2s",
    border: selectedCake && !placedCakes[plateId] ? "2px dashed #ffd700" : "none",
    borderRadius: "50%",
  });

  const handleCakeClick = (cakeNum) => {
    if (availableCakes.includes(cakeNum)) {
      setSelectedCake(selectedCake === cakeNum ? null : cakeNum);
    }
  };

  const handlePlateClick = (plateId) => {
    if (selectedCake && !placedCakes[plateId]) {
      // Place the cake on the plate
      const newPlacedCakes = { ...placedCakes, [plateId]: selectedCake };
      setPlacedCakes(newPlacedCakes);
      
      // Remove the cake from available cakes
      setAvailableCakes(availableCakes.filter(c => c !== selectedCake));
      
      // Clear selection
      setSelectedCake(null);
      
      // Check if all plates are filled
      if (Object.keys(newPlacedCakes).length === 5) {
        checkWinCondition(newPlacedCakes);
      }
    }
  };
  
  const checkWinCondition = (placedCakesObj) => {
    const isCorrect = Object.keys(correctOrder).every(
      plateId => placedCakesObj[plateId] === correctOrder[plateId]
    );
    
    if (isCorrect) {
      setTimeout(() => {
        setGameStatus('success');
      }, 300);
    } else {
      // Reset for incorrect answer
      setTimeout(() => {
        handleRetry();
      }, 500);
    }
  };
  
  const handleRetry = () => {
    setAvailableCakes([1, 2, 3, 4, 5]);
    setSelectedCake(null);
    setPlacedCakes({});
    setGameStatus(null);
  };

  return (
    <div style={containerStyle}>
      <div style={backgroundStyle}></div>
      
      {/* Plates overlay */}
      {plates.map((plate) => (
        <div
          key={plate.id}
          style={{
            ...plateStyle(plate.id),
            top: plate.top,
            left: plate.left,
          }}
          onClick={() => handlePlateClick(plate.id)}
          onMouseEnter={(e) => {
            if (selectedCake && !placedCakes[plate.id]) {
              e.currentTarget.style.transform = "scale(1.1)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {placedCakes[plate.id] && (
            <img
              src={`/images/cake${placedCakes[plate.id]}-removebg-preview.png`}
              alt={`Cake ${placedCakes[plate.id]}`}
              style={{
                width: "90px",
                height: "90px",
                objectFit: "contain",
              }}
              draggable="false"
            />
          )}
        </div>
      ))}

      {/* Available cakes at the bottom */}
      <div style={cakeContainerStyle}>
        {availableCakes.map((num) => (
          <img
            key={num}
            src={`/images/cake${num}-removebg-preview.png`}
            alt={`Cake ${num}`}
            style={cakeStyle(selectedCake === num)}
            draggable="false"
            onClick={() => handleCakeClick(num)}
            onMouseEnter={(e) => {
              if (selectedCake !== num) {
                e.currentTarget.style.transform = "scale(1.1)";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCake !== num) {
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          />
        ))}
      </div>
      
      {/* Success/Incorrect Message Modal */}
      {gameStatus && (
        <>
          {/* Confetti Effect */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 9,
            overflow: 'hidden',
          }}>
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: '10px',
                  height: '10px',
                  backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][i % 6],
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  opacity: 0.8,
                  animation: `fall ${2 + Math.random() * 3}s linear infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
          
          {/* Success Modal */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '40px 60px',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
              animation: 'popIn 0.3s ease-out',
            }}>
              <div style={{
                fontSize: '64px',
                marginBottom: '20px',
              }}>
                🎉
              </div>
              <h2 style={{
                fontSize: '32px',
                marginBottom: '20px',
                color: '#4CAF50',
              }}>
                Success!
              </h2>
              <p style={{
                fontSize: '18px',
                marginBottom: '30px',
                color: '#666',
              }}>
                You placed all the cakes correctly!
              </p>
              <button
                onClick={handleRetry}
                style={{
                  padding: '15px 40px',
                  fontSize: '18px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#45a049';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#4CAF50';
                }}
              >
                Play Again
              </button>
            </div>
          </div>
          
          <style>{`
            @keyframes fall {
              to {
                transform: translateY(100vh) rotate(360deg);
              }
            }
            
            @keyframes popIn {
              from {
                transform: scale(0.5);
                opacity: 0;
              }
              to {
                transform: scale(1);
                opacity: 1;
              }
            }
          `}</style>
        </>
      )}
    </div>
  );
}