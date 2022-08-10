using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Helper_Classes_namespace;
using System.Data.SqlClient;
using System.Text.RegularExpressions;
using System.Windows.Forms;
namespace Amazing_charts_sample_program
{
    class DateOfBirth : Helper_Classes_namespace.DataBaseHelperClass
    {
        private string year;
        private string month;
        private string day;
        
        public DateOfBirth(){ }
        public string Date_Of_Birth { get; set; }
        public string getSystemDateTime()
        {           
            year = Helper_Classes_namespace.HelperClass.getSystemDateTime().Year.ToString();
            month = Helper_Classes_namespace.HelperClass.getSystemDateTime().Month.ToString();
            day = Helper_Classes_namespace.HelperClass.getSystemDateTime().Day.ToString();
            return "0"+ month + "/" + day + "/" + year;
        }
        public String getDateOfBirth(string date)
        {
            string query = "SELECT * from credentials where date_of_birth like '" + date + "%'";
            var response = this.PerformQuery(query);
            if (response == null) return null;
            SqlDataReader reader  = response.ExecuteReader();
            string data = "";
            while (reader.Read())
            {
                data += reader["first_name"].ToString() + ",";
                data += reader["last_name"].ToString() + ",";
                data += reader["date_of_birth"].ToString() + ",";
                data += reader["phone"].ToString() + "&";                
            }
            Helper_Classes_namespace.DataBaseHelperClass.ClosePerformQuery();
            return data;
        }
            
        public String getAgeByBirthDate(String date)
        {
            /*
            string systemFormat = getSystemDateTime();
            string[] words = date.Split('/');
            int userYear = Int32.Parse(words[words.Length - 1]);
            int userMonth = Int32.Parse(words[words.Length - 3]);
            int userDay = Int32.Parse(words[words.Length - 2]);
            int age = Int32.Parse(year) - userYear ;
            int currentTotaldays = Helper_Classes_namespace.HelperClass.getDaysUptoMonth(Int32.Parse(month));
            int userTotalDay = Helper_Classes_namespace.HelperClass.getDaysUptoMonth(userMonth);
            int differnce_of_day = ((currentTotaldays - userTotalDay) > 0 ? (currentTotaldays - userTotalDay) : ((currentTotaldays - userTotalDay) * -1));
            int remaning_days = differnce_of_day % 7;
            int weeks = differnce_of_day / 7;
            int totalDays = ((userDay - Int32.Parse(day)) > 0 ? (userDay - Int32.Parse(day)) : ((userDay - Int32.Parse(day)) * -1)) + remaning_days;
            weeks += (totalDays / 7);
            totalDays = totalDays % 7;
            */
            

            return Helper_Classes_namespace.HelperClass.getTotAge(date, getSystemDateTime());            
        }
        public bool testDate(string date)
        {
            if (date == "")
            {
                MessageBox.Show("Date of birth is empty");
                return false;
            }
            if (!Regex.Match(date, @"\d{2}/\d{2}/\d{4}").Success)
            {
                MessageBox.Show("mm/dd/yyyy Invalid birth format ");
                return false;
            }
            if (!Helper_Classes_namespace.HelperClass.CompareDate(date))
            {
                MessageBox.Show(" Invalid birth range date is over current date");
                return false;
            }
            try
            {
                DateTime dt = DateTime.Parse(date);
            }
            catch
            {
                MessageBox.Show(" Invalid birth format range");
                return false;
            }
            return true;
        }

    }
}
