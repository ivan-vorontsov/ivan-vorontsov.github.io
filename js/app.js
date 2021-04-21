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

        A = AInitial = this.width / 10;
        
        radius = Math.max(this.width, this.height) / 120;
        offset = canvas.width / 16;
        D = canvas.height / 2;
        A = AInitial * this.scaleY;
        imageWidth = this.width / 3;

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
    }
    this.resize = resize;
    resize();
    window.addEventListener('resize', resize);
}
