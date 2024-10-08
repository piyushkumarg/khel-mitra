import React from 'react';

interface SnakeProps {
  snakeDots: number[][];
}

const Snake: React.FC<SnakeProps> = ({ snakeDots }) => {
  return (
    <>
      {snakeDots.map((dot, i) => (
        <div
          key={i}
          className={`absolute bg-black ${i === snakeDots.length - 1 ? 'bg-red-600' : ''}`}
          style={{
            left: `${dot[0]}%`,
            top: `${dot[1]}%`,
            width: '2%',
            height: '2%',
          }}
        />
      ))}
    </>
  );
};

export default Snake;
