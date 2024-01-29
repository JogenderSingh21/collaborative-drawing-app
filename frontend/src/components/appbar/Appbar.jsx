import React, { useRef } from 'react';
import Hamburger from 'hamburger-react'
import logo from '../../assets/newLogo.png'
import undo from '../../assets/noun-undo.png'
import './style.css'
import { ToolBox } from './ToolBox'

export function Appbar({ strokesize, setSize, strokecolor, setColor, setTool, tool, setUndoRedo, bcolor, setBcolor, setClearBoard}){
    const menuRef = useRef();

    return <div className='appbar' style={{background:`${bcolor}`}}>
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
         <div className='tools-section'><Hamburger size={20} duration={0.3} onToggle={(toggle) => {
                if(!toggle){
                    menuRef.current.classList.remove("open")
                } else{
                    menuRef.current.classList.add("open");
                }
            }}></Hamburger></div>
        <div className='ham'>
            <div className='ham-menu' ref={menuRef}>
                <button className='clearBoard' onClick={()=>setClearBoard(true)}>Clear &#10060;</button>
                <div className='v-partition'></div>
                <label for="bcolor" style={{margin:"3px 3px", fontWeight:"bold"}}>Background Color:</label>
                <div className='colors-list' style={{display:"flex", justifyContent:"space-around"}}>
                    <button style={{width:"25px", height:"25px", borderRadius:"25%",}} onClick={()=>setBcolor("#ffffff")}></button>
                    <button style={{width:"25px", height:"25px", borderRadius:"25%",background:"#000000"}} onClick={()=>setBcolor("#000000")}></button>
                    <button style={{width:"25px", height:"25px", borderRadius:"25%",background:"green"}} onClick={()=>setBcolor("green")}></button>
                </div>
                <div className='v-partition'></div>
                <button className='live'>Go Live</button>
            </div>
        </div>
    </div>
}