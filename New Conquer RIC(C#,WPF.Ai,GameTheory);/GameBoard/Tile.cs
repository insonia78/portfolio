using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Community;

namespace GameBoard
{
    /*
     * Represents an individual space in a board of tiles, able to contain characters, has terrain values, contains a terrain object.
     */
    public partial class Tile : System.Windows.Controls.Button
    {
        //instance variables
        private int row;
        private int col;
        private bool canMoveTo; //is only true when calculating/displaying a player's move options
        private int numAttackOption; //is used to differentiate between different groups of tiles a character can cause an area of damage to. 0 = false, any other number is a group of tiles for an attack option
        private bool isSolid; //Used to set whether or not characters can be moved onto the tile
        private readonly int terrainType;  //0 for field, 1 for mountain, 2 for water, ...
        private int speedToMoveThrough; //The amount of speed "points" that a character must "use" by passing onto the tile
        private readonly Terrain tileTerrain_obj;
        private Character aCharacter;

        //accessors/mutators

        public bool isUnpassable
        {
            get
            {
                return isSolid;
            }
            set 
            {
                isSolid = value;
            }
        }

        public Terrain terrainImage
        {
            get
            {
                return tileTerrain_obj;
            }
            set { }
        }

        public int tileTerrain
        {
            get
            {
                return terrainType;
            }
            set { }
        }

        public int requiredMoveSpeed
        {
            get
            {
                return speedToMoveThrough;
            }
            set 
            {
                speedToMoveThrough = value;
            }
        }

        public Character tileCharacter
        {
            get
            {
                return aCharacter;
            }
            set
            {
                aCharacter = value;
            }
        }
        public bool isMoveOption
        {
            get
            {
                return canMoveTo;
            }
            set
            {
                canMoveTo = value;
            }
        }

        public int attackOption
        {
            get
            {
                return numAttackOption;
            }
            set
            {
                numAttackOption = value;
            }
        }

        public virtual int Col
        {
            get { return col; }
            set { col = value; }
        }
        public virtual int Row
        {
            get { return row; }
            set { row = value; }
        }

        //Constructors
        /*
         * Makes a "blank" tile, default is grass, no character on it. Initializes canMoveTo  to false, is only true when calculating/displaying a player's move options
         * Does not add a character, sets to null
         */
        public Tile(int r, int c)
        {
            row = r;
            col = c;
            canMoveTo = false;
            terrainType = 0;
            tileTerrain_obj = new Terrain(terrainType);
            speedToMoveThrough = 1;
            aCharacter = null;
            isSolid = false;
            numAttackOption = 0;
        }

        /*
         * Makes a tile with the terrain that corresponds to the input type.  Initializes canMoveTo  to false, is only true when calculating/displaying a player's move options
         * Does not add a character, sets to null
         * 
         * int terrain = the number corresponding to the desired type of terrain. 0 for grass, 1 for mountain, 2 for water, 3 for swamp.
         */
        public Tile(int r, int c, int terrain)
        {
            row = r;
            col = c;
            canMoveTo = false;
            terrainType = terrain;
            tileTerrain_obj = new Terrain(terrain);
            aCharacter = null;
            numAttackOption = 0;

            if (terrain == 1 || terrain == 2) //will probably be changed later depending on actual tiles/tile file format system used later.
                isSolid = true;
            else
                isSolid = false;

            if (terrain == 3) //will probably be changed later
                speedToMoveThrough = 2;
            else
                speedToMoveThrough = 1;
        }

        /*
         * Checks if the tile contains a character by seeing if aCharacter is null or not.
         * 
         * returns true if there's a character in the tile, false if it's null.
         */
        public bool containsCharacter()
        {
            if (aCharacter == null)
                return false;
            else
                return true;
        }

    }
}
