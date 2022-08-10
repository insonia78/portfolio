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
     * This class is the skeleton of every hero and enemy.
     * each character has base stats that will be the same for all job classes.
     * Each stat has a multiplier. This multiplier will change the stats of each
     * job class. They are also there to decide how many points a character will
     * receive for each stat when they level up as it pertains to their job role.
     * ************************************************************************
     */
    /**************************************************************************
     * TODO:
     * build leveling system.
     * build battle system; 
     *      taking and receiving damage. death. status effects etc.
     * ************************************************************************
     */
    public class Character : System.Windows.Controls.Button
    {
        // fields
        private String name;
        private Boolean male;
        private String jobRole;

        // fields for the game board.
        protected int row;
        protected int col;
        private bool hasMovedOnTurn = false;
        private bool hasAttackedOnTurn = false;
        private bool hasUsedItemOnTurn = false;
        private bool isActiveOnTurn = true;
        protected String pictureFile;
        protected ImageSource characterPicture;
        private String status;
        protected List<Effect> statEffects;
        protected double selectedAttackPower;
        protected bool isSelectedAttackTypeSpecial = false;

        // base stats.
        // all characters will have the same base stats.
        private int baseLevel = 1;                  // initial level.
        private double baseExperienceRate = 10.0;   // rate at which the hero earns experience.
        private int baseHealth = 100;               // initial health
        private int baseEnergy = 50;                // initial energy
        private int baseAttack = 5;                 // initial attack
        private int baseDefense = 5;                // initial defense
        private int baseSpeed = 5;                  // initial speed
        private int baseAgility = 5;                // initial agility
        private int baseAttackRange = 1;            // initial attack range
        private int baseSpecialAttack = 10;         // initial special attack
        private int baseSpecialDefense = 10;        // initial special defense
        private int baseLevelCap = 10;              // last level that can be achieved.

        // stat multipliers , increases stats by a set amount for each level.
        // will differ depending on class setup. can be used injuction with effects.
        private double healthMulti;
        private double energyMulti;
        private double attackMulti;
        private double defenseMulti;
        private int    speedMulti;
        private double agilityMulti;
        private double attackRangeMulti;
        private double specialAttackMulti;
        private double specialDefenseMulti;

        // maximum values.
        private int maxLevel;
        private int maxHealth;
        private int maxEnergy;
        private int maxAttack;
        private int maxDefense;
        private int maxSpeed;
        private int maxAgility;
        private int maxAttackRange;
        private int maxSpecialAttack;
        private int maxSpecialDefense;

        // current state of stats. (affected by status changing properties.)
        private int currentLevel;
        private int currentHealth;
        private int currentEnergy;
        private int currentAttack;
        private int currentDefense;
        private int currentSpeed;
        private int currentAgility;
        private int currentAttackRange;
        private int currentSpecialAttack;
        private int currentSpecialDefense;

        // constructor
        public Character()
        {
            Init();
        }

        public Character(int r, int c)
        {
            row = r;
            col = c;
        }

        // initialize the fields.
        public void Init()
        {
        name = "MissingNo";
        male = false;
        pictureFile = "Missingno.png";
        characterPicture = new BitmapImage(new Uri(pictureFile, UriKind.Relative));
        jobRole = "Jobless";
        status = "AWAKE";

        statEffects = new List<Effect>();

        // stat multipliers , increases stats by a set amount for each stat.
        healthMulti = 1.0;
        energyMulti = 1.0;
        attackMulti = 1.0;
        defenseMulti = 1.0;
        speedMulti = 1;
        agilityMulti = 1.0;
        attackRangeMulti = 1.0;
        specialAttackMulti = 1.0;
        specialDefenseMulti = 1.0;

        // maximum values.
        maxLevel = 99;
        maxHealth = 9999;
        maxEnergy = 999;
        maxAttack = 99;
        maxDefense = 99;
        maxSpeed = 99;
        maxAgility = 99;
        maxAttackRange = 9;
        maxSpecialAttack = 999;
        maxSpecialDefense = 999;

        // current state of stats. (affected by status changing properties.)
        currentLevel = baseLevel;
        currentHealth = maxHealth;
        currentEnergy = maxEnergy;
        currentAttack = maxAttack;
        currentDefense = maxDefense;
        currentSpeed = maxSpeed;
        currentAttackRange = maxAttackRange;
        currentSpecialAttack = maxSpecialAttack;
        currentSpecialDefense = maxSpecialDefense;
        }

        /**********************************************************************
         * Get and Sets for the character name and the canMoveOnTurn variable.
         * ********************************************************************
         */
        // get and set for the name variable.
        public String Name
        {
            get
            {
                return name;
            }
            set
            {
                name = value;
            }
        }

        /**********************************************************************
         * Get and sets for the variables.
         **********************************************************************
         */
        // get and set for the male variable.
        public Boolean Male
        {
            get
            {
                return male;
            }
            set
            {
                male = value;
            }
        }

        public virtual int Col
        {
            get { return col; }
            set { col = value; }
        }
        public virtual int Row
        {
            get { return row; }
            set { row = value; }
        }

        public String PictureFile
        {
            get 
            {
                return pictureFile;
            }
            set 
            {
                pictureFile = value;
            }
        }
        public ImageSource CharacterPicture
        {
            get
            {
                return characterPicture;
            }
            set 
            { 
                characterPicture = value; 
            }
        }

        // get and set for the jobRole variable.
        public String JobRole
        {
            get
            {
                return jobRole;
            }
            set
            {
                jobRole = value;
            }
        }

        // get and set for the status variable.
        public String Status
        {
            get
            {
                return status;
            }
            set
            {
                status = value;
            }
        }

        public bool hasMoved
        {
            get
            {
                return hasMovedOnTurn;
            }
            set
            {
                hasMovedOnTurn = value;
            }
        }
        public bool hasAttacked
        {
            get
            {
                return hasAttackedOnTurn;
            }
            set
            {
                hasAttackedOnTurn = value;
            }
        }
        public bool hasUsedItem
        {
            get
            {
                return hasUsedItemOnTurn;
            }
            set
            {
                hasUsedItemOnTurn = value;
            }
        }

        public bool IsActiveOnTurn
        {
            get
            {
                return isActiveOnTurn;
            }

        }

        /**********************************************************************
         * Gets and sets for the Base Stats of the character.
         **********************************************************************
         */
        // get and set for the baseLevel variable.
        public int BaseLevel
        {
            get
            {
                return baseLevel;
            }
            set
            {
                baseLevel = value;
            }
        }

        // get and set for the baseMaxExperienceRate variable.
        public double BaseExperienceRate
        {
            get
            {
                return baseExperienceRate;
            }
            set
            {
                baseExperienceRate = value;
            }
        }

        // get and set for the baseHealth variable.
        public int BaseHealth
        {
            get
            {
                return baseHealth;
            }
            set
            {
                baseHealth = value;
            }
        }

        // get and set for the baseEnergy variable.
        public int BaseEnergy
        {
            get
            {
                return baseEnergy;
            }
            set
            {
                baseEnergy = value;
            }
        }

        // get and set for the baseAttack variable.
        public int BaseAttack
        {
            get
            {
                return baseAttack;
            }
            set
            {
                baseAttack = value;
            }
        }

        // get and set for the baseDefense variable.
        public int BaseDefense
        {
            get
            {
                return baseDefense;
            }
            set
            {
                baseDefense = value;
            }
        }

        // get and set for the baseSpeed variable.
        public int BaseSpeed
        {
            get
            {
                return baseSpeed;
            }
            set
            {
                baseSpeed = value;
            }
        }

        // get and set for the baseAgility variable.
        public int BaseAgility
        {
            get 
            {
                return baseAgility;
            }
            set
            {
                baseAgility = value;
            }
        }

        // get and set for the baseAttackRange variable.
        public int BaseAttackRange
        {
            get
            {
                return baseAttackRange;
            }
            set
            {
                baseAttackRange = value;
            }
        }

        // get and set for the baseSpecialAttack variable.
        public int BaseSpecialAttack
        {
            get
            {
                return baseSpecialAttack;
            }
            set
            {
                baseSpecialAttack = value;
            }
        }

        // get and set for the baseSpecialDefense variable.
        public int BaseSpecialDefense
        {
            get
            {
                return baseSpecialDefense;
            }
            set 
            {
                baseSpecialDefense = value;
            }
        }

        // get and set for the baseLevelCap variable.
        public int BaseLevelCap
        {
            get
            {
                return baseLevelCap;
            }
            set
            {
                baseLevelCap = value;
            }
        }

        /**********************************************************************
         * Gets and Sets for the Multiplier Stats.
         * ********************************************************************
         */
        // get and set for the healthMulti variable.
        public double HealthMulti
        {
            get
            {
                return healthMulti;
            }
            set
            {
                healthMulti = value;
            }
        }

        // get and set for the energyMulti variable.
        public double EnergyMulti
        {
            get
            {
                return energyMulti;
            }
            set
            {
                energyMulti = value;
            }
        }

        // get and set for the attackMulti variable.
        public double AttackMulti
        {
            get
            {
                return attackMulti;
            }
            set
            {
                attackMulti = value;
            }
        }

        // get and set for the defenseMulti variable.
        public double DefenseMulti
        {
            get
            {
                return defenseMulti;
            }
            set
            {
                defenseMulti = value;
            }
        }

        // get and set for the speedMulti variable.
        public int SpeedMulti
        {
            get
            {
                return speedMulti;
            }
            set
            {
                speedMulti = value;
            }
        }

        // get and set for the agilityMulti variable.
        public double AgilityMulti
        {
            get
            {
                return agilityMulti;
            }
            set
            {
                agilityMulti = value;
            }
        }

        // get and set for the attackRangeMulti variable.
        public double AttackRangeMulti
        {
            get
            {
                return attackRangeMulti;
            }
            set
            {
                attackRangeMulti = value;
            }
        }

        // get and set for the specialAttackMulti variable.
        public double SpecialAttackMulti
        {
            get
            {
                return specialAttackMulti;
            }
            set
            {
                specialAttackMulti = value;
            }
        }

        // get and set for the specialDefenseMulti variable.
        public double SpecialDefenseMulti
        {
            get
            {
                return specialDefenseMulti;
            }
            set
            {
                specialDefenseMulti = value;
            }
        }

        /**********************************************************************
         * Gets and sets for the Maximum Stats.
         * ********************************************************************
         */
        // get and set for the maxLevel variable.
        public int MaxLevel
        {
            get
            {
                return maxLevel;
            }
            set
            {
                maxLevel = value;
            }
        }

        // get and set for the maxHealth variable.
        public int MaxHealth
        {
            get
            {
                return maxHealth;
            }
            set
            {
                maxHealth = value;
            }
        }

        // get and set for the maxEnergy variable.
        public int MaxEnergy
        {
            get
            {
                return maxEnergy;
            }
            set
            {
                maxEnergy = value;
            }
        }

        // get and set for the maxAttack variable.
        public int MaxAttack
        {
            get
            {
                return maxAttack;
            }
            set
            {
                maxAttack = value;
            }
        }

        // get and set for the maxDefense variable.
        public int MaxDefense
        {
            get
            {
                return maxDefense;
            }
            set
            {
                maxDefense = value;
            }
        }

        // get and set for the maxSpeed variable.
        public int MaxSpeed
        {
            get
            {
                return maxSpeed;
            }
            set
            {
                maxSpeed = value;
            }
        }

        // get and set for the maxAgility variable.
        public int MaxAgility
        {
            get
            {
                return maxAgility;
            }
            set
            {
                maxAgility = value;
            }
        }

        // get and set for the maxAttackRange variable.
        public int MaxAttackRange
        {
            get
            {
                return maxAttackRange;
            }
            set
            {
                maxAttackRange = value;
            }
        }

        // get and set for the maxSpecialAttack variable.
        public int MaxSpecialAttack
        {
            get
            {
                return maxSpecialAttack;
            }
            set
            {
                maxSpecialAttack = value;
            }
        }

        // get and set for the maxSpecialDefense variable.
        public int MaxSpecialDefense
        {
            get
            {
                return maxSpecialDefense;
            }
            set
            {
                maxSpecialDefense = value;
            }
        }

        /**********************************************************************
         * Get and sets for the Current Stats.
         * ********************************************************************
         */
        // get and set for the currentLevel variable.
        public int CurrentLevel
        {
            get
            {
                return currentLevel;
            }
            set
            {
                currentLevel = value;
            }
        }

        // get and set for the currentHealth variable.
        public int CurrentHealth
        {
            get
            {
                return currentHealth;
            }
            set
            {
                currentHealth = value;
            }
        }

        // get and set for the currentEnergy variable.
        public int CurrentEnergy
        {
            get
            {
                return currentEnergy;
            }
            set
            {
                currentEnergy = value;
            }
        }

        // get and set for the currentAttack variable.
        public int CurrentAttack
        {
            get
            {
                return currentAttack;
            }
            set
            {
                currentAttack = value;
            }
        }

        // get and set for the currentDefense variable.
        public int CurrentDefense
        {
            get
            {
                return currentDefense;
            }
            set
            {
                currentDefense = value;
            }
        }

        // get and set for the currentSpeed variable.
        public int CurrentSpeed
        {
            get
            {
                return currentSpeed;
            }
            set
            {
                currentSpeed = value;
            }
        }

        // get and set for the currentAgility variable.
        public int CurrentAgility
        {
            get
            {
                return currentAgility;
            }
            set
            {
                currentAgility = value;
            }
        }

        // get and set for the currentAttackRange variable.
        public int CurrentAttackRange
        {
            get
            {
                return currentAttackRange;
            }
            set
            {
                currentAttackRange = value;
            }
        }

        // get and set for the currentSpecialAttack variable.
        public int CurrentSpecialAttack
        {
            get
            {
                return currentSpecialAttack;
            }
            set
            {
                currentSpecialAttack = value;
            }
        }

        // get and set for the currentSpecialDefense variable.
        public int CurrentSpecialDefense
        {
            get
            {
                return currentSpecialDefense;
            }
            set
            {
                currentSpecialDefense = value;
            }
        }

        public double AttackPower
        {
            get
            {
                return selectedAttackPower;
            }
            set { }
        }

        public bool isAttackTypeSpecial
        {
            get
            {
                return isSelectedAttackTypeSpecial;
            }

        }

        /**********************************************************************
         * Misc. Methods.
         * ********************************************************************
         */
        // returns the status of the turn for the character.
        public bool isActive
        {
            get
            {//If these three are true, then the character is no longer active, 
             //change before returning the value.
                if (hasMovedOnTurn && hasAttackedOnTurn && hasUsedItemOnTurn) 
                    isActiveOnTurn = false;
                return isActiveOnTurn;
            }
            set
            {
                isActiveOnTurn = value;
                hasMovedOnTurn = !value;
                hasUsedItemOnTurn = !value;
                hasAttackedOnTurn = !value;
                //If isActiveOnTurn = true, hasMovedOnTurn, etc. = !true = false.
                //If we want to set isActive = true, then we're making the character completely 
                // available for a new turn, so the other variables need to be false
                //If we're setting isActive to false, we're ending their turn, so the other variables 
                // should be true for the purposes of the code, whether actually true or not.
            }
        }

        /**********************************************************************
         * lowers the current health points of the character.
         * 0 being the lowest possible point to subtract to.
         * ********************************************************************
         */
        public void DecreaseHealth(int subtrahend)
        {
            int newHealth = (int)(currentHealth - subtrahend);

            if (newHealth < 0)
            {
                KnockOut();
            }
            else 
            {
                currentHealth = newHealth;
            }
        }

        /**********************************************************************
         * increases the current health points of the character.
         * their max health being the highest possible point to added to.
         * ********************************************************************
         */
        public void IncreaseHealth(int addend)
        {
            int newHealth = currentHealth + addend;

            if (newHealth > maxHealth)
            {
                currentHealth = maxHealth;
            }
            else
            {
                currentHealth = newHealth;
            }
        }

        /**********************************************************************
         * This method changes the status of the character.
         * Changing the status of the character will have various effects 
         * on the Character.
         * ********************************************************************
         */
        private void StatusChange(String newStatus, int amount)
        {
            switch(newStatus)
            {
                case "AWAKE":
                    status = "AWAKE";
                    currentHealth = amount;
                    currentEnergy = amount;
                    characterPicture = new BitmapImage(new Uri(pictureFile, UriKind.Relative));
                    break;

                case "KNOCKED OUT":
                    status = "KNOCKED OUT";
                    currentHealth = amount;
                    currentEnergy = amount;
                    currentAttack = maxAttack;
                    currentDefense = maxDefense;
                    currentAgility = maxAgility;
                    currentAttackRange = maxAttackRange;
                    currentSpecialAttack = maxSpecialAttack;
                    currentSpecialDefense = maxSpecialDefense;
                    characterPicture = null;
                    break;

                default:
                    Console.WriteLine("Unknown status type. Status will remain the same");
                    break;
            }
        }

        // simple parameterless method to ko characters.
        public void KnockOut()
        {
            StatusChange("KNOCKED OUT", 0);
        }  

        // simple method to awaken characters until a certain amount of health and energy.
        public void Awaken(int newAmount)
        {
            StatusChange("AWAKE", newAmount);
        }

        /**********************************************************************
         * Checks to see if the Character can hit the other Character.
         * The attack will be successful if the agressor's attack is greater
         * than the defender's 
         * If the Character is successful, The first Character will
         * inflict damage to the second Character.
         * ********************************************************************
         */
        public String InitiateAttack(Character aCharacter)
        {
            
            String damage;

             //if the first characters aim is better than the second characters dodge
             //the attack will go through.
            if ((BattleChance() - aCharacter.BattleChance()) > 0)
            {
                damage = BattleDamage(aCharacter);
            }
            else
            {
                damage = "MISS";
            }

            return damage;
        }

        // Battle initiated by a special Attack.
        public String InitiateSpecialAttack(Character aCharacter)
        {

            String damage;

            // if the first characters aim is better than the second characters dodge
            // the attack will go through.
            if ((BattleChance() - aCharacter.BattleChance()) > 0)
            {
                damage = SpecialBattleDamage(aCharacter);
            }
            else
            {
                damage = "MISS";
            }


            return damage;
        }

        // calculates battle damage.
        private String BattleDamage(Character opponent)
        {
            Random random = new Random(baseAttack);
            double criticalChance = random.NextDouble();
            String amount;

            amount = ((int)(((currentAttack * criticalChance) + currentAttack) - (opponent.CurrentDefense)) + "");
            opponent.DecreaseHealth(Int32.Parse(amount));

            return amount;
        }

        // calculates special battle damage.
        private String SpecialBattleDamage(Character opponent)
        {
            Random random = new Random(baseSpecialAttack);
            double criticalChance = random.NextDouble();
            String amount;

            amount = ((int)(((currentSpecialAttack * criticalChance) + currentSpecialAttack) - (opponent.CurrentSpecialDefense)) + "");
            opponent.DecreaseHealth(Int32.Parse(amount));

            return amount;
        }

        /**********************************************************************
         * Measures the chance to hit or dodge the opponent.
         * There is a 50 percent chance of hitting the opponent or dodging them.
         * The Character's speed will boost those chances.
         * ********************************************************************
         */
        private int BattleChance()
        {
            Random random = new Random();
            int chance = random.Next((50 + currentAgility), 101);

            return chance;
        }

        public virtual int[,] Ability1(int[,] boardspaces)
        {
            this.selectedAttackPower = 1.0;

            //up
            if (row - 1 >= 0 && boardspaces[row - 1, col] == 0)
            {
                boardspaces[row - 1, col] = 1;
            }

            //down
            if (row + 1 < boardspaces.GetLength(0) && boardspaces[row + 1, col] == 0)
            {
                boardspaces[row + 1, col] = 2;
            }

            //left
            if (col - 1 >= 0 && boardspaces[row, col - 1] == 0)
            {
                boardspaces[row, col - 1] = 3;
            }

            //right
            if (col + 1 < boardspaces.GetLength(1) && boardspaces[row, col + 1] == 0)
            {
                boardspaces[row, col + 1] = 4;
            }

            return boardspaces;
        }

        public virtual int[,] Ability2(int[,] boardspaces)
        {
            this.isSelectedAttackTypeSpecial = false;
            return boardspaces;
        }

        public virtual int[,] Ability3(int[,] boardspaces)
        {
            return boardspaces;
        }

        public virtual int[,] Ability4(int[,] boardspaces)
        {
            return boardspaces;
        }

        /*
         * Loops through all status effects applied to the character, decrements the amount of turns it will continue to affect their stats, and if 0, removes.
         * 
         * Should be ran after every turn.
         */
        public void decrementEffectDurations()
        {
            foreach (Effect anEffect in statEffects)
            {
                anEffect.decrement();

                if (anEffect.turnsLeft <= 0)
                {
                    statEffects.Remove(anEffect);
                }
            }
        }

        /**********************************************************************
         * This method will instantiate this characters max variables 
         * depending on the level that is chosen for this character.
         * ********************************************************************
         */
        public void InstantiateLevel(int aLevel)
        {
            maxLevel = aLevel;
            currentLevel = aLevel;

            maxHealth = (int)(baseHealth + (baseHealth *
                (healthMulti * currentLevel)));
            currentHealth = maxHealth;

            maxEnergy = (int)(baseEnergy + (baseEnergy *
                (energyMulti * currentLevel)));
            currentEnergy = maxEnergy;

            maxAttack = (int)(baseAttack + (baseAttack *
                (attackMulti * currentLevel)));
            currentAttack = maxAttack;

            maxDefense = (int)(baseDefense + (baseDefense *
                (defenseMulti * currentLevel)));
            currentDefense = maxDefense;

            maxSpeed = (baseSpeed * (speedMulti));
            currentSpeed = maxSpeed;

            maxAgility = (int)(baseAgility + (baseAgility *
                (agilityMulti * currentLevel)));
            currentAgility = maxAgility;

            maxAttackRange = (int)(baseAttackRange * attackRangeMulti);
            currentAttackRange = maxAttackRange;

            maxSpecialAttack = (int)(baseSpecialAttack + (baseSpecialAttack *
                (specialAttackMulti * currentLevel)));
            currentSpecialAttack = maxSpecialAttack;

            maxSpecialDefense = (int)(baseSpecialDefense + (baseSpecialDefense *
                (specialDefenseMulti * currentLevel)));
            currentSpecialDefense = maxSpecialDefense;
        }

        // Prints out the variables for testing purposes.
        public String ToString()
        {
            String text;
            
            text = (
                "The Character " + name + "'s stats are the following:\n" +
                "\nThis Character is male: " + male +
                "\nJob Role: " + jobRole +
                "\nStatus: " + status +
                "\nCharacter is moveable: " + isActiveOnTurn +
                "\nCharacter moved this turn: " + hasMovedOnTurn +
                "\nCharacter attacked this turn: " + hasAttackedOnTurn +
                "\nCharacter used an item this turn: " + hasUsedItemOnTurn +
                "\nCharacter is active this turn: " + isActiveOnTurn +
                "\n8-bit picture: " + pictureFile + 

                "\n\n\nBase Stats:\n\n" +
                "Level: " + baseLevel + "\n" +
                "Health: " + baseHealth + "\n" +
                "Energy: " + baseEnergy + "\n" +
                "Attack: " + baseAttack + "\n" +
                "Defense: " + baseDefense + "\n" +
                "Speed: " + baseSpeed + "\n" +
                "Agility: " + baseAgility + "\n" +
                "Attack Range: " + baseAttackRange + "\n" +
                "Special Attack: " + baseSpecialAttack + "\n" +
                "Special Defense: " + baseSpecialDefense + "\n" +
                
                "\n\n\nMultiplier Stats:\n\n" +
                "Health: " + healthMulti + "\n" +
                "Energy: " + energyMulti + "\n" +
                "Attack: " + attackMulti + "\n" +
                "Defense: " + defenseMulti + "\n" +
                "Speed: " + speedMulti + "\n" +
                "Agility: " + baseAgility + "\n" +
                "Attack Range: " + attackRangeMulti + "\n" +
                "Special Attack: " + specialAttackMulti + "\n" +
                "Special Defense: " + specialDefenseMulti + 
                
                "\n\n\nMaximum Stats:\n\n" +
                "Health: " + maxHealth + "\n" +
                "Energy: " + maxEnergy + "\n" +
                "Attack: " + maxAttack + "\n" +
                "Defense: " + maxDefense + "\n" +
                "Speed: " + maxSpeed + "\n" +
                "Agility: " + baseAgility + "\n" +
                "Max Attack Range: " + maxAttackRange + "\n" +
                "Attack Range: " + maxAttackRange + "\n" +
                "Special Attack: " + maxSpecialAttack + "\n" +
                "Special Defense: " + maxSpecialDefense +
            
                "\n\n\nCurrent Stats:\n\n" +
                "Health: " + currentHealth + "\n" +
                "Energy: " + currentEnergy + "\n" +
                "Attack: " + currentAttack + "\n" +
                "Defense: " + currentDefense + "\n" +
                "Speed: " + currentSpeed + "\n" +
                "Agility: " + baseAgility + "\n" +
                "Attack Range: " + currentAttackRange + "\n" +
                "Special Attack: " + currentSpecialAttack + "\n" +
                "Special Defense: " + currentSpecialDefense);

            return text;
        }

        public String ToStringScreen()
        {
            String text;
            String gender;
            if (male == true)
            {
                gender = "Male";
            }
            else { gender = "Female"; }
            text = (
                name + "'s stats are the following:\n" +
                "\nThis Character is: " + gender +
                "\nJob Role: " + jobRole +
                "\nLevel: " + baseLevel + "\n" +
                "Health: " + maxHealth + "\n" +
                "Energy: " + maxEnergy + "\n" +
                "Attack: " + maxAttack + "\n" +
                "Defense: " + maxDefense + "\n" +
                "Speed: " + maxSpeed + "\n" +
                "Agility: " + baseAgility + "\n" +
                "Max Attack Range: " + maxAttackRange + "\n" +
                "Attack Range: " + maxAttackRange + "\n" +
                "Special Attack: " + maxSpecialAttack + "\n" +
                "Special Defense: " + maxSpecialDefense);
            return text;
        }
    }
}