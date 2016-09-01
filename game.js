
function fontDrawer(img){

	function getLetters(){
		var letters = [];
		for(var i = 0; i < 26; i++){
			letters.push(String.fromCharCode(97 + i));
			letters.push(String.fromCharCode(65 + i));
		}
		for(var i = 0; i < 10; i++){
			letters.push(String.fromCharCode(48 + i));
		}
		// letters.push(":");
		return letters;
	}

	var fontdrawer = {
		img : img, 
		letters : getLetters(),
        draw : function(ctx, sentance, x, y, scale){

            // draws one letter
            function drawFont(ctx, letter, x, y){
                if(this.letters.indexOf(letter) === -1){
                    return;
                }
                var charCode = letter.toUpperCase().charCodeAt(0);
                var inx = charCode > 64 ? charCode - 65 : charCode - 48;
                var yindex = charCode > 64 ? 0 : 1; 
                // console.log('drawing ' + charCode + " at " + inx);
                ctx.drawImage(this.img, inx * 5, yindex *5, 5, 5, x, y, 5, 5 ); //;, );
            }
			ctx.save();
			if(scale) {
				ctx.scale(scale, scale);
			}
            for(var i = 0; i < sentance.length; i++){
			    drawFont.call(this, ctx, sentance[i], i * 6 + x, y);
		    }
			ctx.restore();			
			
        },
		drawIcon : function(ctx, icon, x, y){
			var yindex = 1;
			var icons = {
				'>' : 12,
				'<' : 0,
				'on' : 11,
				'off' : 10
			};
			var xindex = icons[icon];
			if (xindex) {
				ctx.drawImage(this.img, xindex * 5, yindex * 5, 5, 5, x, y, 5, 5);
			}
		}
	}
	return fontdrawer;
}
function Images(){
    var loader = {
        images : {},
        load : function(callback){

            var files = ["alphabet", "pixrl1"];
            var count = 0;
            var loader = this;

            files.forEach(function(f){
                var abc = new Image();
                abc.src = f + ".png";
                abc.addEventListener("load", function(){
                    count++;
                    if(count===files.length){
                        callback(loader.images);
                    }
                });
                this.images[f] = abc;
            }, this);
        }
    }
    return loader;
}
function renderMap(ctx, map, glitchMode){
    var size = this.game.getPixelSize();
    var mapSize = map.size;

    for(var y = 0; y < mapSize; y++) {
        for(var x = 0; x < mapSize; x++) {
            var xpos = x * size;
            var ypos = y * size;

            var v = map.map[y][x];
            var isSolidTile = map.isSolid(x, y);
            if (glitchMode) {
                if (v === '100') {
                    ctx.fillStyle = "gray";
                    ctx.fillRect(xpos, ypos, size, size);
                    this.fontdrawer.drawIcon(ctx, 'on',xpos+4|0,ypos+5|0 );
                     // this.fontdrawer.drawIcon(ctx, '>',xpos+2|0,ypos+5|0 );
                    // this.fontdrawer.drawIcon(ctx, '>',xpos+7|0,ypos+5|0 );
                } else if (v === '30') {
                    ctx.strokeStyle = "yellow";
                    ctx.strokeRect(xpos, ypos, size, size);
                } else if (v === '20') {
                    ctx.fillStyle = "red";
                    ctx.fillRect(xpos, ypos, size, size);
                } else if (v === '101') {
                    // door
                    var centrex = xpos + (size / 2) | 0;
                    var centrey = ypos + (size/ 2) | 0;
                    // var grd = ctx.createRadialGradient(centrex, centrey, 40, centrex, centrey, 0);
                    ctx.save();
                    ctx.shadowBlur = 25;
                    ctx.shadowColor = 'white';
                    var grd = ctx.createLinearGradient(0,0,0, ypos +  20);
                    // light blue
                    grd.addColorStop(0, 'white');
                    // dark blue
                    grd.addColorStop(1, 'black');
                    // ctx.fillStyle = "gray";
                    ctx.fillStyle = grd;
                    ctx.fillRect(xpos, ypos, size, size);
                    ctx.restore();
                } else if(isSolidTile){
                    this.fontdrawer.draw(ctx, v, xpos+5|0, ypos+5|0);
                    ctx.strokeStyle = "green";
                    ctx.strokeRect(xpos, ypos, size, size);
                } else {
                    var g = Math.random() > 0.3 ? v : randomLetter();
                    // var g= v;
                    this.fontdrawer.draw(ctx, g ,xpos+5|0, ypos+5|0 );
                }
            } else {
                ctx.fillStyle = "blue";
                if (isSolidTile){
                    ctx.fillRect(xpos, ypos, size, size);
                }
            }
        }
    }
}

