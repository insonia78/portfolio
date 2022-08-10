using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows;

namespace GameBoard
{
    public class Terrain
    {
        private ImageSource tileImage;

        //accessors/mutators

        public ImageSource terrainImage
        {
            get
            {
                return tileImage;
            }
            set 
            {
                tileImage = value;
            }
        }

        /*
         * Possibly temporary/test constructor for making a terrain object with a designated image depending on the number input from a file.
         */
        public Terrain(int tileType)
        {
            switch (tileType)
            {
                case 0: //for grass
                    tileImage = new BitmapImage(new Uri(".../.../Pictures/Board Pieces/grass.png", UriKind.Relative));
                    break;
                case 1: //for mountain
                    tileImage = new BitmapImage(new Uri(".../.../Pictures/Board Pieces/mountain.png", UriKind.Relative));
                    break;
                case 2: //for water
                    tileImage = new BitmapImage(new Uri(".../.../Pictures/Board Pieces/water.png", UriKind.Relative));
                    break;
                case 3: //for swamp
                    tileImage = new BitmapImage(new Uri(".../.../Pictures/Board Pieces/swamp.png", UriKind.Relative));
                    break;
                case 4: //for Tile_Color1
                    tileImage = new BitmapImage(new Uri(".../.../Pictures/Board Pieces/Tiles/Tile_Color1.png", UriKind.Relative));
                    break;
                case 5: //for Tile_Color2
                    tileImage = new BitmapImage(new Uri(".../.../Pictures/Board Pieces/Tiles/Tile_Color2.png", UriKind.Relative));
                    break;
                case 6: //for Tile_Color3
                    tileImage = new BitmapImage(new Uri(".../.../Pictures/Board Pieces/Tiles/Tile_Color3.png", UriKind.Relative));
                    break;
                case 7: //for Tile_Textured
                    tileImage = new BitmapImage(new Uri(".../.../Pictures/Board Pieces/Tiles/Tile_Textured.png", UriKind.Relative));
                    break;
                case 8: //for Tile_Texture2
                    tileImage = new BitmapImage(new Uri(".../.../Pictures/Board Pieces/Tiles/Tile_Texture2.png", UriKind.Relative));
                    break;
                case 9: //for Tile_Texture3
                    tileImage = new BitmapImage(new Uri(".../.../Pictures/Board Pieces/Tiles/Tile_Texture3.png", UriKind.Relative));
                    break;
                default:
                    tileImage = new BitmapImage(new Uri(".../.../Pictures/Board Pieces/grass.png", UriKind.Relative));
                    break;
            }
        }

        public void placeImageOver(ImageSource foregroundImage)
        {
            if(tileImage != null)
            {
                DrawingVisual dv = new DrawingVisual();
                DrawingContext dc = dv.RenderOpen();
                dc.DrawImage(tileImage, new Rect(new Size(tileImage.Width, tileImage.Height)));
                dc.DrawImage(foregroundImage, new Rect(new Size(tileImage.Width, tileImage.Height)));
                RenderTargetBitmap bmp = new RenderTargetBitmap((int)tileImage.Width, (int)tileImage.Height, 120, 96, PixelFormats.Pbgra32);
                dc.Close();
                bmp.Render(dv);

                tileImage = bmp;
            }
        }
    }
}
