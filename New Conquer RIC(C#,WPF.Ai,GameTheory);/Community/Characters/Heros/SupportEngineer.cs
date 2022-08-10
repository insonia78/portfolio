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
    public class SupportEngineer : Hero
    {
        public SupportEngineer(String nam, bool sex)
        {
            Init(nam, sex);
        }

        // Second constructor.
        public SupportEngineer(int r, int c) : base(r, c)
        {
            Init(null, true);
            Row = r;
            Col = c;
        }

        private void Init(String n, bool s)
        {
            Name = n;
            Male = s;
            JobRole = "Support Engineer";

            // Picture will be generated depending on the sex.
            if(Male)
            {
                PortraitFile = "MaleSupportEngineer.png";
                PictureFile = "Heroes/Support_Engineer_MALE.png";
                //CharacterPicture = " "; 
            }
            else
            {
                PortraitFile = "FemaleSupportEngineer.png";
                PictureFile = "Heroes/Support_Engineer_FEMALE.png";
                //CharacterPicture = " "; 
            }
            CharacterPicture = new BitmapImage(new Uri(PictureFile, UriKind.Relative));
            CharacterPortrait = new BitmapImage(new Uri(PortraitFile, UriKind.Relative));

            statEffects = new List<Effect>();

            /******************************************************************
             * stat progression unique to this job role.
             * ****************************************************************
             */
            HealthMulti = 2.00;
            EnergyMulti = 3.00;
            AttackMulti = 1.25;
            DefenseMulti = 2.00;
            SpeedMulti = 1;
            AgilityMulti = 1;
            AttackRangeMulti = 3.00;
            SpecialAttackMulti = 2.00;
            SpecialDefenseMulti = 3.00;

            /******************************************************************
             * stats initialized after multipliers applied.
             * ****************************************************************
             */
            InstantiateLevel(1);
        }
    }
}