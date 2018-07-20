
(function ()
{
    /**
     * @return {HTMLElement}
     */
    $ = selector => document.querySelector(selector);
    $$ = selector => document.querySelectorAll(selector);
    /** 
     * @type {Canvas}
    */
    let canvas;
    /** 
     * @type {CanvasRenderingContext2D}
    */
    let ctx;
    let height;
    let width;
    let bones = [];

    
    function load()
    {
        canvas = $("#canvas");
        ctx = canvas.getContext('2d');
        let style = getComputedStyle($("#wrapper"));
        width = parseInt(style["width"].replace("px", ""));
        height = parseInt(style["height"].replace("px", ""));
        canvas.width = width;
        canvas.height = height;
        ctx.scale(1, -1);
        ctx.translate(0, -height);
        init();
    }
    function init()
    {
        let pos = [
            new vec2(0, 0),
            new vec2(50, 300),
            new vec2(400, 350),
            new vec2(500, 400),
            new vec2(800, 600),
        ];
        let lastPos = new vec2(0, 0);
        for (let i = 0; i < pos.length-1; i++)
        {
            bones[i] = new Bone(pos[i], minus(pos[i + 1], pos[i]));
            bones[i].angle = Math.atan2(bones[i].direction.y, bones[i].direction.x) / Math.PI * 180;
            bones[i].length = bones[i].direction.magnitude;
            if (i > 0)
            {
                bones[i].angle -= Math.atan2(bones[i-1].direction.y, bones[i-1].direction.x) / Math.PI * 180;
                bones[i].previous = bones[i - 1];
                bones[i - 1].next = bones[i];
            }
            bones[i].render();
        }    
    }

    /** 
     * @class
    */
    class Bone
    {
        /**
         * 
         * @param {vec2} root 
         * @param {vec2} dir 
         */
        constructor(root, dir)
        {
            this.root = root;
            this.direction = dir;
            this.length = 0;
            this.angle = 0;
            /**
             * @type {Bone}
             */
            this.previous = null;
            /**
             * @type {Bone}
             */
            this.next = null;
        }

        render()
        {
            ctx.beginPath();
            ctx.arc(this.root.x, this.root.y, 10, 0, 360);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(this.root.x, this.root.y);
            ctx.lineTo(this.root.x + this.direction.x, this.root.y + this.direction.y);
            ctx.stroke();
        }
    }
    /** 
     * @class
    */
    class vec2
    {
        /**
         * 
         * @param {Number} x 
         * @param {Number} y 
         */
        constructor(x, y)
        {
            this.x = x;
            this.y = y;
        }

        /**
         * @returns {Number}
         */
        get magnitude()
        {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        /**
         * @return {Number}
         */
        get normalized()
        {
            return new vec2(this.x / this.magnitude, this.y / this.magnitude);
        }
    }

    /**
     * 
     * @param {vec2} u 
     * @param {vec2} v
     * @return {vec2} 
     */
    function plus(u, v)
    {
        return new vec2(u.x + v.x, u.y + v.y);
    }

    /**
     * 
     * @param {vec2} u 
     * @param {vec2} v
     * @return {vec2} 
     */
    function minus(u, v)
    {
        return new vec2(u.x - v.x, u.y - v.y);
    }

    /**
     * 
     * @param {vec2} u 
     * @param {Number} k
     * @return {vec2}
     */
    function mult(u, k)
    {
        return new vec2(u.x * k, u.y * k);
    }

    /**
     * 
     * @param {vec2} u 
     * @param {vec2} v 
     * @returns {Number}
     */
    function dot(u, v)
    {
        return u.x * v.x + u.y * v.y;
    }

    /**
     * 
     * @param {vec2} u 
     * @param {vec2} v
     * @return {Number} 
     */
    function cross(u, v)
    {
        return u.x * v.y - u.y * v.x;
    }

    window.Bone = Bone;
    window.vec2 = vec2;
    window.plus = plus;
    window.minus = minus;
    window.mult = mult;
    window.dot = dot;
    window.cross = cross;
	window.init = init;
    window.clear = () =>
    {
        ctx.clearRect(0, 0, width, height);
    };
    window.test = (IKCCD,iteration = 100) =>
    {
        function draw(x, y)
        {
            init();
            let rotation = IKCCD(bones, bones.length, iteration, new vec2(x, y));
            //init();
            let lastAng = 0;
            let lastEnd = new vec2(0, 0);
            clear();
            for (let i = 0; i < bones.length; i++)
            {
                let dir = new vec2(Math.cos((lastAng + rotation[i]) / 180 * Math.PI), Math.sin((lastAng + rotation[i]) / 180 * Math.PI));
                dir = mult(dir, bones[i].length);
                lastAng += rotation[i];
                let bone = new Bone(lastEnd, dir);
                bone.render();
                lastEnd = plus(lastEnd, dir);
            }
        }
        window.onmousemove = function (e)
        {
            var x = e.clientX;
            var y = height - e.clientY;
            draw(x, y);
        }    
    }


    load();
})();
