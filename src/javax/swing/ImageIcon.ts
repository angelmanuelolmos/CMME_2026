
import {Image } from '../../java/awt/Image'; 
import {URL } from '../../java/net/URL'; 

import {Icon } from './Icon'; 
import { Resources } from '../../Util/Resources';
import { BufferedImage } from '../../java/awt/image/BufferedImage';
export class ImageIcon implements Icon
{ 
	public constructor (arg0: URL ); 
	public constructor (arg0: Image ); 
	public constructor (arg0: any ) 
	{ 
		if( arg0 instanceof Image )
			this.setImage(arg0);

		else if( arg0 instanceof URL)
		{
			
			this.image = new BufferedImage(Resources.ensureResource(arg0 as URL)._content as HTMLImageElement);
		}

		else
		{
			debugger;
		}
	
	} 

	private image:Image = null;
	
	public getImage ( ): Image 
	{ 
		return this.image;
	} 
	
	public setImage(image:Image):void
	{
		this.image = image;
	}
	
} 