function iter2dArray(arr, fn){
    for(var y = 0; y < arr.length; y++) {
        for(var x = 0; x < arr[0].length; x++) {
            arr[y][x]
            fn(arr[y][x],x, y);
        }
    }
}

var ar = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

iter2dArray(ar, function(i, x , y){
    console.log("item : " + i + " x : " + x + " y : " + y);
})
function renderSprites(){
    this.img = new Image();
    this.img.src = 'pixlr1.png';


}
// stats.js - http://github.com/mrdoob/stats.js
var Stats=function(){function h(a){c.appendChild(a.dom);return a}function k(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();k(++l%c.children.length)},!1);var g=(performance||Date).now(),e=g,a=0,r=h(new Stats.Panel("FPS","#0ff","#002")),f=h(new Stats.Panel("MS","#0f0","#020"));
if(self.performance&&self.performance.memory)var t=h(new Stats.Panel("MB","#f08","#201"));k(0);return{REVISION:16,dom:c,addPanel:h,showPanel:k,begin:function(){g=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();f.update(c-g,200);if(c>e+1E3&&(r.update(1E3*a/(c-e),100),e=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){g=this.end()},domElement:c,setMode:k}};
Stats.Panel=function(h,k,l){var c=Infinity,g=0,e=Math.round,a=e(window.devicePixelRatio||1),r=80*a,f=48*a,t=3*a,u=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=f;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,f);b.fillStyle=k;b.fillText(h,t,u);b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(f,
v){c=Math.min(c,f);g=Math.max(g,f);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=k;b.fillText(e(f)+" "+h+" ("+e(c)+"-"+e(g)+")",t,u);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,e((1-f/v)*p))}}};"object"===typeof module&&(module.exports=Stats);
// random integer
function randi(n){
	n = n || 100
	return Math.floor(randd() * n);
}
// random decimal
function randd(){
	return Math.random();
}

/**
 * 0 = nothing
 * 1 - 10 = 1 2 3 4 5 6 7 8 9 a
 *  11 - 15 = b c d e f 
 * 
 * 20 = bad place
 * 30 = yellow box
 * 
 * 100 = switch 
 * 101 = exit
 * 
 */

