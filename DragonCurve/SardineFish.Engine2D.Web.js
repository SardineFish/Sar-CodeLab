
window.SardineFish=(function(sar){
try{
    if(!sar)
        sar=function(){};
    sar.Web=(function(web)
    {
        if(!web)
            web=function(){};
        return web;
    })(sar.Web);
    window.requestAnimationFrame = 
        window.requestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.msRequestAnimationFrame;
    function LinkList()
    {
        this.head=null;
        this.tail=null;
        this.count=0;
    }
    LinkList.Node=function(obj, last, next)
    {
        this.object=obj;
        if(last)
            this.last=last;
        else
            this.last=null;
        if(next)
            this.next=next;
        else
            this.next=null;
    }
    LinkList.prototype.add=function(obj)
    {
        if(this.count<=0)
        {
            this.head=new LinkList.Node(obj,null,null);
            this.head.parent=this;
            this.tail=this.head;
            this.count=1;
            return this.head;
        }
        var node=new LinkList.Node(obj,this.tail,null);
        node.parent=this;
        this.tail.next=node
        this.tail=node;
        this.count++;
        return node;
    }
    LinkList.prototype.remove=function(node)
    {
        if(node.parent!=this)
        {
            throw new Error("The node doesn't belong to this link list");
        }
        if(node.last=null)
        {
            this.head=node.next;
        }
        else
            this.last.next=this.next;
        if(node.next=null)
        {
            this.tail=node.last;
        }
        else
            node.next.last=this.last;
    }
    LinkList.prototype.foreach=function(callback)
    {
        if(!callback)
            throw new Error("A callback function is require.");
        var p=this.head;
        for(var p=this.head;p;p=p.next)
        {
            callback(p.object,p);
        }
    }
    function physics(obj)
    {
    }
    
    engine=function(){};
    function int(x)
    {
        return parseInt(x);
    }
    function Game()
    {
        this.fps=0;
        this.scene=null;
        this.animationFrameId=null;
        this.onUpdate=null;
        this.graphics=null;
    }
    Game.createByCanvas=function(canvas)
    {
        this.graphics=new Graphics(canvas);
    }
    Game.prototype.setScene=function(scene)
    {
        this.scene=scene;
    }
    Game.prototype.start=function()
    {
        var game=this;
        function animationFrame(delay)
        {
            game.fps=int(1000/delay);
            if(game.onUpdate)
                game.onUpdate(delay,this);
            game.scene.updateFrame(delay);
            game.animationFrameId=requestAnimationFrame(animationFrame);
        }
        if(!scene)
            return false;
        this.animationFrameId=requestAnimationFrame(animationFrame);
    }
    function Scene()
    {
        this.layer=null;
        this.objectList=new LinkList();
        this.updateFrame=null;
        this._objList=[];
        this._objList.n=0;
        this._objList.add=function (node)
        {
            this[this.n]=node;
            return n;
        }
    }
    Scene.prototype.updateFrame=function(delay)
    {
        var scene=this;
        var dt=delay/1000;
        this.objectList.foreach(function(obj,node)
        {
            obj.moveTo(obj.position.x+obj.v*dt,obj.position.y+obj.v*dt);
            if(obj.onUpdate)
                obj.onUpdate();
        });
    }
    Scene.prototype.addGameObject=function(obj)
    {
        var node=this.objectList.add(obj);
        obj.id=this._objList.add(node);
        return obj.id;
    }
    //Graphics
    function Graphics(canvas)
    {
        if(!canvas)
            throw new Error("paramter error.");
        if(!canvas.getContext)
            throw new Error("paramter 1 must be a canvas");
        this.canvas=canvas;
        this.ctx=canvas.getContext("2d");
        
    }
    Graphics.drawLine=function(canvas, x1, y1, x2, y2, color)
    {
        if(!canvas)
            throw new Error("paramter error.");
        if(!canvas.getContext)
            throw new Error("paramter 1 must be a canvas");
        
        ctx=canvas.getContext("2d");
        ctx.beginPath();    
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        if(color)
            ctx.strokeStyle=color;
        ctx.stroke();
    }
    Graphics.drawArc=function (canvas,x,y,r,ang1,ang2,clockwise,color)
    {
        var ctx=canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(x,y,r,ang1,ang2,clockwise);
        ctx.strokeStyle=color;
        ctx.stroke();
    }
    Graphics.drawCircle=function(canvas,x,y,r,strokeStyle,fillStyle,strokeWidth)
    {
        var ctx=canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(x,y,r,0,Math.PI*2);
        ctx.strokeStyle=strokeStyle;
        ctx.fillStyle=fillStyle;
        ctx.lineWidth=strokeWidth;
        ctx.fill();
        ctx.stroke();
    }
    Graphics.fillRect=function(canvas,x,y,w,h,color)
    {
        if(!canvas)
            throw new Error("paramter error.");
        if(!canvas.getContext)
            throw new Error("paramter 1 must be a canvas");
        ctx=canvas.getContext("2d");
        ctx.fillStyle=color? color:"black";
        ctx.fillRect(x,y,w,h);
            
    }
    Graphics.clear=function(canvas, color)
    {
        if(!canvas)
            throw new Error("paramter error.");
        if(!canvas.getContext)
            throw new Error("paramter 1 must be a canvas");
        var ctx=canvas.getContext("2d");
        ctx.clearRect(0,0,canvas.width,canvas.height);
        if(color)
        {
            ctx.fillStyle=color;
            ctx.fillRect(0,0,width,height);
        }
    }
    Graphics.clearRect=function(canvas,x,y,width,height)
    {
        var ctx=canvas.getContext("2d");
        ctx.clearRect(x,y,width,height); 
    }
    Graphics.prototype.draw=function(obj,x,y,r)
    {
        obj.drawToCanvas(this.canvas,x,y,r);
    }
    Graphics.prototype.drawLine=function(line,width,color)
    {
        if(!this.canvas)
            throw new Error("canvas not set.");
        if(!this.ctx)
        {
            if(!this.canvas.getContext)
                throw new Error("canvas error");
            this.ctx=canvas.getContext("2d");
        }
        if(!(line instanceof Line))
            throw new Error("paramter 1 is not a line");
        
    }
    

    
    
    function Color (r, g, b, a)
    {
        r = int(r);
        g = int(g);
        b = int(b);
        if (isNaN(r) || r >= 256)
            r = 255;
        else if (r < 0)
            r = 0;
        if (isNaN(g) || g >= 256)
            g = 255;
        else if (g < 0)
            g = 0;
        if (isNaN(b) || b >= 256)
            b = 255;
        else if (b < 0)
            b = 0;
        if (isNaN(a) || a > 1.0)
            a = 1.0;
        else if (a < 0)
            a = 0;
        this.red = r;
        this.green = g;
        this.blue = b;
        this.alpha = a;
    }
    Color.random = function ()
    {
        return new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255, 1.0);
    }
    Color.prototype.copy=function()
    {
        return new Color(this.red,this.green,this.blue,this.alpha);
    }
    Color.prototype.toString = function ()
    {
        return "rgba(" + this.red.toString() + "," + this.green.toString() + "," + this.blue.toString() + "," + this.alpha.toString() + ")";
    }
    //Graphics.Color=Color;
    window.Color = Color;
    Graphics.Color = Color;
    engine.Graphics=Graphics;
    window.Graphics=Graphics;

    //Image
    function Image()
    {
        this.width=0;
        this.height=0;
        this.center=new Point(0,0);
    }
    Image.create=function (width,height,color)
    {
    }
    Image.fromUrl=function (url)
    {
    }
    Image.prototype.copy=function()
    {
    }
    Image.prototype.drawToCanvas=function (canvas,x,y,r)
    {
    }
    engine.Image=Image;
    window.Image=Image;

    //Text
    function FontStyle(){}
    FontStyle.Normal="normal";
    FontStyle.Italic="italic";
    FontStyle.Oblique="oblique";
    function FontVariant(){}
    FontVariant.Normal="normal";
    FontVariant.SmallCaps="small-caps";
    function FontWeight(){}
    FontWeight.Normal="normal";
    FontWeight.Bold="bold";
    FontWeight.Bolder="bolder";
    FontWeight.Lighter="lighter";

    function Text(text)
    {
        this.text=text;
        this.fontFamily="sans-serif";
        this.fontSize=10;
        this.fontStyle=FontStyle.Normal;
        this.fontWeight=FontWeight.Normal;
        this.fontVariant=FontVariant.Normal;
        this.fillStyle=new Color(0,0,0,1);
        this.strokeStyle=new Color(255,255,255,0);
    }
    Text.prototype.copy=function()
    {
        var text=new Text(this.text);
        text.fontFamily=this.fontFamily;
        text.fontSize=this.fontSize;
    }
    Text.prototype.drawToCanvas=function (canvas,x,y,r)
    {
        var ctx=canvas.getContext("2d");
        ctx.font = this.fontStyle + " " 
                 + this.fontVariant + " "
                 + this.fontWeight + " "
                 + this.fontSize + "px "
                 + this.fontFamily;
        ctx.fillStyle=this.fillStyle;
        ctx.strokeStyle=this.strokeStyle;
        ctx.fillText(this.text,x,y);
        ctx.strokeText(this.text,x,y);
    }
    engine.Text=Text;
    window.Text=Text;
    //ImageAnimation
    function ImageAnimation ()
    {
        this.center=new Point(0,0);
        this.fCount=0;
        this.fps=0;
        this.timeLine=0;
    }
    ImageAnimation.fromUrl=function (url)
    {
    }
    ImageAnimation.create=function (width,height,fCount,fps)
    {
    }
    ImageAnimation.prototype.copy=function()
    {
    }
    ImageAnimation.prototype.split=function (width)
    {
    }
    ImageAnimation.prototype.drawToCanvas=function (x,y,r,t)
    {
    }
    engine.ImageAnimation=ImageAnimation;
    window.ImageAnimation=ImageAnimation;

    //Vector2
    function Vector2(x,y)
    {
        this.x=x;
        this.y=y;
        
    }
    Vector2.fromPoint=function(p1,p2)
    {
        return new Vector2(p2.x-p1.x,p2.y-p1.y);
    }
    Vector2.prototype.copy=function()
    {
        return new Vector2(this.x,this.y);
    }
    Vector2.prototype.plus=function(v)
    {
        if(!(v instanceof Vector2))
            throw new Error("v must be a Vector");
        this.x=this.x+v.x;
        this.y=this.y+v.y;
        return this;
    }
    Vector2.prototype.minus=function(v)
    {
        if(!(v instanceof Vector2))
            throw new Error("v must be a Vector");
        this.x=this.x-v.x;
        this.y=this.y-v.y;
        return this;
    }
    engine.Vector2=Vector2;
    window.Vector2=Vector2;
    //Point
    function Point(x,y,l)
    {
        if(isNaN(x) || isNaN(y))
            throw "x and y must be numbers.";
        this.x=x;
        this.y=y;
        this.lines=new Array();
        if(l instanceof Line)
        {
            this.lines[0]=l;
        }
        if(l instanceof Array)
        {
            for(var i=0;i<l.length;i++)
            {
                if(!(l[i] instanceof Line))
                    throw "l["+i+"] is not a Line";
                this.lines[i]=l[i];
            }
        }
        
    }
    Point.prototype.copy=function()
    {
        return new Point(this.x,this.y);
    }
    Point.prototype.rotate=function (o, ang)
    {
        var x=this.x-o.x;
        var y=this.y-o.y;
        var dx=x*Math.cos(ang)-y*Math.sin(ang);
        var dy=y*Math.cos(ang)+x*Math.sin(ang);
        return new Point(o.x+dx,o.y+dy);
    }
    Point.prototype.isBelongTo=function(l)
    {
        if(!(this.lines instanceof Array))
            throw "this object has something wrong.";
        for(var i=0;i<this.lines.length;i++)
        {
            if(this.lines[i]==l)
                return true;
        }
        return false;
    }
    Point.prototype.addLine=function(l)
    {
        if(!(this.lines instanceof Array))
            throw "this object has something wrong.";
        this.lines[this.lines.length]=l;
    }
    Point.prototype.drawToCanvas=function (canvas,x,y,r)
    {
       
    }
    engine.Point=Point;
    window.Point=Point;

    //Line
    function Line(_p1,_p2,pol)
    {
        var p1=_p1,p2=_p2;
        if((_p1 instanceof Vector2) && (_p2 instanceof Vector2))
        {
            p1=new Point(_p1.x,_p1.y,this);
            p2=new Point(_p2.x,_p2.y,this);
        }
        else if(!(p1 instanceof Point) || !(p2 instanceof Point))
        {
            throw new Error("P1 or P2 is not a Point.");
        }
        p1.addLine(this);
        p2.addLine(this);
        this.p1=p1;
        this.p2=p2;
        this.center=new Point((p1.x+p2.x)/2,(p1.y+p2.y)/2);
        this.position=this.center
        this.polygon=pol;
    }
    Line.prototype.copy=function()
    {
        var p1=this.p1.copy();
        var p2=this.p2.copy();
        var line=new Line(p1,p2);
        line.setCenter(this.center.x,this.center.y);
        return line;
    }
    Line.prototype.setCenter=function(x,y)
    {
        this.center.x=x;
        this.center.y=y;
    }
    Line.prototype.moveTo=function(x,y)
    {
        if(x==this.center.x&&y==this.center.y)
            return;
        this.p1.x=this.p1.x-this.center.x+x;
        this.p1.y=this.p1.y-this.center.y+y;
        this.p2.x=this.p2.x-this.center.x+x;
        this.p2.y=this.p2.y-this.center.y+y;
        this.center.x=x;
        this.center.y=y;
    }
    Line.prototype.isCross=function (obj) 
    {
        if(obj instanceof Line)
        {
            var p1=this.p1;
            var p2=this.p2;
            var p3=obj.p1;
            var p4=obj.p2;
            var v13=new Vector2(p3.x-p1.x, p3.y-p1.y);
            var v14=new Vector2(p4.x-p1.x, p4.y-p1.y);
            var v31=new Vector2(p1.x-p3.x, p1.y-p3.y);
            var v32=new Vector2(p2.x-p3.x, p2.y-p3.y);
            var v12=new Vector2(p2.x-p1.x, p2.y-p1.y);
            var v34=new Vector2(p4.x-p3.x, p4.y-p3.y);
            if((v13.x*v12.y - v12.x*v13.y) * (v14.x*v12.y - v12.x*v14.y) < 0 && (v31.x*v34.y - v34.x*v31.y) * (v32.x*v34.y - v34.x*v32.y) < 0)
                return true;
            return false;
        }
        else if(obj instanceof Circle)
        {
            var v1=new Vector2(obj.center.x-this.p1.x,obj.center.y-this.p1.y);
            var v2=new Vector2(this.p2.x-this.p1.x, this.p2.y-this.p1.y);
            var v3=new Vector2(obj.center.x-this.p2.x,obj.center.y-this.p2.y);
            var v4=new Vector2(-v2.x,-v2.y);
            var d1=(obj.center.x-this.p1.x)*(obj.center.x-this.p1.x) + (obj.center.y-this.p1.y)*(obj.center.y-this.p1.y);
            d1=(d1<=obj.r*obj.r) ? 1:0;
            var d2=(obj.center.x-this.p2.x)*(obj.center.x-this.p2.x) + (obj.center.y-this.p2.y)*(obj.center.y-this.p2.y);
            d2=(d2<=obj.r*obj.r) ? 1:0;
            if(d1^d2)
                return true;
            if(d1&&d2)
                return false;
            if((v1.x*v2.x+v1.y*v2.y<0) || (v3.x*v4.x+v3.y*v4.y<0))
            {
                return false;
            }
            if(v3.x*v4.x+v3.y*v4.y<0)
            {
                
                
            }
            var x=v1.x*v2.y-v2.x*v1.y;
            var l=v2.x*v2.x+v2.y*v2.y;
            l=l*obj.r*obj.r;
            x*=x;
            
            if(x<=l)
                return true;
            return false;
        }
    }
    engine.Line=Line;
    window.Line=Line;

    //Colliders
    function Colliders (){}
    function GameObject ()
    {
        this.id=null;
        this.name="GameObject";
        this.graphic=null;
        this.collider=null;
        this.mass=0;
        this.v=new Vector2(0,0);
        this.a=new Vector2(0,0);
        this.position=new Point(0,0);
        this.center=this.position;
        this.rotation=0.0;
        this.onUpdate=null;
        this.onStart=null;
    }
    GameObject.prototype.copy=function()
    {
        var obj=new GameObject();
        obj.name=this.name;
        if(this.graphic)
        {
            obj.graphic = this.graphic.copy ? this.graphic.copy() : this.graphic;
        }
        if(this.collider)
        {
            obj.collider = this.collider.copy ? this.collider.copy() : this.collider;
        }
        obj.mass=this.mass;
        obj.v=this.v.copy();
        obj.a=this.a.copy();
        obj.position=this.position.copy();
        obj.center=obj.position;
        obj.rotation=this.rotation;
        obj.onUpdate=this.onUpdate;
        obj.onStart=this.onStart;
        return obj;
    }
    GameObject.prototype.drawToCanvas=function(canvas,x,y,r)
    {
        if(this.graphic)
            this.graphic.drawToCanvas(canvas,x,y,r);
    }
    GameObject.prototype.setCenter=function(x,y)
    {
        this.center.x=x;
        this.center.y=y;
    }
    GameObject.prototype.moveTo=function(x,y)
    {
        if(this.graphic)
        {
            this.graphic.moveTo(this.graphic.position.x-this.position.x+x,this.graphic.position.y-this.position.y+y);
        }
        if(this.collider)
        {
            this.colider.moveTo(this.collider.position.x-this.position.x+x,this.collider.position.y-this.position.y+y);
        }
        this.position.x=x;
        this.position.y=y;
    }
    engine.GameObject=GameObject;
    window.GameObject=GameObject;

    //Circle
    function Circle (x,y,r)
    {
        if(!x||!y)
        {
            x=0;
            y=0;
        }
        if(!r)
            r=0;
        this.r=r;
        this.o=new Point(x,y);
        this.center=new Point(x,y);
        this.position=this.center
        this.strokeWidth=1;
        this.strokeStyle=new Color(0,0,0,1);
        this.fillStyle=new Color(255,255,255,1);
    }
    Circle.prototype.copy=function()
    {
        var circle=new Circle(this.o.x,this.o.y,this.r);
        circle.setCenter(this.center.x,this.center.y);
        circle.strokeWidththis.strokeWidth;
        if(this.strokeStyle instanceof Color)
            circle.strokeStyle=this.strokeStyle.copy();
        else
            circle.strokeStyle=this.strokeStyle;
        if(this.fillStyle instanceof Color)
            circle.fillStyle=this.fillStyle.copy();
        else
            circle.fillStyle=this.fillStyle;
        return circle;
    }
    Circle.prototype.setCenter=function(x,y)
    {
        this.center.x=x;
        this.center.y=y;
    }
    Circle.prototype.moveTo=function(x,y)
    {
        if(x==this.center.x&&y==this.center.y)
            return;
        this.o.x=this.o.x-this.center.x+x;
        this.o.y=this.o.y-this.center.y+y;
        this.center.x=x;
        this.center.y=y;
    }
    Circle.prototype.drawToCanvas=function(canvas,x,y,r)
    {
         var ctx=canvas.getContext("2d");
         ctx.beginPath();
         ctx.arc(x,y,this.r,0,2*Math.PI);
         ctx.lineWidth=this.strokeWidth;
         ctx.strokeStyle=this.strokeStyle;
         ctx.fillStyle=this.fillStyle;
         ctx.fill();
         ctx.stroke();
    }
    Circle.prototype.isCross=function(obj)
    {
        if(obj instanceof Line)
        {
            return obj.isCross(this);
        }
        else if(obj instanceof Circle)
        {
            return this.isCollideWith(obj);
        }
    }
    Circle.prototype.isCollideWith=function (col)
    {
        if(col instanceof Polygon)
        {
            for(var i=0;i<col.E.length;i++)
            {
                if(col.E[i].isCross(this))
                    return true;
            }
            return false;
        }
        else if(col instanceof Circle)
        {
            var dx=this.center.x-col.center.x;
            var dy=this.center.y-col.center.y;
            var d=dx*dx+dy*dy;
            if((this.r-col.r)*(this.r-col.r)<=d && d<=(this.r+col.r)*(this.r+col.r))
                return true;
            return false;
        }
    }
    
    
    Colliders.Circle = Circle;
    window.Circle=Circle;

    //polygon
    function Polygon (v)
    {
        if(!(v instanceof Array))
            throw new Error("Paramater v must be a array of points");
        this.E=new Array();
        this.V=new Array();
        this.strokeWidth=1;
        this.strokeStyle=new Color(0,0,0,1);
        this.fillStyle=new Color(255,255,255,1);
        this.V=v;
        this.E=new Array();
        var sumX=0,sumY=0;
        for(var i=0;i<v.length;i++)
        {
            sumX+=v[i].x;
            sumY+=v[i].y;
            var j=(i+1)%v.length;
            this.E[i]=new Line(v[i],v[j]);
        }
        this.center=new Point(sumX/v.length,sumY/v.length);
        this.position=this.center;
    }
    Polygon.createRect=function (x,y,width,height)
    {
        var v=[];
        v[0]=new Point(x,y);
        v[1]=new Point(x+width,y);
        v[2]=new Point(x+width,y+height);
        v[3]=new Point(x,y+height);
        return new Polyon(v);
    }
    /*
    Polygon.prototype.addLine=function(l)
    {
        if(!(l instanceof Line))
            throw "paramter is not a line.";
        if(!(this.E instanceof Array))
        {
            this.E=new Array();
        }
        this.E[this.E.length]=l;
        l.polygon=this;
        if(!(this.V instanceof Array))
        {
            this.V=new Array();
        }
        var existed=false;
        for(var i=0;i<this.V.length;i++)
        {
            if(this.V[i].x==l.p1.x && this.V[i].y==l.p1.y)
            {
                existed=true;
                break;
            }
        }
        if(!existed)
            this.V[this.V.length]=l.p1;
        existed=false;
        for(var i=0;i<this.V.length;i++)
        {
            if(this.V[i].x==l.p2.x && this.V[i].y==l.p2.y)
            {
                existed=true;
                break;
            }
        }
        if(!existed)
            this.V[this.V.length]=l.p2;
    }
    */
    Polygon.prototype.copy=function()
    {
        var v=[];
        for(var i=0;i<this.V.length;i++)
        {
            v[i]=new Point(this.V[i].x,this.V[i].y);
        }
        var pol=new Polygon(v);
        pol.strokeWidth=this.strokeWidth;
        if(this.strokeStyle instanceof Color)
            pol.strokeStyle=this.strokeStyle.copy();
        else
            pol.strokeStyle=this.strokeStyle;

        if(this.fillStyle instanceof Color)
            pol.fillStyle=this.fillStyle.copy();
        else
            pol.fillStyle=this.fillStyle;

        pol.setCenter(this.center.x,this.center.y);
        return pol;
    }
    Polygon.prototype.moveTo=function (x,y)
    {
        for(var i=0;i<this.V.length;i++)
        {
            this.V[i].x=(this.V[i].x-this.center.x)+x;
            this.V[i].y=(this.V[i].y-this.center.y)+y;
        }
        this.center.x=x;
        this.center.y=y;
    }
    Polygon.prototype.setCenter=function(x,y)
    {
        this.center.x=x;
        this.center.y=y;
    }
    Polygon.prototype.isCollideWith=function(col)
    {
        if(!(col instanceof Polygon) && !(col instanceof Circle))
            throw new Error("The parameter is not a collider");
        if(!(this.E instanceof Array))
        {
            throw new Error("Something wrong with this polygon");
        }
        if(col instanceof Polygon)
        {
            if(!(col.E instanceof Array))
            {
                throw new Error("Something wrong with the polygon");
            }
            for(var i=0;i<this.E.length;i++)
                for(var j=0;j<col.E.length;j++)
                {
                    
                    if(this.E[i].isCross(col.E[j]))
                    {
                        //Graphics.drawLine(this.E[i], "red");
                        //Graphics.drawLine(col.E[j], "red");
                        return true;
                    }
                }
            return false;
        }
        else if(col instanceof Circle)
        {
            for(var i=0;i<this.E.length;i++)
            {
                if(this.E[i].isCross(col))
                    return true;
            }
            return false;
        }
        return false;
    }
    Polygon.prototype.drawToCanvas=function (canvas,x,y,r)
    {
        var ctx=canvas.getContext("2d");
        ctx.beginPath();
        if(this.V.length<3)
            throw new Error("The polygen must contains at least 3 points.");
        ctx.moveTo(this.V[0].x,this.V[0].y);
        for(var i=1;i<this.V.length;i++)
            ctx.lineTo(this.V[i].x,this.V[i].y);
        ctx.lineTo(this.V[0].x,this.V[0].y);
        ctx.lineWidth=this.strokeWidth;
        ctx.strokeStyle=this.strokeStyle;
        ctx.fillStyle=this.fillStyle;
        ctx.fill();
        ctx.stroke();
    }
    Colliders.Polygon=Polygon;
    window.Polygon=Polygon;
    
    engine.Colliders=Colliders;
    window.Colliders=Colliders;
    sar.Web.Engine2D = engine;
    sar.Engine2D = { Web: engine };
    return sar;
}catch(ex){alert(ex.message);}
})(window.SardineFish);













