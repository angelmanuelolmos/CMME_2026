
import {URL } from '../../java/net/URL'; 

import {BufferedImage } from '../../java/awt/image/BufferedImage'; 

import {File } from '../../java/io/File'; 

import { Resources } from '../../Util/Resources';
export class ImageIO 
{ 
	public static write (arg0: any ,arg1: string ,arg2: File ): boolean 
	{ 
		throw new Error("Not Implemented"); 
	} 
	
	public static read (arg0: URL ): BufferedImage 
	{ 
		var res:any = Resources.ensureResource(arg0)._content;

		if( res === undefined || !(res instanceof HTMLImageElement))

			throw new Error("Not Implemented"); 

		var img:HTMLImageElement = res;

		var bi:BufferedImage = new BufferedImage(img.naturalWidth, img.naturalHeight, 0);
		const ctx = bi.canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);
		return bi;
	} 
	
	
} 