function getMaps(){

	function map1(){
		var tiles = [
			[
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,101,0,0,0,0,0,0,0,0,0,100,0],
			[1,30,20,2,2,3,4,15,2,2,2,2,2,2],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,101,0,0,0,0,0,0,0,0,0,0],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0]
		],
		[
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,100,0],
			[1,0,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,1,1,1,1,1,1,1,1,1,1,1,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,101,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,101,0,0,0,0,0,0,0,0,0,0],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0]
		]
		];
		return {
			maps : tiles,
			sprites : [
				{
					x : 50,
					y  : 50 
				},
				{
					x : 100, 
					y  : 10
				}
			]
		};
		};

	function map2(){
		var map1 = 
			[
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,2,0,0,0,2,0,0,0,0,0,0],
			[1,0,0,2,0,0,0,8,0,0,0,0,0,0],
			[1,0,0,2,0,0,0,7,0,0,0,0,0,0],
			[1,0,0,2,0,0,0,6,0,0,0,0,0,0],
			[1,0,0,3,0,0,0,5,0,0,0,0,0,0],
			[1,0,0,4,100,0,0,4,0,0,0,0,0],
			[1,0,0,1,1,1,1,1,1,1,0,0,0,1],
			[1,0,0,12,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,2,0,0,0,0,0,0,0,101,0,0],
			[1,0,0,4,0,0,0,0,1,1,1,1,1,1],
			[1,0,0,5,0,0,0,0,0,0,0,0,0,0],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0]
		];
		var map2 = 	[
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,4,0,2,0,0,0,0,2,0,0,0,0,0],
			[1,0,0,2,0,0,0,0,8,0,0,0,0,0],
			[1,0,2,2,0,0,0,0,7,0,0,0,0,0],
			[1,0,0,2,0,0,0,0,6,0,0,0,0,0],
			[1,0,0,3,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,4,0,0,0,0,0,0,0,100,0,0],
			[1,0,0,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,12,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,2,0,0,0,0,0,0,0,101,0,0],
			[1,0,0,4,0,0,0,0,1,1,1,1,1,1],
			[1,0,0,5,0,0,0,0,0,0,0,0,0,0],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0]
		];
		return  {
			maps : [ 
				map1, 
				map2
			],
			start : [
				80, // x
				20 // y
			],
			sprites : [
				{
					x : 116,
					y  : 80 
				},
					{
						x : 143,
						y : 119
					}
			]
		};		
		}

	function map3(){
		var map1 = [
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,2,0,0,0,2,0,0,0,0,0,0],
			[1,0,0,2,0,0,0,8,0,0,0,0,0,0],
			[1,0,0,2,0,0,0,7,0,0,0,0,0,0],
			[1,0,0,2,0,0,0,6,0,0,0,0,0,0],
			[1,0,0,3,0,0,0,5,0,0,0,0,0,0],
			[1,0,0,4,100,0,0,4,0,0,0,0,0],
			[1,0,0,1,1,1,1,1,1,1,0,0,0,1],
			[1,0,0,12,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,2,0,0,0,0,0,0,0,101,0,0],
			[1,0,0,4,0,0,0,0,1,1,1,1,1,1],
			[1,0,0,5,0,0,0,0,0,0,0,0,0,0],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0]
		]
		return {
			maps : [
				map1
			],
			start : [
				80, 
				20
			],
			sprites : []
		};
	};

	var levelindex = 0;
	var mapindex = 0 

	var mapFunctions = [
		map1, 
		map2,
		map3
	];


	return {
		nextLevel : function(){
			var fn = mapFunctions[levelindex];
			var mazz = fn();
			this.maps = mazz.maps.map(function(m){
				var w = new World(resolution);
				w.init(m);
				// return new World()
				return w;
			}, this);
			levelindex++;
			return {
				map : this.maps[0],
				start : mazz.start,
				sprites : mazz.sprites
			};
		},
		nextMap : function(){
			var g = (mapindex + 1) % this.maps.length;
			mapindex = g
			return this.maps[mapindex];
		},
		maps : []
	};
}
var GameScene = function(game, sprites){
    this.sprites = sprites;
    this.name = 'gamescene';
    this.isGravity = true;
	this.player = new Player(90, 20);
	this.glitchMode = true;
	this.game = game;
	this.fontdrawer = game.fontdrawer;
    sprites.push(this.player);
	this.maps = getMaps();
	this.nextLevel();
	this.playerSprite = game.images['pixrl1'];
}

