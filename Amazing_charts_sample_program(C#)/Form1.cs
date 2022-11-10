using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Data.SqlClient;
using System.Text.RegularExpressions;
using Helper_Classes_namespace;
namespace Amazing_charts_sample_program
{
    public partial class amazing_charts_sample_application : Form
    {
        
        private FirstNameClass _firstNameClass = new FirstNameClass();
        private LastNameClass _lastNameClass = new LastNameClass();
        private DateOfBirth _dateOfBirth = new DateOfBirth();
        private PhoneClass _phone = new PhoneClass();
        private DataTable table;
        private string[] dataSet;
        private bool selectedFromDatgaSet = false;
        public amazing_charts_sample_application()
        {
            InitializeComponent();
            dataSetView.CellClick += DataGridView1_CellContentClick_3;
            setFocusOnTextBox();
            selectAllFromDataSet();
        }
        private void setFocusOnTextBox()
        {
            first_name_txt.GotFocus += OnFocus;
            last_name_txt.GotFocus += OnFocus;
            date_of_birth_txt.GotFocus += OnFocus;
            phone_txt_box.GotFocus += OnFocus;
        }
        private void removeFocusOnTextBox()
        {
            first_name_txt.GotFocus -= OnFocus;
            last_name_txt.GotFocus -= OnFocus;
            date_of_birth_txt.GotFocus -= OnFocus;
            phone_txt_box.GotFocus -= OnFocus;
        }
        private void OnFocus(object sender, EventArgs e)
        {
            selectedFromDatgaSet = false;
            dataSetView.CellClick += DataGridView1_CellContentClick_3;
            ClearTextBox();
            selectAllFromDataSet();
            removeFocusOnTextBox();
        }

        private void ClearTextBox()
        {
            age_txt_box.Text = "";
            first_name_txt.Text = "";
            last_name_txt.Text = "";
            date_of_birth_txt.Text= "";
            phone_txt_box.Text = "";

        }
        private void first_name_txt_TextChanged(object sender, EventArgs e)
        {           
            if (first_name_txt.Text == "") return;            
            if (!Regex.Match(first_name_txt.Text, @"^[a-zA-Z'.]{1,40}$").Success)
            {
                MessageBox.Show("Invalid first name");
                return ;
            }
            if(!selectedFromDatgaSet)
               createDataSet(_firstNameClass.getFirstName(first_name_txt.Text));
        }
        private void createDataSet(string data)
        {
            
            dataSetView.DataSource = "";
            table = new DataTable();
            table.Columns.Add("Index", typeof(int));
            table.Columns.Add("First Name", typeof(string));
            table.Columns.Add("Last Name", typeof(string));
            table.Columns.Add("Date of Birth", typeof(string));
            table.Columns.Add("Phone", typeof(string));
            dataSet = data.Split('&');            
            for (int i = 0; i < dataSet.Length;i++)
            {
                string[] tempData = dataSet[i].Split(',');
                if (tempData[0] == "")
                    continue;
                table.Rows.Add(i, tempData[0], tempData[1], tempData[2], tempData[3]).CancelEdit();
            }
            
            dataSetView.DataSource = table;
        }
        private void last_name_txt_TextChanged(object sender, EventArgs e)
        {
            
            if (last_name_txt.Text == "")return ;
            
            if (!Regex.Match(last_name_txt.Text, @"^[a-zA-Z'.]{1,40}$").Success)
            {
                MessageBox.Show(" Invalid last name ");
                return ;
            }
            if (!selectedFromDatgaSet)
                createDataSet(_lastNameClass.getLastName(last_name_txt.Text));
        }
        private void getIndex(object sender, EventArgs e)
        {
            
        }
        private void date_of_birth_txt_TextChanged(object sender, EventArgs e)
        {
           
            age_txt_box.Text = "";
            if (date_of_birth_txt.Text == "")
            {                
                return ;
            }
            if (!Regex.Match(date_of_birth_txt.Text, @"\d{2}/\d{2}/\d{4}").Success)
            {
                if(date_of_birth_txt.Text.Length >= 10)
                    MessageBox.Show(" Invalid birth date mm/dd/yyyy ");
                return;
            }            
            if (!Helper_Classes_namespace.HelperClass.CompareDate(date_of_birth_txt.Text))
            {
                MessageBox.Show(" Invalid birth range date is over current date");
                return ;
            }
            try
            {
                DateTime dt = DateTime.Parse(date_of_birth_txt.Text);
            }
            catch
            {
                MessageBox.Show(" Invalid birth format range");
                return ;
            }
            if (!Regex.Match(date_of_birth_txt.Text, @"\d{2}/\d{2}/\d{4}").Success)
            {
                MessageBox.Show("mm/dd/yyyy Invalid birth format ");
                return ;
            }
            age_txt_box.Text = _dateOfBirth.getAgeByBirthDate(date_of_birth_txt.Text);
            if (!selectedFromDatgaSet)
                createDataSet(_dateOfBirth.getDateOfBirth(date_of_birth_txt.Text));
        }

        private void phone_txt_box_TextChanged(object sender, EventArgs e)
        {
            
            if (phone_txt_box.Text == "")
            {                
                return ;
            }
            if (!Regex.Match(phone_txt_box.Text, @"^\d{3}-\d{3}-\d{4}$").Success)return;
            
            if (!Regex.Match(phone_txt_box.Text, @"^\d{3}-\d{3}-\d{4}$").Success)
            {
                MessageBox.Show("xxx-xxx-xxxx phone number format is invalid!!!!!!! ");
                return;
            }
        }

        private void age_txt_box_TextChanged(object sender, EventArgs e)
        {

        }

        private void table_name_box_TextChanged(object sender, EventArgs e)
        {

        }

        private void Form1_Load(object sender, EventArgs e)
        {

        }

        private void listBox1_SelectedIndexChanged(object sender, EventArgs e)
        {

        }

        private void comboBox1_SelectedIndexChanged(object sender, EventArgs e)
        {

        }

        private void dataGridView1_CellContentClick(object sender, DataGridViewCellEventArgs e)
        {
           
        }
        private void selectAllFromDataSet()
        {
            try
            {
                string query = "SELECT * from credentials";
                var response = Helper_Classes_namespace.DataBaseHelperClass.GlobalPerformQuery(query);
                if (!(response == null))
                {
                    SqlDataReader reader = response.ExecuteReader();
                    string data = "";
                    while (reader.Read())
                    {
                        data += reader["first_name"].ToString() + ",";
                        data += reader["last_name"].ToString() + ",";
                        data += reader["date_of_birth"].ToString() + ",";
                        data += reader["phone"].ToString() + "&";

                    }
                    Helper_Classes_namespace.DataBaseHelperClass.ClosePerformQuery();
                    createDataSet(data);
                }
            }
            catch(Exception e)
            {

            }
        }
        private void save_Click(object sender, EventArgs e)
        {
            if(!_firstNameClass.testFirstName(first_name_txt.Text))return;
            if (!_lastNameClass.testLastName(last_name_txt.Text)) return;           
            if (!_dateOfBirth.testDate(date_of_birth_txt.Text))return;       
            age_txt_box.Text = _dateOfBirth.getAgeByBirthDate(date_of_birth_txt.Text);            
            if (!_phone.testPhoneFormat(phone_txt_box.Text))return;            
            string query = "SELECT * from credentials where first_name = '" + first_name_txt.Text
                            + "' AND last_name = '" + last_name_txt.Text
                            + "' AND date_of_birth = '" + date_of_birth_txt.Text +"'";
            
            SqlDataReader reader = Helper_Classes_namespace.DataBaseHelperClass.GlobalPerformQuery(query).ExecuteReader();
            if (reader == null)
                return;
            else if (reader.HasRows)
                query = "UPDATE credentials set first_name = '" + first_name_txt.Text
                            + "' ,last_name = '" + last_name_txt.Text
                            + "' ,date_of_birth = '" + date_of_birth_txt.Text
                            + "' ,phone = '" + phone_txt_box.Text
                            + "' where first_name = '" + first_name_txt.Text
                            + "' AND last_name = '" + last_name_txt.Text
                            + "' AND date_of_birth = '" + date_of_birth_txt.Text + "'";            
            else
               query = "INSERT INTO credentials(first_name,last_name,date_of_birth,phone) VALUES('" + first_name_txt.Text + "','" + last_name_txt.Text + "','" + date_of_birth_txt.Text + "','" + phone_txt_box.Text + "')";
            Helper_Classes_namespace.DataBaseHelperClass.ClosePerformQuery();
            Helper_Classes_namespace.DataBaseHelperClass.GlobalPerformQuery(query);
            Helper_Classes_namespace.DataBaseHelperClass.ClosePerformQuery();
            MessageBox.Show(" Field Inserted !!!!!!! ");
            selectAllFromDataSet();

        }

        private void dataGridView1_CellContentClick_1(object sender, DataGridViewCellEventArgs e)
        {
            
        }

        private void DataGridView1_CellContentClick_2(object sender, DataGridViewCellEventArgs e)
        {
            
        }
        private void DataGridView1_CellContentClick_3(object sender, DataGridViewCellEventArgs e)
        {
            setFocusOnTextBox();
            if (dataSet.Length <= e.RowIndex)
                return;
            ClearTextBox();
            dataSetView.CellClick -= DataGridView1_CellContentClick_3;
            selectedFromDatgaSet = true;
            string[] tempData = dataSet[e.RowIndex].ToString().Split(',');
            try
            {
                eventLogDisplay.Select(eventLogDisplay.Text.Length, 0);
                first_name_txt.Text = tempData[0];
                last_name_txt.Text = tempData[1];
                date_of_birth_txt.Text = tempData[2];
                phone_txt_box.Text = tempData[3];
                string fileName = @"../../../"+ tempData[0] + "_" + tempData[1] + "_" + tempData[2].Replace('/','-') +"_" + Helper_Classes_namespace.HelperClass.getSystemDateTime().ToLocalTime().ToString().Replace('/','-').Replace(' ','_').Replace(':','-') + ".txt";
                string contactInformation = "First Name : " + tempData[0] + "\n"
                                            + "Last Name : " + tempData[1] + "\n"
                                            + "Date Of Birth : " + tempData[2] + "\n"
                                            + "Phone :" + tempData[3];


                Helper_Classes_namespace.PerformWriteToFileAction.createPatientFile(fileName, contactInformation);
                string logEvent = " - created file ../../../" + tempData[0] + "_" + tempData[1] + "_" + tempData[2].Replace('/', '-') + ".txt on " + Helper_Classes_namespace.HelperClass.getSystemDateTime().ToLocalTime();
                eventLogDisplay.AppendText(logEvent);
                
                Helper_Classes_namespace.PerformWriteToFileAction.writeToLogFile(logEvent);
                dataSetView.DataSource = "";
                table = new DataTable();
                table.Columns.Add("Index", typeof(int));
                table.Columns.Add("First Name", typeof(string));
                table.Columns.Add("Last Name", typeof(string));
                table.Columns.Add("Date of Birth", typeof(string));
                table.Columns.Add("Phone", typeof(string));
                table.Rows.Add(0, tempData[0], tempData[1], tempData[2], tempData[3]).CancelEdit();
                dataSetView.DataSource = table;
            }
            catch (IndexOutOfRangeException mes)
            {

            }
        }

        private void eventLog1_EntryWritten(object sender, System.Diagnostics.EntryWrittenEventArgs e)
        {

        }
    }
}
