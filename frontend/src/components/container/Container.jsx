import { useState } from 'react'
import { Appbar } from '../appbar/Appbar'
import './style.css'
import MyBoard from '../board/MyBoard';

export function Container(){

    const [strokesize, setSize] = useState(5);
    const [strokecolor, setColor] = useState("#518af4");
    const [currentTool, setCurrentTool] = useState('pencil');
    const [undoRedo, setUndoRedo] = useState(null);
    const [clearBoard, setClearBoard] = useState(false);
    const [bcolor, setBcolor] = useState("#ffffff")

    return <div className="container">
        <Appbar 
            strokesize={strokesize} 
            setSize={setSize} 
            strokecolor={strokecolor} 
            setColor={setColor} 
            setTool={setCurrentTool} 
            tool={currentTool}
            setUndoRedo={setUndoRedo}
            bcolor={bcolor}
            setBcolor={setBcolor}
            setClearBoard={setClearBoard}
        ></Appbar>
        <div className="board-container">
            <MyBoard 
                tool={currentTool} 
                color={strokecolor} 
                size={strokesize} 
                undoRedo={undoRedo} 
                setUndoRedo={setUndoRedo} 
                bcolor={bcolor}
                clearBoard={clearBoard}
                setClearBoard={setClearBoard}
            />
        </div>
    </div>
}