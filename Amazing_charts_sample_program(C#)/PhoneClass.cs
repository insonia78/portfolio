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
    class PhoneClass: Helper_Classes_namespace.DataBaseHelperClass
    {
        public PhoneClass() { }
        public void getPhoneNumberData(string data)
        {
            this.PerformQuery("");
        }
        public string PhoneNumber { get; set; }
        public bool testPhoneFormat(string phone)
        {
            if (phone == "")
            {
                MessageBox.Show("phone is empty");
                return false;
            }
            if (!Regex.Match(phone, @"^\d{3}-\d{3}-\d{4}$").Success)
            {
                MessageBox.Show("xxx-xxx-xxxx phone number format is invalid!!!!!!! ");
                return false;
            }
            return true;
        }
    }
}
