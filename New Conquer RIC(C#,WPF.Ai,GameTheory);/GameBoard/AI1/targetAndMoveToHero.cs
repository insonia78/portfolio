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

        int aheroRow, aheroCol;
        int aindex = 0;
        int iterationNumber = 0;
         int i = 0;
        public void targetAndMoveToHero()
        {
            int row = 0;
            int col = 0;
            int done = 0;
            int index = 0;
            int targetEnemyCount = 0;
            int targetHeroCount = 0;
            iterationNumber = 0;
            
            ArrayList selectHeroHealt = new ArrayList();
            ArrayList selectEnemyAttack = new ArrayList();
            ArrayList selectEnemyHealt = new ArrayList();
            ArrayList selectHeroAttack = new ArrayList();
            ArrayList dummyTargetHeroAttack = new ArrayList();
            ArrayList dummyTargetHeroHealth = new ArrayList();
            ArrayList dummyTargetEnemyAttack = new ArrayList();
            ArrayList dummyTargetEnemyHealth = new ArrayList();
            ArrayList heroHealthEnemyAttachWeight = new ArrayList();
            ArrayList targetHeroRow1 = new ArrayList();
            ArrayList targetHeroCol1 = new ArrayList();
            ArrayList targetEnemyRow1 = new ArrayList();
            ArrayList targetEnemyCol1 = new ArrayList();
           
            int tempEnemyAttack = (int)targetEnemyAttack[0];
            while (done < targetEnemyAttack.Count)
            {
                dummyTargetEnemyAttack.Add((int)targetEnemyAttack[done]);
                dummyTargetEnemyHealth.Add((int)targetEnemyHealth[done]);
                done++;
            }
            done = 0;
            while (done < targetHeroAttack.Count)
            {
                dummyTargetHeroAttack.Add((int)targetHeroAttack[done]);
                dummyTargetHeroHealth.Add((int)targetHeroHealth[done]);
                done++;
            }
            done = 0;
            while (targetEnemyCount < dummyTargetEnemyAttack.Count)
            {
                while (done < dummyTargetEnemyAttack.Count)
                {
                    if (tempEnemyAttack < (int)dummyTargetEnemyAttack[done])
                    {
                        tempEnemyAttack = (int)dummyTargetEnemyAttack[done];
                        index = done;
                        done = 0;
                    }
                    else
                    {
                        index = done;
                    }
                    done++;

                }
                targetEnemyCount++;
                selectEnemyAttack.Add(index);
                dummyTargetEnemyAttack.RemoveAt(index);
            }
           int tempHeroHealth = (int)targetHeroHealth[0];
            done = 0;
            while (targetHeroCount < dummyTargetHeroHealth.Count)
            {
                while (done < dummyTargetHeroHealth.Count)
                {
                    if (tempHeroHealth > (int)dummyTargetHeroHealth[done])
                    {
                        tempHeroHealth = (int)dummyTargetHeroHealth[done];
                        index = done;
                        done = 0;
                    }
                    else
                    {
                        index = done;
                    }
                    done++;

                }
                targetEnemyCount++;
                selectHeroHealt.Add(index);
                dummyTargetHeroHealth.RemoveAt(index);

            }
            done = 0;
            int tempEnemyHealth = (int)targetEnemyHealth[0];
            while (targetEnemyCount < dummyTargetEnemyHealth.Count)
            {
                while (done < dummyTargetEnemyHealth.Count)
                {
                    if (tempEnemyAttack < (int)dummyTargetEnemyHealth[done])
                    {
                        tempEnemyAttack = (int)dummyTargetEnemyHealth[done];
                        index = done;
                        done = 0;
                    }
                    else
                    {
                        index = done;
                    }
                    done++;

                }
                targetEnemyCount++;
                selectEnemyHealt.Add(index);
                dummyTargetEnemyHealth.RemoveAt(index);
            }
            int tempHeroAttack = (int)targetHeroAttack[0];
            done = 0;
            while (targetHeroCount < dummyTargetHeroAttack.Count)
            {
                while (done < dummyTargetHeroAttack.Count)
                {
                    if (tempHeroHealth > (int)dummyTargetHeroAttack[done])
                    {
                        tempHeroHealth = (int)dummyTargetHeroAttack[done];
                        index = done;
                        done = 0;
                    }
                    else
                    {
                        index = done;
                    }
                    done++;

                }
                targetEnemyCount++;
                selectHeroAttack.Add(index);
                dummyTargetHeroAttack.RemoveAt(index);

            }
            done = 0;
            // to consider if enemy < hero or hero < enemy
            while (done < selectHeroAttack.Count)
            {
                int Erow = Math.Abs((int)targetEnemyRow[(int)selectEnemyAttack[done]] - (int)targetHeroRow[(int)selectHeroHealt[done]]);
                int Ecol = Math.Abs((int)targetEnemyCol[(int)selectEnemyAttack[done]] - (int)targetHeroCol[(int)selectHeroHealt[done]]);
                int Hrow = Math.Abs((int)targetEnemyRow[(int)selectEnemyHealt[done]] - (int)targetHeroRow[(int)selectHeroAttack[done]]);
                int Hcol = Math.Abs((int)targetEnemyCol[(int)selectEnemyHealt[done]] - (int)targetHeroCol[(int)selectHeroAttack[done]]);
                
               heroHealthEnemyAttachWeight.Add((((0.30)*(int)targetHeroHealth[(int)selectHeroHealt[done]] / (int)targetEnemyAttack[(int)selectEnemyAttack[done]])) + (0.10 *((int)targetEnemyHealth[(int)selectEnemyHealt[done]] / (int)targetHeroAttack[(int)selectHeroAttack[done]]))+ (0.35 * (Erow + Ecol)) + (0.25 *(Hrow + Hcol )));
               targetEnemyRow1.Add((int)targetEnemyRow[(int)selectEnemyAttack[done]]);
               targetEnemyCol1.Add((int)targetEnemyCol[(int)selectEnemyAttack[done]]);
               targetHeroRow1.Add((int)targetHeroRow[(int)selectHeroHealt[done]]);
               targetHeroCol1.Add((int)targetHeroCol[(int)selectHeroHealt[done]]);
               done++;
            }
            done = 0;
            int dummyTemp = (int)heroHealthEnemyAttachWeight[0];
            int dummyIndex = 0;
            while (done < heroHealthEnemyAttachWeight.Count)
            {
                if (dummyTemp > (int)heroHealthEnemyAttachWeight[done])
                {
                    dummyIndex = done;
                    dummyTemp = (int)heroHealthEnemyAttachWeight[done];
                    done = 0;
                }
                done++;
               
                
            }
            
                      

            if (targetEnemyRow.Count > 0 && countEnemiesForloop > 0)
            {
                try
                {
                    aheroRow = (int)targetHeroRow1[dummyIndex];
                    aheroCol = (int)targetHeroCol1[dummyIndex];

                }
                catch
                {
                }

                try
                {
                    
                    selectedCharacterRow = (int)targetEnemyRow1[dummyIndex];
                    selectedCharacterCol = (int)targetEnemyCol1[dummyIndex];
                }
                catch
                {
                }
                try
                {
                    targetEnemyRow.RemoveAt(aindex);
                    targetEnemyCol.RemoveAt(aindex);
                    selectHeroHealt.Clear();
                    selectEnemyAttack.Clear();
                    selectEnemyHealt.Clear();
                    selectHeroAttack.Clear();
                    dummyTargetHeroAttack.Clear();
                    dummyTargetHeroHealth.Clear();
                    dummyTargetEnemyAttack.Clear();
                    dummyTargetEnemyHealth.Clear();
                    heroHealthEnemyAttachWeight.Clear();
                    targetHeroRow1.Clear();
                    targetHeroCol1.Clear();
                    targetEnemyRow1.Clear();
                    targetEnemyCol1.Clear();
                }
                catch
                {
                    nextTurn();
                }
                // i++;

            }
            else
            {
                ok = false;
                Enemytimer.Stop();
                Enemytimer.Tick -= Etimer_Tick;
                

            }
                
                //EnemyAbility1();
                //displayEnemyAttackAreas();
            }
        
        
         
        }
    }

