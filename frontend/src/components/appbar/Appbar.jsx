import React from 'react';
import logo from '../../assets/newLogo.png'
import ham from '../../assets/ham.svg'
import undo from '../../assets/noun-undo.png'
import './style.css'
import { ToolBox } from './ToolBox'


export function Appbar({ strokesize, setSize, strokecolor, setColor, setTool, tool, setUndoRedo}){

    return <div className='appbar'>
        <img className='logo' src={logo} alt="logo"/>
        <div className='tools-section undoRedo'>
            <button className='undo tool' onClick={() => { setUndoRedo('undo') }}>
                <img src={undo} alt='undo' height="65%"></img>
            </button>
            <div className='partition'></div>
            <button className='redo tool' onClick={() => { setUndoRedo('redo') }}>
                <img src={undo} alt='redo' height="65%"></img>
            </button>
        </div>
        <ToolBox strokesize={strokesize} setSize={setSize} strokecolor={strokecolor} setColor={setColor} setTool={setTool} tool={tool}/>
        <div className='tools-section'>
            <button className='hamburger'>
                <img src={ham} width="50%"></img>
            </button>
        </div>
    </div>
}