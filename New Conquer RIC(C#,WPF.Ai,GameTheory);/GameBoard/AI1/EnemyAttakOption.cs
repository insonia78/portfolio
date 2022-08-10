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
        
        private void EnemyAttach()
        {
            //MessageBox.Show("Attack Option Click!");
            //MessageBox.Show(sender.ToString());

            //if (sender.GetType().IsSubclassOf(typeof(Community.Character)))
            //MessageBox.Show("Clicked on a character");

            //Make sure the selected hero hasn't already attacked this turn (mostly not necessary, but for safety against glitches?)
            if (!boardspaces[selectedCharacterRow, selectedCharacterCol].tileCharacter.hasAttacked)
            {
                 if (boardspaces[aheroRow,aheroCol].GetType().Equals(typeof(Community.Hero)))
                 {
                    if (area1.Contains(boardspaces[aheroRow, aheroCol]))
                    {
                        applyAbilityToArea(area1);
                    }
                    else if (area2.Contains(boardspaces[aheroRow,aheroCol]))
                    {
                        applyAbilityToArea(area2);
                    }
                    else if (area3.Contains(boardspaces[aheroRow,aheroCol]))
                    {
                        applyAbilityToArea(area3);
                    }
                    else if (area4.Contains(boardspaces[aheroRow,aheroCol]))
                    {
                        applyAbilityToArea(area4);
                    }
                }
            }

            boardspaces[selectedCharacterRow, selectedCharacterCol].tileCharacter.hasAttacked = true;
            boardspaces[selectedCharacterRow, selectedCharacterCol].tileCharacter.hasMoved = true;
            if (!boardspaces[selectedCharacterRow, selectedCharacterCol].tileCharacter.isActive) //Check if hero has moved, used an item, and attacked, if so, the hero's turn is over, is inactive
            {
                refreshBoardSpace(selectedCharacterRow, selectedCharacterCol); //refresh the character so it appears faded.
                //If inactive, the item button is already disabled, and the move and attack were previously disabled in this method when the attack was successful.
            }
            if (checkAllPlayersInactive())
            {
                nextTurn();
            }

            updateAvailableOptionButtons();
        }
         
        public void displayEnemyAttackAreas()
        {
            foreach (Tile space in area1)
            {
                //String position = space.Row + ", " + space.Col;
                //MessageBox.Show(position + " is in area 1.");
                
                
                //Make a colored border around attackOption spaces to signify which ones they are to the user.
                space.BorderBrush = attackOption;
                space.BorderThickness = new Thickness(1);
            }
            foreach (Tile space in area2)
            {
                //String position = space.Row + ", " + space.Col;
                //MessageBox.Show(position + " is in area 2.");
                
                //Make a colored border around attackOption spaces to signify which ones they are to the user.
                space.BorderBrush = attackOption;
                space.BorderThickness = new Thickness(1);
            }
            foreach (Tile space in area3)
            {
                //String position = space.Row + ", " + space.Col;
                //MessageBox.Show(position + " is in area 3.");
                
                //Make a colored border around attackOption spaces to signify which ones they are to the user.
                space.BorderBrush = attackOption;
                space.BorderThickness = new Thickness(1);
            }
            foreach (Tile space in area4)
            {
                //String position = space.Row + ", " + space.Col;
                //MessageBox.Show(position + " is in area 4.");
                
                //Make a colored border around attackOption spaces to signify which ones they are to the user.
                space.BorderBrush = attackOption;
                space.BorderThickness = new Thickness(1);
            }
        }
        
        private void clearEnemyAttackOptions()
        {
            foreach (Tile space in area1)
            {
                removeEnemyAttackOption(space);
            }
            foreach (Tile space in area2)
            {
                removeEnemyAttackOption(space);
            }
            foreach (Tile space in area3)
            {
                removeEnemyAttackOption(space);
            }
            foreach (Tile space in area4)
            {
                removeEnemyAttackOption(space);
            }
            area1.Clear();
            area2.Clear();
            area3.Clear();
            area4.Clear();
        }

        public void removeEnemyAttackOption(Tile space)
        {
            
            
            space.BorderThickness = new Thickness(0);
            
                
            
        }

        /*
         * Display buttons for the different Attacks a Hero can do.
         */
        
        /*
         * When a Hero is selected that can attack and the attack button is clicked, run the method(s) involved in displaying who they can attack, displaying different abilities, and then
         * executing that ability, and if an attack and an enemy is selected, set that the hero has attacked and moved to true (hero can't move after attacking), disable buttons for those
         * and the defend button (can't defend after attacking).
         */
        
        public void applyEnemyAbilityToArea(ArrayList area)
        {
            foreach (Tile space in area)
            {
                //String position = space.Row + ", " + space.Col;
                //MessageBox.Show(position + " was attacked.");

                if (space.containsCharacter() && (((space.tileCharacter.GetType().IsSubclassOf(typeof(Community.Enemy))) && boardspaces[selectedCharacterRow, selectedCharacterCol].tileCharacter.GetType().IsSubclassOf(typeof(Community.Hero)) ||
                    ((space.tileCharacter.GetType().IsSubclassOf(typeof(Community.Hero))) && boardspaces[selectedCharacterRow, selectedCharacterCol].tileCharacter.GetType().IsSubclassOf(typeof(Community.Enemy))))))
                {
                    String damage;

                    if (space.tileCharacter.isAttackTypeSpecial)
                        damage = boardspaces[selectedCharacterRow, selectedCharacterCol].tileCharacter.InitiateSpecialAttack(space.tileCharacter);
                    else
                        damage = boardspaces[selectedCharacterRow, selectedCharacterCol].tileCharacter.InitiateAttack(space.tileCharacter);

                    if (damage != "MISS")
                    {
                        space.tileCharacter.DecreaseHealth(Convert.ToInt32(damage));
                       // attackAnimation(space.tileCharacter, "test_explosion_spritesheet.png");
                    }
                    else
                    {
                        //attackAnimation(space.tileCharacter, "miss_spritesheet.png");
                    }

                    if (space.tileCharacter.Status == "KNOCKED OUT")
                    {
                        if (space.tileCharacter.GetType().IsSubclassOf(typeof(Community.Enemy)))
                        {
                            numEnemies--;
                            updateCharacterCountDisplay();
                        }
                        else if (space.tileCharacter.GetType().IsSubclassOf(typeof(Community.Hero)))
                        {
                            numHeroes--;
                            updateCharacterCountDisplay();
                        }

                        //attackAnimation(space, "test_explosion_spritesheet.png");
                        space.tileCharacter = null;
                        refreshBoardSpace(space.Row, space.Col);
                    }
                }
            }

            clearAttackOptions();
        }

        public int[,] mapEnemySolidSpaces()
        {
            int[,] solidSpaces = new int[numRows, numCols];

            for (int r = 0; r < numRows; r++)
            {
                for (int c = 0; c < numCols; c++)
                {
                    if (boardspaces[r, c].isUnpassable)
                        solidSpaces[r, c] = -1;
                    else
                        solidSpaces[r, c] = 0;
                }
            }

            return solidSpaces;
        }

        public void decodeEnemyAttackAreas(int[,] attackAreas)
        {
            for (int r = 0; r < numRows; r++)
            {
                for (int c = 0; c < numCols; c++)
                {
                    switch (attackAreas[r, c])
                    {
                        case 1:
                            area1.Add(boardspaces[r, c]);
                            break;
                        case 2:
                            area2.Add(boardspaces[r, c]);
                            break;
                        case 3:
                            area3.Add(boardspaces[r, c]);
                            break;
                        case 4:
                            area4.Add(boardspaces[r, c]);
                            break;
                    }
                }
            }
        }

        public void EnemyAbility1()
        {
            int[,] attackAreas = new int[numRows, numCols];
            attackAreas = boardspaces[selectedCharacterRow, selectedCharacterCol].tileCharacter.Ability1(mapEnemySolidSpaces()); //Determines the different spaces the character can attack
           // EnemyAttach();
            decodeEnemyAttackAreas(attackAreas);
            displayEnemyAttackAreas();
        }
        
        public void Ability2_Click()
        {
            int[,] attackAreas = new int[numRows, numCols];
            attackAreas = boardspaces[selectedCharacterRow, selectedCharacterCol].tileCharacter.Ability2(mapSolidSpaces()); //Determines the different spaces the character can attack
            decodeEnemyAttackAreas(attackAreas);
            displayEnemyAttackAreas();
        }

        public void Ability3_Click()
        {
            int[,] attackAreas = new int[numRows, numCols];
            attackAreas = boardspaces[selectedCharacterRow, selectedCharacterCol].tileCharacter.Ability3(mapSolidSpaces()); //Determines the different spaces the character can attack
            decodeAttackAreas(attackAreas);
            displayEnemyAttackAreas();
        }

        public void Ability4_Click()
        {
            int[,] attackAreas = new int[numRows, numCols];
            attackAreas = boardspaces[selectedCharacterRow, selectedCharacterCol].tileCharacter.Ability4(mapSolidSpaces()); //Determines the different spaces the character can attack
            decodeAttackAreas(attackAreas);
            displayEnemyAttackAreas();
        }

        

        

       /* private void attackAnimation(Button space, String spritesheetSource)
        {
            animationContainer = new Grid();

            animationSpace = new Rectangle();
            animationSpace.Height = 40;
            animationSpace.Width = 60;

            animation = new ImageBrush();
            spritesheet = new BitmapImage(new Uri(spritesheetSource, UriKind.Relative));
            animation.ImageSource = spritesheet;

            animation.AlignmentX = AlignmentX.Left;
            animation.AlignmentY = AlignmentY.Top;
            animation.Stretch = Stretch.None;
            SpriteSheetOffset = new TranslateTransform(0, 0);
            animation.Transform = SpriteSheetOffset;

            animationSpace.Fill = animation;
            animationContainer.Children.Add(animationSpace);
            animationContainer.Height = 20;
            animationContainer.Width = 20;
            space.Content = animationContainer;

            currentFrame = 0;
            dispatcherTimer.Start();
        }
        */
        private void onUpdate1(object sender, object e)
        {
            currentFrame++;
            var column = currentFrame % numberOfColumns;
            var row = currentFrame / numberOfColumns;

            SpriteSheetOffset.X = -column * frameWidth;
            SpriteSheetOffset.Y = -row * frameHeight;

            if (currentFrame >= 7)
            {
                dispatcherTimer.Stop();
            }
        }



        
    }
}
