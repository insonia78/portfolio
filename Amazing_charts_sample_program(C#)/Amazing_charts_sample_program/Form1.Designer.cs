namespace Amazing_charts_sample_program
{
    partial class amazing_charts_sample_application
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.first_name_label = new System.Windows.Forms.Label();
            this.last_name_label = new System.Windows.Forms.Label();
            this.date_of_birth_label = new System.Windows.Forms.Label();
            this.phone_label = new System.Windows.Forms.Label();
            this.age_label = new System.Windows.Forms.Label();
            this.first_name_txt = new System.Windows.Forms.TextBox();
            this.last_name_txt = new System.Windows.Forms.TextBox();
            this.date_of_birth_txt = new System.Windows.Forms.TextBox();
            this.phone_txt_box = new System.Windows.Forms.TextBox();
            this.age_txt_box = new System.Windows.Forms.TextBox();
            this.save = new System.Windows.Forms.Button();
            this.dataSet1 = new System.Data.DataSet();
            this.dataSetView = new System.Windows.Forms.DataGridView();
            this.eventLog1 = new System.Diagnostics.EventLog();
            this.eventLogDisplay = new System.Windows.Forms.RichTextBox();
            this.performWriteToFileActionBindingSource = new System.Windows.Forms.BindingSource(this.components);
            ((System.ComponentModel.ISupportInitialize)(this.dataSet1)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.dataSetView)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.eventLog1)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.performWriteToFileActionBindingSource)).BeginInit();
            this.SuspendLayout();
            // 
            // first_name_label
            // 
            this.first_name_label.AutoSize = true;
            this.first_name_label.Location = new System.Drawing.Point(74, 65);
            this.first_name_label.Name = "first_name_label";
            this.first_name_label.Size = new System.Drawing.Size(57, 13);
            this.first_name_label.TabIndex = 0;
            this.first_name_label.Text = "First Name";
            // 
            // last_name_label
            // 
            this.last_name_label.AutoSize = true;
            this.last_name_label.Location = new System.Drawing.Point(255, 65);
            this.last_name_label.Name = "last_name_label";
            this.last_name_label.Size = new System.Drawing.Size(58, 13);
            this.last_name_label.TabIndex = 1;
            this.last_name_label.Text = "Last Name";
            // 
            // date_of_birth_label
            // 
            this.date_of_birth_label.AutoSize = true;
            this.date_of_birth_label.Location = new System.Drawing.Point(433, 65);
            this.date_of_birth_label.Name = "date_of_birth_label";
            this.date_of_birth_label.Size = new System.Drawing.Size(68, 13);
            this.date_of_birth_label.TabIndex = 2;
            this.date_of_birth_label.Text = "Date Of Birth";
            // 
            // phone_label
            // 
            this.phone_label.AutoSize = true;
            this.phone_label.Location = new System.Drawing.Point(618, 65);
            this.phone_label.Name = "phone_label";
            this.phone_label.Size = new System.Drawing.Size(38, 13);
            this.phone_label.TabIndex = 3;
            this.phone_label.Text = "Phone";
            // 
            // age_label
            // 
            this.age_label.AutoSize = true;
            this.age_label.Location = new System.Drawing.Point(788, 65);
            this.age_label.Name = "age_label";
            this.age_label.Size = new System.Drawing.Size(26, 13);
            this.age_label.TabIndex = 4;
            this.age_label.Text = "Age";
            // 
            // first_name_txt
            // 
            this.first_name_txt.Location = new System.Drawing.Point(37, 81);
            this.first_name_txt.Name = "first_name_txt";
            this.first_name_txt.Size = new System.Drawing.Size(137, 20);
            this.first_name_txt.TabIndex = 5;
            this.first_name_txt.TextChanged += new System.EventHandler(this.first_name_txt_TextChanged);
            // 
            // last_name_txt
            // 
            this.last_name_txt.Location = new System.Drawing.Point(219, 81);
            this.last_name_txt.Name = "last_name_txt";
            this.last_name_txt.Size = new System.Drawing.Size(137, 20);
            this.last_name_txt.TabIndex = 6;
            this.last_name_txt.TextChanged += new System.EventHandler(this.last_name_txt_TextChanged);
            // 
            // date_of_birth_txt
            // 
            this.date_of_birth_txt.Location = new System.Drawing.Point(401, 81);
            this.date_of_birth_txt.Name = "date_of_birth_txt";
            this.date_of_birth_txt.Size = new System.Drawing.Size(137, 20);
            this.date_of_birth_txt.TabIndex = 7;
            this.date_of_birth_txt.TextChanged += new System.EventHandler(this.date_of_birth_txt_TextChanged);
            // 
            // phone_txt_box
            // 
            this.phone_txt_box.Location = new System.Drawing.Point(575, 81);
            this.phone_txt_box.Name = "phone_txt_box";
            this.phone_txt_box.Size = new System.Drawing.Size(134, 20);
            this.phone_txt_box.TabIndex = 8;
            this.phone_txt_box.TextChanged += new System.EventHandler(this.phone_txt_box_TextChanged);
            // 
            // age_txt_box
            // 
            this.age_txt_box.Cursor = System.Windows.Forms.Cursors.No;
            this.age_txt_box.Enabled = false;
            this.age_txt_box.Location = new System.Drawing.Point(747, 81);
            this.age_txt_box.Name = "age_txt_box";
            this.age_txt_box.ReadOnly = true;
            this.age_txt_box.Size = new System.Drawing.Size(128, 20);
            this.age_txt_box.TabIndex = 9;
            this.age_txt_box.TextChanged += new System.EventHandler(this.age_txt_box_TextChanged);
            // 
            // save
            // 
            this.save.Location = new System.Drawing.Point(747, 164);
            this.save.Name = "save";
            this.save.Size = new System.Drawing.Size(75, 23);
            this.save.TabIndex = 12;
            this.save.Text = "Save";
            this.save.UseVisualStyleBackColor = true;
            this.save.Click += new System.EventHandler(this.save_Click);
            // 
            // dataSet1
            // 
            this.dataSet1.DataSetName = "NewDataSet";
            // 
            // dataSetView
            // 
            this.dataSetView.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dataSetView.Location = new System.Drawing.Point(37, 164);
            this.dataSetView.Name = "dataSetView";
            this.dataSetView.Size = new System.Drawing.Size(631, 261);
            this.dataSetView.TabIndex = 13;
            this.dataSetView.CellContentClick += new System.Windows.Forms.DataGridViewCellEventHandler(this.DataGridView1_CellContentClick_2);
            // 
            // eventLog1
            // 
            this.eventLog1.SynchronizingObject = this;
            this.eventLog1.EntryWritten += new System.Diagnostics.EntryWrittenEventHandler(this.eventLog1_EntryWritten);
            // 
            // eventLogDisplay
            // 
            this.eventLogDisplay.Location = new System.Drawing.Point(696, 226);
            this.eventLogDisplay.Name = "eventLogDisplay";
            this.eventLogDisplay.ReadOnly = true;
            this.eventLogDisplay.Size = new System.Drawing.Size(217, 185);
            this.eventLogDisplay.TabIndex = 15;
            this.eventLogDisplay.Text = "";
            // 
            // performWriteToFileActionBindingSource
            // 
            this.performWriteToFileActionBindingSource.DataSource = typeof(Helper_Classes_namespace.PerformWriteToFileAction);
            // 
            // amazing_charts_sample_application
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(925, 450);
            this.Controls.Add(this.eventLogDisplay);
            this.Controls.Add(this.dataSetView);
            this.Controls.Add(this.save);
            this.Controls.Add(this.age_txt_box);
            this.Controls.Add(this.phone_txt_box);
            this.Controls.Add(this.date_of_birth_txt);
            this.Controls.Add(this.last_name_txt);
            this.Controls.Add(this.first_name_txt);
            this.Controls.Add(this.age_label);
            this.Controls.Add(this.phone_label);
            this.Controls.Add(this.date_of_birth_label);
            this.Controls.Add(this.last_name_label);
            this.Controls.Add(this.first_name_label);
            this.DataBindings.Add(new System.Windows.Forms.Binding("Text", global::Amazing_charts_sample_program.Properties.Settings.Default, "Application", true, System.Windows.Forms.DataSourceUpdateMode.OnPropertyChanged));
            this.Name = "amazing_charts_sample_application";
            this.Text = global::Amazing_charts_sample_program.Properties.Settings.Default.Application;
            this.Load += new System.EventHandler(this.Form1_Load);
            ((System.ComponentModel.ISupportInitialize)(this.dataSet1)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.dataSetView)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.eventLog1)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.performWriteToFileActionBindingSource)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label first_name_label;
        private System.Windows.Forms.Label last_name_label;
        private System.Windows.Forms.Label date_of_birth_label;
        private System.Windows.Forms.Label phone_label;
        private System.Windows.Forms.Label age_label;
        private System.Windows.Forms.TextBox first_name_txt;
        private System.Windows.Forms.TextBox last_name_txt;
        private System.Windows.Forms.TextBox date_of_birth_txt;
        private System.Windows.Forms.TextBox phone_txt_box;
        private System.Windows.Forms.TextBox age_txt_box;
        private System.Windows.Forms.Button save;
        private System.Data.DataSet dataSet1;
        private System.Windows.Forms.BindingSource performWriteToFileActionBindingSource;
        private System.Windows.Forms.DataGridView dataSetView;
        private System.Diagnostics.EventLog eventLog1;
        private System.Windows.Forms.RichTextBox eventLogDisplay;
    }
}

