import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Confetti from 'react-confetti';

const CodeTiles = () => {
  const [slots, setSlots] = useState([
    { id: 'slot-1', content: null },
    { id: 'slot-2', content: null },
    { id: 'slot-3', content: null },
    { id: 'slot-4', content: null }
  ]);

  const [blocks, setBlocks] = useState([
    { id: 'block-1', content: 'function factorial(n) {' },
    { id: 'block-2', content: '  if (n <= 1) return 1;' },
    { id: 'block-3', content: '  return n * factorial(n - 1);' },
    { id: 'block-4', content: '}' }
    { id: 'block-5', content: 'function deepClone(obj) {'}, 
    { id: 'block-6', content:   '  return Object.keys(obj).reduce((clone, key) => {'},
    { id: 'block-7', content:   '    clone[key] = typeof obj[key] === "object" ? deepClone(obj[key]) : obj[key]; }, {});',
      '}'},
  ].sort(() => Math.random() - 0.5));

  const [message, setMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastDroppedIndex, setLastDroppedIndex] = useState(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset the animation flag after animation completes
  useEffect(() => {
    if (lastDroppedIndex !== null) {
      console.log('Animation started for index:', lastDroppedIndex); // Debug log
      const timer = setTimeout(() => {
        console.log('Resetting animation for index:', lastDroppedIndex); // Debug log
        setLastDroppedIndex(null);
      }, 500); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [lastDroppedIndex]);

  const checkSolution = (currentSlots) => {
    const solution = [
      'function factorial(n) {',
      '  if (n <= 1) return 1;',
      '  return n * factorial(n - 1);',
      '}',
      'function deepClone(obj) {',
      '  return Object.keys(obj).reduce((clone, key) => {',
      '    clone[key] = typeof obj[key] === "object" ? deepClone(obj[key]) : obj[key]; }, {});',
      '}',
    ];
    const isCorrect = currentSlots.every((slot, index) => 
      slot.content?.content === solution[index]
    );

    if (isCorrect) {
      setMessage('🎉 Congratulations! You\'ve built a working factorial function!');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const targetSlotIndex = destination.droppableId.startsWith('slot-')
      ? parseInt(destination.droppableId.split('-')[1]) - 1
      : null;

    if (targetSlotIndex !== null && slots[targetSlotIndex].content !== null) {
      return;
    }

    if (source.droppableId === 'block-list' && destination.droppableId.startsWith('slot-')) {
      const sourceBlock = blocks[source.index];
      const slotId = destination.droppableId.split('-')[1];
      const slotIndex = parseInt(slotId) - 1;

      const newSlots = slots.map((slot, index) => 
        index === slotIndex ? { ...slot, content: sourceBlock } : slot
      );

      const newBlocks = blocks.filter((_, index) => index !== source.index);

      // Add console.log for debugging
      console.log('Setting lastDroppedIndex to:', slotIndex);
      
      setSlots(newSlots);
      setBlocks(newBlocks);
      setLastDroppedIndex(slotIndex);
      checkSolution(newSlots);
    }

    if (source.droppableId.startsWith('slot-') && destination.droppableId === 'block-list') {
      const slotId = source.droppableId.split('-')[1];
      const slotIndex = parseInt(slotId) - 1;
      const sourceBlock = slots[slotIndex].content;

      const newSlots = slots.map((slot, index) => 
        index === slotIndex ? { ...slot, content: null } : slot
      );

      const newBlocks = [...blocks];
      newBlocks.splice(destination.index, 0, sourceBlock);

      setSlots(newSlots);
      setBlocks(newBlocks);
    }
  };

  const resetGame = () => {
    setSlots([
      { id: 'slot-1', content: null },
      { id: 'slot-2', content: null },
      { id: 'slot-3', content: null },
      { id: 'slot-4', content: null }
    ]);
    setBlocks([
      { id: 'block-1', content: 'function factorial(n) {' },
      { id: 'block-2', content: '  if (n <= 1) return 1;' },
      { id: 'block-3', content: '  return n * factorial(n - 1);' },
      { id: 'block-4', content: '}' }
    ].sort(() => Math.random() - 0.5));
    setMessage('');
    setShowConfetti(false);
    setLastDroppedIndex(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={true}
          numberOfPieces={200}
          gravity={0.2}
        />
      )}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-center">CodeTiles: Build a Factorial Function</h1>
          <p className="text-gray-600 text-center mt-2">Drag and drop the code blocks to build a factorial function</p>
        </header>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="space-y-6">
            <div className="border-2 border-dashed border-blue-300 p-4 rounded-lg space-y-2">
              {slots.map((slot, index) => (
                <Droppable 
                  key={slot.id} 
                  droppableId={`slot-${index + 1}`}
                  isDropDisabled={slot.content !== null}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`h-12 transition-all duration-200 rounded-md border-2 
                        ${snapshot.isDraggingOver && !slot.content 
                          ? 'drop-target' 
                          : 'bg-gray-50 border-gray-200'}
                        ${slot.content ? 'cursor-grab' : 'cursor-default'}
                      `}
                    >
                      {slot.content ? (
                        <Draggable
                          draggableId={`slot-content-${index}`}
                          index={0}
                        >
                          {(provided, snapshot) => {
                            const isJustDropped = lastDroppedIndex === index;
                            console.log(`Slot ${index} isJustDropped:`, isJustDropped); // Debug log
                            
                            return (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`h-full p-2 font-mono text-sm rounded-md
                                  ${snapshot.isDragging ? 'dragging bg-blue-100' : 'bg-blue-50'}
                                  ${isJustDropped ? 'drop-animation' : ''}
                                `}
                                key={isJustDropped ? 'dropping' : 'static'}
                              >
                                {slot.content.content}
                              </div>
                            );
                          }}
                        </Draggable>
                      ) : (
                        <div className="h-full p-2 text-gray-500 text-sm flex items-center justify-center">
                          Drop code block here
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>

            <div className="mt-8">
              {blocks.length > 0 && (
                <h3 className="font-semibold text-sm text-gray-600 mb-2 text-center">Available Code Blocks:</h3>
              )}
              <Droppable droppableId="block-list">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`grid grid-cols-1 gap-2 p-2 rounded-md transition-colors duration-200
                      ${snapshot.isDraggingOver ? 'bg-gray-50' : ''}`}
                  >
                    {blocks.map((block, index) => (
                      <Draggable key={block.id} draggableId={block.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-2 bg-white rounded-md font-mono text-sm cursor-move
                              transition-all duration-200 transform hover:shadow-md
                              border-2 hover:border-blue-300
                              ${snapshot.isDragging ? 'dragging scale-105' : 'border-gray-200 hover:bg-gray-50'}
                            `}
                          >
                            {block.content}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>

            {message && (
              <div className="p-4 bg-green-100 text-green-700 rounded-md text-center animate-fadeIn">
                {message}
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-blue-500 text-white rounded-md 
                  transition-all duration-200 transform hover:bg-blue-600 
                  hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 
                  focus:ring-blue-500 focus:ring-opacity-50"
              >
                Reset Puzzle
              </button>
            </div>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default CodeTiles;