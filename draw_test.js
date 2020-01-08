var app = new Vue({
    el: '#app',

    data: {
        toolIsDown: false,
        wait: false,
        waitTime: 10,
        penColor: '#000000',
        penOpacity: 1,
        penWidth: 10,

        loc: {
            x: null,
            y: null,
        },
        lastLoc: {
            x: null,
            y: null,
        },

        newPath: '',
        
        activeTool: {},
        toolkit: {
            pen: {
                name: 'Pen',
                init() {
                    console.log('i am '+this.name)
                },
                handleDown(loc) {
                    console.log('down')
                    pen.beginDraw()
                },
                handleMove(loc) {

                },
                handleUp(loc) {

                },
            },

            eraser: {
                name: 'Eraser',

                init() {
                    console.log('i am '+this.name)
                },
                handleDown(loc) {
                    console.log('down')
                },
                handleMove(loc) {
                    this.removeStrokes()
                },
                handleUp(loc) {

                },


                removeStrokes() {
                },
                distanceToPoint(loc) {
                }
            },
        },

    },

    created() {
        this.selectTool(this.toolkit.pen)
    },

    methods: {

        selectTool(tool) {
            this.activeTool = tool;
            this.activeTool.init();
        },

        initPoint(loc){
            pen.lastX = canvas.unit*loc.offsloctX;
            pen.lastY = canvas.unit*e.offsetY;
        },

        handleToolDown(loc) {
            // track mouse position
            this.toolIsDown = true;

            pen.initPoint(loc)

            this.activeTool.handleDown(loc)
        },
        handleToolMove(loc) {
            //track mouse position


            if(this.toolIsDown) this.activeTool.handleMove(loc)
        },
        handleToolUp() {
            this.toolIsDown = false;

            this.activeTool.handleDown()
        },
    }
    
})

const pen = {


    lastX: null,
    lastY: null,
    
    newPathEl: document.getElementById('newPath'),
    
    addPointToPath(x, y) {
        app.newPath += ` ${x},${y}`
        this.applyNewPath()
    },
    resetNewPath() {
        app.newPath = '';
    },
    applyNewPath() {
        pen.newPathEl.setAttribute('points', app.newPath)
    },



    handleMouseDown(e) {
        app.handleToolDown(e)
    },
    handleMouseMove(e) {
        pen.movePen(e)
    },
    handleMouseUp() {
        pen.endDraw()
    },


    getTouchPos(touch) {
        return {
            offsetX: touch.pageX - canvas.box.getBoundingClientRect().x,
            offsetY: touch.pageY - canvas.box.getBoundingClientRect().y,
        }
    },

    handleTouchStart(e){
        e.preventDefault()
        app.activeTool.handleDown(pen.getTouchPos(e.touches[0]))
    },
    handleTouchMove(e){
        pen.movePen(pen.getTouchPos(e.touches[0]))
    },
    handleTouchEnd(e){
        pen.endDraw()
    },



    beginDraw() {
        // reset newPath element
        pen.resetNewPath();
        
        canvas.setUnit();

        pen.penIsDown = true;
    },
    initPoint(e) {
        pen.lastX = canvas.unit*e.offsetX;
        pen.lastY = canvas.unit*e.offsetY;

        pen.addPointToPath(pen.lastX,pen.lastY)
        pen.addPointToPath(pen.lastX+1,pen.lastY)

    },
    movePen(e) {  
        if (pen.penIsDown) pen.drawPoint(e)
    },
    drawPoint(e) {
        if(!app.wait) {
            // let deltaX = canvas.unit*e.offsetX - pen.lastX;
            // let deltaY = canvas.unit*e.offsetY - pen.lastY;

            let newX = canvas.unit*e.offsetX;
            let newY = canvas.unit*e.offsetY;
    
            pen.addPointToPath(newX,newY)

            
            pen.lastX = canvas.unit*e.offsetX;
            pen.lastY = canvas.unit*e.offsetY;

            if (app.waitTime > 0){
                app.wait = true;
                setTimeout( function() { app.wait = false }, app.waitTime )
            }
        }
    },
    endDraw(e) {
        pen.penIsDown = false;

        canvas.submitPath(app.newPath)
        pen.resetNewPath()
    },

}


const canvas = {
    el: document.getElementById('sketchCanvas'),
    box: document.getElementById('canvasWrapper'),
    strokes: document.getElementById('strokes'),
    strokeIdx: 0,

    dim: 1000,
    unit: null,

    setUnit() {
       this.unit = this.dim / this.box.offsetWidth;
    },

    submitPath(path) {
        let newPathEl = pen.newPathEl.cloneNode()
        newPathEl.id = `stroke_`+this.strokeIdx;

        canvas.strokes.append(newPathEl)

        this.strokeIdx++
    },

    paths: [],

    init() {
        this.setUnit;
    }
}

canvas.init();

canvas.el.addEventListener('mousedown', pen.handleMouseDown)
canvas.el.addEventListener('mousemove', pen.handleMouseMove)
document.addEventListener('mouseup', pen.handleMouseUp)


canvas.el.addEventListener('touchstart', pen.handleTouchStart)
canvas.el.addEventListener('touchmove', pen.handleTouchMove)
canvas.el.addEventListener('touchend', pen.handleTouchEnd)


canvas.el.setAttribute('viewBox', `0 0 ${canvas.dim} ${canvas.dim}`);