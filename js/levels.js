var levels = [] ;
var b2Vec2 = Box2D.Common.Math.b2Vec2; 

levels[0] = {init_velocity:new b2Vec2(20,0),init_x:2,init_y:2,objects:[{objtype:"circle", radius:1, mass:500, isGoal:false, x:20, y:10},
 {objtype:"circle", radius:1, mass:0, isGoal:true, x:30,y:17},
 {objtype:"wall", length:10, angle:90, mass:10, isGoal:false, x:24,y:15}]};

levels[1] = {init_velocity:new b2Vec2(20,0), init_x:1, init_y:17, objects:[{objtype:"circle", radius:1, mass: 200, isGoal:false, x:5, y:15},
 {objtype:"circle", radius:1, mass:0, isGoal:true, x:30, y:17}, 
 {objtype:"wall", length:10, angle:90, mass:10, isGoal:false, x:17, y:15}]};

levels[2] = {init_velocity:new b2Vec2(15,-3), init_x:0, init_y:17, objects:[{objtype:"circle", radius:1, mass:200, isGoal:false, x:17, y:10},
 {objtype:"circle", radius:1, mass:0, isGoal:true, x:30, y:17}]};

levels[3] = {init_velocity:new b2Vec2(15,0), init_x:1, init_y:2, objects:[{objtype:"circle", radius:1, mass:200, isGoal:false, x:2, y:5},
 {objtype:"circle", radius:1, mass:-500, isGoal:false, x:2, y:15},
 {objtype:"circle", radius:1, mass:-500, isGoal:false, x:29, y:18},
 {objtype:"circle", radius:2, mass:0, isGoal:true, x:29, y:3},
 {objtype:"wall", length:10, angle:90, mass:10, isGoal:false, x:8, y:2}, 
 {objtype:"wall", length:1.7, angle:90, mass:10, isGoal:false, x:8, y:18.4},
 {objtype:"wall", length:10, angle:90, mass:10, isGoal:false, x:25, y:2},
 {objtype:"wall", length:8.5, angle:0, mass:10, isGoal:false, x:16.5, y:12}]};
