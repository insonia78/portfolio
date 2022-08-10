using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace OptionsMenu
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            // Creates the window.
            InitializeComponent();
            // Plays the background music when the window is launched.
            Bgm.Play();
        }

        /**
         * This event moves the entire window around when the player holds down on the Title Bar.
         */
        private void Title_Bar_MouseDown(object sender, MouseButtonEventArgs e)
        {
            // lets you drag the window around.
            this.DragMove();
        }

        /**
         * This event moves the entire window around when the player holds down on the Options Title.
         */
        private void Title_MouseDown(object sender, MouseButtonEventArgs e)
        {
            // lets you drag the window around.
            this.DragMove();
        }

        /**
         * This event hides the Options screen from view when the player clicks on the Exit Button in the corner.
         */
        private void Exit_Button_Click(object sender, RoutedEventArgs e)
        {
            // hides the window from view.
            this.Hide();
        }

        /**
         * This event mutes the bgm. It also toggles the color of the button to red when muting the sound.
         * It takes the red button style from the on button since the on button will always be red when music is not muted.
         */
        private void Sound_Off_Button_Click(object sender, RoutedEventArgs e)
        {
            // if statement, makes changes to the window only if the music hasnt been muted.
            if(!Bgm.IsMuted)
            {
                Bgm.IsMuted = true;
                Style red = Sound_On_Button.Style;          // holds the red button style from the on button.
                Style black = Sound_Off_Button.Style;       // holds the blank button style from the off button.

                // swaps color styles with on and off.
                Sound_Off_Button.Style = red;
                Sound_On_Button.Style = black;
            }
        }

        /**
         * This event unmutes the bgm. It also toggles the color of the button to red when unmuting the sound.
         * It takes the red button style from the off button since the off button will always be red when music is muted.
         */
        private void Sound_On_Button_Click(object sender, RoutedEventArgs e)
        {
            // if statement, makes changes to the window only if the music hasnt been muted.
            if(Bgm.IsMuted)
            {
                Bgm.IsMuted = false;
                Style red = Sound_Off_Button.Style;         // holds the red button style from the off button.
                Style black = Sound_On_Button.Style;        // holds the blank button style from the on button.

                // swaps color styles with on and off.
                Sound_On_Button.Style = red;
                Sound_Off_Button.Style = black;
            }
        }

        /*
         * This Event starts the BGM over when it finishes playing, causing it to loop.
         */
        private void Bgm_MediaEnded(object sender, RoutedEventArgs e)
        {
            Bgm.Position = TimeSpan.Zero;
            Bgm.Play();
        }

        /*
         * This event returns the player to the main Title Screen.
         */
        private void Return_Main_Menu_Click(object sender, RoutedEventArgs e)
        {
            // shuts down the instance of the wpf application.
            Application.Current.Shutdown();
        }

        
    }
}
