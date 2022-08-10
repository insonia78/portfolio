using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Windows.Forms;
using System.IO;
namespace Helper_Classes_namespace
{
    
    public abstract class  DataBaseHelperClass
    {          
        public SqlCommand PerformQuery(string query)
        {
            SqlCommand command = new SqlCommand(query, SqlConnectionClass.getConn());
            SqlConnectionClass.getConn().Open();
            System.Data.ConnectionState state = SqlConnectionClass.getConn().State;
            if (!(state == System.Data.ConnectionState.Open))
            {
                MessageBox.Show(" Sorry no Db Connection !!!!!!! ");
                return null;
            }

            return command;
        }
        public static void SettingDbConnection(String connectionString)
        {
            SqlConnectionClass.setConn(connectionString);

        }
        public static SqlCommand GlobalPerformQuery(string query)
        {
            SqlCommand command = new SqlCommand(query, SqlConnectionClass.getConn());
            SqlConnectionClass.getConn().Open();
            System.Data.ConnectionState state = SqlConnectionClass.getConn().State;            
            if (!(state == System.Data.ConnectionState.Open))
            {
                MessageBox.Show(" Sorry no Db Connection !!!!!!! ");
                return null;
            }

            command.ExecuteNonQuery();
            return command;
        }
        public static void ClosePerformQuery()
        {            
            SqlConnectionClass.getConn().Close();            
        }
        private static  class SqlConnectionClass
        {

            static SqlConnection con = new SqlConnection();
            public static void setConn(String connectionString) {  con.ConnectionString = connectionString; }
            public static SqlConnection getConn() { return con; }            
        }
    }
    public static class PerformWriteToFileAction 
    {
        static System.IO.StreamWriter file = new System.IO.StreamWriter(@"../../../WriteLines2.txt", true);
        public static int createPatientFile(String filename,String data)
        {
            File.Create(filename).Dispose();
            using (TextWriter tw = new StreamWriter(filename))
            {
                tw.WriteLine(data);
                tw.Close();
            }
           
            return 1;
        }

        public static int writeToLogFile(String data)
        {
            string filePath = @"../../../logFile.txt";
            if (File.Exists(filePath))
            {
                using (StreamWriter sw = File.AppendText(filePath))
                {
                    sw.WriteLine(data);
                    sw.Close();
                }

            }
            else
            {
                File.Create(filePath).Dispose();
                using (TextWriter tw = new StreamWriter(filePath))
                {
                    tw.WriteLine(data);
                    tw.Close();
                }

            }
            
            return 1;
        }
    }
    public static class HelperClass    {
        
        private static int getDaysInaMonth(int month)
        {            
            return DateTime.DaysInMonth(getSystemDateTime().Year, month);
        }
        public static string getTotAge(string userDate,string systemDate)
        {
            string[] words = userDate.Split('/');
            int userYear = Int32.Parse(words[words.Length - 1]);
            int userMonth = Int32.Parse(words[words.Length - 3]);
            int userDay = Int32.Parse(words[words.Length - 2]);
            string[] words1 = systemDate.Split('/');
            int systemDateYear = Int32.Parse(words1[words.Length - 1]);
            int systemDateMonth = Int32.Parse(words1[words.Length - 3]);
            int systemDateDay = Int32.Parse(words1[words.Length - 2]);
            int totalDays = 0;
            
            for (int i = systemDateMonth; systemDateMonth > 0 && systemDateYear >= userYear;i--)
            {
                if (i == 0)
                {
                    i = 12;
                    systemDateYear--;
                }
                if (i == userMonth && systemDateYear == userYear)
                    break;                
                totalDays += getDaysInaMonth(i);
            }


            totalDays -= userDay;
            int remaning_days = totalDays % 7;
            int weeks = totalDays / 7;
            int totalYears = weeks / 52;
            int totalWeeks = weeks % 52;           
            return totalYears.ToString() + " years " + totalWeeks.ToString() + " weeks " + remaning_days.ToString() + " days ";
            
        }
        public static int getDaysUptoMonth(int month)
        {
            int totalDays = 0;
            for(int i = 1; i <= month;i++)
            {
                totalDays += getDaysInaMonth(i);
            }
            return totalDays;
        }
        public static DateTime getSystemDateTime()
        {
            DateTime UTCNow = DateTime.UtcNow;
            return UTCNow;
        }
        public static bool CompareDate(string date)
        {
            string[] words = date.Split('/');
            int userYear = Int32.Parse(words[words.Length - 1]);
            int userMonth = Int32.Parse(words[words.Length - 3]);
            int userDay = Int32.Parse(words[words.Length - 2]);
            if (getSystemDateTime().Year < userYear)
                return false;
            if(getSystemDateTime().Year == userYear)
            {
                if (getSystemDateTime().Month < userMonth)
                    return false;
                if(getSystemDateTime().Month == userMonth)
                {
                    if (getSystemDateTime().Day < userDay)
                        return false;
                }
            }
            return true;
        }
    }
}