GameScene.prototype = {
    update : function(keys){
        var gravity = 1;
		this.player.x += this.player.vx;
		this.player.y += this.player.vy;

        this.sprites.forEach(function(s) {
			if(s.type !== 'player'){
				s.move(this.map);
			}
		}, this);

        if(this.isGravity) {
			this.sprites[0].vy = gravity;
		}

        this.getPressedKeys(keys);
        this.movePlayer();
    },
	nextLevel : function(){
		this.sprites = [this.player];
		// get new map
		var mazzz = this.maps.nextLevel();
		this.map = mazzz.map;
		// add the players position
		if(mazzz.start){
			this.player.x = mazzz.start[0];
			this.player.y = mazzz.start[1];
		}
		// add any sprites to it
		if(mazzz.sprites) {
			mazzz.sprites.forEach(function(s){
				var spr = new Sprite(s.x, s.y);
				spr.vx = spr.speed;
				spr.vy = 0.5; // gravity
				this.sprites.push(spr);
			}, this);
		}
	},
    render : function (ctx) {

		renderMap.call(this, ctx, this.map, this.glitchMode);

        this.sprites.forEach(function(s) {
			// var ctx = this.ctx;
			ctx.fillStyle = s.col || 'green';
			ctx.fillRect(s.x, s.y, s.width, s.height);
			ctx.drawImage(this.game.images['pixrl1'], s.img, 0, 16, 16, s.x-5, s.y-5, 16, 16 );
		}, this);

		this.map.collisionTiles.forEach(function(t){
			var size = this.game.getPixelSize();
			ctx.fillStyle = 'gray';
			ctx.fillRect(t.x * size, t.y * size, size, size);
		}, this);
		this.map.collisionTiles = [];

    },
	getPressedKeys : function(keys){
		var player = this.player;
		player.vx = 0;
		player.vy = 0;
		if(this.isGravity && !player.isOnGround) {
			player.vy = 1;
		}
        if(keys.pressed[keys.UP]){
			player.vy = -1;
		}
		if(keys.pressed[keys.DOWN]){
			player.vy = 1;
		}
		if (keys.pressed[keys.LEFT]) {
			player.vx = -1;
		}
		if (keys.pressed[keys.RIGHT]) {
			player.vx = 1;
		}
		if (keys.pressed[keys.F]) {
			this.glitchMode = !this.glitchMode;
		}
		if(keys.pressed[keys.S]) {

		}
		if(keys.released[keys.A]) {
			// check map?
			var x = player.x + player.width/2;
			var y = player.y + player.height/2;
			var tile = this.map.getTile(x, y);
			if(tile === '100') {
				console.log("switch pressed");
				this.map = this.maps.nextMap();
			}
			if(tile === '101') {
				console.log("end of level");
				// var m = this.maps[this.currentMap++];
				this.nextLevel();
				
			}
			keys.released[keys.A] = false;
		}
    },
	movePlayer : function() {
		var player = this.player;
		var map = this.map;
		var dx = player.vx;
		var dy = player.vy;
		// movex 
		if ( dx > 0) {
			// going right
			var nextX = player.x + dx + player.width;
			var y1 = player.y;
			var y2 = player.y + player.height;
			var tilex1 = map.collidingPoint(nextX, y1);
			var tilex2 = map.collidingPoint(nextX, y2);

			if(tilex1 || tilex2 ) {
				player.vx = 0;
			}

		} else if ( dx < 0) {
			// going left!
			var nextX = player.x + dx;
			var y1 = player.y;
			var y2 = player.y + player.height;
			var tilex1 = map.collidingPoint(nextX, y1);
			var tilex2 = map.collidingPoint(nextX, y2);
			if(tilex1 || tilex2 ) {
				player.vx = 0;
			}
		}
		if(dy > 0) {
			//going down!!
			var nextY = player.y + dy + player.height;
			var x1 = player.x;
			var x2 = player.x + player.width;
			var tilex1 = map.collidingPoint(x1, nextY);
			var tilex2 = map.collidingPoint(x2, nextY);
			if(tilex1 || tilex2 ) {
				var tt = map.getTile(x1, nextY);
				var tt1 = map.getTile(x2, nextY);
				if(tt === "20" || tt1 === "20"){
					//bad tile!!
					//you die
				}
				player.vy = 0;
			}
		} else if(dy < 0) {
			// going up
			var nextY = player.y + dy;
			var x1 = player.x;
			var x2 = player.x + player.width;
			var tilex1 = map.collidingPoint(x1, nextY);
			var tilex2 = map.collidingPoint(x2, nextY);
			if(tilex1 || tilex2 ) {
				player.vy = 0;
			}
 		}
	}
}
function TitleScene(game){
    this.g = game;


}

TitleScene.prototype = {
    update : function(keys){
        if(keys.anyPressed()){
            this.g.nextScene();   
        }
    },
    render : function(ctx) {
        this.g.fontdrawer.draw(ctx, 'RPGlitch', 10, 10, 2);
        this.g.fontdrawer.draw(ctx, 'Controls : ', 50, 50);
        this.g.fontdrawer.draw(ctx, 'Arrows to move,', 50, 60);
        this.g.fontdrawer.draw(ctx, 'A to open doors', 50, 70);
        this.g.fontdrawer.draw(ctx, 'and press switches', 50, 80);
    }
}
var canvasScaleFactor = 3;

