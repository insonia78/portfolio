using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
// helper namespace
using Helper_Classes_namespace;
using System.Text.RegularExpressions;
using System.Windows.Forms;
namespace Amazing_charts_sample_program
{
    class FirstNameClass : Helper_Classes_namespace.DataBaseHelperClass
    {
        public FirstNameClass() { }
        public string FirstName { get; set; }
        public string getFirstName(String firstName)
        {
            string query = "SELECT * from credentials where first_name  like '" + firstName + "%'";
            var response = this.PerformQuery(query);
            if (response == null) return null;
            SqlDataReader reader = response.ExecuteReader();
            string data = "";
            while (reader.Read())
            {
                data += reader["first_name"].ToString()+",";
                data += reader["last_name"].ToString()+",";
                data += reader["date_of_birth"].ToString()+",";
                data += reader["phone"].ToString()+"&";
               
            }
            Helper_Classes_namespace.DataBaseHelperClass.ClosePerformQuery();
            return data;

        }
        public bool testFirstName(string  firstName)
        {
            if (firstName == "")
            {
                MessageBox.Show("firstName is empty");
                return false;
            }
            if (!Regex.Match(firstName, @"^[a-zA-Z'.]{1,40}$").Success)
            {
                MessageBox.Show("Invalid first name");
                return false;
            }
            return true;
        }

    }
}
