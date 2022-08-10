using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Drawing;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Collections;

namespace Community
{
    /**************************************************************************
         * TODO:
         * Job-specific abilities
         * ********************************************************************
         */
    public class SoftwareEngineer : Hero
    {
        public SoftwareEngineer(String nam, bool sex)
        {
            Init(nam, sex);
        }

        // Second constructor.
        public SoftwareEngineer(int r, int c) : base(r, c)
        {
            Init(null, true);
            Row = r;
            Col = c;
        }

        private void Init(String n, bool s)
        {
            Name = n;
            Male = s;
            JobRole = "Software Engineer";

            // Picture will be generated depending on the sex.
            if(Male)
            {
                String path = Directory.GetCurrentDirectory();
                Console.Read();

                PortraitFile = "MaleSoftwareEngineer.png";
                PictureFile = "Heroes/Software_Engineer_MALE.png";

                //CharacterPicture = " "; 
            }
            else
            {

                PortraitFile = "FemaleSoftwareEngineer.png";
                PictureFile = "Heroes/Software_Engineer_FEMALE.png";

                //CharacterPicture = " "; 
            }
            CharacterPicture = new BitmapImage(new Uri(PictureFile, UriKind.Relative));
            CharacterPortrait = new BitmapImage(new Uri(PortraitFile, UriKind.Relative));

            statEffects = new List<Effect>();

            /******************************************************************
             * stat progression unique to this job role.
             * ****************************************************************
             */
            HealthMulti = 3.00;
            EnergyMulti = 1.50;
            AttackMulti = 2.00;
            DefenseMulti = 3.00;
            SpeedMulti = 1;
            AgilityMulti = 1;
            AttackRangeMulti = 1.00;
            SpecialAttackMulti = 2.00;
            SpecialDefenseMulti = 2.00;

            /******************************************************************
             * stats initialized after multipliers applied.
             * ****************************************************************
             */
            InstantiateLevel(1);
        }

        //public override int[,] Ability1(int[,] boardspaces)
        //Ability1 is a basic attack that only attacks spaces directly adjacent, that all characters have, do not override

        public override int[,] Ability2(int[,] boardspaces)
        {
            this.selectedAttackPower = 0.5;

            //up
            if (row - 1 >= 0 && boardspaces[row - 1, col] == 0)
            {
                boardspaces[row - 1, col] = 1;
                if (row - 2 >= 0 && boardspaces[row - 2, col] == 0)
                {
                    boardspaces[row - 2, col] = 1;
                    if (col - 1 >= 0 && boardspaces[row - 2, col - 1] == 0)
                        boardspaces[row - 2, col - 1] = 1;
                    if (col + 1 >= 0 && boardspaces[row - 2, col + 1] == 0)
                        boardspaces[row - 2, col + 1] = 1;
                }
            }
            //down
            if (row + 1 < boardspaces.GetLength(0) && boardspaces[row + 1, col] == 0)
            {
                boardspaces[row + 1, col] = 2;
                if (row + 2 < boardspaces.GetLength(0) && boardspaces[row + 2, col] == 0)
                {
                    boardspaces[row + 2, col] = 2;
                    if (col - 1 >= 0 && boardspaces[row + 2, col - 1] == 0)
                        boardspaces[row + 2, col - 1] = 2;
                    if (col + 1 < boardspaces.GetLength(1) && boardspaces[row + 2, col + 1] == 0)
                        boardspaces[row + 2, col + 1] = 2;
                }
            }
            //left
            if (col - 1 >= 0 && boardspaces[row, col - 1] == 0)
            {
                boardspaces[row, col - 1] = 3;
                if (col - 2 >= 0 && boardspaces[row, col - 2] == 0)
                {
                    boardspaces[row, col - 2] = 3;
                    if (row - 1 >= 0 && boardspaces[row - 1, col - 2] == 0)
                        boardspaces[row - 1, col - 2] = 3;
                    if (row + 1 < boardspaces.GetLength(1) && boardspaces[row + 1, col - 2] == 0)
                        boardspaces[row + 1, col - 2] = 3;
                }
            }
            //right
            if (col + 1 < boardspaces.GetLength(1) && boardspaces[row, col + 1] == 0)
            {
                boardspaces[row, col + 1] = 4;
                if (col + 2 < boardspaces.GetLength(1) && boardspaces[row, col + 2] == 0)
                {
                    boardspaces[row, col + 2] = 4;
                    if (row - 1 >= 0 && boardspaces[row - 1, col + 2] == 0)
                        boardspaces[row - 1, col + 2] = 4;
                    if (row + 1 < boardspaces.GetLength(0) && boardspaces[row + 1, col + 2] == 0)
                        boardspaces[row + 1, col + 2] = 4;
                }
            }
            return boardspaces;
        }
    }
}