using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace randomize_button
{
    public partial class IndividualHeros : Form
    {
        MainWindow mw;
        int[] heroType = new int[5];        
        bool[] gender = new bool[5];       
        String[] hero_name = new String[5];
        String[] hero_type = new String[5];                   
        string herotype, heronames;
        bool h1WasClicked, h2WasClicked, h3WasClicked, h4WasClicked, h5WasClicked, herogender, femaleGenderClicked, maleGenderClicked;

        

        public IndividualHeros(MainWindow mwi)
        {          
            InitializeComponent();
            mw = mwi;
            hero_type = mw.heroTypeArray;
            hero_name = mw.heroNameArray;
            gender = mw.heroGenderArray;

            warriorHero.MouseEnter += new EventHandler(Warrior_MouseOver);
            warriorHero.MouseLeave += new EventHandler(Warrior_MouseOverLeave);

            mageHero.MouseEnter += new EventHandler(Mage_MouseOver);
            mageHero.MouseLeave += new EventHandler(Mage_MouseOverLeave);

            healerHero.MouseEnter += new EventHandler(Healer_MouseOver);
            healerHero.MouseLeave += new EventHandler(Healer_MouseOverLeave);

            hunterHero.MouseEnter += new EventHandler(Hunter_MouseOver);
            hunterHero.MouseLeave += new EventHandler(Hunter_MouseOverLeave);

            rogueHero.MouseEnter += new EventHandler(Rogue_MouseOver);
            rogueHero.MouseLeave += new EventHandler(Rogue_MouseOverLeave);
        }

        // this is the accept changes button.
        //when a player clicks this button it brings the player back to the main character creation screen.
        //it places the names and class so the person can see them.
        private void button1_Click(object sender, EventArgs e)
        {
            this.heroNamePlaceHolder();

            if (h1WasClicked == true)
            {
                

                    MessageBox.Show("these are the hero stats for hero 1");
                    MessageBox.Show("hero gender is: " + gender[0].ToString());
                    MessageBox.Show("hero name is: " + hero_name[0].ToString());
                    MessageBox.Show("this is hero type" + " " + hero_type[0].ToString());

                    mw.Hero1class.Content = hero_type[0];
                    mw.Hero1name.Content = hero_name[0];

                    
                }
            
                else if (h2WasClicked == true)
                {
                 
                        MessageBox.Show("these are the hero stats for hero 2");
                        MessageBox.Show("hero gender is: " + gender[1].ToString());
                        MessageBox.Show("hero name is: " + hero_name[1].ToString());
                        MessageBox.Show("this is hero type" + " " + hero_type[1].ToString());

                        mw.Hero1class.Content = hero_type[1];
                        mw.Hero1name.Content = hero_name[1];

                     
                    }
               
            else if (h3WasClicked == true)
            {
             
                    MessageBox.Show("these are the hero stats for hero 3");
                    MessageBox.Show("hero gender is: " + gender[2].ToString());
                    MessageBox.Show("hero name is: " + hero_name[2].ToString());
                    MessageBox.Show("this is hero type" + " " + hero_type[2].ToString());

                    mw.Hero1class.Content = hero_type[2];
                    mw.Hero1name.Content = hero_name[2];

                 
                }
              
            else if (h4WasClicked == true)
            {
              
                    MessageBox.Show("these are the hero stats for hero 4");
                    MessageBox.Show("hero gender is: " + gender[3].ToString());
                    MessageBox.Show("hero name is: " + hero_name[3].ToString());
                    MessageBox.Show("this is hero type" + " " + hero_type[3].ToString());

                    mw.Hero1class.Content = hero_type[3];
                    mw.Hero1name.Content = hero_name[3];

               
                }
             
                else if (h5WasClicked == true)
                {
                        MessageBox.Show("these are the hero stats for hero 5");
                        MessageBox.Show("hero gender is: " + gender[4].ToString());
                        MessageBox.Show("hero name is: " + hero_name[4].ToString());
                        MessageBox.Show("this is hero type" + " " + hero_type[4].ToString());

                        mw.Hero1class.Content = hero_type[4];
                        mw.Hero1name.Content = hero_name[4];

                     
                    }
            h1WasClicked = false;
            h2WasClicked = false;
            h3WasClicked = false;
            h4WasClicked = false;
            h5WasClicked = false;
            this.Hide(); 

            }
            
        


        //what happens when you click on the warrior button in the individual character creation screen.
        //shows a description of the character class.
        //determines which character is going to become the warrior based on the image that was clicked.
        //sets the position in the hero_type array to the proper hero.
        private void warriorHero_Click(object sender, EventArgs e)
        {
            h1WasClicked = mw.hero1WasClicked;
            h2WasClicked = mw.hero2WasClicked;
            h3WasClicked = mw.hero3WasClicked;
            h4WasClicked = mw.hero4WasClicked;
            h5WasClicked = mw.hero5WasClicked;
            if (h1WasClicked == true)
            {
                herotype = "Warrior";
                hero_type[0] = herotype;
                MessageBox.Show("this is hero 1" + " " + hero_type[0].ToString());
            }
            else if (h2WasClicked == true)
            {
                herotype = "Warrior";
                hero_type[1] = herotype;
                MessageBox.Show("this is hero 2" + " " + hero_type[1].ToString());
            }
            else if (h3WasClicked == true)
            {
                herotype = "Warrior";
                hero_type[2] = herotype;
                MessageBox.Show("this is hero 3" + " " + hero_type[2].ToString());
            }
            else if (h4WasClicked == true)
            {
                herotype = "Warrior";
                hero_type[3] = herotype;
                MessageBox.Show("this is hero 4" + " " + hero_type[3].ToString());
            }
            else if (h5WasClicked == true)
            {
                herotype = "Warrior";
                hero_type[4] = herotype;
                MessageBox.Show("this is hero 5" + " " + hero_type[4].ToString());
            }
            else
            {
                MessageBox.Show("Something isn't working");
            }
        }



        //what happens when you click on the hunter button in the individual character creation screen.
        //shows a description of the character class.
        //determines which character is going to become the warrior based on the image that was clicked.
        //sets the position in the hero_type array to the proper hero.
        private void hunterHero_Click(object sender, EventArgs e)
        {
          
            h1WasClicked = mw.hero1WasClicked;
            h2WasClicked = mw.hero2WasClicked;
            h3WasClicked = mw.hero3WasClicked;
            h4WasClicked = mw.hero4WasClicked;
            h5WasClicked = mw.hero5WasClicked;
            if (h1WasClicked == true)
            {
                herotype = "Hunter";
                hero_type[0] = herotype;
                MessageBox.Show("this is hero 1" + " " + hero_type[0].ToString());
            }
            else if (h2WasClicked == true)
            {
                herotype = "Hunter";
                hero_type[1] = herotype;
                MessageBox.Show("this is hero 2" + " " + hero_type[1].ToString());
            }
            else if (h3WasClicked == true)
            {
                herotype = "Hunter";
                hero_type[2] = herotype;
                MessageBox.Show("this is hero 3" + " " + hero_type[2].ToString());
            }
            else if (h4WasClicked == true)
            {
                herotype = "Hunter";
                hero_type[3] = herotype;
                MessageBox.Show("this is hero 4" + " " + hero_type[3].ToString());
            }
            else if (h5WasClicked == true)
            {
                herotype = "Hunter";
                hero_type[4] = herotype;
                MessageBox.Show("this is hero 5" + " " + hero_type[4].ToString());
            }
            else 
            {
                MessageBox.Show("Something isn't working");
            }
            
        }


         ///<HeroNames.Visibility = System.Windows.Visibility.Hidden;
            ///<HeroChoices.Visibility = System.Windows.Visibility.Hidden;
        
 

        //what happens when you click on the healer button in the individual character creation screen.
        //shows a description of the character class.
        //determines which character is going to become the healer based on the image that was clicked.
        //sets the position in the hero_type array to the proper hero.
        private void healerHero_Click(object sender, EventArgs e)
        {
            h1WasClicked = mw.hero1WasClicked;
            h2WasClicked = mw.hero2WasClicked;
            h3WasClicked = mw.hero3WasClicked;
            h4WasClicked = mw.hero4WasClicked;
            h5WasClicked = mw.hero5WasClicked;
            if (h1WasClicked == true)
            {
                herotype = "Healer";
                hero_type[0] = herotype;
                MessageBox.Show("this is hero 1" + " " + hero_type[0].ToString());
            }
            else if (h2WasClicked == true)
            {
                herotype = "Healer";
                hero_type[1] = herotype;
                MessageBox.Show("this is hero 2" + " " + hero_type[1].ToString());
            }
            else if (h3WasClicked == true)
            {
                herotype = "Healer";
                hero_type[2] = herotype;
                MessageBox.Show("this is hero 3" + " " + hero_type[2].ToString());
            }
            else if (h4WasClicked == true)
            {
                herotype = "Healer";
                hero_type[3] = herotype;
                MessageBox.Show("this is hero 4" + " " + hero_type[3].ToString());
            }
            else if (h5WasClicked == true)
            {
                herotype = "Healer";
                hero_type[4] = herotype;
                MessageBox.Show("this is hero 5" + " " + hero_type[4].ToString());
            }
            else
            {
                MessageBox.Show("Something isn't working");
            }
        }



        //what happens when you click on the mage button in the individual character creation screen.
        //shows a description of the character class.
        //determines which character is going to become the mage based on the image that was clicked.
        //sets the position in the hero_type array to the proper hero.
        private void mageHero_Click(object sender, EventArgs e)
        {                       
            h1WasClicked = mw.hero1WasClicked;
            h2WasClicked = mw.hero2WasClicked;
            h3WasClicked = mw.hero3WasClicked;
            h4WasClicked = mw.hero4WasClicked;
            h5WasClicked = mw.hero5WasClicked;
            if (h1WasClicked == true)
            {
                herotype = "Mage";
                hero_type[0] = herotype;
                MessageBox.Show("this is hero 1" + " " + hero_type[0].ToString());
            }
            else if (h2WasClicked == true)
            {
                herotype = "Mage";
                hero_type[1] = herotype;
                MessageBox.Show("this is hero 2" + " " + hero_type[1].ToString());
            }
            else if (h3WasClicked == true)
            {
                herotype = "Mage";
                hero_type[2] = herotype;
                MessageBox.Show("this is hero 3" + " " + hero_type[2].ToString());
            }
            else if (h4WasClicked == true)
            {
                herotype = "Mage";
                hero_type[3] = herotype;
                MessageBox.Show("this is hero 4" + " " + hero_type[3].ToString());
            }
            else if (h5WasClicked == true)
            {
                herotype = "Mage";
                hero_type[4] = herotype;
                MessageBox.Show("this is hero 5" + " " + hero_type[4].ToString());
            }
            else
            {
                MessageBox.Show("Something isn't working");
            }
        }


        //what happens when you click on the rogue button in the individual character creation screen.
        //shows a description of the character class.
        //determines which character is going to become the rogue based on the image that was clicked.
        //sets the position in the hero_type array to the proper hero.
        private void rogueHero_Click(object sender, EventArgs e)
        {
            h1WasClicked = mw.hero1WasClicked;
            h2WasClicked = mw.hero2WasClicked;
            h3WasClicked = mw.hero3WasClicked;
            h4WasClicked = mw.hero4WasClicked;
            h5WasClicked = mw.hero5WasClicked;
            if (h1WasClicked == true)
            {
                herotype = "Rogue";
                hero_type[0] = herotype;
                MessageBox.Show("this is hero 1" + " " + hero_type[0].ToString());
            }
            else if (h2WasClicked == true)
            {
                herotype = "Rogue";
                hero_type[1] = herotype;
                MessageBox.Show("this is hero 2" + " " + hero_type[1].ToString());
            }
            else if (h3WasClicked == true)
            {
                herotype = "Rogue";
                hero_type[2] = herotype;
                MessageBox.Show("this is hero 3" + " " + hero_type[2].ToString());
            }
            else if (h4WasClicked == true)
            {
                herotype = "Rogue";
                hero_type[3] = herotype;
                MessageBox.Show("this is hero 4" + " " + hero_type[3].ToString());
            }
            else if (h5WasClicked == true)
            {
                herotype = "Rogue";
                hero_type[4] = herotype;
                MessageBox.Show("this is hero 5" + " " + hero_type[4].ToString());
            }
            else
            {
                MessageBox.Show("Something isn't working");
            }
        }


        //this is what happens if the person clicks the male gender button.
        //it puts female boolean into the array at the correct location.
        private void maleChoice_Click(object sender, EventArgs e)
        {

            maleGenderClicked = true;
            
            h1WasClicked = mw.hero1WasClicked;
            h2WasClicked = mw.hero2WasClicked;
            h3WasClicked = mw.hero3WasClicked;
            h4WasClicked = mw.hero4WasClicked;
            h5WasClicked = mw.hero5WasClicked;

            if (h1WasClicked == true)
            {
                herogender = true;
                gender[0] = herogender;
                MessageBox.Show("this is hero 1" + " " + gender[0].ToString());
            }
            else if (h2WasClicked == true)
            {
                herogender = true;
                gender[1] = herogender;
                MessageBox.Show("this is hero 2" + " " + gender[1].ToString());
            }
            else if (h3WasClicked == true)
            {
                herogender = true;
                gender[2] = herogender;
                MessageBox.Show("this is hero 3" + " " + gender[2].ToString());
            }
            else if (h4WasClicked == true)
            {
                herogender = true;
                gender[3] = herogender;
                MessageBox.Show("this is hero 4" + " " + gender[3].ToString());
            }
            else if (h5WasClicked == true)
            {
                herogender = true;
                gender[4] = herogender;
                MessageBox.Show("this is hero 5" + " " + gender[4].ToString());
            }
            else
            {
                MessageBox.Show("Something isn't working");
            }
        }



        //this is what happens if the person clicks the female gender button.
        //it puts female boolean into the array at the correct location.
        private void femaleChoice_Click(object sender, EventArgs e)
        {
            femaleGenderClicked = true;
            
            h1WasClicked = mw.hero1WasClicked;
            h2WasClicked = mw.hero2WasClicked;
            h3WasClicked = mw.hero3WasClicked;
            h4WasClicked = mw.hero4WasClicked;
            h5WasClicked = mw.hero5WasClicked;
            if (h1WasClicked == true)
            {
                herogender = false;
                gender[0] = herogender;
                MessageBox.Show("this is hero 1" + " " + gender[0].ToString());
            }
            else if (h2WasClicked == true)
            {
                herogender = false;
                gender[1] = herogender;
                MessageBox.Show("this is hero 2" + " " + gender[1].ToString());
            }
            else if (h3WasClicked == true)
            {
                herogender = false;
                gender[2] = herogender;
                MessageBox.Show("this is hero 3" + " " + gender[2].ToString());
            }
            else if (h4WasClicked == true)
            {
                herogender = false;
                gender[3] = herogender;
                MessageBox.Show("this is hero 4" + " " + gender[3].ToString());
            }
            else if (h5WasClicked == true)
            {
                herogender = false;
                gender[4] = herogender;
                MessageBox.Show("this is hero 5" + " " + gender[4].ToString());
            }
            else
            {
                MessageBox.Show("Something isn't working");
            }
        }

        

     
        //this is the event that handles when the mouse enters the warrior button.
        //the text will pop up explaining the warrior class.
        private void Warrior_MouseOver(object sender, EventArgs e)
        {
            heroDescription.Visible = true;
            heroDescription.Text = "This is the Warrior class." +
                "Warriors have the most health and physical defense of the game." +
                " Because warriors have the most health, they are the slowest moving characters in the game";
        }

        //this is the event that handles when the mouse leaves the warrior button.
        //the text and the textbox will no longer be visible.
        private void Warrior_MouseOverLeave(object sender, EventArgs e)
        {
            heroDescription.Text = "";
            heroDescription.Visible = false;
        }

        //this is the event that handles when the mouse enters the hunter button.
        //the text will pop up explaining the hunter class.
        private void Hunter_MouseOver(object sender, EventArgs e)
        {
            heroDescription.Visible = true;
            heroDescription.Text = "This is the Hunter class." +
                "Hunters have the average health and physical defense." +
                " Hunters can attack at a distance, meaning they don't have to be directly next to an enemy in order to attack" +
                " They are useful when you want to attack and avoid taking damage.";
        }


        //this is the event that handles when the mouse leaves the hunter button.
        //the text and the textbox will no longer be visible.
        private void Hunter_MouseOverLeave(object sender, EventArgs e)
        {
            heroDescription.Text = "";
            heroDescription.Visible = false;
        }


        //this is the event that handles when the mouse enters the healer button.
        //the text will pop up explaining the healer class.
        private void Healer_MouseOver(object sender, EventArgs e)
        {
            heroDescription.Visible = true;
            heroDescription.Text = "This is the Healer class." +
                 "Healers have the below average health and the lowest physical defense in the game." +
                 " Healers only have one basic attack, but their three special attacks allow them to heal their team-mates." +
                 " A nicely timed heal could make the difference between victory and defeat.";
        }

        //this is the event that handles when the mouse leaves the healer button.
        //the text and the textbox will no longer be visible.
        private void Healer_MouseOverLeave(object sender, EventArgs e)
        {
            heroDescription.Text = "";
            heroDescription.Visible = false;
        }

        //this is the event that handles when the mouse enters the healer button.
        //the text will pop up explaining the healer class.
        private void Mage_MouseOver(object sender, EventArgs e)
        {
            heroDescription.Visible = true;
            heroDescription.Text = "This is the Mage class." +
                "Mages have the least health and second least physical defense of the game." +
                " Because Mages have the so little health, they are the hardest hitting characters in the game." +
                " Be careful not to let the mages get hit because they won't survive long if out in the open.";
        }

        //this is the event that handles when the mouse leaves the mage button.
        //the text and the textbox will no longer be visible.
        private void Mage_MouseOverLeave(object sender, EventArgs e)
        {
            heroDescription.Text = "";
            heroDescription.Visible = false;
        }


        //this is the event that handles when the mouse enters the rogue button.
        //the text will pop up explaining the rogue class.
        private void Rogue_MouseOver(object sender, EventArgs e)
        {
            heroDescription.Visible = true;
            heroDescription.Text = "This is the Rogue class." +
                "Rogue have the second least health and least physical defense of the game." +
                " Because Rogue have the so little health, they are the fastest moving characters in the game." +
                " These fast characters use speed and their special attacks to incapacitate their foes and escape before taking damage.";
        }

        //this is the event that handles when the mouse leaves the rogue button.
        //the textbox will disappear, as will the text.
        private void Rogue_MouseOverLeave(object sender, EventArgs e)
        {
            heroDescription.Text = "";
            heroDescription.Visible = false;
        }
     
   



        //this method holds the names from the textbox so they can be retrieved when needed.
        //it returns the array index with the hero's name.
        private String heroNamePlaceHolder()
        {
            h1WasClicked = mw.hero1WasClicked;
            h2WasClicked = mw.hero2WasClicked;
            h3WasClicked = mw.hero3WasClicked;
            h4WasClicked = mw.hero4WasClicked;
            h5WasClicked = mw.hero5WasClicked;

            if (h1WasClicked == true)
            {
                heronames = textBox1.Text;
                hero_name[0] = heronames;
                return hero_name[0];
            }
            else if (h2WasClicked == true)
            {
                heronames = textBox1.Text; 
                hero_name[1] = heronames;
                return hero_name[1];
            }
            else if (h3WasClicked == true)
            {
                heronames = textBox1.Text; 
                hero_name[2] = heronames;
                return hero_name[2];
            }
            else if (h4WasClicked == true)
            {
                heronames = textBox1.Text; 
                hero_name[3] = heronames;
                return hero_name[3];
            }
            else if (h5WasClicked == true)
            {
                heronames = textBox1.Text; 
                hero_name[4] = heronames;
                return hero_name[4];
            }
            else
            {
                string crapfest = "Something isn't working";
                return crapfest;

            }
        }
        
    }
}