var resolution = 180;

var Game = {
	delta : 0,
	then : 0,
	logInfo : [],
	canvasSize : resolution,
	glitchMode : true,
	isGravity : true,
	images : {},
	init : function(canvasId, images){
		var canvasSize = this.canvasSize * canvasScaleFactor;

		var canvas = this.canvas = document.getElementById('canvas');
		this.ctx = canvas.getContext('2d');
		canvas.width = canvasSize;
		canvas.height = canvasSize;

		this.sprites = [];
		this.ctx.scale(canvasScaleFactor, canvasScaleFactor);
		this.ctx.imageSmoothingEnabled = false;
		this.ctx.mozImageSmoothingEnabled = false;
	
		this.keys = KeyListeners();

		this.images = images;

		this.scene1 = new TitleScene(this);
		this.fontdrawer = fontDrawer(images.alphabet);
	},
	getPixelSize : function(){
		return this.canvasSize / this.scene1.map.size;
	},
	render : function(){
		var ctx = this.ctx;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		// clear render


		this.scene1.render(ctx);
		
		this.drawLogging(ctx);
	},
	nextScene : function(){
		this.scene1	= new GameScene(this, this.sprites);
	},
	log : function(text) {
		this.logInfo.push(text);
	},
	drawLogging : function(ctx){
		var logs = this.logInfo;
		var yindex = 32;
		var fontSize = 16;
		ctx.font = fontSize + "px Arial bold";
		ctx.fillStyle = "green";
		for(var i = 0; i < logs.length; i++){
			ctx.fillText(logs[i], 20, yindex);
			yindex += fontSize;
		}
		this.logInfo = [];
	},
	update : function() {
		this.scene1.update(this.keys);
		this.glitchMode = this.scene1.glitchMode;

		// this.log("sprite x : " +  this.sprites[0].x);
		// this.log("sprite y : " +  this.sprites[0].y);
		// this.log("glitch : " + this.glitchMode);
	},
	run : function (timestamp) {
		// //
		// var now = Date.now();
		// var step = 1000 / 60;
		// var delta = now - Game.then;
		// if(delta > step){
		// 	Game.then = now - (delta % step); 
		// 	Game.render();
		// 	Game.update(delta);
		// }
		stats.begin();
		Game.render();
		Game.update();
		stats.end();
		requestAnimationFrame(Game.run);
	}
};  

function Sprite(x, y, img){
	this.width = 9;
	this.height = 9;
	this.x = x || 50;
	this.y = y || 50;
	this.vx = 0;
	this.vy = 0;
	this.speed = 0.5;
	this.img = 0;
	this.gravity = true;
	this.isOnGround = false;
	this.col = 'red';
	this.type = 'sprite';
	this.isOnGround = false;
}

Sprite.prototype = {
	move : function(map){
		var goOffEdge = false;
		var sprite = this;
		var gravity = 0.5;
		// sprite.vy = 1;
		var dx = sprite.vx;
		var dy = sprite.vy + gravity;

		if(dy > 0) {
			var nextY = dy + sprite.y + sprite.height;
			var x1 = sprite.x;
			var x2 = sprite.x + sprite.width;
			var tilex1 = map.collidingPoint(x1, nextY);
			var tilex2 = map.collidingPoint(x2, nextY);
			if(tilex1 || tilex2) {
				sprite.vy = 0;
				dy = 0;
				sprite.isOnGround = true;
				// dx = sprite.speed;
			} else {
				sprite.vy = 1;// going down
				dx = 0;
			}
		}
		if(dx > 0) {
			var nextX = sprite.x + dx + sprite.width;
			var y1 = sprite.y;
			var y2 = sprite.y + sprite.height;
			var blockingRightTile = map.collidingPoint(nextX, y1);
			var aboutToGoOffledge = goOffEdge ? false : !map.collidingPoint(nextX, y2+1);
			// check if sprite is going off edge of platform
			if(blockingRightTile || aboutToGoOffledge){
				dx = sprite.speed * -1;
				sprite.vx = dx;
			}
		} else if(dx < 0){
			var nextX = sprite.x + dx;
			var y1 = sprite.y;
			var y2 = sprite.y + sprite.height;
			var blockingLeft = map.collidingPoint(nextX, y1);
			var aboutToGoOffLedge = goOffEdge ? false : !map.collidingPoint(nextX, y2+1);
			if(blockingLeft || aboutToGoOffLedge){
				dx = sprite.speed;
				sprite.vx = dx;
			}
		}

		this.x += dx
		this.y += dy
	}
};
function World(canvasSize, size){
	this.size = 14;// how many tiles the map is w * h
	this.width = canvasSize;
	this.height = canvasSize;
	this.collisionTiles = [];
}

