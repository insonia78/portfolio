using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Xml;
using Helper_Classes_namespace;
namespace Amazing_charts_sample_program
{
    static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        [STAThread]
        static void Main()
        {
            try
            {
                setUpDbConnection();
                Application.EnableVisualStyles();
                Application.SetCompatibleTextRenderingDefault(false);
                Application.Run(new amazing_charts_sample_application());
            }
            catch(Exception e)
            {

            }
        }
        static void setUpDbConnection()
        {
            String configurationString = "";
            XmlDocument doc = new XmlDocument();
            doc.Load("../../databaseconf.xml");
            foreach (XmlNode _node in doc.DocumentElement.ChildNodes)
            {
                configurationString += _node.InnerText;
                configurationString += ";";
            }
            Console.WriteLine(configurationString);
            Helper_Classes_namespace.DataBaseHelperClass.SettingDbConnection(configurationString);
        }
    }
}
