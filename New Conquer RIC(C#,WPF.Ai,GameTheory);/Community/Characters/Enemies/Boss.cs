using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;
using System.Windows.Media.Imaging;

namespace Community
{
    public class Boss : Enemy
    {
        public Boss(String nam, bool sex)
        {
            Init(nam, sex);
        }

        // Second constructor.
        public Boss(int r, int c) : base(r, c)
        {
            Init("Ravenscroft", true);
            Row = r;
            Col = c;
        }

        private void Init(String n, bool s)
        {
            Name = n;
            Male = s;
            JobRole = "Boss";

            pictureFile = ".../.../Pictures/Enemies/Ravenscroft.png";
            characterPicture = new BitmapImage(new Uri(pictureFile, UriKind.Relative));

            /******************************************************************
             * stat progression unique to this job role.
             * ****************************************************************
             */
            HealthMulti = 3.00;
            EnergyMulti = 3.00;
            AttackMulti = 2.00;
            DefenseMulti = 3.00;
            SpeedMulti = 2;
            AgilityMulti = 2;
            AttackRangeMulti = 1.00;
            SpecialAttackMulti = 3.00;
            SpecialDefenseMulti = 3.00;

            ExperienceAmountMulti = 100.00;

            /******************************************************************
             * stats initialized after multipliers applied.
             * ****************************************************************
             */
            InstantiateLevel(1);
        }
    }
}