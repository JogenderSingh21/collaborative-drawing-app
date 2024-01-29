import { useState } from 'react'
import { Appbar } from '../appbar/Appbar'
import './style.css'
import MyBoard from '../board/MyBoard';

export function Container(){
    const [strokesize, setSize] = useState(5);
    const [strokecolor, setColor] = useState("#0000ff");
    const [currentTool, setCurrentTool] = useState('pencil');
    const [undoRedo, setUndoRedo] = useState(null);

    return <div className="container">
        <Appbar 
            strokesize={strokesize} 
            setSize={setSize} 
            strokecolor={strokecolor} 
            setColor={setColor} 
            setTool={setCurrentTool} 
            tool={currentTool}
            setUndoRedo={setUndoRedo}
        ></Appbar>
        <div className="board-container">
            {/* <Board color={strokecolor} size={strokesize} currentTool={currentTool}></Board> */}
            <MyBoard tool={currentTool} color={strokecolor} size={strokesize} undoRedo={undoRedo} setUndoRedo={setUndoRedo} />
        </div>
    </div>
}