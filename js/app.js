function App_Singleton(width, height) {
    this.width = width;
    this.height = height;
    this.aspectRatio = this.width / this.height;
    this.scaleX = 1;
    this.scaleY = 1;
    this.onresize = undefined;
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
        if (this.onresize) this.onresize();
        };
    resize();
    window.addEventListener('resize', resize);
}
