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

namespace GameBoard
{
    public partial class MainWindow : Page
    {
        int positionRow;
        int positionCol;
        ArrayList rowMinus = new ArrayList();
        ArrayList rowPlus = new ArrayList();
        ArrayList colMinus = new ArrayList();
        ArrayList colPlus = new ArrayList();
        int tempRowMinus = 0;
        int tempRowPlus = 0;
        int tempRow;
        int tempCol;

        public void PlotRoot(int type)
        {
            bool acontinue = false;
            int row = selectedCharacterRow; tempRow = positionRow = selectedCharacterRow;
            int col = selectedCharacterCol; tempCol = positionCol = selectedCharacterCol;
            rowPlot.Add(tempRow);
            colPlot.Add(tempCol);
            /// <summary>
            /// /case 0 with constant row and destintaion col > than character col
            /// </summary>
            /// public void positioCol_LessThenEqualTo_moveToCol() 
            do
            {
                if (tempRow == moveToRow)
                {
                    if (tempCol <= moveToCol)
                    {
                        while (tempCol != moveToCol && tempRow == moveToRow)
                        {

                            ++tempCol;

                            if (boardspaces[tempRow, tempCol].isMoveOption == false)
                            {

                                tempRowMinus++;

                                if (boardspaces[tempRow - 1, tempCol].isMoveOption == false)
                                {
                                    tempRowMinus++;
                                    if (boardspaces[tempRow - 1, tempCol - 1].isMoveOption == false)
                                    {
                                        tempRowMinus++;

                                        if (boardspaces[tempRow - 1, tempCol - 2].isMoveOption == false)
                                        {
                                            tempRowMinus++;
                                            //special case
                                        }
                                        else
                                        {
                                            colMinus.Add(tempCol -= 2);
                                            rowMinus.Add(tempRow -= 1);
                                            break;

                                        }
                                    }
                                    else
                                    {
                                        colMinus.Add(tempCol -= 1);
                                        rowMinus.Add(tempRow -= 1);
                                        break;

                                    }
                                }
                                else
                                {
                                    colMinus.Add(tempCol);
                                    rowMinus.Add(tempRow -= 1);
                                    break;

                                }


                            }
                            else
                            {
                                colMinus.Add(tempCol);
                                rowMinus.Add(tempRow);
                            }
                        }
                        tempRow = positionRow;
                        tempCol = positionCol;
                        while (tempCol != moveToCol && tempRow == moveToRow)
                        {

                            ++tempCol;



                            if (boardspaces[tempRow, tempCol].isMoveOption == false)
                            {

                                tempRowPlus++;

                                if (boardspaces[tempRow + 1, tempCol].isMoveOption == false)
                                {
                                    tempRowPlus++;
                                    if (boardspaces[tempRow + 1, tempCol - 1].isMoveOption == false)
                                    {
                                        tempRowPlus++;

                                        if (boardspaces[tempRow + 1, tempCol - 2].isMoveOption == false)
                                        {
                                            tempRowPlus++;
                                            //special case
                                        }
                                        else
                                        {
                                            colPlus.Add(tempCol -= 2);
                                            rowPlus.Add(tempRow += 1);
                                            break;

                                        }
                                    }
                                    else
                                    {
                                        colPlus.Add(tempCol -= 1);
                                        rowPlus.Add(tempRow += 1);
                                        break;

                                    }
                                }
                                else
                                {
                                    colPlus.Add(tempCol);
                                    rowPlus.Add(tempRow += 1);
                                    break;


                                }


                            }
                            else
                            {
                                colPlus.Add(tempCol);
                                rowPlus.Add(tempRow);
                            }
                        }



                        if (tempRowPlus > tempRowMinus)
                        {
                            if (tempRowMinus == 0)
                            {
                                Store(rowPlus, colPlus);
                            }
                            else
                            {
                                Store(rowMinus, colMinus);
                            }
                        }
                        else if (tempRowPlus < tempRowMinus)
                        {
                            if (tempRowPlus == 0)
                            {
                                Store(rowMinus, colMinus);
                            }
                            else
                            {
                                Store(rowPlus, colPlus);
                            }

                        }
                        else
                        {
                            if (tempRowPlus == 4)
                            {
                            }
                            else
                            {
                                Store(rowPlus, colPlus);
                            }

                        }




                        if (tempCol == moveToCol && tempRow == moveToRow)
                        {


                            ClearArrayList();
                        }
                        if (tempCol != moveToCol && tempRow != moveToRow)
                        {

                            rowPlot.Add(tempRow);
                            colPlot.Add(tempCol);
                            ClearArrayList();
                        }
                        if (tempCol == moveToCol && tempRow != moveToRow)
                        {

                            rowPlot.Add(tempRow);
                            colPlot.Add(tempCol);
                            ClearArrayList();
                        }
                        if (tempCol != moveToCol && tempRow == moveToRow)
                        {

                            rowPlot.Add(tempRow);
                            colPlot.Add(tempCol);
                            ClearArrayList();
                        }

                    }// end of the (selectedCharacterCol <= moveToCol)
                    if (tempCol > moveToCol)
                    {
                        while (tempCol != moveToCol && tempRow == moveToRow)
                        {

                            --tempCol;
                            if (boardspaces[tempRow, tempCol].isMoveOption == false)
                            {

                                tempRowMinus++;

                                if (boardspaces[tempRow - 1, tempCol].isMoveOption == false)
                                {
                                    tempRowMinus++;
                                    if (boardspaces[tempRow - 1, tempCol + 1].isMoveOption == false)
                                    {
                                        tempRowMinus++;

                                        if (boardspaces[tempRow - 1, tempCol + 2].isMoveOption == false)
                                        {
                                            tempRowMinus++;
                                            //special case
                                        }
                                        else
                                        {
                                            colMinus.Add(tempCol += 2);
                                            rowMinus.Add(tempRow -= 1);
                                            break;
                                        }
                                            
                                    }
                                    else
                                    {
                                        colMinus.Add(tempCol += 1);
                                        rowMinus.Add(tempRow -= 1);
                                        break;
                                    }
                                }
                                else
                                {
                                    colMinus.Add(tempCol);
                                    rowMinus.Add(tempRow -= 1);
                                    break;
                                }

                            }
                            else
                            {
                                colMinus.Add(tempCol);
                                rowMinus.Add(tempRow);
                            }
                        }
                        tempRow = positionRow;
                        tempCol = positionCol;
                        while (tempCol != moveToCol && tempRow == moveToRow)
                        {

                            --tempCol;



                            if (boardspaces[tempRow, tempCol].isMoveOption == false)
                            {

                                tempRowPlus++;

                                if (boardspaces[tempRow + 1, tempCol].isMoveOption == false)
                                {
                                    tempRowPlus++;
                                    if (boardspaces[tempRow + 1, tempCol + 1].isMoveOption == false)
                                    {
                                        tempRowPlus++;

                                        if (boardspaces[tempRow + 1, tempCol + 2].isMoveOption == false)
                                        {
                                            tempRowPlus++;
                                            //special case
                                        }
                                        else
                                        {
                                            colPlus.Add(tempCol += 2);
                                            rowPlus.Add(tempRow += 1);
                                            break;

                                        }
                                    }
                                    else
                                    {
                                        colPlus.Add(tempCol += 1);
                                        rowPlus.Add(tempRow += 1);
                                        break;

                                    }
                                }
                                else
                                {
                                    colPlus.Add(tempCol);
                                    rowPlus.Add(tempRow += 1);
                                    break;


                                }


                            }
                            else
                            {
                                colPlus.Add(tempCol);
                                rowPlus.Add(tempRow);
                            }
                        }
                        if (tempRowPlus > tempRowMinus)
                        {
                            if (tempRowMinus == 0)
                            {
                                Store(rowPlus, colPlus);
                            }
                            else
                            {
                                Store(rowMinus, colMinus);
                            }
                        }
                        else if (tempRowPlus < tempRowMinus)
                        {
                            if (tempRowPlus == 0)
                            {
                                Store(rowMinus, colMinus);
                            }
                            else
                            {
                                Store(rowPlus, colPlus);
                            }

                        }
                        else
                        {
                            if (tempRowPlus == 4)
                            {
                            }
                            else
                            {
                                Store(rowPlus, colPlus);
                            }

                        }





                        if (tempCol == moveToCol && tempRow == moveToRow)
                        {


                            ClearArrayList();
                        }
                        if (tempCol != moveToCol && tempRow != moveToRow)
                        {

                            rowPlot.Add(tempRow);
                            colPlot.Add(tempCol);
                            ClearArrayList();
                        }
                        if (tempCol == moveToCol && tempRow != moveToRow)
                        {

                            rowPlot.Add(tempRow);
                            colPlot.Add(tempCol);
                            ClearArrayList();
                        }
                        if (tempCol != moveToCol && tempRow == moveToRow)
                        {

                            rowPlot.Add(tempRow);
                            colPlot.Add(tempCol);
                            ClearArrayList();
                        }

                    } // selectedCharacterCol > moveToCol

                }// end of selectedCharacterRow == moveToRow
                else if (tempCol == moveToCol)
                {
                    if (tempRow <= moveToRow)
                    {
                        while (tempCol == moveToCol && tempRow != moveToRow)
                        {

                            ++tempRow;
                            if (boardspaces[tempRow, tempCol].isMoveOption == false)
                            {

                                tempRowMinus++;

                                if (boardspaces[tempRow, tempCol - 1].isMoveOption == false)
                                {
                                    tempRowMinus++;
                                    if (boardspaces[tempRow - 1, tempCol - 1].isMoveOption == false)
                                    {
                                        tempRowMinus++;

                                        if (boardspaces[tempRow - 2, tempCol - 1].isMoveOption == false)
                                        {
                                            tempRowMinus++;
                                        }
                                        else
                                        {
                                            colMinus.Add(tempCol -= 1);
                                            rowMinus.Add(tempRow -= 2);
                                            break;     
                                        }
                                    }
                                    else
                                    {
                                        colMinus.Add(tempCol -= 1);
                                        rowMinus.Add(tempRow -= 1);
                                        break;
                                    }
                                }
                                else
                                {
                                    colMinus.Add(tempCol -= 1);
                                    rowMinus.Add(tempRow);
                                    break;
                                }

                            }
                            else
                            {
                                colMinus.Add(tempCol);
                                rowMinus.Add(tempRow);
                            }
                        }
                        tempRow = positionRow;
                        tempCol = positionCol;
                        while (tempCol == moveToCol && tempRow != moveToRow)
                        {

                            ++tempRow;
                            if (boardspaces[tempRow, tempCol].isMoveOption == false)
                            {

                                tempRowPlus++;

                                if (boardspaces[tempRow, tempCol + 1].isMoveOption == false)
                                {
                                    tempRowPlus++;
                                    if (boardspaces[tempRow - 1, tempCol + 1].isMoveOption == false)
                                    {
                                        tempRowPlus++;

                                        if (boardspaces[tempRow - 2, tempCol + 1].isMoveOption == false)
                                        {
                                            tempRowPlus++;
                                            //special case
                                        }
                                        else
                                        {
                                            colPlus.Add(tempCol += 1);
                                            rowPlus.Add(tempRow -= 2);
                                            break;
                                        }
                                    }
                                    else
                                    {
                                        colPlus.Add(tempCol += 1);
                                        rowPlus.Add(tempRow -= 1);
                                        break;
                                    }
                                }
                                else
                                {
                                    colPlus.Add(tempCol += 1);
                                    rowPlus.Add(tempRow);
                                    break;
                                }

                            }
                            else
                            {
                                colPlus.Add(tempCol);
                                rowPlus.Add(tempRow);
                            }
                        }
                        if (tempRowPlus > tempRowMinus)
                        {
                            if (tempRowMinus == 0)
                            {
                                Store(rowPlus, colPlus);
                            }
                            else
                            {
                                Store(rowMinus, colMinus);
                            }
                        }
                        else if (tempRowPlus < tempRowMinus)
                        {
                            if (tempRowPlus == 0)
                            {
                                Store(rowMinus, colMinus);
                            }
                            else
                            {
                                Store(rowPlus,colPlus);
                            }

                        }
                        else
                        {
                            if (tempRowPlus == 4)
                            {
                            }
                            else
                            {
                                Store(rowPlus, colPlus);
                            }

                        }



                        if (tempCol == moveToCol && tempRow == moveToRow)
                        {


                            ClearArrayList();
                        }
                        if (tempCol != moveToCol && tempRow != moveToRow)
                        {

                            rowPlot.Add(tempRow);
                            colPlot.Add(tempCol);
                            ClearArrayList();
                        }
                        if (tempCol == moveToCol && tempRow != moveToRow)
                        {

                            rowPlot.Add(tempRow);
                            colPlot.Add(tempCol);
                            ClearArrayList();
                        }
                        if (tempCol != moveToCol && tempRow == moveToRow)
                        {

                            rowPlot.Add(tempRow);
                            colPlot.Add(tempCol);
                            ClearArrayList();
                        }
                    }//end of selectedCharacterRow < moveToRow)
                    if (tempRow > moveToRow)
                    {
                        while (tempCol == moveToCol && tempRow != moveToRow)
                        {

                            --tempRow;
                            if (boardspaces[tempRow, tempCol].isMoveOption == false)
                            {
                                tempRowMinus++;

                                if (boardspaces[tempRow, (tempCol - 1)].isMoveOption == false)
                                {
                                    tempRowMinus++;
                                        if (boardspaces[tempRow + 1, (tempCol - 1)].isMoveOption == false)
                                        {
                                            tempRowMinus++;
                                            if (boardspaces[tempRow + 2, (tempCol - 1)].isMoveOption == false)
                                            {
                                                //special case
                                            }
                                            else
                                            {
                                                rowMinus.Add(tempRow += 2);
                                                colMinus.Add(tempCol -= 1);
                                                break;
                                            }

                                        }
                                        else
                                        {
                                            rowMinus.Add(tempRow += 1);
                                            colMinus.Add(tempCol -= 1);
                                            break;
                                        }
                                    }
                                    else
                                    {
                                        rowMinus.Add(tempRow);
                                        colMinus.Add(tempCol -= 1);
                                        break;
                                    }
                                
                            }
                            else
                            {
                                rowMinus.Add(tempRow);
                                colMinus.Add(tempCol);
                            }

                        }






                        tempRow = positionRow;
                        tempCol = positionCol;
                        while (tempCol == moveToCol && tempRow != moveToRow)
                        {

                            --tempRow;
                            if (boardspaces[tempRow, tempCol].isMoveOption == false)
                            {

                                tempRowPlus++;

                                if (boardspaces[tempRow, tempCol + 1].isMoveOption == false)
                                {
                                    tempRowPlus++;
                                    if (boardspaces[tempRow + 1, tempCol + 1].isMoveOption == false)
                                    {
                                        tempRowPlus++;

                                        if (boardspaces[tempRow + 2, tempCol + 1].isMoveOption == false)
                                        {
                                            tempRowPlus++;
                                            //special case
                                        }
                                        else
                                        {
                                            colPlus.Add(tempCol += 1);
                                            rowPlus.Add(tempRow += 2);
                                            break;
                                        }
                                    }
                                    else
                                    {
                                        colPlus.Add(tempCol += 1);
                                        rowPlus.Add(tempRow += 1);
                                        break;
                                    }
                                }
                                else
                                {
                                    colPlus.Add(tempCol += 1);
                                    rowPlus.Add(tempRow);
                                    break;
                                }

                            }
                            else
                            {
                                colPlus.Add(tempCol);
                                rowPlus.Add(tempRow);
                            }
                        }
                        if (tempRowPlus > tempRowMinus)
                        {
                            if (tempRowMinus == 0)
                            {
                                Store(rowPlus, colPlus);
                            }
                            else
                            {
                                Store(rowMinus, colMinus);
                            }
                        }
                        else if (tempRowPlus < tempRowMinus)
                        {
                            if (tempRowPlus == 0)
                            {
                                Store(rowMinus, colMinus);
                            }
                            else
                            {
                                Store(rowPlus, colPlus);
                            }

                        }
                        else
                        {
                            if (tempRowPlus == 4)
                            {
                            }
                            else
                            {
                                Store(rowPlus, colPlus);
                            }

                        }




                        if (tempCol == moveToCol && tempRow == moveToRow)
                        {


                            ClearArrayList();
                        }
                        if (tempCol != moveToCol && tempRow != moveToRow)
                        {

                            rowPlot.Add(tempRow);
                            colPlot.Add(tempCol);
                            ClearArrayList();
                        }
                        if (tempCol == moveToCol && tempRow != moveToRow)
                        {

                            rowPlot.Add(tempRow);
                            colPlot.Add(tempCol);
                            ClearArrayList();
                        }
                        if (tempCol != moveToCol && tempRow == moveToRow)
                        {

                            rowPlot.Add(tempRow);
                            colPlot.Add(tempCol);
                            ClearArrayList();
                        }
                    }// end of selectedCharacterRow > moveToRow)

                }//endof selectedCharacterCol == moveToCol
                else if (tempCol < moveToCol && tempRow < moveToRow)
                {
                    while (tempCol != moveToCol && tempRow != moveToRow)
                    {

                        ++tempRow;
                        ++tempCol;
                        if (boardspaces[tempRow, tempCol].isMoveOption == false)
                        {
                            tempRowMinus++;

                            if (boardspaces[tempRow - 1, tempCol].isMoveOption == false)
                            {
                                tempRowMinus++;
                                if (boardspaces[tempRow - 2, tempCol].isMoveOption == false)
                                {
                                    tempRowMinus += 2;
                                }
                                else
                                {
                                    colMinus.Add(tempCol);
                                    rowMinus.Add(tempRow -= 2);
                                }
                            }
                            else
                            {
                                colMinus.Add(tempCol);
                                rowMinus.Add(tempRow -= 1);
                                break;
                            }

                        }
                        else
                        {
                            colMinus.Add(tempCol);
                            rowMinus.Add(tempRow);
                        }
                    }

                    tempRow = positionRow;
                    tempCol = positionCol;
                    while (tempCol != moveToCol && tempRow != moveToRow)
                    {

                        ++tempRow;
                        ++tempCol;


                        if (boardspaces[tempRow, tempCol].isMoveOption == false)
                        {
                            tempRowPlus++;

                            if (boardspaces[tempRow, tempCol - 1].isMoveOption == false)
                            {
                                tempRowPlus++;
                                if (boardspaces[tempRow, tempCol - 2].isMoveOption == false)
                                {
                                    tempRowPlus++;
                                    if (boardspaces[tempRow - 1, tempCol - 2].isMoveOption == false)
                                    {
                                        tempRowPlus++;
                                    }
                                    else
                                    {
                                        colPlus.Add(tempCol -= 2);
                                        rowPlus.Add(tempRow -= 1);
                                        break;
                                    }
                                }
                                else
                                {
                                    colMinus.Add(tempCol -= 2);
                                    rowMinus.Add(tempRow);
                                    break;
                                }
                            }
                            else
                            {
                                colPlus.Add(tempCol -= 1);
                                rowPlus.Add(tempRow);
                                break;
                            }
                        }
                        else
                        {
                            colPlus.Add(tempCol);
                            rowPlus.Add(tempRow);
                        }
                    }


                    if (tempRowPlus > tempRowMinus)
                    {
                        if (tempRowMinus == 0)
                        {
                            Store(rowPlus, colPlus);
                        }
                        else
                        {
                            Store(rowMinus, colMinus);
                        }
                    }
                    else if (tempRowPlus < tempRowMinus)
                    {
                        if (tempRowPlus == 0)
                        {
                            Store(rowMinus, colMinus);
                        }
                        else
                        {
                            Store(rowPlus, colPlus);
                        }

                    }
                    else
                    {
                        if (tempRowPlus == 4)
                        {
                        }
                        else
                        {
                            Store(rowPlus, colPlus);
                        }

                    }




                    if (tempCol == moveToCol && tempRow == moveToRow)
                    {


                        ClearArrayList();
                    }
                    if (tempCol != moveToCol && tempRow != moveToRow)
                    {

                        rowPlot.Add(tempRow);
                        colPlot.Add(tempCol);
                        ClearArrayList();
                    }
                    if (tempCol == moveToCol && tempRow != moveToRow)
                    {

                        rowPlot.Add(tempRow);
                        colPlot.Add(tempCol);
                        ClearArrayList();
                    }
                    if (tempCol != moveToCol && tempRow == moveToRow)
                    {

                        rowPlot.Add(tempRow);
                        colPlot.Add(tempCol);
                        ClearArrayList();
                    }

                }// selectedCharacterCol < moveToCol && selectedCharacterRow < moveToRow)
                else if (tempCol < moveToCol && tempRow > moveToRow)
                {
                    while (tempCol != moveToCol && tempRow != moveToRow)
                    {

                        --tempRow;
                        ++tempCol;
                        if (boardspaces[tempRow, tempCol].isMoveOption == false)
                        {
                            tempRowMinus++;

                            if (boardspaces[tempRow, tempCol - 1].isMoveOption == false)
                            {
                                tempRowMinus++;
                                if (boardspaces[tempRow, tempCol - 2].isMoveOption == false)
                                {
                                    tempRowMinus += 2;
                                }
                                else
                                {
                                    colMinus.Add(tempCol -= 2);
                                    rowMinus.Add(tempRow);
                                    break;

                                }
                            }
                            else
                            {
                                colMinus.Add(tempCol -= 1);
                                rowMinus.Add(tempRow);
                                break;
                            }

                        }
                        else
                        {
                            colMinus.Add(tempCol);
                            rowMinus.Add(tempRow);
                        }
                    } 
                    tempRow = positionRow;
                    tempCol = positionCol;
                    while (tempCol != moveToCol && tempRow != moveToRow)
                    {

                        --tempRow;
                        ++tempCol;


                        if (boardspaces[tempRow, tempCol].isMoveOption == false)
                        {
                            tempRowPlus++;

                            if (boardspaces[tempRow + 1, tempCol].isMoveOption == false)
                            {
                                tempRowPlus++;
                                if (boardspaces[tempRow + 2, tempCol].isMoveOption == false)
                                {
                                    tempRowPlus += 1;
                                    if (boardspaces[tempRow + 2, tempCol - 1].isMoveOption == false)
                                    {
                                        tempRowPlus += 1;
                                        //specialcase;
                                    }
                                    else
                                    {
                                        colPlus.Add(tempCol -= 1);
                                        rowPlus.Add(tempRow += 2);
                                        break;

                                    }
                                    
                                }
                                else
                                {
                                    colPlus.Add(tempCol);
                                    rowPlus.Add(tempRow +=2);
                                    break;

                                }
                            }
                            else
                            {
                                colPlus.Add(tempCol);
                                rowPlus.Add(tempRow +=1);
                                break;
                            }

                        }
                        else
                        {
                            colPlus.Add(tempCol);
                            rowPlus.Add(tempRow);
                        }
                    }
                    if (tempRowPlus > tempRowMinus)
                    {
                        if (tempRowMinus == 0)
                        {
                            Store(rowPlus, colPlus);
                        }
                        else
                        {
                            Store(rowMinus, colMinus);
                        }
                    }
                    else if (tempRowPlus < tempRowMinus)
                    {
                        if (tempRowPlus == 0)
                        {
                            Store(rowMinus, colMinus);
                        }
                        else
                        {
                            Store(rowPlus, colPlus);
                        }

                    }
                    else
                    {
                        if (tempRowPlus == 4)
                        {
                        }
                        else
                        {
                            Store(rowPlus, colPlus);
                        }

                    }

                    if (tempCol == moveToCol && tempRow == moveToRow)
                    {


                        ClearArrayList();
                    }
                    if (tempCol != moveToCol && tempRow != moveToRow)
                    {

                        rowPlot.Add(tempRow);
                        colPlot.Add(tempCol);
                        ClearArrayList();
                    }
                    if (tempCol == moveToCol && tempRow != moveToRow)
                    {

                        rowPlot.Add(tempRow);
                        colPlot.Add(tempCol);
                        ClearArrayList();
                    }
                    if (tempCol != moveToCol && tempRow == moveToRow)
                    {

                        rowPlot.Add(tempRow);
                        colPlot.Add(tempCol);
                        ClearArrayList();
                    }


                  


                }// end of (selectedCharacterCol < moveToCol && selectedCharacterRow > moveToRow)
                else if (tempCol > moveToCol && tempRow > moveToRow)
                {
                    while (tempCol != moveToCol && tempRow != moveToRow)
                    {

                        --tempRow;
                        --tempCol;
                        if (boardspaces[tempRow, tempCol].isMoveOption == false)
                        {
                            tempRowMinus++;

                            if (boardspaces[tempRow + 1, tempCol].isMoveOption == false)
                            {
                                tempRowMinus++;
                                if (boardspaces[tempRow + 2, tempCol].isMoveOption == false)
                                {
                                    tempRowMinus++;
                                    if (boardspaces[tempRow + 2, tempCol + 1].isMoveOption == false)
                                    {
                                        tempRowMinus ++;
                                    }
                                    else
                                    {
                                        colMinus.Add(tempCol += 1);
                                        rowMinus.Add(tempRow += 2);
                                        break;
                                    }
                                }
                                else
                                {
                                    colMinus.Add(tempCol);
                                    rowMinus.Add(tempRow += 2);
                                    break;
                                }
                            }
                            else
                            {
                                colMinus.Add(tempCol);
                                rowMinus.Add(tempRow += 1);
                                break;
                            }
                        }
                        else
                        {
                            colMinus.Add(tempCol);
                            rowMinus.Add(tempRow);
                        }
                    }
                  

                    tempRow = positionRow;
                    tempCol = positionCol;
                    while (tempCol != moveToCol && tempRow != moveToRow)
                    {

                        --tempRow;
                        --tempCol;


                        if (boardspaces[tempRow, tempCol].isMoveOption == false)
                        {
                            tempRowPlus++;

                            if (boardspaces[tempRow, tempCol + 1].isMoveOption == false)
                            {
                                tempRowPlus++;
                                if (boardspaces[tempRow, tempCol + 2].isMoveOption == false)
                                {
                                    tempRowPlus++;
                                    if (boardspaces[tempRow - 1, tempCol + 2].isMoveOption == false)
                                    {
                                        tempRowPlus++;
                                    }
                                    else
                                    {
                                        colPlus.Add(tempCol += 2);
                                        rowPlus.Add(tempRow -= 1);
                                        break;
                                    }
                                }
                                else
                                {
                                    colPlus.Add(tempCol += 2);
                                    rowPlus.Add(tempRow );
                                    break;
                                }
                            }
                            else
                            {
                                colPlus.Add(tempCol +=1);
                                rowPlus.Add(tempRow);
                                break;
                                
                            }
                        }
                        else
                        {
                            colPlus.Add(tempCol);
                            rowPlus.Add(tempRow);
                        }
                    }

                    if (tempRowPlus > tempRowMinus)
                    {
                        if (tempRowMinus == 0)
                        {
                            Store(rowPlus, colPlus);
                        }
                        else
                        {
                            Store(rowMinus, colMinus);
                        }
                    }
                    else if (tempRowPlus < tempRowMinus)
                    {
                        if (tempRowPlus == 0)
                        {
                            Store(rowMinus, colMinus);
                        }
                        else
                        {
                            Store(rowPlus, colPlus);
                        }

                    }
                    else
                    {
                        if (tempRowPlus == 4)
                        {
                        }
                        else
                        {
                            Store(rowPlus, colPlus);
                        }

                    }

                    if (tempCol == moveToCol && tempRow == moveToRow)
                    {


                        ClearArrayList();
                    }
                    if (tempCol != moveToCol && tempRow != moveToRow)
                    {

                        rowPlot.Add(tempRow);
                        colPlot.Add(tempCol);
                        ClearArrayList();
                    }
                    if (tempCol == moveToCol && tempRow != moveToRow)
                    {

                        rowPlot.Add(tempRow);
                        colPlot.Add(tempCol);
                        ClearArrayList();
                    }
                    if (tempCol != moveToCol && tempRow == moveToRow)
                    {

                        rowPlot.Add(tempRow);
                        colPlot.Add(tempCol);
                        ClearArrayList();
                    }

                    


                }// end of (selectedCharacterCol > moveToCol && selectedCharacterRow > moveToRow)
                else if (tempCol > moveToCol && tempRow < moveToRow)
                {
                    while (tempCol != moveToCol && tempRow != moveToRow)
                    {

                        ++tempRow;
                        --tempCol;
                        if (boardspaces[tempRow, tempCol].isMoveOption == false)
                        {

                            tempRowMinus++;

                            if (boardspaces[tempRow - 1, tempCol].isMoveOption == false)
                            {
                                tempRowMinus++;
                                if (boardspaces[tempRow - 2, tempCol].isMoveOption == false)
                                {
                                    tempRowMinus += 2;
                                }
                                else
                                {
                                    colMinus.Add(tempCol);
                                    rowMinus.Add(tempRow -= 2);
                                    break;
                                    
                                }
                            }
                            else
                            {
                                colMinus.Add(tempCol);
                                rowMinus.Add(tempRow -= 1);
                                break;
                            }

                        }
                        else
                        {
                            colMinus.Add(tempCol);
                            rowMinus.Add(tempRow);
                        }
                    }
                    tempRow = positionRow;
                    tempCol = positionCol;
                    while (tempCol != moveToCol && tempRow != moveToRow)
                    {

                        ++tempRow;
                        --tempCol;


                        if (boardspaces[tempRow, tempCol].isMoveOption == false)
                        {
                            tempRowPlus++;

                            if (boardspaces[tempRow, tempCol + 1].isMoveOption == false)
                            {
                                tempRowPlus++;
                                if (boardspaces[tempRow, tempCol + 2].isMoveOption == false)
                                {
                                    tempRowPlus++;
                                    if (boardspaces[tempRow - 1, tempCol + 2].isMoveOption == false)
                                    {
                                        tempRowPlus++;
                                    }
                                    else
                                    {
                                        colPlus.Add(tempCol += 2);
                                        rowPlus.Add(tempRow -= 1);
                                        break;
                                    }
                                }
                                else
                                {
                                    colPlus.Add(tempCol += 2);
                                    rowPlus.Add(tempRow);
                                    break;
                                 }
                            }
                            else
                            {
                                colPlus.Add(tempCol +=1);
                                rowPlus.Add(tempRow);
                                break;
                            }
                        }
                        else
                        {
                            colPlus.Add(tempCol);
                            rowPlus.Add(tempRow);
                        }
                    }

                    if (tempRowPlus > tempRowMinus)
                    {
                        if (tempRowMinus == 0)
                        {
                            Store(rowPlus, colPlus);
                        }
                        else
                        {
                            Store(rowMinus, colMinus);
                        }
                    }
                    else if (tempRowPlus < tempRowMinus)
                    {
                        if (tempRowPlus == 0)
                        {
                            Store(rowMinus, colMinus);
                        }
                        else
                        {
                            Store(rowPlus, colPlus);
                        }

                    }
                    else
                    {
                        if (tempRowPlus == 4)
                        {
                        }
                        else
                        {
                            Store(rowPlus, colPlus);
                        }

                    }

                    if (tempCol == moveToCol && tempRow == moveToRow)
                    {

                       
                        ClearArrayList();
                    }
                    if (tempCol != moveToCol && tempRow != moveToRow)
                    {

                        rowPlot.Add(tempRow);
                        colPlot.Add(tempCol);
                        ClearArrayList();
                    }
                    if (tempCol == moveToCol && tempRow != moveToRow)
                    {

                        rowPlot.Add(tempRow);
                        colPlot.Add(tempCol);
                        ClearArrayList();
                    }
                    if (tempCol != moveToCol && tempRow == moveToRow)
                    {

                        rowPlot.Add(tempRow);
                        colPlot.Add(tempCol);
                        ClearArrayList();
                    }




                  

                }// end of selectedCharacterCol > moveToCol && selectedCharacterRow < moveToRow)
                if(tempCol == moveToCol && tempRow == moveToRow)
                {
                    rowPlot.Add(tempRow);
                    colPlot.Add(tempCol);
                    acontinue = true;
                }
            } while (acontinue == false);// end of tempCol != moveToCol && tempRow != moveToRow)

   }// end of Plot
  public void Store(ArrayList RowArray, ArrayList ColArray)
  {
     positionRow = tempRow = (int)RowArray[RowArray.Count - 1];
     positionCol = tempCol = (int)ColArray[RowArray.Count - 1];
      for (int i = 0; i < ColArray.Count; i++)
      {
          
           rowPlot.Add((int)RowArray[i]);
           colPlot.Add((int)ColArray[i]);
      }
   }
   public void ClearArrayList()
   {
            colMinus.Clear();
            colPlus.Clear();
            rowPlus.Clear();
            rowMinus.Clear();
            tempRowMinus = 0;
            tempRowPlus = 0;
    }
  }
}











  


        
       