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
using Helper_Classes_namespace;
using System.Xml;
using System.Data;
using Amazing_charts_sample_program;
using System.Text.RegularExpressions;

namespace Amazing_charts_sample_program_wpf
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        
        private Amazing_charts_sample_program.FirstNameClass _firstNameClass = new FirstNameClass();
        private LastNameClass _lastNameClass = new LastNameClass();
        private DateOfBirth _dateOfBirth = new DateOfBirth();
        private PhoneClass _phone = new PhoneClass();
        private DataTable table;
        private List<Amazing_charts_sample_program_Patient_Format> dataSet;
        private bool selectedFromDatgaSet = true;

        public MainWindow()
        {
            setUpDbConnection();            
            InitializeComponent();
            selectAllFromDataSet();
            setFocusOnTextBox();
            first_name_text.MouseDoubleClick  += new MouseButtonEventHandler(mouseDBL_Click);
            last_name_text.MouseDoubleClick += new MouseButtonEventHandler(mouseDBL_Click);
            date_of_birth_text.MouseDoubleClick += new MouseButtonEventHandler(mouseDBL_Click);
            phone_text.MouseDoubleClick += new MouseButtonEventHandler(mouseDBL_Click);
        }
        private void mouseDBL_Click(object sender, MouseEventArgs e)
        {
            ClearTextBox();
            selectAllFromDataSet();
        }
        private void ClearTextBox()
        {
            age_text.Text = "";
            first_name_text.Text = "";
            last_name_text.Text = "";
            date_of_birth_text.Text = "";
            phone_text.Text = "";

        }
        static void setUpDbConnection()
        {
            String configurationString = "";

            XmlDocument doc = new XmlDocument();
            try
            {
                doc.Load("../../databaseconf.xml");
                foreach (XmlNode _node in doc.DocumentElement.ChildNodes)
                {
                    configurationString += _node.InnerText;
                    configurationString += ";";
                }
                Console.WriteLine(configurationString);
                Helper_Classes_namespace.DataBaseHelperClass.SettingDbConnection(configurationString);
            }
            catch(System.Exception em)
            {
                Helper_Classes_namespace.ErrorMessages.setErrorMessage(em.ToString(),true);
                MessageBox.Show("database File is missing ");
            }
        }
       
        private void OnFocus(object sender, EventArgs e)
        {
            selectedFromDatgaSet = false;
            //dataSetView.CellClick += DataGridView1_CellContentClick_3;

        }
        private void setFocusOnTextBox()
        {
            first_name_text.GotFocus += OnFocus;
            last_name_text.GotFocus += OnFocus;
            date_of_birth_text.GotFocus += OnFocus;
            phone_text.GotFocus += OnFocus;
        }
        private void first_name_text_TextChanged(object sender, TextChangedEventArgs e)
        {
            if (first_name_text.Text == "") return;
            if (!Regex.Match(first_name_text.Text, @"^[a-zA-Z'.]{1,40}$").Success)
            {
                MessageBox.Show("Invalid first name");
                return;
            }
            
            if (!selectedFromDatgaSet)
            {                
                dataSet = FirstNameClass.getFirstName1(new List<Amazing_charts_sample_program_Patient_Format>(), getTextBoxData(new Patient()));
                if (dataSet.Count == 0 && Helper_Classes_namespace.ErrorMessages.getErrorMessage().CompareTo("") != 0)
                {
                    MessageBox.Show(Helper_Classes_namespace.ErrorMessages.getErrorMessage());
                    return;
                }
                createDataSet1(dataSet);
            }
            

        }
        private Patient getTextBoxData(Patient p)
        {
            p.FirstName = first_name_text.Text;
            p.LastName = last_name_text.Text;
            p.DateOfBirth = date_of_birth_text.Text;
            p.PhoneNumber = phone_text.Text;
            return p;
        }
        private void createDataSet1(List<Amazing_charts_sample_program_Patient_Format> data)
        {

            data_set_display.ItemsSource = "";
            table = new DataTable();

            table.Columns.Add("Index", typeof(int));
            table.Columns.Add("First Name", typeof(string));
            table.Columns.Add("Last Name", typeof(string));
            table.Columns.Add("Date of Birth", typeof(string));
            table.Columns.Add("Phone", typeof(string));
            for (int i = 0; i < dataSet.Count; i++)
            {
               table.Rows.Add(i, dataSet[i].FirstName, dataSet[i].LastName, dataSet[i].DateOfBirth, dataSet[i].PhoneNumber).CancelEdit();
            }

            data_set_display.ItemsSource = table.DefaultView;
            
        }
        private void last_name_text_TextChanged(object sender, TextChangedEventArgs e)
        {
            
            if (last_name_text.Text == "") return;

            if (!Regex.Match(last_name_text.Text, @"^[a-zA-Z'.]{1,40}$").Success)
            {
                MessageBox.Show(" Invalid last name ");
                return;
            }
            if (!selectedFromDatgaSet)
            {
                dataSet = _lastNameClass.getLastName(new List<Amazing_charts_sample_program_Patient_Format>(), getTextBoxData(new Patient()));
                if (dataSet.Count == 0 && Helper_Classes_namespace.ErrorMessages.getErrorMessage().CompareTo("") != 0)
                {
                    MessageBox.Show(Helper_Classes_namespace.ErrorMessages.getErrorMessage());
                    return;
                }
                createDataSet1(dataSet);
            }
        }

        private void date_of_birth_text_TextChanged(object sender, TextChangedEventArgs e)
        {
            
            age_text.Text = "";
            if (date_of_birth_text.Text == "")
            {
                return;
            }
            if (!Regex.Match(date_of_birth_text.Text, @"\d{2}/\d{2}/\d{4}").Success)
            {
                return;
            }
            if (!_dateOfBirth.testDate(date_of_birth_text.Text))
            {
                MessageBox.Show(Helper_Classes_namespace.ErrorMessages.getErrorMessage());
                return;
            }
            if (!selectedFromDatgaSet)
            {
                dataSet = _dateOfBirth.getDateOfBirth(new List<Amazing_charts_sample_program_Patient_Format>(), getTextBoxData(new Patient()));
                if (dataSet.Count == 0)
                {
                    MessageBox.Show(Helper_Classes_namespace.ErrorMessages.getErrorMessage());
                    return;
                }
                createDataSet1(dataSet);
            }
            age_text.Text = _dateOfBirth.getAgeByBirthDate(date_of_birth_text.Text);

        }

        private void phone_text_TextChanged(object sender, TextChangedEventArgs e)
        {

            if (phone_text.Text == "")
            {
                return;
            }
            if (!Regex.Match(phone_text.Text, @"^\d{3}-\d{3}-\d{4}$").Success) return;

            if (!_phone.testPhoneFormat(phone_text.Text))
            {
                MessageBox.Show(Helper_Classes_namespace.ErrorMessages.getErrorMessage());
                return;
            }
        }

        private void data_set_display_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            setFocusOnTextBox();
            string index = data_set_display.SelectedIndex.ToString();
            if (dataSet.Count <= Int32.Parse(index) || Int32.Parse(index) < 0)
                return;
            ClearTextBox();
            selectedFromDatgaSet = true;                   
            first_name_text.Text = dataSet[Int32.Parse(index)].FirstName;
            last_name_text.Text = dataSet[Int32.Parse(index)].LastName;
            date_of_birth_text.Text = dataSet[Int32.Parse(index)].DateOfBirth;
            phone_text.Text = dataSet[Int32.Parse(index)].PhoneNumber;
            age_text.Text = dataSet[Int32.Parse(index)].Age;
            
            try
            {

                
                data_set_display.ItemsSource = "";
                table = new DataTable();
                table.Columns.Add("Index", typeof(int));
                table.Columns.Add("First Name", typeof(string));
                table.Columns.Add("Last Name", typeof(string));
                table.Columns.Add("Date of Birth", typeof(string));
                table.Columns.Add("Phone", typeof(string));
                table.Rows.Add(0, first_name_text.Text, last_name_text.Text, date_of_birth_text.Text, phone_text.Text).CancelEdit();
                data_set_display.ItemsSource = table.DefaultView;
            }
            catch (IndexOutOfRangeException mes)
            {

            }
            
            
        }

        private void save_button_Click(object sender, RoutedEventArgs e)
        {
            if (!testTextBox()) return;

            string query = "SELECT * from credentials where first_name = '" + first_name_text.Text
                            + "' AND last_name = '" + last_name_text.Text
                            + "' AND date_of_birth = '" + date_of_birth_text.Text + "'";


            string logEvent = "";

            var response = Helper_Classes_namespace.DataBaseHelperClass.GlobalPerformQuery(query);
            if (response.hasErrors)
            {
                MessageBox.Show(Helper_Classes_namespace.ErrorMessages.getErrorMessage());
                Helper_Classes_namespace.DataBaseHelperClass.ClosePerformQuery();
                return;
            }
            
            if (response.reader.HasRows)
            {
                query = "UPDATE credentials set first_name = '" + first_name_text.Text
                            + "' ,last_name = '" + last_name_text.Text
                            + "' ,date_of_birth = '" + date_of_birth_text.Text
                            + "' ,phone = '" + phone_text.Text
                            + "' where first_name = '" + first_name_text.Text
                            + "' AND last_name = '" + last_name_text.Text
                            + "' AND date_of_birth = '" + date_of_birth_text.Text + "'";
                logEvent = "UPDATED \n" + first_name_text.Text
                            + "\n" + last_name_text.Text
                            + "\n" + date_of_birth_text.Text.ToString()
                            + "\n" + phone_text.Text;
            }
            else
            {
                query = "INSERT INTO credentials(first_name,last_name,date_of_birth,phone) VALUES('" + first_name_text.Text + "','" + last_name_text.Text + "','" + date_of_birth_text.Text + "','" + phone_text.Text + "')";
                logEvent = "INSERTED \n" + first_name_text.Text
                            + "\n" + last_name_text.Text
                            + "\n" + date_of_birth_text.Text.ToString()
                            + "\n" + phone_text.Text;
            }
            windows_event_log.AppendText("\n<---------------------->\n");
            windows_event_log.AppendText(logEvent);
            Helper_Classes_namespace.PerformWriteToFileAction.writeToLogFile(logEvent.Replace('\n', ' ') + " " + Helper_Classes_namespace.HelperClass.getSystemDateTime().ToLocalTime().ToString());
            Helper_Classes_namespace.DataBaseHelperClass.ClosePerformQuery();
            
            if (Helper_Classes_namespace.DataBaseHelperClass.GlobalPerformQuery(query).hasErrors)
            {
                MessageBox.Show(Helper_Classes_namespace.ErrorMessages.getErrorMessage());
                Helper_Classes_namespace.DataBaseHelperClass.ClosePerformQuery();
                return;
            }
            Helper_Classes_namespace.DataBaseHelperClass.ClosePerformQuery();
            MessageBox.Show(" Field Inserted !!!!!!! ");
            
            data_set_display.ItemsSource = "";
            table = new DataTable();
            table.Columns.Add("Index", typeof(int));
            table.Columns.Add("First Name", typeof(string));
            table.Columns.Add("Last Name", typeof(string));
            table.Columns.Add("Date of Birth", typeof(string));
            table.Columns.Add("Phone", typeof(string));
            table.Rows.Add(0, first_name_text.Text, last_name_text.Text, date_of_birth_text.Text, phone_text.Text).CancelEdit();
            data_set_display.ItemsSource = table.DefaultView;
           
        }
        private bool testTextBox()
        {
            if (!_firstNameClass.testFirstName(first_name_text.Text))
            {
                MessageBox.Show(Helper_Classes_namespace.ErrorMessages.getErrorMessage());
                return false;
            }
            if (!_lastNameClass.testLastName(last_name_text.Text))
            {
                MessageBox.Show(Helper_Classes_namespace.ErrorMessages.getErrorMessage());
                return false;
            }

            if (!_dateOfBirth.testDate(date_of_birth_text.Text))
            {
                MessageBox.Show(Helper_Classes_namespace.ErrorMessages.getErrorMessage());
                return false;
            }

            if (!_phone.testPhoneFormat(phone_text.Text))
            {
                MessageBox.Show(Helper_Classes_namespace.ErrorMessages.getErrorMessage());
                return false;
            }
            return true;
        }
        private void create_file_button_Click(object sender, RoutedEventArgs e)
        {
            if (!testTextBox()) return;
            string query = "SELECT * from credentials where first_name = '" + first_name_text.Text
                             + "' AND last_name = '" + last_name_text.Text
                             + "' AND date_of_birth = '" + date_of_birth_text.Text + "'";
            try
            {
                var response = Helper_Classes_namespace.DataBaseHelperClass.GlobalPerformQuery(query);
                if (response.hasErrors)
                {
                    MessageBox.Show(Helper_Classes_namespace.ErrorMessages.getErrorMessage());
                    Helper_Classes_namespace.DataBaseHelperClass.ClosePerformQuery();
                    return;
                }
                

                if (!response.reader.HasRows)
                {
                    MessageBox.Show(" Patient is not Saved!!!!!!");
                    Helper_Classes_namespace.DataBaseHelperClass.ClosePerformQuery();
                    return;
                }
                Helper_Classes_namespace.DataBaseHelperClass.ClosePerformQuery();
            }
            catch (System.Exception em)
            {
                Helper_Classes_namespace.ErrorMessages.setErrorMessage(em.ToString(), true);
                return;
            }

            string fileName = @"../../../" + first_name_text.Text + "_" + last_name_text.Text + "_" + date_of_birth_text.Text.Replace('/', '-') + "_" + Helper_Classes_namespace.HelperClass.getSystemDateTime().ToLocalTime().ToString().Replace('/', '-').Replace(' ', '_').Replace(':', '-') + ".txt";
            string contactInformation = "First Name : " + first_name_text.Text + "\r\n"
                                        + "Last Name : " + last_name_text.Text + "\r\n"
                                        + "Date Of Birth : " + date_of_birth_text.Text + "\r\n"
                                        + "Phone :" + phone_text.Text;
            string logEvent = " >> created file " + first_name_text.Text + "_" + last_name_text.Text + "_" + date_of_birth_text.Text.Replace('/', '-') + ".txt on " + Helper_Classes_namespace.HelperClass.getSystemDateTime().ToLocalTime();
            windows_event_log.AppendText("\n<---------------------->\n");
            windows_event_log.AppendText(logEvent);
            Helper_Classes_namespace.PerformWriteToFileAction.writeToLogFile(logEvent);
            Helper_Classes_namespace.PerformWriteToFileAction.createPatientFile(fileName, contactInformation);
            MessageBox.Show(" File Created ");
        }

        private void windows_event_log_TextChanged(object sender, TextChangedEventArgs e)
        {
            windows_event_log.ScrollToEnd();
        }
        private void selectAllFromDataSet()
        {
            string query = "SELECT * from credentials";
            var response = Helper_Classes_namespace.DataBaseHelperClass.GlobalPerformQuery(query);
            if (!(response.hasErrors))
            {
                
                dataSet = new List<Amazing_charts_sample_program_Patient_Format>();
                int index = 0;
                while (response.reader.Read())
                {
                    Patient patient = new Patient();
                    patient.FirstName = response.reader["first_name"].ToString();
                    patient.LastName = response.reader["last_name"].ToString();
                    patient.DateOfBirth = response.reader["date_of_birth"].ToString();
                    patient.PhoneNumber = response.reader["phone"].ToString();
                    string[] tempDate = Helper_Classes_namespace.HelperClass.getSystemDateTime().Date.ToString().Split(' ');
                    patient.Age = Helper_Classes_namespace.HelperClass.getTotAge(patient.DateOfBirth, tempDate[0]);
                    dataSet.Insert(index, patient);
                    index++;

                }
                Helper_Classes_namespace.DataBaseHelperClass.ClosePerformQuery();
                dataSet = _lastNameClass.QuickSortNow(dataSet, 0, dataSet.Count - 1);
                createDataSet1(dataSet);
            }
            else
            {
                MessageBox.Show(Helper_Classes_namespace.ErrorMessages.getErrorMessage());
                return;
            }
        }
    }
}
