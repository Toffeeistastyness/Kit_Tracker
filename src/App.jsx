import { useState, useRef, useEffect } from 'react';

export default function DraggableContainers() {
  // Update container names mapping to include "SVG content"
  const containerNames = {
    1: "",
    2: "Input Text",
    3: "Peterborough",
    4: "Huntingdon",
    5: "Bedford",
    6: "Luton",
    7: "Box",
    8: "Edit"
  };

  // Default initial state
  const defaultContainers = [
    { id: 1, items: [] }, // SVG content
    { id: 2, items: [] }, // Input Text
    { id: 3, items: [{ id: 1, text: "Text box 1" }, { id: 2, text: "Text box 2" }] },
    { id: 4, items: [{ id: 3, text: "Text box 3" }] },
    { id: 5, items: [{ id: 4, text: "Text box 4" }, { id: 5, text: "Text box 5" }] },
    { id: 6, items: [] },
    { id: 7, items: [{ id: 6, text: "Text box 6" }] },
    { id: 8, items: [] } // Edit container
  ];
  
  // Default next ID
  const defaultNextId = 7;

  // Initialize state with saved data or defaults
  const [containers, setContainers] = useState(() => {
    // Try to get saved containers from localStorage
    const savedContainers = localStorage.getItem('containers');
    return savedContainers ? JSON.parse(savedContainers) : defaultContainers;
  });

  // State to track the item being dragged and its source container
  const [dragItem, setDragItem] = useState(null);
  const [dragSourceContainer, setDragSourceContainer] = useState(null);
  
  // Counter for generating new text box IDs - load from localStorage if available
  const [nextId, setNextId] = useState(() => {
    const savedNextId = localStorage.getItem('nextId');
    return savedNextId ? parseInt(savedNextId) : defaultNextId;
  });
  
  // State for the new text input
  const [newTextInput, setNewTextInput] = useState("");
  
  // Ref for the new text input
  const newTextInputRef = useRef(null);
  
  // State to store window dimensions
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1000,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  // Update window dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Save containers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('containers', JSON.stringify(containers));
  }, [containers]);
  
  // Save nextId to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('nextId', nextId.toString());
  }, [nextId]);

  // SVG dimensions with scaling factor of 0.5 (50% of original size)
  const svgOriginalWidth = 459;
  const svgOriginalHeight = 996;
  const scaleFactor = 0.5; // Scaling down by 50%
  
  const svgWidth = svgOriginalWidth * scaleFactor;
  const svgHeight = svgOriginalHeight * scaleFactor;

  // Handle drag start
  const handleDragStart = (e, containerId, item) => {
    setDragItem(item);
    setDragSourceContainer(containerId);
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (e, targetContainerId) => {
    e.preventDefault();
    
    // Prevent dropping into SVG container (id 1)
    if (targetContainerId === 1) {
      return;
    }
    
    if (dragItem && dragSourceContainer !== null) {
      // Create new containers array
      const newContainers = containers.map(container => {
        // Remove from source container
        if (container.id === dragSourceContainer) {
          return {
            ...container,
            items: container.items.filter(item => item.id !== dragItem.id)
          };
        }
        
        // Add to target container
        if (container.id === targetContainerId) {
          return {
            ...container,
            items: [...container.items, dragItem]
          };
        }
        
        return container;
      });
      
      setContainers(newContainers);
      setDragItem(null);
      setDragSourceContainer(null);
    }
  };

  // Add new text box
  const addNewTextBox = () => {
    if (newTextInput.trim()) {
      const newItem = {
        id: nextId,
        text: newTextInput
      };
      
      // Add to Input Text container
      const newContainers = [...containers];
      const inputTextContainerIndex = newContainers.findIndex(container => container.id === 2);
      
      if (inputTextContainerIndex !== -1) {
        newContainers[inputTextContainerIndex] = {
          ...newContainers[inputTextContainerIndex],
          items: [...newContainers[inputTextContainerIndex].items, newItem]
        };
        
        setContainers(newContainers);
        setNextId(nextId + 1);
        setNewTextInput('');
        
        // Focus the input after adding
        if (newTextInputRef.current) {
          newTextInputRef.current.focus();
        }
      }
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setNewTextInput(e.target.value);
  };
  
  // Handle key press for input field
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addNewTextBox();
    }
  };

  // Edit text box content
  const editTextBox = (containerId, itemId, newText) => {
    const newContainers = containers.map(container => {
      if (container.id === containerId) {
        return {
          ...container,
          items: container.items.map(item => 
            item.id === itemId ? { ...item, text: newText } : item
          )
        };
      }
      return container;
    });
    
    setContainers(newContainers);
  };

  // Delete text box
  const deleteTextBox = (containerId, itemId) => {
    const newContainers = containers.map(container => {
      if (container.id === containerId) {
        return {
          ...container,
          items: container.items.filter(item => item.id !== itemId)
        };
      }
      return container;
    });
    
    setContainers(newContainers);
  };

  // Get container position style - positions relative to viewport
  const getContainerPositionStyle = (containerId) => {
    const containerWidth = 250; // Container width in pixels
    const padding = 20; // Padding from viewport edges
    
    switch(containerId) {
      case 1: // SVG content - center
        return { 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', // Transform both X and Y for true centering
          width: `${svgWidth}px`,
          height: `${svgHeight}px`,
          zIndex: 0
        };
      case 2: // Input Text - top center
        return { 
          position: 'fixed', 
          top: `${padding}px`, 
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${containerWidth}px` 
        };
      case 3: // Peterborough - top left
        return { 
          position: 'fixed', 
          top: `${padding}px`, 
          left: `${padding}px`, 
          width: `${containerWidth}px` 
        };
      case 4: // Huntingdon - top right
        return { 
          position: 'fixed', 
          top: `${padding}px`, 
          right: `${padding}px`, 
          width: `${containerWidth}px` 
        };
      case 5: // Bedford - middle left
        return { 
          position: 'fixed', 
          top: `${windowSize.height / 2 - 150}px`, 
          left: `${padding}px`, 
          width: `${containerWidth}px` 
        };
      case 6: // Luton - bottom left
        return { 
          position: 'fixed', 
          bottom: `${padding}px`, 
          left: `${padding}px`, 
          width: `${containerWidth}px` 
        };
      case 7: // Box - bottom center
        return { 
          position: 'fixed', 
          bottom: `${padding}px`, 
          left: `50%`, 
          transform: 'translateX(-50%)',
          width: `${containerWidth}px` 
        };
      case 8: // Edit - bottom right
        return { 
          position: 'fixed', 
          bottom: `${padding}px`, 
          right: `${padding}px`, 
          width: `${containerWidth}px` 
        };
      default:
        return {};
    }
  };

  return (
    <>
      {/* Positioned Containers */}
      {containers.map((container) => (
        <div
          key={container.id}
          style={getContainerPositionStyle(container.id)}
          className={`bg-white p-4 rounded shadow-md transition-all duration-300 flex flex-col ${container.id === 1 ? 'overflow-hidden' : 'min-h-32'}`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, container.id)}
        >
          <h2 className="text-lg font-semibold mb-3 text-left border-b pb-2 uppercase">
            {containerNames[container.id]}
          </h2>
          
          {container.id === 1 ? (
            // SVG content
            <div className="relative">
              <svg 
                width="100%" 
                height="100%" 
                viewBox="0 0 459 996" 
                preserveAspectRatio="xMidYMid meet"
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  border: '1px dashed #ccc',
                  display: 'block'
                }}
              >
                {/* Base Layer - Lines */}
                <line x1="170.998" y1="656.018" x2="124.802" y2="446.599" stroke="black" strokeWidth="3"/>
                <line x1="301.416" y1="240.904" x2="127.414" y2="447.243" stroke="black" strokeWidth="3"/>
                <line x1="301.703" y1="240.377" x2="173.896" y2="656.135" stroke="black" strokeWidth="3"/>
                <line x1="241.707" y1="19.8978" x2="173.954" y2="655.853" stroke="black" strokeWidth="3"/>
                <line x1="241.665" y1="20.1248" x2="127.717" y2="448.201" stroke="black" strokeWidth="3"/>
                <line x1="241.663" y1="19.3442" x2="301.717" y2="239.542" stroke="black" strokeWidth="3"/>
                
                <line x1="330.5" y1="977" x2="301.717" y2="239.542" stroke="grey" strokeWidth="3" strokeOpacity="0.5"/>
                <line x1="330.5" y1="977" x2="172" y2="655" stroke="grey" strokeWidth="3" strokeOpacity="0.5"/>
                <line x1="330.5" y1="977" x2="126" y2="446" stroke="grey" strokeWidth="3" strokeOpacity="0.5"/>
                
                {/* Second Layer - Circles and ellipses */}
                <ellipse cx="172" cy="655" rx="19" ry="20" fill="black"/>
                <ellipse cx="330.5" cy="977" rx="19.5" ry="19" fill="black"/>
                <circle cx="126" cy="446" r="19" fill="black"/>
                <ellipse cx="299.5" cy="239" rx="19.5" ry="19" fill="black"/>
                <circle cx="240" cy="19" r="19" fill="black"/>
                
                {/* Third Layer - Yellow rectangles */}
                <rect x="158" y="208" width="52" height="23" fill="#FBFF00"/>
                <rect x="188" y="268" width="52" height="23" fill="#FBFF00"/>
                <rect x="147" y="373" width="52" height="23" fill="#FBFF00"/>
                <rect x="252" y="127" width="52" height="23" fill="#FBFF00"/>
                <rect x="119" y="516" width="52" height="23" fill="#FBFF00"/>
                <rect x="226" y="415" width="52" height="23" fill="#FBFF00"/>
                <rect x="200" y="850" width="52" height="23" fill="#FBFF00"/>
                <rect x="250" y="800" width="52" height="23" fill="#FBFF00"/>
                <rect x="300" y="750" width="52" height="23" fill="#FBFF00"/>
                
                {/* Top Layer - Text labels */}
                <text x="161" y="225" fontFamily="Arial" fontSize="14" fill="black">50 mins</text>
                <text x="191" y="285" fontFamily="Arial" fontSize="14" fill="black">80 mins</text>
                <text x="150" y="390" fontFamily="Arial" fontSize="14" fill="black">80 mins</text>
                <text x="255" y="144" fontFamily="Arial" fontSize="14" fill="black">24 mins</text>
                <text x="122" y="533" fontFamily="Arial" fontSize="14" fill="black">40 mins</text>
                <text x="229" y="432" fontFamily="Arial" fontSize="14" fill="black">70 mins</text>
                <text x="203" y="867" fontFamily="Arial" fontSize="14" fill="black">70 mins</text>
                <text x="253" y="817" fontFamily="Arial" fontSize="14" fill="black">130 mins</text>
                <text x="303" y="767" fontFamily="Arial" fontSize="14" fill="black">105 mins</text>
              </svg>
              
              {/* Center point indicator */}
              <div 
                className="absolute bg-red-500 rounded-full"
                style={{
                  width: '8px',
                  height: '8px',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 15
                }}
              ></div>
            </div>
          ) : container.id === 2 ? (
            // Input Text container with input field and add button
            <div className="flex-grow">
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    ref={newTextInputRef}
                    type="text"
                    value={newTextInput}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type new text box content"
                    className="flex-grow p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <button
                    onClick={addNewTextBox}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              {/* Draggable items in Input Text container */}
              <div className="mt-4">
                {container.items.length === 0 ? (
                  <div className="text-gray-400 text-left p-4 border-2 border-dashed border-gray-200 rounded">
                  </div>
                ) : (
                  container.items.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, container.id, item)}
                      className="bg-gray-50 p-3 mb-2 rounded border border-gray-200 cursor-move hover:shadow-md group relative"
                    >
                      <div className="flex justify-between items-center">
                        <input
                          value={item.text}
                          onChange={(e) => editTextBox(container.id, item.id, e.target.value)}
                          className="bg-transparent outline-none w-full pr-8 text-left"
                        />
                        <button
                          onClick={() => deleteTextBox(container.id, item.id)}
                          className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            // Regular container items
            <div className="flex-grow">
              {container.items.length === 0 ? (
                <div className="text-gray-400 text-left p-4 border-2 border-dashed border-gray-200 rounded">
                  Drop items here
                </div>
              ) : (
                container.items.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, container.id, item)}
                    className="bg-gray-50 p-3 mb-2 rounded border border-gray-200 cursor-move hover:shadow-md group relative"
                  >
                    <div className="flex justify-between items-center">
                      <input
                        value={item.text}
                        onChange={(e) => editTextBox(container.id, item.id, e.target.value)}
                        className="bg-transparent outline-none w-full pr-8 text-left"
                      />
                      <button
                        onClick={() => deleteTextBox(container.id, item.id)}
                        className="absolute right-2 top-3 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ))}
      
      {/* Viewport center indicator */}
      <div 
        className="fixed bg-green-500 rounded-full"
        style={{
          width: '12px',
          height: '12px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 30
        }}
      ></div>
    </>
  );
}