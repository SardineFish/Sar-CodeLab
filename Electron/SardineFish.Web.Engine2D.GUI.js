window.SardineFish=(function(sar){
        {
            var args = { target: this, x: x, y: y, width: w, height: h, cancle: false };
            this.onRender(args);
            if (args.cancle)
                return;
            w = args.width;
            h = args.height;
            wx = args.x;
            wy = args.y;
        }