import React, { useState } from 'react';

/**
 * interactive React component.
 * 
 * @returns tree of visual elements that React renders on the screen.
 */
const MemorySimulator = () => {
  const [memory, setMemory] = useState([{ id: null, size: 1024 }]); // 1024 KB en total
  const [strategy, setStrategy] = useState('best');
  const [processSize, setProcessSize] = useState('');
  const [processId, setProcessId] = useState('');    

  /**
   * react functional component
   * 
   * This component is called every time the user clicks the "Assign" button.     
   */
  const allocateMemory = () => {

    const newBlockSize = parseInt(processSize);
    const newBlockId = processId;    

    if( !newBlockSize || !newBlockId){
      return;
    }

    let chosenIndex = -1;        

    /**
     * implementation of the memory allocation strategy "Best fit"
     * 
     * we look for the null id, means "vacant block"
     * We look for the smallest block that best fits the requested size
     * 
     */
    if(strategy === 'best'){      
      let bestSize = Infinity;
      
      for (let i = 0; i < memory.length; i++) {
        
        if(memory[i].id === null && memory[i].size >= newBlockSize && newBlockSize < bestSize){
          chosenIndex = i;
          bestSize = memory[i].size;
        }
        
      }

    } 
    /**
     * implementation of the memory allocation strategy "First fit"
     * 
     * we look for the null id, means "vacant block"
     * We look for the first largest block to take its index
     */
    else if(strategy === 'first'){ // first fit strategy

      for(let i=0; i<memory.length; i++){

        if(memory[i].id === null && memory[i].size >= newBlockSize){
          chosenIndex = i;
          break;
        }

      }
    }

    /**
     * if it is different from -1.
     * It means that it did find an available block according to the strategy.
     * 
     * We delete the block with the chosen index, 
     * create a new one with the requested value, 
     * create another new one with the value of block.size - newBlockSize
     * 
     * otherwise, we assign in that index
     */
    if(chosenIndex !== -1){
      const blocks = [...memory];
      const block = blocks[chosenIndex];            

      if(block.size >= newBlockSize){
        blocks.splice(
          chosenIndex, 
          1,
          { id: newBlockId, size: newBlockSize },
          { id: null, size: block.size - newBlockSize }
        );                
      }
      else{
        blocks.splice({ id: newBlockId, size: block.size });
      }      

      setMemory(blocks);            
    }
    else{
      alert('No sufficient memory block found');
    }        

  }

  /**
   * This arrow function is responsible for freeing a block using an ID.
   * 
   * It also merges free blocks that are in close proximity.
   * 
   * @param {*} id identifier of the process to be eliminated
   */
  const freeMemory = (id) => {
    const blocks = memory.map((block) => 
      (block.id === id ? { id: null, size: block.size } : block));
    
    for (let i = 0; i < blocks.length - 1; i++) { // fusiona los bloques libres.

      if (blocks[i].id === null && blocks[i + 1].id === null) {                
        blocks[i].size += blocks[i + 1].size;              
        blocks.splice(i + 1, 1);
        i--;
      }
    }
    setMemory(blocks);
  };    

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Simulador de Gestión de Memoria</h1>            

      <div className="mb-2 flex items-cente ">
        <input
          type="text"
          placeholder="ID del proceso"
          value={processId}
          onChange={(e) => setProcessId(e.target.value)}
          className="border px-2 py-1 mr-2"
        />
        <input
          type="number"
          placeholder="Tamaño en KB"
          value={processSize}
          onChange={(e) => setProcessSize(e.target.value)}
          className="border px-2 py-1 mr-2"
        />
        <select
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
          className="border px-2 py-1 mr-2"
        >
          <option value="best">Mejor ajuste</option>
          <option value="first">Primer ajuste</option>
        </select>                            
        <button onClick={allocateMemory} className="bg-blue-600 text-white px-4 py-1 rounded">
          Asignar
        </button>     
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Bloques de Memoria</h2>
        <div className="border-2 border-blue-500 rounded-lg p-2 space-y-1 h-[68vh] overflow-y-auto flex flex-col">
          {memory.filter(block => block.size > 0 ).map((block, index) => (
            <div
              key={index}
              className={`p-2 ${block.id ? 'bg-red-200' : 'bg-green-100'} flex justify-between items-center`}
               style={{ flexGrow: block.size }}
            >
              <span>
                {block.id? `Proceso ${block.id}` : `Libre ${block.size} KB)`}
              </span>
              {block.id && (
                <button
                  onClick={() => freeMemory(block.id)}
                  className="text-sm bg-red-500 text-white px-2 rounded"
                >
                  Liberar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemorySimulator;
