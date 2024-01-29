import { useState, useLayoutEffect, useRef, useEffect } from 'react';

function MyBoard(props) {
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPencilStroke, setCurrentPencilStroke] = useState(null);
    const canvasRef = useRef();
    const prevPointRef = useRef(null);
    const linePointsRef = useRef(null);
    const circlePointsRef = useRef(null);
    const rectPointsRef = useRef(null);
    const drawingElementsRef = useRef([]);
    const redoDrawingElements = useRef([])

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

        // Find the current pencil stroke in drawingElementsRef and update it
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
            color = props.bcolor;
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
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

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

        canvasRef.current.style.backgroundColor = props.bcolor;

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
                    drawCircle(element.center, element.radius, ctx, props.bcolor)
                } else if (element.type === 'pencilStroke') {
                    drawPencilStroke(element.points, ctx, element.color, element.width);
                } else if(element.type === 'lineToolE'){
                    drawLineTool(element.start, element.end, ctx, props.bcolor, element.width);
                }
            });
        } catch (error) {
            console.log("Nothing to do");
        }
    }, [props.undoRedo, props.bcolor, props.clearBoard]);

    const handleMouseDown = (e) => {
        setIsDrawing(true);
        const { x, y, context } = getMousePoints(e);
        if(props.tool === "eraser"){
            // Eraser memory - ye bhi mne hi kra hai - change mt kriyo bkl
            drawCircle({ x, y }, 30, context, props.bcolor);
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
            
            // Redraw
            drawingElementsRef.current.forEach((element) => {
                if (element.type === 'lineTool') {
                    drawLineTool(element.start, element.end, ctx, element.color, element.width);
                } else if(element.type === 'circleTool'){
                    drawCircleTool(element.start, element.end, ctx, element.color, element.width);
                } else if(element.type === 'rectangle'){
                    drawRectangle(element.start, element.end, ctx, element.color, element.width);
                } else if(element.type === 'dot'){
                    drawCircle(element.center, element.radius, ctx, props.bcolor)
                } else if (element.type === 'pencilStroke') {
                    drawPencilStroke(element.points, ctx, element.color, element.width);
                } else if(element.type === 'lineToolE'){
                    drawLineTool(element.start, element.end, ctx, props.bcolor, element.width);
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

    return (
        <canvas
            width={window.innerWidth}
            height={window.innerHeight}
            onPointerDown={handleMouseDown}
            onPointerMove={handleMouseMove}
            onPointerUp={handleMouseUp}
            ref={canvasRef}
        >
            Canvas
        </canvas>
    );
}

export default MyBoard;