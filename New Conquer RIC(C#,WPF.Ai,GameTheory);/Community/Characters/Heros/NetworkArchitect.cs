using System;
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
    public class NetworkArchitect : Hero
    {
        public NetworkArchitect(String nam, bool sex)
        {
            Init(nam, sex);
        }

        // Second constructor.
        public NetworkArchitect(int r, int c) : base(r, c)
        {
            Init(null, true);
            Row = r;
            Col = c;
        }

        private void Init(String n, bool s)
        {
            Name = n;
            Male = s;
            JobRole = "Network Architect";

            // Picture will be generated depending on the sex.
            if(Male)
            {
                PortraitFile = "MaleNetworkArchitect.png";
                PictureFile = "Heroes/Network_Architecture_MALE.png";
            }
            else
            {
                PortraitFile = "FemaleNetworkArchitect.png";
                PictureFile = "Heroes/Network_Architecture_FEMALE.png";
            }
            CharacterPicture = new BitmapImage(new Uri(PictureFile, UriKind.Relative));
            CharacterPortrait = new BitmapImage(new Uri(PortraitFile, UriKind.Relative));

            statEffects = new List<Effect>();

            /******************************************************************
             * stat progression unique to this job role.
             * ****************************************************************
             */
            HealthMulti = 1.75;
            EnergyMulti = 1.50;
            AttackMulti = 3.00;
            DefenseMulti = 1.50;
            SpeedMulti = 3;
            AgilityMulti = 3;
            AttackRangeMulti = 3.00;
            SpecialAttackMulti = 2.00;
            SpecialDefenseMulti = 1.50;

            /******************************************************************
             * stats initialized after multipliers applied.
             * ****************************************************************
             */
            InstantiateLevel(1);
        }

        public override int[,] Ability2(int[,] boardspaces)
        {
            this.selectedAttackPower = 0.2;

            int i = 1;
            //up
            while(row - i >= 0 && boardspaces[row - i, col] == 0)
            {
                boardspaces[row - i, col] = 1;
                i++;
            }
            i = 1;
            //down
            while (row + i < boardspaces.GetLength(0) && boardspaces[row + i, col] == 0)
            {
                boardspaces[row + i, col] = 2;
                i++;
            }
            i = 1;
            //left
            while (col - i >= 0 && boardspaces[row, col - i] == 0)
            {
                boardspaces[row, col - i] = 3;
                i++;
            }
            i = 1;
            //right
            while (col + i < boardspaces.GetLength(1) && boardspaces[row, col + i] == 0)
            {
                boardspaces[row, col + i] = 4;
                i++;
            }
            return boardspaces;
        }
    }
}