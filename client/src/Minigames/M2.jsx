// / ============================================
// M2.jsx - Cake Matching Game
// ============================================
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Confetti from "react-confetti"
import { BsTrash, BsCheckCircle, BsXCircle } from "react-icons/bs"

const useColorSelection = () => {
    const [selectedColor, setSelectedColor] = useState(null);
    
    const selectColor = (colorKey) => {
        setSelectedColor(selectedColor === colorKey ? null : colorKey);
    };
    
    return { selectedColor, selectColor };
};

const hiddenMapping = { 
    red: 2, 
    blue: 5, 
    green: 7, 
    yellow: 3, 
    purple: 4, 
    orange: 6 
}

const colorPalette = [
    { key: "red", label: "Red", bg: "bg-gradient-to-br from-red-500 to-red-600", border: "border-red-700" },
    { key: "blue", label: "Blue", bg: "bg-gradient-to-br from-blue-500 to-blue-600", border: "border-blue-700" },
    { key: "green", label: "Green", bg: "bg-gradient-to-br from-green-500 to-green-600", border: "border-green-700" },
    { key: "yellow", label: "Yellow", bg: "bg-gradient-to-br from-yellow-400 to-yellow-500", border: "border-yellow-600", text: "text-gray-800" },
    { key: "purple", label: "Purple", bg: "bg-gradient-to-br from-purple-500 to-purple-600", border: "border-purple-700" },
    { key: "orange", label: "Orange", bg: "bg-gradient-to-br from-orange-400 to-orange-500", border: "border-orange-600" },
]

const equations = [
    { id: 1, text: "Red + Blue + Green", expected: ["red", "blue", "green"], total: 14, description: "Primary Colors" },
    { id: 2, text: "Blue + Yellow + Purple", expected: ["blue", "yellow", "purple"], total: 12, description: "Cool Tones" },
    { id: 3, text: "Green + Yellow + Orange", expected: ["green", "yellow", "orange"], total: 16, description: "Nature Colors" },
    { id: 4, text: "Red + Purple + Orange", expected: ["red", "purple", "orange"], total: 12, description: "Warm Mix" },
    { id: 5, text: "Blue + Green + Purple", expected: ["blue", "green", "purple"], total: 16, description: "Jewel Tones" },
    { id: 6, text: "Red + Yellow + Blue", expected: ["red", "yellow", "blue"], total: 10, description: "Primary Mix" },
    { id: 7, text: "Green + Purple + Orange", expected: ["green", "purple", "orange"], total: 17, description: "Deep Colors" }
]

function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
}

function ColorPiece({ layerKey, label, bg, border, text = "text-white", isSelected, onClick }) {
    return (
        <motion.div
            onClick={() => onClick(layerKey)}
            className={`relative w-24 h-12 rounded-lg flex items-center justify-center font-bold cursor-pointer shadow-md ${bg} ${border} border-2 ${text} transition-all duration-200
                ${isSelected ? 'ring-4 ring-blue-500 scale-105' : ''}`}
            whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            whileTap={{ scale: 0.97 }}
        >
            <span className="text-sm">{label}</span>
            {isSelected && (
                <motion.div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white" />
                </motion.div>
            )}
        </motion.div>
    )
}

