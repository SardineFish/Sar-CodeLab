try
{
    Math.sign = function (x)
    {
        if (isNaN(x) || x == 0)
            return 0;
        if (x > 0)
            return 1;
        else
            return -1;
    }

    var canvas = document.getElementById("canvas");
    var width = canvas.width;
    var height = canvas.height;
    var game = Game.createByCanvas(canvas);
    var scene = game.scene;
    var graphics = game.graphics;
    var camera = scene.camera;
    var lastP = null;
    var polygon;
    var eList = [];
    scene.onClick = sceneTouch;
    game.onUpdate = function ()
    {
        $("#debug").text("");
    };
    init();

    function init()
    {
        game.start();
        scene.physics.g = new Vector2(0, -500);
        camera.moveTo(width / 2, height / 2);
        var hor = new Rectangle(width, 10);
        hor.strokeStyle = new Color(255, 0, 0, 1);
        hor.fillStyle = new Color(255, 0, 0, 1);
        hor.rigidBody = true;
        hor.static = true;
        hor.soft = false;
        var ver = new Rectangle(10, height);
        ver.strokeStyle = new Color(255, 0, 0, 1);
        ver.fillStyle = new Color(255, 0, 0, 1);
        ver.rigidBody = true;
        ver.static = true;
        ver.soft = false;

        var ground = new GameObject();
        ground.graphic = hor.copy();
        ground.collider = ground.graphic;
        ground.collider.setCenter(Align.middleLeft);
        ground.collider.setPosition(0, 0);
        scene.addGameObject(ground);

        var roof = new GameObject();
        roof.graphic = hor.copy();
        roof.collider = roof.graphic;
        roof.collider.setCenter(Align.middleLeft);
        roof.collider.setPosition(0, height);
        scene.addGameObject(roof);

        var wallLeft = new GameObject();
        wallLeft.graphic = ver.copy();
        wallLeft.collider = wallLeft.graphic;
        wallLeft.collider.setCenter(Align.bottomCenter);
        wallLeft.collider.setPosition(0, 0);
        scene.addGameObject(wallLeft);
        var wallRight = new GameObject();
        wallRight.graphic = ver.copy();
        wallRight.collider = wallRight.graphic;
        wallRight.collider.setCenter(Align.bottomCenter);
        wallRight.collider.setPosition(width, 0);
        scene.addGameObject(wallRight);
    }
    var count = 0;
    function sceneTouch(args)
    {
        try
        {

            var circle = new Circle(10);
            circle.rigidBody = true;
            circle.static = false;
            //circle.e=0.8;
            //circle.soft=false;
            circle.setPosition(args.x, args.y);
            var e = new GameObject();
            e.setCenter(args.x, args.y);
            e.gravity = false;

            if (count >= 0)
            {
                circle.strokeStyle = "#66CCFF";
                circle.fillStyle = "#66CCFF";
                e.e = -400;
            }
            else
            {
                circle.strokeStyle = "red";
                circle.fillStyle = "red";
                e.e = 400;
            }
            e.graphic = circle;
            e.collider = circle;

            e.onUpdate = function (obj, dt)
            {
                try
                {
                    //alert(obj.id+":"+eList.length);
                    for (var i = 0; i < eList.length; i++)
                    {
                        if (eList[i] == obj)
                            continue;
                        var F = obj.e * eList[i].e;
                        var v = Vector2.fromPoint(obj.position, eList[i].position);
                        F /= (v.x * v.x + v.y * v.y);
                        //alert(F);
                        v.multi(F / v.mod());
                        //alert(obj.id+":"+v);
                        obj.force(new Force(v));
                    }
                } catch (ex) { alert(ex.message); }
            }
            scene.addGameObject(e);
            eList[count] = e;
            count++;
        } catch (ex)
        {
            alert("click:" + ex.message);
        }
    }

} catch (ex)
{
    alert("global:" + ex.message);
}