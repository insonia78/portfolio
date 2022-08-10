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
    /**************************************************************************
     * The heros contrast the enemy classes. Heros will be able to gain
     * experience until they hit the max experience they can earn for their 
     * current level and then they will be able to level up. Resetting their
     * max requirement of expereince to level up. For each level increase, the
     * difference from the max experience and min experience will be greater than 
     * the previous level.
     * The hero character will also be able to wear equipment that affects 
     * their stats for the better or worse. They will be able to place these
     * equipments are parts of their bodies and can interchange these items
     * during the Player's time in the world map.
     * The base and max experience do not change, after leveling up 
     * they 
     * ************************************************************************
     */
    /**********************************************************************
     * TODO:
     * helmet
     * chest
     * legs
     * arms
     * experience gain system.
     * ********************************************************************
     */
    public class Hero : Character
    {
        // fields
        private String portraitFile;
        private ImageSource characterPortrait;            // image of the hero for the UI.
        
        // base stats for experience.
        private int baseExperience = 0;             // experience earned.
        private int baseMaxExperience = 100;        // experience needed to earn a new level at level 1.

        // experience multiplier
        private double experienceMulti = 1.5;       // max experience increased per level.

        // max experience for the level.
        private int maxExperience;                  // max experience to level at the current level.

        // current stats.
        private int currentExperience;              // current amount of experience.

        // default constructor.
        public Hero()
        {
            Init();
        }

        // Second constructor.
        public Hero(int r, int c) : base(r, c)
        {
            Init();
            base.Row = r;
            base.Col = c;
        }

        public void Init()
        {
            portraitFile = "hero_portrait.png";
            pictureFile = "Heroes/hero.png";
            characterPicture = new BitmapImage(new Uri(pictureFile, UriKind.Relative));
            currentExperience = baseExperience;

            statEffects = new List<Effect>();

            portraitFile = "MissingnoPortrait.png";
            characterPortrait = new BitmapImage(new Uri(portraitFile, UriKind.Relative));
        }

        // get and set for the portraitFile variable.
        public String PortraitFile
        {
            get
            {
                return portraitFile;
            }
            set 
            {
                portraitFile = value;
            }
        }

        // get and set for the profileImage variable.
        public ImageSource CharacterPortrait
        {
            get
            {
                return characterPortrait;
            }
            set
            {
                characterPortrait = value;
            }
        }

        // get and set for the baseExperience variable.
        public int BaseExperience
        {
            get
            {
                return baseExperience;
            }
            set
            {
                baseExperience = value;
            }
        }

        // get and set for the MaxExperience variable.
        public int BaseMaxExperience
        {
            get
            {
                return baseMaxExperience;
            }
            set
            {
                baseMaxExperience = value;
            }
        }

        // get and set for the currentExperience variable.
        public int CurrentExperience
        {
            get
            {
                return currentExperience;
            }
            set
            {
                currentExperience = value;
            }
        }

        /**********************************************************************
         * Other methods.
         * ********************************************************************
         */

        /**********************************************************************
         * This method applies the experience gained in battle to the hero.
         * when enough experience is accumulated the hero may level up. The
         * hero may gain enough experience to level up more than once.
         * The amount of stats being increased will be recorded to let the
         * player see the growth of their hero character. When the hero reaches
         * the level-cap that hero will no longer acrue experience.
         * ********************************************************************
         */
        public String ApplyExperience(int expAmount)
        {
            String growthText = "";

            /******************************************************************
             * this if will check to see if the experience gained by the hero
             * is more than the max amount for his level. if it is, the 
             * levelcounter will go up and the rest of the experience amount
             * will be compared to the maxExperience for the next level and so
             * on until all of the experience has been accounted for.
             * ****************************************************************
             */
            while(expAmount != 0)
            {
                if(MaxLevel == (BaseLevelCap - 1))
                {
                    if ((CurrentLevel + expAmount) >= maxExperience)
                    {
                        currentExperience = maxExperience;
                        expAmount = 0;
                    }
                    else
                    {
                        currentExperience = (currentExperience + expAmount);
                    }
                }
                else 
                {
                    if ((currentExperience + expAmount) >= maxExperience)
                    {
                        int difference = (maxExperience - currentExperience);
                        expAmount = (expAmount - difference);
                        LevelUp();
                        currentExperience = baseExperience;
                    }
                    else
                    {
                        currentExperience = (currentExperience + expAmount);
                        expAmount = 0;
                    }
                }
            }

            return growthText;
        }

        // Levels up the Hero
        private String LevelUp()
        {
            // applies the level to the hero and applies the new stats.
            int newLevel = (MaxLevel + 1);
            
            // text holds info of the stats for the levelup.
            String increaseInfo;

            // reference the differences in stats from the previous stats.
            int healthIncrease = (((int)(HealthMulti * BaseHealth) * newLevel) - ((int)(HealthMulti * BaseHealth) * MaxLevel));
            int energyIncrease = (((int)(EnergyMulti * BaseEnergy) * newLevel) - ((int)(EnergyMulti * BaseEnergy) * MaxLevel));
            int attackIncrease = (((int)(AttackMulti * BaseAttack) * newLevel) - ((int)(AttackMulti * BaseAttack) * MaxLevel));
            int defenseIncrease = (((int)(DefenseMulti * BaseDefense) * newLevel) - ((int)(DefenseMulti * BaseDefense) * MaxLevel));
            int agilityIncrease = (((int)(AgilityMulti * BaseAgility) * newLevel) - ((int)(AgilityMulti * BaseAgility) * MaxLevel));
            int specialAttackIncrease = (((int)(SpecialAttackMulti * BaseSpecialAttack) * newLevel) - ((int)(SpecialAttackMulti * BaseSpecialAttack) * MaxLevel));
            int specialDefenseIncrease = (((int)(SpecialDefenseMulti * BaseSpecialDefense) * newLevel) - ((int)(SpecialDefenseMulti * BaseSpecialDefense) * MaxLevel));

            // instantiate new variables.
            InstantiateLevel(newLevel);

            int[] increases = {healthIncrease, energyIncrease, attackIncrease,
                              defenseIncrease, agilityIncrease, specialAttackIncrease, specialDefenseIncrease};

            increaseInfo = ("level up!\n" +
                                  "+" + increases[0] + " health\n" +
                                  "+" + increases[1] + " energy\n" +
                                  "+" + increases[2] + " attack\n" +
                                  "+" + increases[3] + " defense\n" +
                                  "+" + increases[4] + " agility\n" +
                                  "+" + increases[5] + " sp. attack\n" +
                                  "+" + increases[6] + " sp. defense\n");

            return increaseInfo;
        }

        // initialize variables according to the level and updates the max experience
        public void InstantiateLevel(int aLevel)
        {
            base.InstantiateLevel(aLevel);
            maxExperience = (int)(baseMaxExperience * (experienceMulti * CurrentLevel));
        }

        // Prints out the variables for testing purposes.
        public String ToString()
        {
            String text;

            text = (
                base.ToString() +
                "\nProfile image: " + portraitFile +
                "\n\nExperience Stats:\n\n" +
                "Experience at the beginning of this level: " + baseExperience + "\n" +
                "Experience needed to level: " + baseMaxExperience + "\n" +
                "Current Experience: " + currentExperience);

            return text;
        }
    }
}