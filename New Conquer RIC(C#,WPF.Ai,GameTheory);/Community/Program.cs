using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community
{
    class Program
    {
        [STAThread]
        static void Main(string[] args)
        {
            
            // fields
            //Character characterTest = new Character();  // variable to test the character class.
            //Hero heroTest = new Hero();                 // variable to test the hero class.
            Hero hero1 = new SoftwareEngineer("Stuart", true);// variable to test the S.E. class as a Hero.
            //Hero hero2 = new InformationSecurity("Peter", true);// variable to test the I.S.
            //Hero hero3 = new NetworkArchitect("Tara", false);// variable to test the N.A.
            //Hero hero4 = new SupportEngineer("Melissa", false);// variable to test the S.E.
            //Hero hero5 = new SystemsAnalyst("Jack", true);// variable to test the S.A.

            //Enemy villian = new CampusPolice();// variable to test the C.P.
            //Enemy villian2 = new FoodServer();// variable to test the F.S.
            //Enemy villian3 = new Gardener();// variable to test the Gardener.

            //Enemy raven = new Boss("Dr. Ravenscroft", true);// variable to test the Boss.

            //Enemy enemyTest = new Enemy();              // variable to test the enemy class.

            // arrays to hold heroes and enemies.
            //Hero[] heroes = new Hero[] {hero1, hero2, hero3, hero4, hero5};
            //Enemy[] enemies = new Enemy[] {villian, villian2, villian3};

            // test content of the Character and hero class.
            //Console.WriteLine("\n" + heroTest.toString());

            // test content of the Enemy class.
            //Console.WriteLine(enemyTest.ToString());

            // test content of the software engineer as a hero.
            Console.WriteLine(hero1.ToString());

            // print test for heroes
           // foreach(Hero index in heroes)
             //   Console.WriteLine(index.ToString());

            // print test for enemies
         //   foreach (Enemy index in enemies)
         //       Console.WriteLine(index.ToString());

            // print test for the boss.
            //Console.WriteLine(raven.ToString());

            // hold the terminal open to view the stats.
            Console.ReadLine();
        }
    }
}
