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
        int countHero ;
        int countEnemy ;
        object[,] heroLocated = new object[15, 15];
        object[,] enemyLocated = new object[15, 15];
        ArrayList enemyRow = new ArrayList();
        ArrayList enemyCol = new ArrayList();
        ArrayList heroRow = new ArrayList();
        ArrayList heroCol = new ArrayList();
        ArrayList HeroAttackLevel = new ArrayList();
        ArrayList HeroHealthLevel = new ArrayList();
        ArrayList EnemyAttackLevel = new ArrayList();
        ArrayList EnemyHealthLevel = new ArrayList();
        public void progressMap()
        {
            countHero = 0;
            countEnemy = 0;
            mapping = null;
            mapping = new int[numRows, numCols];
            for (int r = 0; r < numRows; r++)
            {
                for (int c = 0; c < numCols; c++)
                {
                    if (boardspaces[r, c].containsCharacter())
                    {
                        if (boardspaces[r, c].tileCharacter.GetType().IsSubclassOf(typeof(Community.Hero)))
                        {
                            mapping[r, c] = 1;
                            heroLocated[r, c] = boardspaces[r, c].tileCharacter.GetType();
                            countHero++;
                            heroRow.Add(r);
                            heroCol.Add(c);
                            HeroAttackLevel.Add(boardspaces[r,c].tileCharacter.MaxAttack);
                            HeroHealthLevel.Add(boardspaces[r,c].tileCharacter.MaxHealth);
                        }
                        else //is an enemy
                        {
                            mapping[r, c] = 2;
                            countEnemy++;
                            enemyLocated[r, c] = boardspaces[r, c].tileCharacter.GetType();
                            enemyRow.Add(r);
                            enemyCol.Add(c);
                            EnemyAttackLevel.Add(boardspaces[r,c].tileCharacter.MaxAttack);
                            EnemyHealthLevel.Add(boardspaces[r,c].tileCharacter.MaxHealth);
                        }   
                   }
                    else
                        mapping[r, c] = 0;
                }
            }
        }
    }
}
