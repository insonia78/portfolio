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
    public partial class MainWindow: Page
    {
        ArrayList targetHeroRow = new ArrayList();
        ArrayList targetHeroCol = new ArrayList();
        ArrayList targetEnemyRow = new ArrayList();
        ArrayList targetEnemyCol = new ArrayList();
        ArrayList targetHeroAttack = new ArrayList();
        ArrayList targetHeroHealth = new ArrayList();
        ArrayList targetEnemyAttack = new ArrayList();
        ArrayList targetEnemyHealth = new ArrayList();
          
        public void localizeHero()
        {
            int progressCount = 0;
            int idh = 0;
            int coldh = 0;
            int temp = 0;
            int dummyCountHero = countHero;
            int dummyCountEnemy = countEnemy;
           while (progressCount < countHero)
           {
                temp = (int)heroRow[0];
                while (idh < dummyCountHero)
                {
                    
                    if (temp >= (int)heroRow[idh])
                    {
                        coldh = idh;
                    }
                    else
                    {
                        temp = (int)heroRow[idh];
                        coldh = idh;
                    }
                    if (idh == (countHero - 1))
                    {
                        
                            targetHeroRow.Add( temp);
                            targetHeroCol.Add((int)heroCol[coldh]);
                            targetHeroHealth.Add((int)HeroHealthLevel[coldh]);
                            targetHeroAttack.Add((int)HeroAttackLevel[coldh]);
                            HeroAttackLevel.RemoveAt(coldh);
                            HeroHealthLevel.RemoveAt(coldh); 
                            heroCol.RemoveAt(coldh);
                            heroRow.RemoveAt(coldh);
                            dummyCountHero--;
                    }
                        
                    idh++;
                }
                idh = 0;
                countHero--;
            }
            heroRow.Clear();
            heroCol.Clear();
            idh = 0;
            coldh = 0;
            progressCount = 0;
            while (progressCount < countEnemy)
            {
                temp = (int)enemyRow[0];

                while (idh < dummyCountEnemy)
                {
                    if (temp >= (int)enemyRow[idh])
                    {
                        coldh = idh;
                    }
                    else
                    {
                        temp = (int)enemyRow[idh];
                        coldh = idh;
                    }
                    if (idh == (countEnemy - 1))
                    {
                        
                            targetEnemyRow.Add(temp);
                            targetEnemyCol.Add((int)enemyCol[coldh]);
                            targetEnemyAttack.Add((int)EnemyAttackLevel[coldh]);
                            targetEnemyHealth.Add((int)EnemyHealthLevel[coldh]);
                            EnemyHealthLevel.RemoveAt(coldh);
                            EnemyAttackLevel.RemoveAt(coldh);
                            enemyCol.RemoveAt(coldh);
                            enemyRow.RemoveAt(coldh);
                            dummyCountEnemy--;
                       
                     }
                        
                    idh++;

                }
                idh = 0;
                countEnemy--;

           
        }
            enemyCol.Clear();
            enemyRow.Clear();
            }
        

    }
}
