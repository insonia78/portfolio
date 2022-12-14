USE [Amazing_charts_sample_program]
GO
/****** Object:  Table [dbo].[credentials]    Script Date: 5/1/2018 4:43:45 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[credentials](
	[tab_index] [int] IDENTITY(1,1) NOT NULL,
	[first_name] [varchar](max) NULL,
	[last_name] [varchar](max) NULL,
	[date_of_birth] [varchar](max) NULL,
	[phone] [varchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[tab_index] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
