var app = new Vue({
    el: '#app',

    data: {
        penIsDown: false,
        wait: false,
        waitTime: 10,
        penColor: '#000',
        penOpacity: .5,
        penWidth: 10,        

        lastX: null,
        lastY: null,

        newPath: '',
    },

    // created: {

    // },

    methods: {

    }
    
})

const pen = {
    penIsDown: false,
    wait: false,
    waitTime: 10,
    penColor: '#000',
    penOpacity: .5,
    penWidth: 10,


    lastX: null,
    lastY: null,
    
    newPathEl: document.getElementById('newPath'),
    
    addPointToPath(x, y) {
        app.newPath += ` ${x},${y}`
        this.applyNewPath()
    },
    resetNewPath() {
        app.newPath = '';
        this.newPathEl.setAttribute('stroke', this.penColor)
        this.newPathEl.setAttribute('stroke-opacity', this.penOpacity)
        this.newPathEl.setAttribute('stroke-width', this.penWidth)
    },
    applyNewPath() {
        pen.newPathEl.setAttribute('points', app.newPath)
    },



    onDown(e) {
        console.log('down')
        pen.beginDraw()
        pen.initPoint(e)
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
        pen.onDown(pen.getTouchPos(e.touches[0]))
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
        if(!pen.wait) {
            // let deltaX = canvas.unit*e.offsetX - pen.lastX;
            // let deltaY = canvas.unit*e.offsetY - pen.lastY;

            let newX = canvas.unit*e.offsetX;
            let newY = canvas.unit*e.offsetY;
    
            pen.addPointToPath(newX,newY)

            
            pen.lastX = canvas.unit*e.offsetX;
            pen.lastY = canvas.unit*e.offsetY;

            if (pen.waitTime > 0){
                pen.wait = true;
                setTimeout( function() { pen.wait = false }, pen.waitTime )
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

canvas.el.addEventListener('mousedown', pen.onDown)
canvas.el.addEventListener('mousemove', pen.handleMouseMove)
document.addEventListener('mouseup', pen.handleMouseUp)


canvas.el.addEventListener('touchstart', pen.handleTouchStart)
canvas.el.addEventListener('touchmove', pen.handleTouchMove)
canvas.el.addEventListener('touchend', pen.handleTouchEnd)


canvas.el.setAttribute('viewBox', `0 0 ${canvas.dim} ${canvas.dim}`);