World.prototype = {
	/**
	 * @param  {any} data 2d array with numbers representing the map
	 */
	init : function(data) {
		var length = this.size;
		var map = [];
		var mapage = data;

		for(var i = 0; i < length; i++) {
			var row = [];
			for(var j = 0; j < length; j++) {

				var d = mapage[i][j];

				if (d) {
					var c;
					if(d===15){
						// debugger;
					}
					if(d===1){
						c = randomLetter();
					 } else if(d < 10){
						 c = String.fromCharCode(48 + d);
					 } else {
						 c = d.toString();
					 }
					row.push(c);
				} else {
					row.push(randomLetter());
				}
				
			}
			map.push(row);
		}
		this.map = map;
		this.collisions = mapage;
	},
	getTile : function(x, y){
		var map = this;
		var w = map.width;
		var s = w / map.size;
		var x1 = x / s| 0;
		var y1 = y / s| 0;
		return map.map[y1][x1];
	},

	/**
	 * takes an x, y coordinate
	 *  returns true if 
	 */
	collidingPoint : function (x, y){
		var map = this;
		var w = map.width;
		var s = w / map.size;
		if(x > w-1 || y > map.height-1 || x < 0 || y < 0){
			return true;
		}
		var x1 = x / s| 0;
		var y1 = y / s| 0;
		if(map.isSolid(x1, y1)){
			map.collisionTiles.push({x : x1, y : y1, type : map.map[y1][x1]  });
		}
		return map.isSolid(x1, y1);
	},
	isSolid : function(x, y){
		return this.collisions[y][x] !== 0 && this.collisions[y][x] < 50;
	}
};

function randomLetter(){
	var a = randi(16);
	var c;
	if(a < 10){
		// numbers
		c = String.fromCharCode(48 + a);
	} else {
		// not numbers
		c = String.fromCharCode(87 + a); 
	}
	return c;
}
function KeyListeners(){
    var allowedKeys = [37, 38, 39, 40, 
    65,  // a
    70, // f
    83 // s 
    ];
    var allowed = {};
    var pressed = {};
    var released = {};

    allowedKeys.forEach(function(key){
        allowed[key] = true;
    });


	function keydown(e){
        var k = e.keyCode;
        //  console.log(k + "pressed");
		if(allowed[k]){
            pressed[k] = true;
            released[k] = false;
        }
        e.preventDefault();
	} 

    function keyup(e){
        var k = e.keyCode;
        if(allowed[k]){
            pressed[k] = false;
            released[k] = true;
            // console.log(k + "released");
        }
        e.preventDefault();
    }
    document.addEventListener('keyup',keyup);
	document.addEventListener('keydown',keydown);
    
    return {
        pressed : pressed,
        released: released,
        UP : 38,
        DOWN : 40,
        LEFT : 37,
        RIGHT : 39,
        F : 70,
        A : 65,
        S : 83,
        anyPressed : function(){
            return Object.keys(pressed).length > 0;
        }
    };
}
function Player(x, y) {
	this.col = 'green';
	this.x = x;
	this.y = y;
	this.type = 'player';
	this.img = 32;
}

Player.prototype = new Sprite();
Player.prototype.move = function(){}
var f = Images();
f.load(function(im){
    Game.init('canvas', im);
    Game.run();
});
var stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);


