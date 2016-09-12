
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
                ctx.drawImage(this.img, inx * 5, yindex *5, 5, 5, x, y, 5, 5 );
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
		},
		drawTitle : function(ctx, x, y) {
			this.draw(ctx, "0", x, y, 2); // x + 20 , y + 20
			this.draw(ctx, "x", x + (2 * 20), y + (2 * 12)); // x + 50, y + 45
			this.draw(ctx, "DEAD", x + 9, y, 2); // x + 30, y + 20
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
function renderMap(ctx, map){
    var size = this.game.getPixelSize();
    var mapSize = map.size;
    var fontdrawer = this.fontdrawer;

    iter2dArray(map.map, function(el, x, y) {
        function getRndColor() {
            var r = 255*Math.random()|0,
                g = 255*Math.random()|0,
                b = 255*Math.random()|0;
            return 'rgb(' + r + ',' + g + ',' + b + ')';
        }

        var xpos = x * size;
        var ypos = y * size;

        var v = el;
        var isSolidTile = map.isSolid(x, y);
        if (v === '100') {
            ctx.fillStyle = "gray";
            ctx.fillRect(xpos, ypos, size, size);
            fontdrawer.drawIcon(ctx, 'on',xpos+4|0,ypos+5|0 );
            var col = [255, 255, 0];
            ctx.strokeStyle = 'rgba('+col[0]+','+col[1]+','+col[2]+',0.8)'
            // ctx.strokeStyle = "yellow";
            ctx.strokeRect(xpos, ypos, size, size);
        } else if (v === '30') {
            ctx.strokeStyle = "yellow";
            ctx.strokeRect(xpos, ypos, size, size);
        } else if (v === '20') {
            // bad tile
            ctx.fillStyle = "red";
            ctx.fillRect(xpos, ypos, size, size);
            for(var y = ypos; y < ypos + size; y++) {
                for(var x = xpos; x < xpos + size; x++) {
                    ctx.fillStyle = getRndColor();
                    ctx.fillRect(x, y, 1, 1);
                }
            }

        } else if (v === '99') {
            // door
            var centrex = xpos + (size / 2) | 0;
            var centrey = ypos + (size / 2) | 0;
            // var grd = ctx.createRadialGradient(centrex, centrey, 40, centrex, centrey, 0);
            ctx.save();
            ctx.shadowBlur = 25;
            ctx.shadowColor = 'white';
            var grd = ctx.createLinearGradient(0,0,0, ypos +  20);
            // light blue
            grd.addColorStop(0, 'white');
            // dark blue
            grd.addColorStop(1, 'black');
            ctx.fillStyle = grd;
            ctx.fillRect(xpos, ypos, size, size);
            ctx.restore();
        } else if(isSolidTile){
            fontdrawer.draw(ctx, v, xpos+5|0, ypos+5|0);
            // draw green rectangle around it
            ctx.strokeStyle = "green";
            ctx.strokeRect(xpos, ypos, size, size);
        } else {
            var g = Math.random() > 0.3 ? v : randomLetter();
            fontdrawer.draw(ctx, g ,xpos+5|0, ypos+5|0 );
        }
    });
}

function iter2dArray(arr, fn){
    for(var y = 0; y < arr.length; y++) {
        for(var x = 0; x < arr[0].length; x++) {
            fn(arr[y][x],x, y);
        }
    }
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

/**
 * 0 = nothing
 * 1 - 10 = 1 2 3 4 5 6 7 8 9 a
 *  11 - 15 = b c d e f 
 * 
 * 20 = bad place
 * 30 = yellow box
 * 
 * 100 = switch 
 * 99 = exit
 * 
 * 
 * 200 = boolean switch
 * 
 */

function getMaps(){

	function map0(){
		var tiles = [
			[
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,100,0],
			[1,1,1,2,2,3,20,2,2,2,2,2,2,2],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,99,0,0,0,0,0,0,0,0,0,0],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0]
		],
		[
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,100,0],
			[1,1,1,2,2,0,0,0,2,2,2,2,2,2],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,99,0,0,0,0,0,0,0,0,0,0],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0]
		]
		];
		return {
			maps : tiles,
			sprites : [
			],
			start : [20, 20]

		}
	}



	function map1(){
		var tiles = [
			[
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,100,0],
			[1,20,20,2,2,3,4,15,2,2,2,2,2,2],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,99,0,0,0,0,0,0,0,0,0,0],
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
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,99,0,0,0,0,0,0,0,0,0,0],
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
					x : 110, 
					y  : 10
				}
			],
			start : [90, 20]
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
			[1,0,0,2,0,0,0,0,0,0,0,99,0,0],
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
			[1,0,0,2,0,0,0,0,0,0,0,99,0,0],
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
				80 // y
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
			[1,0,0,0,0,0,0,2,0,0,0,0,0,0],
			[1,2,2,2,0,0,0,8,0,0,0,0,0,0],
			[1,0,0,2,0,0,0,7,0,0,0,0,0,0],
			[1,0,0,2,0,0,0,6,0,0,0,0,0,0],
			[1,0,0,3,0,0,0,5,0,0,0,0,0,0],
			[1,0,0,4,100,0,0,4,0,0,0,0,0],
			[1,0,0,1,1,1,1,1,1,1,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,5,5,2,0,0,0,0,0,0,0,99,0,0],
			[1,0,0,4,0,0,0,0,1,1,1,1,1,1],
			[1,0,0,5,0,0,0,0,0,0,0,0,0,0],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
		];
		var map2 = [
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,2,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,8,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,7,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,6,0,0,0,0,0,0],
			[1,100,0,3,0,0,0,5,0,0,0,0,0,0],
			[1,1,1,4,100,0,0,4,0,0,0,0,0],
			[1,0,0,1,1,1,1,1,1,1,0,0,0,1],
			[1,0,0,12,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,2,0,0,0,0,0,0,0,99,0,0],
			[1,0,0,4,0,0,0,0,1,1,1,1,1,1],
			[1,99,0,5,0,0,0,0,0,0,0,0,0,0],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0]
		];
		
		return {
			maps : [
				map1,
				map2
			],
			start : [
				80, 
				20
			],
			sprites : [{
				x : 112,
				y : 119
			}]
		};
	};

	function map4(){
		var map1 = [
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,99,0],
			[1,0,0,0,0,0,0,0,0,0,0,1,1,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,  0,1,0,1,1,1,1,1,0,0,0],
			[1,0,100,  0,0,0,0, 0,0,1,0,0,0,0],
			[1,0,1,0,0,0,0, 0,0,1,0,0,0,0],
			[1,0,1,  0,0,0,0,0,0,1,0,100,0,0],
			[1,0,1,100,0,1,0,0,0,1,0,1,1,0],
			[1,0,15, 1,1,1,0,0,0,1,0,0,0,0],
			[1,0,11, 0,0,1,20,20,1,1,1,1,1,0],
			[1,0,11, 0,0,0,0,0,0,0,0,0,0,0],
			[1,1,1,  1,1,1,1,1,1,1,1,1,1,1]
		];
		var map2 = [
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,7,1,1,3,2,0,0,0],
			[1,0,100,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,1,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,100,0,0,100,0,0,0,0,0,0],
			[1,0,0,0,1,3,2,1,1,1,1,1,1,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,100,0,0,0,0,0,0,0,0,0,0],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1]
		];
		
		return {
			maps : [
				map1,
				map2
			],
			start : [
				80, 
				158
			],
			sprites : [{
				x : 90, 
				y : 55
			}]
		};
	};

	function map5() {
		var map1 = [
			[1,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,1,1,1,0,0,0,0,0,0,0,0, 1],
			[1,0,1,0,0,0,0,0,0,0,1,1,1,0],
			[1,0,1,0,0,0,1,1,0,0,0,0,0,0],
			[1,0,1,0,0,1,0,0,0,0,0,0,0,0],
			[1,0,1,0,0,0,0,0,0,1,0,0,0,0],
			[1,0,1,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,1,1,1,1,1,1,1,1,1,0,0,0],
			[1,0,0,1,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,1,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,1,0,0,0,0,0,0,0,0,0,0],
			[1,99,0,1,0,0,0,0,0,100,0,0,0,0],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1]
		];
		var map2 = [
			[1,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,1,0,0,0,0,0,0,0,0,0,0, 1],
			[1,0,1,0,0,1,1,1,0,0,0,1,1,0],
			[1,0,1,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,1,0,0,0,0,0,0,100,0,0,0,0],
			[1,0,1,0,0,0,0,0,0,1,0,0,0,0],
			[1,0,1,0,0,0,4,0,0,0,0,0,0,0],
			[1,0,1,0,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,1,0,1,0,1,0,1,0,1,0,0],
			[1,0,0,1,0,0,0,0,0,0,0,0,0,0],
			[1,0,0,1,0,0,0,0,0,0,0,0,1,1],
			[1,99,0,1,0,0,99,0,0,100,0,0,0,0],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1]
		];

		return {
			maps : [
				map1,
				map2
			],
			start : [
				80, 
				158
			],
			sprites : [{
				x :130, 
				y : 75
			},
			{
				x : 40,
				y : 55
			}]
		};
	} 

	function map6(){
		var map1 = [
			[1,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,1,0,1,0,0,0,99,0,1],
			[1,1,1,0,0,0,0,0,0,0,0,1,1,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,1,1,1,1,1,0,0,0,0,1],
			[1,0,0,1,0,0,1,0,0,1,0,0,0,1],
			[1,0,0,1,0,0,1,0,0,1,0,0,0,1],
			[1,0,0,1,1,1,1,1,1,1,0,0,0,1],
			[1,0,0,0,1,1,1,1,1,0,0,0,0,1],
			[1,0,0,0,1,0,1,0,1,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,100,0,0,0,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1]
		];
		var map2 = [
			[1,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1,0,1],
			[1,0,0,0,100,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,1,1,1,1,1,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,1,1,1,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,100,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1,20,1],
			[1,0,0,0,0,0,0,0,0,0,0,0,0,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1]
		];

		return {
			maps : [
				map1,
				map2
			],
			start : [
				80, 
				158
			],
			sprites : [{
				x :130, 
				y : 75
			},
			{
				x : 50,
				y : 25
			}
			]
		};
	}

	var levelindex = 0;
	var mapindex = 0;

	var mapFunctions = [
		 map0,
		 map1, 
		 map2,
		 map3,
		 map4,
		map5,
		map6
	];


	return {
		nextLevel : function(scene){
			mapindex = 0;
			levelindex++;
			var l = this.restartMap(scene);
			return l;
		},
		restartMap : function(scene){
			mapindex = 0;
			var fn = mapFunctions[levelindex];
			if(!fn){
				return false;
			}
			var mazz = fn();
			this.start = mazz.start;
			this.maps = mazz.maps.map(function(m){
				var w = new World(resolution);
				w.init(m, scene);
				// return new World()
				return w;
			}, this);
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
function song(){

    // create a new Web Audio API context
    var ac = new AudioContext();

    // set the playback tempo (120 beats per minute)
    var tempo = 70;
    var when = ac.currentTime;

    // create a new sequence
    var sequence = new TinyMusic.Sequence( ac, tempo, [
    'A3 s',
    'C4 s',
    'D4 s',
    'E4 s',
    'A3 s',
    'C4 s',
    'D4 s',
    'E4 s',
    'A3 s',
    'C4 s',
    'D4 s',
    'E4 s',
    'A3 s',
    'C4 s',
    'D4 s',
    'E4 s',

     'G3 s',
    'C4 s',
    'D4 s',
    'E4 s',
    'G3 s',
    'C4 s',
    'D4 s',
    'E4 s',
    'G3 s',
    'C4 s',
    'D4 s',
    'E4 s',
    'G3 s',
    'C4 s',
    'D4 s',
    'E4 s',

    'F3 s',
    'C4 s',
    'D4 s',
    'E4 s',
        'F3 s',
    'C4 s',
    'D4 s',
    'E4 s',
            'F3 s',
    'C4 s',
    'D4 s',
    'E4 s',
            'F3 s',
    'C4 s',
    'D4 s',
    'E4 s',

    'E3 s',
    'G#3 s',
    'B3 s',
    'D4 s',


    'E3 s',
    'G#3 s',
    'B3 s',
    'D4 s',


    'E3 s',
    'G#3 s',
    'B3 s',
    'D3 s',


    'E4 s',
    'G#4 s',
    'D4 s',
    'E4 s',


    ]);

    var getSeq2 = function(note){
        var noteNote = note + ' s';
        return [
            noteNote, 
            '- s',
            //
            '- s',
            noteNote,
            '- s',
            noteNote,
            '- e',
            noteNote,
            '- s',
            '- s',
            '- s',

            '- s',
            '- s',

            '- s',
            '- s'
        ];
    }


    // var sequence2 = new TinyMusic.Sequence(ac, tempo, [ 
    //     // 'A2 w',
    //     // 'G2 w',
    //     // 'F2 w',
    //     // 'E2 w'

    //     'A3 s',
    //     '- s',
    //     //
    //     '- s',
    //     'A3 s',

    //     '- s',
    //     'A3 s',
    //     '- e',

    //     // '- s',
    //     // '- s',

    //     'A3 s',
    //      '- s',

    //       '- s',
    //       '- s',

    //       '- s',
    //       '- s',

    //       '- s',
    //       '- s',

    //     'G3 s',
    //     '- s',
    //     //
    //     '- s',
    //     'G3 s',

    //     '- s',
    //     'G3 s',

    //     '- s',
    //     '- s',

    //     'G3 s',
    //      '- s',

    //       '- s',
    //       '- s',

    //       '- s',
    //       '- s',

    //       '- s',
    //       '- s',


    //          'A3 s',
    //     '- s',
    //     //
    //     '- s',
    //     'A3 s',

    //     '- s',
    //     'A3 s',
    //     '- e',

    //     // '- s',
    //     // '- s',

    //     'A3 s',
    //      '- s',

    //       '- s',
    //       '- s',

    //       '- s',
    //       '- s',

    //       '- s',
    //       '- s',

    //       //
    //          'G#3 s',
    //     '- s',
    //     //
    //     '- s',
    //     'G#3 s',

    //     '- s',
    //     'G#3 s',
    //     '- e',

    //     // '- s',
    //     // '- s',

    //     'G#3 s',
    //      '- s',

    //       '- s',
    //       '- s',

    //       '- s',
    //       '- s',

    //       '- s',
    //       '- s',

    // ]);
    var a2 = getSeq2('A3');
    var g2 = getSeq2('G3');
    var gs2 = getSeq2('G#3');

    var sequence2 = new TinyMusic.Sequence(ac, tempo, a2.concat(g2, a2, gs2));

    var sequence3 = new TinyMusic.Sequence(ac, tempo, [
        'B4 h',
        'C5 h',
        'D5 h',
        'E5 h',
        'B5 h',
        'A5 h',
        'C6 h',
        'B5 h'  
    ]);

    sequence.gain.gain.value = 1.0/16;
    sequence2.gain.gain.value = 1.0/8;
    sequence3.gain.gain.value = 1.0/20;
    sequence3.waveType = 'sawtooth';
    // sequence2.waveType = 'sine';
    // sequence.smoothing = 0.02;

    sequence2.bass.gain.value = 6;
    sequence2.bass.frequency.value = 80;



    // disable looping
    // sequence.loop = false;
    var playing = true;

    // play it
    var songplayer = {
        // playing : false,
        play : function(){
            var when = ac.currentTime;
            var when2 = when + ( 60 / tempo ) * 16;
            playing = true;
            sequence.play(); 
            sequence2.play( when2 );
            var when3 = when + ( 60 / tempo ) * 32;
            sequence3.play(when3 );
        },
        stop : function(){
            playing = false;
            sequence.stop(); 
            sequence2.stop();
            sequence3.stop();
        },
        playStopListener : function(){
            if(playing){
                // songplayer.playing = false;
                songplayer.stop();
                Game.soundOn = false;
                this.innerHTML = '&#x1f507;';
            } else {
                // songplayer.playing = true;
                songplayer.play();
                 Game.soundOn = true;
                this.innerHTML = '&#x1f50a;';
            }
        }
    };

    return  songplayer;
}

(function ( root, factory ) {
  if ( typeof define === 'function' && define.amd ) {
    define( [ 'exports' ], factory );
  } else if ( typeof exports === 'object' && typeof exports.nodeName !== 'string' ) {
    factory( exports );
  } else {
    factory( root.TinyMusic = {} );
  }
}( this, function ( exports ) {

/*
 * Private stuffz
 */

var enharmonics = 'B#-C|C#-Db|D|D#-Eb|E-Fb|E#-F|F#-Gb|G|G#-Ab|A|A#-Bb|B-Cb',
  middleC = 440 * Math.pow( Math.pow( 2, 1 / 12 ), -9 ),
  numeric = /^[0-9.]+$/,
  octaveOffset = 4,
  space = /\s+/,
  num = /(\d+)/,
  offsets = {};

// populate the offset lookup (note distance from C, in semitones)
enharmonics.split('|').forEach(function( val, i ) {
  val.split('-').forEach(function( note ) {
    offsets[ note ] = i;
  });
});

/*
 * Note class
 *
 * new Note ('A4 q') === 440Hz, quarter note
 * new Note ('- e') === 0Hz (basically a rest), eigth note
 * new Note ('A4 es') === 440Hz, dotted eighth note (eighth + sixteenth)
 * new Note ('A4 0.0125') === 440Hz, 32nd note (or any arbitrary
 * divisor/multiple of 1 beat)
 *
 */

// create a new Note instance from a string
function Note( str ) {
  var couple = str.split( space );
  // frequency, in Hz
  this.frequency = Note.getFrequency( couple[ 0 ] ) || 0;
  // duration, as a ratio of 1 beat (quarter note = 1, half note = 0.5, etc.)
  this.duration = Note.getDuration( couple[ 1 ] ) || 0;
}

// convert a note name (e.g. 'A4') to a frequency (e.g. 440.00)
Note.getFrequency = function( name ) {
  var couple = name.split( num ),
    distance = offsets[ couple[ 0 ] ],
    octaveDiff = ( couple[ 1 ] || octaveOffset ) - octaveOffset,
    freq = middleC * Math.pow( Math.pow( 2, 1 / 12 ), distance );
  return freq * Math.pow( 2, octaveDiff );
};

// convert a duration string (e.g. 'q') to a number (e.g. 1)
// also accepts numeric strings (e.g '0.125')
// and compund durations (e.g. 'es' for dotted-eight or eighth plus sixteenth)
Note.getDuration = function( symbol ) {
  return numeric.test( symbol ) ? parseFloat( symbol ) :
    symbol.toLowerCase().split('').reduce(function( prev, curr ) {
      return prev + ( curr === 'w' ? 4 : curr === 'h' ? 2 :
        curr === 'q' ? 1 : curr === 'e' ? 0.5 :
        curr === 's' ? 0.25 : 0 );
    }, 0 );
};

/*
 * Sequence class
 */

// create a new Sequence
function Sequence( ac, tempo, arr ) {
  this.ac = ac || new AudioContext();
  this.createFxNodes();
  this.tempo = tempo || 120;
  this.loop = true;
  this.smoothing = 0;
  this.staccato = 0;
  this.notes = [];
  this.push.apply( this, arr || [] );
}

// create gain and EQ nodes, then connect 'em
Sequence.prototype.createFxNodes = function() {
  var eq = [ [ 'bass', 100 ], [ 'mid', 1000 ], [ 'treble', 2500 ] ],
    prev = this.gain = this.ac.createGain();
  eq.forEach(function( config, filter ) {
    filter = this[ config[ 0 ] ] = this.ac.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.value = config[ 1 ];
    prev.connect( prev = filter );
  }.bind( this ));
  prev.connect( this.ac.destination );
  return this;
};

// accepts Note instances or strings (e.g. 'A4 e')
Sequence.prototype.push = function() {
  Array.prototype.forEach.call( arguments, function( note ) {
    this.notes.push( note instanceof Note ? note : new Note( note ) );
  }.bind( this ));
  return this;
};

// create a custom waveform as opposed to "sawtooth", "triangle", etc
Sequence.prototype.createCustomWave = function( real, imag ) {
  // Allow user to specify only one array and dupe it for imag.
  if ( !imag ) {
    imag = real;
  }

  // Wave type must be custom to apply period wave.
  this.waveType = 'custom';

  // Reset customWave
  this.customWave = [ new Float32Array( real ), new Float32Array( imag ) ];
};

// recreate the oscillator node (happens on every play)
Sequence.prototype.createOscillator = function() {
  this.stop();
  this.osc = this.ac.createOscillator();

  // customWave should be an array of Float32Arrays. The more elements in
  // each Float32Array, the dirtier (saw-like) the wave is
  if ( this.customWave ) {
    this.osc.setPeriodicWave(
      this.ac.createPeriodicWave.apply( this.ac, this.customWave )
    );
  } else {
    this.osc.type = this.waveType || 'square';
  }

  this.osc.connect( this.gain );
  return this;
};

// schedules this.notes[ index ] to play at the given time
// returns an AudioContext timestamp of when the note will *end*
Sequence.prototype.scheduleNote = function( index, when ) {
  var duration = 60 / this.tempo * this.notes[ index ].duration,
    cutoff = duration * ( 1 - ( this.staccato || 0 ) );

  this.setFrequency( this.notes[ index ].frequency, when );

  if ( this.smoothing && this.notes[ index ].frequency ) {
    this.slide( index, when, cutoff );
  }

  this.setFrequency( 0, when + cutoff );
  return when + duration;
};

// get the next note
Sequence.prototype.getNextNote = function( index ) {
  return this.notes[ index < this.notes.length - 1 ? index + 1 : 0 ];
};

// how long do we wait before beginning the slide? (in seconds)
Sequence.prototype.getSlideStartDelay = function( duration ) {
  return duration - Math.min( duration, 60 / this.tempo * this.smoothing );
};

// slide the note at <index> into the next note at the given time,
// and apply staccato effect if needed
Sequence.prototype.slide = function( index, when, cutoff ) {
  var next = this.getNextNote( index ),
    start = this.getSlideStartDelay( cutoff );
  this.setFrequency( this.notes[ index ].frequency, when + start );
  this.rampFrequency( next.frequency, when + cutoff );
  return this;
};

// set frequency at time
Sequence.prototype.setFrequency = function( freq, when ) {
  this.osc.frequency.setValueAtTime( freq, when );
  return this;
};

// ramp to frequency at time
Sequence.prototype.rampFrequency = function( freq, when ) {
  this.osc.frequency.linearRampToValueAtTime( freq, when );
  return this;
};

// run through all notes in the sequence and schedule them
Sequence.prototype.play = function( when ) {
  when = typeof when === 'number' ? when : this.ac.currentTime;

  this.createOscillator();
  this.osc.start( when );

  this.notes.forEach(function( note, i ) {
    when = this.scheduleNote( i, when );
  }.bind( this ));

  this.osc.stop( when );
  this.osc.onended = this.loop ? this.play.bind( this, when ) : null;

  return this;
};

// stop playback, null out the oscillator, cancel parameter automation
Sequence.prototype.stop = function() {
  if ( this.osc ) {
    this.osc.onended = null;
    this.osc.disconnect();
    this.osc = null;
  }
  return this;
};

  exports.Note = Note;
  exports.Sequence = Sequence;
}));
var GameScene = function(game, sprites){
    this.sprites = sprites;
    this.name = 'gamescene';
    this.isGravity = true;
	this.player = new Player(90, 20);
	this.game = game;
	this.fontdrawer = game.fontdrawer;
    sprites.push(this.player);
	this.maps = getMaps();
	this.resetLevel(this.maps.restartMap());
	this.playerSprite = game.images['pixrl1'];
	this.fadingout = false;
	this.restartCounter = 0;
	this.playerDead = false;
	this.rTime = 200;
	this.arrow = {};
	this.soundPlayer = Soundz();
}

GameScene.prototype = {
    update : function(keys){
		var player = this.player;

        
		if(!this.fadingout){
			this.sprites.forEach(function(s) {
				if(s.type !== 'player'){
					s.move(this.map);
					if(s.type === "sprite" &&
						s.x < player.x + player.width &&
						s.x + s.width > player.x &&
						s.y < player.y + player.height &&
						s.y + s.height > player.y
					) {
						// player is dead becoz they hit a baddie
						this.restart();
						this.soundPlayer.play('dead');
					}
				}
			}, this);

			this.getPressedKeys(keys);
			this.movePlayer();
			var tile = this.map.getTile(player.x, player.y);
			if(tile.t === "100" || tile.t === "99"){
				this.arrow = this.arrow ? this.arrow : new Arrow(tile.x, tile.y);
				this.arrow.move();
			} else {
				this.arrow = null;
			}
		} else {
			this.restartCounter--;
			if(this.restartCounter < 0){
				this.fadingout = false;
				if(this.changinglevel){
					this.changinglevel = false;
					this.nextLevel();
				} else {	
					// player was dead
					this.playerDead = false;
					this.resetLevel(this.maps.restartMap());
				}
			
			}
		}

    },
	/**
	 * change the level
	 */
	nextLevel : function(){
		// get new map
		var mazzz = this.maps.nextLevel();
		if(!mazzz){
			this.game.nextScene();
			return;
		}
		this.resetLevel(mazzz);
	},
	/**
	 * reset the same level and put everything back to how it was
	 */
	resetLevel : function(mazzz){
		this.sprites = [this.player];
		
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
		this.player.isOnGround =false;

	},
    render : function (ctx) {
		if(this.restartCounter > 0) {
			ctx.globalAlpha = this.restartCounter / this.rTime;
		} else {
			ctx.globalAlpha = 1;
		}

		renderMap.call(this, ctx, this.map, true);

        this.sprites.forEach(function(s) {

			// ctx.fillStyle = s.col || 'green';
			// ctx.fillRect(s.x, s.y, s.width, s.height);
			ctx.drawImage(this.game.images['pixrl1'], s.img, 0, 16, 16, s.x-5, s.y-5, 16, 16 );
		}, this);

		if(this.arrow){
			var xpos = this.arrow.x;
			var ypos = this.arrow.y + this.arrow.vy;
			ctx.save();
			ctx.translate(xpos, ypos-10);
			ctx.rotate((Math.PI/180)*-90);
			ctx.translate(-xpos-5, -ypos+10);
			ctx.font = "10px Arial";
			ctx.fillStyle = "gray";
			ctx.fillText("\u2794", xpos, ypos);
			ctx.restore();
		}

		// this.map.collisionTiles.forEach(function(t){
		// 	var size = this.game.getPixelSize();
		// 	ctx.fillStyle = 'gray';
		// 	ctx.fillRect(t.x * size, t.y * size, size, size);
		// }, this);
		this.map.collisionTiles = [];
		if(this.playerDead && this.restartCounter > 0 && this.restartCounter < this.rTime/2) {
			ctx.globalAlpha = 1;
			this.fontdrawer.drawTitle(ctx, 30, 20);
			// this.fontdrawer.draw(ctx, "0", 20, 20, 2);
			// this.fontdrawer.draw(ctx, "x", 50, 45);
			// this.fontdrawer.draw(ctx, "DEAD", 30, 20, 2);
		}

    },
	getPressedKeys : function(keys){
		var player = this.player;
        if(keys.pressed[keys.A]){
			if(!player.jumping && player.isOnGround){
				player.vy = -6;
				player.jumping = true;
				player.isOnGround = false;
				player.canJump = false;
				this.soundPlayer.play('jump');
			}
		}
		if(keys.pressed[keys.DOWN]){
			player.vy = 1;
		}
		if (keys.pressed[keys.LEFT]) {
			player.vx = -1;
			player.img = 48;
		}
		if(keys.released[keys.LEFT]){
			player.vx = 0;
		}
		if (keys.pressed[keys.RIGHT]) {
			player.vx = 1;
			player.img = 32;
		}
		if(keys.released[keys.UP]) {
			// check map?
			var x = player.x + player.width/2;
			var y = player.y + player.height/2;
			var tile = this.map.getTile(x, y).t;
			if(tile === '100') {
				
				this.map = this.maps.nextMap();
				this.soundPlayer.play('pressSwitch');
			}
			if(tile === '99') {
				this.soundPlayer.play('endlevel');
				this.changeLevel();
			}
			keys.released[keys.UP] = false;
		}
    },
	restart : function(){
		this.fadingout = true;
		this.playerDead = true;
		this.restartCounter = this.rTime;
	},
	changeLevel : function(){
		this.fadingout = true;
		this.changinglevel = true;
		this.restartCounter = 50;
	},
	movePlayer : function() {
		var player = this.player;
		var map = this.map;
		var dx = player.vx;
		var dy = player.vy;
			dy += 0.5; //gravity
		var friction = 0.1;

		// movex 
		if ( dx > 0) {
			// going right
			//add friction
			dx -= friction;
			if(dx < 0.05){
				dx = 0;
			}
	
			var nextX = player.x + dx + player.width;
			var y1 = player.y;
			var y2 = player.y + player.height;
			var tilex1 = map.collidingPoint(nextX, y1);
			var tilex2 = map.collidingPoint(nextX, y2);
			
			if(tilex1 || tilex2 ) {
				dx = 0;
			}

		} else if ( dx < 0) {

			var nextX = player.x + dx;
			var y1 = player.y;
			var y2 = player.y + player.height;
			var tilex1 = map.collidingPoint(nextX, y1);
			var tilex2 = map.collidingPoint(nextX, y2);
			if(tilex1 || tilex2 ) {
				dx = 0;
			}
		}
		if(dy > 0) {
			//going down!!
			if(dy > 1){
				dy = 1; 
			}

			var nextY = player.y + dy + player.height;
			var x1 = player.x;
			var x2 = player.x + player.width;
			var tilex1 = map.collidingPoint(x1, nextY);
			var tilex2 = map.collidingPoint(x2, nextY);
			if(tilex1 || tilex2 ) {
				var tt = map.getTile(x1, nextY).t;
				var tt1 = map.getTile(x2, nextY).t;
				player.jumping = false;
				player.isOnGround = true;
				player.canJump = true;
				if(tt === "20" || tt1 === "20"){
					//bad tile!!
					//you die
					this.soundPlayer.play('dead');
					this.restart();


				}
				dy = 0;
			} else {
				player.isOnGround = false;
			}
		} else if(dy < 0) {
			// going up


			var nextY = player.y + dy;
			var x1 = player.x;
			var x2 = player.x + player.width;
			var tilex1 = map.collidingPoint(x1, nextY);
			var tilex2 = map.collidingPoint(x2, nextY);
			if(tilex1 || tilex2 ) {
				dy = 0;
			}
 		}


		player.vy = dy;
		player.vx = dx;
		
		player.x += player.vx;
		player.y += player.vy;
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
        var fontdrawer = this.g.fontdrawer;
        // fontdrawer.draw(ctx, '0xdead', 10, 10, 2);
        fontdrawer.drawTitle(ctx, 30, 20);
        // ctx.fill
        fontdrawer.draw(ctx, 'Controls : ', 50, 52);
        fontdrawer.draw(ctx, 'Arrows to move,', 50, 62);
        fontdrawer.draw(ctx, 'A to open doors', 50, 72);
        fontdrawer.draw(ctx, 'and press switches', 50, 80);
    }
}

function EndScene(game){
    this.g = game;
}

EndScene.prototype = {
    update : function(){

    },
    render : function(ctx){
        var fontdrawer = this.g.fontdrawer;
        fontdrawer.draw(ctx,"THE END", 20, 20, 2);
        fontdrawer.draw(ctx,"ThAnKs", 20, 30, 2);
        fontdrawer.draw(ctx,"foR PlayiNg", 20, 40, 2);
    }
}

var canvasScaleFactor = 3;

var resolution = 180;

var Game = {
	delta : 0,
	then : 0,
	logInfo : [],
	canvasSize : resolution,
	isGravity : true,
	images : {},
	soundOn : true,
	init : function(canvasId, images){
		var canvasSize = this.canvasSize * canvasScaleFactor;

		var canvas = this.canvas = document.getElementById('canvas');
		var ctx = this.ctx = canvas.getContext('2d');
		canvas.width = canvasSize;
		canvas.height = canvasSize;

		this.sprites = [];
		ctx.scale(canvasScaleFactor, canvasScaleFactor);
		ctx.imageSmoothingEnabled = false;
		ctx.mozImageSmoothingEnabled = false;
	
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
	fadeOut : function(ctx){
		ctx.globalAlpha = 0.5;

	},
	nextScene : function(){
		if(this.scene1.name === "gamescene"){
			this.scene1 = new EndScene(this);
		} else {
			this.scene1	= new GameScene(this, this.sprites);
		}
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
		// if(this.sprites[0]){
			// this.log("sprite x : " +  this.sprites[0].x);
			// this.log("sprite y : " +  this.sprites[0].y);
			// this.log("sprite vy : " +  this.sprites[0].vy);
			// this.log("restart Counter : " + this.scene1.restartCounter);
		// }
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
		Game.render();
		Game.update();
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

function Arrow(x, y){
	this.x = x;
	this.y = y;
	this.vy = 0;
	this.height = 10;
	this.width = 10;
	this.dir = -1;
}

Arrow.prototype.move = function(map){
	var dist = 4;
	var speed = 0.3;
	if(this.dir > 0){
		this.vy+=speed;
		if(this.y + this.vy > this.y + dist){
			this.dir *= -1;
		}
	} else {
		this.vy-=speed;
		if(this.y + this.vy < this.y - dist){
			this.dir *= -1;
		}
	}
}
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
	/**
	 * returns the Tile id at given coordinate
	 * @param  {any} x
	 * @param  {any} y
	 */
	getTile : function(x, y){
		var map = this;
		var w = map.width;
		var s = w / map.size;
		var x1 = x / s| 0;
		var y1 = y / s| 0;
		return {
			t : map.map[y1][x1],
			x : x1 * s,
			y : y1 * s
		};
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
		// if(map.isSolid(x1, y1)){
		// 	map.collisionTiles.push({x : x1, y : y1, type : map.map[y1][x1]  });
		// }
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
        pressed[k] = true;
        released[k] = false;
        e.preventDefault();
	} 

    function keyup(e){
        var k = e.keyCode;
        pressed[k] = false;
        released[k] = true;
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
	this.width = 5;
	this.y = y;
	this.type = 'player';
	this.img = 32;
	this.jumpTime = 0;
	this.canJump = false;
}

Player.prototype = new Sprite();
Player.prototype.move = function(){}
var f = Images();
f.load(function(im){
    Game.init('canvas', im);
    Game.run();
});

var music = song();
document.getElementById('sound').addEventListener('click', function(){
    // &#x1f507;
    // music.playStopListener();

});


document.getElementById('sound').addEventListener('click', music.playStopListener);
music.play();

// //  var soundURL = jsfxr([0,,0.1812,,0.1349,0.4524,,0.2365,,,,,,0.0819,,,,,1,,,,,0.5]); 
// //  var player = new Audio();
// //  player.src = soundURL;
// //  player.play();

// function fx(){
//      var soundURL = jsfxr([0,,0.1812,,0.1349,0.4524,,0.2365,,,,,,0.0819,,,,,1,,,,,0.5]); 
//     var player = new Audio();
//     player.src = soundURL;
//     player.play();

// }
/**
 * SfxrParams
 *
 * Copyright 2010 Thomas Vian
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Thomas Vian
 */
/** @constructor */
function SfxrParams() {
  //--------------------------------------------------------------------------
  //
  //  Settings String Methods
  //
  //--------------------------------------------------------------------------

  /**
   * Parses a settings array into the parameters
   * @param array Array of the settings values, where elements 0 - 23 are
   *                a: waveType
   *                b: attackTime
   *                c: sustainTime
   *                d: sustainPunch
   *                e: decayTime
   *                f: startFrequency
   *                g: minFrequency
   *                h: slide
   *                i: deltaSlide
   *                j: vibratoDepth
   *                k: vibratoSpeed
   *                l: changeAmount
   *                m: changeSpeed
   *                n: squareDuty
   *                o: dutySweep
   *                p: repeatSpeed
   *                q: phaserOffset
   *                r: phaserSweep
   *                s: lpFilterCutoff
   *                t: lpFilterCutoffSweep
   *                u: lpFilterResonance
   *                v: hpFilterCutoff
   *                w: hpFilterCutoffSweep
   *                x: masterVolume
   * @return If the string successfully parsed
   */
  this.setSettings = function(values)
  {
    for ( var i = 0; i < 24; i++ )
    {
      this[String.fromCharCode( 97 + i )] = values[i] || 0;
    }

    // I moved this here from the reset(true) function
    if (this['c'] < .01) {
      this['c'] = .01;
    }

    var totalTime = this['b'] + this['c'] + this['e'];
    if (totalTime < .18) {
      var multiplier = .18 / totalTime;
      this['b']  *= multiplier;
      this['c'] *= multiplier;
      this['e']   *= multiplier;
    }
  }
}

/**
 * SfxrSynth
 *
 * Copyright 2010 Thomas Vian
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Thomas Vian
 */
/** @constructor */
function SfxrSynth() {
  // All variables are kept alive through function closures

  //--------------------------------------------------------------------------
  //
  //  Sound Parameters
  //
  //--------------------------------------------------------------------------

  this._params = new SfxrParams();  // Params instance

  //--------------------------------------------------------------------------
  //
  //  Synth Variables
  //
  //--------------------------------------------------------------------------

  var _envelopeLength0, // Length of the attack stage
      _envelopeLength1, // Length of the sustain stage
      _envelopeLength2, // Length of the decay stage

      _period,          // Period of the wave
      _maxPeriod,       // Maximum period before sound stops (from minFrequency)

      _slide,           // Note slide
      _deltaSlide,      // Change in slide

      _changeAmount,    // Amount to change the note by
      _changeTime,      // Counter for the note change
      _changeLimit,     // Once the time reaches this limit, the note changes

      _squareDuty,      // Offset of center switching point in the square wave
      _dutySweep;       // Amount to change the duty by

  //--------------------------------------------------------------------------
  //
  //  Synth Methods
  //
  //--------------------------------------------------------------------------

  /**
   * Resets the runing variables from the params
   * Used once at the start (total reset) and for the repeat effect (partial reset)
   */
  this.reset = function() {
    // Shorter reference
    var p = this._params;

    _period       = 100 / (p['f'] * p['f'] + .001);
    _maxPeriod    = 100 / (p['g']   * p['g']   + .001);

    _slide        = 1 - p['h'] * p['h'] * p['h'] * .01;
    _deltaSlide   = -p['i'] * p['i'] * p['i'] * .000001;

    if (!p['a']) {
      _squareDuty = .5 - p['n'] / 2;
      _dutySweep  = -p['o'] * .00005;
    }

    _changeAmount =  1 + p['l'] * p['l'] * (p['l'] > 0 ? -.9 : 10);
    _changeTime   = 0;
    _changeLimit  = p['m'] == 1 ? 0 : (1 - p['m']) * (1 - p['m']) * 20000 + 32;
  }

  // I split the reset() function into two functions for better readability
  this.totalReset = function() {
    this.reset();

    // Shorter reference
    var p = this._params;

    // Calculating the length is all that remained here, everything else moved somewhere
    _envelopeLength0 = p['b']  * p['b']  * 100000;
    _envelopeLength1 = p['c'] * p['c'] * 100000;
    _envelopeLength2 = p['e']   * p['e']   * 100000 + 12;
    // Full length of the volume envelop (and therefore sound)
    // Make sure the length can be divided by 3 so we will not need the padding "==" after base64 encode
    return ((_envelopeLength0 + _envelopeLength1 + _envelopeLength2) / 3 | 0) * 3;
  }

  /**
   * Writes the wave to the supplied buffer ByteArray
   * @param buffer A ByteArray to write the wave to
   * @return If the wave is finished
   */
  this.synthWave = function(buffer, length) {
    // Shorter reference
    var p = this._params;

    // If the filters are active
    var _filters = p['s'] != 1 || p['v'],
        // Cutoff multiplier which adjusts the amount the wave position can move
        _hpFilterCutoff = p['v'] * p['v'] * .1,
        // Speed of the high-pass cutoff multiplier
        _hpFilterDeltaCutoff = 1 + p['w'] * .0003,
        // Cutoff multiplier which adjusts the amount the wave position can move
        _lpFilterCutoff = p['s'] * p['s'] * p['s'] * .1,
        // Speed of the low-pass cutoff multiplier
        _lpFilterDeltaCutoff = 1 + p['t'] * .0001,
        // If the low pass filter is active
        _lpFilterOn = p['s'] != 1,
        // masterVolume * masterVolume (for quick calculations)
        _masterVolume = p['x'] * p['x'],
        // Minimum frequency before stopping
        _minFreqency = p['g'],
        // If the phaser is active
        _phaser = p['q'] || p['r'],
        // Change in phase offset
        _phaserDeltaOffset = p['r'] * p['r'] * p['r'] * .2,
        // Phase offset for phaser effect
        _phaserOffset = p['q'] * p['q'] * (p['q'] < 0 ? -1020 : 1020),
        // Once the time reaches this limit, some of the    iables are reset
        _repeatLimit = p['p'] ? ((1 - p['p']) * (1 - p['p']) * 20000 | 0) + 32 : 0,
        // The punch factor (louder at begining of sustain)
        _sustainPunch = p['d'],
        // Amount to change the period of the wave by at the peak of the vibrato wave
        _vibratoAmplitude = p['j'] / 2,
        // Speed at which the vibrato phase moves
        _vibratoSpeed = p['k'] * p['k'] * .01,
        // The type of wave to generate
        _waveType = p['a'];

    var _envelopeLength      = _envelopeLength0,     // Length of the current envelope stage
        _envelopeOverLength0 = 1 / _envelopeLength0, // (for quick calculations)
        _envelopeOverLength1 = 1 / _envelopeLength1, // (for quick calculations)
        _envelopeOverLength2 = 1 / _envelopeLength2; // (for quick calculations)

    // Damping muliplier which restricts how fast the wave position can move
    var _lpFilterDamping = 5 / (1 + p['u'] * p['u'] * 20) * (.01 + _lpFilterCutoff);
    if (_lpFilterDamping > .8) {
      _lpFilterDamping = .8;
    }
    _lpFilterDamping = 1 - _lpFilterDamping;

    var _finished = false,     // If the sound has finished
        _envelopeStage    = 0, // Current stage of the envelope (attack, sustain, decay, end)
        _envelopeTime     = 0, // Current time through current enelope stage
        _envelopeVolume   = 0, // Current volume of the envelope
        _hpFilterPos      = 0, // Adjusted wave position after high-pass filter
        _lpFilterDeltaPos = 0, // Change in low-pass wave position, as allowed by the cutoff and damping
        _lpFilterOldPos,       // Previous low-pass wave position
        _lpFilterPos      = 0, // Adjusted wave position after low-pass filter
        _periodTemp,           // Period modified by vibrato
        _phase            = 0, // Phase through the wave
        _phaserInt,            // Integer phaser offset, for bit maths
        _phaserPos        = 0, // Position through the phaser buffer
        _pos,                  // Phase expresed as a Number from 0-1, used for fast sin approx
        _repeatTime       = 0, // Counter for the repeats
        _sample,               // Sub-sample calculated 8 times per actual sample, averaged out to get the super sample
        _superSample,          // Actual sample writen to the wave
        _vibratoPhase     = 0; // Phase through the vibrato sine wave

    // Buffer of wave values used to create the out of phase second wave
    var _phaserBuffer = new Array(1024),
        // Buffer of random values used to generate noise
        _noiseBuffer  = new Array(32);
    for (var i = _phaserBuffer.length; i--; ) {
      _phaserBuffer[i] = 0;
    }
    for (var i = _noiseBuffer.length; i--; ) {
      _noiseBuffer[i] = Math.random() * 2 - 1;
    }

    for (var i = 0; i < length; i++) {
      if (_finished) {
        return i;
      }

      // Repeats every _repeatLimit times, partially resetting the sound parameters
      if (_repeatLimit) {
        if (++_repeatTime >= _repeatLimit) {
          _repeatTime = 0;
          this.reset();
        }
      }

      // If _changeLimit is reached, shifts the pitch
      if (_changeLimit) {
        if (++_changeTime >= _changeLimit) {
          _changeLimit = 0;
          _period *= _changeAmount;
        }
      }

      // Acccelerate and apply slide
      _slide += _deltaSlide;
      _period *= _slide;

      // Checks for frequency getting too low, and stops the sound if a minFrequency was set
      if (_period > _maxPeriod) {
        _period = _maxPeriod;
        if (_minFreqency > 0) {
          _finished = true;
        }
      }

      _periodTemp = _period;

      // Applies the vibrato effect
      if (_vibratoAmplitude > 0) {
        _vibratoPhase += _vibratoSpeed;
        _periodTemp *= 1 + Math.sin(_vibratoPhase) * _vibratoAmplitude;
      }

      _periodTemp |= 0;
      if (_periodTemp < 8) {
        _periodTemp = 8;
      }

      // Sweeps the square duty
      if (!_waveType) {
        _squareDuty += _dutySweep;
        if (_squareDuty < 0) {
          _squareDuty = 0;
        } else if (_squareDuty > .5) {
          _squareDuty = .5;
        }
      }

      // Moves through the different stages of the volume envelope
      if (++_envelopeTime > _envelopeLength) {
        _envelopeTime = 0;

        switch (++_envelopeStage)  {
          case 1:
            _envelopeLength = _envelopeLength1;
            break;
          case 2:
            _envelopeLength = _envelopeLength2;
        }
      }

      // Sets the volume based on the position in the envelope
      switch (_envelopeStage) {
        case 0:
          _envelopeVolume = _envelopeTime * _envelopeOverLength0;
          break;
        case 1:
          _envelopeVolume = 1 + (1 - _envelopeTime * _envelopeOverLength1) * 2 * _sustainPunch;
          break;
        case 2:
          _envelopeVolume = 1 - _envelopeTime * _envelopeOverLength2;
          break;
        case 3:
          _envelopeVolume = 0;
          _finished = true;
      }

      // Moves the phaser offset
      if (_phaser) {
        _phaserOffset += _phaserDeltaOffset;
        _phaserInt = _phaserOffset | 0;
        if (_phaserInt < 0) {
          _phaserInt = -_phaserInt;
        } else if (_phaserInt > 1023) {
          _phaserInt = 1023;
        }
      }

      // Moves the high-pass filter cutoff
      if (_filters && _hpFilterDeltaCutoff) {
        _hpFilterCutoff *= _hpFilterDeltaCutoff;
        if (_hpFilterCutoff < .00001) {
          _hpFilterCutoff = .00001;
        } else if (_hpFilterCutoff > .1) {
          _hpFilterCutoff = .1;
        }
      }

      _superSample = 0;
      for (var j = 8; j--; ) {
        // Cycles through the period
        _phase++;
        if (_phase >= _periodTemp) {
          _phase %= _periodTemp;

          // Generates new random noise for this period
          if (_waveType == 3) {
            for (var n = _noiseBuffer.length; n--; ) {
              _noiseBuffer[n] = Math.random() * 2 - 1;
            }
          }
        }

        // Gets the sample from the oscillator
        switch (_waveType) {
          case 0: // Square wave
            _sample = ((_phase / _periodTemp) < _squareDuty) ? .5 : -.5;
            break;
          case 1: // Saw wave
            _sample = 1 - _phase / _periodTemp * 2;
            break;
          case 2: // Sine wave (fast and accurate approx)
            _pos = _phase / _periodTemp;
            _pos = (_pos > .5 ? _pos - 1 : _pos) * 6.28318531;
            _sample = 1.27323954 * _pos + .405284735 * _pos * _pos * (_pos < 0 ? 1 : -1);
            _sample = .225 * ((_sample < 0 ? -1 : 1) * _sample * _sample  - _sample) + _sample;
            break;
          case 3: // Noise
            _sample = _noiseBuffer[Math.abs(_phase * 32 / _periodTemp | 0)];
        }

        // Applies the low and high pass filters
        if (_filters) {
          _lpFilterOldPos = _lpFilterPos;
          _lpFilterCutoff *= _lpFilterDeltaCutoff;
          if (_lpFilterCutoff < 0) {
            _lpFilterCutoff = 0;
          } else if (_lpFilterCutoff > .1) {
            _lpFilterCutoff = .1;
          }

          if (_lpFilterOn) {
            _lpFilterDeltaPos += (_sample - _lpFilterPos) * _lpFilterCutoff;
            _lpFilterDeltaPos *= _lpFilterDamping;
          } else {
            _lpFilterPos = _sample;
            _lpFilterDeltaPos = 0;
          }

          _lpFilterPos += _lpFilterDeltaPos;

          _hpFilterPos += _lpFilterPos - _lpFilterOldPos;
          _hpFilterPos *= 1 - _hpFilterCutoff;
          _sample = _hpFilterPos;
        }

        // Applies the phaser effect
        if (_phaser) {
          _phaserBuffer[_phaserPos % 1024] = _sample;
          _sample += _phaserBuffer[(_phaserPos - _phaserInt + 1024) % 1024];
          _phaserPos++;
        }

        _superSample += _sample;
      }

      // Averages out the super samples and applies volumes
      _superSample *= .125 * _envelopeVolume * _masterVolume;

      // Clipping if too loud
      buffer[i] = _superSample >= 1 ? 32767 : _superSample <= -1 ? -32768 : _superSample * 32767 | 0;
    }

    return length;
  }
}

// Adapted from http://codebase.es/riffwave/
var synth = new SfxrSynth();
// Export for the Closure Compiler
window['jsfxr'] = function(settings) {
  // Initialize SfxrParams
  synth._params.setSettings(settings);
  // Synthesize Wave
  var envelopeFullLength = synth.totalReset();
  var data = new Uint8Array(((envelopeFullLength + 1) / 2 | 0) * 4 + 44);
  var used = synth.synthWave(new Uint16Array(data.buffer, 44), envelopeFullLength) * 2;
  var dv = new Uint32Array(data.buffer, 0, 44);
  // Initialize header
  dv[0] = 0x46464952; // "RIFF"
  dv[1] = used + 36;  // put total size here
  dv[2] = 0x45564157; // "WAVE"
  dv[3] = 0x20746D66; // "fmt "
  dv[4] = 0x00000010; // size of the following
  dv[5] = 0x00010001; // Mono: 1 channel, PCM format
  dv[6] = 0x0000AC44; // 44,100 samples per second
  dv[7] = 0x00015888; // byte rate: two bytes per sample
  dv[8] = 0x00100002; // 16 bits per sample, aligned on every two bytes
  dv[9] = 0x61746164; // "data"
  dv[10] = used;      // put number of samples here

  // Base64 encoding written by me, @maettig
  used += 44;
  var i = 0,
      base64Characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
      output = 'data:audio/wav;base64,';
  for (; i < used; i += 3)
  {
    var a = data[i] << 16 | data[i + 1] << 8 | data[i + 2];
    output += base64Characters[a >> 18] + base64Characters[a >> 12 & 63] + base64Characters[a >> 6 & 63] + base64Characters[a & 63];
  }
  return output;
}

function Soundz(){
    var jump = [0,,0.1539,,0.25,0.18,,0.2573,0.02,,,-0.04,,0.4471,,,,,1,,,0.1972,,0.5];
    var endlevel = [2,0.13,0.25,0.0537,0.6544,0.31,0.08,,,0.0005,-0.6473,0.54,0.08,-0.4693,0.0397,-0.5448,0.56,-0.38,0.35,0.0428,0.46,0.34,,0.5];
    // maybe dead?
    var dead = [3,0.1086,0.01,0.0738,0.9284,0.5,,0.0283,-0.5185,0.0267,0.0891,0.5533,-0.9053,,0.9468,,0.605,0.8053,0.9996,0.0242,,0.0475,0.1965,0.5];
    //1,0.0048,0.01,0.1247,0.7185,0.974,,,-0.3935,0.0005,,0.2886,0.2022,0.3354,0.0512,0.4204,0.1494,-0.047,0.9991,-0.0005,,0.0001,0.0008,0.5

    // another dead?
    //3,0.3602,0.7495,0.0077,0.408,0.0858,,0.0007,,,,,,0.84,0.3299,0.5809,0.0002,0.001,0.4835,0.5902,0.7098,0.0226,-0.0007,0.5
    var pressSwitch = [0,,0.0611,0.5871,0.3333,0.8637,,,,,,0.5184,0.6157,,,,,,1,,,,,0.5];

    function createSound(url){
        var snd = new Audio();
        snd.src = jsfxr(url);
        return snd;
    }
    
    var soundEffects = {
        jump : createSound(jump),
        dead : createSound(dead),
        endlevel : createSound(endlevel),
        pressSwitch : createSound(pressSwitch)
    };

    return {
        play : function(snd){
            var fx = soundEffects[snd];
            if(Game.soundOn && fx){
                fx.play();
            }
        }
    }
}