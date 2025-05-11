import { useState, useRef, useEffect } from 'react';

export default function DraggableContainers() {
  // Container names mapping including Event Log
  const containerNames = {
    1: "",
    2: "Type pantsy",
    3: "Peterborough",
    4: "Huntingdon",
    5: "Bedford",
    6: "Luton",
    7: "Edit",
    8: "Outstanding",
    9: "Event Log",
    10: "Export Events" // New container for CSV export
  };

  // Default initial state
  const defaultContainers = [
    { id: 1, items: [] }, // SVG content
    { id: 2, items: [] }, // Ideas/Input Text
    { id: 3, items: [{ id: 1, text: "Text box 1", createdAt: new Date().toISOString() }] },
    { id: 4, items: [{ id: 3, text: "Text box 3", createdAt: new Date().toISOString() }] },
    { id: 5, items: [{ id: 4, text: "Text box 4", createdAt: new Date().toISOString() }, { id: 5, text: "Text box 5", createdAt: new Date().toISOString() }] },
    { id: 6, items: [] },
    { id: 7, items: [{ id: 6, text: "Text box 6", createdAt: new Date().toISOString() }] },
    { id: 8, items: [] }, // Edit container
    { id: 9, items: [] },  // Event Log container
    { id: 10, items: [] }  // Export Events container
  ];
  
  
  // Default next ID
  const defaultNextId = 7;

  // Default events array (for event log)
  const defaultEvents = [
    { 
      id: 1, 
      text: "ID: 1 \"Text box 1\" created", 
      createdAt: new Date().toISOString(),
      type: 'create'
    },
    { 
      id: 2, 
      text: "ID: 3 \"Text box 3\" created", 
      createdAt: new Date().toISOString(),
      type: 'create'
    },
    { 
      id: 3, 
      text: "ID: 4 \"Text box 4\" created", 
      createdAt: new Date().toISOString(),
      type: 'create'
    },
    { 
      id: 4, 
      text: "ID: 5 \"Text box 5\" created", 
      createdAt: new Date().toISOString(),
      type: 'create'
    },
    { 
      id: 5, 
      text: "ID: 6 \"Text box 6\" created", 
      createdAt: new Date().toISOString(),
      type: 'create'
    }
  ];

  // Initialize state with saved data or defaults
  const [containers, setContainers] = useState(() => {
    try {
      // Try to get saved containers from localStorage
      const savedContainers = localStorage.getItem('containers');
      return savedContainers ? JSON.parse(savedContainers) : defaultContainers;
    } catch (e) {
      console.error("Error loading containers from localStorage:", e);
      return defaultContainers;
    }
  });

  // State for the event log
  const [eventLog, setEventLog] = useState(() => {
    try {
      // Try to get saved events from localStorage
      const savedEventLog = localStorage.getItem('eventLog');
      return savedEventLog ? JSON.parse(savedEventLog) : defaultEvents;
    } catch (e) {
      console.error("Error loading eventLog from localStorage:", e);
      return defaultEvents;
    }
  });

  // State to track the item being dragged and its source container
  const [dragItem, setDragItem] = useState(null);
  const [dragSourceContainer, setDragSourceContainer] = useState(null);
  
  // Counter for generating new text box IDs - load from localStorage if available
  const [nextId, setNextId] = useState(() => {
    try {
      const savedNextId = localStorage.getItem('nextId');
      return savedNextId ? parseInt(savedNextId) : defaultNextId;
    } catch (e) {
      console.error("Error loading nextId from localStorage:", e);
      return defaultNextId;
    }
  });

  // State for the new text input
  const [newTextInput, setNewTextInput] = useState("");
  
  // Ref for the new text input
  const newTextInputRef = useRef(null);
  
  // Counter for generating event IDs
  const [nextEventId, setNextEventId] = useState(() => {
    try {
      const savedNextEventId = localStorage.getItem('nextEventId');
      return savedNextEventId ? parseInt(savedNextEventId) : defaultEvents.length + 1;
    } catch (e) {
      console.error("Error loading nextEventId from localStorage:", e);
      return defaultEvents.length + 1;
    }
  });
  
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

  // Initialize the Event Log container if it doesn't exist and update containers
  useEffect(() => {
    // Update the event log container (id 9) with current events
    setContainers(prevContainers => 
      prevContainers.map(container => 
        container.id === 9 
          ? { ...container, items: eventLog } 
          : container
      )
    );
  }, [eventLog]);
  
  // Save containers to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('containers', JSON.stringify(containers));
    } catch (e) {
      console.error("Error saving containers to localStorage:", e);
    }
  }, [containers]);
  
  // Save event log to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('eventLog', JSON.stringify(eventLog));
    } catch (e) {
      console.error("Error saving eventLog to localStorage:", e);
    }
  }, [eventLog]);
  
  // Save nextId to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('nextId', nextId.toString());
    } catch (e) {
      console.error("Error saving nextId to localStorage:", e);
    }
  }, [nextId]);

  // Save nextEventId to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('nextEventId', nextEventId.toString());
    } catch (e) {
      console.error("Error saving nextEventId to localStorage:", e);
    }
  }, [nextEventId]);

  // Helper function to format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      
      // Format date as DD/MM/YYYY
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      // Format time as HH:MM
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return {
        date: `${day}/${month}/${year}`,
        time: `${hours}:${minutes}`
      };
    } catch (e) {
      console.error("Error formatting date:", e);
      return { date: "unknown", time: "unknown" };
    }
  };

  // Add a new event to the log
  const addEvent = (type, itemId, itemText, source = null, target = null) => {
    const timestamp = new Date().toISOString();
    let eventText = "";
    
    // Create appropriate event text based on type
    switch (type) {
      case 'create':
        eventText = `ID: ${itemId} "${itemText}" created on: ${formatDate(timestamp).date} at: ${formatDate(timestamp).time}`;
        break;
      case 'move':
        eventText = `ID: ${itemId} "${itemText}" moved from "${containerNames[source]}" → "${containerNames[target]}" on: ${formatDate(timestamp).date} at: ${formatDate(timestamp).time}`;
        break;
      case 'edit':
        eventText = `ID: ${itemId} text changed to "${itemText}" on: ${formatDate(timestamp).date} at: ${formatDate(timestamp).time}`;
        break;
      case 'delete':
        eventText = `ID: ${itemId} "${itemText}" deleted on: ${formatDate(timestamp).date} at: ${formatDate(timestamp).time}`;
        break;
      default:
        eventText = `ID: ${itemId} unknown event on: ${formatDate(timestamp).date} at: ${formatDate(timestamp).time}`;
    }
    
    // Create new event item
    const newEvent = {
      id: nextEventId,
      text: eventText,
      createdAt: timestamp,
      type: type
    };
    
    // Add event to the Event Log state
    setEventLog(prevEvents => [newEvent, ...prevEvents]);
    
    // Increment event ID counter
    setNextEventId(prev => prev + 1);
    
    return timestamp;
  };

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
    
    // Prevent dropping into SVG container (id 1) or Event Log container (id 9)
    if (targetContainerId === 1 || targetContainerId === 9) {
      return;
    }
    
    if (dragItem && dragSourceContainer !== null) {
      // Don't log if dropped back into same container
      if (dragSourceContainer !== targetContainerId) {
        // Log the move event
        addEvent(
          'move',
          dragItem.id,
          dragItem.text,
          dragSourceContainer,
          targetContainerId
        );
      }
      
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
      const timestamp = new Date().toISOString();
      
      const newItem = {
        id: nextId,
        text: newTextInput,
        createdAt: timestamp
      };
      
      // Log the creation event
      addEvent(
        'create',
        nextId,
        newTextInput
      );
      
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
    // Get the current text
    const currentItem = containers.find(c => c.id === containerId)?.items.find(i => i.id === itemId);
    const currentText = currentItem?.text || '';
    
    // Only log if the text actually changed
    if (currentText !== newText) {
      addEvent(
        'edit',
        itemId,
        newText
      );
    }
    
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
    // Find the text of the item being deleted
    const itemText = containers.find(c => c.id === containerId)?.items.find(i => i.id === itemId)?.text || '';
    
    // Log the deletion event
    addEvent(
      'delete',
      itemId,
      itemText
    );
    
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

  const clearEventLog = () => {
    if (window.confirm("Are you sure you want to clear all events from the log?")) {
      setEventLog([]);
      // Also clear the event log container items
      setContainers(prevContainers => 
        prevContainers.map(container => 
          container.id === 9 
            ? { ...container, items: [] } 
            : container
        )
      );
    }
  };

// Add this function after the deleteTextBox function
const copyEventsToCSV = () => {
  // Convert events to CSV format
  const headers = ["ID", "Event", "Created At", "Type"];
  const csvRows = [headers.join(",")];
  
  eventLog.forEach(event => {
    const row = [
      event.id,
      `"${event.text.replace(/"/g, '""')}"`, // Escape quotes in CSV
      event.createdAt,
      event.type
    ];
    csvRows.push(row.join(","));
  });
  
  const csvString = csvRows.join("\n");
  
  // Copy to clipboard
  navigator.clipboard.writeText(csvString)
    .then(() => {
      alert("Event log copied to clipboard as CSV");
    })
    .catch(err => {
      console.error("Failed to copy to clipboard:", err);
      alert("Failed to copy to clipboard");
    });
};

  // Get container position style - positions relative to viewport
  const getContainerPositionStyle = (containerId) => {
    const containerWidth = 250; // Container width in pixels
    const padding = 20; // Padding from viewport edges
    
    switch(containerId) {
      case 1: // SVG Map - center
        return { 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', // Transform both X and Y for true centering
          width: `${svgWidth}px`,
          height: `${svgHeight}px`,
          zIndex: 0
        };
      case 2: // Ideas - top center
        return { 
          position: 'fixed', 
          top: `${padding}px`, 
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${containerWidth}px` 
        };
      case 3: // Peterborough - top right
        return { 
          position: 'fixed', 
          top: `${padding}px`, 
          right: `${padding}px`, 
          width: `${containerWidth}px` 
        };
      case 4: // Huntingdon - middle right
        return { 
          position: 'fixed', 
          top: `${windowSize.height / 2 - 150}px`, 
          right: `${windowSize.width / 2 - 400}px`, // Changed from padding to be more to the left
          width: `${containerWidth}px` 
        };
      case 5: // Bedford - top left
        return { 
          position: 'fixed', 
          top: `${padding}px`, 
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
      case 7: // Edit - bottom center
        return { 
          position: 'fixed', 
          bottom: `${padding}px`, 
          left: `50%`, 
          transform: 'translateX(-50%)',
          width: `${containerWidth}px` 
        };
      case 8: // Outstanding - bottom right
        return { 
          position: 'fixed', 
          bottom: `${padding}px`, 
          right: `${padding}px`, 
          width: `${containerWidth}px` 
        };

// Update the style for Event Log container to accommodate the button
case 9: // Event Log - middle left
  return { 
    position: 'fixed', 
    top: `${windowSize.height / 2 - 150}px`, 
    left: `${windowSize.width / 2 - 400}px`, // Changed from padding to be more to the right
    width: `${containerWidth + 50}px`, // Slightly wider for event logs
    maxHeight: '100px', // Increase height to accommodate button
    overflowY: 'auto'
  };
    }}
        // Define a consistent delete button style
        const deleteButtonStyle = {
          marginLeft: '4px',
          fontSize: '12px',
          lineHeight: '1',
          padding: '2px 4px',
          color: '#ef4444',
          cursor: 'pointer'
        };

  // Add this function before the return statement
  const getTextColor = (text) => {
    const lowerText = text.toLowerCase();
    
    // Color words with bold
    if (lowerText.includes('red')) return { color: '#dc2626', fontWeight: 'bold' };
    if (lowerText.includes('yellow')) return { color: '#eab308', fontWeight: 'bold' };
    if (lowerText.includes('blue')) return { color: '#2563eb', fontWeight: 'bold' };
    if (lowerText.includes('orange')) return { color: '#ea580c', fontWeight: 'bold' };
    if (lowerText.includes('green')) return { color: '#16a34a', fontWeight: 'bold' };
    
    // New formatting rules
    if (lowerText.includes('miv')) return { color: '#00008B' }; // Dark Blue
    if (lowerText.includes('gopro')) return { color: '#00FF00', fontWeight: 'bold' }; // Pure Green
    if (lowerText.includes('wireless rig')) return { color: '#00FF00', fontWeight: 'bold' }; // Pure Green
    if (lowerText.includes('corsa')) return { color: '#404040', textDecoration: 'underline', fontWeight: 'bold' }; // Dark Grey
    if (lowerText.includes('toyota')) return { color: '#40E0D0', textDecoration: 'underline', fontWeight: 'bold' }; // Turquoise
    if (lowerText.includes('rig van')) return { color: '#8B4513', textDecoration: 'underline', fontWeight: 'bold' }; // Brown
    
    return { color: 'inherit', fontWeight: 'normal', textDecoration: 'none' };
  };

  const renderTwoColumnContainer = (container, items) => {
    const isBedford = container.id === 5;
    const isPeterborough = container.id === 3;
    
    if (!isBedford && !isPeterborough) return null;
    
    return (
      <div className="flex flex-col gap-2">
        {items.length === 0 ? (
          <div className="text-gray-400 text-center p-4 border border-dashed border-gray-300 rounded h-full flex items-center justify-center">
            Drop items here
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {items.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, container.id, item)}
                className="bg-gray-50 p-2 rounded border border-gray-200 cursor-move hover:shadow-md group relative"
              >
                <div className="flex justify-between items-center">
                  <input
                    value={item.text}
                    onChange={(e) => editTextBox(container.id, item.id, e.target.value)}
                    className="bg-transparent outline-none flex-grow text-left py-1 px-2 text-lg w-[200px] h-[40px]"
                    style={getTextColor(item.text)}
                  />
                  <button
                    onClick={() => deleteTextBox(container.id, item.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-sm"
                    style={deleteButtonStyle}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Positioned Containers */}
      {containers.map((container) => (
        <div
          key={container.id}
          className={`bg-white p-4 rounded shadow-md transition-all duration-300 flex flex-col border-2 border-gray-300 ${container.id === 1 ? 'overflow-hidden' : 'min-h-32'}`}
          style={{...getContainerPositionStyle(container.id), zIndex: container.id === 1 ? 0 : 10}}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, container.id)}
        >
          <h2 className="text-lg font-semibold mb-2 text-center border-b pb-2 uppercase">
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
            // Ideas container with input field and add button
            <div className="flex-grow">
              <div className="mb-2">
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
                    className="ml-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              {/* Draggable items in Ideas container */}
              <div className="mt-4">
                {container.items.length === 0 ? (
                  <div className="text-gray-400 text-center p-4 border-2 border-dashed border-gray-200 rounded">
                    No items yet
                  </div>
                ) : (
                  container.items.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, container.id, item)}
                      className="bg-gray-50 p-2 mb-2 rounded border border-gray-200 cursor-move hover:shadow-md group relative"
                    >
                      <div className="flex justify-between items-center">
                        <input
                          value={item.text}
                          onChange={(e) => editTextBox(container.id, item.id, e.target.value)}
                          className="bg-transparent outline-none flex-grow text-left py-1 px-2 text-lg w-[200px] h-[40px]"
                          style={getTextColor(item.text)}
                        />
                        <button
                          onClick={() => deleteTextBox(container.id, item.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-sm"
                          style={deleteButtonStyle}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : container.id === 9 ? (
            // Event Log container with buttons at the top
            <>
              <div className="flex justify-between items-center mb-2 border-b pb-2">
                <h2 className="text-lg font-semibold uppercase">
                </h2>
                <div className="flex gap-2">
                  <button 
                    onClick={copyEventsToCSV}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Copy to CSV
                  </button>
                  <button 
                    onClick={clearEventLog}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              <div className="flex-grow overflow-y-auto" style={{ maxHeight: '280px' }}>
                {eventLog.length === 0 ? (
                  <div className="text-gray-400 text-center p-4">
                    No events recorded yet
                  </div>
                ) : (
                  eventLog.map((item) => (
                    <div
                      key={item.id}
                      className={`p-2 mb-2 rounded border ${
                        item.type === 'create' ? 'border-green-200 bg-green-50' : 
                        item.type === 'move' ? 'border-blue-200 bg-blue-50' : 
                        item.type === 'edit' ? 'border-yellow-200 bg-yellow-50' : 
                        'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="px-2 py-1 text-xs">
                        {item.text}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            // Regular container items
            <div className="flex-grow flex flex-col" style={{ gap: '8px' }}>
              {container.id === 3 || container.id === 5 ? (
                renderTwoColumnContainer(container, container.items)
              ) : container.items.length === 0 ? (
                <div className="text-gray-400 text-center p-4 border-2 border-dashed border-gray-200 rounded h-full flex items-center justify-center">
                  Drop items here
                </div>
              ) : (
                container.items.map((item) => (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, container.id, item)}
                    className="bg-gray-50 p-2 rounded border border-gray-200 cursor-move hover:shadow-md group relative"
                  >
                    <div className="flex justify-between items-center">
                      <input
                        value={item.text}
                        onChange={(e) => editTextBox(container.id, item.id, e.target.value)}
                        className="bg-transparent outline-none flex-grow text-left py-1 px-2 text-lg w-[200px] h-[40px]"
                        style={getTextColor(item.text)}
                      />
                      <button
                        onClick={() => deleteTextBox(container.id, item.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-sm"
                        style={deleteButtonStyle}
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
