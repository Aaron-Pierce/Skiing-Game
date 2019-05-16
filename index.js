let cWidth = Math.floor(window.innerWidth / 4);
let cHeight = Math.floor(window.innerHeight / 1.5);

if (innerWidth < 1000) {
    cWidth = Math.floor(window.innerWidth * 1);
    cHeight = Math.floor(window.innerHeight / 1);
}


function setup() {
    createCanvas(cWidth, cHeight);
}


let pathWidthPercent = 0.25;

let maxPathOffset = 1 - pathWidthPercent;

const pathSegmentMarkerSize = 10;

class PathSegment {
    constructor(xOffset) {
        this.posX = xOffset;
        this.posY = 0;
        this.width = cWidth * pathWidthPercent;

        this.show = (nextPath) => {
            let wrappedPos = this.posX;
            let path = this;

            this.posX = (this.posX + (pathWidthPercent * cWidth)) > cWidth ? maxPathOffset * cWidth : this.posX
            this.posX = (this.posX) < 0 ? 0 : this.posX
            stroke(255)
            strokeWeight(3)
            line(this.posX, path.posY, nextPath.posX, nextPath.posY)
            line(this.posX + path.width, path.posY, nextPath.posX + nextPath.width, nextPath.posY)
            stroke(0)
            strokeWeight(1)

            // ellipse(wrappedPos, this.posY, pathSegmentMarkerSize)
            // ellipse(wrappedPos + (this.width), this.posY, pathSegmentMarkerSize)


        }
    }

    static generatePosition = (lastPos) => {
        let distance = Math.floor(Math.random() * 20);
        distance = (Math.random() < 0.5) ? distance * -1 : distance;
        if (typeof lastPos === "undefined") {
            return this.posX + distance
        } else {
            return lastPos + distance;
        }
    }
}

let paths = [new PathSegment(cWidth * (maxPathOffset / 2))];

let player = {
    x: cWidth / 2,
    y: cHeight - 50,
    draw: function () {
        fill(0, 255, 125)
        ellipse(this.x, this.y, 10)
        fill(255)
    }

}

let dead = false;

let leftDown = false;
let rightDown = false;

function keyPressed() {
    if (keyCode === ENTER && dead) {
        window.location.reload();
    } else if (keyCode === LEFT_ARROW) {
        leftDown = true;
    } else if (keyCode === RIGHT_ARROW) {
        rightDown = true;
    }
}

function keyReleased() {
    if (keyCode === LEFT_ARROW) {
        leftDown = false;
    } else if (keyCode === RIGHT_ARROW) {
        rightDown = false;
    }
}

document.addEventListener('touchstart', function(evt){
    
    for(touch of evt.touches){
        if(dead && (touch.screenY < window.innerHeight / 2)){
            window.location.reload();
        }
        if(touch.screenX < window.innerWidth/2){
            leftDown = true;
        }else if(touch.screenX > window.innerWidth/2){
            rightDown = true;
        }
    }
})

document.addEventListener('touchend', function(evt){
    console.log('touchend')
    console.log(evt)
    for(touch of evt.changedTouches){
        if(touch.screenX < window.innerWidth/2){
            leftDown = false;
        }else if(touch.screenX > window.innerWidth/2){
            rightDown = false;
        }
        // ellipse(wrappedPos, this.posY, pathSegmentMarkerSize)
        // ellipse(wrappedPos + (this.width), this.posY, pathSegmentMarkerSize)

    }
})

let stepSize = 2;

// document.body.innerHTML += innerWidth

function draw() {
    // noStroke()
    frameRate(200);
    if (!dead) {
        background(125)
        // for (path of paths) {
        //     path.show();
        //     if (Math.abs(path.posY - player.y) < 5) {
        //         if (path.posX > player.x || path.posX + path.width < player.x) {
        //             dead = true;
        //         }
        //     }
        //     path.posY += stepSize;
        // }
        

        for (let i = 0; i < paths.length - 1; i++) {
            // console.log(i)
            let path = paths[i];
            let nextPath = paths[i + 1];
            // strokeWeight(5)
            path.show(nextPath)
            if (Math.abs(path.posY - player.y) < 5) {
                if (path.posX > player.x || path.posX + path.width < player.x) {
                    dead = true;
                }
            }
            path.posY += stepSize;
        }


        if (leftDown) {
            player.x -= 5;
        } else if (rightDown) {
            player.x += 5;
        }

        player.draw()

        paths = paths.filter(e => e.posY < cHeight)
        if (frameCount % 150 === 0) {
            pathWidthPercent -= 0.005;

        }

        if (frameCount % 500 === 0) {
            stepSize += 1;
        }

        if (frameCount % (5 - stepSize) === 0) {
            paths.push(new PathSegment(PathSegment.generatePosition(paths[paths.length - 1].posX)))
        }
    } else {
        // stroke(0])
        rectMode(CENTER)
        fill(0)
        rect(cWidth / 2, cHeight / 4, cWidth / 1.5, cHeight / 4)
        fill(255, 0, 0)
        textSize(64)
        textAlign(CENTER, CENTER)
        text("You Died", cWidth / 2, cHeight / 4)
        textSize(16)
        text("Press enter to retry", cWidth / 2, cHeight / 3)
    }

}