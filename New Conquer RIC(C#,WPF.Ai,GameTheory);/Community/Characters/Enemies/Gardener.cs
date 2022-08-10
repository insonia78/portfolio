using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;
using System.Windows.Media.Imaging;

namespace Community
{
    public class Gardener : Enemy
    {
        private int p1;
        private int p2;

        public Gardener()
        {
            Init();
        }

        // Second constructor.
        public Gardener(int r, int c) : base(r, c)
        {
            Init();
            row = r;
            col = c;
        }

        private void Init()
        {
            /******************************************************************
             * stat progression unique to this job role.
             * ****************************************************************
             */
            JobRole = "Gardener";

            pictureFile = ".../.../Pictures/Enemies/Gardener.png";
            characterPicture = new BitmapImage(new Uri(pictureFile, UriKind.Relative));

            statEffects = new List<Effect>();

            HealthMulti = 1.75;
            EnergyMulti = 1.50;
            AttackMulti = 3.00;
            DefenseMulti = 1.50;
            SpeedMulti = 1;
            AgilityMulti = 1;
            AttackRangeMulti = 3.00;
            SpecialAttackMulti = 2.00;
            SpecialDefenseMulti = 1.50;

            ExperienceAmountMulti = 20.00;
            /******************************************************************
             * stats initialized after multipliers applied.
             * ****************************************************************
             */
            InstantiateLevel(1);
        }

        public override int[,] Ability2(int[,] boardspaces)
        {
            this.selectedAttackPower = 0.2;
            this.isSelectedAttackTypeSpecial = false;

            int i = 1;
            //up
            while (row - i >= 0 && boardspaces[row - i, col] == 0 && i < 4)
            {
                boardspaces[row - i, col] = 1;
                i++;
            }
            i = 1;
            //up/left diagonal
            while (row - i - 1 >= 0 && col - i >= 0 && boardspaces[row - i - 1, col - i] == 0 && i < 3)
            {
                boardspaces[row - i - 1, col - i] = 1;
                i++;
            }
            i = 1;
            //up/right diagonal
            while (row - i - 1 >= 0 && col + i < boardspaces.GetLength(1) && boardspaces[row - i - 1, col + i] == 0 && i < 3)
            {
                boardspaces[row - i - 1, col + i] = 1;
                i++;
            }

            i = 1;
            //down
            while (row + i < boardspaces.GetLength(0) && boardspaces[row + i, col] == 0 && i < 4)
            {
                boardspaces[row + i, col] = 2;
                i++;
            }
            i = 1;
            //down/left diagonal
            while (row + i + 1 < boardspaces.GetLength(0) && col - i >= 0 && boardspaces[row + i + 1, col - i] == 0 && i < 3)
            {
                boardspaces[row + i + 1, col - i] = 2;
                i++;
            }
            i = 1;
            //down/right diagonal
            while (row + i + 1 < boardspaces.GetLength(0) && col + i < boardspaces.GetLength(1) && boardspaces[row + i + 1, col + i] == 0 && i < 3)
            {
                boardspaces[row + i + 1, col + i] = 2;
                i++;
            }

            i = 1;
            //left
            while (col - i >= 0 && boardspaces[row, col - i] == 0 && i < 4)
            {
                boardspaces[row, col - i] = 3;
                i++;
            }
            i = 1;
            //left/up diagonal
            while (row - i >= 0 && col - i - 1 >= 0 && boardspaces[row - i, col - i - 1] == 0 && i < 3)
            {
                boardspaces[row - i, col - i - 1] = 3;
                i++;
            }
            i = 1;
            //left/down diagonal
            while (row + i < boardspaces.GetLength(0) && col - i - 1 >= 0 && boardspaces[row + i, col - i - 1] == 0 && i < 3)
            {
                boardspaces[row + i, col - i - 1] = 3;
                i++;
            }

            i = 1;
            //right
            while (col + i < boardspaces.GetLength(1) && boardspaces[row, col + i] == 0 && i < 4)
            {
                boardspaces[row, col + i] = 4;
                i++;
            }
            i = 1;
            //right/up diagonal
            while (row - i >= 0 && col + i + 1 < boardspaces.GetLength(1) && boardspaces[row - i, col + i + 1] == 0 && i < 3)
            {
                boardspaces[row - i, col + i + 1] = 4;
                i++;
            }
            i = 1;
            //right/down diagonal
            while (row + i < boardspaces.GetLength(0) && col + i + 1 < boardspaces.GetLength(1) && boardspaces[row + i, col + i + 1] == 0 && i < 3)
            {
                boardspaces[row + i, col + i + 1] = 4;
                i++;
            }
            return boardspaces;
        }

        public override int[,] Ability3(int[,] boardspaces)
        {
            this.selectedAttackPower = 0.5;
            this.isSelectedAttackTypeSpecial = true;

            //up
            if(row - 3 >= 0 && boardspaces[row - 3, col] == 0)
            {
                boardspaces[row - 3, col] = 1;
                //up
                if(row - 4 >= 0 && boardspaces[row - 4, col] == 0)
                {
                    boardspaces[row - 4, col] = 1;
                }
                //down
                if(boardspaces[row - 2, col] == 0)
                {
                    boardspaces[row - 2, col] = 1;
                }
                //left
                if(col - 1>= 0 && boardspaces[row - 3, col - 1] == 0)
                {
                    boardspaces[row - 3, col - 1] = 1;
                }
                //right
                if(col + 1 < boardspaces.GetLength(1) && boardspaces[row - 3, col + 1] == 0)
                {
                    boardspaces[row - 3, col + 1] = 1;
                }
            }
            //down
            if (row + 3 < boardspaces.GetLength(0) && boardspaces[row + 3, col] == 0)
            {
                boardspaces[row + 3, col] = 2;
                //up
                if (row + 4 < boardspaces.GetLength(0) && boardspaces[row + 4, col] == 0)
                {
                    boardspaces[row + 4, col] = 2;
                }
                //down
                if (boardspaces[row + 2, col] == 0)
                {
                    boardspaces[row + 2, col] = 2;
                }
                //left
                if (col - 1>= 0 && boardspaces[row + 3, col - 1] == 0)
                {
                    boardspaces[row + 3, col - 1] = 2;
                }
                //right
                if (col + 1 < boardspaces.GetLength(1) && boardspaces[row + 3, col + 1] == 0)
                {
                    boardspaces[row + 3, col + 1] = 2;
                }
            }
            //left
            if (col - 3 >= 0 && boardspaces[row, col - 3] == 0)
            {
                boardspaces[row, col + 3] = 3;
                //up
                if (row - 1 >= 0 && boardspaces[row - 1, col - 3] == 0)
                {
                    boardspaces[row - 1, col - 3] = 3;
                }
                //down
                if (row + 1 < boardspaces.GetLength(0) && boardspaces[row + 1, col - 3] == 0)
                {
                    boardspaces[row + 1, col - 3] = 3;
                }
                //left
                if (col - 4 >= 0 && boardspaces[row, col - 4] == 0)
                {
                    boardspaces[row, col - 4] = 3;
                }
                //right
                if (boardspaces[row, col - 2] == 0)
                {
                    boardspaces[row, col - 2] = 3;
                }
            }
            //right
            if (col + 3 < boardspaces.GetLength(1) && boardspaces[row, col + 3] == 0)
            {
                boardspaces[row, col + 3] = 4;
                //up
                if (row - 1 >= 0 && boardspaces[row - 1, col + 3] == 0)
                {
                    boardspaces[row - 1, col + 3] = 4;
                }
                //down
                if (row + 1 < boardspaces.GetLength(0) && boardspaces[row + 1, col + 3] == 0)
                {
                    boardspaces[row + 1, col + 3] = 4;
                }
                //left
                if (col + 4 < boardspaces.GetLength(1) && boardspaces[row, col + 4] == 0)
                {
                    boardspaces[row, col + 4] = 4;
                }
                //right
                if (boardspaces[row, col + 2] == 0)
                {
                    boardspaces[row, col + 2] = 4;
                }
            }

            return boardspaces;
        }
    }
}