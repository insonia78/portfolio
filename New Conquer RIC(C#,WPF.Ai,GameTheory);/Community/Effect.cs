using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community
{
    public class Effect
    {
        private int duration; //the number of turns the effect lasts for, needs to be decreased each turn.

        private int hpChange; //negative applies damage each turn, positive heals each turn.
        private int speedChange;
        //Positive doubles/"percents" will increase a character's corresponding stat by that percent, and vice versa
        //For example, a character has 10 attack, and an effect has 0.5 percentAttackChange, they will have 15 attack for a number of turns.
        private double percentAttackChange;
        private double percentSpAttackChange;
        private double percentDefenseChange;
        private double percentSpDefenseChange;

        //accessors/mutators
        public int turnsLeft
        {
            get
            {
                return duration;
            }
            set { }
        }
        public int healthChange
        {
            get
            { 
                return hpChange; 
            }
            set { }
        }
        public int moveSpeedChange
        {
            get
            {
                return speedChange;
            }
            set { }
        }
        public double attackChange
        {
            get
            {
                return percentAttackChange;
            }
            set { }
        }
        public double spAttackChange
        {
            get
            {
                return percentSpAttackChange;
            }
            set { }
        }
        public double defenseChange
        {
            get
            {
                return percentDefenseChange;
            }
            set { }
        }
        public double spDefenseChange
        {
            get
            {
                return percentSpDefenseChange;
            }
            set { }
        }

        //Constructors
        public Effect(int numTurns, int hp, int speed, double attack, double specialAttack, double defense, double specialDefense)
        {
            duration = numTurns;
            hpChange = hp;
            speedChange = speed;
            percentAttackChange = attack;
            percentSpAttackChange = specialAttack;
            percentDefenseChange = defense;
            percentSpDefenseChange = specialDefense;
        }

        /*
         * Decreases the amount of turns the effect will remain by one.
         */
        public void decrement()
        {
            duration--;
        }
    }
}
