using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;
using System.Windows.Media.Imaging;

namespace Community
{
    public class FoodServer : Enemy
    {
        public FoodServer()
        {
            Init();
        }

        // Second constructor.
        public FoodServer(int r, int c) : base(r, c)
        {
            Init();
            Row = r;
            Col = c;
        }

        private void Init()
        {
            /******************************************************************
             * stat progression unique to this job role.
             * ****************************************************************
             */
            JobRole = "Food Server";

            pictureFile = ".../.../Pictures/Enemies/Cook.png";
            characterPicture = new BitmapImage(new Uri(pictureFile, UriKind.Relative));

            statEffects = new List<Effect>();

            HealthMulti = 2.00;
            EnergyMulti = 3.00;
            AttackMulti = 1.25;
            DefenseMulti = 2.00;
            SpeedMulti = 1;
            AgilityMulti = 1;
            AttackRangeMulti = 3.00;
            SpecialAttackMulti = 2.00;
            SpecialDefenseMulti = 3.00;

            ExperienceAmountMulti = 15.00;
            /******************************************************************
             * stats initialized after multipliers applied.
             * ****************************************************************
             */
            InstantiateLevel(1);
        }
    }
}