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

namespace GameBoard
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private Board board = new Board("testmap.txt");
        SolidColorBrush grass = new SolidColorBrush(Colors.Green);
        SolidColorBrush mountain = new SolidColorBrush(Colors.Gray);
        SolidColorBrush water = new SolidColorBrush(Colors.Blue);
        SolidColorBrush swamp = new SolidColorBrush(Colors.Brown);
        SolidColorBrush black = new SolidColorBrush(Colors.Black);
        SolidColorBrush red = new SolidColorBrush(Colors.Red);
        SolidColorBrush moveOption = new SolidColorBrush(Colors.Yellow);
        private Character testChar = new Player(3);
        private int testCharRow;
        private int testCharCol;
        private int testEnemyRow;
        private int testEnemyCol;

        public MainWindow()
        {
            InitializeComponent();
            testCharRow = 2;
            testCharCol = 3;
            testEnemyRow = 11;
            testEnemyCol = 9;
            board.boardSpace(testCharRow, testCharCol).tileCharacter = new Player(4);
            board.boardSpace(testEnemyRow, testEnemyCol).tileCharacter = new Enemy();
            //board.moveOptions(board.boardSpace(testCharRow, testCharCol).tileCharacter.speed, testCharRow, testCharCol);
            render();
        }

        private void render()
        {
            Board.Children.Clear();
            for (int r = 0; r < board.numberRows; r++)
            {
                for (int c = 0; c < board.numberCols; c++)
                {
                    Grid cell = new Grid();
                    if (board.boardSpace(r, c).isMoveOption)
                    {
                        cell.Background = moveOption;
                        Button button = new Button();
                        button.Opacity = 0.0;
                        button.AddHandler(Button.ClickEvent, new RoutedEventHandler(MoveOption_Click));
                        Board.Children.Add(cell);
                        cell.Children.Add(button);
                    }
                    else
                    {
                        switch (board.boardSpace(r, c).tileTerrain)
                        {
                            case 0: //grass tile
                                cell.Background = grass;
                                Board.Children.Add(cell);
                                break;
                            case 1: //mountain tile
                                cell.Background = mountain;
                                Board.Children.Add(cell);
                                break;
                            case 2: //water tile
                                cell.Background = water;
                                Board.Children.Add(cell);
                                break;
                            case 3: //swamp tile
                                cell.Background = swamp;
                                Board.Children.Add(cell);
                                break;
                        }
                    }

                    if(board.boardSpace(r,c).containsCharacter() == true)
                    {
                        if (board.boardSpace(r, c).tileCharacter.GetType() == typeof(GameBoard.Player))
                        {
                            Ellipse circle = new Ellipse();
                            Button button = new Button();
                            circle.Fill = black;
                            button.Opacity = 0.0;
                            button.AddHandler(Button.ClickEvent, new RoutedEventHandler(Player_Click));
                            cell.Children.Add(circle);
                            cell.Children.Add(button);
                        }
                        else if(board.boardSpace(r, c).tileCharacter.GetType() == typeof(GameBoard.Enemy))
                        {
                            Ellipse circle = new Ellipse();
                            circle.Fill = red;
                            cell.Children.Add(circle);
                        }
                    }
                }
            }
        }

        //Events of test moving buttons being clicked
        private void UpButton_Click(object sender, RoutedEventArgs e)
        {
            if (testCharRow > 0 && board.boardSpace(testCharRow - 1, testCharCol).containsCharacter() == false)
            {
                board.moveCharacter(testCharRow, testCharCol, testCharRow - 1, testCharCol);
                testCharRow--;
                board.nextTurn();
                //board.moveOptions(board.boardSpace(testCharRow, testCharCol).tileCharacter.speed, testCharRow, testCharCol);
                render();
            }
        }
        private void RightButton_Click(object sender, RoutedEventArgs e)
        {
            if (testCharCol < 19 && board.boardSpace(testCharRow, testCharCol + 1).containsCharacter() == false)
            {
                board.moveCharacter(testCharRow, testCharCol, testCharRow, testCharCol + 1);
                testCharCol++;
                board.nextTurn();
                //board.moveOptions(board.boardSpace(testCharRow, testCharCol).tileCharacter.speed, testCharRow, testCharCol);
                render();
            }
        }
        private void LeftButton_Click(object sender, RoutedEventArgs e)
        {
            if (testCharCol > 0 && board.boardSpace(testCharRow, testCharCol - 1).containsCharacter() == false)            
            {
                board.moveCharacter(testCharRow, testCharCol, testCharRow, testCharCol - 1);
                testCharCol--;
                board.nextTurn();
                //board.moveOptions(board.boardSpace(testCharRow, testCharCol).tileCharacter.speed, testCharRow, testCharCol);
                render();
            }
        }
        private void DownButton_Click(object sender, RoutedEventArgs e)
        {
            if (testCharRow < 19 && board.boardSpace(testCharRow + 1, testCharCol).containsCharacter() == false)
            {
                board.moveCharacter(testCharRow, testCharCol, testCharRow + 1, testCharCol);
                testCharRow++;
                board.nextTurn();
                //board.moveOptions(board.boardSpace(testCharRow, testCharCol).tileCharacter.speed, testCharRow, testCharCol);
                render();
            }
        }

        private void Player_Click(object sender, RoutedEventArgs e)
        {
            board.moveOptions(board.boardSpace(testCharRow, testCharCol).tileCharacter.speed, testCharRow, testCharCol);
            render();
        }

        private void MoveOption_Click(object sender, RoutedEventArgs e)
        {
            board.moveCharacter(testCharRow, testCharCol, testCharRow + 1, testCharCol);
            board.nextTurn();
            render();
        }
    }
}
