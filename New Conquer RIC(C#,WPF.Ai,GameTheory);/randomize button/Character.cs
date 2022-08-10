using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace randomize_button
{
     
    class Character
    {
        // fields
        private String name;
        private String herocharacter;
        private int maxHealth;
        private int currentHealth;
        private int attack;
        private int defense;
        private int speed;
        private int specialAttack;
        private int specialDefense;
        // TODO: bit picture for the map.

        bool gender;
        public Character()
        {
             Init();
        }
    public bool Gender
    {
          get{return gender;}
           set{gender = value;} 
    }
        // constructor
     

        // initialize the fields.
        private void Init()
        {
            name = "MissingNo";
            herocharacter = "";
            maxHealth = 9999;
            currentHealth = maxHealth;
            attack = 99;
            defense = 99;
            speed = 99;
            specialAttack = 9999;
            specialDefense = 9999;
        }

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

        //get and set for character hero class.
        public String Herocharacter
        {
            get
            {
                return herocharacter;
            }
            set
            {
                herocharacter = value;
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

        // get and set for the attack variable.
        public int Attack
        {
            get
            {
                return attack;
            }
            set
            {
                attack = value;
            }
        }

        // get and set for the defense variable.
        public int Defense
        {
            get
            {
                return defense;
            }
            set
            {
                defense = value;
            }
        }

        // get and set for the speed variable.
        public int Speed
        {
            get
            {
                return speed;
            }
            set
            {
                speed = value;
            }
        }

        // get and set for the specialAttack variable.
        public int SpecialAttack
        {
            get
            {
                return specialAttack;
            }
            set
            {
                specialAttack = value;
            }
        }

        // get and set for the specialDefense variable.
        public int SpecialDefense
        {
            get
            {
                return specialDefense;
            }
            set
            {
                specialDefense = value;
            }
        }

        public String toString()
        {
            String stats = ("The Character's stats are:\n\n" +
                "Name: " + name + "\n" +
                "Maximum Health: " + maxHealth + "\n" +
                "Current Health: " + currentHealth + "\n" +
                "Attack: " + attack + "\n" +
                "Defense: " + defense + "\n" +
                "Speed: " + speed + "\n" +
                "Special Attack: " + specialAttack + "\n" +
                "Special Defense: " + specialDefense + "\n");

            return stats;
        }
    }
}
    






        

        
