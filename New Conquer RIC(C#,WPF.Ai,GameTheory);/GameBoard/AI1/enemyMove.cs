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


namespace GameBoard
{
   public partial class MainWindow : Page
    {
        public void enemyMove()
        {
            int row = 0;
            int col = 0;
            bool inside = false;
            int firstrow = 0;
            int afirstcol = 0;
            int firstcol = 0;
            int[,] closestPath = new int[numRows, numCols];
            clearAttackOptions();
            moveOptions(boardspaces[selectedCharacterRow, selectedCharacterCol].tileCharacter.CurrentSpeed, selectedCharacterRow, selectedCharacterCol);
            for (int r = 0; r < numRows; r++)
            {
                for (int c = 0; c < numCols; c++)
                {

                    closestPath[r, c] = -1;
                    position[r, c] = boardspaces[r, c];
                    if (boardspaces[r, c].isMoveOption) //display buttons for the user to click to chose where to move the selected player.
                    {
                        if(inside == false)
                        {
                            firstrow = r;
                            firstcol = c;
                            inside = true;
                        }
                        if (firstcol > c)
                        {
                            afirstcol = c;
                        }
                       
                        closestPath[r, c] = (Math.Abs(r - aheroRow) + Math.Abs(c - aheroCol));
                        position[r, c] = boardspaces[r, c];
                        position[r, c].isMoveOption = true;
                        row = r;
                        col = c;
                        boardspaces[r, c].BorderBrush = moveOption;
                        boardspaces[r, c].BorderThickness = new Thickness(1);

                    }
                }
            }
            int temp = closestPath[firstrow, firstcol];
            moveToRow = firstrow;
            moveToCol = firstcol;
            for (int i = firstrow; i <= row; i++)
            {
                for (int y = afirstcol; y <= col; y++)
                {
                    if (closestPath[i, y] != -1)
                    {

                        if (temp >= closestPath[i, y])
                        {
                            temp = closestPath[i, y];
                            moveToRow = i;
                            moveToCol = y;
                        }
                        else
                        {
                            
                        }
                    }
                }
            }
            closestPath = null;
       }
    }
}
