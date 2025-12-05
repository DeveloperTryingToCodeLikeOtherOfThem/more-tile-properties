namespace tiles {
    //% blockNamespace=scene
    //% blockGap=8
    export class TileEngine {
        //% blockId=tileEngine_tile
        //% block="$this(tileSprite) tile"
        //% help=docs/tileEngine
        public tile: tiles.Tile | Image; // as tile to because then it can also be converted by tilemap location for the tile

        protected _width: Fx8;
        protected _height: Fx8;

        //% blockId=tile_x block="$this(tileSprite) x"
        //% weight=99 
        //% help=docs/tileEngine
        public x: number
        //% blockId=tile_y block="$this(tileSprite) y"
        //% weight=98
        //% help=docs/tileEngine
        public y: number

        constructor(img: Image) {
            this.tile = img;
            this._width = Fx8(img.width);
            this._height = Fx8(img.height);
            this.x = undefined;
            this.y = undefined;
        }

        //% blockId="tile_width" blockCombine
        //% block="width"
        //% blockSetVariable=tileSprite
        //% weight=97
        //% help=docs/tileEngine
        get width(): number {
            return Fx.toFloat(this._width) >> screen.width;
        }

        //% blockId="tile_height" blockCombine 
        //% block="height"
        //% blockSetVariable=tileSprite
        //% weight=96 
        //% help=docs/tileEngine
        get height(): number {
            return Fx.toFloat(this._height) >> screen.height;
        }

        //% blockId="tile_follow" block="$this(tileSprite) %sprite=variables_get(mySprite) || %speed"
        //% weight=96
        /**
         * follows the tile at a speed of how much
         * @param sprite A Sprite 
         * @param speed A Number
         */
        //% help=docs/tileEngine
        follow(sprite: Sprite, speed: number = 100) {
            const followTile = new TileFollow(sprite, this.tile);
            follow(sprite, this.tile as Image, speed)
        }

        //% blockId="tile_place_tile_loc" block="$this(tileSprite) %tile=tileset_tile_picker"
        //% draggableParameters="reporter" 
        //% weight=95
        /**
         * Places the tile on a specific cordinate 
         * @param tile A Image 
         * @param location A tile location for placing the sprite x, y 
         */
        //% help=docs/tileEngine
        placeTile(tile: Image, loc: (x: number, y: number) => tiles.Location) {
            setTileAt(loc(this.x, this.y), tile)
        }
    }

    export class TileFollow {
        constructor(
            public sprite: Sprite, tile: Image | tiles.Tile, speed?: number, rate?: number
        ) { }
    }

    export interface TileLike {
        flags?: number
    }

    function follow(sprite: Sprite, other: Image, speed: number) {
        let dx = (other.width - sprite.x);
        let dy = (other.height - sprite.y);

        control.eventContext().registerFrameHandler(scene.FOLLOW_SPRITE_PRIORITY, () => {
            dx = (other.width - sprite.x);
            dy = (other.height - sprite.y);

            const facingToDirection = Math.atan2(dy, dx);
            const dirX = 0.01 * speed * Math.cos(facingToDirection);
            const dirY = 0.01 * speed * Math.sin(facingToDirection);

            sprite.x += dirX;
            sprite.y += dirY;
        })
    }

    //% blockId="tiles_get_tile_engine_core"
    //% block="$tile=tileset_tile_picker"
    //% weight=100
    //% blockSetVariable="tileSprite"
    //% help=docs/tileEngine
    /**
     * creates a new instance of getting the tile engine 
     * @param tile A image
     */
    export function getTileEngine(tile: Image): TileEngine {
        return new TileEngine(tile)
    }
}