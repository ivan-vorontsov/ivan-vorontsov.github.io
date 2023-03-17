function App_Singleton(width, height) {
    this.width = width;
    this.height = height;
    this.aspectRatio = this.width / this.height;
    this.scaleX = 1;
    this.scaleY = 1;
    let resize = () => {
        let newHeight = window.innerHeight,
            newWidth = window.innerWidth,
            newAspectRatio = newWidth / newHeight;
        if (newAspectRatio > this.aspectRatio) {
            // horizontal shrink
            this.height = newHeight;
            this.width = this.height * this.aspectRatio;
        } else {
            // vertical shrink
            this.width = newWidth;
            this.height = this.width / this.aspectRatio;
        }
        this.scaleX = this.width / width;
        this.scaleY = this.height / height;

        canvas.width = this.width;
        canvas.height = this.height;


        let appArea = document.querySelector("#appArea");
        if (window.innerWidth > this.width) {
            let margin = (window.innerWidth - this.width) / 2;
            appArea.style.marginLeft = margin + 'px';
            appArea.style.marginTop = 0 + 'px';
            appArea.style.marginRight = margin + 'px';
            appArea.style.marginBottom = 0 + 'px';
        } else {
            let margin = (window.innerHeight - this.height) / 2;
            appArea.style.marginLeft = 0 + 'px';
            appArea.style.marginTop = margin + 'px';
            appArea.style.marginRight = 0 + 'px';
            appArea.style.marginBottom = margin + 'px';
        }
        appArea.style.width = this.width + 'px';
        appArea.style.height = this.height + 'px';

        for (let i= 0; i < this.states.length; i++){
            this.states[i].resize();
        }
        //if (this.currentState != null)
        //    this.currentState.resize();
    }
    this.resize = resize;

    window.addEventListener('resize', resize);
    this.states = [];

    this.currentState = new PlayState(this, canvas);
    this.states.push(this.currentState);
    this.states.push(new InfoState(this, canvas, faces));
    resize();
}

App_Singleton.prototype.render = function(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.currentState.render(ctx);
}

App_Singleton.prototype.handleInput = function() {
    this.currentState.handleInput();
}

App_Singleton.prototype.update = function(elapsed) {
    this.currentState.update(elapsed);
}

App_Singleton.prototype.getLineWidth = function(){
    return Math.PI * this.scaleX;
}

App_Singleton.prototype.goToInfo = function() {
    this.currentState = this.states[1];
}

App_Singleton.prototype.goToIndex = function() {
    this.currentState = this.states[0];
}