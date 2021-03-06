var GAMEDIV = $("#game")[0];
var GAMEWIDTH = Number($("#game").css("width").slice(0,-2));
var GAMEHEIGHT = Number($("#game").css("height").slice(0,-2));
var context = GAMEDIV.getContext("2d");
var G = 5;
var world;
var g_player;
var g_goal;
var currlevel=0;
var isTitleScreen=true;
var title = new Image();
title.src = 'title.png';

function init() {
   var   b2Vec2 = Box2D.Common.Math.b2Vec2
      , b2AABB = Box2D.Collision.b2AABB
      , b2BodyDef = Box2D.Dynamics.b2BodyDef
      , b2Body = Box2D.Dynamics.b2Body
      , b2FixtureDef = Box2D.Dynamics.b2FixtureDef
      , b2Fixture = Box2D.Dynamics.b2Fixture
      , b2World = Box2D.Dynamics.b2World
      , b2MassData = Box2D.Collision.Shapes.b2MassData
      , b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
      , b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
      , b2DebugDraw = Box2D.Dynamics.b2DebugDraw
      , b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
      ;
   
   world = new b2World(
         new b2Vec2(0, 0)    //no gravity
      ,  true                //allow sleep
   );
   
   
  
   var fixDef = new b2FixtureDef;
   fixDef.density = 1.0;
   fixDef.friction = 0;
   fixDef.restitution = .8;
   
   var bodyDef = new b2BodyDef;

   
   
   
   //create ground
   bodyDef.type = b2Body.b2_staticBody;
   fixDef.shape = new b2PolygonShape;
   fixDef.shape.SetAsBox(GAMEWIDTH, 2);
   bodyDef.position.Set(10, GAMEHEIGHT / 30 + 1.8);
   world.CreateBody(bodyDef).CreateFixture(fixDef);
   bodyDef.position.Set(10, -1.8);
   world.CreateBody(bodyDef).CreateFixture(fixDef);
   fixDef.shape.SetAsBox(2, 14);
   bodyDef.position.Set(-1.8, 13);
   world.CreateBody(bodyDef).CreateFixture(fixDef);
   bodyDef.position.Set( GAMEWIDTH / 30 + 1.8, 13);
   world.CreateBody(bodyDef).CreateFixture(fixDef);
   
   
   //create some objects
   bodyDef.type = b2Body.b2_staticBody;
   for (var i = 0; i < 10; ++i) {
      if(Math.random() > 1) {
         fixDef.shape = new b2PolygonShape;
         fixDef.shape.SetAsBox(
               Math.random() + 0.1 //half width
            ,  Math.random() + 0.1 //half height
         );
      } else {
         fixDef.shape = new b2CircleShape(
            Math.random() + 0.1 //radius
         );
      }
      bodyDef.position.x = Math.random() * 10;
      bodyDef.position.y = Math.random() * 10;
      world.CreateBody(bodyDef).CreateFixture(fixDef);
   }

   fixDef.shape = new b2CircleShape(1.2);
   bodyDef.position.x = 10;
   bodyDef.position.y = 10;

  
   //setup debug draw
   var debugDraw = new b2DebugDraw();
   debugDraw.SetSprite(GAMEDIV.getContext("2d"));
   debugDraw.SetDrawScale(30.0);
   debugDraw.SetFillAlpha(0.5);
   debugDraw.SetLineThickness(1.0);
   debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
   world.SetDebugDraw(debugDraw);
   
   window.setInterval(update, 1000 / 60);
   
   //mouse
   
   var mouseX, mouseY, mousePVec, isMouseDown, selectedBody, mouseJoint;
   var canvasPosition = getElementPosition(GAMEDIV);
   
   document.addEventListener("mousedown", function(e) {
      isMouseDown = true;
      handleMouseMove(e);
      document.addEventListener("mousemove", handleMouseMove, true);


   }, true);
   
   document.addEventListener("mouseup", function(e) {
     if (isTitleScreen){
        isTitleScreen=false;
        //createWorld(levels[currlevel]);
        createWorld(levels[4]);
        //uncomment above line to debug a specific level
     }
      if (e.clientX>10 && e.clientX<210 && e.clientY >GAMEHEIGHT-50 && e.clientY < GAMEHEIGHT-10){
        createWorld(levels[currlevel]);
      }
      document.removeEventListener("mousemove", handleMouseMove, true);
      isMouseDown = false;
      mouseX = undefined;
      mouseY = undefined;

   }, true);

   
   function handleMouseMove(e) {
      mouseX = (e.clientX - canvasPosition.x) / 30;
      mouseY = (e.clientY - canvasPosition.y) / 30;
   };
   
   function getBodyAtMouse() {
      mousePVec = new b2Vec2(mouseX, mouseY);
      var aabb = new b2AABB();
      aabb.lowerBound.Set(mouseX - 0.001, mouseY - 0.001);
      aabb.upperBound.Set(mouseX + 0.001, mouseY + 0.001);
      
      // Query the world for overlapping shapes.

      selectedBody = null;
      world.QueryAABB(getBodyCB, aabb);
      return selectedBody;
   }

   function getBodyCB(fixture) {

      if(true) {
         if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
            selectedBody = fixture.GetBody();
            return false;
         }
      }
      return true;
   }
   
   //update
   
   function update() {
      //Check for victory
     for (var contact=world.GetContactList(); contact != null; contact=contact.GetNext()){
       if ((contact.GetFixtureA()==g_player.GetFixtureList() &&  contact.GetFixtureB()==g_goal.GetFixtureList()) || (contact.GetFixtureB()==g_player.GetFixtureList() &&  contact.GetFixtureA()==g_goal.GetFixtureList())){
           alert("You win!");
           createWorld(levels[currlevel+1<levels.length?currlevel+1:0]);
           currlevel += 1;
           if (currlevel>=levels.length){
             currlevel=0;
           }
         }
     }

   
      if(isMouseDown && (!mouseJoint)) {
         var body = getBodyAtMouse();
         if(body) {
           if (body.GetType()==b2Body.b2_staticBody && !body.GetUserData().isGoal && body.GetUserData().objtype=="circle"){
             body.GetUserData().hasGravity=!(body.GetUserData().hasGravity);
           }
            var md = new b2MouseJointDef();
            md.bodyA = world.GetGroundBody();
            md.bodyB = body;
            md.target.Set(mouseX, mouseY);
            md.collideConnected = true;
            md.maxForce = 300.0 * body.GetMass();
            mouseJoint = world.CreateJoint(md);
            body.SetAwake(true);
         }
      }
      
      if(mouseJoint) {
       if(isMouseDown) {
            mouseJoint.SetTarget(new b2Vec2(mouseX, mouseY));
         } else {
            world.DestroyJoint(mouseJoint);
            mouseJoint = null;
         }
      }
   
      world.Step(1 / 60, 10, 10);
      //world.DrawDebugData();
      draw(); //comment this out and uncomment the line above to see the debugging version
      world.ClearForces();

      var player=world.GetBodyList();
      var curr=world.GetBodyList().GetNext();
      for (var i = 1; i < world.GetBodyCount()-1; i++){
        if(curr.GetUserData().hasGravity){
            //Compute the vector for the gravity
            var grav = new Box2D.Common.Math.b2Vec2(curr.GetPosition().x,curr.GetPosition().y);
            grav.Subtract(player.GetPosition());
            grav.Multiply(G*curr.GetUserData().mass*player.GetMass()/(grav.Length()*grav.Length()*grav.Length()));
            player.ApplyForce(grav,player.GetWorldCenter());
        }
        curr=curr.GetNext();
      }
   };
   
   //helpers
   
   //http://js-tut.aardon.de/js-tut/tutorial/position.html
   function getElementPosition(element) {
      var elem=element, tagname="", x=0, y=0;
     
      while((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
         y += elem.offsetTop;
         x += elem.offsetLeft;
         tagname = elem.tagName.toUpperCase();

         if(tagname == "BODY")
            elem=0;

         if(typeof(elem) == "object") {
            if(typeof(elem.offsetParent) == "object")
               elem = elem.offsetParent;
         }
      }

      return {x: x, y: y};
   }

   function createWorld(level){
     var objects=level.objects;
       

     //DESTROY ZEE WORLD
     while (world.GetBodyCount()>1){
       world.DestroyBody(world.GetBodyList());
       console.log("penguin");
     }
    
     //create ground

     bodyDef.type = b2Body.b2_staticBody;
     fixDef.shape = new b2PolygonShape;
     fixDef.shape.SetAsBox(GAMEWIDTH, 2);
     bodyDef.position.Set(10, GAMEHEIGHT / 30 + 1.8);
     world.CreateBody(bodyDef).CreateFixture(fixDef);
     world.GetBodyList().SetUserData({hasGravity:false});
     bodyDef.position.Set(10, -1.8);
     world.CreateBody(bodyDef).CreateFixture(fixDef);
     world.GetBodyList().SetUserData({hasGravity:false});
     fixDef.shape.SetAsBox(2, 14);
     bodyDef.position.Set(-1.8, 13);
     world.CreateBody(bodyDef).CreateFixture(fixDef);
     world.GetBodyList().SetUserData({hasGravity:false});
     bodyDef.position.Set( GAMEWIDTH / 30 + 1.8, 13);
     world.CreateBody(bodyDef).CreateFixture(fixDef);
     world.GetBodyList().SetUserData({hasGravity:false});

     //create planets in object list
     for (var i = 0; i < objects.length; i++){
       fixDef.restitution = .8;
       if (objects[i].objtype=="circle" || objects[i].objtype=="goal"){
         fixDef.shape = new b2CircleShape(objects[i].radius);
       }else if (objects[i].objtype=="wall"){
         fixDef.restitution = 1;
         fixDef.shape = new b2PolygonShape;
         fixDef.shape.SetAsBox(objects[i].length,.1);
       }
       bodyDef.position.x = objects[i].x;
       bodyDef.position.y = objects[i].y;
       world.CreateBody(bodyDef).CreateFixture(fixDef);
       world.GetBodyList().SetUserData({hasGravity:objects[i].objtype=="goal", mass:objects[i].mass,isGoal:objects[i].objtype=="goal",objtype:objects[i].objtype});
       if (objects[i].objtype=="goal"){
         g_goal=world.GetBodyList();//Pointless Comment
       }
       if (objects[i].objtype=="wall"){

         world.GetBodyList().SetAngle(objects[i].angle*Math.PI/180.0);
       }
     }

     //create player
     fixDef.shape = new b2CircleShape(.25);
     bodyDef.type = b2Body.b2_dynamicBody;
     bodyDef.position.x = level.init_x;
     bodyDef.position.y = level.init_y;
     world.CreateBody(bodyDef).CreateFixture(fixDef);
     g_player=world.GetBodyList();
     g_player.GetLinearVelocity().x=level.init_velocity.x;
     g_player.GetLinearVelocity().y=level.init_velocity.y;
   }

  function draw(){
    context.clearRect(0, 0, GAMEWIDTH, GAMEHEIGHT);
    if (isTitleScreen){
      context.drawImage(title,0,0);
      return;
    }

    var background = new Image();
    background.src = "http://www.wideawakeinwonderland.com/wp-content/uploads/2010/06/starfield_lrg.jpg";
    //uncomment the following for background image
    //context.drawImage(background,0,0);   
    var node = world.GetBodyList();
    while (node) {
      var b = node;
      node = node.GetNext();
      var position = b.GetPosition();
      


      // Canvas Y coordinates start at opposite location, so we flip
      var flipy = position.y//GAMEHEIGHT - position.y;
      var fl = b.GetFixtureList();
      if (!fl) {
        continue;
      }
      var shape = fl.GetShape();
      var shapeType = shape.GetType();       

      //draw circles
      if (shapeType == Box2D.Collision.Shapes.b2Shape.e_circleShape) {
        context.lineWidth = 5;
        context.strokeStyle = "#FFFFFF";
        var grd0 = context.createRadialGradient(position.x*30,position.y*30,0,position.x*30,position.y*30,shape.GetRadius()*30); // gradient for circular objects
        grd0.addColorStop(0,"#FFFFFF"); //inner color
        grd0.addColorStop(1,"#000000"); //outer color
        var grd1 = context.createRadialGradient(position.x*30,position.y*30,0,position.x*30,position.y*30,shape.GetRadius()*30); // gradient for circular objects
        grd1.addColorStop(0,"#FF0000"); //inner color
        grd1.addColorStop(1,"#000000"); //outer color
        var grd2 = context.createRadialGradient(position.x*30,position.y*30,0,position.x*30,position.y*30,shape.GetRadius()*30); // gradient for circular objects
        grd2.addColorStop(0,"#0000FF"); //inner color
        grd2.addColorStop(1,"#000000"); //outer color

        if (b.GetUserData() && b.GetUserData().isGoal){
            context.strokeStyle = "#FFFFFF";
            context.fillStyle = "#FFFFFF";
        }
        else if (b.GetUserData() && b.GetUserData().hasGravity){
          if (b.GetUserData().mass>0){
            context.strokeStyle = "#FF0000";
            context.fillStyle = "#FF0000";
          }else{
            context.strokeStyle = "#0000FF";
            context.fillStyle = "#0000FF";
          }
        }else{
          context.strokeStyle = "#FFFFFF";
          context.fillStyle = "#000000";
        }
        context.beginPath();
        context.arc(position.x*30,flipy*30,shape.GetRadius()*30 - 2,0,Math.PI*2,true);
        context.closePath();
        context.stroke();
        context.fill();
      }else if (shapeType == Box2D.Collision.Shapes.b2Shape.e_polygonShape) { //draw rectangles
        var vert = shape.GetVertices();
        context.beginPath();

        // Handle the possible rotation of the polygon and draw it
        b2Math = Box2D.Common.Math.b2Math;
        b2Math.MulMV(b.m_xf.R,vert[0]);
        var tV = b2Math.AddVV(position, b2Math.MulMV(b.m_xf.R, vert[0]));
        context.moveTo(tV.x*30, tV.y*30);
        for (var i = 0; i < vert.length; i++) {
          var v = b2Math.AddVV(position, b2Math.MulMV(b.m_xf.R, vert[i]));
          context.lineTo(v.x*30, v.y*30);
        }

        var grd2 = context.createLinearGradient(0,0,position.x*30, position.y*30); //could use for rectangles, maybe not though
        grd2.addColorStop(0, "#FFFFFF");
        grd2.addColorStop(1, "#000000");
        context.lineTo(tV.x*30, tV.y*30);
        context.closePath();
        context.strokeStyle = "#FFFFFF";
        context.fillStyle = "#000000";
        context.stroke();
        context.fill();

        context.fillStyle = "#000000";
        context.lineWidth = 1;
        context.fillRect(10,GAMEHEIGHT-50,200,40);
        context.strokeRect(10,GAMEHEIGHT-50,200,40);
        context.fillStyle = "#FFFFFF";
        context.font="30px Sans Serif"
        context.fillText("Reset",60,GAMEHEIGHT-20);

      }
  
   } 

}

 //createWorld(levels[0]);
};

