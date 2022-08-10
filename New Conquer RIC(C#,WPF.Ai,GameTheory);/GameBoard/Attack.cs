using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Threading;
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
using System.Reflection;
using System.Collections;
using Community;

namespace GameBoard
{
    public partial class MainWindow : Page
    {
        private const int numberOfColumns = 3;
        private const int numberOfFrames = 6;
        private const int frameWidth = 20;
        private const int frameHeight = 20;
        private DispatcherTimer dispatcherTimer;
        private TimeSpan TimePerFrame = TimeSpan.FromSeconds(0.1);
        private int currentFrame = 0;
        private ImageSource spritesheet;
        private ImageBrush animation;
        private TranslateTransform SpriteSheetOffset;
        private Rectangle animationSpace;
        private Grid animationContainer;
        private ArrayList area1 = new ArrayList();
        private ArrayList area2 = new ArrayList();
        private ArrayList area3 = new ArrayList();
        private ArrayList area4 = new ArrayList();

        private void clearAttackOptions()
        {
            foreach (Tile space in area1)
            {
                removeAttackOption(space);
            }
            foreach (Tile space in area2)
            {
                removeAttackOption(space);
            }
            foreach (Tile space in area3)
            {
                removeAttackOption(space);
            }
            foreach (Tile space in area4)
            {
                removeAttackOption(space);
            }
            area1.Clear();
            area2.Clear();
            area3.Clear();
            area4.Clear();
        }

        public void removeAttackOption(Tile space)
        {
            typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space, new object[] { false });
            space.Click -= new RoutedEventHandler(AttackOption_Click);
            space.MouseEnter -= new MouseEventHandler(AttackOption_MouseEnter);
            space.MouseLeave -= new MouseEventHandler(AttackOption_MouseLeave);
            space.BorderThickness = new Thickness(0);
            space.Click += new RoutedEventHandler(Tile_Click);
            if (space.containsCharacter())
            {
                space.tileCharacter.Click -= new RoutedEventHandler(AttackOption_Click);
                space.tileCharacter.MouseEnter -= new MouseEventHandler(AttackOption_MouseEnter);
                space.tileCharacter.MouseEnter -= new MouseEventHandler(AttackOption_MouseLeave);
                space.tileCharacter.Click += new RoutedEventHandler(Character_Click);
                typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space.tileCharacter, new object[] { false });
            }
        }

        /*
         * Display buttons for the different Attacks a Hero can do.
         */
        private void Attack_Click(object sender, RoutedEventArgs e)
        {
            clearMoveOptions();
            clearAttackOptions();
            Ability1.IsEnabled = true;
            Ability2.IsEnabled = true;
            Ability3.IsEnabled = true;
            Ability4.IsEnabled = true;
        }

        /*
         * When a Hero is selected that can attack and the attack button is clicked, run the method(s) involved in displaying who they can attack, displaying different abilities, and then
         * executing that ability, and if an attack and an enemy is selected, set that the hero has attacked and moved to true (hero can't move after attacking), disable buttons for those
         * and the defend button (can't defend after attacking).
         */
        private void AttackOption_Click(object sender, RoutedEventArgs e)
        {
            //MessageBox.Show("Attack Option Click!");
            //MessageBox.Show(sender.ToString());

            //if (sender.GetType().IsSubclassOf(typeof(Community.Character)))
                //MessageBox.Show("Clicked on a character");

            //Make sure the selected hero hasn't already attacked this turn (mostly not necessary, but for safety against glitches?)
            if (!boardspaces[selectedCharacterRow, selectedCharacterCol].tileCharacter.hasAttacked)
            {
                if (sender.GetType() == typeof(GameBoard.Tile))
                {
                    if (area1.Contains(boardspaces[(sender as Tile).Row, (sender as Tile).Col]))
                    {
                        applyAbilityToArea(area1);
                    }
                    else if (area2.Contains(boardspaces[(sender as Tile).Row, (sender as Tile).Col]))
                    {
                        applyAbilityToArea(area2);
                    }
                    else if (area3.Contains(boardspaces[(sender as Tile).Row, (sender as Tile).Col]))
                    {
                        applyAbilityToArea(area3);
                    }
                    else if (area4.Contains(boardspaces[(sender as Tile).Row, (sender as Tile).Col]))
                    {
                        applyAbilityToArea(area4);
                    }
                }
                else if (sender.GetType().IsSubclassOf(typeof(Community.Character)))
                {
                    if (area1.Contains(boardspaces[(sender as Character).Row, (sender as Character).Col]))
                    {
                        applyAbilityToArea(area1);
                    }
                    else if (area2.Contains(boardspaces[(sender as Character).Row, (sender as Character).Col]))
                    {
                        applyAbilityToArea(area2);
                    }
                    else if (area3.Contains(boardspaces[(sender as Character).Row, (sender as Character).Col]))
                    {
                        applyAbilityToArea(area3);
                    }
                    else if (area4.Contains(boardspaces[(sender as Character).Row, (sender as Character).Col]))
                    {
                        applyAbilityToArea(area4);
                    }
                }
            }

            boardspaces[selectedCharacterRow, selectedCharacterCol].tileCharacter.hasAttacked = true;
            boardspaces[selectedCharacterRow, selectedCharacterCol].tileCharacter.hasMoved = true;
            if(!boardspaces[selectedCharacterRow, selectedCharacterCol].tileCharacter.isActive) //Check if hero has moved, used an item, and attacked, if so, the hero's turn is over, is inactive
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

        public async void applyAbilityToArea(ArrayList area)
        {
            foreach(Tile space in area)
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

                    if(damage != "MISS")
                    {
                        space.tileCharacter.DecreaseHealth(Convert.ToInt32(damage));
                        await attackAnimation(space.tileCharacter, ".../.../Pictures/test_explosion_spritesheet.png");
                    }
                    else
                    {
                        await attackAnimation(space.tileCharacter, ".../.../Pictures/miss_spritesheet.png");
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

                        await attackAnimation(space, ".../.../Pictures/test_explosion_spritesheet.png");
                        space.tileCharacter = null;
                        refreshBoardSpace(space.Row, space.Col);
                    }
                }
            }

            clearAttackOptions();
        }

        public int[,] mapSolidSpaces()
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

        public void decodeAttackAreas(int[,] attackAreas)
        {
            for (int r = 0; r < numRows; r++)
            {
                for (int c = 0; c < numCols; c++)
                {
                    switch(attackAreas[r,c])
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

        public void Ability1_Click(object sender, RoutedEventArgs e)
        {
            clearAttackOptions();
            int[,] attackAreas = new int[numRows, numCols];
            attackAreas = boardspaces[selectedCharacterRow, selectedCharacterCol].tileCharacter.Ability1(mapSolidSpaces()); //Determines the different spaces the character can attack
            decodeAttackAreas(attackAreas);
            displayAttackAreas();
        }

        public void Ability2_Click(object sender, RoutedEventArgs e)
        {
            clearAttackOptions();
            int[,] attackAreas = new int[numRows, numCols];
            attackAreas = boardspaces[selectedCharacterRow, selectedCharacterCol].tileCharacter.Ability2(mapSolidSpaces()); //Determines the different spaces the character can attack
            decodeAttackAreas(attackAreas);
            displayAttackAreas();
        }

        public void Ability3_Click(object sender, RoutedEventArgs e)
        {
            clearAttackOptions();
            int[,] attackAreas = new int[numRows, numCols];
            attackAreas = boardspaces[selectedCharacterRow, selectedCharacterCol].tileCharacter.Ability3(mapSolidSpaces()); //Determines the different spaces the character can attack
            decodeAttackAreas(attackAreas);
            displayAttackAreas();
        }

        public void Ability4_Click(object sender, RoutedEventArgs e)
        {
            clearAttackOptions();
            int[,] attackAreas = new int[numRows, numCols];
            attackAreas = boardspaces[selectedCharacterRow, selectedCharacterCol].tileCharacter.Ability4(mapSolidSpaces()); //Determines the different spaces the character can attack
            decodeAttackAreas(attackAreas);
            displayAttackAreas();
        }

        public void displayAttackAreas()
        {
            foreach(Tile space in area1)
            {
                //String position = space.Row + ", " + space.Col;
                //MessageBox.Show(position + " is in area 1.");
                space.Click -= new RoutedEventHandler(Tile_Click); //Remove the Tile_Click event handler from the tile button
                if (space.containsCharacter())
                {
                    space.tileCharacter.Click -= new RoutedEventHandler(Tile_Click);
                    space.tileCharacter.Click -= new RoutedEventHandler(Character_Click);
                    space.tileCharacter.Click += new RoutedEventHandler(AttackOption_Click);
                    space.tileCharacter.MouseEnter += new MouseEventHandler(AttackOption_MouseEnter);
                    space.tileCharacter.MouseLeave += new MouseEventHandler(AttackOption_MouseLeave);
                }
                space.Click += new RoutedEventHandler(AttackOption_Click); //Add a AttackOption_Click event handler to the tile button
                space.MouseEnter += new MouseEventHandler(AttackOption_MouseEnter);
                space.MouseLeave += new MouseEventHandler(AttackOption_MouseLeave);
                //Make a colored border around attackOption spaces to signify which ones they are to the user.
                space.BorderBrush = attackOption;
                space.BorderThickness = new Thickness(1);
            }
            foreach (Tile space in area2)
            {
                //String position = space.Row + ", " + space.Col;
                //MessageBox.Show(position + " is in area 2.");
                space.Click -= new RoutedEventHandler(Tile_Click); //Remove the Tile_Click event handler from the tile button
                if (space.containsCharacter())
                {
                    space.tileCharacter.Click -= new RoutedEventHandler(Tile_Click);
                    space.tileCharacter.Click -= new RoutedEventHandler(Character_Click);
                    space.tileCharacter.Click += new RoutedEventHandler(AttackOption_Click);
                    space.tileCharacter.MouseEnter += new MouseEventHandler(AttackOption_MouseEnter);
                    space.tileCharacter.MouseLeave += new MouseEventHandler(AttackOption_MouseLeave);
                }
                space.Click += new RoutedEventHandler(AttackOption_Click); //Add a AttackOption_Click event handler to the tile button
                space.MouseEnter += new MouseEventHandler(AttackOption_MouseEnter);
                space.MouseLeave += new MouseEventHandler(AttackOption_MouseLeave);
                //Make a colored border around attackOption spaces to signify which ones they are to the user.
                space.BorderBrush = attackOption;
                space.BorderThickness = new Thickness(1);
            }
            foreach (Tile space in area3)
            {
                //String position = space.Row + ", " + space.Col;
                //MessageBox.Show(position + " is in area 3.");
                space.Click -= new RoutedEventHandler(Tile_Click); //Remove the Tile_Click event handler from the tile button
                if (space.containsCharacter())
                {
                    space.tileCharacter.Click -= new RoutedEventHandler(Tile_Click);
                    space.tileCharacter.Click -= new RoutedEventHandler(Character_Click);
                    space.tileCharacter.Click += new RoutedEventHandler(AttackOption_Click);
                    space.tileCharacter.MouseEnter += new MouseEventHandler(AttackOption_MouseEnter);
                    space.tileCharacter.MouseLeave += new MouseEventHandler(AttackOption_MouseLeave);
                }
                space.Click += new RoutedEventHandler(AttackOption_Click); //Add a AttackOption_Click event handler to the tile button
                space.MouseEnter += new MouseEventHandler(AttackOption_MouseEnter);
                space.MouseLeave += new MouseEventHandler(AttackOption_MouseLeave);
                //Make a colored border around attackOption spaces to signify which ones they are to the user.
                space.BorderBrush = attackOption;
                space.BorderThickness = new Thickness(1);
            }
            foreach (Tile space in area4)
            {
                //String position = space.Row + ", " + space.Col;
                //MessageBox.Show(position + " is in area 4.");
                space.Click -= new RoutedEventHandler(Tile_Click); //Remove the Tile_Click event handler from the tile button
                if (space.containsCharacter())
                {
                    space.tileCharacter.Click -= new RoutedEventHandler(Tile_Click);
                    space.tileCharacter.Click -= new RoutedEventHandler(Character_Click);
                    space.tileCharacter.Click += new RoutedEventHandler(AttackOption_Click);
                    space.tileCharacter.MouseEnter += new MouseEventHandler(AttackOption_MouseEnter);
                    space.tileCharacter.MouseLeave += new MouseEventHandler(AttackOption_MouseLeave);
                }
                space.Click += new RoutedEventHandler(AttackOption_Click); //Add a AttackOption_Click event handler to the tile button
                space.MouseEnter += new MouseEventHandler(AttackOption_MouseEnter);
                space.MouseLeave += new MouseEventHandler(AttackOption_MouseLeave);
                //Make a colored border around attackOption spaces to signify which ones they are to the user.
                space.BorderBrush = attackOption;
                space.BorderThickness = new Thickness(1);
            }
        }

        public void AttackOption_MouseEnter(object sender, MouseEventArgs e)
        {
            if (sender.GetType() == typeof(GameBoard.Tile))
            {
                if (area1.Contains((sender as Tile)))
                {
                    foreach (Tile space in area1)
                    {
                        typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space, new object[] { true });
                        if(space.containsCharacter())
                            typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space.tileCharacter, new object[] { true });
                    }
                }
                else if (area2.Contains((sender as Tile)))
                {
                    foreach (Tile space in area2)
                    {
                        typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space, new object[] { true });
                        if (space.containsCharacter())
                            typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space.tileCharacter, new object[] { true });
                    }
                }
                else if (area3.Contains((sender as Tile)))
                {
                    foreach (Tile space in area3)
                    {
                        typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space, new object[] { true });
                        if (space.containsCharacter())
                            typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space.tileCharacter, new object[] { true });
                    }
                }
                else if (area4.Contains((sender as Tile)))
                {
                    foreach (Tile space in area4)
                    {
                        typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space, new object[] { true });
                        if (space.containsCharacter())
                            typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space.tileCharacter, new object[] { true });
                    }
                }
            }
            else if (sender.GetType().IsSubclassOf(typeof(Community.Character)))
            {
                if (area1.Contains(boardspaces[(sender as Character).Row, (sender as Character).Col]))
                {
                    foreach (Tile space in area1)
                    {
                        typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space, new object[] { true });
                        if (space.containsCharacter())
                            typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space.tileCharacter, new object[] { true });
                    }
                }
                else if (area2.Contains(boardspaces[(sender as Character).Row, (sender as Character).Col]))
                {
                    foreach (Tile space in area2)
                    {
                        typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space, new object[] { true });
                        if (space.containsCharacter())
                            typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space.tileCharacter, new object[] { true });
                    }
                }
                else if (area3.Contains(boardspaces[(sender as Character).Row, (sender as Character).Col]))
                {
                    foreach (Tile space in area3)
                    {
                        typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space, new object[] { true });
                        if (space.containsCharacter())
                            typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space.tileCharacter, new object[] { true });
                    }
                }
                else if (area4.Contains(boardspaces[(sender as Character).Row, (sender as Character).Col]))
                {
                    foreach (Tile space in area4)
                    {
                        typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space, new object[] { true });
                        if (space.containsCharacter())
                            typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space.tileCharacter, new object[] { true });
                    }
                }
            }
        }

        public void AttackOption_MouseLeave(object sender, MouseEventArgs e)
        {
            if (sender.GetType() == typeof(GameBoard.Tile))
            {
                if (area1.Contains((sender as Tile)))
                {
                    foreach (Tile space in area1)
                    {
                        typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space, new object[] { false });
                        if (space.containsCharacter())
                            typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space.tileCharacter, new object[] { false });
                    }
                }
                else if (area2.Contains((sender as Tile)))
                {
                    foreach (Tile space in area2)
                    {
                        typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space, new object[] { false });
                        if (space.containsCharacter())
                            typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space.tileCharacter, new object[] { false });
                    }
                }
                else if (area3.Contains((sender as Tile)))
                {
                    foreach (Tile space in area3)
                    {
                        typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space, new object[] { false });
                        if (space.containsCharacter())
                            typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space.tileCharacter, new object[] { false });
                    }
                }
                else if (area4.Contains((sender as Tile)))
                {
                    foreach (Tile space in area4)
                    {
                        typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space, new object[] { false });
                        if (space.containsCharacter())
                            typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space.tileCharacter, new object[] { false });
                    }
                }
            }
            else if (sender.GetType().IsSubclassOf(typeof(Community.Character)))
            {
                if (area1.Contains(boardspaces[(sender as Character).Row, (sender as Character).Col]))
                {
                    foreach (Tile space in area1)
                    {
                        typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space, new object[] { false });
                        if (space.containsCharacter())
                            typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space.tileCharacter, new object[] { false });
                    }
                }
                else if (area2.Contains(boardspaces[(sender as Character).Row, (sender as Character).Col]))
                {
                    foreach (Tile space in area2)
                    {
                        typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space, new object[] { false });
                        if (space.containsCharacter())
                            typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space.tileCharacter, new object[] { false });
                    }
                }
                else if (area3.Contains(boardspaces[(sender as Character).Row, (sender as Character).Col]))
                {
                    foreach (Tile space in area3)
                    {
                        typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space, new object[] { false });
                        if (space.containsCharacter())
                            typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space.tileCharacter, new object[] { false });
                    }
                }
                else if (area4.Contains(boardspaces[(sender as Character).Row, (sender as Character).Col]))
                {
                    foreach (Tile space in area4)
                    {
                        typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space, new object[] { false });
                        if (space.containsCharacter())
                            typeof(Button).GetMethod("set_IsPressed", BindingFlags.Instance | BindingFlags.NonPublic).Invoke(space.tileCharacter, new object[] { false });
                    }
                }
            }
        }

        private async Task attackAnimation(Button space, String spritesheetSource)
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

            await Task.Delay(1000);
        }

        private void onUpdate(object sender, object e)
        {
            currentFrame++;
            var column = currentFrame % numberOfColumns;
            var row = currentFrame / numberOfColumns;

            SpriteSheetOffset.X = -column * frameWidth;
            SpriteSheetOffset.Y = -row * frameHeight;

            if(currentFrame >= 7)
            {
                dispatcherTimer.Stop();
            }
        }



    }
}
