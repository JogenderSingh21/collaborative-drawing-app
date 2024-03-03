import { useState, useLayoutEffect, useRef } from 'react';
import { Saved } from '../Saved';
import axios from "axios";
import { useParams } from 'react-router-dom';
import { Spinner } from "../Spinner"

function MyBoard(props) {
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPencilStroke, setCurrentPencilStroke] = useState(null);
    const canvasRef = useRef();
    const prevPointRef = useRef(null);
    const linePointsRef = useRef(null);
    const circlePointsRef = useRef(null);
    const rectPointsRef = useRef(null);
    const drawingElementsRef = useRef([]);
    const redoDrawingElements = useRef([]);
    const [saved, setSaved] = useState(true);
    const [imgg, setImgg] = useState("");
    const [spin, setSpin] = useState(false);
    
    const { RoomID } = useParams();

    useLayoutEffect(() => {
        console.log("useEffect");
        setSpin(true);
        const uri = "http://localhost:3000/api/v1/drawing/" + RoomID;
        axios.get(uri.toString(), {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }).then(response => {
            console.log(response.data);
            drawingElementsRef.current = response.data.drawing.elementsArray;
            redrawCanvas();
            setSpin(false);
        }).catch(error => {
            console.log(error.response);
        })

        document.addEventListener('keydown', e => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                console.log('CTRL + S');
                
                const base64Canvas = canvasRef.current.toDataURL("image/jpeg", 1.0);
                setImgg(base64Canvas);

                console.log(drawingElementsRef.current);
                
                axios.put("http://localhost:3000/api/v1/drawing/updateInfo", {
                    imgId: RoomID,
                    elementsArray: drawingElementsRef.current,
                    image: base64Canvas
                },{
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });            

                setSaved(false);
                setTimeout(() => {
                    setSaved(true);
                }, 1000);
            }
          });
    }, []);

    const redrawCanvas = () => {
        // Trigger redraw logic here
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
    
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    
        // Redraw elements from drawingElementsRef
        drawingElementsRef.current.forEach((element) => {
            if (element.type === 'lineTool') {
                drawLineTool(element.start, element.end, ctx, element.color, element.width);
            } else if(element.type === 'circleTool'){
                drawCircleTool(element.start, element.end, ctx, element.color, element.width);
            } else if(element.type === 'rectangle'){
                drawRectangle(element.start, element.end, ctx, element.color, element.width);
            } else if(element.type === 'dot'){
                drawCircle(element.center, element.radius, ctx, "white")
            } else if (element.type === 'pencilStroke') {
                drawPencilStroke(element.points, ctx, element.color, element.width);
            } else if(element.type === 'lineToolE'){
                drawLineTool(element.start, element.end, ctx, "white", element.width);
            }
        });
    };

    function getMousePoints(e) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ctx = canvasRef.current.getContext('2d');
        return {
            x: x,
            y: y,
            context: ctx,
        };
    }

    function distance(x1, y1, x2, y2){
        return Math.sqrt(Math.pow((x2-x1),2) + Math.pow((y2-y1),2));
    }

    function normalDrawing(e, isEraser=false) {
        const { x, y, context } = getMousePoints(e);

        const strokeId = currentPencilStroke;

        // Find the current pencil stroke in drawingElementsRef.currentRef and update it
        const pencilStroke = drawingElementsRef.current.find(
            (element) => element.type === 'pencilStroke' && element.id === strokeId
        );
    
        if (pencilStroke) {
            const newPoints = [...pencilStroke.points, { x, y }];
            pencilStroke.points = newPoints;
    
            // Redraw the updated pencil stroke
            drawPencilStroke(pencilStroke.points, context, props.color, props.size);
        } else {
            // Handle non-pencil drawing logic here (e.g., eraser)
            drawStart(x, y, props.size, context, isEraser);
        }
    
        prevPointRef.current = { x: x, y: y };    
    }

    function drawPencilStroke(points, ctx, color, width) {
        for (let i = 1; i < points.length; i++) {
            drawLineTool(points[i - 1], points[i], ctx, color, width);
        }
    }

    function drawStart(currentX, currentY, width, context, isEraser) {
        var color = props.color;
        if(isEraser){
            color = "white";
            // Eraser - mne hi set kri hai
            drawLineTool(prevPointRef.current, { x: currentX, y: currentY }, context, color, 60);
            drawingElementsRef.current.push({
                type: 'lineToolE',
                start: prevPointRef.current,
                end: { x: currentX, y: currentY },
                width: 60,
            }); 
        }
        else{
            drawLineTool(prevPointRef.current, { x: currentX, y: currentY }, context, color, width);
            drawingElementsRef.current.push({
                type: 'lineTool',
                start: prevPointRef.current,
                end: { x: currentX, y: currentY },
                color: color,
                width: width,
            });
        }   
    }

    function drawCircleTool(start, end, context, color, width){
        const radius = distance(start.x, start.y, end.x, end.y) / 2;
        context.beginPath();
        const centerX = (start.x + end.x)/2;
        const centerY = (start.y + end.y)/2;
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        context.lineWidth = width;
        context.strokeStyle = color;
        context.stroke();
    }

    function drawRectangle(start, end, context, color, width){
        context.lineWidth = width;
        context.strokeStyle = color;
        context.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
    }

    function drawLine(start, end, ctx, color, width) {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

    }

    function drawLineTool(start, end, ctx, color, width){
        drawCircle(start, width/2, ctx, color)
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        drawCircle(end, width/2, ctx, color)
    }

    function drawCircle(start, radius, ctx, color) {
        ctx.beginPath();
        ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
    }

    useLayoutEffect(() => {
        console.log("layouteffect2");
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        canvas.addEventListener("touchmove", (e) => { e.preventDefault() }, false);

        if(props.undoRedo == 'undo'){
            if(drawingElementsRef.current.length != 0){
                redoDrawingElements.current.push(drawingElementsRef.current.pop())
                props.setUndoRedo(null);
            }
        } else if(props.undoRedo == 'redo'){
            if(redoDrawingElements.current.length != 0){
                drawingElementsRef.current.push(redoDrawingElements.current.pop())
                props.setUndoRedo(null);
            }
        }

        if(props.clearBoard){
            drawingElementsRef.current = [];
            redoDrawingElements.current = [];
            props.setClearBoard(false);
        }

        // Redraw
        try {
            drawingElementsRef.current.forEach((element) => {
                if (element.type === 'lineTool') {
                    drawLineTool(element.start, element.end, ctx, element.color, element.width);
                } else if(element.type === 'circleTool'){
                    drawCircleTool(element.start, element.end, ctx, element.color, element.width);
                } else if(element.type === 'rectangle'){
                    drawRectangle(element.start, element.end, ctx, element.color, element.width);
                } else if(element.type === 'dot'){
                    drawCircle(element.center, element.radius, ctx, "white")
                } else if (element.type === 'pencilStroke') {
                    drawPencilStroke(element.points, ctx, element.color, element.width);
                } else if(element.type === 'lineToolE'){
                    drawLineTool(element.start, element.end, ctx, "white", element.width);
                }
            });
            console.log("redraw complete")

        } catch (error) {
            console.log("Nothing to do");
        }
    }, [props.undoRedo, props.clearBoard]);

    const handleMouseDown = (e) => {
        setIsDrawing(true);
        const { x, y, context } = getMousePoints(e);
        if(props.tool === "eraser"){
            // Eraser memory - ye bhi mne hi kra hai - change mt kriyo bkl
            drawCircle({ x, y }, 30, context, "white");
            drawingElementsRef.current.push({
                type: 'dot',
                center: {x,y},
                radius: 30,
            });
        } else if(props.tool === 'pencil'){
            // Unique ID
            const newStrokeId = Date.now(); 
            setCurrentPencilStroke(newStrokeId);

            // Add a drawing element for the pencil stroke
            drawingElementsRef.current.push({
                type: 'pencilStroke',
                id: newStrokeId,
                points: [{ x, y }],
                color: props.color,
                width: props.size,
            });
        }
        prevPointRef.current = { x: x, y: y };
        linePointsRef.current = { x: x, y: y };
        circlePointsRef.current = { x: x, y: y };       
        rectPointsRef.current = { x: x, y: y };     
    };

    const handleMouseMove = (event) => {
        if (!isDrawing) return;

        const { x, y, context } = getMousePoints(event);

        if (props.tool === 'pencil') {
            normalDrawing(event);
        } else if(props.tool ==='eraser'){
            normalDrawing(event, true)
        } else{
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            // Clear
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Redraw
            drawingElementsRef.current.forEach((element) => {
                if (element.type === 'lineTool') {
                    drawLineTool(element.start, element.end, ctx, element.color, element.width);
                } else if(element.type === 'circleTool'){
                    drawCircleTool(element.start, element.end, ctx, element.color, element.width);
                } else if(element.type === 'rectangle'){
                    drawRectangle(element.start, element.end, ctx, element.color, element.width);
                } else if(element.type === 'dot'){
                    drawCircle(element.center, element.radius, ctx, "white")
                } else if (element.type === 'pencilStroke') {
                    drawPencilStroke(element.points, ctx, element.color, element.width);
                } else if(element.type === 'lineToolE'){
                    drawLineTool(element.start, element.end, ctx, "white", element.width);
                }
            });

            // dynamic 
            switch (props.tool) {
                case 'line':
                    drawLineTool(linePointsRef.current, { x, y }, context, props.color, props.size);
                    break;

                case 'circleTool':
                    drawCircleTool(circlePointsRef.current, {x, y}, context, props.color, props.size);
                    break;

                case 'rectangle':
                    drawRectangle(rectPointsRef.current, {x, y}, context, props.color, props.size);
                    break;

                default:
                    break;
            }
        }
    };

    const handleMouseUp = (e) => {
        const { x, y } = getMousePoints(e);
        setIsDrawing(false);

        if (props.tool === 'line') {
            drawingElementsRef.current.push({
                type: 'lineTool',
                start: linePointsRef.current,
                end: { x, y },
                color: props.color,
                width: props.size,
            });
        } else if(props.tool === 'circleTool'){
            drawingElementsRef.current.push({
                type: 'circleTool',
                start: circlePointsRef.current,
                end: { x, y },
                color: props.color,
                width: props.size,
            });
        } else if(props.tool === 'rectangle'){
            drawingElementsRef.current.push({
                type: 'rectangle',
                start: rectPointsRef.current,
                end: { x, y },
                color: props.color,
                width: props.size,
            });
        }

        setCurrentPencilStroke(null);
    };

    return (<>
        <canvas
            className='bg-white'
            width={window.innerWidth}
            height={window.innerHeight}
            onPointerDown={handleMouseDown}
            onPointerMove={handleMouseMove}
            onPointerUp={handleMouseUp}
            ref={canvasRef}
        >
            Canvas
        </canvas>
        <div className='fixed right-0 bottom-0' hidden={saved}>
            <Saved></Saved>
            <img className='h-32' src={imgg} alt='image' />
        </div>
        <div hidden={!spin}>
            <Spinner></Spinner>
        </div>
    </>
    );
}

export default MyBoard;