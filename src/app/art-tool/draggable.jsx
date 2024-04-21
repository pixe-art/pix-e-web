import React, {useState, useEffect} from "react";

// can be used to move elements on the screen (e.g. color palette)
const Draggable = ({ children }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({x:0,y:0});
    const [startPosition, setStartPosition] = useState({x: 0, y: 0});
    const [dragged, setDragged] = useState(false);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragged(false);
        setStartPosition({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
        e.stopPropagation();
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - startPosition.x,
            y: e.clientY - startPosition.y
        });
        setDragged(true);
        e.stopPropagation();
    }

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            style={{
                cursor: 'default', 
                position: 'absolute', 
                left: `${position.x}px`, 
                top:`${position.y}px`
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            >
                {children}
            </div>
    );
};

export default Draggable;