function CakeSlot({ cake, colorPalette, onColorApply, onRemove, isChecked, isCorrect, selectedColor }) {
    const levels = cake.expected.length
    
    const handleLayerClick = (e, idx) => {
        e.stopPropagation()
        const layerKey = cake.layers[idx]
        if (layerKey) {
            onRemove(cake.id, idx)
        } else if (selectedColor) {
            onColorApply(cake.id, selectedColor, idx)
        }
    }
    
    return (
        <div className="flex flex-col items-center gap-3 p-4 bg-white/50 rounded-2xl shadow-lg border border-gray-100 transition-all hover:shadow-xl">
            <div className="relative">
                <div className="relative flex flex-col-reverse items-center">
                    {Array.from({ length: levels }).map((_, idx) => {
                        const layerKey = cake.layers[idx]
                        const color = colorPalette.find((c) => c.key === layerKey)
                        const isHoverable = !layerKey && selectedColor
                        const width = 100 - (idx * 15)
                        const height = 40 - (idx * 2)

                        return (
                            <motion.div
                                key={idx}
                                className={`relative rounded-t-xl flex items-center justify-center cursor-pointer transition-all duration-200
                                    ${layerKey ? `${color.bg} text-white font-bold` : "bg-gray-100 text-gray-300"}
                                    ${isHoverable ? 'ring-2 ring-blue-400' : ''}
                                    ${isChecked ? (isCorrect ? "ring-2 ring-green-500" : "ring-2 ring-red-500") : ""}
                                `}
                                style={{
                                    width: `${width}px`,
                                    height: `${height}px`,
                                    zIndex: levels - idx,
                                    border: layerKey ? `2px solid ${color?.border?.replace('border-', 'border-') || '#000'}` : "2px dashed #cbd5e0",
                                    marginBottom: idx < levels - 1 ? `-${height * 0.4}px` : '0',
                                }}
                                whileHover={isHoverable ? { scale: 1.05 } : {}}
                                onClick={(e) => handleLayerClick(e, idx)}
                                title={layerKey ? "Click to remove" : (selectedColor ? `Click to apply ${selectedColor}` : "Select a color first")}
                            >
                                {layerKey && (
                                    <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-bold">
                                        {color.label[0].toUpperCase()}
                                    </motion.span>
                                )}
                                {isChecked && cake.layers.filter(Boolean).length > 0 && (
                                    <motion.div className="absolute -top-2 -right-2" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                        {isCorrect ? (
                                            <BsCheckCircle className="text-green-500 text-xl bg-white rounded-full" />
                                        ) : (
                                            <BsXCircle className="text-red-500 text-xl bg-white rounded-full" />
                                        )}
                                    </motion.div>
                                )}
                            </motion.div>
                        )
                    })}

                    {cake.layers.filter(Boolean).length === levels && (
                        <motion.div className="absolute -top-6 flex gap-1" initial={{ y: -5 }} animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
                            {Array.from({ length: cake.total }).map((_, i) => (
                                <motion.div key={i} className="w-2 h-6 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-full relative shadow-md">
                                    <div className="w-1 h-2 bg-gradient-to-b from-red-500 to-red-600 absolute -top-2 left-0.5 rounded-full animate-pulse" />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
            <div className="mt-4 text-center">
                <p className="text-sm font-medium text-gray-600">Target: {cake.total}</p>
                <p className="text-xs text-gray-500 mt-1 h-4">
                    {isChecked && (
                        <>
                            {isCorrect ? (
                                <span className="text-green-600 font-medium">✓ Correct!</span>
                            ) : (
                                <span className="text-red-600 font-medium">✗ Try again</span>
                            )}
                        </>
                    )}
                </p>
            </div>
        </div>
    )
}

function useCakeGame(onComplete) {
    const initialCakes = () => equations.map((eq) => ({
        ...eq,
        layers: Array(eq.expected.length).fill(null),
        isCorrect: null,
        sum: 0,
    }));

    const [cakes, setCakes] = useState(initialCakes());
    const [checked, setChecked] = useState(false)
    const [allCorrect, setAllCorrect] = useState(false)
    const [showConfetti, setShowConfetti] = useState(false)

    useEffect(() => {
        if (allCorrect && onComplete) {
            setTimeout(() => onComplete(true), 3000);
        }
    }, [allCorrect, onComplete]);

    const updateCake = (cakeId, newLayers) => {
        setChecked(false);
        setAllCorrect(false);
        setCakes(prev =>
            prev.map(cake => {
                if (cake.id !== cakeId) return cake;
                const sum = newLayers.reduce((acc, key) => acc + (key ? hiddenMapping[key] : 0), 0);
                return { ...cake, layers: newLayers, sum, isCorrect: null };
            })
        );
    };

    const applyColor = (cakeId, colorKey, idx) => {
        setCakes(prevCakes => {
            const targetCake = prevCakes.find(c => c.id === cakeId);
            if (!targetCake) return prevCakes;
            
            const newLayers = [...targetCake.layers];
            newLayers[idx] = colorKey;
            
            const sum = newLayers.reduce((acc, key) => acc + (key ? hiddenMapping[key] : 0), 0);
            
            const newCakes = prevCakes.map(cake => 
                cake.id === cakeId 
                    ? { ...cake, layers: newLayers, sum, isCorrect: null }
                    : cake
            );
            
            return newCakes;
        });
    };

    const removeLayer = (cakeId, idx) => {
        setCakes(prevCakes => {
            const targetCake = prevCakes.find(c => c.id === cakeId);
            if (!targetCake) return prevCakes;
            
            const newLayers = [...targetCake.layers];
            newLayers[idx] = null;
            
            return prevCakes.map(cake => 
                cake.id === cakeId 
                    ? { ...cake, layers: newLayers, sum: 0, isCorrect: null }
                    : cake
            );
        });
    };

    const checkAllCakes = () => {
        const updatedCakes = cakes.map((cake) => {
            const sum = cake.layers.reduce((acc, key) => acc + (key ? hiddenMapping[key] : 0), 0)
            const isComplete = cake.layers.every(Boolean);
            const isCorrect = isComplete && sum === cake.total;
            return { ...cake, sum, isCorrect }
        })

        const allAreCorrect = updatedCakes.every(cake => cake.isCorrect)
        
        setCakes(updatedCakes)
        setChecked(true)
        setAllCorrect(allAreCorrect)
        
        if (allAreCorrect) {
            setShowConfetti(true)
            setTimeout(() => setShowConfetti(false), 5000)
        }
    }

    const resetGame = () => {
        setCakes(initialCakes());
        setChecked(false)
        setAllCorrect(false)
        setShowConfetti(false)
    }

    return { cakes, checked, allCorrect, showConfetti, applyColor, removeLayer, checkAllCakes, resetGame, }
}

export default function M2({ config, onComplete }) {
    const { cakes, checked, allCorrect, showConfetti, applyColor, removeLayer, checkAllCakes, resetGame } = useCakeGame(onComplete)
    const [width, height] = useWindowSize();
    const { selectedColor, selectColor } = useColorSelection();

    return (
        <div className="min-h-screen flex flex-col items-center justify-start py-12 px-4 bg-gradient-to-br from-pink-50 to-blue-50 relative overflow-x-hidden">
            <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 10 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-pink-100 opacity-20"
                        initial={{
                            scale: Math.random() * 0.5 + 0.5,
                            x: Math.random() * width,
                            y: Math.random() * height,
                        }}
                        animate={{
                            y: [Math.random() * height, Math.random() * height],
                            x: [Math.random() * width, Math.random() * width],
                        }}
                        transition={{
                            duration: Math.random() * 20 + 20,
                            repeat: Infinity,
                            repeatType: "mirror",
                            ease: "easeInOut",
                        }}
                        style={{
                            width: `${Math.random() * 200 + 100}px`,
                            height: `${Math.random() * 200 + 100}px`,
                        }}
                    />
                ))}
            </div>

            <AnimatePresence>
                {showConfetti && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 pointer-events-none z-50"
                    >
                        <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div className="relative z-10 text-center mb-8" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-500">
                    🎂 Cake Matching Game
                </h1>
                <p className="text-slate-600 max-w-2xl mx-auto">
                    Click on the colors to select and apply them to the cakes.
                </p>
            </motion.div>

            <div className="relative z-10 w-full max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                    {cakes.map((cake, index) => (
                        <motion.div key={cake.id} className="flex flex-col items-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                            <div className="relative w-full flex flex-col items-center">
                                <div className="mb-3 text-center">
                                    <p className="text-lg font-medium text-slate-700 bg-white/80 px-4 py-2 rounded-full inline-block shadow-sm">
                                        {cake.text}
                                        {checked && <span className="font-bold"> = {cake.sum}</span>}
                                    </p>
                                </div>
                                <CakeSlot
                                    key={cake.id}
                                    cake={cake}
                                    colorPalette={colorPalette}
                                    onColorApply={applyColor}
                                    onRemove={removeLayer}
                                    isChecked={checked}
                                    isCorrect={cake.isCorrect}
                                    selectedColor={selectedColor}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <h2 className="text-lg font-semibold text-slate-700 mb-4 text-center">Color Palette</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        {colorPalette.map((color) => (
                            <div key={color.key} className="flex flex-col items-center">
                                <ColorPiece 
                                    key={color.key}
                                    layerKey={color.key} 
                                    label={color.label} 
                                    bg={color.bg} 
                                    border={color.border} 
                                    text={color.text || "text-white"}
                                    isSelected={selectedColor === color.key}
                                    onClick={selectColor}
                                />
                                {checked && (
                                    <div className="text-sm mt-2 text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                                        = {hiddenMapping[color.key]}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                    {!allCorrect ? (
                        <motion.button
                            onClick={checkAllCakes}
                            className="px-8 py-3 rounded-xl shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4)" }}
                            whileTap={{ scale: 0.98 }}
                            disabled={cakes.some(cake => cake.layers.some(layer => !layer))}
                            title={cakes.some(cake => cake.layers.some(layer => !layer)) ? "Please fill all cake slots first" : "Check your answers"}
                        >
                            <BsCheckCircle />
                            {checked ? 'Try Again' : 'Check Answers'}
                        </motion.button>
                    ) : (
                        <motion.div className="text-center" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                            <div className="text-2xl font-bold text-emerald-600 mb-4">
                                All Correct! 🎉
                            </div>
                            <motion.button
                                onClick={resetGame}
                                className="px-8 py-3 rounded-xl shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold text-lg flex items-center justify-center gap-2 mx-auto"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Play Again
                            </motion.button>
                        </motion.div>
                    )}
                    {(cakes.some(cake => cake.layers.some(layer => layer)) || checked) && !allCorrect && (
                        <motion.button
                            onClick={resetGame}
                            className="px-6 py-2.5 rounded-lg shadow bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium flex items-center justify-center gap-2 transition-colors"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <BsTrash className="text-red-500" />
                            Reset
                        </motion.button>
                    )}
                </div>
            </div>
        </div>
    )
}