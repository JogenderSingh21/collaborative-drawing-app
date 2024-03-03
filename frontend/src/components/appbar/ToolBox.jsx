import React from 'react';
import pencil from '../../assets/pencil.svg';
import eraser from '../../assets/eraser.svg';
import line from '../../assets/line.svg';
import rectangle from '../../assets/rectangle.svg';
import circle from '../../assets/circle.svg';
import './style.css';

export function ToolBox({ strokesize, setSize, strokecolor, setColor, setTool, tool}) {

    const handleChangeSize = (e) => {
        setSize(e.target.value);
    };

    const handleColorChange = (e) => {
        setColor(e.target.value);
    };

    const handleToolChange = (tool) => {
        setTool(tool);
    };

    return (
        <div className='tools-section tool-box'>
            <button
                className={`pencil tool ${tool === 'pencil' ? 'selected' : ''}`}
                onClick={() => handleToolChange('pencil')}
            >
                <img src={pencil} alt='pencil' width="inherit" height="inherit" />
            </button>
            <button
                className={`line tool ${tool === 'line' ? 'selected' : ''}`}
                onClick={() => handleToolChange('line')}
            >
                <img src={line} alt='line' width="inherit" height="inherit" />
            </button>
            <button
                className={`rectangle tool ${tool === 'rectangle' ? 'selected' : ''}`}
                onClick={() => handleToolChange('rectangle')}
            >
                <img src={rectangle} alt='rectangle' width="inherit" height="inherit" />
            </button>
            <button
                className={`circle tool ${tool === 'circleTool' ? 'selected' : ''}`}
                onClick={() => handleToolChange('circleTool')}
            >
                <img src={circle} alt='circle' width="inherit" height="inherit" />
            </button>
            <button
                className={`eraser tool ${tool === 'eraser' ? 'selected' : ''}`}
                onClick={() => handleToolChange('eraser')}
            >
                <img src={eraser} alt='eraser' width="inherit" height="inherit" />
            </button>
            <button className='tool'>
                <input className='color-picker' type="color" value={strokecolor} onChange={handleColorChange} />
            </button>
            <select name="strokesize" id="strokesize" className='hamburger text-md font-semibold' value={strokesize} onChange={handleChangeSize}>
                <option value="5" className='options'>5</option>
                <option value="10" className='options'>10</option>
                <option value="15" className='options'>15</option>
                <option value="20" className='options'>20</option>
                <option value="30" className='options'>30</option>
            </select>
        </div>
    );
}