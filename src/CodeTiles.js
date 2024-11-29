import React, { useState } from 'react';

const CodeTiles = () => {
  const [slots, setSlots] = useState([
    { id: 'slot-1', content: '' },
    { id: 'slot-2', content: '' },
    { id: 'slot-3', content: '' },
    { id: 'slot-4', content: '' }
  ]);

  const [blocks] = useState([
    { id: 'block-1', content: 'function factorial(n) {' },
    { id: 'block-2', content: '  if (n <= 1) return 1;' },
    { id: 'block-3', content: '  return n * factorial(n - 1);' },
    { id: 'block-4', content: '}' }
  ].sort(() => Math.random() - 0.5));

  const [message, setMessage] = useState('');

  const handleDragStart = (e, block) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(block));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, slotId) => {
    e.preventDefault();
    const block = JSON.parse(e.dataTransfer.getData('text/plain'));
    
    const newSlots = slots.map(slot => 
      slot.id === slotId ? { ...slot, content: block.content } : slot
    );
    
    setSlots(newSlots);
    checkSolution(newSlots);
  };

  const checkSolution = (currentSlots) => {
    const solution = [
      'function factorial(n) {',
      '  if (n <= 1) return 1;',
      '  return n * factorial(n - 1);',
      '}'
    ];

    const isCorrect = currentSlots.every((slot, index) => 
      slot.content === solution[index]
    );

    if (isCorrect) {
      setMessage('🎉 Congratulations! You\'ve built a working factorial function!');
    }
  };

  const resetGame = () => {
    setSlots([
      { id: 'slot-1', content: '' },
      { id: 'slot-2', content: '' },
      { id: 'slot-3', content: '' },
      { id: 'slot-4', content: '' }
    ]);
    setMessage('');
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">CodeTiles: Build a Factorial Function</h1>
        </header>

        <div className="space-y-6">
          <div className="border-2 border-dashed border-blue-300 p-4 rounded-lg space-y-2">
            {slots.map((slot) => (
              <div
                key={slot.id}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, slot.id)}
                className={`h-12 p-2 rounded-md font-mono text-sm ${
                  slot.content ? 'bg-blue-50' : 'bg-gray-50'
                } border-2 border-gray-200`}
              >
                {slot.content || 'Drop code block here'}
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-semibold text-sm text-gray-600 mb-2">Available Code Blocks:</h3>
            <div className="grid grid-cols-1 gap-2">
              {blocks.map((block) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, block)}
                  className="p-2 bg-white border-2 border-gray-200 rounded-md font-mono text-sm cursor-move hover:bg-gray-50"
                >
                  {block.content}
                </div>
              ))}
            </div>
          </div>

          {message && (
            <div className="p-4 bg-green-100 text-green-700 rounded-md">
              {message}
            </div>
          )}

          <button
            onClick={resetGame}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Reset Puzzle
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeTiles;