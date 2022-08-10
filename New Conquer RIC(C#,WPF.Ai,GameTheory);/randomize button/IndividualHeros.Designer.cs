namespace randomize_button
{
    partial class IndividualHeros
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(IndividualHeros));
            this.AcceptIndividual = new System.Windows.Forms.Button();
            this.warriorHero = new System.Windows.Forms.Button();
            this.hunterHero = new System.Windows.Forms.Button();
            this.healerHero = new System.Windows.Forms.Button();
            this.mageHero = new System.Windows.Forms.Button();
            this.rogueHero = new System.Windows.Forms.Button();
            this.Hero_choices = new System.Windows.Forms.Label();
            this.heroDescription = new System.Windows.Forms.TextBox();
            this.heroNameChoices = new System.Windows.Forms.Label();
            this.hero_gender_choices = new System.Windows.Forms.Label();
            this.maleChoice = new System.Windows.Forms.Button();
            this.femaleChoice = new System.Windows.Forms.Button();
            this.pictureBox1 = new System.Windows.Forms.PictureBox();
            this.textBox1 = new System.Windows.Forms.TextBox();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).BeginInit();
            this.SuspendLayout();
            // 
            // AcceptIndividual
            // 
            this.AcceptIndividual.Location = new System.Drawing.Point(620, 409);
            this.AcceptIndividual.Name = "AcceptIndividual";
            this.AcceptIndividual.Size = new System.Drawing.Size(129, 23);
            this.AcceptIndividual.TabIndex = 0;
            this.AcceptIndividual.Text = "Accept Changes";
            this.AcceptIndividual.UseVisualStyleBackColor = true;
            this.AcceptIndividual.Click += new System.EventHandler(this.button1_Click);
            // 
            // warriorHero
            // 
            this.warriorHero.Location = new System.Drawing.Point(170, 330);
            this.warriorHero.Name = "warriorHero";
            this.warriorHero.Size = new System.Drawing.Size(75, 23);
            this.warriorHero.TabIndex = 1;
            this.warriorHero.Text = "Warrior";
            this.warriorHero.UseVisualStyleBackColor = true;
            this.warriorHero.Click += new System.EventHandler(this.warriorHero_Click);
            // 
            // hunterHero
            // 
            this.hunterHero.Location = new System.Drawing.Point(275, 330);
            this.hunterHero.Name = "hunterHero";
            this.hunterHero.Size = new System.Drawing.Size(75, 23);
            this.hunterHero.TabIndex = 2;
            this.hunterHero.Text = "Hunter";
            this.hunterHero.UseVisualStyleBackColor = true;
            this.hunterHero.Click += new System.EventHandler(this.hunterHero_Click);
            // 
            // healerHero
            // 
            this.healerHero.Location = new System.Drawing.Point(384, 330);
            this.healerHero.Name = "healerHero";
            this.healerHero.Size = new System.Drawing.Size(75, 23);
            this.healerHero.TabIndex = 3;
            this.healerHero.Text = "Healer";
            this.healerHero.UseVisualStyleBackColor = true;
            this.healerHero.Click += new System.EventHandler(this.healerHero_Click);
            // 
            // mageHero
            // 
            this.mageHero.Location = new System.Drawing.Point(485, 330);
            this.mageHero.Name = "mageHero";
            this.mageHero.Size = new System.Drawing.Size(75, 23);
            this.mageHero.TabIndex = 4;
            this.mageHero.Text = "Mage";
            this.mageHero.UseVisualStyleBackColor = true;
            this.mageHero.Click += new System.EventHandler(this.mageHero_Click);
            // 
            // rogueHero
            // 
            this.rogueHero.Location = new System.Drawing.Point(594, 330);
            this.rogueHero.Name = "rogueHero";
            this.rogueHero.Size = new System.Drawing.Size(75, 23);
            this.rogueHero.TabIndex = 5;
            this.rogueHero.Text = "Rogue";
            this.rogueHero.UseVisualStyleBackColor = true;
            this.rogueHero.Click += new System.EventHandler(this.rogueHero_Click);
            // 
            // Hero_choices
            // 
            this.Hero_choices.AutoSize = true;
            this.Hero_choices.BackColor = System.Drawing.Color.Aqua;
            this.Hero_choices.Location = new System.Drawing.Point(31, 335);
            this.Hero_choices.Name = "Hero_choices";
            this.Hero_choices.Size = new System.Drawing.Size(69, 13);
            this.Hero_choices.TabIndex = 6;
            this.Hero_choices.Text = "Hero Classes";
            // 
            // heroDescription
            // 
            this.heroDescription.Location = new System.Drawing.Point(594, 46);
            this.heroDescription.Multiline = true;
            this.heroDescription.Name = "heroDescription";
            this.heroDescription.ReadOnly = true;
            this.heroDescription.Size = new System.Drawing.Size(154, 255);
            this.heroDescription.TabIndex = 7;
            this.heroDescription.Visible = false;
            
            // 
            // heroNameChoices
            // 
            this.heroNameChoices.AutoSize = true;
            this.heroNameChoices.BackColor = System.Drawing.Color.Aqua;
            this.heroNameChoices.Location = new System.Drawing.Point(34, 62);
            this.heroNameChoices.Name = "heroNameChoices";
            this.heroNameChoices.Size = new System.Drawing.Size(66, 13);
            this.heroNameChoices.TabIndex = 8;
            this.heroNameChoices.Text = "Hero Names";
            // 
            // hero_gender_choices
            // 
            this.hero_gender_choices.AutoSize = true;
            this.hero_gender_choices.BackColor = System.Drawing.Color.Aqua;
            this.hero_gender_choices.Location = new System.Drawing.Point(31, 249);
            this.hero_gender_choices.Name = "hero_gender_choices";
            this.hero_gender_choices.Size = new System.Drawing.Size(68, 13);
            this.hero_gender_choices.TabIndex = 9;
            this.hero_gender_choices.Text = "Hero Gender";
            // 
            // maleChoice
            // 
            this.maleChoice.Location = new System.Drawing.Point(122, 238);
            this.maleChoice.Name = "maleChoice";
            this.maleChoice.Size = new System.Drawing.Size(75, 24);
            this.maleChoice.TabIndex = 10;
            this.maleChoice.Text = "Male";
            this.maleChoice.UseVisualStyleBackColor = true;
            this.maleChoice.Click += new System.EventHandler(this.maleChoice_Click);
            // 
            // femaleChoice
            // 
            this.femaleChoice.Location = new System.Drawing.Point(227, 238);
            this.femaleChoice.Name = "femaleChoice";
            this.femaleChoice.Size = new System.Drawing.Size(75, 24);
            this.femaleChoice.TabIndex = 11;
            this.femaleChoice.Text = "Female";
            this.femaleChoice.UseVisualStyleBackColor = true;
            this.femaleChoice.Click += new System.EventHandler(this.femaleChoice_Click);
            // 
            // pictureBox1
            // 
            this.pictureBox1.Image = ((System.Drawing.Image)(resources.GetObject("pictureBox1.Image")));
            this.pictureBox1.Location = new System.Drawing.Point(332, 46);
            this.pictureBox1.Name = "pictureBox1";
            this.pictureBox1.Size = new System.Drawing.Size(193, 255);
            this.pictureBox1.TabIndex = 12;
            this.pictureBox1.TabStop = false;
            // 
            // textBox1
            // 
            this.textBox1.Location = new System.Drawing.Point(138, 55);
            this.textBox1.Name = "textBox1";
            this.textBox1.Size = new System.Drawing.Size(164, 20);
            this.textBox1.TabIndex = 13;
            
            // 
            // IndividualHeros
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(784, 462);
            this.Controls.Add(this.textBox1);
            this.Controls.Add(this.pictureBox1);
            this.Controls.Add(this.femaleChoice);
            this.Controls.Add(this.maleChoice);
            this.Controls.Add(this.hero_gender_choices);
            this.Controls.Add(this.heroNameChoices);
            this.Controls.Add(this.heroDescription);
            this.Controls.Add(this.Hero_choices);
            this.Controls.Add(this.rogueHero);
            this.Controls.Add(this.mageHero);
            this.Controls.Add(this.healerHero);
            this.Controls.Add(this.hunterHero);
            this.Controls.Add(this.warriorHero);
            this.Controls.Add(this.AcceptIndividual);
            this.Name = "IndividualHeros";
            this.ShowIcon = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Character Creation";
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button AcceptIndividual;
        private System.Windows.Forms.Button warriorHero;
        private System.Windows.Forms.Button hunterHero;
        private System.Windows.Forms.Button healerHero;
        private System.Windows.Forms.Button mageHero;
        private System.Windows.Forms.Button rogueHero;
        private System.Windows.Forms.Label Hero_choices;
        private System.Windows.Forms.TextBox heroDescription;
        private System.Windows.Forms.Label heroNameChoices;
        private System.Windows.Forms.Label hero_gender_choices;
        private System.Windows.Forms.Button maleChoice;
        private System.Windows.Forms.Button femaleChoice;
        private System.Windows.Forms.PictureBox pictureBox1;
        private System.Windows.Forms.TextBox textBox1;
    }
}