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
    
    class LastNameClass: Helper_Classes_namespace.DataBaseHelperClass
    {

        public LastNameClass() { } 
        public string LastName { get; set; }
        public string getLastName(string lastName)
        {
            string query = "SELECT * from credentials where last_name  like '" + lastName + "%'";
            var response = this.PerformQuery(query);
            if (response == null) return null;
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
            return data;
        }
    
        public bool testLastName(string lastName)
        {
            if (lastName == "")
            {
                MessageBox.Show("Last Name is empty");
                return false;
            }
            if (!Regex.Match(lastName, @"^[a-zA-Z'.]{1,40}$").Success)
            {
                MessageBox.Show(" Invalid last name ");
                return false;
            }
            return true;
        }
    }
}
