
function fontDrawer(){
    var img = new Image();
    img.src = 'alphabet.png';

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
                if(isSolidTile){
                    this.fontdrawer.draw(ctx, v, xpos+5|0, ypos+5|0);
                    ctx.strokeStyle = "green";
                    ctx.strokeRect(xpos, ypos, size, size);
                } else {
                    var g = Math.random() > 0.5 ? v : randomLetter();
                    this.fontdrawer.draw(ctx, g ,xpos+5|0, ypos+5|0 );
                }
            } else {
                ctx.fillStyle = "blue";
                if (isSolidTile){
                    ctx.fillRect(xpos, ypos, size, size);
                }
            }
            if (v === '100') {
                // switch
                ctx.fillStyle = "gray";
                ctx.fillRect(xpos, ypos, size, size);
                // this.fontdrawer.drawIcon(ctx, '>',xpos+2|0,ypos+5|0 );
                // this.fontdrawer.drawIcon(ctx, '>',xpos+7|0,ypos+5|0 );
                this.fontdrawer.drawIcon(ctx, 'on',xpos+4|0,ypos+5|0 );

            }
            if(v === '101') {
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
            }

        }
    }
}

function iter2dArray(arr, fn){
    var mapSize = arr.length;
    for(var y = 0; y < mapSize; y++) {
        for(var x = 0; x < mapSize; x++) {
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
// random integer
function randi(n){
	n = n || 100
	return Math.floor(randd() * n);
}
// random decimal
function randd(){
	return Math.random();
}
//

var mapz = {
	2 : 'F'
};
/**
 * 0 = nothing
 * 1 - 10 = 1 2 3 4 5 6 7 8 9 a
 *  11 - 15 = b c d e f 
 */

function map1(){
	var tiles = [
		[
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[1,0,0,0,0,0,0,0,0,0,0,0,100,0],
		[1,2,2,2,2,3,4,15,2,2,2,2,2,2],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[1,0,0,0,0,0,0,0,0,0,0,0,101,0],
		[1,0,0,0,0,0,0,0,1,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
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
		[1,0,0,0,0,0,0,0,1,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
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
		[1,0,0,2,0,0,0,0,2,0,0,0,0,0],
		[1,0,0,2,0,0,0,0,8,0,0,0,100,0],
		[1,0,0,2,0,0,0,0,7,0,0,0,0,0],
		[1,0,0,2,0,0,0,0,6,0,0,0,0,0],
		[1,0,0,3,0,0,0,0,5,0,0,0,0,0],
		[1,0,0,4,100,0,0,0,4,0,0,0,0,0],
		[1,0,0,1,1,1,1,1,1,1,1,0,1,1],
		[1,0,0,12,0,0,0,0,0,0,0,0,0,0],
		[1,0,0,2,0,0,0,0,0,0,0,101,0,0],
		[1,0,0,4,0,0,0,0,1,1,1,1,1,1],
		[1,100,0,5,0,0,0,0,0,0,0,0,0,0],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0]
	];
	var map2 = 	[
		[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[1,4,0,2,0,0,0,0,2,0,0,0,0,0],
		[1,0,0,2,0,0,0,0,8,0,0,0,100,0],
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
			90, // x
			20 // y
		]
	};		
}

function map3(){


}
var GameScene = function(game, sprites){
    this.sprites = sprites;
    this.name = 'gamescene';
    this.isGravity = true;
	this.player = new Player(90, 20);
	this.glitchMode = true;
	this.game = game;
	this.fontdrawer = fontDrawer();
    sprites.push(this.player);
	this.nextLevel(map1);
	this.currentMap = 0;
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
				this.nextMap();
			}
			if(tile === '101') {
				console.log("end of level");
				this.nextLevel(map2);

			}
			keys.released[keys.A] = false;
		}
    },
	nextMap : function(){
		var g = (this.currentMap + 1) % this.maps.length;
		this.currentMap = g;
		this.map = this.maps[this.currentMap];
	},
	nextLevel : function(fn){
		this.sprites = [this.player];
		// get new map
		var mazzz = fn();
		this.maps = mazzz.maps.map(function(m){
			var w = new World(resolution);
			w.init(m);
			// return new World()
			return w;
		}, this);
		this.map = this.maps[0];
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
		}, this);

		this.map.collisionTiles.forEach(function(t){
			var size = this.game.getPixelSize();
			ctx.fillStyle = 'gray';
			ctx.fillRect(t.x * size, t.y * size, size, size);
		}, this);
		this.map.collisionTiles = [];
		var img = new Image();
		img.src = 'pixrl1.png';
		// ctx.drawImage(this.img, inx * 5, yindex *5, 5, 5, x, y, 5, 5 );

		ctx.drawImage(img, 32, 0, 16, 16, this.player.x-5, this.player.y-5, 16, 16 );
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
	init : function(canvasId, width, height){
		var canvasSize = this.canvasSize * canvasScaleFactor;

		var canvas = this.canvas = document.getElementById('canvas');
		this.ctx = canvas.getContext('2d');
		canvas.width = canvasSize;
		canvas.height = canvasSize;

		this.sprites = [];
		this.ctx.scale(canvasScaleFactor, canvasScaleFactor);
		this.ctx.imageSmoothingEnabled = false;
	
		this.keys = KeyListeners();

//	this.scene1 = new GameScene(this, this.sprites, this.map);
		this.scene1 = new TitleScene(this);
		this.fontdrawer = fontDrawer();
	},
	getPixelSize : function(){
		return this.canvasSize / this.map.size;
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
		this.map = this.scene1.map;
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
		//
		var now = Date.now();
		var step = 1000 / 60;
		var delta = now - Game.then;
		if(delta > step){
			Game.then = now - (delta % step); 
			Game.render();
			Game.update(delta);
		}
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
	this.gravity = true;
	this.isOnGround = false;
	this.col = 'red';
	this.type = 'sprite';
	this.isOnGround = false;
}

Sprite.prototype = {
	move : function(map){
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
			var aboutToGoOffledge;// = !map.collidingPoint(nextX, y2+1);
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
			var aboutToGoOffLedge; // = !map.collidingPoint(nextX, y2+1);
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
					if(d===1){
						c = randomLetter();
					}else if(d === 100){
						c = '100';
					} else if( d === 101) {
						c = '101';
					} else {
						c = String.fromCharCode(48 + d);
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
	// not used
	randomGlitch : function(){
		var length = this.size;
		for(var y = 0; y < length; y++) {
			for(var x = 0; x < length; x++) {
				if(!this.isSolid(x, y)){
					this.map[y][x] = randomLetter();
				}
			}
		}
	},

	/**
	 * takes a point
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
			map.collisionTiles.push({x : x1, y : y1});
		}
		return this.isSolid(x1, y1);
	},
	isSolid : function(x, y){
		return this.collisions[y][x] !== 0 && this.collisions[y][x] < 16;
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
}

Player.prototype = new Sprite();
Player.prototype.move = function(){}
Game.init('canvas');

Game.run();
