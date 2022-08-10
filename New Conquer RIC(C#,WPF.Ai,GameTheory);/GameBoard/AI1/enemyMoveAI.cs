using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Windows.Threading;
using System.Collections;
using Community;
using GameBoard;
namespace GameBoard
{
    public partial  class MainWindow : Page
    {
        public void enemyMoveAI()
        {

           // MessageBox.Show("Hello");
            //  Random rng = new Random();
            // int deltaRow = 1 - rng.Next(0, 3); //Can generate 0, 1, or 2. If 0 generated, 1 - 0 = 1, move down 1. If 1, 1 - 1 = 0, no vertical change. If 2, 1 - 2 = -1, move up 1.
            // int deltaCol = 1 - rng.Next(0, 3); //Similar to the deltaRow rng usage, but controls horizontal movement. If deltaRow & deltaCol both != 0, diagonal movement.
            // moveCharacter(row, col, row + deltaRow, col + deltaCol); 
            
            targetAndMoveToHero();
           
            //targetAndMoveToHero();

          //  moveOptions(boardspaces[row, col].tileCharacter.speed, row, col);

            //DOESN'T WORK:

            //System.Collections.ArrayList movementOptions = new System.Collections.ArrayList();
            //int numMovementOptions = 0;
            //for(int r = 0; r < numRows; r++)
            //{
            //    for(int c = 0; c < numCols; c++)
            //    {
            //        if (boardspaces[r, c].isMoveOption)
            //        {
            //            position[r, c] = boardspaces[r, c];
            //            movementOptions.Add(boardspaces[r, c]);
            //            numMovementOptions++;
            //        }
            //    }
            //}

            //Random rng = new Random();
            //int option = rng.Next(0, numMovementOptions);

            //selectedHeroRow = row;
            //selectedHeroCol = col;

            //int newRow = (movementOptions[option] as Tile).Row;
            //int newCol = (movementOptions[option] as Tile).Col;
            //boardspaces[row, col].tileCharacter.hasMoved = false;
            //MoveOption_Click(boardspaces[newRow, newCol], null);
        }
    }
}
