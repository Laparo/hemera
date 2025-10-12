import React from 'react';

interface Props {
  name: string;
  age: number;
}

const Component: React.FC<Props> = ({ name, age }) => {
  return (
    <div className='container'>
      <h1>Hello {name}</h1>
      <p>Age: {age}</p>
    </div>
  );
};

export default Component;
